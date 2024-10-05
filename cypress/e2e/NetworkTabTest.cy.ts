describe('network stats', () => {
  it('button settings work', () => {
    cy.visit('localhost:4200');
    cy.contains('Dashboard');
    cy.get('app-network-stats').find('button').click({multiple: true, force: true});
    cy.get('app-network-stats').find('button').click({multiple: true, force: true});
    cy.get('.settings > :nth-child(1) > .ng-untouched > .p-knob').should('have.text','100');
    cy.get('.settings > :nth-child(1) > [icon="pi pi-plus"] > .p-ripple').click({force: true});
    cy.get('.settings > :nth-child(1) > [icon="pi pi-plus"] > .p-ripple').click({force: true});
    cy.get('.settings > :nth-child(1) > .ng-untouched > .p-knob').should('have.text','120');
    cy.get('.settings > :nth-child(1) > [icon="pi pi-minus"] > .p-ripple').click({force: true});
    cy.get('.settings > :nth-child(1) > .ng-untouched > .p-knob').should('have.text','110');
  });
  it('button settings should have a max value', () => {
    cy.visit('localhost:4200');
    cy.get('.settings > :nth-child(2) > .ng-untouched > .p-knob').should('have.text','2');
    for (let i = 0; i < 8; i++) {
      cy.get(':nth-child(2) > [icon="pi pi-plus"] > .p-ripple').click();
    }
    cy.get('.settings > :nth-child(2) > .ng-untouched > .p-knob').should('have.text','10');
    cy.get(':nth-child(2) > [icon="pi pi-plus"] > .p-ripple').should('be.disabled');
  });
  it('button settings should have a min value', () => {
    cy.visit('localhost:4200');
    cy.get('.settings > :nth-child(3) > .ng-untouched > .p-knob').should('have.text','6');
    for (let i = 0; i < 3; i++) {
      cy.get(':nth-child(3) > [icon="pi pi-minus"] > .p-ripple').click();
    }
    cy.get('.settings > :nth-child(3) > .ng-untouched > .p-knob').should('have.text','0');
    cy.get('.p-disabled > .p-ripple').should('be.disabled');
  });

  it('network should display correct data with filter', () => {
    cy.intercept('GET', 'http://www.localhost:5000/network-stats', {fixture: 'NetworkFixture.json'}).as('networkStats');
    cy.visit('localhost:4200');
    cy.wait('@networkStats').its('response.statusCode').should('eq', 200);
    cy.get('#pn_id_5-table > .p-element > :nth-child(1) > :nth-child(1)').should('have.text', '10.0.0.127');
    cy.get('#pn_id_5-table > .p-element > :nth-child(1) > :nth-child(2)').should('have.text', '26');
    cy.get('#pn_id_5-table > .p-element > :nth-child(2) > :nth-child(1)').should('have.text', '34.149.100.209');
    cy.get('.p-element > :nth-child(2) > :nth-child(2)').should('have.text', '10');
  });
})