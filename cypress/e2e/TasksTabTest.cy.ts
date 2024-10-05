describe('tasks tab', () => {
    it('should display the correct information', () => {
        cy.intercept('GET', 'http://www.localhost:5000/tasks', {fixture: 'TasksFixture.json'}).as('tasks');
        cy.visit('localhost:4200');
        cy.wait('@tasks').its('response.statusCode').should('eq', 200);

        cy.get('#pn_id_5-table > .p-element > .ng-star-inserted > td').should('have.text', 'Daily1');
        cy.get('#pn_id_6-table > .p-element > :nth-child(1) > td').should('have.text', 'Task1');
        cy.get(':nth-child(2) > td').should('have.text', 'Task2');
    });

    it('should display correct data when all tasks are completed', () => {
        cy.intercept('GET', 'http://www.localhost:5000/tasks', {fixture: 'TasksCompleteFixture.json'}).as('tasks');
        cy.visit('localhost:4200');
        cy.wait('@tasks').its('response.statusCode').should('eq', 200);

        cy.get('#pn_id_1_content > .p-panel-content > .ng-star-inserted').should('exist');
        cy.get('.p-panel-content > .ng-star-inserted > .pi').should('exist');
    });

    it('should display correct data when all dailies are completed', () => {
        cy.intercept('GET', 'http://www.localhost:5000/tasks', {fixture: 'TasksDailyCompleteFixture.json'}).as('tasks');
        cy.visit('localhost:4200');
        cy.wait('@tasks').its('response.statusCode').should('eq', 200);

        cy.get('.p-panel-content > p.ng-star-inserted').should('exist');
        cy.get('.p-panel-content > p.ng-star-inserted > .pi').should('exist');

        cy.get('th').should('have.text', 'Today\'s Task');
        cy.get(':nth-child(1) > td').should('have.text', 'Task1');
        cy.get(':nth-child(2) > td').should('have.text', 'Task2');
    });

    it('should display correct data when all non daily tasks are completed', () => {
        cy.intercept('GET', 'http://www.localhost:5000/tasks', {fixture: 'TasksNonDailyCompleteFixture.json'}).as('tasks');
        cy.visit('localhost:4200');
        cy.wait('@tasks').its('response.statusCode').should('eq', 200);

        cy.get('th').should('have.text', 'Daily Task');
        cy.get('#pn_id_5-table > .p-element > .ng-star-inserted > td').should('have.text', 'Daily1');
        cy.get('.p-panel-content > p.ng-star-inserted').should('exist');
        cy.get('p.ng-star-inserted > .pi').should('exist');
    });
});