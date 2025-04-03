Cypress.Commands.add('loginAsAdmin', () => {
    cy.visit('/login')
    cy.get('[data-cy=email]').type('lawrence')
    cy.get('[data-cy=password]').type('12345')
    cy.get('[data-cy=login-btn]').click()
    cy.url().should('include', '/AdminDashboard'),
    cy.get('[data-cy=admin-dashboard]').should('exist')
  })
  