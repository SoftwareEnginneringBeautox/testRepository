describe('Login Page', () => {
    beforeEach(() => {
      cy.visit('/login') // Adjust if the login route is different
    })
  
    it('Displays the login form', () => {
      cy.contains('Welcome to PRISM').should('exist')
      cy.get('input#username').should('exist')
      cy.get('input#password').should('exist')
      cy.get('button[type=submit]').contains('LOGIN').should('exist')
    })
  
    it('Shows error on empty submit', () => {
      cy.get('button[type=submit]').click()
      cy.contains('required', { matchCase: false }) // if native validation doesn't block first
    })
  
    it('Logs in successfully as admin', () => {
      cy.get('input#username').type('lawrence')
      cy.get('input#password').type('12345')
      cy.get('button[type=submit]').click()
  
      // Wait for redirect based on role
      cy.url().should('include', '/AdminDashboard')
    })
  /*
    it('Logs in successfully as staff', () => {
      cy.get('input#username').type('receptionist')
      cy.get('input#password').type('staffpass')
      cy.get('button[type=submit]').click()
  
      cy.url().should('include', '/StaffDashboard')
    }) */
  
    it('Shows error on invalid credentials', () => {
      cy.get('input#username').type('fakeuser')
      cy.get('input#password').type('wrongpass')
      cy.get('button[type=submit]').click()
  
      cy.contains('Invalid username or password').should('exist')
    })
  
    it('Opens forgot password modal', () => {
      cy.contains('CLICK HERE').click()
      cy.get('[data-cy=forgot-password-modal]').should('exist')
    })
  })
  