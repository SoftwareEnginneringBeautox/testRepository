Cypress.Commands.add('loginAsAdmin', () => {
    cy.viewport(1280, 720); 
    cy.visit('/login')
    cy.get('[data-cy="login-username"]').type('lawrence', { force: true })
    cy.get('[data-cy=login-password]').type('12345', { force: true })
    cy.get('[data-cy=login-submit]').click()
    cy.url().should('include', '/AdminDashboard')
  })
  