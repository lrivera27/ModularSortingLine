let arduinos = [];

async function addToHtml() {

  arduinos = await eel.checkPorts()();

  if (arduinos.length != 0) {
    for(let arduino of arduinos) {
      let arduinoName = await eel.typeOfPort(arduino)();
      console.log(arduinoName);
      var html = "<div class='flex-item'>" + arduinoName + "</div>";
      $('#arduinoList').append(html);
    }
  }
};
