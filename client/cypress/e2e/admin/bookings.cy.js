describe('Admin - Bookings Calendar', () => {
  beforeEach(() => {
    cy.loginAsAdmin()
    cy.visit('/BookingCalendar')
  })

  it('Views and filters calendar bookings', () => {
    cy.get('[data-cy=calendar-view]').should('exist')
    cy.get('[data-cy=filter-bookings-btn]').click()
  })
})
