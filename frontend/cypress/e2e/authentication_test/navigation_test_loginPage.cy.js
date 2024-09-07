describe('Navigation Test for LoginPage', () => {
    beforeEach(() => {
        cy.visit('http://localhost:3000/login');
      });

    it('should navigate to the home page when the home link is clicked', () => {
        cy.contains('Home').click();
        cy.contains('Benvenuti').should('be.visible');
    });
  
    it('should navigate to the signup page when the signup link is clicked', () => {
      cy.contains('Registrati').click();
      cy.url().should('include', '/signup');
    });
  
  });
  