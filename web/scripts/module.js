var mainModuleCounter = 0;
var sideModuleCounter = 0;

// var mainModule = class {
//   constructor(FirstIR, SecondIR) {
//     this.FirstIR = FirstIR;
//     this.SecondIR = SecondIR;
//   }
// };

async function getAllArduinoNames() {
  console.log("Loading Arduino names....");

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



$(document).ready(function() {
  console.log("Document ready");
  $('#mainModuleButton').click(async function() {
    createMainModule();
  });

  $('#sideModuleButton').click(async function() {
    createSideModule();
  });

  $('#moduleSave').click(function () {
    saveModule();
  });
});


function saveModule() {
  var mainModulesAmount = $("div.mainModule").length;
  var sideModulesAmount = $("div.sideModule").length;
  var moduleCount = 0;

  //If mainModulesExists
  if(mainModulesAmount > 0){
    //While I have not iterated over all existing main modules
    while(mainModulesAmount != 0){
      //if a module with this class exists
      if($("div.mainModule"+moduleCount).length != 0){
        //alert("MainModule #"+moduleCount+" Exists");


        mainModulesAmount--;
      }
      moduleCount++;
    }
  }
}

function closeModule(clicked_id) {
  if(confirm("Are you sure you want to remove "+clicked_id+"?")){
    $( "."+ clicked_id).remove();
  }
};


async function createMainModule() {
  console.log("Creating Main Module....");

  let arduinos = await getAllArduinoNames();
  let selectMenu = "";

  $.each(arduinos, function(key, value) {

    selectMenu += '<option value="' + key + '">' + value + '</option>';
  });

  if(arduinos) {
    mainModuleCounter += 1;
    var html ='<br class="mainModule'+ mainModuleCounter +'">'+
    '         <div class="mainModule module mainModule'+ mainModuleCounter +'">'+
    '          <div class="row">'+
    '            <div class="col-12 text-right">'+
    '              <button type="button" class="close" onClick="closeModule(this.id)" id="mainModule'+ mainModuleCounter+'">'+
    '                 <span aria-hidden="true">X</span>'+
    '              </button>'+
    '            </div>'+
    '          </div>'+
    '          <div class="row" id="moduleTile">'+
    '            <div class="col-12" id="moduleType">'+
    '              <h4 class="text-center">Main Module ' + mainModuleCounter + '</h4>'+
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
    '                    <option selected>Arduino</option>'+ selectMenu +
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
    '                    <option selected>Arduino</option>'+ selectMenu +
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
    '                    <option selected>Arduino</option>'+ selectMenu +
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
    '                    <option selected>Arduino</option>'+ selectMenu +
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
    '                    <option selected>Arduino</option>'+ selectMenu +
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
  let selectMenu = "";
  if(arduinos) {

    sideModuleCounter += 1;

    $.each(arduinos, function(key, value) {

      selectMenu += '<option value="' + key + '">' + value + '</option>';
    });

    var html = '<br class="sideModule'+ sideModuleCounter +'">'+
    '         <div class="sideModule module sideModule'+ sideModuleCounter +'">'+
    '          <div class="row">'+
    '            <div class="col-12 text-right">'+
    '              <button type="button" class="close" onClick="closeModule(this.id)" id="sideModule'+ sideModuleCounter+'">'+
    '                 <span aria-hidden="true">X</span>'+
    '              </button>'+
    '            </div>'+
    '          </div>'+
    '          <div class="row" id="moduleTile">'+
    '            <div class="col-12" id="moduleType">'+
    '              <h4 class="text-center">Side Module ' + sideModuleCounter + '</h4>'+
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
    '                    <option selected>Arduino</option>'+ selectMenu +
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
    '                    <option selected>Arduino</option>'+ selectMenu +
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
    '                    <option selected>Arduino</option>'+ selectMenu +
    '                  </select>'+
    '                </div>'+
    '                <div class="col-md-auto">'+
    '                  <input class="form-control text-center" type="text" placeholder="Arduino Pin">'+
    '                </div>'+
    '              </div><br>'+
    '            </div>'+
    '          </div>'+
    '        </div>';

    $('#modules').append(html);
  }
}
