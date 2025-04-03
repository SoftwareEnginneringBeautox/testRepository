describe('Reminders System (Shared)', () => {
    it('Displays reminders for admin', () => {
      cy.loginAsAdmin()
      cy.visit('/admin/reminders')
      cy.get('[data-cy=reminder-item]').should('exist')
    })
  
    it('Displays reminders for receptionist', () => {
      cy.loginAsReceptionist()
      cy.visit('/receptionist/reminders')
      cy.get('[data-cy=reminder-item]').should('exist')
    })
  
    it('Displays reminders for aesthetician', () => {
      cy.loginAsAesthetician()
      cy.visit('/aesthetician/reminders')
      cy.get('[data-cy=reminder-item]').should('exist')
    })
  })
  