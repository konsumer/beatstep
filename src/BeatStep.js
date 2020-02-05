import { Input, Output } from 'easymidi'

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

const DEBUG = true

class Controller {
  constructor (name, num, input) {
    this.output = new Output(input)
    this.name = name
    this.num = num
    this.send = this.output.send.bind(this.output)
  }

  // https://www.untergeek.de/2014/11/taming-arturias-beatstep-sysex-codes-for-programming-via-ipad/
  // defaults to pp setting for whole controller (0x01), vs 0x02-0x06 (which desktop software does)
  setParameter (vv, pp = 0x01) {
    this.send('sysex', [0xF0, 0x00, 0x20, 0x6B, 0x7F, 0x42, 0x02, 0x00, pp, this.num, vv, 0xF7])
  }

  getParamater (vv, pp = 0x01) {
    this.send('sysex', [0xF0, 0x00, 0x20, 0x6B, 0x7F, 0x42, 0x02, 0x00, pp, this.num, 0xF7])
  }

  set LED (on) {
    if (DEBUG) {
      console.log('LED', this.name, this.num, on)
    }
    if (on) {
      this.setParameter(10, 0x10)
    } else {
      this.setParameter(10, 0x00)
    }
  }
}

export default class BeatStep {
  constructor (input = 'Arturia BeatStep:Arturia BeatStep MIDI 1 20:0', output = 'BeatStep interceptor') {
    this.input = new Input(input)
    this.input_out = new Output(input)
    this.output = new Output(output, true)

    // passthrough event stuff
    this.send = this.output.send.bind(this.output)
    this.on = this.input.on.bind(this.input)

    this.controllers = {}
    Object.keys(controllers).forEach((c, i) => {
      this[c] = new Controller(c, controllers[c], input)
    })
  }

  setParameter (cc, vv, pp = 0x50) {
    this.input_out.send('sysex', [0xF0, 0x00, 0x20, 0x6B, 0x7F, 0x42, 0x0, 0x00, pp, cc, vv, 0xF7])
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

  set mode (c) {
    this.setParameter(0x03, seqmodes[c.toUpperCase()])
  }

  set cvChannel (c) {
    this.setParameter(0x0C, c)
  }

  set knobAcceleration (c) {
    this.setParameter(0x04, knobAccelerationModes[c.toUpperCase()], 0x41)
  }

  set paddVelocityCurve (c) {
    this.setParameter(0x04, padVelocityModes[c.toUpperCase()], 0x41)
  }
}
