// Importing Scripts
const simple = require('../scripts/simple');

// Testing dependencies
const expect = require("chai").expect;

// console.log(simple.multi(2,4));

describe('Tests of basic script functions', () => {
    describe('Test multiplication method', () => {
        it('should multiply two numbers', () => {
            expect(simple.multi(2, 4)).to.equal(8);
        });
        it('should divide two numbers', () => {
            expect(simple.divide(8, 2)).to.equal(4);
        });
    });
    describe('Test addition and subtraction method', () => {
        it('should add two numbers', () => {
            expect(simple.add(2, 4)).to.equal(6);
        });
        it('should subtract one number from another', () => {
            expect(simple.subtract(2, 4)).to.equal(-2);
        });
    });
});