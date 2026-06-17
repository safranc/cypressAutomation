describe('WordPress local login and home access', () => {
  const baseUrl = 'http://sathtest.local';
  const username = 'safranc';
  const password = 'test';

  it('logs in to WordPress and visits the home page', () => {
    cy.on('uncaught:exception', (err, runnable) => {
      // Ignore WordPress frontend JS errors that do not affect the login flow.
      return false;
    });

    cy.visit(`${baseUrl}/wp-login.php`);

    cy.get('#user_login').should('be.visible').clear().focus().type(username, { delay: 50 });
    cy.get('#user_pass').should('be.visible').clear().focus().type(password, { delay: 50, log: false });
    cy.wait(500); // Brief wait before submitting
    cy.get('#wp-submit').click();

    cy.url().should('include', '/wp-admin');
    cy.get('body').should('be.visible');

    cy.visit(baseUrl);
    cy.url().should('eq', `${baseUrl}/`);
    cy.title().should('match', /home/i);
    cy.contains(/welcome|home/i).should('exist');
  });
});
