function addToHtml() {
  alert("Adding HTML");

  var arduinos = ["Arduino Uno", "Arduino Mega"];

  arduinos.forEach(function(arduino) {
    console.log(arduino);

    var html = "<div class='flex-item'>" + arduino + "</div>"

    $('#arduinoList').append(html);

  });
};
