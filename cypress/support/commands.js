Cypress.Commands.add('login', (username) => {
  const users = (Cypress.env('USERS') || '').split(',').map(u => u.trim());
  const password = Cypress.env('PASSWORD');
  cy.visit('/');
  cy.get('#user-name').clear().type(username);
  cy.get('#password').clear().type(password);
  cy.get('#login-button').click();
});

Cypress.Commands.add('logout', () => {
  cy.get('#react-burger-menu-btn').click();
  cy.get('#logout_sidebar_link').click();
  cy.url().should('include', '/');
  cy.get('#login-button').should('be.visible');
});
