const { output, set, sleep, pads, colors } = require('./utils')

const run = async () => {
  for (const p in pads) {
    set(0x10, pads[p], colors.off)
    await sleep(0.001)
  }

  for (const p in pads) {
    set(0x10, pads[p], colors.red)
    await sleep(0.1)
  }

  for (const p in pads) {
    set(0x10, pads[p], colors.pink)
    await sleep(0.1)
  }

  for (const p in pads) {
    set(0x10, pads[p], colors.blue)
    await sleep(0.1)
  }

  for (const p in pads) {
    set(0x10, pads[p], colors.off)
    await sleep(0.1)
  }

  output.close()
}
run()
