# BeatStep Interceptor

This is a command-line program to make the Arturia BeatStep work in different ways than the firmware is meant to.

It starts a virtual midi device that can be plugged into other software.

## installation

```
npm i -g beatstep
```

You can also run it without installing:

```
npx beatstep list
```

## usage

```
beatstep list     # list MIDI devices
beatstep seq -i 1 # start sequencer on device-1
```

## as a library

You can also use this as a nice BeatStep interface library, too.

```
import BeatStep from 'beatstep'

const beatstep = new BeatStep('Arturia BeatStep:Arturia BeatStep MIDI 1 20:0', 'Virtual BeatStep')
```

The class uses getters & setters to communicate with the controller, so you can very simply tell it to do things:

```
beatstep.PAD1.color = 'red'
console.log(beatstep.PAD1.color)
```

### TODO

Need full docs here. global & controller getter/setters.

## thanks

I couldn't have made this without the awesome hacking in this [blog post](https://www.untergeek.de/2014/11/taming-arturias-beatstep-sysex-codes-for-programming-via-ipad/).