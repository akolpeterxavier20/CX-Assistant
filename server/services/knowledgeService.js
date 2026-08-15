import { readFileSync } from "fs";

let knowledge;

function loadKnowledge() {
  if (knowledge) return knowledge;

  try {
    const raw = readFileSync(new URL("../knowledge/knowledge.json", import.meta.url), "utf8");
    knowledge = JSON.parse(raw);
    return knowledge;
  } catch (error) {
    console.error("Failed to load knowledge base:", error);
    throw error;
  }
}

export function getKnowledgeSummary() {
  const kb = loadKnowledge();

  return kb.companies.flatMap((company) =>
    company.workflows.map((workflow) => ({
      company_id: company.company_id,
      company_name: company.company_name,
      workflow_id: workflow.workflow_id,
      intent: workflow.intent,
      title: workflow.title,
      description: workflow.description,
      keywords: workflow.keywords,
      customer_questions: workflow.customer_questions
    }))
  );
}

export function findWorkflowById(workflowId) {
  if (!workflowId) return null;

  const kb = loadKnowledge();
  for (const company of kb.companies) {
    const workflow = company.workflows.find((item) => item.workflow_id === workflowId);
    if (workflow) return workflow;
  }

  return null;
}

export function findWorkflowByIntent(intent) {
  if (!intent || intent === "unknown") return null;

  const kb = loadKnowledge();
  for (const company of kb.companies) {
    const workflow = company.workflows.find((item) => item.intent === intent);
    if (workflow) return workflow;
  }

  return null;
}

export function isLikelyWorkflowRequest(message) {
  const normalizedMessage = normalize(message);
  const kb = loadKnowledge();

  return kb.companies.some((company) =>
    company.workflows.some((workflow) => {
      const mentionsBike = /\b(bike|motorcycle)\b/.test(normalizedMessage);
      const mentionsLoan = /\b(loan|credit|financing|finance|apply|application)\b/.test(normalizedMessage);
      const asksToGetBike = /\b(want|need|get|buy)\b/.test(normalizedMessage) && mentionsBike;

      return workflow.keywords.some((keyword) => normalizedMessage.includes(normalize(keyword))) ||
        (mentionsBike && mentionsLoan) ||
        asksToGetBike;
    })
  );
}

function normalize(value) {
  return String(value || "").toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
}
