// this is for testing getter
const { getInputs, Input } = require('easymidi')
const { isEqual } = require('lodash')

const { output, pads } = require('./utils')

const input = new Input(getInputs().find(d => d.includes('Arturia BeatStep')))

// get a value from device
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

const padModes = {
  0x07: 'mmc',
  0x08: 'cc',
  0x01: 'silent',
  0x09: 'note',
  0x0B: 'program'

}

const run = async () => {
  console.log('controller mode for pad 1:', padModes[await get(0x01, pads[0])])
  console.log('controller mode for pad 2:', padModes[await get(0x01, pads[1])])
  console.log('controller mode for pad 3:', padModes[await get(0x01, pads[2])])
  console.log('controller mode for pad 4:', padModes[await get(0x01, pads[3])])

  output.close()
  input.close()
}
run()
