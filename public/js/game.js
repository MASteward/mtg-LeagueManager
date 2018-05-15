
var gameData = JSON.parse(localStorage.getItem("gameData"));
var magicCommanders = JSON.parse(localStorage.getItem("mtgCommanders"));

console.log("gameNumber", gameData);

$(document).ready(function() {
  var leagueData = {};
  var players = [];
  var supplementalCards = [];
  var tableAmount = gameData.tables;
  var gameCount = gameData.games;
  var gameOver = false;
  var playerRows = [];

//==============================================================================
//                            DATABASE RETRIEVAL
//==============================================================================

//========================= GET SUPPLEMENTAL CARDS =============================

  $.get("api/supplemental").then(function(cards) {
    supplementalCards = shuffle(cards);
    createSupCards(supplementalCards);
  });

//=========================== GET CHECKED PLAYERS ==============================

  $.get("api/gamers_info/").then(function(data) {
    leagueData = data;
    var players = data.Players;
    createTables(tableAmount);
    shuffleAndAssign(players);
  });

//==============================================================================
//                                GAME SETUP
//==============================================================================

//============================ NEXT GAME CLICK =================================

  $(document).on("click", "#mtg-modal-btn", function() {
    console.log("playerEnd", players);
  })

//========================== START GAME (SETUP) ================================
  // created another function to start next game so card array wouldn't be reshuffled and same cards appear.
  function startGame(players) {
    createTables(tableAmount);
    shuffleAndAssign(players);
    createSupCards(supplementalCards)
  }

//=========================== SHUFFLE AN ASSIGN ================================

  function shuffleAndAssign(players) {
    var shuffledPlayers = shuffle(players);
    assignTables(tableAmount, shuffledPlayers);
  }

//========================= SHUFFLE PLAYER ARRAY ===============================

  function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    return array;
  };

//============================== ASSIGN TABLES =================================

  function assignTables(tables, playerArray) {
    var counter = 1
    var playerCard = true;
    $.each(playerArray, function(index, player) {
      var id = player.commander;
      var card = createCard(playerCard);
      var cardImage = createImage(card, magicCommanders[id], playerCard);
      var cardBody = createBody(card, player);
      $("div[data-table="+counter+"]").append(cardBody);
      playerArray[index].assignedTable = counter;
      counter ++;
      if (counter > tables) {
        counter = 1;
      };
    });
    players = playerArray;
  }

//======================== CREATE SUPPLEMENTAL CARDS ===========================

  function createSupCards(gameDeck) {
    var gameSet = gameCount * 5;
    console.log("gameSet", gameSet);
    console.log("gameDeck", gameDeck);

    for (var i = gameSet - 5; i < gameSet; i++) {
      var cardData = gameDeck[i];
      var card = createCard();
      var cardImage = createImage(card, cardData);
      $(".supp-cards").append(card);
    }
  }

//============================ CREATE PLAYER CARD ==============================

  function createCard(playerCard) {
    if (playerCard) {
      return $("<div class='col user commanderCard card w3-hover-shadow' data-toggle='modal' data-target='#mtgModal'>");
    } else {
      return $("<div class='col user suppCard card w3-hover-shadow' data-toggle='modal' data-target='#mtgModal'>");
    }
  }

//=========================== CREATE COMMANDER IMAGE ===========================

  function createImage(card, cardData, playerCard) {
    // SEPARATE CLASSIFICATION OF SUPPLEMENTAL CARDS AND PLAYER CARDS (for CSS styling)
    if (playerCard) {
      var picture = $("<img class='card-img-top userCard' src=" + cardData.source + " alt=" + cardData.name + ">");
    } else {
      console.log("suppCard2");
      var picture = $("<img class='card-img-top supp-img' src=" + cardData.source + " alt='" + cardData.name + "'>");
    }
    card.append(picture);
    return card;
  }

//============================= CREATE CARD BODY ===============================

  function createBody(card, cardData) {
    var body = $("<div class='card-body userName w3-black'>"+ cardData.playerName +"</div>");
    card.append(body);
    return card;
  }

//============================ CREATE CARD TABLES ==============================

  function createTables(tables, modal) {
    // DETERMINE WHETHER THE TABLES ARE FOR THE MODAL OR GAME PAGE
    // IF MODAL IS TRUE, IT IS FOR THE MODAL
    for (var i = 1; i <= tables; i++) {
      if (modal) {
        var titleRow = $("<div class='row modalRow'>");
        var tableNumber = $("<div class='col-12 title-container'><h3 class='modal-table-title'> Table " + [i] + "</h3></div>");
        var tableInfo = $("<div class='row cardDeck'>");
        var tableContent= $("<div class='col-12 modal-deck' data-modal-table="+[i]+">");
        titleRow.append(tableNumber);
        tableInfo.append(tableContent);
        titleRow.append(tableInfo);
        $(".table-content").append(titleRow);
      } else {
        // IF IT IS FOR THE GAME PAGE...
        var titleRow = $("<div class='row title-row'>");
        var tableNumber = $("<div class='col-12 table-title-container'><h3 class='table-title'> Table " + [i] + "</h3></div>");
        var tableInfo = $("<div class='row card-deck-row'>");
        var tableContent = $("<div class='col-12 card-deck' data-table="+[i]+">");
        titleRow.append(tableNumber);
        tableInfo.append(tableContent);
        titleRow.append(tableInfo);
        $(".tableSection").append(titleRow);
      }
    };
  }

//================================ GAME MODAL ==================================

  $(document).on("click", ".card-img-top", function() {
    var displayCard = $(this).attr("src");
    var cardName = $(this).attr("alt");
    modalCard(displayCard, cardName);
  });

//============================ CREATE MODAL CARD ===============================

  function modalCard(card, name) {
    var cardImage = $("<div class='modal-card-image'><img src=" + card + " alt=" + name + "></div>");
    clearModal();
    $("#title").text(name);
    $(".table-content").append(cardImage);
    $(".modal-footer").css("visibility", "hidden");
  };

//=============================== CLEAR MODAL ==================================

  function clearModal() {
    $("#title").empty();
    $(".table-content").empty();
    $(".modal-footer").css("visibility", "visible");
  }

//============================= CLEAR GAME PAGE ================================

  function clearBoard() {
    $(".supp-cards").empty();
    $(".tableSection").empty();
  }

  $(document).on("click", ".close", function(){
    clearModal();
  })


  $(document).on("click", "#mtg-modal-btn", function() {
    gameCount--
    modalInfo = true;

    if (gameCount == 0) {
      gameOver = true;
      $("#modal-close").text("Finished");
    } else {
      $("#modal-close").text("Next Game")
    }
    createTables(tableAmount, modalInfo)
    organizeAndDisplay()
    console.log("playerEnd", players);
  });

//========================== ORGANIZE AND DISPLAY ==============================

  function organizeAndDisplay() {
    playerRows = [];
    $.each(players, function(index, player) {
      var newRow = $("<div class='row player-list-item'>");
      listPlayer(newRow, player);
      commandersList(newRow, player, index);
      pointsCounter(newRow, player, index);
      playerRows.push(newRow)
      $("div[data-modal-table="+player.assignedTable+"]").append(newRow);
    })
    console.log("playerRows", playerRows);
  };


//=========================== MODAL PLAYER NAMES ===============================

  function listPlayer(row, player) {
    // console.log("listPlayer", player);
    var name = $("<div class='col-4 member player'><h4 class='name-of-player'>"+ player.playerName+ "</h4></div>");
    row.append(name);
  }

// ======================= MODAL COMMANDER SELECTOR ============================

  function commandersList(row, player, id) {
    var commContainer = $("<div class='col-5 commander'>");
    var currentCommander = player.commander;
    var selector = $("<select class='custom-select commander-names' data-commander="+ id +" name='selector'>");
    $.each(magicCommanders, function(index, leader) {
      if (index == 0) {
        selector.append("<option class='option' value="+ currentCommander +">"+ magicCommanders[currentCommander].name +"</option>");
      } else if (index == currentCommander) {
        selector.append("<option class='option' value=0>Freya</option>");
      } else {
        selector.append("<option class='option' value="+ index +">"+ leader.name +"</option>");
      }
    });
    commContainer.append(selector);
    row.append(commContainer);
  }

//============================== MODAL POINTS ==================================

  function pointsCounter(row, player, index) {
    var addition = $("<button type='button' class='btn btn-circle add-point' data-id="+ index +"><span class='ion-plus-circled'></span></button>");
    var minusPoint = $("<button type='button' class='btn btn-circle minus-point'><span class='ion-ios-minus-outline'></span></button");
    var points = $("<h4 class='playerPoints points' data-id="+ index +" value="+ player.points +">"+ player.points +"</h4>");
    var pointsRow = $("<div class='row pointsRow'></div>");
    var playerPoints = $("<div class='col-3 member-points'></div>");
    pointsRow.append(minusPoint);
    pointsRow.append(points);
    pointsRow.append(addition);
    playerPoints.append(pointsRow);
    row.append(playerPoints);
  }

//============================== ADD POINTS ====================================

  $(document).on("click", ".add-point", function() {
    var adding = true;
    var playerId = $(this).siblings("h4").data("id");
    updatePoints(playerId, adding);
    $("h4[data-id="+ playerId +"]").html(players[playerId].points);
  });

//=========================== SUBTRACT POINTS ==================================

  $(document).on("click", ".minus-point", function() {
    var playerId = $(this).siblings("h4").data("id");
    updatePoints(playerId);
    $("h4[data-id="+ playerId +"]").html(players[playerId].points);
  })

//========================= UPDATE MODAL POINTS ================================

  function updatePoints(id, add) {
    if (add) {
      var player = players[id].points++;
    } else {
      var player = players[id].points--;
    }
    return player;
  }

  $(document).on("click", "#modal-close", function() {
    var nextGameArray = [];
    var playerCount = players.length;
    $.each(players, function(index, player) {
      var theCommander = playerRows[index].find(".commander-names").val();
      console.log("theCommander", theCommander);
      var currentData = {
        "id": player.id,
        "playerName": player.playerName,
        "commander": theCommander,
        "points": player.points
      }
      nextGameArray.push(currentData);
      console.log("PLAYERDATA", currentData);
    });
    players = nextGameArray;
    updateGameData(nextGameArray, playerCount);
  });

//========================== UPDATE PLAYERS INFO ===============================

  function updateGameData(updatedData, playerCount) {
    $.each(updatedData, function(index, player) {
      $.ajax({
        method: "PUT",
        url: "/api/player",
        data: player
      }).then(function() {
        if (index == (playerCount - 1)) {
          if (gameOver) {
            window.location.replace("/setup");
          } else {
            loadGame();
          }
        }
      })
    });
  };

//============================== START NEXT GAME ===============================

  function loadGame() {
    clearBoard();
    startGame(players);
  }


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
