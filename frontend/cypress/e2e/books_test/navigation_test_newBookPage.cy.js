describe('Navigation Test for NewBookPage', () => {
    beforeEach(() => {
      cy.visit('http://localhost:3000/new-book');
    });
    
    
    it('should navigate to the home page when the home link is clicked', () => {
        cy.contains('Home').click();
        cy.contains('Benvenuti').should('be.visible');
    });

    it('should remain on the same page if deletion of publication is canceled ', () => {
        cy.contains('Annulla').click();
        cy.contains('Annulla').click();
        cy.url().should('include', '/new-book');
    });

    it('should go tothe homepage if deletion of publication is confirmed ', () => {
        cy.contains('Annulla').click();
        cy.contains('Conferma').click();
        cy.contains('Benvenuti').should('be.visible');
    });

    it('shows an error when all required fields are not filled in', () => {
        cy.on('window:alert', (text) => {
          expect(text).to.equals("Per favore, completa i campi contrassegnati con l'asterisco");
        });
  
        cy.get('button').contains('Pubblica').click();
      });
    


});