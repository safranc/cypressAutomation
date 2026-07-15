# AI Test Automation Framework

This folder now includes a lightweight AI evaluation flow for Cypress.

## Components
- Prompt repository: fixtures/llm-prompts.json
- Evaluation engine: scripts/llm-eval.js
- Retrieval context: scripts/rag-context.js
- Cypress integration: cypress/e2e/ai-evaluation.cy.js

## Run locally
```bash
npm run llm:eval
npm run rag:context "checkout"
npx cypress run --spec "cypress/e2e/ai-evaluation.cy.js"
```

## CI idea
- Run Cypress in Jenkins or GitHub Actions
- Publish reports from reports/llm-eval.json
- Fail the build when scores fall below the configured threshold
