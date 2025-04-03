describe('Admin - Dashboard', () => {
    beforeEach(() => {
      cy.loginAsAdmin()
      cy.visit('/AdminDashboard')
    })
  
    it('Loads dashboard and displays welcome message', () => {
      cy.contains('WELCOME BACK, ADMINISTRATOR').should('exist')
    })
  
    it('Displays reminder items', () => {
      cy.get('[data-cy=reminder-item]').should('have.length.at.least', 1)
    })
  
    it('Displays the sales chart', () => {
      cy.get('[data-cy=sales-chart]').should('exist')
    })
  
    it('Displays staff cards', () => {
      cy.get('[data-cy=staff-card]').should('have.length.at.least', 1)
    })
  
    it('Creates a new staff account', () => {
      cy.get('[data-cy=add-staff-btn]').click()
      cy.get('[data-cy=create-staff-modal]').should('exist')
  
      cy.get('[data-cy=staff-name]').type('Ella Ramos')
      cy.get('[data-cy=staff-role]').click().contains('Receptionist').click()
      cy.get('[data-cy=staff-password]').type('securePass123')
      cy.get('[data-cy=staff-dayoff]').click().contains('FRIDAY').click()
  
      cy.get('[data-cy=submit-create-staff]').click()
      cy.contains('Ella Ramos', { timeout: 5000 }) // Or check for success message if shown
    })
  
    // Edit Staff Modal
    it('Edits a staff account', () => {
      cy.get('[data-cy=edit-staff-btn]').first().click()
      cy.get('[data-cy=edit-staff-modal]').should('exist')
  
      cy.get('[data-cy=edit-staff-name]').clear().type('Updated Name')
      cy.get('[data-cy=edit-staff-email]').clear().type('updated@email.com')
      cy.get('[data-cy=edit-staff-role]').click().contains('Aesthetician').click()
      cy.get('[data-cy=edit-staff-dayoff]').click().contains('MONDAY').click()
  
      cy.get('[data-cy=submit-edit-staff]').click()
      cy.contains('Updated Name')
    })
  
    // Archive Staff Modal
    it('Archives a staff account', () => {
      cy.get('[data-cy=archive-staff-btn]').first().click()
      cy.get('[data-cy=archive-staff-modal]').should('exist')
  
      cy.get('[data-cy=confirm-archive-staff]').click()
      cy.contains('Archived successfully') // Or verify the row is removed
    })
  
    // Cancel buttons
    it('Closes all modals via cancel', () => {
      // Create
      cy.get('[data-cy=add-staff-btn]').click()
      cy.get('[data-cy=cancel-create-staff]').click()
      cy.get('[data-cy=create-staff-modal]').should('not.exist')
  
      // Edit
      cy.get('[data-cy=edit-staff-btn]').first().click()
      cy.get('[data-cy=cancel-edit-staff]').click()
      cy.get('[data-cy=edit-staff-modal]').should('not.exist')
  
      // Archive
      cy.get('[data-cy=archive-staff-btn]').first().click()
      cy.get('[data-cy=cancel-archive-staff]').click()
      cy.get('[data-cy=archive-staff-modal]').should('not.exist')
    })
  })
  