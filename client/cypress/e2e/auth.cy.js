describe('Login Page', () => {
    beforeEach(() => {
      cy.visit('/login') // Adjust if the login route is different
    })
  
    it('Displays the login form', () => {
      cy.get('[data-cy=login-form]').should('exist')
      cy.get('[data-cy=login-username]').should('exist')
      cy.get('[data-cy=login-password]').should('exist')
      cy.get('[data-cy=login-submit]').should('exist')
    })
  
    it('Fails login with empty credentials (HTML5 validation)', () => {
      // This just triggers native validation. No error text in DOM.
      cy.get('[data-cy=login-submit]').click()
      cy.get('[data-cy=login-username]').then(($input) => {
        expect($input[0].checkValidity()).to.be.false
      })
    })

    it('Fails login with invalid credentials', () => {
      cy.get('[data-cy=login-username]').type('wronguser')
      cy.get('[data-cy=login-password]').type('wrongpass')
      cy.get('[data-cy=login-submit]').click()
  
      // Check for error message
      cy.contains('Invalid username or password').should('exist')
    })
  
    it('Logs in as admin and redirects to dashboard', () => {
      cy.get('[data-cy=login-username]').type('lawrence')
      cy.get('[data-cy=login-password]').type('12345')
      cy.get('[data-cy=login-submit]').click()
  
      // Assert redirect
      cy.url().should('include', '/AdminDashboard')
    })
  /*
    it('Logs in successfully as staff', () => {
      cy.get('input#username').type('receptionist')
      cy.get('input#password').type('staffpass')
      cy.get('button[type=submit]').click()
  
      cy.url().should('include', '/StaffDashboard')
    }) */
  
  
    it('Opens forgot password modal', () => {
      cy.get('[data-cy=forgot-password-link]').click()
      cy.get('[data-cy=forgot-password-modal]').should('exist')
    })
  })
  