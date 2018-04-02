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


$('#modulePlus').click(function() {
  createModule();
});

$('#moduleModal .modal-footer button').on('click', function(event) {
  var $button = $(event.target);

  $(this).closest('.modal').one('hidden.bs.modal', function() {
    alert($button[0].id);
  });
});

$('#moduleModal').on('click', '#sideModuleButton', function() {
  alert("Side Module selected!");
  $('moduleModal').modal('hide');
});
