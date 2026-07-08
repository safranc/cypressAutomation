import checkoutUsers from '../../env.json';

describe('Sauce Demo checkout flow', () => {
  const checkoutUser = checkoutUsers.checkoutUsers.find(user => user.id === 'standard_user');

  if (!checkoutUser) {
    throw new Error('standard_user not found in env.json');
  }

  it('logs in, adds first two items, checks out, and validates summary', () => {
    cy.login(checkoutUser.id);

    cy.get('.inventory_item').should('have.length.at.least', 2);
    cy.get('.inventory_item').eq(0).find('button').contains(/add to cart/i).click();
    cy.get('.inventory_item').eq(1).find('button').contains(/add to cart/i).click();

    cy.get('.shopping_cart_link').click();
    cy.url().should('include', '/cart.html');

    cy.get('[data-test="checkout"]').click();
    cy.url().should('include', '/checkout-step-one.html');

    cy.get('[data-test="firstName"]').type(checkoutUser.firstName);
    cy.get('[data-test="lastName"]').type(checkoutUser.lastName);
    cy.get('[data-test="postalCode"]').type(checkoutUser.postalCode);
    cy.get('[data-test="continue"]').click();

    cy.url().should('include', '/checkout-step-two.html');
    cy.contains('Payment Information').should('be.visible');
    cy.contains('Shipping Information').should('be.visible');
    cy.contains('Price Total').should('be.visible');

    cy.get('[data-test="finish"]').click();
    cy.url().should('include', '/checkout-complete.html');
    cy.get('img[alt="Pony Express"]').should('be.visible');
    cy.contains(/thank you for your order/i).should('be.visible');
    cy.logout();
  });

  it('shows a validation error when postal code is missing during checkout', () => {
    cy.login(checkoutUser.id);

    cy.get('.inventory_item').should('have.length.at.least', 1);
    cy.get('.inventory_item').eq(0).find('button').contains(/add to cart/i).click();

    cy.get('.shopping_cart_link').click();
    cy.get('[data-test="checkout"]').click();

    cy.get('[data-test="firstName"]').type(checkoutUser.firstName);
    cy.get('[data-test="lastName"]').type(checkoutUser.lastName);
    cy.get('[data-test="continue"]').click();

    cy.url().should('include', '/checkout-step-one.html');
    cy.contains(/error|required/i).should('be.visible');
    cy.logout();
  });
});
