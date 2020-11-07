// this lets you see what is outputted when the same setup is run

import chalk from 'chalk'
import { getOutputs, getInputs } from 'easymidi'

import { BeatStep, hex } from './BeatStep'
import setup from './setup'

const handler = ({ _type, bytes, ...params }) => {
  console.log(chalk.green(_type))
  if (_type === 'sysex') {
    console.log(`${chalk.blue('  bytes')}:`, bytes.map(n => chalk.yellow(hex(n))).join(', '))
  }
  console.log(Object.keys(params).map(p => `  ${chalk.blue(p)}: ${chalk.yellow(hex(params[p]))}`).join('\n') + '\n')
}

async function run () {
  const beatstep = new BeatStep(
    getInputs().find(d => d.includes('Arturia BeatStep')),
    getOutputs().find(d => d.includes('Arturia BeatStep'))
  )
  await setup(beatstep)
  beatstep.on('noteon', handler)
  beatstep.on('noteoff', handler)
  beatstep.on('poly', handler)
  beatstep.on('cc', handler)
  beatstep.on('program', handler)
  beatstep.on('channel aftertouch', handler)
  beatstep.on('pitch', handler)
  beatstep.on('position', handler)
  beatstep.on('mtc', handler)
  beatstep.on('select', handler)
  beatstep.on('clock', handler)
  beatstep.on('start', handler)
  beatstep.on('continue', handler)
  beatstep.on('stop', handler)
  beatstep.on('activesense', handler)
  beatstep.on('reset', handler)
  beatstep.on('sysex', handler)
}
run()
