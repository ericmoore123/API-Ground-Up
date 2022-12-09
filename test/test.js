// Scripts imports
const simple = require('../scripts/simple');
const multi = simple.multi;
const divide = simple.divide;
const add = simple.add;
const subtract = simple.subtract;

// Testing dependencies
const chai = require('chai');
const expect = chai.expect;
const assert = chai.assert;
const should = chai.should;

// Test
// console.log(simple.multi(2,4));

// ================= Simple tests imports =================
describe('Tests of basic script functions', () => {
    describe('Test multiplication method', () => {
        it('should multiply two numbers', () => {
            expect(multi(2, 4)).to.equal(8);
            expect() 
        });
        it('should divide two numbers', () => {
            expect(divide(8, 2)).to.equal(4);
        });
    });

    describe('Test addition and subtraction method', () => {
        it('should add two numbers', () => {
            expect(add(2, 4)).to.equal(6);
        });
        it('should subtract one number from another', () => {
            expect(subtract(2, 4)).to.equal(-2);
        });
    });
});