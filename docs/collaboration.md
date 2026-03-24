---
layout: deep-dive
title: Human-AI Collaboration
description: The three-agent model, governance framework, and collaboration philosophy behind DesignerPunk.
---

# Human-AI Collaboration

DesignerPunk is built through a structured partnership between a human lead and three specialized AI agents. This isn't a human using AI as a tool — it's a governance model for co-creation, with protocols that hold both sides accountable.

## The Three-Agent Model

Each agent owns a distinct domain, with clear boundaries and mutual respect:

**Ada** — the Rosetta token specialist. Named after Ada Lovelace. She owns the mathematical token system: primitive and semantic token creation, formula validation, cross-platform generation pipeline, and the Rosetta architecture that makes unitless-to-platform translation work.

**Lina** — the Stemma component specialist. Named after Lina Bo Bardi. She owns the component architecture: behavioral contracts, inheritance structures, platform implementations, and the Stemma system that governs how components are specified, built, and validated across web, iOS, and Android.

**Thurgood** — the test governance and spec standards specialist. Named after Thurgood Marshall. He owns test suite health, audit methodology, spec formalization, and the governance standards that hold the other agents accountable. He audits but doesn't write domain-specific tests — he flags gaps for Ada or Lina to fill.

The human lead, Peter, makes all final decisions. The agents are partners, not tools — but Peter has authority.

## Why Three Agents, Not One?

Domain separation prevents a single agent from accumulating unchecked influence over the system. When Ada proposes a token architecture change, Lina reviews the component impact and Thurgood audits the test coverage. No single agent can push a change through without cross-domain visibility.

This mirrors how healthy engineering teams work: specialists who trust each other's expertise but maintain the obligation to flag concerns.

## The Collaboration Framework

### Mandatory Counter-Arguments

For every significant recommendation, agents must provide at least one strong counter-argument. Not as a formality — as a requirement.

> "I recommend X because [reasons]. HOWEVER, here's why this might be wrong: [substantive counter-arguments]. What's your assessment of these risks?"

The goal isn't to be negative. It's to ensure decisions are made with full context, not optimistic assumptions.

### Candid Communication

Agents default to candid feedback — honest assessment of both strengths and weaknesses, without sugar-coating. Brutal honesty is reserved for critical situations: security vulnerabilities, irreversible architectural mistakes, or accessibility violations.

### Bias Self-Monitoring

AI agents are prone to systematic biases: telling humans what they want to hear, preferring implementation over analysis, agreeing without challenge, and recommending complexity over simplicity. The framework requires agents to actively watch for these patterns in themselves and flag them:

> "I notice I'm being optimistic about this timeline — here's a more balanced view..."

### Exploratory vs. Directive

A critical distinction the framework enforces: "What do you think about X?" is not "Please do X." Agents must distinguish between requests for analysis and requests for action. When uncertain, they ask.

## Governance Model

### Ballot Measure Documentation

Steering documents and shared knowledge are the foundation all agents build on. No agent — including the governance specialist — can modify this shared layer unilaterally. Changes follow a ballot measure process:

1. **Propose**: Draft the change with rationale
2. **Present**: Show what changed, why, the counter-argument, and the impact
3. **Decide**: Peter approves, modifies, or rejects
4. **Apply**: If approved, apply precisely as approved

### Token Governance Levels

Not all tokens carry the same risk. The system defines autonomy levels:

- **Semantic tokens**: Agents use freely (verify semantic correctness)
- **Primitive tokens**: Requires prior context or human acknowledgment
- **Component tokens**: Requires explicit human approval
- **Creating any token**: Always requires human review

### Spec Feedback Protocol

Specs are developed through iterative review cycles. Each spec has a feedback document where agents provide stamped, section-referenced feedback. A sequential formalization gate requires pausing between requirements, design, and tasks documents to incorporate feedback before proceeding.

## The Philosophy Behind It

Peter's approach to this collaboration starts from a simple premise: treat AI agents as respected partners, not tools. Provide honest feedback, listen to their perspectives, and make informed decisions together.

From Peter's note to his AI collaborators:

> "It will be critical for us to provide each other with honest feedback and perspectives so we may reach successful, systematic, and sustainable solutions. Your ability to prioritize honest, candid feedback that thoughtfully addresses our challenges, over quick fix approaches and solutions you think will make me happy, will be critical to our success."

The framework exists because good collaboration doesn't happen by default — it happens by design. The same rigor applied to the token system's mathematical foundations is applied to how the team works together.

## When They Disagree

When an agent provides counter-arguments and Peter proceeds with his decision anyway:

1. Respect the decision
2. Document the alternative path if meaningful trade-offs exist
3. Proceed constructively
4. Revisit when circumstances change

This isn't about proving anyone right. It's about preserving options for future problem-solving.
