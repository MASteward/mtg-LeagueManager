
$(document).ready(function() {
  var mockNameArray = ["League With No Name", "A League of Their Own", "Major League", "The League of Extraordinary Gentlemen", "Justice League", "Little Big League", "Out of Your League"];
  var commonName = mockNameArray[Math.floor(Math.random() * mockNameArray.length)];

  var theLeague;
  var thePlayers;

  $("#addPlayer").click(function(event) {
    event.preventDefault();
    var newPlayer = $(".playerName-input");
    if (newPlayer.val().trim()) {
      preparePlayerInfo(newPlayer)
    } else {
      console.log("cannot be blank");
    }
  });

  $("#nameLeague").click(function(event) {
    event.preventDefault();
    var name = $("#league_name");
    updateLeague(name);
  });

// =================== INITIALIZE USER DATA ====================

  // This function grabs the logged-in user's data for the league creation to be connected to
  function initializeUserData() {
    $.get("/api/user_data").then(function(data) {
      console.log("User Data: ", data);
      var name = commonName;
      if (name) {
        generateName(data, name);
      } else {
        name = commonName;
        generateName(data, name);
      }
    });
  };


// ===================== INITIALIZE LEAGUE =====================

  function initializeLeague(leagueData) {
    $.post("/api/league", leagueData).then(function(leagueInfo) {
      theLeague = leagueInfo;
      console.log("leagueInfo", leagueInfo);
      console.log("theLeague I:", theLeague);
    });
  };

// ===================== NAME GENERATOR =====================

  function generateName(userInfo, name) {
    console.log("commonName", name);
    var fauxLeague = {
      leagueName: name,
      UserId: userInfo.id
    };
    initializeLeague(fauxLeague);
  };

// ===================== COLLECT AND PREP NEW PLAYER INFO =====================

  function preparePlayerInfo(newPlayer) {
    // var newPlayer = $(".playerName-input");
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

// ================ ADD NEW PLAYER TO DATABASE =================

  function addPlayer(playersData) {
    $.post("/api/player", playersData).then(function(createdPlayerData) {
      console.log("New Player", createdPlayerData);
      renderPlayer(createdPlayerData);
    });
  };

// ===================== RENDER PLAYER =====================

  function renderPlayer(player) {
    console.log("playerData", player);
    var playerItem = $("<li class='player'>" + player.playerName + "</li>");
    $(".player-output").append(playerItem);
  };

// ===================== UPDATE LEAGUE NAME =====================

  // function updateLeague(e) {
  function updateLeague(name) {

    // var name = $(".leagueName-input");
    // e.preventDefault();

    if (!name.val().trim()) {
      window.location.replace("/setup")
    } else {
      var nameOfLeague = {
        leagueName: name.val().trim(),
        id: theLeague.id
      }
      $.ajax({
        method: "PUT",
        url: "/api/league",
        data: nameOfLeague
      })
      .then(function() {
        storeLocal();
        // window.location.replace("/setup");
      });
    }
  };

// ================ STORE LEAGUE AND COMMANDER DATA LOCALLY ================

  function storeLocal() {
    $.get("/api/commander").then(function(results) {
      localStorage.setItem("mtgCommanders", JSON.stringify(results));
      $.get("/api/league_data").then(function(data) {
        localStorage.setItem("data", JSON.stringify(data));
        window.location.replace("/setup");
      });
    });
  };

  // ===================== INITIALIZE START OF JAVASCRIPT =====================

  initializeUserData();

});
