describe('WordPress REST API validation', () => {
  const baseUrl = 'http://sathtest.local';

  it('fetches the WordPress API root and verifies available namespaces', () => {
    cy.request(`${baseUrl}/wp-json`).then((response) => {
      expect(response.status).to.equal(200);
      expect(response.body).to.have.property('namespaces');
      expect(response.body.namespaces).to.include('wp/v2');
    });
  });

  it('fetches the News Daily page using the WP REST API', () => {
    cy.request(`${baseUrl}/wp-json/wp/v2/pages?slug=news-daily`).then((response) => {
      expect(response.status).to.equal(200);
      expect(response.body).to.be.an('array').and.have.length.greaterThan(0);

      const page = response.body[0];
      expect(page).to.have.property('slug', 'news-daily');
      expect(page).to.have.nested.property('title.rendered').and.match(/NEWS DAILY/i);
      expect(page).to.have.nested.property('content.rendered').and.contain('The Stories Podcast');
    });
  });

  it('creates a new subscriber using the custom API endpoint', () => {
    const requestBody = {
      name: 'API Subscriber',
      email: `api-subscriber+${Date.now()}@example.com`,
    };

    cy.request({
      method: 'POST',
      url: `${baseUrl}/wp-json/news-daily-subscribe/v1/subscribe`,
      body: requestBody,
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.equal(201);
      expect(response.body).to.have.property('success', true);
      expect(response.body).to.have.property('id').that.is.a('number');
      expect(response.body).to.have.property('email', requestBody.email);
      expect(response.body).to.have.property('name', requestBody.name);
    });
  });
});
