# SathCypress

This project uses Cypress to test the Sauce Demo login flow for multiple user accounts.

## Prerequisites

- Node.js installed (v20.19.0 recommended)
- npm installed
- `sathcypress` folder is the Cypress project root

## Install dependencies

From `C:\SathReact\sathcypress`:

```bash
npm install
```

## Environment configuration

A `.env` file is included in the project root with the following values:

```env
SAUCE_URL=https://www.saucedemo.com
USERS=standard_user,locked_out_user,problem_user,performance_glitch_user,error_user,visual_user
PASSWORD=secret_sauce
```

This file is loaded by `cypress.config.js` and used in the login script.

## Running tests from the command line

### Run the login spec headlessly

```bash
cd C:\SathReact\sathcypress
npx cypress run --spec "cypress/e2e/e2e_login.cy.js"
```

### Run the inventory assertions spec headlessly

```bash
cd C:\SathReact\sathcypress
npx cypress run --spec "cypress/e2e/e2e_inventory_assertions.cy.js"
```

### Run all Cypress tests headlessly

```bash
cd C:\SathReact\sathcypress
npx cypress run
```

### Open Cypress Test Runner

```bash
cd C:\SathReact\sathcypress
npx cypress open
```

Then select `e2e_login.cy.js`, `e2e_checkout_flow.cy.js`, or any spec in the Cypress UI.

## NPM scripts

The following scripts are defined in `package.json`:

- `npm run cypress:open` — open the interactive Cypress Test Runner
- `npm run cypress:run` — run all specs headlessly
- `npm run test:e2e` — run the login spec headlessly
- `npm run test:checkout` — run the checkout flow spec headlessly
- `npm run test:reset` — run the reset flow spec headlessly
- `npm run test:inventory` — run the inventory assertions spec headlessly

## Notes

- The login command is defined in `cypress/support/commands.js`.
- The login test spec is located at `cypress/e2e/login.cy.js`.
- Sauce Demo credentials are stored in `.env` and not committed if `.gitignore` excludes it.
