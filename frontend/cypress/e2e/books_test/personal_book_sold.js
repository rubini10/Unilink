describe('Navigation test for PersonalBookPage', () => {
    beforeEach(() => {
      cy.visit('http://localhost:3000/new-book');
    });
    
    
    it('should navigate to the home page when the home link is clicked', () => {
        cy.contains('Home').click();
        cy.contains('Benvenuti').should('be.visible');
    });

    it('should navigate to personal book page when "I miei libri pubblicati" in clicked ', () => {
        cy.contains('I miei libri pubblicati').click();
        cy.url().should('include', '/personal-book');
    });


});