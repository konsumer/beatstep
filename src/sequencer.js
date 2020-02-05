import { homedir } from 'os'
import chalk from 'chalk'
import { Output } from 'easymidi'

import BeatStep from './BeatStep'

export const sequencer = async (input, output) => {
  console.log(chalk.green('Press Ctrl-C to quit.'))
  const beatstep = new BeatStep(input)
  const out = new Output(output, true)

  beatstep.PAD1.LED = true

  beatstep.on('noteon', console.log)
  beatstep.on('noteoff', console.log)
  beatstep.on('cc', console.log)
}

export default sequencer
