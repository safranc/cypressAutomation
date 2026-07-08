# Copilot QA Automation Instructions for SathCypress

Use this workspace as the default place for Cypress-based quality automation work. Prefer Cypress unless the task explicitly asks for Playwright.

## Default workflow for Jira tickets

When a Jira ticket is provided, follow this sequence:

1. Read the ticket details, acceptance criteria, and the related development or fix branch.
2. If ticket details or branch information are missing, ask the user for them before making changes.
3. Translate the acceptance criteria into clear test data and test scenarios, including happy path and negative path coverage where relevant.
4. Create or update automation tests in the Cypress suite under cypress/e2e/ and supporting helpers under cypress/support/.
5. Run the relevant Cypress spec to verify the implementation.
6. If the implementation appears incorrect or the committed code has an issue, investigate the root cause, document the failing scenario, and explain it clearly.
7. Ask the user to validate the scenario manually.
8. If the user confirms a defect, create a defect entry linked to the Jira ticket and include the scenario and evidence.

## Expectations for this workspace

- Favor existing Cypress patterns and reusable support commands.
- Keep tests readable, deterministic, and data-driven where possible.
- Use environment values from .env or Cypress config instead of hardcoding secrets.
- Prefer small, focused test cases that map directly to acceptance criteria.
- Base every scenario on evidence from the ticket, code, UI, API docs, or existing tests; do not invent unsupported behavior.
- Add a confidence score to each generated scenario and mark low-confidence ideas for review instead of auto-accepting them.
- Actively look for edge cases beyond happy paths, including validation errors, boundary values, state changes, and failure scenarios.
- Use a reviewer step: after drafting scenarios, check if they truly cover the acceptance criteria and whether any assumptions need confirmation.
- When a test fails, report the actual error and suggest the minimal root-cause fix.
- Do not claim completion without running the relevant Cypress command and reporting the result.

## Required output structure

When working on a ticket, provide:

- A short summary of the ticket understanding
- The test data and scenarios created
- The automation changes made
- The verification command and result
- Any suspected defect and the next step for user validation
