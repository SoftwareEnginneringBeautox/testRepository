describe('Receptionist - Manage Patients', () => {
  beforeEach(() => {
    cy.loginAsReceptionist()
    cy.visit('/receptionist/patients')
  })

  it('Adds and edits a patient record', () => {
    cy.get('[data-cy=add-patient-btn]').click()
    cy.get('[data-cy=patient-name]').type('Receptionist Entry')
    cy.get('[data-cy=save-patient-btn]').click()
    cy.contains('Receptionist Entry')

    cy.get('[data-cy=edit-patient-btn]').first().click()
    cy.get('[data-cy=patient-name]').clear().type('Updated Entry')
    cy.get('[data-cy=save-patient-btn]').click()
    cy.contains('Updated Entry')
  })
})
