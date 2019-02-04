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
    // signUpUser(userData.email, userData.password);
    checkUser(userData.email, userData.password);
    signUpEmail.val("");
    signUpPassword.val("");
  });


  // Does a post to the signup route. Upon success, /create is loaded
  function signUpUser(email, password) {
    console.log("signup", email, password);
    $.post("/api/signup", {
      email: email,
      password: password
    }).then(function(data) {
      window.location.replace(data);
      // If there's an error, handle it by throwing up a boostrap alert
    }).catch(handleSignupErr);
  }

  function checkUser(email, password) {
    $.get("api/check/" + email ).then(function(data) {
      if (data !== null) {
        handleSignupErr();
      } else {
        signUpUser(email, password);
      }
    });
  }

  function handleSignupErr(err) {
    if (err == null) {
      $(".signup-msg").html("User already exist");
    }
    $("#signup-alert").fadeIn(500);
  }

  function handleLoginErr(err) {
    $("#login-alert .login-msg").text(err.responseJSON);
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
    }).catch(handleLoginErr)
    // .catch(function(err) {
    //   console.log("Please Check Email and Password");
    // });
  }

  function front2back(card) {
    card.removeClass("toFront");
    card.addClass("toBack");
  }

  function back2front(card) {
    card.removeClass("toBack");
    card.addClass("toFront");
  }

  $(".card").on('click', '.footer-btn', function() {
    let card = $(this).offsetParent();
    let signup = $(".signup-card");
    let login = $(".login-card");
    position = card.hasClass("toFront");
    start = card.hasClass("init");

    console.log("bingo", position, start, card);
    if (!position && !start ) {
      login.removeClass("init");
      isSignup = signup.hasClass("toFront");
      if (isSignup) {
        back2front(login);
        front2back(signup);
      } else {
        back2front(signup);
        front2back(login);
      }
    }

  });

  $(".card").on('click', '.middle', function() {
    let card = $(".card-area");
    let contains = card.hasClass("rotate");
    if (!contains) {
      card.addClass("rotate");
    } else {
      card.removeClass("rotate");
    }
  });


});


var images = ["mtg-portrait-blue3.jpg", "mtg-portrait-red3.jpg", "mtg-portrait-gold3.jpg", "mtg-portrait-purple3.jpg", "mtg-portrait-green3.jpg"];
var screenSize = Math.floor((Math.random() * images.length));
var background = images[screenSize];
if (screen.height > screen.width) {
  console.log("portrait");
  $("body").css("background-image", "url(./images/backgrounds/" + background + ")");
} else {
  console.log("landscape");
  $("body").css("background-image", "url(./images/backgrounds/mtg-landscape-wallpaper2.jpg)");
}
