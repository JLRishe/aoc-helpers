const { __, compose, curry, map, defaultTo, apply, merge, omit, prop } = require('ramda');
const { probe, applyPattern } = require('..');
const { genTransform, genStop } = require('func-generators');

// String -> { * } -> *
const regVal = compose(
    defaultTo(0),
    prop
);

// String -> State -> *
const resolveVal = curry((val, { regs }) => compose(
   n => Number.isNaN(n) ? regVal(val, regs) : n,
   parseFloat
)(val));

const parseInstruc = curry((instrucTypes, line) => compose(
    ([, code, params]) => ({ 
        code, 
        instruc: apply(instrucTypes[code], params ? params.split(/,|\s|,\s/) : [])
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
    
    const instruc = instrucs[pos];
    const stateWithInstruc = merge(state, { instruc: instruc.code })
    const updates = instruc.instruc(state);
    const { posChange, setReg } = updates;
    const np = pos + defaultTo(1, posChange);
    const newRegs = setReg ? merge(regs, updates.setReg) : regs;
  
    return merge(stateWithInstruc, merge({ pos: np, regs: newRegs }, omit(['posChange', 'setReg', 'instruc'], updates)));
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
    , resolveVal
};