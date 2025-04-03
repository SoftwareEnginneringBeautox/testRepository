Cypress.Commands.add('loginAsAdmin', () => {
    cy.visit('/login')
    cy.get('[data-cy=email]').type('admin@example.com')
    cy.get('[data-cy=password]').type('password123')
    cy.get('[data-cy=login-btn]').click()
    cy.url().should('include', '/admin')
  })
  