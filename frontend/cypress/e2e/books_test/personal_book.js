describe('Navigation test for NewBookPage', () => {
    beforeEach(() => {
      cy.visit('http://localhost:3000/new-book');
    });
    
    
    it('should navigate to the home page when the home link is clicked', () => {
        cy.contains('Home').click();
        cy.contains('Benvenuti').should('be.visible');
    });

    it('should navigate to new book page when "Vendi un libro" in clicked ', () => {
        cy.contains('Vendi un libro').click();
        cy.url().should('include', '/new-book');
    });


});