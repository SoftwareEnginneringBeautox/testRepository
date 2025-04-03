describe('Admin - Services Management', () => {
  beforeEach(() => {
    cy.loginAsAdmin()
    cy.visit('/AdministratorServices')
  })

  it('Loads treatment and package tables', () => {
    cy.get('[data-cy=treatment-table]').should('exist')
    cy.get('[data-cy=package-table]').should('exist')
  })

  it('Adds a new treatment', () => {
    cy.get('[data-cy=add-treatment-btn]').click()
    cy.get('[data-cy=treatment-name]').type('Facial Peel')
    cy.get('[data-cy=treatment-price]').type('1200')
    cy.get('[data-cy=save-treatment-btn]').click()
    cy.contains('Facial Peel')
  })

  it('Edits a treatment', () => {
    cy.get('[data-cy=treatment-row]').first().within(() => {
      cy.get('[data-cy=edit-treatment-btn]').click()
    })
    cy.get('[data-cy=treatment-name]').clear().type('Updated Treatment')
    cy.get('[data-cy=save-treatment-btn]').click()
    cy.contains('Updated Treatment')
  })

  it('Archives a treatment', () => {
    cy.get('[data-cy=treatment-row]').first().within(() => {
      cy.get('[data-cy=archive-treatment-btn]').click()
    })
    cy.get('[data-cy=confirm-archive-btn]').click()
    cy.contains('Archived successfully')
  })

  it('Adds a new package', () => {
    cy.get('[data-cy=add-package-btn]').click()
    cy.get('[data-cy=package-name]').type('Glow Up Package')
    cy.get('[data-cy=package-treatment]').select('Facial')
    cy.get('[data-cy=package-sessions]').type('5')
    cy.get('[data-cy=package-price]').type('5000')
    cy.get('[data-cy=save-package-btn]').click()
    cy.contains('Glow Up Package')
  })

  it('Edits a package', () => {
    cy.get('[data-cy=package-row]').first().within(() => {
      cy.get('[data-cy=edit-package-btn]').click()
    })
    cy.get('[data-cy=package-name]').clear().type('Glow Pro Package')
    cy.get('[data-cy=save-package-btn]').click()
    cy.contains('Glow Pro Package')
  })

  it('Archives a package', () => {
    cy.get('[data-cy=package-row]').first().within(() => {
      cy.get('[data-cy=archive-package-btn]').click()
    })
    cy.get('[data-cy=confirm-archive-btn]').click()
    cy.contains('Archived successfully')
  })
})
