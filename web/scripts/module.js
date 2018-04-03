var elem = document.querySelector('select');
var instance = M.FormSelect.init(elem, options);

async function getAllArduinoNames() {

  let arduinoPorts = await eel.checkPorts()();
  let arduinos = {};

  console.log(arduinoPorts);

  if(arduinoPorts.length > 0) {
    for(let port of arduinoPorts) {
      arduinos.port = await eel.typeOfPort(port)();
    }
  }

  return arduinos;
};

async function createModule() {
  console.log("Creating Module!");
};
