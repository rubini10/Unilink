describe('Navigation tests for TutoringPage', () => {
    beforeEach(() => {
      cy.visit('http://localhost:3000/tutoring');
    });
  
    it('navigates to the home page when "Home" is clicked', () => {
      cy.contains('Home').click();
      cy.url().should('eq', 'http://localhost:3000/');
    });

  
  });