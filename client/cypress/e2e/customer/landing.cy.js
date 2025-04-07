describe('Customer - Landing Page', () => {
  beforeEach(() => {
    cy.visit('/');
    // Allow time for animations and initial rendering
    cy.wait(500);
  });

  // === PAGE RENDERING TESTS ===
  it('renders all major sections of the landing page', () => {
    // Header section
    cy.get('header').should('exist');
    
    // Hero section
    cy.get('#hero').should('be.visible');
    cy.contains('Welcome to Beautox').should('be.visible');
    cy.contains('SET AN APPOINTMENT').should('be.visible');
    
    // Featured services section
    cy.contains('FEATURED SERVICES').should('be.visible');
    cy.contains('40 Sessions Package').should('be.visible');
    cy.contains('Diode Laser').should('be.visible');
    cy.contains('Intimate Secret').should('be.visible');
    
    // Services tabs section
    cy.get('#services').should('exist');
    cy.contains("HERE'S WHAT WE HAVE IN STORE FOR YOU").should('be.visible');
    
    // About clinic section
    cy.get('#about-clinic').should('exist');
    cy.contains('Beautox Aesthetic Clinic').should('be.visible');
    
    // Testimonials section
    cy.get('#testimonials').should('exist');
    cy.contains('WHAT OUR CLIENTS SAY').should('be.visible');
    
    // Contact section
    cy.get('#contact').should('exist');
    cy.contains('FIND US HERE').should('be.visible');
  });

  // === NAVIGATION TESTS ===
  it('tests desktop navigation links scroll to correct sections', () => {
    // Only run this test on desktop viewports
    cy.viewport(1200, 800);
    
    // Test About Us link
    cy.contains('a', 'ABOUT US').click();
    cy.url().should('include', '#hero');
    
    // Test Services link
    cy.contains('a', 'SERVICES').click();
    cy.url().should('include', '#services');
    
    // Test Find Us link
    cy.contains('a', 'FIND US').click();
    cy.url().should('include', '#about-clinic');
    
    // Test Testimonials link
    cy.contains('a', 'TESTIMONIALS').click();
    cy.url().should('include', '#testimonials');
  });

  it('tests mobile navigation links scroll to correct sections', () => {
    // Set mobile viewport
    cy.viewport(375, 667);
    
    // Open mobile menu
    cy.get('[class*="DropdownMenuTrigger"]').click();
    
    // Test About Us link
    cy.contains('ABOUT US').click();
    cy.url().should('include', '#hero');
    
    // Reopen menu (it closes after click)
    cy.get('[class*="DropdownMenuTrigger"]').click();
    
    // Test Services link
    cy.contains('SERVICES').click();
    cy.url().should('include', '#services');
    
    // Reopen menu
    cy.get('[class*="DropdownMenuTrigger"]').click();
    
    // Test Find Us link
    cy.contains('FIND US').click();
    cy.url().should('include', '#about-clinic');
    
    // Reopen menu
    cy.get('[class*="DropdownMenuTrigger"]').click();
    
    // Test Testimonials link
    cy.contains('TESTIMONIALS').click();
    cy.url().should('include', '#testimonials');
  });

  // === APPOINTMENT SCHEDULING TESTS ===
  it('opens appointment modal when clicking SET AN APPOINTMENT button', () => {
    cy.contains('SET AN APPOINTMENT').click();
    cy.contains('SCHEDULE APPOINTMENT').should('be.visible');
    
    // Check modal has required fields
    cy.get('[data-cy="schedule-appointment-modal"]').within(() => {
      cy.get('[data-cy="schedule-fullname-input"]').should('exist');
      cy.get('[data-cy="schedule-contact-input"]').should('exist');
      cy.get('[data-cy="schedule-email-input"]').should('exist');
      cy.get('[data-cy="schedule-date-input"]').should('exist');
      cy.get('[data-cy="schedule-time-input"]').should('exist');
    });
    
    // Close modal
    cy.get('[data-cy="schedule-return-btn"]').click();
    cy.contains('SCHEDULE APPOINTMENT').should('not.exist');
  });

  it('completes appointment scheduling flow', () => {
    // Open modal
    cy.contains('SET AN APPOINTMENT').click();
    
    // Fill form
    cy.get('[data-cy="schedule-fullname-input"]').type('Test Customer');
    cy.get('[data-cy="schedule-contact-input"]').type('09123456789');
    cy.get('[data-cy="schedule-email-input"]').type('test@example.com');
    cy.get('[data-cy="schedule-date-input"]').type('2025-05-15');
    cy.get('[data-cy="schedule-time-input"]').type('14:30');
    
    // Submit form - intercept API call to prevent actual submission
    cy.intercept('POST', '**/api/appointments', {
      statusCode: 200,
      body: { success: true, message: 'Appointment scheduled successfully' }
    }).as('scheduleAppointment');
    
    cy.get('[data-cy="schedule-submit-btn"]').click();
    cy.wait('@scheduleAppointment');
    
    // Check success message appears
    cy.get('[data-cy="confirmation-message"]').should('be.visible');
  });

  // === SERVICES TABS TESTS ===
  it('navigates through service category tabs', () => {
    cy.get('#services').scrollIntoView();
    
    // Test each tab in services section
    const categories = ['BEST-SELLER', 'FACIAL', 'DOCTOR\'S PROCEDURE', 'GLUTA DRIPS', 'SLIMMING TREATMENTS'];
    
    categories.forEach(category => {
      cy.contains(category).click();
      // Verify the tab content changes
      cy.get('[data-state="active"]').should('contain', category);
      // Check at least one product card is visible for each category
      cy.get('[data-state="active"]').find('div').should('exist');
    });
  });

  it('shows service details in cards', () => {
    cy.get('#services').scrollIntoView();
    
    // Check first product card in BEST-SELLER category
    cy.contains('BEST-SELLER').click();
    cy.contains('40 Sessions Package').should('be.visible');
    
    // Switch to FACIAL category and check content
    cy.contains('FACIAL').click();
    cy.contains('Signature Hydrafacial').should('be.visible');
    cy.contains('₱9,999 (5 Sessions)').should('be.visible');
  });

  // === EXTERNAL LINKS TESTS ===
  it('verifies external social media links', () => {
    cy.get('#contact').scrollIntoView();
    
    // Check Facebook link
    cy.contains('FACEBOOK')
      .should('have.attr', 'href')
      .and('include', 'facebook.com/BeautoxAestheticClinicNewManila');
    
    // Check Instagram link
    cy.contains('INSTAGRAM')
      .should('have.attr', 'href')
      .and('include', 'instagram.com/beautoxnewmanila');
    
    // Check they open in new tab
    cy.contains('FACEBOOK').should('have.attr', 'target', '_blank');
    cy.contains('INSTAGRAM').should('have.attr', 'target', '_blank');
  });

  // === MAP TESTS ===
  it('displays Google Maps iframe with correct src', () => {
    cy.get('#location').scrollIntoView();
    
    cy.get('iframe')
      .should('be.visible')
      .and('have.attr', 'src')
      .and('include', 'google.com/maps/embed');
  });

  // === LOGIN FUNCTIONALITY ===
  it('navigates to login page when clicking LOGIN button', () => {
    // Desktop login button
    cy.viewport(1200, 800);
    cy.contains('button', 'LOGIN').click();
    cy.url().should('include', '/login');
    
    // Go back to landing page
    cy.visit('/');
    
    // Mobile login button
    cy.viewport(375, 667);
    cy.get('[class*="DropdownMenuTrigger"]').click();
    cy.contains('LOGIN').click();
    cy.url().should('include', '/login');
  });

  // === RESPONSIVE DESIGN TESTS ===
  it('adjusts layout for different screen sizes', () => {
    // Test mobile layout
    cy.viewport(375, 667);
    cy.get('[class*="DropdownMenuTrigger"]').should('be.visible');
    cy.contains('a', 'SERVICES').should('not.be.visible');
    
    // Test desktop layout
    cy.viewport(1200, 800);
    cy.get('[class*="DropdownMenuTrigger"]').should('not.be.visible');
    cy.contains('a', 'SERVICES').should('be.visible');
  });

  // === BUTTON INTERACTION TESTS ===
  it('tests featured services "See all" button', () => {
    cy.contains('FEATURED SERVICES').scrollIntoView();
    cy.contains('See all').click();
    
    // Verify scroll to services section
    cy.url().should('include', '#services');
  });

  it('tests "View Map" button functionality', () => {
    cy.get('#about-clinic').scrollIntoView();
    cy.contains('View Map').click();
    
    // Verify scroll to location/map
    cy.get('#location').should('be.visible');
  });

  // === VISUAL EFFECTS TESTS ===
  it('tests scroll effect on header', () => {
    // Check header state at top
    cy.scrollTo(0, 10);
    
    // Scroll down and check header style changes
    cy.scrollTo(0, 500);
    cy.wait(500); // Allow transition to complete
    
    // Scroll back to top
    cy.scrollTo(0, 0);
    cy.wait(500); // Allow transition to complete
  });

  // === ERROR HANDLING TESTS ===
  it('handles appointment scheduling errors gracefully', () => {
    cy.contains('SET AN APPOINTMENT').click();
    
    // Fill form
    cy.get('[data-cy="schedule-fullname-input"]').type('Test Customer');
    cy.get('[data-cy="schedule-contact-input"]').type('09123456789');
    cy.get('[data-cy="schedule-email-input"]').type('test@example.com');
    cy.get('[data-cy="schedule-date-input"]').type('2025-05-15');
    cy.get('[data-cy="schedule-time-input"]').type('14:30');
    
    // Mock server error
    cy.intercept('POST', '**/api/appointments', {
      statusCode: 500,
      body: { success: false, message: 'Server error' }
    }).as('scheduleAppointmentError');
    
    cy.get('[data-cy="schedule-submit-btn"]').click();
    cy.wait('@scheduleAppointmentError');
    
    // Check error message appears
    cy.get('[data-cy="submission-error"]').should('be.visible');
  });

  it('validates appointment form fields', () => {
    cy.contains('SET AN APPOINTMENT').click();
    
    // Try submitting empty form
    cy.get('[data-cy="schedule-submit-btn"]').click();
    
    // Check validation errors
    cy.get('[data-cy="schedule-fullname-input"]:invalid').should('exist');
    
    // Fill one field and check others still required
    cy.get('[data-cy="schedule-fullname-input"]').type('Test Customer');
    cy.get('[data-cy="schedule-submit-btn"]').click();
    cy.get('[data-cy="schedule-contact-input"]:invalid').should('exist');
  });
});