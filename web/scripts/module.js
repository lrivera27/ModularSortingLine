
var mainModuleCounter = 0;
var sideModuleCounter = 0;

//Component Object
function Component(ComName, Com, Pin) {
    this.ComName = ComName;
    this.Com = Com;
    this.Pin = Pin;
};
//Main Module Object
function MainModule(moduleNum, IR1, IR2, S1, S2, S3) {
    this.Type = "MainModule";
    this.Number = moduleNum;
    this.IR1 = new Component(IR1.ComName, IR1.Com, IR1.Pin);
    this.IR2 = new Component(IR2.ComName, IR2.Com, IR2.Pin);
    this.S1 = new Component(S1.ComName, S1.Com, S1.Pin);
    this.S2 = new Component(S2.ComName, S2.Com, S2.Pin);
    this.S3 = new Component(S3.ComName, S3.Com, S3.Pin);
};
// SideModule Object
function SideModule(moduleNum, IR1, IR2, S1) {
    this.Type = "SideModule";
    this.Number = moduleNum;
    this.IR1 = new Component(IR1.ComName, IR1.Com, IR1.Pin);
    this.IR2 = new Component(IR2.ComName, IR2.Com, IR2.Pin);
    this.S1 = new Component(S1.ComName, S1.Com, S1.Pin);
};


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

  $('#saveModuleBtn').click(function () {
    saveModuleSettings();
  });

  $('#openModuleBtn').click(function (e) {
    readSingleFile(e);
  });

  document.getElementById('file-input')
    .addEventListener('change', readSingleFile, false);
});

function readSingleFile(e) {
  var file = e.target.files[0];
  if (!file) {
    return;
  }
  var reader = new FileReader();
  reader.onload = function(e) {
    var contents = e.target.result;
    manageContent(contents);
  };
  reader.readAsText(file);
}

function manageContent(contents) {
  var element = document.getElementById('file-content');
  element.textContent = contents;
  var modules = JSON.parse(contents);
  setOpenModules(modules);
}

function saveModuleSettings() {
  var mainModulesAmount = $("div.mainModule").length;
  var sideModulesAmount = $("div.sideModule").length;
  var moduleCount = 0;
  var existingModules = [];
  var mainModulesJSONString = "";
  //If mainModulesExists
  if(mainModulesAmount > 0){
    //While I have not iterated over all existing main modules
    while(mainModulesAmount != 0){
      //if a module with this class exists
      if($("div.mainModule"+moduleCount).length != 0){
        //alert("MainModule #"+moduleCount+" Exists");

        //Get IR1 Information
        var comIR1Name = $("div.mainModule"+moduleCount).find(".IR1ino option:selected").attr("data-ino");
        var comIR1 = $("div.mainModule"+moduleCount).find(".IR1ino option:selected").val();
        var pinIR1 = $("div.mainModule"+moduleCount).find(".IR1PIN").val();
        //Get IR2 Information
        var comIR2Name = $("div.mainModule"+moduleCount).find(".IR2ino option:selected").attr("data-ino");
        var comIR2 = $("div.mainModule"+moduleCount).find(".IR2ino option:selected").val();
        var pinIR2 = $("div.mainModule"+moduleCount).find(".IR2PIN").val();
        //Get Servo1 Information
        var comS1Name = $("div.mainModule"+moduleCount).find(".Servo1Com option:selected").attr("data-ino");
        var comS1 = $("div.mainModule"+moduleCount).find(".Servo1Com option:selected").val();
        var pinS1 = $("div.mainModule"+moduleCount).find(".Servo1Pin").val();
        //Get Servo2 Information
        var comS2Name = $("div.mainModule"+moduleCount).find(".Servo2Com option:selected").attr("data-ino");
        var comS2 = $("div.mainModule"+moduleCount).find(".Servo2Com option:selected").val();
        var pinS2 = $("div.mainModule"+moduleCount).find(".Servo2Pin").val();
        //Get Servo3 Information
        var comS3Name = $("div.mainModule"+moduleCount).find(".Servo3Com option:selected").attr("data-ino");
        var comS3 = $("div.mainModule"+moduleCount).find(".Servo3Com option:selected").val();
        var pinS3 = $("div.mainModule"+moduleCount).find(".Servo3Pin").val();
        //IR Components
        var IR1Component = new Component(comIR1Name, comIR1,pinIR1);
        var IR2Component = new Component(comIR2Name, comIR2,pinIR2);
        //Servo Components
        var Servo1Component = new Component(comS1Name, comS1,pinS1);
        var Servo2Component = new Component(comS2Name, comS2, pinS2);
        var Servo3Component = new Component(comS3Name, comS3, pinS3);
        //Main Module
        var thisMainModule = new MainModule(moduleCount,IR1Component,IR2Component,Servo1Component,Servo2Component,Servo3Component);
        existingModules.push(thisMainModule);
        mainModulesAmount--;
      }
      moduleCount++;
    }
  }
  //ModuleCount reset
  moduleCount = 0;
  //If sideModulesExists
  if(sideModulesAmount > 0){
    //While I have not iterated over all existing main modules
    while(sideModulesAmount != 0){
      //if a module with this class exists
      if($("div.sideModule"+moduleCount).length != 0){
        //alert("MainModule #"+moduleCount+" Exists");
        //Get IR1 Information
        var comIR1Name = $("div.sideModule"+moduleCount).find(".IR1ino option:selected").attr("data-ino");
        var comIR1 = $("div.sideModule"+moduleCount).find(".IR1ino option:selected").val();
        var pinIR1 = $("div.sideModule"+moduleCount).find(".IR1PIN").val();
        //Get IR2 Information
        var comIR2Name = $("div.sideModule"+moduleCount).find(".IR2ino option:selected").attr("data-ino");
        var comIR2 = $("div.sideModule"+moduleCount).find(".IR2ino option:selected").val();
        var pinIR2 = $("div.sideModule"+moduleCount).find(".IR2PIN").val();
        //Get Servo1 Information
        var comS1Name = $("div.sideModule"+moduleCount).find(".Servo1Com option:selected").attr("data-ino");
        var comS1 = $("div.sideModule"+moduleCount).find(".Servo1Com option:selected").val();
        var pinS1 = $("div.sideModule"+moduleCount).find(".Servo1Pin").val();
        //IR Components
        var IR1Component = new Component(comIR1Name, comIR1, pinIR1);
        var IR2Component = new Component(comIR2Name, comIR2, pinIR2);
        //Servo Components
        var Servo1Component = new Component(comS1Name, comS1, pinS1);
        //Side Module
        var thisSideModule = new SideModule(moduleCount,IR1Component,IR2Component,Servo1Component);
        existingModules.push(thisSideModule);
        sideModulesAmount--;
      }
      moduleCount++;
    }
  }

  existingModulesJSONString = JSON.stringify(existingModules);
  window.open("data:application/text," + encodeURIComponent(existingModulesJSONString), "_self");
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
    selectMenu += '<option data-ino="' + value + '" value="' + key + '">' + value + '</option>';
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
    '                  <h6 class="text-center component-label component-label">IR 1</h6>'+
    '                </div>'+
    '                <div class="col-md-auto">'+
    '                  <select class="custom-select IR1ino">'+
    '                    <option selected>Arduino</option>'+ selectMenu +
    '                  </select>'+
    '                </div>'+
    '                <div class="col-md-auto">'+
    '                  <input class="form-control text-center IR1PIN" type="text" placeholder="Arduino Pin">'+
    '                </div>'+
    '              </div><br>'+
    '              <div class="row justify-content-md-center">'+
    '                <div class="col-md-auto">'+
    '                  <h6 class="text-center component-label">IR 2</h6>'+
    '                </div>'+
    '                <div class="col-md-auto">'+
    '                  <select class="custom-select IR2ino">'+
    '                    <option selected>Arduino</option>'+ selectMenu +
    '                  </select>'+
    '                </div>'+
    '                <div class="col-md-auto">'+
    '                  <input class="form-control text-center IR2PIN" type="text" placeholder="Arduino Pin">'+
    '                </div>'+
    '              </div>'+
    '            </div>'+
    '            <div class="col-6" id="moduleServos">'+
    '              <div class="row justify-content-md-center">'+
    '                <div class="col-md-auto">'+
    '                  <h6 class="text-center component-label">SERVO 1</h6>'+
    '                </div>'+
    '                <div class="col-md-auto">'+
    '                  <select class="custom-select Servo1Com">'+
    '                    <option selected>Arduino</option>'+ selectMenu +
    '                  </select>'+
    '                </div>'+
    '                <div class="col-md-auto">'+
    '                  <input class="form-control text-center Servo1Pin" type="text" placeholder="Arduino Pin">'+
    '                </div>'+
    '              </div><br>'+
    '              <div class="row justify-content-md-center">'+
    '                <div class="col-md-auto">'+
    '                  <h6 class="text-center component-label">SERVO 2</h6>'+
    '                </div>'+
    '                <div class="col-md-auto">'+
    '                  <select class="custom-select Servo1Com">'+
    '                    <option selected>Arduino</option>'+ selectMenu +
    '                  </select>'+
    '                </div>'+
    '                <div class="col-md-auto">'+
    '                  <input class="form-control text-center Servo1Pin" type="text" placeholder="Arduino Pin">'+
    '                </div>'+
    '              </div><br>'+
    '              <div class="row justify-content-md-center">'+
    '                <div class="col-md-auto">'+
    '                  <h6 class="text-center component-label">SERVO 3</h6>'+
    '                </div>'+
    '                <div class="col-md-auto">'+
    '                  <select class="custom-select Servo3Com">'+
    '                    <option selected>Arduino</option>'+ selectMenu +
    '                  </select>'+
    '                </div>'+
    '                <div class="col-md-auto">'+
    '                  <input class="form-control text-center Servo3Pin" type="text" placeholder="Arduino Pin">'+
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
      selectMenu += '<option data-ino="' + value + '" value="' + key + '">' + value + '</option>';
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
    '                  <h6 class="text-center component-label">IR 1</h6>'+
    '                </div>'+
    '                <div class="col-md-auto">'+
    '                  <select class="custom-select IR1ino">'+
    '                    <option selected>Arduino</option>'+ selectMenu +
    '                  </select>'+
    '                </div>'+
    '                <div class="col-md-auto">'+
    '                  <input class="form-control text-center IR1PIN" type="text" placeholder="Arduino Pin">'+
    '                </div>'+
    '              </div><br>'+
    '              <div class="row justify-content-md-center">'+
    '                <div class="col-md-auto">'+
    '                  <h6 class="text-center component-label">IR 2</h6>'+
    '                </div>'+
    '                <div class="col-md-auto">'+
    '                  <select class="custom-select IR2ino">'+
    '                    <option selected>Arduino</option>'+ selectMenu +
    '                  </select>'+
    '                </div>'+
    '                <div class="col-md-auto">'+
    '                  <input class="form-control text-center IR2PIN" type="text" placeholder="Arduino Pin">'+
    '                </div>'+
    '              </div>'+
    '            </div>'+
    '            <div class="col-6" id="moduleServos">'+
    '              <div class="row justify-content-md-center">'+
    '                <div class="col-md-auto">'+
    '                  <h6 class="text-center component-label">SERVO 1</h6>'+
    '                </div>'+
    '                <div class="col-md-auto">'+
    '                  <select class="custom-select Servo1Com">'+
    '                    <option selected>Arduino</option>'+ selectMenu +
    '                  </select>'+
    '                </div>'+
    '                <div class="col-md-auto">'+
    '                  <input class="form-control text-center Servo1Pin" type="text" placeholder="Arduino Pin">'+
    '                </div>'+
    '              </div><br>'+
    '            </div>'+
    '          </div>'+
    '        </div>';

    $('#modules').append(html);
  }
}

async function setOpenModules(modules){
  $('#modules').empty();
  let arduinos = await getAllArduinoNames();
  let selectMenu = "";
  if(arduinos) {
    sideModuleCounter += 1;
    $.each(arduinos, function(key, value) {
      selectMenu += '<option value="' + key + '">' + value + '</option>';
    });
  }
  // Iterate Through Modules Saved on Object
  for (var i = 0; i < modules.length; i++) {
    //Check if the module we are working with is a Main Module
    if(modules[i].Type == 'MainModule'){
      var mainModuleHTML ='<br class="mainModule'+ modules[i].Number +'">'+
      '         <div class="mainModule module mainModule'+ modules[i].Number +'">'+
      '          <div class="row">'+
      '            <div class="col-12 text-right">'+
      '              <button type="button" class="close" onClick="closeModule(this.id)" id="mainModule'+ modules[i].Number+'">'+
      '                 <span aria-hidden="true">X</span>'+
      '              </button>'+
      '            </div>'+
      '          </div>'+
      '          <div class="row" id="moduleTile">'+
      '            <div class="col-12" id="moduleType">'+
      '              <h4 class="text-center">Main Module ' + modules[i].Number + '</h4>'+
      '              <hr>'+
      '            </div>'+
      '          </div>'+
      '          <div class="row">'+
      '            <div class="col-6" id="moduleIRs">'+
      '              <div class="row justify-content-md-center">'+
      '                <div class="col-md-auto">'+
      '                  <h6 class="text-center component-label component-label">IR 1</h6>'+
      '                </div>'+
      '                <div class="col-md-auto">'+
      '                  <select class="custom-select IR1ino">'+
      '                    <option selected data-ino="'+ modules[i].IR1.ComName +'" value="'+ modules[i].IR1.Com +'">'+ modules[i].IR1.ComName +'</option>'+ selectMenu +
      '                  </select>'+
      '                </div>'+
      '                <div class="col-md-auto">'+
      '                  <input class="form-control text-center IR1PIN" type="text" placeholder="Arduino Pin" value="'+modules[i].IR1.Pin+'">'+
      '                </div>'+
      '              </div><br>'+
      '              <div class="row justify-content-md-center">'+
      '                <div class="col-md-auto">'+
      '                  <h6 class="text-center component-label">IR 2</h6>'+
      '                </div>'+
      '                <div class="col-md-auto">'+
      '                  <select class="custom-select IR2ino">'+
      '                    <option selected data-ino="'+ modules[i].IR2.ComName +'" value="'+ modules[i].IR2.Com +'">'+ modules[i].IR2.ComName +'</option>'+ selectMenu +
      '                  </select>'+
      '                </div>'+
      '                <div class="col-md-auto">'+
      '                  <input class="form-control text-center IR2PIN" type="text" placeholder="Arduino Pin" value="'+modules[i].IR2.Pin+'">'+
      '                </div>'+
      '              </div>'+
      '            </div>'+
      '            <div class="col-6" id="moduleServos">'+
      '              <div class="row justify-content-md-center">'+
      '                <div class="col-md-auto">'+
      '                  <h6 class="text-center component-label">SERVO 1</h6>'+
      '                </div>'+
      '                <div class="col-md-auto">'+
      '                  <select class="custom-select Servo1Com">'+
      '                    <option selected data-ino="'+ modules[i].S1.ComName +'" value="'+ modules[i].S1.Com +'">'+ modules[i].S1.ComName +'</option>'+ selectMenu +
      '                  </select>'+
      '                </div>'+
      '                <div class="col-md-auto">'+
      '                  <input class="form-control text-center Servo1Pin" type="text" placeholder="Arduino Pin" value="'+modules[i].S1.Pin+'">'+
      '                </div>'+
      '              </div><br>'+
      '              <div class="row justify-content-md-center">'+
      '                <div class="col-md-auto">'+
      '                  <h6 class="text-center component-label">SERVO 2</h6>'+
      '                </div>'+
      '                <div class="col-md-auto">'+
      '                  <select class="custom-select Servo2Com">'+
      '                    <option selected data-ino="'+ modules[i].S2.ComName +'" value="'+ modules[i].S2.Com +'">'+ modules[i].S2.ComName +'</option>'+ selectMenu +
      '                  </select>'+
      '                </div>'+
      '                <div class="col-md-auto">'+
      '                  <input class="form-control text-center Servo2Pin" type="text" placeholder="Arduino Pin" value="'+modules[i].S2.Pin+'">'+
      '                </div>'+
      '              </div><br>'+
      '              <div class="row justify-content-md-center">'+
      '                <div class="col-md-auto">'+
      '                  <h6 class="text-center component-label">SERVO 3</h6>'+
      '                </div>'+
      '                <div class="col-md-auto">'+
      '                  <select class="custom-select Servo3Com">'+
      '                    <option selected data-ino="'+ modules[i].S3.ComName +'" value="'+ modules[i].S3.Com +'">'+ modules[i].S3.ComName +'</option>'+ selectMenu +
      '                  </select>'+
      '                </div>'+
      '                <div class="col-md-auto">'+
      '                  <input class="form-control text-center Servo3Pin" type="text" placeholder="Arduino Pin" value="'+modules[i].S3.Pin+'">'+
      '                </div>'+
      '              </div>'+
      '            </div>'+
      '          </div>'+
      '        </div>';
      $('#modules').append(mainModuleHTML);
    }

    //Check if the module we are working with is a Side Module
    if(modules[i].Type == 'SideModule'){
      var sideModuleHTML = '<br class="sideModule'+ modules[i].Number +'">'+
      '         <div class="sideModule module sideModule'+ modules[i].Number +'">'+
      '          <div class="row">'+
      '            <div class="col-12 text-right">'+
      '              <button type="button" class="close" onClick="closeModule(this.id)" id="sideModule'+ modules[i].Number +'">'+
      '                 <span aria-hidden="true">X</span>'+
      '              </button>'+
      '            </div>'+
      '          </div>'+
      '          <div class="row" id="moduleTile">'+
      '            <div class="col-12" id="moduleType">'+
      '              <h4 class="text-center">Side Module ' + modules[i].Number + '</h4>'+
      '              <hr>'+
      '            </div>'+
      '          </div>'+
      '          <div class="row">'+
      '            <div class="col-6" id="moduleIRs">'+
      '              <div class="row justify-content-md-center">'+
      '                <div class="col-md-auto">'+
      '                  <h6 class="text-center component-label">IR 1</h6>'+
      '                </div>'+
      '                <div class="col-md-auto">'+
      '                  <select class="custom-select IR1ino">'+
      '                    <option selected data-ino="'+ modules[i].IR1.ComName +'" value="'+ modules[i].IR1.Com +'">'+ modules[i].IR1.ComName +'</option>'+ selectMenu +
      '                  </select>'+
      '                </div>'+
      '                <div class="col-md-auto">'+
      '                  <input class="form-control text-center IR1PIN" type="text" placeholder="Arduino Pin" value="'+modules[i].IR1.Pin+'">'+
      '                </div>'+
      '              </div><br>'+
      '              <div class="row justify-content-md-center">'+
      '                <div class="col-md-auto">'+
      '                  <h6 class="text-center component-label">IR 2</h6>'+
      '                </div>'+
      '                <div class="col-md-auto">'+
      '                  <select class="custom-select IR2ino">'+
      '                    <option selected data-ino="'+ modules[i].IR2.ComName +'" value="'+ modules[i].IR2.Com +'">'+ modules[i].IR2.ComName +'</option>'+ selectMenu +
      '                  </select>'+
      '                </div>'+
      '                <div class="col-md-auto">'+
      '                  <input class="form-control text-center IR2PIN" type="text" placeholder="Arduino Pin"  value="'+modules[i].IR2.Pin+'">'+
      '                </div>'+
      '              </div>'+
      '            </div>'+
      '            <div class="col-6" id="moduleServos">'+
      '              <div class="row justify-content-md-center">'+
      '                <div class="col-md-auto">'+
      '                  <h6 class="text-center component-label">SERVO 1</h6>'+
      '                </div>'+
      '                <div class="col-md-auto">'+
      '                  <select class="custom-select Servo1Com">'+
      '                    <option selected data-ino="'+ modules[i].S1.ComName +'" value="'+ modules[i].S1.Com +'">'+ modules[i].S1.ComName +'</option>'+ selectMenu +
      '                  </select>'+
      '                </div>'+
      '                <div class="col-md-auto">'+
      '                  <input class="form-control text-center Servo1Pin" type="text" placeholder="Arduino Pin" value="'+modules[i].S1.Pin+'">'+
      '                </div>'+
      '              </div><br>'+
      '            </div>'+
      '          </div>'+
      '        </div>';

      $('#modules').append(sideModuleHTML);
    }
  }
}
