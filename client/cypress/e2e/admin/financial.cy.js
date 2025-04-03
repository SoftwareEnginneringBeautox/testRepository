describe('Admin - Financial Overview', () => {
    beforeEach(() => {
      cy.loginAsAdmin()
      cy.visit('/FinancialOverview')
    })
  
    it('Adds and modifies expenses', () => {
      cy.get('[data-cy=add-expense-btn]').click()
      cy.get('[data-cy=expense-name]').type('Supplies')
      cy.get('[data-cy=expense-amount]').type('250')
      cy.get('[data-cy=save-expense-btn]').click()
      cy.contains('Supplies')
  
      cy.get('[data-cy=edit-expense-btn]').first().click()
      cy.get('[data-cy=expense-amount]').clear().type('300')
      cy.get('[data-cy=save-expense-btn]').click()
      cy.contains('300')
    })
  
    it('Archives an expense and filters sales', () => {
      cy.get('[data-cy=archive-expense-btn]').first().click()
      cy.contains('Archived successfully')
      cy.get('[data-cy=filter-sales-btn]').click()
    })
  })
  