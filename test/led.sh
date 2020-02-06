#/usr/bin/bash

# this works on linux to test setting LEDs using sysex

DEVICE='hw:1'

echo "lights on"
amidi -p $DEVICE -S 'F0 00 20 6B 7F 42 02 00 10 78 01 F7' # pad 9 red
amidi -p $DEVICE -S 'F0 00 20 6B 7F 42 02 00 10 79 11 F7' # pad 10 pink
amidi -p $DEVICE -S 'F0 00 20 6B 7F 42 02 00 10 7A 10 F7' # pad 11 blue

sleep 2

echo "lights off"
amidi -p $DEVICE -S 'F0 00 20 6B 7F 42 02 00 10 78 00 F7' # pad 9 off
amidi -p $DEVICE -S 'F0 00 20 6B 7F 42 02 00 10 79 00 F7' # pad 10 off
amidi -p $DEVICE -S 'F0 00 20 6B 7F 42 02 00 10 7A 00 F7' # pad 11 off