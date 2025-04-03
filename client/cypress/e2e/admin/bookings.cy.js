describe('Admin - Bookings Calendar', () => {
  beforeEach(() => {
    cy.loginAsAdmin()
    cy.visit('/BookingCalendar')
  })

  it('Views and filters calendar bookings', () => {
    cy.get('[data-cy=calendar-view]', { timeout: 10000 }).should('exist')
    cy.get('[data-cy=calendar-view-monthly]').click()
    cy.get('[data-cy=calendar-view-weekly]').click()
    //cy.get('[data-cy=filter-bookings-btn]').click()
    //cy.get('[data-cy=calendar-booking]').should('exist')
  })

  it('Navigates using prev and next buttons', () => {
    cy.get('[data-cy=calendar-view]').should('exist')

    // Grab the current month/year label
    cy.get('[data-cy=calendar-month-label]').then(($label) => {
      const currentMonth = $label.text().trim()

      // Click next
      cy.get('[data-cy=next-month-btn]').click()
      cy.get('[data-cy=calendar-month-label]')
        .invoke('text')
        .should((newMonth) => {
          expect(newMonth.trim()).not.to.eq(currentMonth)
        })

      // Click prev to go back
      cy.get('[data-cy=previous-month-btn]').click()
      cy.get('[data-cy=calendar-month-label]')
        .invoke('text')
        .should((restoredMonth) => {
          expect(restoredMonth.trim()).to.eq(currentMonth)
        })
    })
  })
  
})
