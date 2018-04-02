async function getAllArduinoNames() {

  let arduinoPorts = await eel.checkPorts()();
  let arduinos = {};

  console.log(arduinoPorts);

  if(arduinoPorts.length > 0) {
    for(let port of arduinoPorts) {
      let arduino = await eel.typeOfPort(port)();
      arduino = arduino.split(" ");
      arduino.shift();
      arduinos[port] = arduino.join(" ");
    }
    return arduinos;
  }

  alert("No arduinos found.");
  return null;
};

$('#moduleModal .modal-footer button').on('click', function(event) {
  var $button = $(event.target);

  $(this).closest('.modal').one('hidden.bs.modal', function() {
    alert($button[0].id);
  });
});



$(document).ready(function() {
  console.log("Document ready");
  $('#mainModuleButton').click(async function() {
    createMainModule();
  });

  $('#sideModuleButton').click(async function() {
    createSideModule();
  });
});

async function createMainModule() {
  console.log("Creating Main Module!");

  let arduinos = await getAllArduinoNames();

  if(arduinos) {

    var html ='<br>'+
    '         <div id="module">'+
    '          <div class="row" id="moduleTile">'+
    '            <div class="col-12" id="moduleType">'+
    '              <h4 class="text-center">Main Module</h4>'+
    '              <hr>'+
    '            </div>'+
    '          </div>'+
    '          <div class="row">'+
    '            <div class="col-6" id="moduleIRs">'+
    '              <div class="row justify-content-md-center">'+
    '                <div class="col-md-auto">'+
    '                  <h5 class="text-center component-label component-label">IR 1</h5>'+
    '                </div>'+
    '                <div class="col-md-auto">'+
    '                  <select class="custom-select">'+
    '                    <option selected>Arduino</option>'+
    '                    <option value="1">Mega (COM4)</option>'+
    '                    <option value="2">UNO (COM5)</option>'+
    '                  </select>'+
    '                </div>'+
    '                <div class="col-md-auto">'+
    '                  <input class="form-control text-center" type="text" placeholder="Arduino Pin">'+
    '                </div>'+
    '              </div><br>'+
    '              <div class="row justify-content-md-center">'+
    '                <div class="col-md-auto">'+
    '                  <h5 class="text-center component-label">IR 2</h5>'+
    '                </div>'+
    '                <div class="col-md-auto">'+
    '                  <select class="custom-select">'+
    '                    <option selected>Arduino</option>'+
    '                    <option value="1">Mega (COM4)</option>'+
    '                    <option value="2">UNO (COM5)</option>'+
    '                  </select>'+
    '                </div>'+
    '                <div class="col-md-auto">'+
    '                  <input class="form-control text-center" type="text" placeholder="Arduino Pin">'+
    '                </div>'+
    '              </div>'+
    '            </div>'+
    '            <div class="col-6" id="moduleServos">'+
    '              <div class="row justify-content-md-center">'+
    '                <div class="col-md-auto">'+
    '                  <h5 class="text-center component-label">SERVO 1</h5>'+
    '                </div>'+
    '                <div class="col-md-auto">'+
    '                  <select class="custom-select">'+
    '                    <option selected>Arduino</option>'+
    '                    <option value="1">Mega (COM4)</option>'+
    '                    <option value="2">UNO (COM5)</option>'+
    '                  </select>'+
    '                </div>'+
    '                <div class="col-md-auto">'+
    '                  <input class="form-control text-center" type="text" placeholder="Arduino Pin">'+
    '                </div>'+
    '              </div><br>'+
    '              <div class="row justify-content-md-center">'+
    '                <div class="col-md-auto">'+
    '                  <h5 class="text-center component-label">SERVO 2</h5>'+
    '                </div>'+
    '                <div class="col-md-auto">'+
    '                  <select class="custom-select">'+
    '                    <option selected>Arduino</option>'+
    '                    <option value="1">Mega (COM4)</option>'+
    '                    <option value="2">UNO (COM5)</option>'+
    '                  </select>'+
    '                </div>'+
    '                <div class="col-md-auto">'+
    '                  <input class="form-control text-center" type="text" placeholder="Arduino Pin">'+
    '                </div>'+
    '              </div><br>'+
    '              <div class="row justify-content-md-center">'+
    '                <div class="col-md-auto">'+
    '                  <h5 class="text-center component-label">SERVO 3</h5>'+
    '                </div>'+
    '                <div class="col-md-auto">'+
    '                  <select class="custom-select">'+
    '                    <option selected>Arduino</option>'+
    '                    <option value="1">Mega (COM4)</option>'+
    '                    <option value="2">UNO (COM5)</option>'+
    '                  </select>'+
    '                </div>'+
    '                <div class="col-md-auto">'+
    '                  <input class="form-control text-center" type="text" placeholder="Arduino Pin">'+
    '                </div>'+
    '              </div>'+
    '            </div>'+
    '          </div>'+
    '        </div>';

    $('#modules').append(html);
  }
};

async function createSideModule() {
  console.log("Creating Side Module");

  let arduinos = await getAllArduinoNames();

  if(arduinos) {

    var html = '<br>'+
    '         <div id="module">'+
    '          <div class="row" id="moduleTile">'+
    '            <div class="col-12" id="moduleType">'+
    '              <h4 class="text-center">Regular Module</h4>'+
    '              <hr>'+
    '            </div>'+
    '          </div>'+
    '          <div class="row">'+
    '            <div class="col-6" id="moduleIRs">'+
    '              <div class="row justify-content-md-center">'+
    '                <div class="col-md-auto">'+
    '                  <h5 class="text-center component-label">IR 1</h5>'+
    '                </div>'+
    '                <div class="col-md-auto">'+
    '                  <select class="custom-select">'+
    '                    <option selected>Arduino</option>'+
    '                    <option value="1">Mega (COM4)</option>'+
    '                    <option value="2">UNO (COM5)</option>'+
    '                  </select>'+
    '                </div>'+
    '                <div class="col-md-auto">'+
    '                  <input class="form-control text-center" type="text" placeholder="Arduino Pin">'+
    '                </div>'+
    '              </div><br>'+
    '              <div class="row justify-content-md-center">'+
    '                <div class="col-md-auto">'+
    '                  <h5 class="text-center component-label">IR 2</h5>'+
    '                </div>'+
    '                <div class="col-md-auto">'+
    '                  <select class="custom-select">'+
    '                    <option selected>Arduino</option>'+
    '                    <option value="1">Mega (COM4)</option>'+
    '                    <option value="2">UNO (COM5)</option>'+
    '                  </select>'+
    '                </div>'+
    '                <div class="col-md-auto">'+
    '                  <input class="form-control text-center" type="text" placeholder="Arduino Pin">'+
    '                </div>'+
    '              </div>'+
    '            </div>'+
    '            <div class="col-6" id="moduleServos">'+
    '              <div class="row justify-content-md-center">'+
    '                <div class="col-md-auto">'+
    '                  <h5 class="text-center component-label">SERVO 1</h5>'+
    '                </div>'+
    '                <div class="col-md-auto">'+
    '                  <select class="custom-select">'+
    '                    <option selected>Arduino</option>'+
    '                    <option value="1">Mega (COM4)</option>'+
    '                    <option value="2">UNO (COM5)</option>'+
    '                  </select>'+
    '                </div>'+
    '                <div class="col-md-auto">'+
    '                  <input class="form-control text-center" type="text" placeholder="Arduino Pin">'+
    '                </div>'+
    '              </div><br>'+
    '              <div class="row justify-content-md-center">'+
    '                <div class="col-md-auto">'+
    '                  <h5 class="text-center component-label">SERVO 2</h5>'+
    '                </div>'+
    '                <div class="col-md-auto">'+
    '                  <select class="custom-select">'+
    '                    <option selected>Arduino</option>'+
    '                    <option value="1">Mega (COM4)</option>'+
    '                    <option value="2">UNO (COM5)</option>'+
    '                  </select>'+
    '                </div>'+
    '                <div class="col-md-auto">'+
    '                  <input class="form-control text-center" type="text" placeholder="Arduino Pin">'+
    '                </div>'+
    '              </div>'+
    '            </div>'+
    '          </div>'+
    '        </div>';

    $('#modules').append(html);
  }
}
