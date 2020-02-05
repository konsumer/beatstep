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
beatstep list       # list MIDI devices
beatstep seq -i 1   # start sequencer on device-1
```

## as a library

You can also use this as a nice BeatStep interface library, too.

```js
import BeatStep from 'beatstep'
import easymidi from 'easymidi'

const device = easymidi.getInputs().find(d => d.includes('Arturia BeatStep'))

const beatstep = new BeatStep(device)
```

The first param is the name of input-device, as it appears in `require('easymidi').getInputs()`.

The class uses getters & setters to communicate with the controller, so you can very simply tell it to do things, and get values, as if they're just variables. All the getters return Promises:

```js
async function test () {
  // set a value
  beatstep.PAD1.color = 'red'

  // get a value
  console.log(await beatstep.PAD1.color)
}

test()
```

### global

These are params that chnage how the controller works, on a global-scale.


#### `channel`

#### `transpose`

#### `scale`

#### `mode`

#### `step`

#### `patternLength`

#### `swing`

#### `gate`

#### `lagato`

#### `cvChannel`

#### `paddVelocityCurve`

#### `knobAcceleration`


### controllers

These apply to individuals controls. The available controls are these:

These are the the encoders or knobs:
```
ENC1
ENC2
ENC3
ENC4
ENC5
ENC6
ENC7
ENC8
ENC9
ENC10
ENC11
ENC12
ENC13
ENC14
ENC15
ENC16
```

These are the pads:
```
PAD1
PAD2
PAD3
PAD4
PAD5
PAD6
PAD7
PAD8
PAD9
PAD10
PAD11
PAD12
PAD13
PAD14
PAD15
PAD16
```

These are the other controls, on the left of device:
```
VOLUME
STOP
PLAY
```

### TODO

Fill in the docs.

## thanks

I couldn't have made this without the awesome hacking in this [blog post](https://www.untergeek.de/2014/11/taming-arturias-beatstep-sysex-codes-for-programming-via-ipad/).