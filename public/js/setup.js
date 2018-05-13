// var leagueData = JSON.parse(localStorage.getItem("data"));
var magicCommanders = JSON.parse(localStorage.getItem("mtgCommanders"));
console.log("Commanders", magicCommanders);

$(document).ready(function() {
  var count = 1;
  var leagueData = {};
  var playerCount = 0;
  var pendingDelete;

  getLeague();
//==============================================================================
//                                  PAGE LAYOUT
//==============================================================================
  function getLeague() {
    $.get("/api/league_info").then(function(data) {
        leagueData = data;
        getLeagueName(data);
    });
  }

//============================== LEAGUE NAME ===================================

  function getLeagueName(data) {
    nameOfLeague = data.leagueName;
    $(".brand-logo").text(nameOfLeague);
    $("#leagueName").text(nameOfLeague);
    var playerData = leagueData.Players;
    $(".playerList").empty();
    pendingDelete = "";

    playersList(playerData);
  }

//======================= RESET & CREATE PLAYERS LIST ==========================

  function playersList(playerInfo) {
    console.log("pendingDelete", pendingDelete);
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


//============================= RENDER PLAYER ==================================

  function renderPlayer(player) {
    var newRow = $("<div class='row player-list-item'>");
    createCheckbox(newRow, player);
    listPlayer(newRow, player);
    // added player to commandersList to see about drop down, check adding new player in setup;
    commandersList(newRow, player);
    pointsCounter(newRow, player);
    deleteBtn(newRow, player);
    $(".playerList").append(newRow);
    count++;
  };

//============================ DYNAMIC CHECKBOX ================================

  function createCheckbox(row, player) {
    var checkbox = $("<div class='col-1 input-group-prepend playerCheck div-checkbox'><input type='checkbox' class='input-checkbox playerCheck' data-id="+ player.id +"></div>");
    $(row).append(checkbox);
  }

//=========================== DYNAMIC PLAYERS NAME =============================

  function listPlayer(row, player) {
    var name = $("<div class='col-4 member player'><h4 class='name-of-player'>"+ player.playerName+ "</h4></div>");
    $(row).append(name);
  }

//======================== DYNAMIC COMMANDER SELECTOR ==========================

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

  function pointsCounter(row, player) {
    var addPoint = $("<i class='ion-plus-circled'>");
    var minusPoint = $("<i class='ion-ios-minus-outline'>");
    var playerPoints = $("<div class='col-2 member-points'><h4 class='playerPoints points'>"+ player.points + "</h4></div>");
    $(row).append(playerPoints);
  }

  function deleteBtn(row, player) {
    var deleteDiv = $("<div class='col-1 deletePlayer'>");
    var deleteBtn = $("<button type='button' data-toggle='modal' data-target='#delete-modal' class='delete btn-circle' data-id="+ player.id +"><span class='ion-ios-trash trash-btn'></span></button>");
    deleteDiv.append(deleteBtn);
    row.append(deleteDiv);
  }

//======================== CLICK-EVENT ADD PLAYER ==============================

  $("#addPlayer").click(function(event) {
    event.preventDefault();
    var newPlayer = $(".playerName-input");
    if (newPlayer.val().trim()) {
      preparePlayerInfo(newPlayer)
    } else {
      console.log("cannot be blank");
    }
  });

//====================== PREP PLAYER ADDITION INFO =============================

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

  // ==================== ADDING PLAYER TO DATABASE ============================

  function addPlayer(playersData) {
    $.post("/api/player", playersData).then(function(newPlayerData) {
      renderPlayer(newPlayerData);
      checkAll();
    });
  };

  // =================== CHECKBOX CLICK EVENTS ==================

  // ================== CHECKBOX IS CLICKED =====================

  $(document).on("click", ".input-checkbox", function() {
    checkAll();
  })

  // ================= CHECK ALL BOX IS CLICKED =================

  $(document).on("click", "#playingGame", function() {
    $(".input-checkbox").prop("checked", $(this).prop("checked"));
  });

   // =========== EVAL CHECKALL & COMPARE CHECKBOXES ============

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

  // ================ START GAME BUTTON CLICKED =================

  $(document).on("click", "#startGame",function(event) {
    event.preventDefault();
    whosePlaying();
  });

    // ============= GET ALL DATA FROM ROWS CHECKED =============

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
    if (gameSize <= 1) {
      console.log("must be more than one");
      return;
    } else {
      console.log("more than 1", gameSize);
      getGamesAndTables(gameSize);
      // add gameSize to updatePlayers to keep count of updated players
      updatePlayerStatus(gamePlayers, gameSize);
    }
  };

  // ================== GET GAMES AND TABLES ====================

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

  // ==================== GENERATE TABLES ======================

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

  // =========== UPDATE DATABASE W/ PLAYERS PLAYING =============

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

  function loadGame() {
    window.location.replace("/game");
  }

  $(document).on("click", ".delete", function() {
    pendingDelete = $(this).data("id");
    console.log("DELETE", pendingDelete);
  });

  $("#delete-modal").on("click", ".delete-player", function() {
    $.ajax({
      method: "DELETE",
      url: "/api/player/" + pendingDelete
    }).then(getLeague);
  });


});
