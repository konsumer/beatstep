import { getInputs, getOutputs } from 'easymidi'
import yargs from 'yargs'

import sequencer from './sequencer'

const inputs = getInputs()
const outputs = getOutputs()

yargs
  .command('list', 'List MIDI devices',
    y => {},
    args => {
      console.log('INPUTS:')
      inputs.forEach((d, i) => {
        console.log(`  ${i + 1}: ${d}`)
      })
      console.log('OUTPUTS:')
      outputs.forEach((d, i) => {
        console.log(`  ${i + 1}: ${d}`)
      })
    }
  )
  .command('seq', 'Start a complex sequencer', y => {
    y
      .option('input', {
        alias: 'i',
        description: 'MIDI input ID number (use `beatstep list`)',
        type: 'number',
        default: inputs.indexOf(inputs.find(d => d.includes('Arturia BeatStep'))) + 1
      })
      .option('output', {
        alias: 'o',
        description: 'MIDI input ID number (use `beatstep list`)',
        type: 'number',
        default: outputs.indexOf(outputs.find(d => d.includes('Arturia BeatStep'))) + 1
      })
      .option('name', {
        alias: 'n',
        description: 'Name for the virtual-device',
        type: 'string',
        default: 'Extended BeatStep'
      })
  }, ({ input, output, name }) => {
    sequencer(inputs[input - 1], outputs[output - 1], name)
  })
  .argv
