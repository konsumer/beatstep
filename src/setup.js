import { promises as fs } from 'fs'
import { pads, controls } from './BeatStep'

// set initial state of controller
async function setup (beatstep) {
  await beatstep.setPresets(JSON.parse(await fs.readFile(`${__dirname}/../beatstep-node.beatstep`)))
  
  await beatstep.mode(controls.SHIFT, 'NOTE')
  await beatstep.noteChannel(controls.SHIFT, 0x0F)
  await beatstep.note(controls.SHIFT, 0x02)

  // // TODO: can I force controller into CNTRL mode?

  // for (const p in pads) {
  //   await beatstep.mode(pads[p], 'NOTE')
  //   await beatstep.noteChannel(pads[p], 0x01)
  //   await beatstep.note(pads[p], 0x70 + p)

  //   // this makes play stop working (so I can control it)
  //   await beatstep.set(0x50, p, 0x01)
  // }

  // // TODO: is it possible to bind the level/rate knob?
  // const controlsv = Object.values(controls)
  // for (const c in controlsv) {
  //   await beatstep.mode(controlsv[c], 'NOTE')
  //   await beatstep.noteChannel(controlsv[c], 0x02)
  //   await beatstep.note(controlsv[c], controlsv[c])
  // }
}

export default setup
