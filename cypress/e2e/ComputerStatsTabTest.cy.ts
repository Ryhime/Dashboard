describe('computer stats tab', () => {
    it('should update settings button', () => {
        cy.visit('localhost:4200');

        cy.get('.upper-section > .setting > .ng-untouched > .p-knob').should('have.text', '1');

        cy.get('.upper-section > .setting > [icon="pi pi-minus"] > .p-ripple').click();
        cy.get('.upper-section > .setting > [icon="pi pi-minus"] > .p-ripple').should('be.disabled');
        cy.get('.upper-section > .setting > .ng-untouched > .p-knob').should('have.text', '0.5');

        for (let i = 0; i < 9; i++) {
            cy.get('.upper-section > .setting > [icon="pi pi-plus"] > .p-ripple').click();
        }
        cy.get('.upper-section > .setting > [icon="pi pi-plus"] > .p-ripple').should('be.disabled');
        cy.get('.upper-section > .setting > .ng-untouched > .p-knob').should('have.text', '5');
    });

    it('should display correct data', () => {
        cy.intercept('GET', 'http://www.localhost:5000/computer-stats', {fixture: 'ComputerStatsFixture.json'}).as('computerStats');
        cy.visit('localhost:4200');
        cy.wait('@computerStats').its('response.statusCode').should('eq', 200);

        cy.get('.static-data > :nth-child(1)').should('have.text', 'CPU Count: 16');
        cy.get('.static-data > :nth-child(2)').should('have.text', 'CPU Type: ARM');
        cy.get('.static-data > :nth-child(3)').should('have.text', 'System: Linux Mint');
        cy.get('.static-data > :nth-child(4)').should('have.text', 'Total RAM: 67.34 GB');

        cy.get('.knobs > :nth-child(1) > .p-element > .p-knob').should('have.text', '5%');
        cy.get('.knobs > :nth-child(2) > .p-element > .p-knob').should('have.text', '4%');
        cy.get('.knobs > :nth-child(3) > .p-element > .p-knob').should('have.text', '19.9%');
    });
});