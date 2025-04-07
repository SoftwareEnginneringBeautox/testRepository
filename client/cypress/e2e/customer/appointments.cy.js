describe('Customer - Public Appointment Flow', () => {
  const testCustomerName = 'Cypress Test Customer';
  const testCustomerEmail = 'test@cypress.example';
  const testCustomerPhone = '09123456789';
  const testCustomerAge = '30';

  beforeEach(() => {
    cy.visit('/appointments');
    // Wait for initial data load
    cy.get('[data-cy=service-card]', { timeout: 10000 }).should('exist');
  });

  // === UI RENDERING TESTS ===
  it('renders the appointment page with all required elements', () => {
    cy.get('[data-cy=appointment-page]').should('exist');
    cy.get('[data-cy=service-selection-section]').should('exist');
    cy.get('[data-cy=service-card]').should('have.length.at.least', 1);
    cy.get('[data-cy=service-card]').first().find('img').should('have.attr', 'src');
    cy.get('[data-cy=service-card]').first().find('[data-cy=service-name]').should('exist');
  });

  // === SERVICE SELECTION FLOWS ===
  it('displays service details when a service is selected', () => {
    // Select the first service
    cy.get('[data-cy=service-card]').first().click();
    
    // Verify service details are displayed
    cy.get('[data-cy=service-details]').should('be.visible');
    cy.get('[data-cy=service-price]').should('exist');
    cy.get('[data-cy=service-description]').should('exist');
    
    // Verify the "select another service" option
    cy.get('[data-cy=back-to-services]').should('exist');
    cy.get('[data-cy=back-to-services]').click();
    
    // Verify we're back to service selection
    cy.get('[data-cy=service-selection-section]').should('be.visible');
    
    // Select a different service if multiple exist
    cy.get('[data-cy=service-card]').then(($cards) => {
      if ($cards.length > 1) {
        cy.get('[data-cy=service-card]').eq(1).click();
        cy.get('[data-cy=service-details]').should('be.visible');
      }
    });
  });

  // === CALENDAR AND TIME SELECTION TESTS ===
  it('navigates through calendar and selects dates and times', () => {
    cy.get('[data-cy=service-card]').first().click();
    
    // Calendar should be visible
    cy.get('[data-cy=calendar]').should('be.visible');
    
    // Test calendar navigation (next/previous month)
    cy.get('[data-cy=calendar-month]').invoke('text').then((initialMonth) => {
      cy.get('[data-cy=next-month]').click();
      cy.get('[data-cy=calendar-month]').should('not.have.text', initialMonth);
      
      // Go back to initial month
      cy.get('[data-cy=prev-month]').click();
      cy.get('[data-cy=calendar-month]').should('have.text', initialMonth);
    });
    
    // Select an available date (15th of month)
    cy.get('[data-cy=calendar-day]').contains('15').click();
    
    // Time slots should appear
    cy.get('[data-cy=time-slots-container]').should('be.visible');
    cy.get('[data-cy=time-slot]').should('have.length.at.least', 1);
    
    // Select a time slot
    cy.get('[data-cy=time-slot]').contains('10:00 AM').click();
    
    // The selected time slot should be highlighted
    cy.get('[data-cy=time-slot].selected').should('exist');
    
    // Try selecting a different time
    cy.get('[data-cy=time-slot]').contains('2:00 PM').click();
    cy.get('[data-cy=time-slot].selected').contains('2:00 PM').should('exist');
  });

  // === FORM VALIDATION TESTS ===
  it('validates customer information form fields', () => {
    cy.get('[data-cy=service-card]').first().click();
    cy.get('[data-cy=calendar-day]').contains('15').click();
    cy.get('[data-cy=time-slot]').first().click();
    
    // Form should be visible
    cy.get('[data-cy=customer-form]').should('be.visible');
    
    // Try submitting without required fields
    cy.get('[data-cy=submit-appointment-btn]').click();
    
    // Validation errors should appear
    cy.get('[data-cy=form-error]').should('be.visible');
    
    // Fill out fields one by one and check validation
    cy.get('[data-cy=customer-name]').type(testCustomerName);
    cy.get('[data-cy=submit-appointment-btn]').click();
    cy.get('[data-cy=form-error]').should('be.visible');
    
    cy.get('[data-cy=customer-contact]').type(testCustomerPhone);
    cy.get('[data-cy=submit-appointment-btn]').click();
    cy.get('[data-cy=form-error]').should('be.visible');
    
    // Test invalid email format
    cy.get('[data-cy=customer-email]').type('invalid-email');
    cy.get('[data-cy=submit-appointment-btn]').click();
    cy.get('[data-cy=form-error]').should('be.visible');
    
    // Fix with valid email
    cy.get('[data-cy=customer-email]').clear().type(testCustomerEmail);
    
    // Add age if required
    cy.get('body').then(($body) => {
      if ($body.find('[data-cy=customer-age]').length) {
        cy.get('[data-cy=customer-age]').type(testCustomerAge);
      }
    });
  });

  // === FULL BOOKING FLOW TEST ===
  it('completes a full booking flow with successful submission', () => {
    cy.get('[data-cy=service-card]').first().click();
    cy.get('[data-cy=calendar-day]').contains('15').click();
    cy.get('[data-cy=time-slot]').contains('10:00 AM').click();
    
    // Fill in all details
    cy.get('[data-cy=customer-name]').type(testCustomerName);
    cy.get('[data-cy=customer-contact]').type(testCustomerPhone);
    cy.get('[data-cy=customer-email]').type(testCustomerEmail);
    
    // Fill age if it exists
    cy.get('body').then(($body) => {
      if ($body.find('[data-cy=customer-age]').length) {
        cy.get('[data-cy=customer-age]').type(testCustomerAge);
      }
    });
    
    // Submit form
    cy.get('[data-cy=submit-appointment-btn]').click();
    
    // Verify confirmation
    cy.get('[data-cy=confirmation-message]', { timeout: 10000 }).should('be.visible');
    cy.contains('Appointment confirmed').should('exist');
    
    // Check that appointment details are shown in confirmation
    cy.get('[data-cy=confirmation-details]').should('contain', testCustomerName);
    cy.get('[data-cy=confirmation-date]').should('exist');
    cy.get('[data-cy=confirmation-time]').should('exist');
  });

  // === APPOINTMENT MANAGEMENT TESTS ===
  it('allows rescheduling an existing appointment', () => {
    // This depends on having a valid token or other mechanism to access existing appointments
    // Use a stub or hardcoded token for testing
    cy.visit('/appointments/manage?token=test-appointment-token');
    
    // Verify appointment details are displayed
    cy.get('[data-cy=existing-appointment]').should('be.visible');
    
    // Click reschedule button
    cy.get('[data-cy=reschedule-appointment-btn]').click();
    
    // Select new date and time
    cy.get('[data-cy=calendar-day]').contains('20').click();
    cy.get('[data-cy=time-slot]').contains('3:00 PM').click();
    
    // Confirm reschedule
    cy.get('[data-cy=confirm-reschedule-btn]').click();
    
    // Verify confirmation
    cy.contains('Appointment rescheduled').should('exist');
  });

  it('allows canceling an existing appointment', () => {
    cy.visit('/appointments/manage?token=test-appointment-token');
    
    // Click cancel button
    cy.get('[data-cy=cancel-appointment-btn]').click();
    
    // Confirm cancellation in modal
    cy.get('[data-cy=confirm-cancellation-btn]').click();
    
    // Verify cancellation confirmation
    cy.contains('Appointment canceled').should('exist');
  });

  // === ERROR HANDLING TESTS ===
  it('handles server errors during appointment submission', () => {
    // Intercept appointment submission API and force an error
    cy.intercept('POST', '/api/appointments', {
      statusCode: 500,
      body: { success: false, error: 'Server error' }
    }).as('appointmentError');
    
    // Go through appointment flow
    cy.get('[data-cy=service-card]').first().click();
    cy.get('[data-cy=calendar-day]').contains('15').click();
    cy.get('[data-cy=time-slot]').first().click();
    cy.get('[data-cy=customer-name]').type(testCustomerName);
    cy.get('[data-cy=customer-contact]').type(testCustomerPhone);
    cy.get('[data-cy=customer-email]').type(testCustomerEmail);
    cy.get('[data-cy=submit-appointment-btn]').click();
    
    // Wait for our intercepted request
    cy.wait('@appointmentError');
    
    // Verify error is displayed
    cy.get('[data-cy=submission-error]').should('be.visible');
    cy.contains('Unable to schedule appointment').should('exist');
  });

  it('prevents selecting unavailable dates and times', () => {
    // Intercept calendar data to simulate some dates being unavailable
    cy.intercept('GET', '**/available-dates', {
      body: {
        availableDates: ['2025-04-15', '2025-04-16'],
        unavailableDates: ['2025-04-17', '2025-04-18']
      }
    }).as('availableDates');
    
    cy.get('[data-cy=service-card]').first().click();
    cy.wait('@availableDates');
    
    // Unavailable dates should be disabled
    cy.get('[data-cy=calendar-day].disabled').should('exist');
    
    // Try clicking an unavailable date
    cy.get('[data-cy=calendar-day].disabled').first().click();
    cy.get('[data-cy=time-slots-container]').should('not.exist');
    
    // Select an available date
    cy.get('[data-cy=calendar-day]:not(.disabled)').first().click();
    cy.get('[data-cy=time-slots-container]').should('be.visible');
  });
});
