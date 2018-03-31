
function Login() {
  var email = $("#email").val();
  var password = $("#password").val();

  if(email == "capstone@inter.edu" && password == "capstone"){
    window.location.href = '/index.html'; //relative to domain
  }
};
