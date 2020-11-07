// this lets you see what is outputted when the same setup is run

import chalk from 'chalk'
import { getOutputs, getInputs } from 'easymidi'

import { BeatStep } from './BeatStep'
import setup from './setup'

const handler = ({ _type, ...params }) => {
  console.log(chalk.green(_type))
  console.log(Object.keys(params).map(p => `${chalk.blue(p)}: ${chalk.yellow(params[p])}`).join('\n  ') + '\n')
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
