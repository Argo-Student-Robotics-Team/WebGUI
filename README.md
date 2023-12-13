# WebGUI for Rover Operations

![Static Badge](https://img.shields.io/badge/Software_Version-0.1.0-blue)
![Static Badge](https://img.shields.io/badge/Lincense-MIT-blue)
![Static Badge](https://img.shields.io/badge/ROS2-Humble_Hawksbill-blue)
![Static Badge](https://img.shields.io/badge/Project-Bober-blue)

## Installation guide

**Prerequisites:**
- Raspberry Pi 4+ (4GB+ RAM)
- Raspberry Pi OS (64-Bit)

**1. Install necessary modules:**
```bash
sudo ./install.sh
```

**2. Install OpenMCT:**
```bash
sudo ./install-web.sh
```

**3. Import Web GUI layout:**

If the Web GUI appears empty, import the layout from layout.json. Refer to the OpenMCT documentation for guidance.

**4. Configure camera feed:**

Edit the OpenMCT biggest frame (may display a connection error) and change the URL to http://<raspberry pi IP>:8000.

## Usage guide

**1. Start camera stream:**
```bash
./start-camera.sh
```

**2. Start Web GUI:**
```bash
./start-web.sh
```

_Ensure that this is run in a separate terminal. Do not close any terminals for the system to function properly._
