describe('WordPress News Daily page checks', () => {
  const baseUrl = 'http://sathtest.local';

  it('visits the News Daily page and verifies content', () => {
    cy.visit(`${baseUrl}/news-daily/`);

    cy.url().should('include', '/news-daily/');
    cy.contains('NEWS DAILY').should('be.visible');
    cy.contains('The Stories Podcast').should('be.visible');
    cy.contains('Subscribe on your favorite platform').should('be.visible');

    cy.get('a').contains('YouTube').should('have.attr', 'href', 'https://www.youtube.com/');
    cy.get('a').contains('Spotify').should('have.attr', 'href', 'https://creators.spotify.com/');
    cy.get('a').contains('Apple Podcasts').should('have.attr', 'href', 'https://podcasters.apple.com/');

    cy.contains('Sign up to get daily stories').should('be.visible');
    cy.contains('Subscribe').should('be.visible');
  });
});
