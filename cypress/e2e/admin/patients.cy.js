describe('Admin - Patient Records', () => {
  beforeEach(() => {
    cy.loginAsAdmin()
    cy.visit('/admin/patients')
  })

  it('Adds a new patient record', () => {
    cy.get('[data-cy=add-patient-btn]').click()
    cy.get('[data-cy=patient-name]').type('John Admin')
    cy.get('[data-cy=save-patient-btn]').click()
    cy.contains('John Admin')
  })

  it('Edits and archives a patient record', () => {
    cy.get('[data-cy=edit-patient-btn]').first().click()
    cy.get('[data-cy=patient-name]').clear().type('Updated Patient')
    cy.get('[data-cy=save-patient-btn]').click()
    cy.contains('Updated Patient')
    cy.get('[data-cy=archive-patient-btn]').first().click()
    cy.contains('Archived successfully')
  })

  it('Sorts and searches patients', () => {
    cy.get('[data-cy=search-input]').type('Jane')
    cy.get('[data-cy=sort-name]').click()
  })
})
