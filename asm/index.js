const { __, compose, curry, map, defaultTo, apply, merge, omit } = require('ramda');
const { probe, applyPattern } = require('..');
const { genTransform, genStop } = require('func-generators');

const parseInstruc = curry((instrucTypes, line) => compose(
    ([, code, params]) => ({ 
        code, 
        instruc: apply(instrucTypes[code], params ? params.split(/,?\s?/) : [])
    }),
    applyPattern(/^(\S+)\s?(.+)?/)
)(line));

const parseInstrucs = (instrucTypes, lines) => map(parseInstruc(instrucTypes), lines);

// [Instruction] -> State -> State
const applyInstruc = curry((instrucs, state) => {
    const { pos, regs } = state;

    if (pos < 0 || pos >= instrucs.length) { 
        return genStop; 
    }

    const updates = instrucs[pos].instruc(state);
    const { posChange, setReg } = updates;
    const np = pos + defaultTo(1, posChange);
    const newRegs = setReg ? merge(regs, updates.setReg) : regs;
  
    return merge(state, merge({ pos: np, regs: newRegs }, omit(['posChange', 'setReg'], updates)));
});

// { InstrucName: (* -> *) } -> State -> [String]
const asmEngine = curry((instrucTypes, initialState, lines) => compose(
    is => genTransform(
        applyInstruc(is),
        merge({ pos: 0, regs: {} }, initialState)
    ),
    parseInstrucs
)(instrucTypes, lines));

module.exports = {
    asmEngine
};