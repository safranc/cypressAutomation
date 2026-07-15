describe('AI Test Automation Framework', () => {
  it('runs prompt evaluation and checks benchmark thresholds', () => {
    cy.task('runLlmeval').then((report) => {
      expect(report.summary.totalCases).to.be.greaterThan(0);
      expect(report.summary.passedCases).to.equal(report.summary.totalCases);
      expect(report.summary.averageOverall).to.be.at.least(0.8);
    });
  });

  it('retrieves relevant context for checkout queries', () => {
    cy.task('runRagContext', { query: 'checkout' }).then((result) => {
      expect(result.totalResults).to.be.greaterThan(0);
      expect(result.results[0].path).to.include('e2e_checkout_flow.cy.js');
      expect(result.results[0].score).to.be.greaterThan(1);
    });
  });
});
