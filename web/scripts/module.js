
var mainModuleCounter = 0;
var sideModuleCounter = 0;

//Shapes
//1 = Cube
//2 = Cylinder
//3 = Triangle

//Colors
//1 = Red
//2 = Blue

//SideModuleSetting Object
function SideModuleSetting(Door, RightColor, LeftColor) {
    this.Door = Door;
    this.RightColor = RightColor;
    this.LeftColor = LeftColor;
};

//MainModuleSetting Object
function MainModuleSetting(Door, Shape) {
    this.Door = Door;
    this.Shape = Shape;
};

//Component Object
function Component(ComName, Com, Pin) {
    this.ComName = ComName;
    this.Com = Com;
    this.Pin = Pin;
};
//Main Module Object
function MainModule(moduleNum, IR1, IR2, S1, S2, S3, Door1Settings, Door2Settings, Door3Settings) {
    this.Type = "MainModule";
    this.Number = moduleNum;
    this.IR1 = new Component(IR1.ComName, IR1.Com, IR1.Pin);
    this.IR2 = new Component(IR2.ComName, IR2.Com, IR2.Pin);
    this.S1 = new Component(S1.ComName, S1.Com, S1.Pin);
    this.S2 = new Component(S2.ComName, S2.Com, S2.Pin);
    this.S3 = new Component(S3.ComName, S3.Com, S3.Pin);
    this.Door1Settings = new MainModuleSetting(Door1Settings.Door, Door1Settings.Shape);
    this.Door2Settings = new MainModuleSetting(Door2Settings.Door, Door2Settings.Shape);
    this.Door3Settings = new MainModuleSetting(Door3Settings.Door, Door3Settings.Shape);
};
// SideModule Object
function SideModule(moduleNum, IR1, IR2, S1, Door1Settings, Door2Settings, Door3Settings) {
    this.Type = "SideModule";
    this.Number = moduleNum;
    this.IR1 = new Component(IR1.ComName, IR1.Com, IR1.Pin);
    this.IR2 = new Component(IR2.ComName, IR2.Com, IR2.Pin);
    this.S1 = new Component(S1.ComName, S1.Com, S1.Pin);
    this.Door1Settings = new SideModuleSetting(Door1Settings.Door, Door1Settings.RightColor, Door1Settings.LeftColor);
    this.Door2Settings = new SideModuleSetting(Door2Settings.Door, Door2Settings.RightColor, Door2Settings.LeftColor);
    this.Door3Settings = new SideModuleSetting(Door3Settings.Door, Door3Settings.RightColor, Door3Settings.LeftColor);
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
        //Get Doors Settings
        var Door1Shape = $("div#classificationMainModuleModal"+moduleCount).find("#shapeSelectDoor1 option:selected").val();
        var Door2Shape = $("div#classificationMainModuleModal"+moduleCount).find("#shapeSelectDoor2 option:selected").val();
        var Door3Shape = $("div#classificationMainModuleModal"+moduleCount).find("#shapeSelectDoor3 option:selected").val();

        //Doors
        var Door1Settings = new MainModuleSetting(1, Door1Shape);
        var Door2Settings = new MainModuleSetting(2, Door2Shape);
        var Door3Settings = new MainModuleSetting(3, Door3Shape);
        //IR Components
        var IR1Component = new Component(comIR1Name, comIR1,pinIR1);
        var IR2Component = new Component(comIR2Name, comIR2,pinIR2);
        //Servo Components
        var Servo1Component = new Component(comS1Name, comS1,pinS1);
        var Servo2Component = new Component(comS2Name, comS2, pinS2);
        var Servo3Component = new Component(comS3Name, comS3, pinS3);

        //Main Module
        var thisMainModule = new MainModule(moduleCount,IR1Component,IR2Component,Servo1Component,Servo2Component,Servo3Component,Door1Settings,Door2Settings,Door3Settings);
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
        //Get Doors Settings
        //Door 1
        var Door1RightColor = $("div#classificationSideModuleModal"+moduleCount).find("#Door1RightColor option:selected").val();
        var Door1LeftColor = $("div#classificationSideModuleModal"+moduleCount).find("#Door1LeftColor option:selected").val();
        //Door 2
        var Door2RightColor = $("div#classificationSideModuleModal"+moduleCount).find("#Door2RightColor option:selected").val();
        var Door2LeftColor = $("div#classificationSideModuleModal"+moduleCount).find("#Door2LeftColor option:selected").val();
        //Door 3
        var Door3RightColor = $("div#classificationSideModuleModal"+moduleCount).find("#Door3RightColor option:selected").val();
        var Door3LeftColor = $("div#classificationSideModuleModal"+moduleCount).find("#Door3LeftColor option:selected").val();

        //Door Settings
        var Door1Settings = new SideModuleSetting(1, Door1RightColor, Door1LeftColor);
        var Door2Settings = new SideModuleSetting(2, Door2RightColor, Door2LeftColor);
        var Door3Settings = new SideModuleSetting(3, Door3RightColor, Door3LeftColor);
        //IR Components
        var IR1Component = new Component(comIR1Name, comIR1, pinIR1);
        var IR2Component = new Component(comIR2Name, comIR2, pinIR2);
        //Servo Components
        var Servo1Component = new Component(comS1Name, comS1, pinS1);
        //Side Module
        var thisSideModule = new SideModule(moduleCount,IR1Component,IR2Component,Servo1Component,Door1Settings,Door2Settings,Door3Settings);
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
    '              <div class="row justify-content-md-center">'+
    '                <div class="col-md-auto">'+
    '                   <button id="openClassification" data-toggle="modal" data-target="#classificationMainModuleModal'+ mainModuleCounter +'" class="btn btn-success">Classification Settings</button>'+
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
    '                  <select class="custom-select Servo2Com">'+
    '                    <option selected>Arduino</option>'+ selectMenu +
    '                  </select>'+
    '                </div>'+
    '                <div class="col-md-auto">'+
    '                  <input class="form-control text-center Servo2Pin" type="text" placeholder="Arduino Pin">'+
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
    '        </div>'+
    '        <div class="modal fade" id="classificationMainModuleModal'+ mainModuleCounter +'" tabindex="-1" role="dialog" aria-labelledby="moduleModalLabel" aria-hidden="true">'+
    '         <div class="modal-dialog" role="document">'+
    '           <div class="modal-content">'+
    '              <div class="modal-header">'+
    '                <h5 class="modal-title" id="moduleModalLabel">Classification Settings</h5>'+
    '               <button class="close" type="button" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">X</span></button>'+
    '              </div>'+
    '          <div class="modal-body">'+
    '            <div class="col-md-12 text-center">'+
    '              <h5>Main Module '+ mainModuleCounter +'</h5>'+
    '              <!--Door #1 Settings-->'+
    '              <div class="row modal-div">'+
    '                <div class="col-md-12">'+
    '                  <h6>Door #1</h6>'+
    '                </div>'+
    '              </div>'+
    '              <div class="row modal-div">'+
    '                <div class="col-md-3">'+
    '                  <h6>Choose</h6>'+
    '                </div>'+
    '                <div class="col-md-8">'+
    '                  <select class="select form-control input-lg" id="shapeSelectDoor1" form="shapeSelect" name="Door1Shape">'+
    '                    <option value="0" selected>-- Select --</option>'+
    '                    <option value="1">Cube</option>'+
    '                    <option value="2">Cylinder</option>'+
    '                    <option value="3">Triangle</option>'+
    '                  </select>'+
    '                </div>'+
    '              </div>'+
    '              <!--Door #2 Settings-->'+
    '              <div class="row modal-div">'+
    '                <div class="col-md-12">'+
    '                  <h6>Door #2</h6>'+
    '                </div>'+
    '              </div>'+
    '              <div class="row modal-div">'+
    '                <div class="col-md-3">'+
    '                  <h6>Choose</h6>'+
    '                </div>'+
    '                <div class="col-md-8">'+
    '                  <select class="select form-control input-lg" id="shapeSelectDoor2" form="shapeSelect" name="Door2Shape">'+
    '                    <option value="0" selected>-- Select --</option>'+
    '                    <option value="1">Cube</option>'+
    '                    <option value="2">Cylinder</option>'+
    '                    <option value="3">Triangle</option>'+
    '                  </select>'+
    '                </div>'+
    '              </div>'+
    '              <!--Door #3 Settings-->'+
    '              <div class="row modal-div">'+
    '                <div class="col-md-12">'+
    '                  <h6>Door #3</h6>'+
    '                </div>'+
    '              </div>'+
    '              <div class="row modal-div">'+
    '                <div class="col-md-3">'+
    '                  <h6>Choose</h6>'+
    '                </div>'+
    '                <div class="col-md-8">'+
    '                  <select class="select form-control input-lg" id="shapeSelectDoor3" form="shapeSelect" name="Door3Shape">'+
    '                    <option value="0" selected>-- Select --</option>'+
    '                    <option value="1">Cube</option>'+
    '                    <option value="2">Cylinder</option>'+
    '                    <option value="3">Triangle</option>'+
    '                  </select>'+
    '                </div>'+
    '              </div>'+
    '            </div>'+
    '          </div>'+
    '          <div class="modal-footer">'+
    '            <button class="btn btn-warning" id="closeColorModal" type="button" data-dismiss="modal">Close</button>'+
    '          </div>'+
    '        </div>'+
    '      </div>'+
    '    </div>';

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
    '              <div class="row justify-content-md-center">'+
    '                <div class="col-md-auto">'+
    '                   <button id="openClassification" data-toggle="modal" data-target="#classificationSideModuleModal' + sideModuleCounter + '" class="btn btn-success">Classification Settings</button>'+
    '                </div>'+
    '              </div>'+
    '            </div>'+
    '          </div>'+
    '        </div>'+
    '        <div id="classificationSideModuleModal' + sideModuleCounter + '" tabindex="-1" role="dialog" aria-labelledby="moduleModalLabel" aria-hidden="true" class="modal fade">'+
    '           <div role="document" class="modal-dialog">'+
    '           <div class="modal-content">'+
    '           <div class="modal-header">'+
    '             <h5 id="moduleModalLabel" class="modal-title">Classification Settings</h5>'+
    '             <button type="button" data-dismiss="modal" aria-label="Close" class="close"><span aria-hidden="true">X</span></button>'+
    '           </div>'+
    '        <div class="modal-body">'+
    '        <div class="col-md-12 text-center">'+
    '          <h5>Side Module ' + sideModuleCounter + '</h5>'+
    '          <!--Door #1 Settings-->'+
    '          <div class="row modal-div">'+
    '            <div class="col-md-12">'+
    '              <h6>Main Door #1</h6>'+
    '            </div>'+
    '          </div>'+
    '          <div class="row modal-div">'+
    '            <div class="col-md-3">'+
    '              <h6>Right</h6>'+
    '            </div>'+
    '            <div class="col-md-8">'+
    '              <select id="Door1RightColor" form="shapeSelect" name="Door1RightColor" class="select form-control input-lg">'+
    '                <option value="0" selected="selected">-- Select --</option>'+
    '                <option value="1">Red</option>'+
    '                <option value="2">Blue</option>'+
    '              </select>'+
    '            </div>'+
    '          </div>'+
    '          <div class="row modal-div">'+
    '            <div class="col-md-3">'+
    '              <h6>Left</h6>'+
    '            </div>'+
    '            <div class="col-md-8">'+
    '              <select id="Door1LeftColor" form="shapeSelect" name="Door1LeftColor" class="select form-control input-lg">'+
    '                <option value="0" selected="selected">-- Select --</option>'+
    '                <option value="1">Red</option>'+
    '                <option value="2">Blue</option>'+
    '              </select>'+
    '            </div>'+
    '          </div>'+
    '          <!--Door #2 Settings-->'+
    '          <div class="row modal-div">'+
    '            <div class="col-md-12">'+
    '              <h6>Main Door #2</h6>'+
    '            </div>'+
    '          </div>'+
    '          <div class="row modal-div">'+
    '            <div class="col-md-3">'+
    '              <h6>Right</h6>'+
    '            </div>'+
    '            <div class="col-md-8">'+
    '              <select id="Door2RightColor" form="shapeSelect" name="Door2RightColor" class="select form-control input-lg">'+
    '                <option value="0" selected="selected">-- Select --</option>'+
    '                <option value="1">Red</option>'+
    '                <option value="2">Blue</option>'+
    '              </select>'+
    '            </div>'+
    '          </div>'+
    '          <div class="row modal-div">'+
    '            <div class="col-md-3">'+
    '              <h6>Left</h6>'+
    '            </div>'+
    '            <div class="col-md-8">'+
    '              <select id="Door2LeftColor" form="shapeSelect" name="Door2LeftColor" class="select form-control input-lg">'+
    '                <option value="0" selected="selected">-- Select --</option>'+
    '                <option value="1">Red</option>'+
    '                <option value="2">Blue</option>'+
    '              </select>'+
    '            </div>'+
    '          </div>'+
    '          <!--Door #3 Settings-->'+
    '          <div class="row modal-div">'+
    '            <div class="col-md-12">'+
    '              <h6>Main Door #3</h6>'+
    '            </div>'+
    '          </div>'+
    '          <div class="row modal-div">'+
    '            <div class="col-md-3">'+
    '              <h6>Right</h6>'+
    '            </div>'+
    '            <div class="col-md-8">'+
    '              <select id="Door3RightColor" form="shapeSelect" name="Door3RightColor" class="select form-control input-lg">'+
    '                <option value="0" selected="selected">-- Select --</option>'+
    '                <option value="1">Red</option>'+
    '                <option value="2">Blue</option>'+
    '              </select>'+
    '            </div>'+
    '          </div>'+
    '          <div class="row modal-div">'+
    '            <div class="col-md-3">'+
    '              <h6>Left</h6>'+
    '            </div>'+
    '            <div class="col-md-8">'+
    '              <select id="Door3LeftColor" form="shapeSelect" name="Door3LeftColor" class="select form-control input-lg">'+
    '                <option value="0" selected="selected">-- Select --</option>'+
    '                <option value="1">Red</option>'+
    '                <option value="2">Blue</option>'+
    '              </select>'+
    '            </div>'+
    '          </div>'+
    '        </div>'+
    '      </div>'+
    '      <div class="modal-footer">'+
    '        <button id="closeColorModal" type="button" data-dismiss="modal" class="btn btn-warning">Close</button>'+
    '      </div>'+
    '    </div>'+
    '  </div>'+
    '</div>';

    $('#modules').append(html);
  }
}
async function getColor(color){
//Colors
//1 = Red
//2 = Blue
  if(!color || color == 0){
    return "--Select--";
  }
  switch(color){
    case "1":
      return "Red";
      break;
    case "2":
      return "Blue";
      break;
  }
}

async function getShape(shape){
  //Shapes
  //1 = Cube
  //2 = Cylinder
  //3 = Triangle
  if(!shape || shape == 0){
    return "--Select--";
  }
  switch(shape){
    case "1":
      return "Cube";
      break;
    case "2":
      return "Cylinder";
      break;
    case "3":
      return "Triangle";
      break;
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

      let Shape1 = await getShape(modules[i].Door1Settings.Shape);
      let Shape2 = await getShape(modules[i].Door2Settings.Shape);
      let Shape3 = await getShape(modules[i].Door3Settings.Shape);

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
      '              <div class="row justify-content-md-center">'+
      '                <div class="col-md-auto">'+
      '                   <button id="openClassification" data-toggle="modal" data-target="#classificationMainModuleModal'+ modules[i].Number +'" class="btn btn-success">Classification Settings</button>'+
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
      '        </div>'+
      '        <div class="modal fade" id="classificationMainModuleModal'+ modules[i].Number +'" tabindex="-1" role="dialog" aria-labelledby="moduleModalLabel" aria-hidden="true">'+
      '         <div class="modal-dialog" role="document">'+
      '           <div class="modal-content">'+
      '              <div class="modal-header">'+
      '                <h5 class="modal-title" id="moduleModalLabel">Classification Settings</h5>'+
      '               <button class="close" type="button" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">X</span></button>'+
      '              </div>'+
      '          <div class="modal-body">'+
      '            <div class="col-md-12 text-center">'+
      '              <h5>Main Module '+ modules[i].Number +'</h5>'+
      '              <!--Door #1 Settings-->'+
      '              <div class="row modal-div">'+
      '                <div class="col-md-12">'+
      '                  <h6>Door #1</h6>'+
      '                </div>'+
      '              </div>'+
      '              <div class="row modal-div">'+
      '                <div class="col-md-3">'+
      '                  <h6>Choose</h6>'+
      '                </div>'+
      '                <div class="col-md-8">'+
      '                  <select class="select form-control input-lg" id="shapeSelectDoor1" form="shapeSelect" name="Door1Shape">'+
      '                    <option value="'+ modules[i].Door1Settings.Shape +'" selected>'+ Shape1 +'</option>'+
      '                    <option value="1">Cube</option>'+
      '                    <option value="2">Cylinder</option>'+
      '                    <option value="3">Triangle</option>'+
      '                  </select>'+
      '                </div>'+
      '              </div>'+
      '              <!--Door #2 Settings-->'+
      '              <div class="row modal-div">'+
      '                <div class="col-md-12">'+
      '                  <h6>Door #2</h6>'+
      '                </div>'+
      '              </div>'+
      '              <div class="row modal-div">'+
      '                <div class="col-md-3">'+
      '                  <h6>Choose</h6>'+
      '                </div>'+
      '                <div class="col-md-8">'+
      '                  <select class="select form-control input-lg" id="shapeSelectDoor2" form="shapeSelect" name="Door2Shape">'+
      '                    <option value="'+ modules[i].Door2Settings.Shape +'" selected>'+ Shape2 +'</option>'+
      '                    <option value="1">Cube</option>'+
      '                    <option value="2">Cylinder</option>'+
      '                    <option value="3">Triangle</option>'+
      '                  </select>'+
      '                </div>'+
      '              </div>'+
      '              <!--Door #3 Settings-->'+
      '              <div class="row modal-div">'+
      '                <div class="col-md-12">'+
      '                  <h6>Door #3</h6>'+
      '                </div>'+
      '              </div>'+
      '              <div class="row modal-div">'+
      '                <div class="col-md-3">'+
      '                  <h6>Choose</h6>'+
      '                </div>'+
      '                <div class="col-md-8">'+
      '                  <select class="select form-control input-lg" id="shapeSelectDoor3" form="shapeSelect" name="Door3Shape">'+
      '                    <option value="'+ modules[i].Door3Settings.Shape +'" selected>'+ Shape3 +'</option>'+
      '                    <option value="1">Cube</option>'+
      '                    <option value="2">Cylinder</option>'+
      '                    <option value="3">Triangle</option>'+
      '                  </select>'+
      '                </div>'+
      '              </div>'+
      '            </div>'+
      '          </div>'+
      '          <div class="modal-footer">'+
      '            <button class="btn btn-warning" id="closeColorModal" type="button" data-dismiss="modal">Close</button>'+
      '          </div>'+
      '        </div>'+
      '      </div>'+
      '    </div>';

      $('#modules').append(mainModuleHTML);
    }

    //Check if the module we are working with is a Side Module
    if(modules[i].Type == 'SideModule'){
      let Door1RightColor = await getColor(modules[i].Door1Settings.RightColor);
      let Door1LeftColor  = await getColor(modules[i].Door1Settings.LeftColor);

      let Door2RightColor = await getColor(modules[i].Door2Settings.RightColor);
      let Door2LeftColor  = await getColor(modules[i].Door2Settings.LeftColor);

      let Door3RightColor = await getColor(modules[i].Door3Settings.RightColor);
      let Door3LeftColor  = await getColor(modules[i].Door3Settings.LeftColor);

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
      '              <div class="row justify-content-md-center">'+
      '                <div class="col-md-auto">'+
      '                   <button id="openClassification" data-toggle="modal" data-target="#classificationSideModuleModal' + sideModuleCounter + '" class="btn btn-success">Classification Settings</button>'+
      '                </div>'+
      '              </div>'+
      '            </div>'+
      '          </div>'+
      '        </div>'+
      '        <div id="classificationSideModuleModal' + modules[i].Number + '" tabindex="-1" role="dialog" aria-labelledby="moduleModalLabel" aria-hidden="true" class="modal fade">'+
      '           <div role="document" class="modal-dialog">'+
      '           <div class="modal-content">'+
      '           <div class="modal-header">'+
      '             <h5 id="moduleModalLabel" class="modal-title">Classification Settings</h5>'+
      '             <button type="button" data-dismiss="modal" aria-label="Close" class="close"><span aria-hidden="true">X</span></button>'+
      '           </div>'+
      '        <div class="modal-body">'+
      '        <div class="col-md-12 text-center">'+
      '          <h5>Side Module ' + modules[i].Number + '</h5>'+
      '          <!--Door #1 Settings-->'+
      '          <div class="row modal-div">'+
      '            <div class="col-md-12">'+
      '              <h6>Main Door #1</h6>'+
      '            </div>'+
      '          </div>'+
      '          <div class="row modal-div">'+
      '            <div class="col-md-3">'+
      '              <h6>Right</h6>'+
      '            </div>'+
      '            <div class="col-md-8">'+
      '              <select id="Door1RightColor" form="shapeSelect" name="Door1RightColor" class="select form-control input-lg">'+
      '                <option value="'+ modules[i].Door1Settings.RightColor +'" selected>'+ Door1RightColor +'</option>'+
      '                <option value="1">Red</option>'+
      '                <option value="2">Blue</option>'+
      '              </select>'+
      '            </div>'+
      '          </div>'+
      '          <div class="row modal-div">'+
      '            <div class="col-md-3">'+
      '              <h6>Left</h6>'+
      '            </div>'+
      '            <div class="col-md-8">'+
      '              <select id="Door1LeftColor" form="shapeSelect" name="Door1LeftColor" class="select form-control input-lg">'+
      '                <option value="'+ modules[i].Door1Settings.LeftColor +'" selected>'+ Door1LeftColor +'</option>'+
      '                <option value="1">Red</option>'+
      '                <option value="2">Blue</option>'+
      '              </select>'+
      '            </div>'+
      '          </div>'+
      '          <!--Door #2 Settings-->'+
      '          <div class="row modal-div">'+
      '            <div class="col-md-12">'+
      '              <h6>Main Door #2</h6>'+
      '            </div>'+
      '          </div>'+
      '          <div class="row modal-div">'+
      '            <div class="col-md-3">'+
      '              <h6>Right</h6>'+
      '            </div>'+
      '            <div class="col-md-8">'+
      '              <select id="Door2RightColor" form="shapeSelect" name="Door2RightColor" class="select form-control input-lg">'+
      '                <option value="'+ modules[i].Door2Settings.RightColor +'" selected>'+ Door2RightColor +'</option>'+
      '                <option value="1">Red</option>'+
      '                <option value="2">Blue</option>'+
      '              </select>'+
      '            </div>'+
      '          </div>'+
      '          <div class="row modal-div">'+
      '            <div class="col-md-3">'+
      '              <h6>Left</h6>'+
      '            </div>'+
      '            <div class="col-md-8">'+
      '              <select id="Door2LeftColor" form="shapeSelect" name="Door2LeftColor" class="select form-control input-lg">'+
      '                <option value="'+ modules[i].Door2Settings.LeftColor +'" selected>'+ Door2LeftColor +'</option>'+
      '                <option value="1">Red</option>'+
      '                <option value="2">Blue</option>'+
      '              </select>'+
      '            </div>'+
      '          </div>'+
      '          <!--Door #3 Settings-->'+
      '          <div class="row modal-div">'+
      '            <div class="col-md-12">'+
      '              <h6>Main Door #3</h6>'+
      '            </div>'+
      '          </div>'+
      '          <div class="row modal-div">'+
      '            <div class="col-md-3">'+
      '              <h6>Right</h6>'+
      '            </div>'+
      '            <div class="col-md-8">'+
      '              <select id="Door3RightColor" form="shapeSelect" name="Door3RightColor" class="select form-control input-lg">'+
      '                <option value="'+ modules[i].Door3Settings.RightColor +'" selected>'+ Door3RightColor +'</option>'+
      '                <option value="1">Red</option>'+
      '                <option value="2">Blue</option>'+
      '              </select>'+
      '            </div>'+
      '          </div>'+
      '          <div class="row modal-div">'+
      '            <div class="col-md-3">'+
      '              <h6>Left</h6>'+
      '            </div>'+
      '            <div class="col-md-8">'+
      '              <select id="Door3LeftColor" form="shapeSelect" name="Door3LeftColor" class="select form-control input-lg">'+
      '                <option value="'+ modules[i].Door3Settings.LeftColor +'" selected>'+ Door3LeftColor +'</option>'+
      '                <option value="1">Red</option>'+
      '                <option value="2">Blue</option>'+
      '              </select>'+
      '            </div>'+
      '          </div>'+
      '        </div>'+
      '      </div>'+
      '      <div class="modal-footer">'+
      '        <button id="closeColorModal" type="button" data-dismiss="modal" class="btn btn-warning">Close</button>'+
      '      </div>'+
      '    </div>'+
      '  </div>'+
      '</div>';

      $('#modules').append(sideModuleHTML);
    }
  }
}
