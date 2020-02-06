// this is for testing LED stuff

// this is for testing getter
const esmrequire = require('esm')(module)
const { getOutputs, getInputs } = require('easymidi')
const { BeatStep, pads, colors, sleep } = esmrequire('../src/BeatStep')

const run = async () => {
  const beatstep = new BeatStep(
    getInputs().find(d => d.includes('Arturia BeatStep')),
    getOutputs().find(d => d.includes('Arturia BeatStep'))
  )

  for (const p in pads) {
    await beatstep.set(0x10, pads[p], colors.off)
  }

  for (const p in pads) {
    await beatstep.set(0x10, pads[p], colors.red)
    await sleep(0.1)
  }

  for (const p in pads) {
    await beatstep.set(0x10, pads[p], colors.pink)
    await sleep(0.1)
  }

  for (const p in pads) {
    await beatstep.set(0x10, pads[p], colors.blue)
    await sleep(0.1)
  }

  for (const p in pads) {
    await beatstep.set(0x10, pads[p], colors.off)
  }

  beatstep.close()
}
run()
