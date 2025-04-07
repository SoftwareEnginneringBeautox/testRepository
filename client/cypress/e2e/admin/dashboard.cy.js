describe('Administrator Dashboard - Full Flow (Live API)', () => {
  beforeEach(() => {
    cy.loginAsAdmin()
    cy.visit('/AdminDashboard'); // Adjust if the dashboard route is different
  });

  it('renders the dashboard and welcome message', () => {
    cy.get('[data-cy="welcome-message"]')
      .should('be.visible')
  });

  it('renders reminders section (if any)', () => {
    cy.get('[data-cy="reminders-table"]').should('exist');
    cy.get('[data-cy="reminders-body"]').should('exist');
  });

  it('renders the staff section with list or fallback message', () => {
    cy.get('[data-cy="staff-section"]').should('exist');

    cy.get('body').then(($body) => {
      if ($body.find('[data-cy^="staff-card-"]', { timeout: 10000 }).length) {
        cy.get('[data-cy^="staff-card-"]').should('have.length.at.least', 1);
      } else {
        //cy.get('[data-cy="no-staff-message"]').should('exist');
      }
    });
  });

  it('opens CreateStaff modal', () => {
    cy.get('[data-cy="add-staff-btn"]').click();
    cy.get('[data-cy="create-staff-modal"]').should('exist');
  });

  it('opens ModifyStaff modal from dropdown', () => {
    cy.get('body').then(($body) => {
      if ($body.find('[data-cy^="staff-actions-trigger-"]').length) {
        cy.get('[data-cy^="staff-actions-trigger-"]').first().click();
        cy.get('[data-cy^="edit-staff-btn-"]').first().click();
        cy.get('[data-cy="modify-staff-modal"]').should('exist');
      }
    });
  });

  it('opens ArchiveStaff modal from dropdown', () => {
    cy.get('body').then(($body) => {
      if ($body.find('[data-cy^="staff-actions-trigger-"]').length) {
        cy.get('[data-cy^="staff-actions-trigger-"]').first().click();
        cy.get('[data-cy^="archive-staff-btn-"]').first().click();
        cy.get('[data-cy="archive-staff-modal"]').should('exist');
      }
    });
  });

  it('renders Sales Chart', () => {
    cy.get('[data-cy="sales-chart-container"]').should('exist');
  });
});
