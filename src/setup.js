import { promises as fs } from 'fs'
import { controls } from './BeatStep'

// set initial state of controller
async function setup (beatstep) {
  await beatstep.setPresets(JSON.parse(await fs.readFile(`${__dirname}/../beatstep-node.beatstep`)))
  
  await beatstep.mode(controls.SHIFT, 'NOTE')
  await beatstep.noteChannel(controls.SHIFT, 0x0F)
  await beatstep.note(controls.SHIFT, 0x02)
}

export default setup
