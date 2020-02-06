// this is for testing getter
const esmrequire = require('esm')(module)
const { getOutputs, getInputs } = require('easymidi')
const { BeatStep, controllerModes, pads } = esmrequire('../src/BeatStep')

const run = async () => {
  const beatstep = new BeatStep(
    getInputs().find(d => d.includes('Arturia BeatStep')),
    getOutputs().find(d => d.includes('Arturia BeatStep'))
  )

  console.log('controller mode for pad 1:', controllerModes[await beatstep.get(0x01, pads[0])])
  console.log('controller mode for pad 2:', controllerModes[await beatstep.get(0x01, pads[1])])
  console.log('controller mode for pad 3:', controllerModes[await beatstep.get(0x01, pads[2])])
  console.log('controller mode for pad 4:', controllerModes[await beatstep.get(0x01, pads[3])])

  beatstep.close()
}
run()
