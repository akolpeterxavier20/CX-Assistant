import express from "express";
import { classifyCustomerMessage } from "../services/aiService.js";
import {
  findWorkflowById,
  findWorkflowByIntent,
  getKnowledgeSummary,
  isLikelyWorkflowRequest
} from "../services/knowledgeService.js";

const router = express.Router();

const FALLBACK_MESSAGE = "I'd be happy to help. Could you tell me a little more about what you need?";
const ERROR_MESSAGE = "Sorry, I'm having trouble processing that right now. Please try again.";

router.post("/", async (req, res) => {
  const message = sanitizeMessage(req.body?.message);
  const conversation = sanitizeConversation(req.body?.conversation);

  if (!message) {
    return res.status(400).json({
      message: "Please enter a message so I can help.",
      workflow: null
    });
  }

  // Handle simple greetings: respond once with a brief greeting and prompt
  if (/^\s*(hi|hello|hey|good morning|good afternoon|good evening)\b/i.test(message)) {
    return res.json({ message: "Hello 🙂 How can I help you today?", workflow: null });
  }

  if (isUnsupportedUrlRequest(message) || isKnownUnsupportedWorkflow(message)) {
    return res.json({
      message: "CX does not currently have that information in the approved knowledge base.",
      workflow: null
    });
  }

  let classification;

  try {
    classification = await classifyCustomerMessage({
      message,
      conversation,
      knowledgeSummary: getKnowledgeSummary()
    });
  } catch (error) {
    console.error("AI classification failed:", error);
    return res.status(503).json({ message: ERROR_MESSAGE, workflow: null });
  }

  const proposedWorkflow =
    classification.workflow_id ? findWorkflowById(classification.workflow_id) : null;
  const intentWorkflow =
    !proposedWorkflow && classification.intent
      ? findWorkflowByIntent(classification.intent)
      : null;
  const confirmedWorkflow = getConfirmedWorkflow(message, conversation);

  // Build simple candidate list from knowledge summary using keyword matching
  const summary = getKnowledgeSummary();
  const text = message.toLowerCase();
  const candidates = summary.filter((item) =>
    Array.isArray(item.keywords) &&
    item.keywords.some((kw) => typeof kw === "string" && text.includes(kw.toLowerCase()))
  );

  // Resolve workflows from candidates (map to full workflow objects)
  const candidateWorkflows = candidates
    .map((c) => findWorkflowById(c.workflow_id))
    .filter(Boolean);

  // CLEAR MATCH: confirmed or high-confidence classification pointing to a valid workflow
  const workflow = proposedWorkflow || intentWorkflow || (candidateWorkflows.length === 1 ? candidateWorkflows[0] : null) || confirmedWorkflow;

  if (workflow && (confirmedWorkflow || (classification.confidence >= 0.75 && !classification.needs_clarification))) {
    return res.json({ message: workflow.approved_response, workflow: toClientWorkflow(workflow) });
  }

  // AMBIGUOUS MATCH: only when there are candidate workflows
  if (candidateWorkflows.length > 1) {
    // Multiple possible workflows — ask a targeted question (use first candidate's question when available)
    const titles = candidateWorkflows.map((w) => w.title).filter(Boolean);
    const pick = candidateWorkflows[0];
    const question = pick?.customer_questions?.[0] || `Did you mean ${titles.join(" or ")}?`;
    return res.json({ message: question, workflow: null });
  }

  // Single candidate but low confidence or AI asked for clarification -> ask the workflow's clarifying question
  if (candidateWorkflows.length === 1 && (classification.needs_clarification || classification.confidence < 0.75)) {
    const pick = candidateWorkflows[0];
    const question = pick.customer_questions?.[0] || "Can you confirm which of these you mean?";
    return res.json({ message: question, workflow: null });
  }

  // NO MATCH: explicitly state we don't have a workflow and list available workflows
  const available = summary.map((s) => s.title).filter(Boolean);
  if (available.length) {
    const list = available.join(", ");
    return res.json({
      message: `I don't have a way to help with that here. I can help with ${list} — is one of those what you need?`,
      workflow: null
    });
  }

  // Fallback
  return res.json({ message: classification.message || FALLBACK_MESSAGE, workflow: null });
});

function sanitizeMessage(value) {
  if (typeof value !== "string") return "";
  return value.replace(/\s+/g, " ").trim().slice(0, 1000);
}

function sanitizeConversation(value) {
  if (!Array.isArray(value)) return [];

  return value
    .slice(-8)
    .map((entry) => ({
      role: entry?.role === "assistant" ? "assistant" : "user",
      content: sanitizeMessage(entry?.content || "")
    }))
    .filter((entry) => entry.content);
}

function toClientWorkflow(workflow) {
  return {
    id: workflow.workflow_id,
    title: workflow.title,
    action: {
      label: workflow.action.label,
      url: workflow.action.url
    }
  };
}

function getConfirmedWorkflow(message, conversation) {
  if (!/^(yes|yeah|yep|sure|ok|okay|please|proceed)$/i.test(message)) return null;

  const lastAssistantMessage = [...conversation].reverse().find((entry) => entry.role === "assistant");
  if (!lastAssistantMessage) return null;

  if (/new bike on loan|bike loan application/i.test(lastAssistantMessage.content)) {
    return findWorkflowById("union_new_bike_loan");
  }

  return null;
}

function isUnsupportedUrlRequest(message) {
  const text = message.toLowerCase();
  const asksForUrl = /\b(url|link|website|site|web address|contact)\b/.test(text);
  const mentionsLoanWorkflow = /\b(loan|credit|financing|finance|application|apply|bike|motorcycle)\b/.test(text);

  return asksForUrl && !mentionsLoanWorkflow;
}

function isKnownUnsupportedWorkflow(message) {
  const text = message.toLowerCase();
  return /\b(repair|repairs|service|servicing|fix|maintenance)\b/.test(text) &&
    /\b(bike|motorcycle|motorcycles)\b/.test(text);
}

export default router;
