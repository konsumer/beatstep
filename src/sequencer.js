import chalk from 'chalk'

import { pads, BeatStep, hex, sleep, controls } from './BeatStep'

export const sequencer = async (input, output, name) => {
  console.log(chalk.green('Press Ctrl-C to quit.'))
  const beatstep = new BeatStep(input, output)

  // set initial state of controller
  for (const p in pads) {
    await beatstep.mode(pads[p], 'NOTE')
    await beatstep.noteChannel(pads[p], 0x01)
    await beatstep.note(pads[p], 0x70 + p)
  }

  const controlsv = Object.values(controls)
  for (const c in controlsv) {
    await beatstep.mode(controlsv[c], 'NOTE')
    await beatstep.noteChannel(controlsv[c], 0x02)
    await beatstep.note(controlsv[c], controlsv[c])
  }

  const handler = ({ _type, ...params }) => {
    const out = { type: _type }
    Object.keys(params).forEach(p => {
      out[p] = hex(params[p])
    })
    console.log(out)
  }

  beatstep.on('noteon', handler)
  beatstep.on('noteoff', handler)
  beatstep.on('poly', handler)
  beatstep.on('cc', handler)
  beatstep.on('program', handler)
  beatstep.on('channel', handler)
  beatstep.on('pitch', handler)
  beatstep.on('position', handler)
  beatstep.on('mtc', handler)
  beatstep.on('select', handler)
  beatstep.on('stop', handler)
  beatstep.on('reset', handler)
  beatstep.on('sysex', params => console.log({ type: params._type, bytes: params.bytes.map(hex) }))

  // test global channel
  console.log('global channel', await beatstep.get(0x50, 0x0B))

  beatstep.on('noteoff', async params => {
    if (params.channel === 0x02) { // left controller button
      // channel is "track"
      if (params.note === controls.CHAN) {
        // hmm, this should grab global channel that was just selected, but it always returns 0x15
        console.log('channel', hex(await beatstep.get(0x50, 0x0B)))
      }
    }
  })

  // TODO: disable real sequencer and run my own
}

export default sequencer
