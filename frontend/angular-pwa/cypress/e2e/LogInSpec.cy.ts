describe('Login Modal', () => {
  it('should be able to log in as normal user', () => {
    // go to home page
    cy.visit('http://localhost:4200/');

    // open login modal
    cy.get('.login-icon > .material-symbols-outlined')
      .should('be.visible')
      .click();

    // check if modal is open
    cy.get('.modal-content').should('be.visible');

    // go to normal user login
    cy.get('.login-buttons > :nth-child(1)').should('be.visible').click();

    // log in credentials come from cypress.env.json
    const email = Cypress.env('CYPRESS_EMAIL');
    const password = Cypress.env('CYPRESS_PASSWORD');

    // write email and password
    cy.get('#email').should('be.visible').type(email);
    cy.get('#password').should('be.visible').type(password);

    // press log in button
    cy.get('form.ng-dirty > button').click();

    // check if success log in toaster is visible
    cy.get('.ng-trigger').should('be.visible');
    // check if url has /events (routes to event page after succesful login)
    cy.url().should('include', '/events');
  });

  it('should display error message for incorrect email or password', () => {
    // go to the home page
    cy.visit('http://localhost:4200/');

    // open login modal
    cy.get('.login-icon > .material-symbols-outlined').click();

    // check if the login modal is visible
    cy.get('.modal-content').should('be.visible');

    // click on the button for normal user login
    cy.get('.login-buttons > :nth-child(1)').click();

    // type invalid email and password
    cy.get('#email').type('invalid-email@example.com');
    cy.get('#password').type('wrongpassword');

    // submit the login form
    cy.get('form').submit();

    // check if the error message is displayed
    cy.get('.error-message')
      .should('be.visible')
      .and('contain', 'Sähköposti tai salasana väärin');
  });
  it('should disable the login button if email or password is empty', () => {
    // go to the home page
    cy.visit('http://localhost:4200/');

    // open login modal
    cy.get('.login-icon > .material-symbols-outlined').click();

    // check if the login modal is visible
    cy.get('.modal-content').should('be.visible');

    // click on the button for normal user login
    cy.get('.login-buttons > :nth-child(1)').click();

    // leave the email field empty and fill in the password
    cy.get('#email').clear();
    cy.get('#password').type('password123');

    // check that the login button is disabled
    cy.get('button[type="submit"]').should('be.disabled');

    // now fill in the email field and leave the password empty
    cy.get('#email').type('user@example.com');
    cy.get('#password').clear();

    // check that the login button is still disabled
    cy.get('button[type="submit"]').should('be.disabled');
  });
  it('should not submit the form with empty fields and show error messages', () => {
    // go to the home page
    cy.visit('http://localhost:4200/');

    // open login modal
    cy.get('.login-icon > .material-symbols-outlined').click();

    // check if the login modal is visible
    cy.get('.modal-content').should('be.visible');

    // click on the button for normal user login
    cy.get('.login-buttons > :nth-child(1)').click();

    // Leave both fields empty and attempt to submit
    cy.get('#email').clear();
    cy.get('#password').clear();

    // check that the login button is disabled
    cy.get('button[type="submit"]').should('be.disabled');

    // click outside the fields to activate the error messages
    cy.get('body').click(0, 0);
    // check if error messages for empty fields are visible
    cy.get('.error-message').should('contain', 'Sähköposti puuttuu');
    cy.get('.error-message').should('contain', 'Salasana puuttuu');

    // try to submit the form
    cy.get('form').submit();

    // makes sure the form is not submitted and the modal is still open
    cy.get('.modal-content').should('be.visible');
  });
});
