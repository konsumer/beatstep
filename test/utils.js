const { getOutputs, Output } = require('easymidi')

const output = new Output(getOutputs().find(d => d.includes('Arturia BeatStep')))

// wait for time (sec), returns promise
const sleep = (time) => new Promise((resolve) => {
  setTimeout(resolve, time * 1000)
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

// nicer format for hex
const hex = n => '0x' + n.toString(16).padStart(2, '0').toUpperCase()

module.exports = { set, sleep, output, pads, colors, hex }
