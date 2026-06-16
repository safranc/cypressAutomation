Cypress.Commands.add('login', (username) => {
  const users = (Cypress.env('USERS') || '').split(',').map(u => u.trim());
  const password = Cypress.env('PASSWORD');
  cy.visit('/');
  cy.get('#user-name').clear().type(username);
  cy.get('#password').clear().type(password);
  cy.get('#login-button').click();
});
