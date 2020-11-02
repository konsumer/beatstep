import chalk from 'chalk'

import { pads, BeatStep, hex, sleep, controls } from './BeatStep'
import findConfig from 'find-config'
import { promises as fs } from 'fs'

// save the song
async function saveSong (song) {
  const file = findConfig('beatstep-song.json') || `${process.env.HOME}/.config/beatstep-song.json`
}

// load the song
async function loadSong () {
  const file = findConfig('beatstep-song.json') || `${process.env.HOME}/.config/beatstep-song.json`

  console.log('FILE', file)

  // create empty song
  return [...new Array(16)].map(() => [...new Array(16)].map(() => (new Array(16)).fill(false)))
}

// set initial state of controller
async function setup (beatstep) {
  // TODO: can I force controller into CNTRL mode?

  for (const p in pads) {
    await beatstep.mode(pads[p], 'NOTE')
    await beatstep.noteChannel(pads[p], 0x01)
    await beatstep.note(pads[p], 0x70 + p)
  }

  // TODO: is it possible to bind the level/rate knob?
  const controlsv = Object.values(controls)
  for (const c in controlsv) {
    await beatstep.mode(controlsv[c], 'NOTE')
    await beatstep.noteChannel(controlsv[c], 0x02)
    await beatstep.note(controlsv[c], controlsv[c])
  }
}

export const sequencer = async (input, output, name) => {
  console.log(chalk.green('Press Ctrl-C to quit.'))
  const beatstep = new BeatStep(input, output)

  await setup(beatstep)

  // BELOW IS SEQUENCER

  let stopPressed = false
  let shiftPressed = false
  let currentPattern = 0
  let currentTrack = 0
  let playing = false
  let step = 0

  // TODO: figure out CHAN as I can track up/down for CHAN button, but not which channel was selected
  // TODO: send initial stop command?

  // this is the sequence: [pattern][track][step]
  const pattern = await loadSong()

  // show current pattern
  async function showCurrentPattern () {
    for (const p in pads) {
      await beatstep.color(pads[p], pattern[currentPattern][currentTrack][p] ? 'red' : 'off')
    }
  }

  // show the current track
  async function showTrackSelect () {
    for (const p in pads) {
      await beatstep.color(pads[p], p == currentTrack ? 'blue' : 'off')
    }
  }

  async function showPatternSelect () {
    for (const p in pads) {
      await beatstep.color(pads[p], p == currentPattern ? 'blue' : 'off')
    }
  }

  // convert a pad to a number 0-15
  function padToNumber (note) {
    let out = note - 0x60
    // pads > 11 are numbered differently
    if (out < 0) {
      out = out + 68
    }
    return out
  }

  // initial view
  await showCurrentPattern()

  beatstep.on('noteon', async ({ channel, note, velocity }) => {
    if (channel === 0x02) {
      if (note === controls.STOP) {
        stopPressed = true
        playing = false
        step = 0
        await showTrackSelect()
      }
      if (note === controls.SHIFT) {
        shiftPressed = true
        await showPatternSelect()
      }
      if (note === controls.PLAY) {
        playing = !playing
      }
    } else if (channel === 0x00) {
      // handle step here
    }
  })

  beatstep.on('noteoff', async ({ channel, note, velocity }) => {
    if (channel === 0x02) {
      if (note === controls.STOP) {
        stopPressed = false
        playing = false
      }
      if (note === controls.SHIFT) {
        shiftPressed = false
      }
      await showCurrentPattern()
    } else if (channel === 0x01) {
      if (stopPressed) {
        currentTrack = padToNumber(note)
        await showTrackSelect()
      } else if (shiftPressed) {
        currentPattern = padToNumber(note)
        await showPatternSelect()
      } else {
        const s = padToNumber(note)
        pattern[currentPattern][currentTrack][s] = !pattern[currentPattern][currentTrack][s]
        await showCurrentPattern()
      }
    } else if (channel === 0x00) {
      // handle step here
    }
  })
}

export default sequencer
