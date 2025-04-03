describe('Admin - Services Management', () => {
    beforeEach(() => {
      cy.loginAsAdmin()
      cy.visit('/admin/services')
    })
  
    it('Adds and edits a service', () => {
      cy.get('[data-cy=add-service-btn]').click()
      cy.get('[data-cy=service-name]').type('Laser Treatment')
      cy.get('[data-cy=save-service-btn]').click()
      cy.contains('Laser Treatment')
  
      cy.get('[data-cy=edit-service-btn]').first().click()
      cy.get('[data-cy=service-name]').clear().type('Updated Laser')
      cy.get('[data-cy=save-service-btn]').click()
      cy.contains('Updated Laser')
    })
  
    it('Archives a service', () => {
      cy.get('[data-cy=archive-service-btn]').first().click()
      cy.contains('Archived successfully')
    })
  })
  