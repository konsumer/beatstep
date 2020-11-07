#!/bin/sh
':' // ;exec "$(command -v node || command -v nodejs)" -r esm $0 $*

import { getInputs, getOutputs } from 'easymidi'
import yargs from 'yargs'
import { promises as fs } from 'fs'

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
      await beatstep.setPresets( JSON.parse(await fs.readFile(file)) )
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
  .command('seq', 'Start a complex sequencer', y => {
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
  }, ({ input, output, name, channel }) => {
    sequencer(inputs[input - 1], outputs[output - 1], name, channel)
  })
  .demandCommand()
  .argv
