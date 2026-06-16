describe('Sauce Demo - Login tests', () => {
  const users = (Cypress.env('USERS') || '').split(',').map(u => u.trim()).filter(Boolean);
  if (!users.length) {
    it('has users configured', () => {
      throw new Error('No users found in CYPRESS env USERS');
    });
    return;
  }

  users.forEach((user) => {
    it(`login attempt for ${user}`, () => {
      cy.login(user);
      if (user === 'locked_out_user') {
        // locked out user should see an error
        cy.get('[data-test="error"]', { timeout: 5000 }).should('be.visible');
      } else {
        // successful login redirects to inventory
        cy.url({ timeout: 10000 }).should('include', '/inventory.html');
      }
    });
  });
});
