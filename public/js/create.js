
$(document).ready(function() {
  // array of names to be used until player chooses own name...used as a placeholder so players can be assigned
  var mockNameArray = ["League With No Name", "A League of Their Own", "Major League", "The League of Extraordinary Gentlemen", "Justice League", "Little Big League", "Out of Your League"];
  
  // randomly pick one of the names
  var commonName = mockNameArray[Math.floor(Math.random() * mockNameArray.length)];

  var theLeague;
  var thePlayers;

  initializeUserData();

//============================ INITIALIZE USER DATA ============================
  // This function grabs the logged-in user's data for the league creation to be connected to
  function initializeUserData() {
    $.get("/api/user_data").then(function(data) {
      var league = {
        leagueName: commonName,
        UserId: data.id
      };
      initializeLeague(league);
    });
  };

//============================= INITIALIZE LEAGUE ==============================

  function initializeLeague(leagueData) {
    $.post("/api/league", leagueData).then(function(leagueInfo) {
      theLeague = leagueInfo;
      console.log("leagueInfo", leagueInfo);
    });
  };

//============================ ADD PLAYER TO LEAGUE ============================

  $("#addPlayer").click(function(event) {
    event.preventDefault();
    var newPlayer = $(".playerName-input");
    if (newPlayer.val().trim()) {
      preparePlayerInfo(newPlayer)
    } else {
      console.log("cannot be blank");
    }
  });

//========================== COLLECT NEW PLAYER DATA ===========================

  function preparePlayerInfo(newPlayer) {
    console.log("theLeague II: ", theLeague);

    newPlayerObj = {
      playerName: newPlayer.val().trim(),
      commander: 0,
      points: 0,
      LeagueId: theLeague.id
    };
    newPlayer.val("");
    addPlayer(newPlayerObj);
  };

//=========================== ADD PLAYER TO DATABASE ===========================

  function addPlayer(playersData) {
    $.post("/api/player", playersData).then(function(createdPlayerData) {
      console.log("New Player", createdPlayerData);
      renderPlayer(createdPlayerData);
    });
  };

//=============================== RENDER PLAYERS ===============================

  function renderPlayer(player) {
    console.log("playerData", player);
    var playerItem = $("<li class='player'>" + player.playerName + "</li>");
    $(".player-output").append(playerItem);
  };

//============================ CREATE LEAGUE BUTTON ============================

  $("#nameLeague").click(function(event) {
    event.preventDefault();
    nameLeague();
  });

//============================= USER'S LEAGUE NAME =============================

  function nameLeague() {
    var name = $(".leagueName-input");

    if (!name.val().trim()) {
      window.location.replace("/setup")
    } else {
      var nameOfLeague = {
        leagueName: name.val().trim(),
        id: theLeague.id
      }
      updateLeague(nameOfLeague);
    }
  };

//============================= UPDATE LEAGUE NAME =============================

  function updateLeague(nameOfLeague) {
    $.ajax({
      method: "PUT",
      url: "/api/league",
      data: nameOfLeague
    })
    .then(function() {
      storeLocal();
    });
  };

//======================== STORE COMMANDER DATA LOCALLY ========================

  function storeLocal() {
    $.get("/api/commander").then(function(results) {
      localStorage.setItem("mtgCommanders", JSON.stringify(results));
      window.location.replace("/setup");
    });
  };

//================================ BACKGROUND ==================================

  var images = ["mtg-portrait-blue2.jpg", "mtg-portrait-red2.jpg", "mtg-portrait-gold2.jpg", "mtg-portrait-purple2.jpg", "mtg-portrait-green2.jpg"];
  var screenSize = Math.floor((Math.random() * images.length) + 1);
  var background = images[screenSize];
  if (screen.height > screen.width) {
    $("body").css("background-image", "url(./images/backgrounds/" + background + ")");
  } else {
    $("body").css("background-image", "url(./images/backgrounds/mtg-landscape-wallpaper.jpg)");
  }

});
