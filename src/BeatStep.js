import { Input, Output } from 'easymidi'
import scale from 'scale-number-range'

// supported cc controllers
export const controllers = {
  ENC1: 0x20,
  ENC2: 0x21,
  ENC3: 0x22,
  ENC4: 0x23,
  ENC5: 0x24,
  ENC6: 0x25,
  ENC7: 0x26,
  ENC8: 0x27,
  ENC9: 0x28,
  ENC10: 0x29,
  ENC11: 0x2A,
  ENC12: 0x2B,
  ENC13: 0x2C,
  ENC14: 0x2D,
  ENC15: 0x2E,
  ENC16: 0x2F,

  PAD1: 0x70,
  PAD2: 0x71,
  PAD3: 0x72,
  PAD4: 0x73,
  PAD5: 0x74,
  PAD6: 0x75,
  PAD7: 0x76,
  PAD8: 0x77,
  PAD9: 0x78,
  PAD10: 0x79,
  PAD11: 0x7A,
  PAD12: 0x7B,
  PAD13: 0x7C,
  PAD14: 0x7D,
  PAD15: 0x7E,
  PAD16: 0x7F,

  VOLUME: 0x30,
  STOP: 0x59,
  PLAY: 0x58
}

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

export const controllerBehaviors = {
  TOGGLE: 0x00,
  GATE: 0x01
}

const DEBUG = true

const hex = n => `0x${n.toString(16).padStart(2, '0').toUpperCase()}`

export class Controller {
  constructor (name, output) {
    this.output = output
    this.name = name
    this.num = controllers[name]
    this.send = this.output.send.bind(this.output)
    this.noteNum = this.num
  }

  // defaults to pp setting for whole controller (0x01), vs 0x02-0x06 (which desktop software does)
  setParameter (vv, pp = 0x01) {
    if (DEBUG) {
      console.log(this.name, { cc: hex(this.num), vv: hex(vv), pp: hex(pp) })
    }
    this.send('sysex', [0xF0, 0x00, 0x20, 0x6B, 0x7F, 0x42, 0x02, 0x00, pp, this.num, vv, 0xF7])
  }

  getParamater (pp = 0x01) {
    this.send('sysex', [0xF0, 0x00, 0x20, 0x6B, 0x7F, 0x42, 0x02, 0x00, pp, this.num, 0xF7])
  }

  set channel (c) {
    this.setParameter(c, 0x02)
  }

  set note (c) {
    this.setParameter(c, 0x03)
  }

  set mode (c) {
    this.setParameter(controllerModes[c.toUpperCase()], 0x01)
  }

  set behavior (c) {
    this.setParameter(controllerBehaviors[c.toUpperCase()], 0x06)
  }
}

export class BeatStep {
  constructor (input, output) {
    this.input = new Input(input)
    this.out = new Output(output)

    // passthrough event stuff
    this.send = this.out.send.bind(this.out)
    this.on = this.input.on.bind(this.input)

    // makes auto-resolutions for getter/setters work
    this.controllers = {}
    Object.keys(controllers).forEach((c, i) => {
      this[c] = new Controller(c, this.out)
    })

    this.preset = 0
  }

  setParameter (cc, vv, pp = 0x50) {
    if (DEBUG) {
      console.log('GLOBAL', { cc: hex(this.num), vv: hex(vv), pp: hex(pp) })
    }
    this.send('sysex', [0xF0, 0x00, 0x20, 0x6B, 0x7F, 0x42, 0x0, 0x00, pp, cc, vv, 0xF7])
  }

  getParameter (cc, pp = 0x50) {
    this.send('sysex', [0xF0, 0x00, 0x20, 0x6B, 0x7F, 0x42, 0x0, 0x00, pp, cc, 0xF7])
  }

  // global getter/setters

  set preset (c) {
    this.send('sysex', [0xF0, 0x00, 0x20, 0x6B, 0x7F, 0x42, 0x06, c, 0xF7])
  }

  recall (c) {
    this.send('sysex', [0xF0, 0x00, 0x20, 0x6B, 0x7F, 0x42, 0x05, c, 0xF7])
  }

  set channel (c) {
    this.setParameter(0x01, c)
  }

  set transpose (c) {
    this.setParameter(0x02, c)
  }

  set scale (c) {
    this.setParameter(0x03, scales[c.toUpperCase().replace(' ', '_')])
  }

  set seqmode (c) {
    this.setParameter(0x04, seqmodes[c.toUpperCase()])
  }

  set step (c) {
    this.setParameter(0x05, stepSizes[c])
  }

  set patternLength (c) {
    this.setParameter(0x06, c)
  }

  set swing (c) {
    // 0-1 = 0x32-0x4B
    this.setParameter(0x07, Math.floor(scale(c, 0, 1, 0x32, 0x4B)))
  }

  set gate (c) {
    // 0-1 = 0x00-0x63
    this.setParameter(0x08, Math.floor(scale(c, 0, 1, 0x00, 0x63)))
  }

  set legato (c) {
    this.setParameter(0x09, legatoModes[c.toUpperCase()])
  }

  set cvChannel (c) {
    this.setParameter(0x0C, c)
  }

  set paddVelocityCurve (c) {
    this.setParameter(0x03, padVelocityModes[c.toUpperCase()], 0x41)
  }

  set knobAcceleration (c) {
    this.setParameter(0x04, knobAccelerationModes[c.toUpperCase()], 0x41)
  }
}

export default BeatStep
