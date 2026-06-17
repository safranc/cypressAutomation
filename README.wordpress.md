# WordPress Cypress Tests

This folder contains Cypress end-to-end tests for the local WordPress site at `http://sathtest.local`.

## Purpose

The WordPress Cypress tests cover:

- logging in to the local WordPress admin
- visiting the `News Daily` page
- verifying the page content and external podcast links
- submitting the `News Daily` subscriber form
- confirming the subscription success message

## Local site requirements

Make sure your local site is running and accessible at:

```text
http://sathtest.local
```

Also ensure the WordPress admin is available at:

```text
http://sathtest.local/wp-admin
```

## Credentials

Use the following credentials in the tests:

- Username: `safranc`
- Password: `test`

If different credentials are required, update the test spec accordingly.

## Files

The WordPress test files are located in:

- `cypress/e2e/wordpress/wordpress_login.cy.js`
- `cypress/e2e/wordpress/wordpress_news_daily.cy.js`
- `cypress/e2e/wordpress/wordpress_news_daily_subscribe.cy.js`

## How to run the tests

From the project root:

```bash
cd C:\SathReact\sathcypress
npm install
```

### Run the WordPress login test

```bash
npm run test:wordpress-login
```

### Run the News Daily page verification test

```bash
npm run test:wordpress-news
```

### Run the subscriber flow test

```bash
npm run test:wordpress-subscribe
```

### Run all Cypress tests headlessly

```bash
npm run cypress:run
```

### Open the Cypress Test Runner

```bash
npm run cypress:open
```

Then select the WordPress specs in the Cypress UI.

## Notes

- These WordPress tests are separate from the Sauce Demo tests and do not use the Sauce Demo base URL.
- The subscriber flow test submits the form on the `News Daily` page and checks for a confirmation message.
- If the `News Daily` page or subscription form is not present yet, create the page in WordPress and add the form before running the tests.
