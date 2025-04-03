describe('Admin - Staff Management', () => {
    beforeEach(() => {
      cy.loginAsAdmin()
      cy.visit('/admin/staff')
    })
  
    it('Adds, edits, and archives a staff member', () => {
      cy.get('[data-cy=add-staff-btn]').click()
      cy.get('[data-cy=staff-name]').type('New Staff')
      cy.get('[data-cy=save-staff-btn]').click()
      cy.contains('New Staff')
  
      cy.get('[data-cy=edit-staff-btn]').first().click()
      cy.get('[data-cy=staff-name]').clear().type('Updated Staff')
      cy.get('[data-cy=save-staff-btn]').click()
      cy.contains('Updated Staff')
  
      cy.get('[data-cy=archive-staff-btn]').first().click()
      cy.contains('Archived successfully')
    })
  })
  