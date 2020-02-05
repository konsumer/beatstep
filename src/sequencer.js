import { homedir } from 'os'
import chalk from 'chalk'
import { Output } from 'easymidi'

import BeatStep from './BeatStep'

export const sequencer = async (input, output, name) => {
  console.log(chalk.green('Press Ctrl-C to quit.'))
  const beatstep = new BeatStep(input, output)
  const out = new Output(name, true)

  beatstep.on('noteon', console.log)
  beatstep.on('noteoff', console.log)
  beatstep.on('cc', console.log)

  ;[...Array(16)].forEach((v, i) => {
    const pad = `PAD${i + 1}`
    beatstep[pad].channel = 1
    beatstep[pad].mode = 'NOTE'
    beatstep[pad].behavior = 'GATE'
    beatstep[pad].note = 0x3C + i
  })
}

export default sequencer
