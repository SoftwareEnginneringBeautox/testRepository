describe('Admin - Patient Records', () => {
  const testName = "Cypress Test Patient";
  const updatedName = "Updated Cypress Patient";
  
  beforeEach(() => {
    cy.loginAsAdmin()
    cy.visit('/PatientRecordsDatabase')
  })

  it("renders the patient records table and controls", () => {
    cy.get('[data-cy="patient-records-database"]').should("exist");
    cy.get('[data-cy="patient-records-title"]').should("contain", "PATIENT RECORDS");
    cy.get('[data-cy="patient-records-table"]').should("exist");
  });

  it("performs search filtering", () => {
    cy.get('[data-cy="patient-search"]').clear().type("Test Patient 1");
    cy.get('[data-cy^="record-client-"]').each(($el) => {
      cy.wrap($el).should("contain.text", "Test Patient 1");
    });
  });

  it("changes sorting option", () => {
    cy.get('[data-cy="sort-select"]').click();
    cy.contains("ALPHABETICAL").click();
    cy.wait(500);
    cy.get('[data-cy^="record-client-"]').should("exist");
  });

  it("opens and applies column filters", () => {
    cy.get('[data-cy="column-filter"]').click();
    cy.contains("AGE").click();
    cy.contains("APPLY").click();
    cy.get('[data-cy^="record-age-"]').should("exist");
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

  it("creates a new patient record", () => {
    cy.get('[data-cy="add-entry-button"]').click();
    cy.get('[data-cy="create-patient-entry-modal"]').should("exist");

    cy.get('[data-cy="patient-name-input"]').type(testName);
    cy.get('[data-cy="contact-number-input"]').type("09123456789");
    cy.get('[data-cy="age-input"]').type("30");
    cy.get('[data-cy="email-input"]').type("cypress@test.com");
    // Person in Charge
    cy.get('[data-cy="person-in-charge-select"]').click();
    cy.get('[data-cy="person-in-charge-option"]').first().click();

    // Package
    cy.get('[data-cy="package-select"]').click();
    cy.get('[data-cy="package-option"]').first().click();

    // Discount & Payment Details
    cy.get('[data-cy="package-discount-input"]').clear().type("100");
    cy.get('[data-cy="amount-paid-input"]').clear().type("400");

    // Payment Method (radio buttons)
    cy.get('[data-cy="payment-method-radio-cash"]').click(); // or .check() for <input type="radio">
    
    // Session Schedule
    cy.get('[data-cy="date-of-session-input"]').type("2025-04-10");
    cy.get('[data-cy="time-of-session-input"]').type("14:00");
    
    // Submit
    cy.get('[data-cy="submit-create-patient"]').click();
    cy.wait(1000);

    cy.contains(testName).should("exist");
  });

  it("edits the newly created patient record", () => {
    cy.contains(testName).parents("[data-cy^='record-row-']").within(() => {
      cy.get('[data-cy^="record-menu-trigger-"]').click();
    });

    cy.get('[data-cy^="record-edit-button-"]').click();
    cy.get('[data-cy="edit-patient-entry-modal"]').should("exist");

    cy.get('[data-cy="patient-name-input"]').clear().type(updatedName);
    cy.get('[data-cy="submit-edit-patient"]').click();
    cy.wait(1000);

    cy.contains(updatedName).should("exist");
  });

  it("archives the updated patient record", () => {
    cy.contains(updatedName).parents("[data-cy^='record-row-']").within(() => {
      cy.get('[data-cy^="record-menu-trigger-"]').click();
    });

    cy.get('[data-cy^="record-archive-button-"]').click();
    cy.get('[data-cy="archive-patient-entry-modal"]').should("exist");

    cy.get('[data-cy="submit-archive-patient"]').click();
    cy.wait(1000);

    cy.contains(updatedName).should("not.exist");
  });

  it("downloads patient records PDF", () => {
    cy.get('[data-cy="download-records-button"]').click();
    // PDF download can't be verified easily without plugin, but you can check console
  });
})
