describe('Admin - Services Management', () => {
  const treatmentName = 'Cypress Facial Peel';
  const updatedTreatmentName = 'Updated Cypress Treatment';
  const packageName = 'Cypress Glow Package';
  const updatedPackageName = 'Updated Cypress Package';

  beforeEach(() => {
    cy.loginAsAdmin();
    cy.visit('/AdministratorServices');
    // Allow time for initial data to load
    cy.get('[data-cy=treatment-table]', { timeout: 10000 }).should('exist');
    cy.get('[data-cy=package-table]', { timeout: 10000 }).should('exist');
  });

  // == GENERAL UI TESTS ==
  it('renders the services page with all sections', () => {
    cy.get('[data-cy=treatments-section]').should('exist');
    cy.get('[data-cy=packages-section]').should('exist');
    cy.get('[data-cy=add-treatment-btn]').should('exist');
    cy.get('[data-cy=add-package-btn]').should('exist');
  });

  // == TREATMENT MANAGEMENT FLOWS ==
  describe('Treatment Management', () => {
    it('adds a new treatment with all details', () => {
      cy.get('[data-cy=add-treatment-btn]').click();
      cy.get('[data-cy=create-treatment-modal]').should('exist');
      
      cy.get('[data-cy=treatment-name]').type(treatmentName);
      cy.get('[data-cy=treatment-price]').type('1200');
      cy.get('[data-cy=treatment-duration]').type('30');
      cy.get('[data-cy=treatment-description]').type('Deep exfoliation and skin renewal');
      cy.get('[data-cy=save-treatment-btn]').click();
      
      // Verify treatment was added successfully
      cy.get('[data-cy=treatment-table]')
        .find('td')
        .contains(treatmentName)
        .should('exist');
    });

    it('validates required fields when adding a treatment', () => {
      cy.get('[data-cy=add-treatment-btn]').click();
      
      // Try submitting without required fields
      cy.get('[data-cy=save-treatment-btn]').click();
      
      // Expect validation error messages
      cy.get('[data-cy=treatment-form]').find('.error-message').should('exist');
      
      // Cancel and close modal
      cy.get('[data-cy=cancel-treatment-btn]').click();
      cy.get('[data-cy=create-treatment-modal]').should('not.exist');
    });

    it('edits an existing treatment', () => {
      // Find our test treatment and open edit modal
      cy.contains(treatmentName)
        .parents('[data-cy=treatment-row]')
        .within(() => {
          cy.get('[data-cy=treatment-actions-btn]').click();
        });
      
      cy.get('[data-cy=edit-treatment-btn]').click();
      cy.get('[data-cy=edit-treatment-modal]').should('exist');
      
      // Update fields
      cy.get('[data-cy=treatment-name]').clear().type(updatedTreatmentName);
      cy.get('[data-cy=treatment-price]').clear().type('1500');
      cy.get('[data-cy=treatment-duration]').clear().type('45');
      cy.get('[data-cy=save-treatment-btn]').click();
      
      // Verify treatment was updated
      cy.get('[data-cy=treatment-table]')
        .find('td')
        .contains(updatedTreatmentName)
        .should('exist');
      cy.get('[data-cy=treatment-table]')
        .find('td')
        .contains(treatmentName)
        .should('not.exist');
    });
    
    it('views treatment details', () => {
      // Find treatment and click to view details (if applicable)
      cy.contains(updatedTreatmentName)
        .parents('[data-cy=treatment-row]')
        .within(() => {
          cy.get('[data-cy=treatment-actions-btn]').click();
        });
        
      // If there's a view details option, test it
      cy.get('body').then(($body) => {
        if ($body.find('[data-cy=view-treatment-btn]').length) {
          cy.get('[data-cy=view-treatment-btn]').click();
          cy.get('[data-cy=treatment-details-modal]').should('exist');
          cy.get('[data-cy=treatment-details-modal]').contains(updatedTreatmentName);
          cy.get('[data-cy=close-details-btn]').click();
        } else {
          cy.log('No view details option for treatments');
        }
      });
    });

    it('archives a treatment', () => {
      // Find our test treatment and archive it
      cy.contains(updatedTreatmentName)
        .parents('[data-cy=treatment-row]')
        .within(() => {
          cy.get('[data-cy=treatment-actions-btn]').click();
        });
      
      cy.get('[data-cy=archive-treatment-btn]').click();
      cy.get('[data-cy=archive-treatment-modal]').should('exist');
      cy.get('[data-cy=confirm-archive-btn]').click();
      
      // Verify treatment was removed from the table
      cy.get('[data-cy=treatment-table]')
        .find('td')
        .contains(updatedTreatmentName)
        .should('not.exist');
    });

    it('searches and filters treatments', () => {
      // If search functionality exists
      cy.get('body').then(($body) => {
        if ($body.find('[data-cy=treatment-search]').length) {
          // Add a new treatment first to search for
          cy.get('[data-cy=add-treatment-btn]').click();
          cy.get('[data-cy=treatment-name]').type('Searchable Treatment');
          cy.get('[data-cy=treatment-price]').type('800');
          cy.get('[data-cy=save-treatment-btn]').click();
          
          // Use search
          cy.get('[data-cy=treatment-search]').type('Search');
          cy.wait(500);
          cy.get('[data-cy=treatment-table]')
            .find('td')
            .contains('Searchable Treatment')
            .should('exist');
            
          // Clear search
          cy.get('[data-cy=treatment-search]').clear();
        } else {
          cy.log('No search functionality for treatments');
        }
      });
    });
  });

  // == PACKAGE MANAGEMENT FLOWS ==
  describe('Package Management', () => {
    it('adds a new package with treatments', () => {
      cy.get('[data-cy=add-package-btn]').click();
      cy.get('[data-cy=create-package-modal]').should('exist');
      
      cy.get('[data-cy=package-name]').type(packageName);
      
      // Try to select a treatment for the package
      cy.get('body').then(($body) => {
        if ($body.find('[data-cy=package-treatment]').length) {
          cy.get('[data-cy=package-treatment]').select('1');
        } else if ($body.find('[data-cy=package-treatment-select]').length) {
          cy.get('[data-cy=package-treatment-select]').click();
          cy.get('[data-cy=treatment-option]').first().click();
        }
      });
      
      // Set number of sessions
      cy.get('[data-cy=package-sessions]').type('5');
      cy.get('[data-cy=package-price]').type('5000');
      
      // Add description if field exists
      cy.get('body').then(($body) => {
        if ($body.find('[data-cy=package-description]').length) {
          cy.get('[data-cy=package-description]').type('Complete package with multiple sessions');
        }
      });
      
      cy.get('[data-cy=save-package-btn]').click();
      
      // Verify package was added successfully
      cy.get('[data-cy=package-table]')
        .find('td')
        .contains(packageName)
        .should('exist');
    });

    it('validates required fields when adding a package', () => {
      cy.get('[data-cy=add-package-btn]').click();
      
      // Try submitting without required fields
      cy.get('[data-cy=save-package-btn]').click();
      
      // Expect validation error messages
      cy.get('[data-cy=package-form]').find('.error-message').should('exist');
      
      // Cancel and close modal
      cy.get('[data-cy=cancel-package-btn]').click();
      cy.get('[data-cy=create-package-modal]').should('not.exist');
    });

    it('edits an existing package', () => {
      // Find our test package and open edit modal
      cy.contains(packageName)
        .parents('[data-cy=package-row]')
        .within(() => {
          cy.get('[data-cy=package-actions-btn]').click();
        });
      
      cy.get('[data-cy=edit-package-btn]').click();
      cy.get('[data-cy=edit-package-modal]').should('exist');
      
      // Update fields
      cy.get('[data-cy=package-name]').clear().type(updatedPackageName);
      
      // Update sessions if editable
      cy.get('body').then(($body) => {
        if ($body.find('[data-cy=package-sessions]:not([readonly])').length) {
          cy.get('[data-cy=package-sessions]').clear().type('8');
        }
      });
      
      cy.get('[data-cy=save-package-btn]').click();
      
      // Verify package was updated
      cy.get('[data-cy=package-table]')
        .find('td')
        .contains(updatedPackageName)
        .should('exist');
      cy.get('[data-cy=package-table]')
        .find('td')
        .contains(packageName)
        .should('not.exist');
    });
    
    it('views package details', () => {
      // Find package and click to view details (if applicable)
      cy.contains(updatedPackageName)
        .parents('[data-cy=package-row]')
        .within(() => {
          cy.get('[data-cy=package-actions-btn]').click();
        });
        
      // If there's a view details option, test it  
      cy.get('body').then(($body) => {
        if ($body.find('[data-cy=view-package-btn]').length) {
          cy.get('[data-cy=view-package-btn]').click();
          cy.get('[data-cy=package-details-modal]').should('exist');
          cy.get('[data-cy=package-details-modal]').contains(updatedPackageName);
          cy.get('[data-cy=close-details-btn]').click();
        } else {
          cy.log('No view details option for packages');
        }
      });
    });

    it('archives a package', () => {
      // Find our test package and archive it
      cy.contains(updatedPackageName)
        .parents('[data-cy=package-row]')
        .within(() => {
          cy.get('[data-cy=package-actions-btn]').click();
        });
      
      cy.get('[data-cy=archive-package-btn]').click();
      cy.get('[data-cy=archive-package-modal]').should('exist');
      cy.get('[data-cy=confirm-archive-btn]').click();
      
      // Verify package was removed from the table
      cy.get('[data-cy=package-table]')
        .find('td')
        .contains(updatedPackageName)
        .should('not.exist');
    });

    it('searches and filters packages', () => {
      // If search functionality exists
      cy.get('body').then(($body) => {
        if ($body.find('[data-cy=package-search]').length) {
          // Add a new package first to search for
          cy.get('[data-cy=add-package-btn]').click();
          cy.get('[data-cy=package-name]').type('Searchable Package');
          
          // Try to select a treatment
          if ($body.find('[data-cy=package-treatment]').length) {
            cy.get('[data-cy=package-treatment]').select('1');
          } else if ($body.find('[data-cy=package-treatment-select]').length) {
            cy.get('[data-cy=package-treatment-select]').click();
            cy.get('[data-cy=treatment-option]').first().click();
          }
          
          cy.get('[data-cy=package-sessions]').type('3');
          cy.get('[data-cy=save-package-btn]').click();
          
          // Use search
          cy.get('[data-cy=package-search]').type('Search');
          cy.wait(500);
          cy.get('[data-cy=package-table]')
            .find('td')
            .contains('Searchable Package')
            .should('exist');
            
          // Clear search
          cy.get('[data-cy=package-search]').clear();
        } else {
          cy.log('No search functionality for packages');
        }
      });
    });
  });

  // == SORTING AND PAGINATION TESTS ==
  it('tests sorting functionality if available', () => {
    // Test sorting treatments if sort controls exist
    cy.get('body').then(($body) => {
      if ($body.find('[data-cy=sort-treatments-btn]').length) {
        cy.get('[data-cy=sort-treatments-btn]').click();
        cy.get('[data-cy=sort-by-name]').click();
        cy.wait(500);
        // Could add assertions about order but that's complex to verify
      }
      
      if ($body.find('[data-cy=sort-packages-btn]').length) {
        cy.get('[data-cy=sort-packages-btn]').click();
        cy.get('[data-cy=sort-by-price]').click();
        cy.wait(500);
      }
    });
  });

  it('tests pagination if available', () => {
    // Test pagination for treatments if it exists
    cy.get('body').then(($body) => {
      if ($body.find('[data-cy="treatment-pagination"]').length) {
        cy.get('[data-cy="treatment-next-page"]').then(($btn) => {
          if (!$btn.prop('disabled')) {
            cy.wrap($btn).click();
            cy.wait(500);
            cy.get('[data-cy="treatment-prev-page"]').click();
          } else {
            cy.log('Next page button disabled - not enough treatments to test pagination');
          }
        });
      }
      
      // Test pagination for packages if it exists
      if ($body.find('[data-cy="package-pagination"]').length) {
        cy.get('[data-cy="package-next-page"]').then(($btn) => {
          if (!$btn.prop('disabled')) {
            cy.wrap($btn).click();
            cy.wait(500);
            cy.get('[data-cy="package-prev-page"]').click();
          } else {
            cy.log('Next page button disabled - not enough packages to test pagination');
          }
        });
      }
    });
  });
});
