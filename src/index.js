import { getInputs } from 'easymidi'
import yargs from 'yargs'

import sequencer from './sequencer'

const devices = getInputs()

yargs
  .command('list', 'List MIDI devices',
    y => {},
    args => {
      devices.forEach((d, i) => {
        console.log(i + 1, d)
      })
    }
  )
  .command('seq', 'Start a complex sequencer', y => {
    y
      .option('input', {
        alias: 'i',
        description: 'MIDI input ID number (use `beatstep list`)',
        type: 'number',
        default: devices.indexOf(devices.find(d => d.includes('Arturia BeatStep'))) + 1
      })
      .option('output', {
        alias: 'o',
        description: 'Name for MIDI virtual output device',
        type: 'string',
        default: 'BeatStep interceptor'
      })
  }, ({ input, output }) => {
    sequencer(devices[input - 1], output)
  })
  .argv
