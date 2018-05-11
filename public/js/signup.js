// both login and signin


$(document).ready(function() {
  // Getting references to our form and input
  var signUpForm = $("form.signup");
  var signUpEmail = $("input#signup-email-input");
  var signUpPassword = $("input#signup-password-input");

  // When the signup button is clicked, we validate the email and password are not blank
  signUpForm.on("submit", function(event) {
    event.preventDefault();
    var userData = {
      email: signUpEmail.val().trim(),
      password: signUpPassword.val().trim()
    };

    if (!userData.email || !userData.password) {
      return;
    }
    // If we have an email and password, run the signUpUser function
    signUpUser(userData.email, userData.password);
    signUpEmail.val("");
    signUpPassword.val("");
  });


  // Does a post to the signup route. Upon success, /create is loaded
  function signUpUser(email, password) {
    $.post("/api/signup", {
      email: email,
      password: password
    }).then(function(data) {
      window.location.replace(data);
      // If there's an error, handle it by throwing up a boostrap alert
    }).catch(handleLoginErr);
  }

  function handleLoginErr(err) {
    $("#alert .msg").text(err.responseJSON);
    $("#alert").fadeIn(500);
  };

  // ================== LOGIN =====================

  var loginForm = $("form.login");
  var loginEmail = $("input#login-email-input");
  var loginPassword = $("input#login-password-input");


  // When the form is submitted, we validate there's an email and password entered
  loginForm.on("submit", function(event) {
    event.preventDefault();
    var userData = {
      email: loginEmail.val().trim(),
      password: loginPassword.val().trim()
    };

    if (!userData.email || !userData.password) {
      return;
    }

    // If we have an email and password we run the loginUser function and clear the form
    loginUser(userData.email, userData.password);
    loginEmail.val("");
    loginPassword.val("");
  });

  // loginUser does a post to our "api/login" route and if successful, redirects us the the members page
  function loginUser(email, password) {
    $.post("/api/login", {
      email: email,
      password: password
    }).then(function(page) {
      $.get("/api/commander").then(function(results) {
        localStorage.setItem("mtgCommanders", JSON.stringify(results));
        window.location.replace(page);
      });
      // window.location.replace(data);
      // If there's an error, log the error
    }).catch(function(err) {
      console.log(err);
    });
  }

});


var images = ["mtg-portrait-blue2.jpg", "mtg-portrait-red2.jpg", "mtg-portrait-gold2.jpg", "mtg-portrait-purple2.jpg", "mtg-portrait-green2.jpg"];
var screenSize = Math.floor((Math.random() * images.length) + 1);
var background = images[screenSize];
if (screen.height > screen.width) {
  console.log("portrait");
  $("body").css("background-image", "url(./images/backgrounds/" + background + ")");
} else {
  console.log("landscape");
  $("body").css("background-image", "url(./images/backgrounds/mtg-landscape-wallpaper.jpg)");
}


$(document).on('click', '.card-footer', function(){
  var belowCard = $('.below'),
  aboveCard = $('.above'),
  parent = $('.form-collection');
  parent.addClass('animation-state-1');
  setTimeout(function(){
    belowCard.removeClass('below');
    aboveCard.removeClass('above');
    belowCard.addClass('above');
    aboveCard.addClass('below');
    setTimeout(function(){
      parent.addClass('animation-state-finish');
      parent.removeClass('animation-state-1');
      setTimeout(function(){
        aboveCard.addClass('turned');
        belowCard.removeClass('turned');
        parent.removeClass('animation-state-finish');
      }, 300)
    }, 10)
  }, 300);
});
