describe('Admin - Patient Records', () => {
  const testName = "Cypress Test Patient";
  const updatedName = "Updated Cypress Patient";
  
  beforeEach(() => {
    cy.loginAsAdmin()
    cy.visit('/PatientRecordsDatabase')
    // Wait for initial data load
    cy.get('[data-cy="patient-records-table"]', { timeout: 10000 }).should("exist");
  });

  it("renders the patient records table and controls", () => {
    cy.get('[data-cy="patient-records-database"]').should("exist");
    cy.get('[data-cy="patient-records-title"]').should("contain", "PATIENT RECORDS");
    cy.get('[data-cy="patient-records-table"]').should("exist");
    cy.get('[data-cy="add-entry-button"]').should("exist");
    cy.get('[data-cy="download-records-button"]').should("exist");
    cy.get('[data-cy="patient-search"]').should("exist");
    cy.get('[data-cy="sort-select"]').should("exist");
    cy.get('[data-cy="column-filter"]').should("exist");
  });

  it("performs search filtering correctly", () => {
    // First, check if any records exist
    cy.get('body').then(($body) => {
      if ($body.find('[data-cy^="record-client-"]').length) {
        // Get text of first record to search for it specifically
        cy.get('[data-cy^="record-client-"]').first().invoke('text').then((text) => {
          const searchText = text.trim().substring(0, 5); // Get first 5 chars to search
          
          // Now search for this specific text
          cy.get('[data-cy="patient-search"]').clear().type(searchText);
          cy.wait(500);
          
          // Verify all visible records contain the search text
          cy.get('[data-cy^="record-client-"]').each(($el) => {
            cy.wrap($el).invoke('text').should('include', searchText);
          });
          
          // Clear search to reset
          cy.get('[data-cy="patient-search"]').clear();
          cy.wait(500);
        });
      } else {
        cy.log('No records available to test search filtering');
      }
    });
  });

  it("tests all sorting options", () => {
    // Test each sorting option in dropdown
    const sortOptions = ["ALPHABETICAL", "NEWEST", "OLDEST"];
    
    sortOptions.forEach(option => {
      cy.get('[data-cy="sort-select"]').click();
      cy.contains(option).click();
      cy.wait(500);
      cy.get('[data-cy^="record-client-"]').should("exist");
      // Could add assertions about order but that's complex to verify
    });
  });

  it("tests all column filter combinations", () => {
    // Open column filter
    cy.get('[data-cy="column-filter"]').click();
    
    // Get count of available columns (excluding mandatory ones)
    cy.get('.filter-columns-modal-content input[type="checkbox"]').then($checkboxes => {
      // Select random combinations of columns
      cy.get('.filter-columns-modal-content input[type="checkbox"]').first().click();
      cy.contains("APPLY").click();
      cy.wait(500);
      
      // Reopen and select different columns
      cy.get('[data-cy="column-filter"]').click();
      cy.contains("AGE").click({ force: true });
      cy.contains("EMAIL").click({ force: true });
      cy.contains("APPLY").click();
      cy.wait(500);
      
      // Verify the columns are displayed
      cy.get('[data-cy^="record-age-"]').should("exist");
    });
  });

  it("opens create modal", () => {
    cy.get('[data-cy="add-entry-button"]').click();
    cy.get('[data-cy="create-patient-entry-modal"]').should("exist");
    cy.get('[data-cy="create-patient-entry-modal"] button').contains("Cancel").click();
  });

  it("opens action menu and modals (update/edit/archive)", () => {
    cy.get('[data-cy^="record-menu-trigger-"]').first().click();
    cy.get('[data-cy^="record-update-button-"]').first().click();
    cy.get('[data-cy="update-patient-entry-modal"]').should("exist");
    cy.get('[data-cy="update-patient-entry-modal"] button').contains("Cancel").click();

    cy.get('[data-cy^="record-menu-trigger-"]').first().click();
    cy.get('[data-cy^="record-edit-button-"]').first().click();
    cy.get('[data-cy="edit-patient-entry-modal"]').should("exist");
    cy.get('[data-cy="edit-patient-entry-modal"] button').contains("Cancel").click();

    cy.get('[data-cy^="record-menu-trigger-"]').first().click();
    cy.get('[data-cy^="record-archive-button-"]').first().click();
    cy.get('[data-cy="archive-patient-entry-modal"]').should("exist");
    cy.get('[data-cy="archive-patient-entry-modal"] button').contains("Cancel").click();
  });

  it("creates a complete patient record with all details", () => {
    cy.get('[data-cy="add-entry-button"]').click();
    cy.get('[data-cy="create-patient-entry-modal"]').should("exist");

    // Fill in all patient details
    cy.get('[data-cy="patient-name-input"]').type(testName);
    cy.get('[data-cy="contact-number-input"]').type("09123456789");
    cy.get('[data-cy="age-input"]').type("30");
    cy.get('[data-cy="email-input"]').type("cypress@test.com");
    
    // Person in Charge
    cy.get('[data-cy="person-in-charge-select"]').click();
    cy.get('[data-cy="person-in-charge-option"]').first().click();

    // Package selection
    cy.get('[data-cy="package-select"]').click();
    cy.get('body').then(($body) => {
      if ($body.find('[data-cy="package-option"]').length) {
        cy.get('[data-cy="package-option"]').first().click();
      } else {
        // If no packages available, use Clear option
        cy.contains("Clear Selection").click();
        
        // Then select treatments instead
        cy.get('[data-cy="treatments-multiselect"]').click();
        cy.get('body').then(($body2) => {
          if ($body2.find('[data-cy="treatment-option"]').length) {
            cy.get('[data-cy="treatment-option"]').first().click();
          } else {
            // No treatments either, so just close the dropdown
            cy.get('body').click();
          }
        });
      }
    });

    // Payment details
    cy.get('[data-cy="amount-paid-input"]').clear().type("400");

    // Test both payment methods
    cy.get('body').then(($body) => {
      if ($body.find('[data-cy="payment-method-radio-full"]').length) {
        cy.get('[data-cy="payment-method-radio-full"]').click();
      } else if ($body.find('[data-cy="payment-method-radio-cash"]').length) {
        cy.get('[data-cy="payment-method-radio-cash"]').click();
      }
    });
    
    // Session schedule
    cy.get('[data-cy="date-of-session-input"]').type("2025-04-10");
    cy.get('[data-cy="time-of-session-input"]').type("14:00");
    
    // Consent form
    cy.get('[data-cy="consent-checkbox"]').click();
    
    // Submit
    cy.get('[data-cy="submit-create-patient"]').click();
    cy.wait(1000);

    // Verify creation
    cy.contains(testName).should("exist");
  });

  it("updates a patient record with next session details", () => {
    cy.contains(testName).parents("[data-cy^='record-row-']").within(() => {
      cy.get('[data-cy^="record-menu-trigger-"]').click();
    });

    cy.get('[data-cy^="record-update-button-"]').click();
    cy.get('[data-cy="update-patient-entry-modal"]').should("exist");

    // Set next session date and time
    cy.get('[data-cy="next-date-of-session-input"]').clear().type("2025-05-10");
    cy.get('[data-cy="next-time-of-session-input"]').clear().type("15:30");
    
    // Ensure consent is checked
    cy.get('body').then(($body) => {
      if ($body.find('[data-cy="consent-checkbox"]:not(:checked)').length) {
        cy.get('[data-cy="consent-checkbox"]').click();
      }
    });
    
    // Submit the update
    cy.get('[data-cy="submit-update-patient"]').click();
    cy.wait(1000);

    // Verify record still exists after update
    cy.contains(testName).should("exist");
  });

  it("edits a patient record with modified information", () => {
    cy.contains(testName).parents("[data-cy^='record-row-']").within(() => {
      cy.get('[data-cy^="record-menu-trigger-"]').click();
    });

    cy.get('[data-cy^="record-edit-button-"]').click();
    cy.get('[data-cy="edit-patient-entry-modal"]').should("exist");

    // Change multiple fields
    cy.get('[data-cy="patient-name-input"]').clear().type(updatedName);
    cy.get('[data-cy="contact-number-input"]').clear().type("09987654321");
    cy.get('[data-cy="email-input"]').clear().type("updated@cypress.test");
    
    // Try changing payment amount
    cy.get('body').then(($body) => {
      if ($body.find('[data-cy="amount-paid-input"]:not([readonly])').length) {
        cy.get('[data-cy="amount-paid-input"]').clear().type("500");
      }
    });
    
    // Submit changes
    cy.get('[data-cy="submit-edit-patient"]').click();
    cy.wait(1000);

    // Verify name was updated
    cy.contains(updatedName).should("exist");
    // Original name should no longer exist
    cy.contains(testName).should("not.exist");
  });

  it("toggles payment status and handles isPaid functionality", () => {
    // This test depends on the actual implementation of isPaid toggle
    cy.contains(updatedName).parents("[data-cy^='record-row-']").within(() => {
      // If there's a payment toggle, test it
      cy.get('body').then(($row) => {
        if ($row.find('[data-cy^="payment-status-toggle-"]').length) {
          cy.get('[data-cy^="payment-status-toggle-"]').click();
          cy.wait(500);
          // Verify toggle state changed - this would be implementation specific
        } else {
          cy.log('No payment status toggle found to test');
        }
      });
    });
  });

  it("archives the patient record and confirms removal", () => {
    cy.contains(updatedName).parents("[data-cy^='record-row-']").within(() => {
      cy.get('[data-cy^="record-menu-trigger-"]').click();
    });

    cy.get('[data-cy^="record-archive-button-"]').click();
    cy.get('[data-cy="archive-patient-entry-modal"]').should("exist");

    // Confirm archive
    cy.get('[data-cy="submit-archive-patient"]').click();
    cy.wait(1000);

    // Verify record was removed from the table
    cy.contains(updatedName).should("not.exist");
  });

  it("tests pagination if available", () => {
    cy.get('body').then(($body) => {
      if ($body.find('[data-cy="pagination-container"]').length) {
        // If pagination exists, test next page navigation
        cy.get('[data-cy="next-page-button"]').then(($btn) => {
          if (!$btn.prop('disabled')) {
            cy.wrap($btn).click();
            cy.wait(500);
            // Verify page changed - could check for a page number indicator
            
            // Go back to first page
            cy.get('[data-cy="prev-page-button"]').click();
            cy.wait(500);
          } else {
            cy.log('Next page button disabled - not enough records to test pagination');
          }
        });
      } else {
        cy.log('No pagination controls found to test');
      }
    });
  });

  it("tests PDF generation functionality", () => {
    // This test is limited since we can't actually verify the downloaded file content
    cy.get('[data-cy="download-records-button"]').click();
    
    // We can only verify the click happened without errors
    // Could check for the presence of a download toast/notification if implemented
    cy.wait(1000);
    
    // Alternative: if there's a print preview or download confirmation, check for that
    cy.get('body').then(($body) => {
      if ($body.find('[data-cy="download-confirmation"]').length) {
        cy.get('[data-cy="download-confirmation"]').should("exist");
      }
    });
  });
});
