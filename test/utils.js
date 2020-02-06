const { getOutputs, Output, getInputs, Input } = require('easymidi')
const { isEqual } = require('lodash')

// import side-effect, but it does make things simpler
const output = new Output(getOutputs().find(d => d.includes('Arturia BeatStep')))
const input = new Input(getInputs().find(d => d.includes('Arturia BeatStep')))

// nicer format for hex
const hex = n => '0x' + n.toString(16).padStart(2, '0').toUpperCase()

// wait for time (sec), returns promise
const sleep = (time) => new Promise((resolve) => {
  setTimeout(resolve, time * 1000)
})

// close the devices
const close = () => {
  input.close()
  output.close()
}

// get a beatstep param.
const get = (pp, cc) => new Promise((resolve, reject) => {
  const getSysex = params => {
    if (isEqual(params.bytes.slice(0, 10), [0xF0, 0x00, 0x20, 0x6B, 0x7F, 0x42, 0x02, 0x00, pp, cc])) {
      input.removeListener('sysex', getSysex)
      resolve(params.bytes[10])
    }
  }
  input.on('sysex', getSysex)
  output.send('sysex', [0xF0, 0x00, 0x20, 0x6B, 0x7F, 0x42, 0x01, 0x00, pp, cc, 0xF7])
})

// set a beatstep param. sleep(0) helps beatstep keep up
const set = async (pp, cc, vv) => {
  output.send('sysex', [0xF0, 0x00, 0x20, 0x6B, 0x7F, 0x42, 0x02, 0x00, pp, cc, vv, 0xF7])
  await sleep(0)
}

// IDs for the pads
const pads = [...Array(16)].map((v, i) => 0x70 + i)

// named colors
const colors = {
  off: 0x00,
  red: 0x01,
  pink: 0x11,
  blue: 0x10
}

const padModes = {
  0x07: 'mmc',
  0x08: 'cc',
  0x01: 'silent',
  0x09: 'note',
  0x0B: 'program'
}

module.exports = { get, set, sleep, input, output, pads, colors, hex, padModes, close }
