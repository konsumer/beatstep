import chalk from 'chalk'

import { promises as fs } from 'fs'
import easymidi from 'easymidi'

import { BeatStep, pads, controls, hex } from './BeatStep'
import setup from './setup'

// save the song
async function saveSong (song, songFile) {
  await fs.writeFile(songFile, JSON.stringify(song, null, 2))
}

// load the song
async function loadSong (songFile) {
  try {
    return JSON.parse(await fs.readFile(songFile))
  } catch (e) {
    return [...new Array(16)].map(() => [...new Array(16)].map(() => (new Array(16)).fill(false)))
  }
}

export const sequencer = async (input, output, name, channel, song) => {
  console.log(chalk.green('Press Ctrl-C to quit.'))
  const beatstep = new BeatStep(input, output)
  const voutput = new easymidi.Output(name, true)
  await setup(beatstep)

  let pressedStop = false
  let pressedShift = false
  let playing = false
  let currentTrack = 0
  let currentPattern = 0
  let step = 0
  let bpm = 120

  const showTrack = async () => {
    for (const p in  pads) {
      await beatstep.color(pads[p], p == currentTrack ? 'blue' : 'off')
    }
  }
  
  const showPattern = async () => {
    for (const p in  pads) {
      await beatstep.color(pads[p], p == currentPattern ? 'blue' : 'off')
    }
  }
  
  const showCurrent = async () => {
    await beatstep.color(controls.PLAY, playing ? 'blue' : 'off')
    for (const p in pads) {
      await beatstep.color(pads[p], pattern[currentPattern][currentTrack][p] ? (p == step && playing ? 'pink' : 'red') : (p == step && playing ? 'blue' : 'off'))
    }
  }

  beatstep.on('noteon', async ({ channel, note, velocity }) => {
    if (channel === 0x0F) {
      if (note === 0x00) {
        pressedStop = true
        await showTrack()
      }
      if (note === 0x01) {
        playing = !playing
        await showCurrent()
      }
      if (note === 0x02) {
        pressedShift = true
        await showPattern()
      }
    } else {
      if (!pressedStop && !pressedShift) {
        pattern[currentPattern][currentTrack][ note - 0x24 ] = ! pattern[currentPattern][currentTrack][ note - 0x24 ]
        if (pattern[currentPattern][currentTrack][ note - 0x24 ]){
          voutput.send('noteon', { channel, note: currentTrack + 0x24, velocity })
        }
        await saveSong (pattern, song)
        await showCurrent()
      } else {
        if (pressedStop) {
          currentTrack = note - 0x24
          await showTrack()
        }
        if (pressedShift) {
          currentPattern = note - 0x24
          await showPattern()
        }
      }
    }
  })
  
  beatstep.on('noteoff', async ({ channel, note, velocity }) => {
    if (channel === 0x0F) {
      if (note === 0x00) {
        pressedStop = false
        await showCurrent()
      }
      if (note === 0x02) {
        pressedShift = false
        await showCurrent()
      }
    } else {
      if (!pressedStop && !pressedShift) {
        if (pattern[currentPattern][currentTrack][ note - 0x24 ]){
          voutput.send('noteoff', { channel, note: currentTrack + 0x24, velocity })
        }
        await showCurrent()
      }
    }
  })

  // handle rate knob
  beatstep.on('cc', ({ channel, controller, value }) => {
    if (channel === 0x00 && controller === 0x10){
      bpm = (value * 4) + 10
      console.log(chalk.blue('BPM'), chalk.yellow(bpm))
    }
  })

  // passthrough other sorts of messages
  beatstep.on('activesense', (params) => voutput.send('activesense', params))
  beatstep.on('cc', (params) => voutput.send('cc', params))
  beatstep.on('channel aftertouch', (params) => voutput.send('channel aftertouch', params))
  beatstep.on('clock', (params) => voutput.send('clock', params))
  beatstep.on('continue', (params) => voutput.send('continue', params))
  beatstep.on('mtc', (params) => voutput.send('mtc', params))
  beatstep.on('pitch', (params) => voutput.send('pitch', params))
  beatstep.on('poly', (params) => voutput.send('poly', params))
  beatstep.on('position', (params) => voutput.send('position', params))
  beatstep.on('program', (params) => voutput.send('program', params))
  beatstep.on('reset', (params) => voutput.send('reset', params))
  beatstep.on('select', (params) => voutput.send('select', params))
  beatstep.on('start', (params) => voutput.send('start', params))
  beatstep.on('stop', (params) => voutput.send('stop', params))

  const pattern = await loadSong(song)
  await showCurrent()

  // this gets run once every sequencer beat
  function tick() {
    setTimeout(tick, 1000 * 60 / bpm)
    if (playing) {
      for (const t in pattern[currentPattern]) {
        if (pattern[currentPattern][t][step]) {
          voutput.send('noteon', { channel, note: 0x24 + parseInt(t), velocity: 0x7F })
        } else {
          voutput.send('noteoff', { channel, note: 0x24 + parseInt(t), velocity: 0x00 })
        }
      }
      step = (step + 1) % 16
      showCurrent()
    }
  }
  
  tick()
}

export default sequencer
