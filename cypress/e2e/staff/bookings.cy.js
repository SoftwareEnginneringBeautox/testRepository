describe('Receptionist - Bookings', () => {
    beforeEach(() => {
      cy.loginAsReceptionist()
      cy.visit('/receptionist/bookings')
    })
  
    it('Views and filters calendar bookings', () => {
      cy.get('[data-cy=calendar-view]').should('exist')
      cy.get('[data-cy=filter-bookings-btn]').click()
    })
  })
  