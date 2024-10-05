describe('applications tab', () => {
    it('should display the correct symbols', () => {
        cy.visit('localhost:4200');
        cy.get('[href="http://www.youtube.com"] > .icon').should('exist');
        cy.get('[href="http://www.netflix.com"] > .icon').should('exist');
        cy.get('[href="https://calendar.google.com"] > .icon').should('exist');
        cy.get('[href="https://drive.google.com"] > .icon').should('exist');
        cy.get('[href="https://calendar.google.com/calendar/u/0/r/tasks"] > .icon').should('exist');
        cy.get('[href="https://www.amazon.com"] > .icon').should('exist');
        cy.get('[href="https://app.rocketmoney.com"] > .icon').should('exist');
    });
});