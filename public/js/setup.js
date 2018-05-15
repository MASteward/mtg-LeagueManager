
$(document).ready(function() {

  var magicCommanders = JSON.parse(localStorage.getItem("mtgCommanders"));

  var leagueData = {};
  var pendingDelete;

  getLeague();

//==============================================================================
//                              GENERATE PAGE
//==============================================================================

//============================ GET LEAGUE DATA =================================

  function getLeague() {
    $.get("/api/league_info").then(function(leagueInfo) {
      leagueData = leagueInfo;
      getLeagueName(leagueData);
    });
  }

//============================== LEAGUE NAME ===================================

  function getLeagueName(data) {
    var league_name = data.leagueName;
    var playerData = data.Players;
    $(".brand-logo").text(league_name);
    $("#leagueName").text(league_name);

    $(".playerList").empty();
    pendingDelete = "";

    playersList(playerData);
  }

//======================= RESET & CREATE PLAYER LIST ==========================

  function playersList(playerInfo) {
    var playerArea = $(".playerList");

    $.each(playerInfo, function(index, player) {
      resetPlayerData(player);
      renderPlayer(player);
    });
  }

//=========================== RESET PLAYER DATA ================================

  function resetPlayerData(player) {
    var resetData = {
      "id": player.id,
      "checkedIn": false,
      "commander": 0
    }
    $.ajax({
      method: "PUT",
      url: "/api/player",
      data: resetData
    }).then(function() {
      console.log("done");
    })
  }

//==============================================================================
//                           PLAYER LIST CREATION
//==============================================================================


//============================= RENDER PLAYER ==================================

  function renderPlayer(player) {
    var newRow = $("<div class='row player-list-item'>");
    createCheckbox(newRow, player);
    listPlayer(newRow, player);
    commandersList(newRow, player);
    pointsCounter(newRow, player);
    deleteBtn(newRow, player);
    $(".playerList").append(newRow);
  };

//============================ DYNAMIC CHECKBOX ================================
  // creates checkbox used to decipher between who is playing and who is not.
  function createCheckbox(row, player) {
    var checkbox = $("<div class='col-1 input-group-prepend playerCheck div-checkbox'><input type='checkbox' class='input-checkbox playerCheck' data-id="+ player.id +"></div>");
    $(row).append(checkbox);
  }

//=========================== DYNAMIC PLAYERS NAME =============================
  // shows player's name within row of associated data
  function listPlayer(row, player) {
    var name = $("<div class='col-4 member player'><h4 class='name-of-player'>"+ player.playerName+ "</h4></div>");
    $(row).append(name);
  }

//======================== DYNAMIC COMMANDER SELECTOR ==========================
  // creates the option select for commander selection
  function commandersList(row) {
    var commContainer = $("<div class='col-4 commander'>");
    var selector = $("<select class='custom-select commander-names' name='selector'>");
    $.each(magicCommanders, function(index, leader) {
      selector.append("<option value="+ index +">"+ leader.name +"</option>");
    });
    $(commContainer).append(selector);
    $(row).append(commContainer);
  }

//========================= DYNAMIC POINTS COUNTER =============================
  // shows the player's points
  function pointsCounter(row, player) {
    var addPoint = $("<i class='ion-plus-circled'>");
    var minusPoint = $("<i class='ion-ios-minus-outline'>");
    var playerPoints = $("<div class='col-2 member-points'><h4 class='playerPoints points'>"+ player.points + "</h4></div>");
    $(row).append(playerPoints);
  }

//========================= DYNAMIC DELETE BUTTON ==============================
  // creates a button to delete player from league
  function deleteBtn(row, player) {
    var deleteDiv = $("<div class='col-1 deletePlayer'>");
    var deleteBtn = $("<button type='button' data-toggle='modal' data-target='#delete-modal' class='delete btn-circle' data-id="+ player.id +"><span class='ion-ios-trash trash-btn'></span></button>");
    deleteDiv.append(deleteBtn);
    row.append(deleteDiv);
  }

//==============================================================================
//                              ADD NEW PLAYER
//==============================================================================

//======================== CLICK-EVENT ADD PLAYER ==============================
  // when the add player button is clicked, grab data from input box and make sure it is not blank
  $("#addPlayer").click(function(event) {
    event.preventDefault();
    var newPlayer = $(".playerName-input");
    if (newPlayer.val().trim()) {
      if (newPlayer.hasClass("is-invalid")) {
        newPlayer.removeClass("is-invalid");
      }
      preparePlayerInfo(newPlayer)
    } else {
      newPlayer.addClass("is-invalid")
      console.log("cannot be blank");
    }
  });

//====================== PREP PLAYER ADDITION INFO =============================
  // organizes the data for a new player before being sent to be stored in database
  function preparePlayerInfo(newPlayer) {
    newPlayerObj = {
      playerName: newPlayer.val().trim(),
      commander: null,
      points: 0,
      LeagueId: leagueData.id
    };
    newPlayer.val("");
    leagueData.Players.push(newPlayerObj);
    addPlayer(newPlayerObj);
  };

//============================ ADD NEW PLAYER ==================================
  // add the new player to the database
  function addPlayer(playersData) {
    $.post("/api/player", playersData).then(function(newPlayerData) {
      renderPlayer(newPlayerData);
      checkAll();
    });
  };

//==============================================================================
//                            CHECKBOX EVENTS
//==============================================================================


//=========================== CHECKBOX CLICKED =================================
  // when a checkbox is clicked, check to see if they are all clicked...
  $(document).on("click", ".input-checkbox", function() {
    checkAll();
  })

//====================== CHECK-ALL CHECKBOCK CLICKED ===========================
  // when the check-all checkbox is clicked, toggle all to checked or unchecked
  $(document).on("click", "#playingGame", function() {
    $(".input-checkbox").prop("checked", $(this).prop("checked"));
  });

//=========================== CHECK-ALL CHECK ==================================
  // if all checkboxes are clicked, check the check-all checkbox.
  // if all are not checked, make sure the check-all checkbox is not checked
  function checkAll() {
    var allRows = leagueData.Players.length;
    var allChecked = $("#playingGame");
    var counter = 0;
    $(".input-checkbox").each(function() {
      if ($(this).prop("checked")) {
        counter++;
      }
    });

    if (counter !== allRows && allChecked.prop("checked", true)) {
      // console.log("not all checked");
      allChecked.prop("checked", false);
    } else if (counter == allRows && allChecked.prop("checked", false)) {
      // console.log("all checked");
      allChecked.prop("checked", true);
    }
  }

//============================== DELETE PLAYER =================================
  // when the delete player button is clicked, store player's id in the pendingDelete variable
  $(document).on("click", ".delete", function() {
    pendingDelete = $(this).data("id");
    console.log("DELETE", pendingDelete);
  });

//======================== VERIFY DELETE PLAYER MODAL ==========================
  // if the user chooses to delete player, delete from database
  $("#delete-modal").on("click", ".delete-player", function() {
    $.ajax({
      method: "DELETE",
      url: "/api/player/" + pendingDelete
    }).then(getLeague);
  });


//==============================================================================
//                            START AND PREP GAME
//==============================================================================

//========================= START GAME BUTTON CLICK ============================
  // when the user clicks the start game button...
  $(document).on("click", "#startGame",function(event) {
    event.preventDefault();
    whosePlaying();
  });

//============================= WHOSE PLAYING ==================================
  // collect all data from those checked as playing game and store in an object and add to an array
  function whosePlaying() {
    var gamePlayers = [];
    $(".input-checkbox").each(function() {
      if ($(this).prop("checked")) {
        var checkedPlayer = $(this).data("id");
        var theCommander = $(this).parent().siblings(".commander").children().val();
        var updatedPlayer = {
          "id": checkedPlayer,
          "checkedIn": true,
          "commander": theCommander
        };
        gamePlayers.push(updatedPlayer);
      }
    })
    var gameSize = gamePlayers.length;
    playerCount = gameSize;
    // verify that more than one person is playing
    if (gameSize <= 1) {
      $("#alert").removeClass("d-none");
      console.log("must be more than one");
      return;
    } else {
      console.log("more than 1", gameSize);
      getGamesAndTables(gameSize);
      // add gameSize to updatePlayers to keep count of updated players
      updatePlayerStatus(gamePlayers, gameSize);
    }
  };

//======================= STORE GAME AND TABLE AMOUNT ==========================
  // grab the total amount of games user wants to play and the amount of tables (based on player amount)
  // and store in local storage for next page to use
  function getGamesAndTables(gameSize) {
    var tableAmount = generateTables(gameSize);
    var gameCount = $("#gameSelect").val().trim();

    var gameData = {
      games: gameCount,
      tables: tableAmount,
      size: gameSize
    };
    localStorage.setItem("gameData", JSON.stringify(gameData));
  };

//========================== GENERATE TABLE AMOUNT =============================
  // based on the amount of players playing, determine how many tables are needed
  function generateTables(quantity) {
    if (quantity < 4) {
      tables = 1;
    } else {
      tables = Math.floor(quantity / 4);
      var overflow = quantity % 4;
      if (quantity < 11 && overflow == 2) {
        tables += 1;
      } else if (overflow > 2) {
        tables += 1;
      };
    };
    return tables;
  }

//============================== UPDATE PLAYERS ================================
  // update the player database of those who are playing in the games
  function updatePlayerStatus(activePlayers, gameSize) {
    $.each(activePlayers, function(index, player) {
      $.ajax({
        method: "PUT",
        url: "/api/player",
        data: player
      }).then(function() {
        if (index == (gameSize - 1)) {
          loadGame()
        }
      })
    });
  };

//================================ LOAD GAME ===================================
  // load the game page
  function loadGame() {
    window.location.replace("/game");
  }


//==============================================================================
//                             GENERATE BACKGROUND
//==============================================================================

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
