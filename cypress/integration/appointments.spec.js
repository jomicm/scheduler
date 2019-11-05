describe("Navigation", () => {
  beforeEach(function () {
    cy.request('GET', '/api/debug/reset')
    cy.visit("/");
    cy.contains('Monday')
  });
  it("should book an interview", () => {
      cy.get("[alt=Add]").first()
        .click()
      cy.get('input')
        .type('Lydia Miller-Jones')
      cy.get("[alt='Sylvia Palmer']").first()
        .click()
      cy.contains('Save')
        .click()
      cy.get(".appointment__card--show")
        .should('contain', 'Lydia Miller-Jones');
  });

  it("should edit an interview", () => {
    // cy.contains('Archie Cohen')
    cy.get('.appointment__card.appointment__card--show').first()
      .click()
    cy.get('[alt=Edit]')
      .click({force:true})

    cy.get('input')
      .clear()
      .type('Miguel Cruz')
    cy.get("[alt='Tori Malcolm']").first()
      .click()
    cy.contains('Save')
      .click()
    cy.get(".appointment__card--show")
      .should('contain', 'Miguel Cruz');
  });


  it("delete an interview", () => {
    cy.get('.appointment__card.appointment__card--show').first()
      .click()
    cy.get('[alt=Delete]')
      .click({force:true})
    cy.contains('Confirm')
      .click()
    cy.contains('Deleting...')
      .should('exist')
    cy.contains('Deleting...')
      .should('not.exist')
    cy.get('.appointment__card.appointment__card--show')
      // .contains('Archie Cohen')
      .should('not.exist')
  });

});