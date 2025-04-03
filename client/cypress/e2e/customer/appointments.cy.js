describe('Customer - Public Appointment Flow', () => {
    beforeEach(() => {
      cy.visit('/appointments')
    })
  
    it('Views list of services', () => {
      cy.get('[data-cy=service-card]').should('have.length.at.least', 1)
    })
  
    it('Selects a service and schedules appointment', () => {
      cy.get('[data-cy=service-card]').first().click()
      cy.get('[data-cy=calendar]').click()
      cy.get('[data-cy=calendar-day]').contains('15').click()
      cy.get('[data-cy=time-slot]').contains('10:00 AM').click()
      cy.get('[data-cy=customer-name]').type('Jane Doe')
      cy.get('[data-cy=customer-contact]').type('janedoe@email.com')
      cy.get('[data-cy=submit-appointment-btn]').click()
      cy.contains('Appointment confirmed').should('exist')
    })
  
    it('Optionally edits or cancels an appointment via token link', () => {
      // only if your system supports post-booking management via unique links
      cy.visit('/appointments/manage?token=test-token')
      cy.get('[data-cy=cancel-appointment-btn]').click()
      cy.contains('Appointment canceled').should('exist')
    })
  })
  