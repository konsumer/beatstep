import easymidi from 'easymidi'
import yargs from 'yargs'
import chalk from 'chalk'

import BeatStep from './BeatStep'

const devices = easymidi.getInputs()

const sequencer = (input, output) => {
  console.log(chalk.green('Press Ctrl-C to quit.'))
  const beatstep = new BeatStep(input)
  const out = new easymidi.Output(output, true)

  beatstep.PAD1.LED = true

  beatstep.on('noteon', console.log)
  beatstep.on('noteoff', console.log)
  beatstep.on('cc', console.log)
}

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
