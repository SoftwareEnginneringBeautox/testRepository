// cypress/e2e/staff_dashboard.cy.js

// Add custom command for login
Cypress.Commands.add('loginAsStaff', () => {
    cy.viewport(1280, 720);
    cy.visit('/login');
    cy.get('[data-cy="login-username"]').type('rayna', { force: true });
    cy.get('[data-cy="login-password"]').type('12345', { force: true });
    cy.get('[data-cy="login-submit"]').click();
    cy.url().should('include', '/StaffDashboard');
  });
  
  describe('Staff Dashboard', () => {
    beforeEach(() => {
      // Login once using the custom command
      cy.loginAsStaff();
    });
  
    it('should display the welcome message with correct username', () => {
      cy.contains('WELCOME BACK, RAYNA').should('be.visible');
    });
  
    it('should display treatments table with correct columns', () => {
      cy.contains('TREATMENT ID').should('be.visible');
      cy.contains('TREATMENT NAME').should('be.visible');
      cy.contains('PRICE').should('be.visible');
      cy.contains('EXPIRATION').should('be.visible');
      
      // Check that treatments data loads (if any)
      cy.get('table').first().find('tbody tr').then($rows => {
        if ($rows.length > 0 && !$rows.text().includes('No treatments found')) {
          // Treatments exist, check structure
          cy.get('table').first().find('tbody tr').first().find('td').should('have.length', 4);
        } else {
          // No treatments found message should be displayed
          cy.get('table').first().find('tbody').contains('No treatments found').should('be.visible');
        }
      });
    });
  
    it('should display packages table with correct columns', () => {
      cy.contains('PRODUCT ID').should('be.visible');
      cy.contains('PACKAGE').should('be.visible');
      cy.contains('TREATMENT').should('be.visible');
      cy.contains('SESSIONS').should('be.visible');
      cy.contains('PRICE').should('be.visible');
      cy.contains('EXPIRATION').should('be.visible');
      
      // Check that packages data loads (if any)
      cy.get('table').eq(1).find('tbody tr').then($rows => {
        if ($rows.length > 0 && !$rows.text().includes('No packages found')) {
          // Packages exist, check structure
          cy.get('table').eq(1).find('tbody tr').first().find('td').should('have.length', 6);
        } else {
          // No packages found message should be displayed
          cy.get('table').eq(1).find('tbody').contains('No packages found').should('be.visible');
        }
      });
    });
  
    it('should display the staff list section', () => {
      cy.contains('STAFF LIST').should('be.visible');
      
      // Wait for staff to load
      cy.wait(1000);
      
      // Check staff list content
      cy.get('[class*="shadow-custom"]').first().then($staffList => {
        if ($staffList.text().includes('Loading staff')) {
          cy.contains('Loading staff').should('be.visible');
        } else if ($staffList.text().includes('No staff found')) {
          cy.contains('No staff found').should('be.visible');
        } else {
          // Staff found, check structure
          cy.get('[class*="shadow-custom"]').first().find('div[class*="border-2"]').should('exist');
          
          // Check if user roles are displayed correctly
          cy.get('[class*="shadow-custom"]').first().find('div[class*="border-2"]').first().then($staff => {
            if ($staff.find('span').length > 1) {
              cy.wrap($staff).find('span').eq(1).invoke('text').should('match', /(receptionist|aesthetician)/i);
            }
          });
        }
      });
    });
  
    it('should display the reminders section', () => {
      cy.contains('REMINDERS').should('be.visible');
      cy.contains('UPCOMING APPOINTMENTS').should('be.visible');
      
      // Check reminders content
      cy.get('[class*="shadow-custom"]').eq(1).then($reminders => {
        if ($reminders.text().includes('No upcoming appointments')) {
          cy.contains('No upcoming appointments in the next 3 days').should('be.visible');
        } else {
          // Appointments found, check structure
          cy.get('[class*="shadow-custom"]').eq(1).find('div[class*="bg-white/50"]').first().should('exist');
          
          // Check if reminder labels exist
          cy.get('[class*="shadow-custom"]').eq(1).find('div[class*="bg-white/50"]').first().then($appointment => {
            if ($appointment.find('span[class*="bg-lavender-300"]').length > 0) {
              cy.wrap($appointment).find('span[class*="bg-lavender-300"]').invoke('text')
                .should('match', /(Today|Tomorrow|Day After Tomorrow)/);
            }
          });
          
          // Check if date format is correct
          cy.get('[class*="shadow-custom"]').eq(1).find('div[class*="bg-white/50"]').first()
            .should('contain', /\w+ \d{2}, \d{4}/); // Month DD, YYYY format
            
          // Check if time format is correct
          cy.get('[class*="shadow-custom"]').eq(1).find('div[class*="bg-white/50"]').first()
            .should('contain', /\d{2}:\d{2} [AP]M/); // HH:MM AM/PM format
        }
      });
    });
  
    // Test data loading functions with API mocks
    it('should call the required API endpoints on load', () => {
      cy.intercept('GET', '*/getusers').as('getUsers');
      cy.intercept('GET', '*/api/packages').as('getPackages');
      cy.intercept('GET', '*/api/treatments').as('getTreatments');
      cy.intercept('GET', '*/api/appointments').as('getAppointments');
      
      // Verify all API calls were made
      cy.wait('@getUsers', { timeout: 10000 });
      cy.wait('@getPackages', { timeout: 10000 });
      cy.wait('@getTreatments', { timeout: 10000 });
      cy.wait('@getAppointments', { timeout: 10000 });
    });
  });