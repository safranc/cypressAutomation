describe('WordPress News Daily subscribe flow', () => {
  const baseUrl = 'http://sathtest.local';
  const username = 'safranc';
  const password = 'test';
  const name = 'Test Subscriber';
  const email = `subscriber+${Date.now()}@example.com`;

  it('logs in, visits News Daily, submits the subscribe form, and confirms submission', () => {
    cy.on('uncaught:exception', (err, runnable) => {
      // Ignore WordPress frontend JS errors that do not affect the test flow.
      return false;
    });

    cy.visit(`${baseUrl}/wp-login.php`);

    cy.get('#user_login').should('be.visible').clear().focus().type(username, { delay: 50 });
    cy.get('#user_pass').should('be.visible').clear().focus().type(password, { delay: 50, log: false });
    cy.wait(500); // Brief wait before submitting
    cy.get('#wp-submit').click();

    // Wait for redirect to dashboard
    cy.url({ timeout: 10000 }).should('include', '/wp-admin');
    cy.wait(1000); // Brief wait for dashboard to fully load

    cy.visit(`${baseUrl}/news-daily/`);
    cy.url().should('include', '/news-daily/');
    cy.contains('NEWS DAILY').should('be.visible');

    cy.get('form.ndsl-subscribe-form').within(() => {
      cy.get('input[name="ndsl_subscribe_name"]').should('be.visible').clear().type(name);
      cy.get('input[name="ndsl_subscribe_email"]').should('be.visible').clear().type(email);
      cy.get('button[name="ndsl_subscribe_submit"]').click();
    });

    cy.contains('Thank you! Your subscription request has been saved.').should('be.visible');
  });
});
