# WebGUI

Due to raspberry pi camera module limitation it is required for it to run **Raspberry Pi OS (64-bit)**.


Installing necessary modules:
`sudo ./install.sh`

Installing openmct:
`sudo ./install-web.sh`

If script cannot run check for `x` permission.

To add it run:
`sudo chmod +x *.sh`


To start camera stream:
`./start-camera.sh`

To start web-gui:

`./start-web.sh`


**THIS NEEDS TO BE RAN IN SEPARATE TERMINAL**
**DO NOT CLOSE ANY OF THE TERMINALS IN ORDER FOR IT TO WORK**

If Web-gui is empty import it from `layout.json`. You can refer to openmct documentation fort it.

In order to set-up camera feed. Edit the openmct biggest frame (it would possibly show a connection error). And change the URL to `http://<raspberry pi IP>:8000`.
