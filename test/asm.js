const assert = require('assert');
const { asmEngine } = require('../asm');
const { genTake } = require('func-generators');

describe('asm engine', () => {
    const instrucTypes = {
         set: (r, v) => () => ({ setReg: { [r]: Number(v) } }),
         jmp: (c) => () => ({ posChange: Number(c) })
    };
    it('should generate states', () => {
        const engine = asmEngine(
            instrucTypes,
            {},
            [
                'set a 7',
                'set b 2',
                'jmp 3',
                'set b 2',
                'set b 2',
                'set c 9',
                'set a 3'
            ]
        );
        
        const states = Array.from(engine());
        
        assert.deepEqual(states, [
            { pos: 0, regs: {} },
            { pos: 1, regs: { a: 7 }, instruc: 'set' },
            { pos: 2, regs: { a: 7, b: 2 }, instruc: 'set' },
            { pos: 5, regs: { a: 7, b: 2 }, instruc: 'jmp' },
            { pos: 6, regs: { a: 7, b: 2, c: 9 }, instruc: 'set' },
            { pos: 7, regs: { a: 3, b: 2, c: 9 }, instruc: 'set' }
        ]);
    });
})