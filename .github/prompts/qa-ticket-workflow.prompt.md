---
mode: ask
description: "Use this prompt for Jira-driven QA automation work in the SathCypress workspace."
---

Review the provided Jira ticket, acceptance criteria, and related branch or implementation context.

Then:
1. Summarize the ticket in plain language.
2. Create or refine test data and test scenarios for SDET validation.
3. Implement or update Cypress automation under cypress/e2e/ and supporting files under cypress/support/.
4. Run the relevant Cypress spec and report the result.
5. If the implementation appears broken, identify the likely issue and the test scenario that exposes it.
6. Ask the user to validate the scenario manually.
7. If the user confirms a defect, create a defect entry linked to the Jira ticket with evidence.
