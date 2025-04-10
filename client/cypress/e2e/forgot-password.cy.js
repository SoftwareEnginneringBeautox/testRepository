/// <reference types="cypress" />

describe('Forgot Password Flow', () => {
  const testEmail = 'rayna@example.com'; // Use an email associated with the staff account
  const newPassword = 'NewSecurePass123!';

  beforeEach(() => {
    // Set viewport and visit login page
    cy.viewport(1280, 720);
    cy.visit('/login');
  });

  it('should navigate to forgot password modal', () => {
    // Click on Forgot Password link
    cy.contains(/forgot\s*password/i, { timeout: 10000 }).click();

    // Verify the forgot password modal is visible
    cy.get('[data-cy="forgot-password-modal"]')
      .should('be.visible');
  });

  it('should send OTP to email', () => {
    // Open Forgot Password modal
    cy.contains(/forgot\s*password/i, { timeout: 10000 }).click();

    // Enter email
    cy.get('[data-cy="forgot-email"]')
      .type(testEmail)
      .should('have.value', testEmail);

    // Submit email
    cy.get('[data-cy="submit-email"]').click();

    // Verify OTP input step is reached
    cy.contains('Enter the 6-digit code sent to your email.')
      .should('be.visible');
  });

  it('should verify OTP and reset password', () => {
    // Open Forgot Password modal
    cy.contains(/forgot\s*password/i, { timeout: 10000 }).click();

    // Enter email
    cy.get('[data-cy="forgot-email"]')
      .type(testEmail)
      .should('have.value', testEmail);

    // Submit email
    cy.get('[data-cy="submit-email"]').click();

    // Enter OTP (use real or mock OTP depending on your implementation)
    cy.get('[data-cy="otp-input"]').within(() => {
      // Assuming 6-digit OTP input
      cy.get('input').each(($input, index) => {
        cy.wrap($input).type(String(index + 1)); // Simple OTP: 123456
      });
    });

    // Submit OTP
    cy.get('[data-cy="submit-otp"]').click();

    // Enter new password
    cy.get('[data-cy="new-password"]')
      .type(newPassword)
      .should('have.value', newPassword);

    cy.get('[data-cy="confirm-password"]')
      .type(newPassword)
      .should('have.value', newPassword);

    // Submit new password
    cy.get('[data-cy="submit-reset"]').click();

    // Verify success message
    cy.contains('Password reset successful!')
      .should('be.visible');
  });

  it('should handle invalid email submission', () => {
    // Open Forgot Password modal
    cy.contains(/forgot\s*password/i, { timeout: 10000 }).click();

    // Enter invalid email
    cy.get('[data-cy="forgot-email"]')
      .type('invalid-email');

    // Submit email
    cy.get('[data-cy="submit-email"]').click();

    // Verify error message (adjust selector based on actual implementation)
    cy.contains('Failed to send OTP')
      .should('be.visible');
  });

  it('should handle invalid OTP', () => {
    // Open Forgot Password modal
    cy.contains(/forgot\s*password/i, { timeout: 10000 }).click();

    // Enter email
    cy.get('[data-cy="forgot-email"]')
      .type(testEmail)
      .should('have.value', testEmail);

    // Submit email
    cy.get('[data-cy="submit-email"]').click();

    // Enter incorrect OTP
    cy.get('[data-cy="otp-input"]').within(() => {
      cy.get('input').each(($input) => {
        cy.wrap($input).type('0'); // Incorrect OTP
      });
    });

    // Submit OTP
    cy.get('[data-cy="submit-otp"]').click();

    // Verify error message
    cy.contains('Invalid OTP')
      .should('be.visible');
  });

  it('should allow resending OTP', () => {
    // Open Forgot Password modal
    cy.contains(/forgot\s*password/i, { timeout: 10000 }).click();

    // Enter email
    cy.get('[data-cy="forgot-email"]')
      .type(testEmail)
      .should('have.value', testEmail);

    // Submit email
    cy.get('[data-cy="submit-email"]').click();

    // Click Resend OTP
    cy.contains('CLICK HERE TO RESEND').click();

    // Verify resend message
    cy.contains('A new OTP has been sent.')
      .should('be.visible');
  });

  it('should prevent password reset with mismatched passwords', () => {
    // Open Forgot Password modal
    cy.contains(/forgot\s*password/i, { timeout: 10000 }).click();

    // Enter email
    cy.get('[data-cy="forgot-email"]')
      .type(testEmail)
      .should('have.value', testEmail);

    // Submit email
    cy.get('[data-cy="submit-email"]').click();

    // Enter OTP
    cy.get('[data-cy="otp-input"]').within(() => {
      cy.get('input').each(($input, index) => {
        cy.wrap($input).type(String(index + 1)); // Simple OTP: 123456
      });
    });

    // Submit OTP
    cy.get('[data-cy="submit-otp"]').click();

    // Enter mismatched passwords
    cy.get('[data-cy="new-password"]')
      .type(newPassword);

    cy.get('[data-cy="confirm-password"]')
      .type(`${newPassword}different`);

    // Submit new password
    cy.get('[data-cy="submit-reset"]').click();

    // Verify error message about password mismatch
    cy.contains('Passwords do not match.')
      .should('be.visible');
  });
});