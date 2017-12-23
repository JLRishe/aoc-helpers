const assert = require('assert');
const { asmEngine } = require('../source/asm');
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
            ]
        );
        const first6 = genTake(6, engine);
        
        const states = Array.from(first6());
        
        assert.deepEqual(states, [
            { pos: 0, regs: {} },
            { pos: 1, regs: { a: 7 } },
            { pos: 2, regs: { a: 7, b: 2 } },
            { pos: 5, regs: { a: 7, b: 2 } },
            { pos: 6, regs: { a: 7, b: 2, c: 9 } },
            { pos: 6, regs: { a: 7, b: 2, c: 9 }, stopped: true }
        ]);
    });
})