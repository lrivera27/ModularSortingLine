import eel
import arduinocommunicator as AC
import serial.tools.list_ports

ports = []
arduinos = []

@eel.expose
def loadArduinos():
    global ports
    global arduinos

    ports = checkPorts()
    for port in ports:
        arduinos.append(AC.ArduinoCommunicator(port, 115200))

@eel.expose
def sendCommand(port, command):
    global arduinos
    global ports

    ports = AC.ArduinoCommunicator.findArduinoComms()

    if(port in ports):
        for arduino in arduinos:
            if arduino.port == port:
                arduino.write(command)
                return 1
    return -1

@eel.expose
def checkPorts():
    global ports
    ports = AC.ArduinoCommunicator.findArduinoComms()

    if len(ports) == 0:
        return -1

    return ports

@eel.expose
def typeOfPort(port):
    print("Type of port: ", port)
    n = serial.tools.list_ports.grep(port)

    for _, description, _ in n:
        return description

    return -1

def main():
    print("Loading Arduinos....")
    loadArduinos()
    print("Finished loading arduinos....")

    eel.init("web")
    print("Starting up GUI....")
    eel.start("index.html", size=(1280, 720))


if __name__ == "__main__":
    main()
