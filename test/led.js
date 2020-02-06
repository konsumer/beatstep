// this is for testing LED stuff

const { close, set, sleep, pads, colors } = require('./utils')

const run = async () => {
  for (const p in pads) {
    await set(0x10, pads[p], colors.off)
  }

  for (const p in pads) {
    await set(0x10, pads[p], colors.red)
    await sleep(0.1)
  }

  for (const p in pads) {
    await set(0x10, pads[p], colors.pink)
    await sleep(0.1)
  }

  for (const p in pads) {
    await set(0x10, pads[p], colors.blue)
    await sleep(0.1)
  }

  for (const p in pads) {
    await set(0x10, pads[p], colors.off)
  }

  close()
}
run()
