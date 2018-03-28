/*
  Name:		ArduinoPython.ino
  Created:	3/24/2018 7:41:00 PM
  Author:	Luis E. Rivera Figueroa

  Changes:
*/

#include <Servo.h>

Servo servo;

bool connectionStablished = false;

// Command Protocol message
String message = "";

// Mode for the arduino (Digital or Analog)
int mode;

// Pin of the component (Led)
int pin;

// Value of the pin for the component
int pinValue;


// the setup function runs once when you press reset or power the board
void setup() {

  // Setting up the bits per second
  Serial.begin(115200);
}

// the loop function runs over and over again until power down or reset
void loop() {

  //Check if there's a connection
  if (Serial.available() > 0) {
    message = Serial.readStringUntil('\n');

    decodeMessage();

    if (mode == 1) {
      Serial.println("TURNING ON LED");
      pinMode(pin, OUTPUT);
      digitalWrite(pin, pinValue);
    }

    else {
      servo.attach(pin);
      servo.write(pinValue);
    }
  }
}

/*
   Splits or decode the message into it's components:
               - Mode : Digital, Analog or Connect mode.
               - Pin  : Pin of the commponent.
 			         - Value: High or Low.
*/

void decodeMessage() {

  Serial.print("Mode: ");
  if (message.substring(0, 1) == "D") {

    // Mode
    mode = 1;
    Serial.println("DIGITAL");
  } else if (message.substring(0, 1) == "C") {

    // Mode
    connectionStablished = true;
    mode = 2;
    Serial.println("CONNECTED");

    return;
  } else {

    // Mode
    mode = 0;
    Serial.println("ANALOG");
  }

  // Pin
  pin = (message.substring(1, 3)).toInt();
  Serial.print("Pin: ");
  Serial.println(pin);

  // Value
  pinValue = (message.substring(3)).toInt();
  Serial.print("Value: ");
  Serial.println(pinValue);
}


