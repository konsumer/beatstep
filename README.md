# WIP

I haven't really worked out the sequencer fully. I think I know how I want it to work, but haven't written the code to make it work that way. I think the lib is still useful as it is, to make things (I have all the known sysex commands worked out, etc) but it will need some more work to be a functional sequencer.

## BeatStep Interceptor

[![new beatstep sequencer](http://img.youtube.com/vi/dVYkL6qTRXc/0.jpg)](http://www.youtube.com/watch?v=dVYkL6qTRXc "See it in action")

This is a command-line program to make the Arturia BeatStep work in different ways than the firmware is meant to.

The Arturia BeatStep is a really nice-feeling device, that is pretty cheap (~$100 new.) The built-in firmware for the device is OK, but a bit wonky for sequencing complex drum-patterns. Since I don't have access to the firmware's source, I made this so I'd have a sequencer that works how I want.

It starts a virtual midi device that can be plugged into other software.

> **IMPORTANT** Using the sequencer will set your device up with specifc mappings and stuff, so make sure to back up your beatstep settings in the MIDI Control Center (from Arturia) program, or use `STORE`/`RECALL` buttons on device, or use `save`/`load` in CLI, if you care about them.

## installation

```bash
npm i -g beatstep
```

You can also run it without installing:

```bash
npx beatstep list
```

## usage

### command-line

```bash
beatstep <command>

Commands:
  beatstep load <file>  Load a .beatstep preset file
  beatstep save <file>  Save a .beatstep preset file
  beatstep list         List MIDI devices
  beatstep seq          Start sequencer

Options:
  --help     Show help                                                 [boolean]
  --version  Show version number                                       [boolean]
```

Commands have more options. If you want to know more about it, run `beatstep <command> --help`

### interaction

I am still working on this part. Here is how it currently works:

- run `beatstep seq` to start the sequencer
- Make sure controller is in `CNTRL` mode (red) and turn on `EXT SYNC` (blue)
- Press `SHIFT` to chose pattern
- Press `STOP` to choose track
- `PLAY` will play/stop the current pattern

The notes it sends out are based on [hydrogen](http://hydrogen-music.org/) drumkits, which is a common mapping for drumkit-instruments starting at `C1` with a kick drum. Eventually, I can make this a configurable option (like a CLI flag that you can tell it the notes it can use for each track.)

## as a library

You can also use this as a nice BeatStep interface, in your own code

The class constructor has 2 params, which are the names of input and output device (you can get with `require('easymidi').getInputs()` and `require('easymidi').getOutputs()`.)


```js
import { getOutputs, getInputs } from 'easymidi'
import { BeatStep } from 'beatstep`

const beatstep = new BeatStep(
  getInputs().find(d => d.includes('Arturia BeatStep')),
  getOutputs().find(d => d.includes('Arturia BeatStep'))
)

beatstep.on('noteon', console.log)
beatstep.on('noteoff', console.log)

```

## hardware

Eventually, I'd like to reprogram the chip on the controller to acheive a fully custom standalone sequencer.

It uses a [stm32f103](https://www.st.com/en/microcontrollers-microprocessors/stm32f103.html) chip, with some supporting circuitry to multiplex all the buttons, leds, and knobs. It looks like they are using [hc574](https://www.ti.com/lit/ds/symlink/sn54hc574.pdf?ts=1587965539932) to multiplex rotoary-encoders, somehow. It looks like it has programming pins on board (`JP1`) but firmware updates over sysex would be preferrable. [This](https://medium.com/techmaker/reverse-engineering-stm32-firmware-578d53e79b3) might give me some ideas for reversing the firmware to the point that I can read inputs, output LEDs, and eventually just write my own interface.

Ideally, I could compile my own code, create my own led file (appears to be hex) and send over sysex.


### TODO

* Fill in the docs: api & docs.
* Figure out `RATE` knob for BPM
* Figure out `CHAN` so I can use that to switch tracks and use `SHIFT` to do something else (commands like copy/paste and sequencer controls would be cool)
* Use `STORE`/`RECALL` for something other than intended. Would be good to fire save/load (maybe combined with `SHIFT` and `STOP` for track/pattern/song)
* Figure out easier-to-compile MIDI lib (for cross-platform release building)
* Different seqquencer styles: current (all drums in one instrument on one channel), seperate drum instruments, seperate channels, something for melodies
* Better debug more that prints all midi messages sent and received

## thanks

I couldn't have made this without the awesome hacking in this [blog post](https://www.untergeek.de/2014/11/taming-arturias-beatstep-sysex-codes-for-programming-via-ipad/).
