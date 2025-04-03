Cypress.Commands.add('loginAsAdmin', () => {
    cy.visit('/login')
    cy.get('[data-cy="login-username"]').type('lawrence')
    cy.get('[data-cy=login-password]').type('12345')
    cy.get('[data-cy=login-submit]').click()
    cy.url().should('include', '/AdminDashboard')
  })
  