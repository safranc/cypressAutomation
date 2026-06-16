describe('Sauce Demo inventory sort assertions', () => {
  const username = 'standard_user';

  const getItemNames = () => cy.get('.inventory_item_name').then(($items) => 
    [...$items].map((item) => item.innerText.trim())
  );

  const getItemPrices = () => cy.get('.inventory_item_price').then(($items) => 
    [...$items].map((item) => parseFloat(item.innerText.replace('$', '')))
  );

  const isSortedAsc = (arr) => arr.every((value, index) => index === 0 || arr[index - 1] <= value);
  const isSortedDesc = (arr) => arr.every((value, index) => index === 0 || arr[index - 1] >= value);

  it('verifies inventory sorting for names and prices', () => {
    cy.login(username);
    cy.url().should('include', '/inventory.html');

    cy.get('.product_sort_container').should('be.visible');

    cy.get('.product_sort_container').select('Name (A to Z)');
    getItemNames().should((names) => {
      expect(isSortedAsc(names)).to.be.true;
    });

    cy.get('.product_sort_container').select('Name (Z to A)');
    getItemNames().should((names) => {
      expect(isSortedDesc(names)).to.be.true;
    });

    cy.get('.product_sort_container').select('Price (low to high)');
    getItemPrices().should((prices) => {
      expect(isSortedAsc(prices)).to.be.true;
    });

    cy.get('.product_sort_container').select('Price (high to low)');
    getItemPrices().should((prices) => {
      expect(isSortedDesc(prices)).to.be.true;
    });

    cy.logout();
  });
});
