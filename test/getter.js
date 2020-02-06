// this is for testing getter
const { get, close, pads, padModes } = require('./utils')

const run = async () => {
  console.log('controller mode for pad 1:', padModes[await get(0x01, pads[0])])
  console.log('controller mode for pad 2:', padModes[await get(0x01, pads[1])])
  console.log('controller mode for pad 3:', padModes[await get(0x01, pads[2])])
  console.log('controller mode for pad 4:', padModes[await get(0x01, pads[3])])

  close()
}
run()
