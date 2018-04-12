
function Login() {
  console.log("Logging In");
  var username = $("#username").val();
  var password = $("#password").val();

  if(username == "capstone" && password == "capstone"){
    window.location="/index.html";
  }
};
