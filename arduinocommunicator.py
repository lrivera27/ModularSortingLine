import serial.tools.list_ports
import serial
import time


class ArduinoCommunicator:
    s = None
    port = None
    baudrate = None
    def __init__(self, port, baudrate):
        self.port = port
        self.baudrate = baudrate
        self.s = serial.Serial(port, baudrate, timeout=1)
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
        # inputArduino = self.s.read()
        # time.sleep(1)
        # data_left = s.inWaiting()
        #
        # inputArduino += s.read(data_left)
        #
        # print(inputArduino)


# ports = ArduinoCommunicator.findArduinoComms()
#
# arr1 = ArduinoCommunicator(ports[0], 115200)
# arr2 = ArduinoCommunicator(ports[1], 115200)
