import chalk from 'chalk'

import { pads, BeatStep, hex, sleep, controls } from './BeatStep'

export const sequencer = async (input, output, name) => {
  console.log(chalk.green('Press Ctrl-C to quit.'))
  const beatstep = new BeatStep(input, output)

  // set initial state of controller
  for (const p in pads) {
    await beatstep.mode(pads[p], 'PROGRAM')
    await beatstep.note(pads[p], 0x70 + p)
    await beatstep.noteChannel(pads[p], 0x01)
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
  // beatstep.on('sysex', params => console.log({ type: params._type, bytes: params.bytes.map(hex) }))

  // usage
  // shift-options sets current pattern: 16 tracks, 4x4 sequences

  const displaySequence = async () => {
    for (const p in pads) {
      await beatstep.color(pads[p], sequence[seqa][seqb][seqc][p] ? 'BLUE' : 'OFF')
      await sleep(0)
    }
  }

  await beatstep.mode(controls.SHIFT, 'NOTE')
  await beatstep.noteChannel(controls.SHIFT, 0x02)
  await beatstep.note(controls.SHIFT, 0x01)

  const sequence = [...Array(4)].map(() => [...Array(4)].map(() => [...Array(16)].map(() => [...Array(16)].fill(0))))
  let seqa = await beatstep.get(0x50, 0x03) // scale
  let seqb = await beatstep.get(0x50, 0x04) // mode
  let seqc = await beatstep.get(0x50, 0x05) // step

  // test beat
  sequence[0][0][0] = [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0]

  await displaySequence()

  beatstep.on('noteoff', async params => {
    if (params.channel === 0x02 && params.note === 0x01) { // shift
      seqa = await beatstep.get(0x50, 0x03) // scale
      seqb = await beatstep.get(0x50, 0x04) // mode
      seqc = await beatstep.get(0x50, 0x05) // step
      await displaySequence()
    }
  })

  // TODO: disable real sequencer and run my own
}

export default sequencer
