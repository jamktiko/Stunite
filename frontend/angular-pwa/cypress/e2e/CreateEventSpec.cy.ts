const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(today.getDate() + 1);

const formattedDate = tomorrow.toISOString().split('T')[0];
const formattedTime = '12:00';

describe('Create Event', () => {
  beforeEach(() => {
    // go to home page
    cy.visit('http://localhost:4200/');

    // open login modal
    cy.get('.login-icon > .material-symbols-outlined')
      .should('be.visible')
      .click();

    // check if modal is open
    cy.get('.modal-content').should('be.visible');

    // go to organizer log in
    cy.get('.login-buttons > :nth-child(2)').should('be.visible').click();

    // log in credentials come from cypress.env.json
    const email = Cypress.env('CYPRESS_ORGANIZER_EMAIL');
    const password = Cypress.env('CYPRESS_ORGANIZER_PASSWORD');

    // write email and password
    cy.get('#email').should('be.visible').type(email);
    cy.get('#password').should('be.visible').type(password);

    // press log in button
    cy.get('form.ng-dirty > button').click();

    // check if success log in toaster is visible
    cy.get('.ng-trigger').should('be.visible');

    // check if url has /organizer-view (routes to organizer-view after succesful login)
    cy.url().should('include', '/organizer-view');
  });
  
  it('go to create event form and create event', () => {
    // press create event button
    cy.get('.organizer-buttons > :nth-child(1)').should('be.visible').click();

    // set name
    cy.get('input[name="eventName"]').type('TestiTapahtumaCypress');

    // set date and time
    cy.get('[name="eventDate"]').clear().type(formattedDate);
    cy.get('[name="eventTime"]').clear().type(formattedTime);

    // set ending time and date
    cy.get('input[name="endingDate"]').clear().type(formattedDate);
    cy.get('input[name="endingtime"]').clear().type(formattedTime);

    // set city
    cy.get('input[name="city"]').type('Helsinki');

    // set address
    cy.get('input[name="address"]').type('Mannerheimintie 1');

    // set event venue
    cy.get('input[name="venue"]').type('Messukeskus');

    // set event details
    cy.get('textarea[name="details"]').type('Tämä on testitapahtuman kuvaus.');

    // set ticketprices
    cy.get('input[name="ticketpriceMin"]').type('20');
    cy.get('input[name="ticketpriceMax"]').type('50');

    // set ticketsale times
    cy.get('input[name="ticketSaleStart"]').type('2024-04-01T10:00');
    cy.get('input[name="ticketSaleEnd"]').type('2024-04-30T23:59');

    // set status
    cy.get('select[name="status"]').select('Varattu');

    // set publish date and time
    cy.get('input[name="publishDateTime"]').type('2024-04-01T12:00');

    // set events tags
    cy.get('.tag-checkbox input[type="checkbox"]').first().check();

    // set event image
    cy.get('input[type="file"]').selectFile(
      'cypress/fixtures/cypress-logo.jpg'
    );

    // send form
    cy.get('form.create-event-form').submit();

    // check if create event success toaster is visible
    cy.get('.ng-trigger')
      .should('be.visible')
      .and('contain', 'Tapahtuman luonti onnistui.');

    // check if event is in Your events, future events container
    cy.get('.page-container > :nth-child(3)').should(
      'contain',
      'TestiTapahtumaCypress'
    );
  });

  it('check that organizer calender has the created event and works', () => {
    // go to organzier calendar
    cy.get('.organizer-buttons > :nth-child(2)').click();
    cy.url().should('include', '/organizer-view/organizer-calendar');

    // check if calendar is loaded and has the event
    cy.get('.full-calendar')
      .should('be.visible')
      .contains('.fc-event-title-container', 'TestiTapahtumaCypress')
      .should('be.visible')
      .trigger('mouseover');

    // hover event and check it has information like name
    cy.get('.event-calendar-hover')
      .should('be.visible')
      .should('contain', 'TestiTapahtumaCypress');
    // click event and check that it goes to correct event-detail page
    cy.get('.full-calendar')
      .should('be.visible')
      .contains('.fc-event-title-container', 'TestiTapahtumaCypress')
      .click();
    cy.get('.page-container').should('contain', 'TestiTapahtumaCypress');
  });

  it('check that event is the events page', () => {
    cy.visit('/events');
    cy.get('.events').should('contain', 'TestiTapahtumaCypress');
  });

  it('delete event and check that it is gone', () => {
    // find event element that contains TestiTapahtumaCypress event name
    cy.get('.your-events')
      .contains('.event-name', 'TestiTapahtumaCypress')
      .parents('.your-events')
      .within(() => {
        // clicks delete button inside div that contains
        cy.contains('Poista').click();
      });

    // confirm deletion
    cy.on('window:confirm', () => true);

    // check that event is deleted
    cy.get('.events-div').should('not.contain', 'TestiTapahtumaCypress');
  });
});
