#!/bin/sh
':' // ;exec "$(command -v node || command -v nodejs)" -r esm $0 $*

import { getInputs, getOutputs } from 'easymidi'
import yargs from 'yargs'
import { promises as fs } from 'fs'
import findConfig from 'find-config'

import { BeatStep } from './BeatStep'
import sequencer from './sequencer'

const inputs = getInputs()
const outputs = getOutputs()

yargs
  .command('load <file>', 'Load a .beatstep preset file',
    y => {
      y
        .option('output', {
          alias: 'o',
          description: 'MIDI input ID number (use `beatstep list`)',
          type: 'number',
          default: outputs.indexOf(outputs.find(d => d.includes('Arturia BeatStep'))) + 1
        })
    },
    async ({ output, file }) => {
      const beatstep = new BeatStep(undefined, outputs[output - 1])
      await beatstep.setPresets(JSON.parse(await fs.readFile(file)))
    }
  )
  .command('save <file>', 'Save a .beatstep preset file',
    y => {
      y
        .option('input', {
          alias: 'i',
          description: 'MIDI input ID number (use `beatstep list`)',
          type: 'number',
          default: inputs.indexOf(inputs.find(d => d.includes('Arturia BeatStep'))) + 1
        })
    },
    async ({ input, file }) => {
      const beatstep = new BeatStep(inputs[input - 1])
      await fs.writeFile(file, JSON.stringify(await beatstep.getPresets(), null, 2))
    }
  )
  .command('list', 'List MIDI devices',
    y => {},
    args => {
      console.log('INPUTS:')
      inputs.forEach((d, i) => {
        console.log(`  ${i + 1}: ${d}`)
      })
      console.log('OUTPUTS:')
      outputs.forEach((d, i) => {
        console.log(`  ${i + 1}: ${d}`)
      })
    }
  )
  .command('seq', 'Start sequencer', y => {
    y
      .option('input', {
        alias: 'i',
        description: 'MIDI input ID number (use `beatstep list`)',
        type: 'number',
        default: inputs.indexOf(inputs.find(d => d.includes('Arturia BeatStep'))) + 1
      })
      .option('output', {
        alias: 'o',
        description: 'MIDI input ID number (use `beatstep list`)',
        type: 'number',
        default: outputs.indexOf(outputs.find(d => d.includes('Arturia BeatStep'))) + 1
      })
      .option('name', {
        alias: 'n',
        description: 'Name for the virtual-device',
        type: 'string',
        default: 'Extended BeatStep'
      })
      .option('channel', {
        alias: 'c',
        description: 'The channel to send notes & CCs on',
        default: 0
      })
      .option('song', {
        alias: 's',
        description: 'The filename of the song to use',
        default: findConfig('beatstep-song.json') || `${process.env.HOME}/.config/beatstep-song.json`
      })
  }, ({ input, output, name, channel, song }) => {
    sequencer(inputs[input - 1], outputs[output - 1], name, channel, song)
  })
  .demandCommand()
  .argv
