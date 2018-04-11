import serial.tools.list_ports
import serial
import time


class ArduinoCommunicator:
    s = None
    port = None
    baudrate = None
    arduinoType = None

    def __init__(self, port, baudrate):
        self.port = port
        self.baudrate = baudrate
        self.s = serial.Serial(port, baudrate, timeout=0.01)
        time.sleep(2)

    @staticmethod
    def findArduinoComms():
        ports = list(serial.tools.list_ports.comports())
        portNames = []
        for port in ports:
            if "Arduino" in port[1]:
                print(port[1])
                portNames.append(port[0])

        return portNames

    def write(self, command):
        self.s.write(command.encode('ascii'))
        inputArduino = self.s.read()

        data_left = self.s.inWaiting()

        inputArduino += self.s.read(data_left)

        return inputArduino

def mainModule():

    arr1 = ArduinoCommunicator("COM6", 115200)

    message = ""

    while(True):

        message = str(arr1.write("R07\n"))

        if "OBSTACLE" in message:
            arr1.write("D131\n")

        else:
            arr1.write("D130\n")


command = ["SQUARE", "CILINDER", "SQUARE", "CILINDER", "SQUARE", "CILINDER", "SQUARE", "CILINDER", "SQUARE", "CILINDER", "SQUARE", "CILINDER"]


def mainModule():
    arr1 = ArduinoCommunicator("COM6", 115200)
    arr2 = ArduinoCommunicator("COM4", 115200)

    message = ""

    while True:

        message = str(arr1.write("R07\n"))

        if "OBSTACLE" in message:

            if(len(command)):

                if command[0] == "SQUARE":
                    command.pop(0)
                    arr1.write("D131\n")
                    arr2.write("D130\n")

                elif command[0] == "CILINDER":
                    command.pop(0)
                    arr2.write("D131\n")
                    arr1.write("D130\n")

                time.sleep(1)

mainModule()
