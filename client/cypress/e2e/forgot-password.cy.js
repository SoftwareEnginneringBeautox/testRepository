describe('Forgot Password Modal Flow', () => {
    beforeEach(() => {
      cy.visit('/login') // Make sure this opens the login page
      cy.get('[data-cy=forgot-password-link]').click()
      cy.get('[data-cy=forgot-password-modal]').should('exist')
    })
  
    it('Submits email to receive OTP', () => {
      cy.get('[data-cy=forgot-email]').type('isjasminedeguia@gmail.com')
      cy.get('[data-cy=submit-email]').click()
      cy.contains('OTP sent to your email.').should('exist')
    })
  
    it('Submits OTP to verify', () => {
      cy.get('[data-cy=forgot-email]').type('isjasminedeguia@gmail.com')
      cy.get('[data-cy=submit-email]').click()
  
      cy.get('[data-cy=otp-input]').within(() => {
        cy.get('input').eq(0).type('1')
        cy.get('input').eq(1).type('2')
        cy.get('input').eq(2).type('3')
        cy.get('input').eq(3).type('4')
        cy.get('input').eq(4).type('5')
        cy.get('input').eq(5).type('6')
      })
  
      cy.get('[data-cy=submit-otp]').click()
      cy.contains('Invalid OTP. Please try again.').should('exist')
    })
  
    /*it('Submits new password', () => {
      cy.get('[data-cy=forgot-email]').type('isjasminedeguia@gmail.com')
      cy.get('[data-cy=submit-email]').click()
  
      // Skip ahead with a valid OTP
      cy.get('[data-cy=otp-input]').within(() => {
        '123456'.split('').forEach((digit, index) => {
          cy.get('input').eq(index).type(digit)
        })
      })
      cy.get('[data-cy=submit-otp]').click()
  
      // Password reset step
      cy.get('[data-cy=new-password]').type('NewPass123!')
      cy.get('[data-cy=confirm-password]').type('NewPass123!')
      cy.get('[data-cy=submit-reset]').click()
  
      cy.contains('Password reset functionality will be implemented soon.').should('exist')
    })*/
  
    it('Resends OTP', () => {
      cy.get('[data-cy=forgot-email]').type('isjasminedeguia@gmail.com')
      cy.get('[data-cy=submit-email]').click()
      cy.get('[data-cy=resend-otp]').click()
      cy.contains('A new OTP has been sent.').should('exist')
    })
  })
  