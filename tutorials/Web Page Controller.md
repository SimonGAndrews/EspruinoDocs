<!--- Copyright (c) 2024 Simon G Andrews. See the file LICENSE for copying permission. -->
Espruino Web Control and Monitoring Application
=======================

* KEYWORDS: wifi,http,access point,webpage,HTML,ESP32,EspruinoWIFI
* USES: Controlling outputs and monitoring inputs via a webpage

Introduction
-----------
This application starts a wifi access point and hosts a web interface to control and monitor GPIO pins
on an EspruinoWifi/ESP32 microcontroller running Espruino. It allows clients (browsers) to interact
with the device in real-time by toggling outputs (e.g., relays, LEDs) and 
displaying input values (e.g., sensors, analog/digital states, or custom variables).
The code was produced with the assistance of the ChatGBT AI interface. (OpenAI.com)

Software
--------
```
/*
 * Espruino Web Control and Monitoring Application
 * ============================================
 * This application starts a wifi access point and hosts a web interface to control and monitor GPIO pins
 * on an EspruinoWifi/ESP32 microcontroller running Espruino. It allows clients (browsers) to interact
 * with the device in real-time by toggling outputs (e.g., relays, LEDs) and 
 * displaying input values (e.g., sensors, analog/digital states, or custom variables).
 * The code was produced with the assistance of the ChatGBT AI interface. (OpenAI.com)
 * 
 * Main Functional Points:
 * - Dynamically generates an HTML interface with buttons for controlling outputs and 
 *   text boxes for displaying inputs.
 * - Handles GPIO output toggling (on/off states) via buttons.
 * - Displays GPIO input states or integer values in text boxes.
 * - Periodically refreshes input/output states using client-side JavaScript.
 * - Provides warning indicators when input values exceed configured thresholds.
 * - Allows easy expansion by configuring input/output arrays (pins, labels, thresholds, etc.).
 * - JSON API for real-time status updates without triggering unwanted state changes.
 * 
 * Configuration:
 * - 'outputPins': Array of output GPIO pins to be controlled.
 * - 'outputLabels': Descriptive labels for each output.
 * - 'inputPins': Array of input GPIO pins or variables to monitor.
 * - 'inputLabels': Descriptive labels for each input.
 * - 'inputTypes': Array indicating whether inputs are GPIO pins (true) or custom variables (false).
 * - 'inputMinThresholds', 'inputMaxThresholds': Configurable thresholds for warnings.
 * - 'inputUpdateFunctions': Functions that define how each input value is updated.
 * 
 * Notes:
 * - The refresh interval (currently set to 60 seconds) is important for performance on
 *   microcontrollers with limited processing power.
 * - Multiple browsers can connect and view/control the same outputs and inputs.
 */

var wifi = require("Wifi");
var http = require("http");

// Access point configuration 
var apSSID = 'EspruinoAP';  //Access point name / password hardcoded below
var apIP = "192.168.4.1";   //future use. This is the default IP for Espressif Access Point
var apPort = 80;

// Array of output pins corresponding to each button
var outputPins = [LED1, LED2, A12, A13]; // Example GPIO output pins
var outputStates = [0, 0, 0, 0];   // Initial states for each output pin (0 = off, 1 = on)

// Array of input pins or values for monitoring
var inputPins = [A5, A6, "intVar1", "intVar2"];  // Some are GPIO pins, others are integer values
var inputTypes = [true, true, false, false];  // Pin (true) vs int type (false)
var inputValues = [0, 0, 50, 250];  // Initial values for inputs

// Labels for outputs and inputs
var outputLabels = ["Output 1: Room Light", "Output 2: Fan", "Output 3: Heater", "Output 4: Door Lock"];
var inputLabels = ["Input 1: Door Sensor", "Input 2: Window Sensor", "Input 3: Temperature", "Input 4: Humidity"];

// Thresholds for input warnings
var inputMinThresholds = [null, null, 40, 200];  // Min values
var inputMaxThresholds = [null, null, 60, 300];  // Max values

// Functions to update inputs (incrementing for testing purposes)
var inputUpdateFunctions = [
  function() { return ++inputValues[0]; },   // Incrementing value for Temperature
  function() { return ++inputValues[1]; },   // Incrementing value for Humidity
  function() { return ++inputValues[2]; },   // Incrementing value for Temperature
  function() { return ++inputValues[3]; }    // Incrementing value for Humidity
];

// Function to check for warnings in input values
function checkForWarnings(index) {
  if (!inputTypes[index]) {
    var minValue = inputMinThresholds[index];
    var maxValue = inputMaxThresholds[index];
    var value = inputValues[index];
    if (minValue !== null && value < minValue) return "Warning: Below Min";
    if (maxValue !== null && value > maxValue) return "Warning: Above Max";
  }
  return null;
}

// JSON API for current states
function handleApiRequest(res) {
  try {
    // Update input values
    inputValues = inputUpdateFunctions.map(fn => fn());

    // Log the current input and output states
    console.log("handleApiRequest -> Output states:", outputStates);
    console.log("handleApiRequest -> Input values:", inputValues);

    // Respond with JSON containing current states
    var response = JSON.stringify({
      outputs: outputStates,
      inputs: inputValues.map((val, i) => ({
        value: val,
        warning: checkForWarnings(i)
      }))
    });
    console.log("handleApiRequest -> response:",response);
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(response);
  } catch (err) {
      console.error("Error in handleApiRequest:", err);
      res.writeHead(500);
      res.end();
  }
}

// Toggle output state
function handleToggleRequest(req, res) {
  var query = url.parse(req.url, true).query;
  var index = parseInt(query.btn);
  if (!isNaN(index) && index >= 0 && index < outputPins.length) {
    outputStates[index] = outputStates[index] === 1 ? 0 : 1;
    digitalWrite(outputPins[index], outputStates[index]);
    console.log("Toggled output:", index, "to", outputStates[index]);
  }
  res.writeHead(200);
  res.end();
}

// Serve the HTML page
function handlePageRequest(res) {
  let outputButtons = '';
  let inputBoxes = '';

  // Generate output buttons dynamically
  outputPins.forEach((pin, i) => {
    outputButtons += `
      <div class="label-container">
        <label>${outputLabels[i].padEnd(24, ' ')}</label>
        <button id="output${i}" onclick="toggleOutput(${i})">Loading...</button>
      </div><br/>
    `;
  });

  // Generate input textboxes dynamically
  inputPins.forEach((pin, i) => {
    inputBoxes += `
      <div class="label-container">
        <label>${inputLabels[i].padEnd(24, ' ')}</label>
        <input id="input${i}" class="input-box" readonly value="Loading...">
      </div><br/>
    `;
  });

  res.writeHead(200, { "Content-Type": "text/html" });
  res.end(`
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body {font-family: Arial;}
          .label-container {display: flex; align-items: center; margin-bottom: 10px;}
          label {display: inline-block; width: 250px; text-align: left; font-size: 20px;}
          button, input {width: 150px; height: 56px; color: black; border-radius:8px; font-size: 18px; font-weight: bold;}
          .input-box {background-color: lightblue;}
          .warning {background-color: yellow;}
        </style>
        <script>
          // Function to toggle output state
          function toggleOutput(index) {
            fetch("/toggle?btn=" + index).then(refreshPage);
          }

          // Function to refresh page state
          function refreshPage() {
            fetch("/state")
              .then((res) => res.json())
              .then((data) => {
                data.outputs.forEach((state, i) => {
                  var btn = document.getElementById("output" + i);
                  if (btn) {
                    // Check if the button exists
                    btn.style.backgroundColor = state ? "green" : "red";
                    btn.textContent = state ? "Turn Off" : "Turn On";
                  }
                });

                data.inputs.forEach((input, i) => {
                  var inputBox = document.getElementById("input" + i);
                  if (inputBox) {
                    // Check if the input box exists
                    inputBox.value = input.value;
                    inputBox.className = input.warning
                      ? "input-box warning"
                      : "input-box";
                  }
                });
              })
              .catch((error) => {
                console.error("Error fetching state:", error);
              });
          }
          // Automatically refresh the page state every 60 seconds
          setInterval(refreshPage, 60000);
          window.onload = refreshPage;
        </script>
      </head>
      <body>
        <h2>Output Control:</h2>
        ${outputButtons}
        <h2>Input Status: <button onclick="refreshPage()">Refresh</button></h2>
        <br />
        ${inputBoxes}
      </body>
    </html>
  `);
}

wifi.startAP('EspruinoAP', { password: '12345678', authMode: 'wpa2' }, function(err) {
  if (err) throw "During wifi.startup " + err;
  http.createServer(function(req, res) {
      var parsedUrl = url.parse(req.url, true);
        console.log(parsedUrl);

      if (parsedUrl.pathname === "/toggle") {
        handleToggleRequest(req, res);
      } else if (parsedUrl.pathname === "/state") {
        handleApiRequest(res);
      } else {
        handlePageRequest(res);
      }
    }).listen(80);
  console.log('HTTP server listening in Access Point "' +apSSID+ '" on ' +apIP+ '(' + apPort + ')');
});
````
