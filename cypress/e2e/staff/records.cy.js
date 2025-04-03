describe('Aesthetician - View Patient Records', () => {
    beforeEach(() => {
      cy.loginAsAesthetician()
      cy.visit('/aesthetician/patients')
    })
  
    it('Views patient records only (read-only)', () => {
      cy.get('[data-cy=patient-row]').should('exist')
      cy.get('[data-cy=edit-patient-btn]').should('not.exist')
      cy.get('[data-cy=add-patient-btn]').should('not.exist')
    })
  })
  