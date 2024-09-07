describe('Navigation Tests for HomePage', () => {
  it('should navigate to the login page when the login link is clicked', () => {
    cy.visit('http://localhost:3000/');
    cy.contains('Login').click();
    cy.url().should('include', '/login');
  });

  it('should navigate to the signup page when the signup link is clicked', () => {
    cy.visit('http://localhost:3000/');
    cy.contains('Signup').click();
    cy.url().should('include', '/signup');
  });

  it('should navigate to the book shop page when the book shop link is clicked', () => {
    cy.visit('http://localhost:3000/');
    cy.contains('Book Shop').click({ force: true });
    cy.url().should('include', '/book-shop');
  });

  it('should navigate to the tutoring page when the tutoring link is clicked', () => {
    cy.visit('http://localhost:3000/');
    cy.contains('Tutoraggio').click();
    cy.url().should('include', '/tutoring');
  });

  it('should navigate to the study group page when the study group link is clicked', () => {
    cy.visit('http://localhost:3000/');
    cy.get('#study-group-link').click({ force: true });
    cy.url().should('include', '/study-group');
  });
});
