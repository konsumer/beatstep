import { Input, Output } from 'easymidi'
import scale from 'scale-number-range'
const { isEqual } = require('lodash')

export const controls = {
  VOLUME: 0x30,
  PLAY: 0x58,
  STOP: 0x59,
  SEQ: 0x5A,
  SYNC: 0x5B,
  RECALL: 0x5C,
  STORE: 0x5D,
  SHIFT: 0x5E,
  CHAN: 0x5F
}

// IDs for encoders
export const encoders = [...Array(16)].map((v, i) => 0x00 + i)

// IDs for the pads
export const pads = [...Array(16)].map((v, i) => 0x70 + i)

export const scales = {
  CHROMATIC: 0,
  MAJOR: 1,
  MINOR: 2,
  DORIAN: 3,
  MIXOLYDIAN: 4,
  HARMONIC_MINOR: 5,
  BLUES: 6,
  USER: 7
}

export const seqmodes = {
  FORWARD: 0,
  REVERSE: 1,
  ALTERNATING: 2,
  RANDOM: 3
}

export const knobAccelerationModes = {
  SLOW: 0x00,
  MEDIUM: 0x01,
  FAST: 0x02
}

export const padVelocityModes = {
  LINEAR: 0x00,
  LOGARITHMIC: 0x01,
  EXPONENTIAL: 0x02,
  FULL: 0x03
}

export const stepSizes = {
  4: 0x00,
  8: 0x01,
  16: 0x02,
  32: 0x03
}

export const legatoModes = {
  OFF: 0x00,
  ON: 0x01,
  RESET: 0x02
}

export const controllerModes = {
  MMC: 0x07,
  CC: 0x08,
  SILENT: 0x01,
  NOTE: 0x09,
  PROGRAM: 0x0B
}

// named colors
export const colors = {
  OFF: 0x00,
  RED: 0x01,
  PINK: 0x11,
  BLUE: 0x10
}

export const controllerBehaviors = {
  TOGGLE: 0x00,
  GATE: 0x01
}

// nicer format for hex
export const hex = n => `0x${n.toString(16).padStart(2, '0').toUpperCase()}`

// wait for time (sec), returns promise
export const sleep = (time) => new Promise((resolve) => {
  setTimeout(resolve, time * 1000)
})

export class BeatStep {
  constructor (input, output) {
    if (input) {
      this.input = new Input(input)
      this.on = this.input.on.bind(this.input)
      this.removeListener = this.input.removeListener.bind(this.input)
    } else {
      this.on = () => console.error('Please set your input in the BeatStep constructor.')
      this.removeListener = () => console.error('Please set your input in the BeatStep constructor.')
    }
    if (output) {
      this.output = new Output(output)
      this.send = this.output.send.bind(this.output)
    } else {
      this.send = () => console.error('Please set your output in the BeatStep constructor.')
    }
  }

  close () {
    this.input && this.input.close()
    this.output && this.output.close()
  }

  // get a beatstep param.
  get (pp, cc) {
    return new Promise((resolve, reject) => {
      const getSysex = params => {
        if (isEqual(params.bytes.slice(0, 10), [0xF0, 0x00, 0x20, 0x6B, 0x7F, 0x42, 0x02, 0x00, pp, cc])) {
          this.removeListener('sysex', getSysex)
          sleep(0)
            .then(() => resolve(params.bytes[10]))
        }
      }
      this.on('sysex', getSysex)
      this.send('sysex', [0xF0, 0x00, 0x20, 0x6B, 0x7F, 0x42, 0x01, 0x00, pp, cc, 0xF7])
    })
  }

  // set a beatstep param. sleep(0) helps beatstep keep up
  async set (pp, cc, vv) {
    this.send('sysex', [0xF0, 0x00, 0x20, 0x6B, 0x7F, 0x42, 0x02, 0x00, pp, cc, vv, 0xF7])
    await sleep(0)
  }

  // set the color of the pad
  color (pad, color) {
    return this.set(0x10, pad, colors[color.toUpperCase()])
  }

  // set the mode of the control
  mode (control, mode) {
    return this.set(0x01, control, controllerModes[mode.toUpperCase()])
  }

  // set the channel a note-control sends
  noteChannel (control, channel) {
    return this.set(0x02, control, channel)
  }

  // set the note a note-control sends
  note (control, note) {
    return this.set(0x03, control, note)
  }

  noteMode (control, mode) {
    return this.set(0x06, control, controllerBehaviors[mode.toUpperCase()])
  }
}

export default BeatStep
