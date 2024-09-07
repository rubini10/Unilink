describe('Navigation tests for StudyGroupPage', () => {
    beforeEach(() => {
      cy.visit('http://localhost:3000/study-group');
    });
  
    it('navigates to the home page when "Home" is clicked', () => {
      cy.contains('Home').click();
      cy.url().should('eq', 'http://localhost:3000/');
    });
  
    it('navigates to the signup page when "Signup" is clicked', () => {
      cy.contains('Signup').click();
      cy.url().should('include', '/signup');
    });
  
    it('navigates to the login page when "Login" is clicked', () => {
      cy.contains('Login').click();
      cy.url().should('include', '/login');
    });

    it('should navigate to ad publication page when "I miei libri pubblicati" in clicked ', () => {
        cy.contains('pubblica un nuovo annuncio').click();
        cy.url().should('include', '/new-ad');
    });
  
  });