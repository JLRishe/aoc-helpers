const assert = require('assert');
const { wrapIndex, countCycles, swapPos, swapValues } = require('..');


describe('helpers', () => {
    it('should wrap arrays', () => {
        assert.equal(wrapIndex( 7, [0, 1, 2, 3, 4]), 2);
        assert.equal(wrapIndex(-2, [0, 1, 2, 3, 4]), 3);
    })

    it('should count repeats', () => {
        assert.equal(countCycles(x => x * 2, x => x >= 1024, 1), 10);
    });
    
    it('should swap array indices', () => {
        assert.deepEqual(swapPos(0, 3, ['a', 'b', 'c', 'd','e']), ['d', 'b', 'c', 'a', 'e']);
    });
    
    it('should swap values', () => {
        assert.deepEqual(swapValues('b', 'e', ['a', 'b', 'c', 'd','e']), ['a', 'e', 'c', 'd', 'b']);
    });
});