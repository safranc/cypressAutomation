describe('Sauce Demo reset flow', () => {
  const username = 'standard_user';

  it('logs in, adds all inventory items, resets app state, and verifies cart is cleared', () => {
    cy.login(username);

    cy.get('.inventory_item').should('have.length.at.least', 1);
    cy.get('.inventory_item').each(($item) => {
      cy.wrap($item).find('button').contains(/add to cart/i).click();
    });

    cy.get('.inventory_item').each(($item) => {
      cy.wrap($item).find('button').contains(/remove/i).should('be.visible');
    });

    cy.get('#react-burger-menu-btn').click();
    cy.get('#reset_sidebar_link').click();

    cy.reload();

    cy.get('.inventory_item').each(($item) => {
      cy.wrap($item).find('button').contains(/add to cart/i).should('be.visible');
      cy.wrap($item).find('button').contains(/remove/i).should('not.exist');
    });

    cy.logout();
  });
});
