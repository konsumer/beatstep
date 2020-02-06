# BeatStep Interceptor

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

```
rate   : the bpm
knob-1 : current channel
knob-2 : channel's note

knob-14: current song
knob-15: current sequence
knob-16: current pattern
```

A song (1-16) is made of sequences (1-16) and a sequence (1-16) is made of patterns (1-16.) Each pattern has channels (1-16) that play at the same time.

For a beat like this:

```
        0123456789ABCDEF
HiHat  |X X X X X X X X | B4
Snare  |    X       X   | C#4
Kick   |X   X   X   X   | C4
```

To set it up:

* turn knob-14 (to set song to 1st one)
* turn knob-15 (to set sequence to 1st one)
* turn knob-16 (to set pattern to 1st one)

make kick drum pattern:

* turn knob-1 (to set channel to 1st one.)
* turn knob-2 (to set the note to C4)
* bang out the Kick pattern

make snare pattern:

* turn knob-1 (to set channel to 2nd one.)
* turn knob-2 (to set the note to C#4)
* bang out the Snare pattern

make hihat pattern:

* turn knob-1 (to set channel to 3rd one.)
* turn knob-2 (to set the note to B4)
* bang out the Hihat pattern

After that, change songs (knob-14), patterns (knob-16), and sequences (knob-15), and you can use STOP/PLAY.

It's designed so you can use the last knob to swap out patterns and the 1st knob to set the channel for quick creation of patterns, once you have it all setup.

Your note/channel mappings & patterns are saved in `~/.beatstep.json`, so you can edit the file directly, or delete it to start over.


## as a library

You can also use this as a nice BeatStep interface, in your own code

The class constructor has 2 params, which are the names of input and output device (you can get with `require('easymidi').getInputs()` and `require('easymidi').getOutputs()`.)


### TODO

Fill in the docs: api & docs.

## thanks

I couldn't have made this without the awesome hacking in this [blog post](https://www.untergeek.de/2014/11/taming-arturias-beatstep-sysex-codes-for-programming-via-ipad/).