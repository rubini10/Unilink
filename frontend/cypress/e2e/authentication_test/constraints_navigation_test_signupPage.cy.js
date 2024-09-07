describe('Navigation test for SignupPage', () => {
    beforeEach(() => {
      cy.visit('http://localhost:3000/signup');
    });

    it('should navigate to the login page when the login link is clicked', () => {
        cy.contains('Login').click();
        cy.url().should('include', '/login');
    });
    
    
    it('should navigate to the home page when the home link is clicked', () => {
        cy.contains('Home').click();
        cy.contains('Benvenuti').should('be.visible');
    });

      
    it('shows an error for invalid email format', () => {
      cy.on('window:alert', (text) => {
        expect(text).to.equals("Invalid email. Please enter a valid email address in the format value.value@campus.unimib.it");
      });

      cy.get('#email').type('user@wrongdomain.com');
      cy.get('#password').type('Password@123');
      cy.get('#confirmPassword').type('Password@123');
      cy.get('#firstName').type('Luca');
      cy.get('#lastName').type('Rossi');
      cy.get('#birthdate')
        .type('01/01/2000', { force: true });
      cy.get('#gender').select('Maschio', { force: true });
      cy.get('#courseType').select('Triennale', { force: true });
      cy.get('#subjectArea').select('Sociologica', { force: true });
      cy.get('#courseYear').select('Primo anno', { force: true });
      cy.get('button').contains('Registrati').click();
    });
  
    it('shows an error when password do not match', () => {
      cy.on('window:alert', (text) => {
        expect(text).to.equals("Passwords do not match. Please make sure your passwords match.");
      });

      cy.get('#email').type('u.user@campus.unimib.it');
      cy.get('#password').type('Password@123');
      cy.get('#confirmPassword').type('Password@124');
      cy.get('#firstName').type('Luca');
      cy.get('#lastName').type('Rossi');
      cy.get('#birthdate')
        .type('01/01/2000', { force: true });
      cy.get('#gender').select('Maschio', { force: true });
      cy.get('#courseType').select('Triennale', { force: true });
      cy.get('#subjectArea').select('Sociologica', { force: true });
      cy.get('#courseYear').select('Primo anno', { force: true });
      cy.get('button').contains('Registrati').click();
    });

    it('shows an error when password is invalid', () => {
      cy.on('window:alert', (text) => {
        expect(text).to.equals("Invalid password. Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.");
      });

      cy.get('#email').type('u.user@campus.unimib.it');
      cy.get('#password').type('Password');
      cy.get('#confirmPassword').type('Password');
      cy.get('#firstName').type('Luca');
      cy.get('#lastName').type('Rossi');
      cy.get('#birthdate')
        .type('01/01/2000', { force: true });
      cy.get('#gender').select('Maschio', { force: true });
      cy.get('#courseType').select('Triennale', { force: true });
      cy.get('#subjectArea').select('Sociologica', { force: true });
      cy.get('#courseYear').select('Primo anno', { force: true });
      cy.get('button').contains('Registrati').click();
    });

    it('shows an error when all required fields are not filled in', () => {
      cy.on('window:alert', (text) => {
        expect(text).to.equals("Please fill in all fields");
      });

      cy.get('#email').type('us.user@campus.unimib.it');
      cy.get('#password').type('Password@123');
      cy.get('#confirmPassword').type('Password@123');
      cy.get('#lastName').type('Rossi');
      cy.get('#birthdate')
        .type('01/01/2000', { force: true });
      cy.get('#gender').select('Maschio', { force: true });
      cy.get('#courseType').select('Triennale', { force: true });
      cy.get('#subjectArea').select('Sociologica', { force: true });
      cy.get('#courseYear').select('Primo anno', { force: true });
      cy.get('button').contains('Registrati').click();
    });
  

  });
  