# Technical Explanation

This document explains FlowPilot AI in interview-ready language.

## 1. Retrieval

FlowPilot stores business policy content in a local knowledge base. For the MVP, retrieval uses TF-IDF matching over the stored documents. When a customer issue arrives, the backend compares the message against indexed policy text and returns the most relevant snippets.

Grounding matters because support automation should not invent policy. Refund, pricing, onboarding, and escalation answers need to reference the business context that actually exists.

## 2. Routing

Routing is based on three signals:

- detected intent
- confidence score
- customer risk language

For example, a refund case is routed to ticket creation because billing validation is required. A support issue with escalation wording is routed to a human owner. A pricing inquiry is routed to sales follow-up.

## 3. Orchestration

FlowPilot is a workflow engine because it does more than generate a response. It turns an issue into an operational record with:

- intent
- retrieved context
- confidence
- workflow action
- owner
- priority
- ticket ID
- dashboard activity

That makes the output useful for business operations, not just conversation.

## 4. Escalation Logic

Cases are escalated when risk language appears or automation confidence is low. Risk terms include signals such as escalation, churn, legal concern, outage, or repeated failure.

The goal is not to automate everything. The goal is to automate safe work and expose risky work quickly.

## 5. Confidence Scoring

The confidence score is used as a guardrail. Higher confidence can support auto-resolution or structured follow-up. Lower confidence pushes the case toward human review.

This avoids blind automation and makes the workflow decision easier to explain.

## 6. Workflow Replay

The Live Workflow Replay shows the decision path step by step. It helps with trust and auditability because a judge or operator can see:

- what was received
- how it was classified
- which sources were retrieved
- what decision was generated
- why a route was selected
- how the ticket and dashboard were updated

This is the key distinction from a chatbot. The replay makes the business workflow visible.
