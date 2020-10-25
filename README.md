# WIP

I haven't really worked out the sequencer fully. I think I know how I want it to work, but haven't written the code to make it work that way. I think the lib is still useful as it is, to make things (I have all the known sysesx commands worked out, etc) but it will need some more work to be a functional sequencer.

## BeatStep Interceptor

This is a command-line program to make the Arturia BeatStep work in different ways than the firmware is meant to.

The Arturia BeatStep is a really nice-feeling device, that is pretty cheap (~$100 new.) The built-in firmware for the device is OK, but a bit wonky for sequencing complex drum-patterns. Since I don't have access to the firmware's source, I made this so I'd have a sequencer that works how I want.

It starts a virtual midi device that can be plugged into other software.

> Using the CLI will set your device up with specifc mappings and stuff, so make sure to back up your settings in the desktop program, if you care about them.

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
beatstep list       # list MIDI devices
beatstep seq        # start sequencer on system's most likely midi-device
```

### interaction

My main goal was just to have more simultaneous tracks & more possible sequences.

* `STOP`/`PLAY` start & stop current pattern
* Enter `SEQ` mode (`CTRL`/`SEQ` is blue)
* You can select your current track with `CHAN`, and the current pattern will update.
* Select your current sequence with scale (`SHIFT` + top-row of pads)
* Select your current pattern with `RECALL`
* Save your current pattern with `STORE`
* Knobs just work as regular CC knobs, on the same channel as pads

This means that we have 8x16 patterns (each with 16 tracks), instead of 16 patterns (with 1 track), by sacrificing scale & live channel-setting, without having to sacrafice too much.


## as a library

You can also use this as a nice BeatStep interface, in your own code

The class constructor has 2 params, which are the names of input and output device (you can get with `require('easymidi').getInputs()` and `require('easymidi').getOutputs()`.)

## hardware

Eventually, I'd like to reprogram the chip on the controller to acheive a fully custom sequencer.

It uses a [stm32f103](https://www.st.com/en/microcontrollers-microprocessors/stm32f103.html) chip, with some supporting circuitry to multiplex all the buttons, leds, and knobs. It looks like they are using [hc574](https://www.ti.com/lit/ds/symlink/sn54hc574.pdf?ts=1587965539932) to multiplex rotoary-encoders, somehow. It looks like it has programming pins on board (`JP1`) but firmware updates over sysex would be preferrable. [This](https://medium.com/techmaker/reverse-engineering-stm32-firmware-578d53e79b3) might give me some ideas for reversing the firmware to the point that I can read inputs, output LEDs, and eventually just write my own interface.


### TODO

Fill in the docs: api & docs.

## thanks

I couldn't have made this without the awesome hacking in this [blog post](https://www.untergeek.de/2014/11/taming-arturias-beatstep-sysex-codes-for-programming-via-ipad/).
