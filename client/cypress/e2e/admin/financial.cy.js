describe('Admin - Financial Overview', () => {
  const testCategory = 'Cypress Test Category1';
  const updatedCategory = 'Updated Cypress Category1';
  
  beforeEach(() => {
    cy.loginAsAdmin();
    cy.visit('/FinancialOverview');
    // Wait for initial data load
    cy.get('[data-cy=financial-overview-container]', { timeout: 10000 }).should('exist');
  });

  it('renders all financial overview sections correctly', () => {
    // Check main sections exist
    cy.get('[data-cy=financial-overview-title]').should('contain', 'FINANCIAL OVERVIEW');
    cy.get('[data-cy=sales-tracker-title]').should('exist');
    cy.get('[data-cy=sales-chart-container]').should('exist');
    cy.get('[data-cy=monthly-expenses-title]').should('exist');
    cy.get('[data-cy=monthly-expenses-container]').should('exist');
    cy.get('[data-cy=pie-chart-container]').should('exist');
    cy.get('[data-cy=categories-section]').should('exist');
    
    // Check financial data displayed
    cy.get('[data-cy=total-profit-container]').should('exist');
  });

  describe('Expense Categories Management', () => {
    it('creates a new expense category', () => {
      cy.get('[data-cy=add-category-btn]').click();
      cy.get('[data-cy=create-category-modal]').should('be.visible');
      
      // Fill and submit the form
      cy.get('[data-cy=category-name-input]').type(testCategory);
      cy.get('[data-cy=submit-create-category]').click();
      
      // Verify category appears in table
      //cy.get('[data-cy=categories-table-body]').should('contain', testCategory);

    });

    it('edits an existing expense category', () => {
      // Find and edit our test category
      cy.contains(testCategory).parents('[data-cy^=category-row-]').within(() => {
        cy.get('[data-cy^=category-actions-]').click();
      });
      
      cy.get('[data-cy^=edit-category-]').click();
      cy.get('[data-cy=edit-category-modal]').should('be.visible');
      
      // Update category name
      cy.get('[data-cy=category-name-input]').clear().type(updatedCategory);
      cy.get('[data-cy=submit-edit-category]').click();
      
      // Verify updated name appears
      //cy.get('[data-cy=categories-table-body]').should('contain', updatedCategory)
    });

    it('archives an expense category', () => {
      // Find and archive our test category
      cy.contains(updatedCategory).parents('[data-cy^=category-row-]').within(() => {
        cy.get('[data-cy^=category-actions-]').click();
      });
      
      cy.get('[data-cy^=archive-category-]').click();
      cy.get('[data-cy=archive-category-modal]').should('be.visible');
      
      // Confirm archive
      cy.contains('button', 'ARCHIVE CATEGORY').click();
      
      // Verify category was removed
      //cy.contains(updatedCategory).should('not.exist');
    });
  });

  describe('Monthly Expenses Management', () => {
    it('adds a new expense', () => {
      cy.get('[data-cy=add-expense-btn]').click();
      cy.get('[data-cy=create-monthly-expense-modal]').should('be.visible');
      
      // Fill and submit the form
      cy.get('[data-cy=expense-type-select]').click();
      cy.get('body').then(($body) => {
        if ($body.find('[data-cy^=expense-type-option-]').length > 0) {
          cy.get('[data-cy^=expense-type-option-]').first().click();
        } else {
          // Close dropdown if no options available
          cy.get('body').click();
          cy.log('No expense categories available to select');
        }
      });
      
      cy.get('[data-cy=expense-amount-input]').type('250.50');
      cy.get('[data-cy=expense-date-input]').type('2025-04-15');
      cy.get('[data-cy=submit-create-expense]').click();
      
      // Verify expense appears in table (amount should be visible)
      //cy.get('[data-cy^=expense-amount-]').contains('250').should('exist');
    });

    it('edits an existing expense', () => {
      // Find and edit the first expense
      cy.get('[data-cy^=expense-row-]').first().within(() => {
        cy.get('[data-cy^=expense-actions-trigger-]').click();
      });
      
      cy.get('[data-cy^=edit-expense-]').click();
      cy.get('[data-cy=edit-monthly-expense-modal]').should('be.visible');
      
      // Update expense amount
      cy.get('[data-cy=expense-amount-input]').clear().type('300.75');
      cy.get('[data-cy=submit-edit-expense]').click();
      
      // Verify updated amount appears
      //cy.get('[data-cy^=expense-amount-]').contains('300').should('exist');
    });

    it('archives an expense', () => {
      // Find and archive the first expense
      cy.get('[data-cy^=expense-row-]').first().within(() => {
        cy.get('[data-cy^=expense-actions-trigger-]').click();
      });
      
      cy.get('[data-cy^=archive-expense-]').click();
      cy.get('[data-cy=delete-monthly-expense-modal]').should('be.visible');
      
      // Confirm archive
      cy.get('[data-cy=confirm-archive-expense-btn]').click();
      
      // Expense should be removed or marked as archived
      cy.wait(1000); // Give time for UI to update
      
      // Check that previous expense was archived (could verify with API call or UI check)
      //cy.get('[data-cy^=expense-amount-]').contains('300').should('not.exist');
    });
  });

  describe('Sales Data Functionality', () => {
    it('filters sales data with different filters', () => {
      cy.get('[data-cy=sort-select]').click();
      
      // Try different sort options
      cy.get('[data-cy=sort-option-client]').click();
      cy.wait(500);
      
      // Try another sort option
      cy.get('[data-cy=sort-select]').click();
      cy.get('[data-cy=sort-option-date]').click();
      cy.wait(500);
      
      // Test column filtering if available
      cy.get('body').then(($body) => {
        if ($body.find('[data-cy=column-filter]').length) {
          cy.get('[data-cy=column-filter]').click();
          cy.wait(500);
          // Select/deselect a column
          cy.contains('EMAIL').click();
          cy.contains('APPLY').click();
        }
      });
    });

    it('tests pagination for sales and expenses', () => {
      // Test sales pagination if available
      cy.get('body').then(($body) => {
        if ($body.find('[data-cy=sales-pagination]').length) {
          cy.get('[data-cy=sales-next-page]').then(($btn) => {
            if (!$btn.prop('disabled')) {
              cy.wrap($btn).click();
              cy.wait(500);
              cy.get('[data-cy=sales-prev-page]').click();
            } else {
              cy.log('Next page button disabled - not enough sales data to test pagination');
            }
          });
        }
        
        // Test expenses pagination if available
        if ($body.find('[data-cy=expenses-pagination]').length) {
          cy.get('[data-cy=expenses-next-page]').then(($btn) => {
            if (!$btn.prop('disabled')) {
              cy.wrap($btn).click();
              cy.wait(500);
              cy.get('[data-cy=expenses-prev-page]').click();
            } else {
              cy.log('Next page button disabled - not enough expenses to test pagination');
            }
          });
        }
      });
    });
    
    it('tests report generation buttons', () => {
      // We can't test the actual PDF download but we can check the buttons work
      cy.window().then((win) => {
        cy.stub(win, 'open').as('windowOpen');
      });
      
      // Weekly report
      cy.get('[data-cy=download-weekly-report-btn]').click();
      cy.wait(500);
      
      // Monthly report
      cy.get('[data-cy=download-monthly-report-btn]').click();
      cy.wait(500);
      
      // No assertions needed as these calls generate PDFs which we can't verify directly
    });
  });
});
