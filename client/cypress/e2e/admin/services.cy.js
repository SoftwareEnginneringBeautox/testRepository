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
    cy.get('[data-cy=treatment-duration]').type('30')
    cy.get('[data-cy=treatment-description]').type('Deep exfoliation and skin renewal')
    cy.get('[data-cy=save-treatment-btn]').click()
    
    cy.get('[data-cy=treatment-table]')
    .find('[data-cy=treatment-row]')
    .should('contain.text', 'Facial Peel')
  }) 

  it('Edits a treatment', () => {
    cy.get('[data-cy=treatment-row]').first().within(() => {
      cy.get('button').click()
      
    })
    cy.get('[data-cy=edit-treatment-btn]').first().click()
    cy.get('[data-cy=treatment-name]').clear().type('Updated Treatment')
    cy.get('[data-cy=treatment-price]').clear().type('500')
    //cy.get('[data-cy=treatment-duration]').clear().type('60')
   // cy.get('[data-cy=treatment-description]').clear().type('500')
    cy.get('[data-cy=save-treatment-btn]').click()
    cy.get('[data-cy=treatment-table]')
    .find('[data-cy=treatment-row]')
    .should('contain.text', 'Updated Treatment')
    
  }) 

  it('Archives a treatment', () => {
    cy.get('[data-cy=treatment-row]').first().within(() => {
      cy.get('button').click()
      
    })
    cy.get('[data-cy=archive-treatment-btn]').first().click()
    cy.get('[data-cy=confirm-archive-btn]').click()

    cy.get('[data-cy=treatment-table]')
    .find('[data-cy=treatment-row]')
    .should('not.contain.text', 'Updated Treatment')
    
  }) 

  it('Adds a new package', () => {
    cy.get('[data-cy=add-package-btn]').click()
    cy.get('[data-cy=package-name]').type('Glow Up Package')
    cy.get('[data-cy=package-treatment]').select('1')
    cy.get('[data-cy=package-sessions]').type('5')
    cy.get('[data-cy=save-package-btn]').click()
  })

  it('Edits a package', () => {
    cy.get('[data-cy=package-row]').first().within(() => {
      cy.get('button').click()
      
    })
    cy.get('[data-cy=edit-package-btn]').first().click()
    cy.get('[data-cy=package-name]').clear().type('Glow Pro Package')
    cy.get('[data-cy=save-package-btn]').click()
    cy.get('[data-cy=package-table]')
    .find('[data-cy=package-row]')
    .should('contain.text', 'Glow Pro Package')
  })

  it('Archives a package', () => {
    cy.get('[data-cy=package-row]').first().within(() => {
      cy.get('button').click()
    })
    cy.get('[data-cy=archive-package-btn]').first().click()
    cy.get('[data-cy=confirm-archive-btn]').click()

    cy.get('[data-cy=package-table]')
      .find('[data-cy=package-row]')
      .should('not.contain.text', 'Glow Pro Package')
  })
})
