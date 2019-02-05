
var gameData = JSON.parse(localStorage.getItem("gameData"));
var magicCommanders = JSON.parse(localStorage.getItem("mtgCommanders"));

console.log("gameNumber", gameData);

$(document).ready(function() {
  var leagueData = {};
  var players = [];
  var supplementalCards = [];
  var table_amount = gameData.tables;
  var game_amount = gameData.games;
  var gameOver = false;
  var playerRows = [];

//===============================================================
                    /* DATABASE RETRIEVAL */
//===============================================================

//=================== GET SUPPLEMENTAL CARDS ====================

  $.get("api/supplemental").then(function(cards) {
    supplementalCards = shuffle(cards);
    createSupCards(supplementalCards);
  });

//==================== GET CHECKED PLAYERS =======================

  $.get("api/gamers_info/").then(function(data) {
    leagueData = data;
    var players = data.Players;
    createTables(table_amount);
    shuffleAndAssign(players);
  });

// ===============================================================
//                          GAME SETUP
//================================================================

// ====================== NEXT GAME CLICK ========================

  $(document).on("click", "#mtg-modal-btn", function() {
    console.log("playerEnd", players);
  })

//======================= START GAME (SETUP) ========================
  // created another function to start next game so card array wouldn't be reshuffled and same cards appear.

  function startGame(players) {
    createTables(table_amount);
    shuffleAndAssign(players);
    createSupCards(supplementalCards)
  }

//=========================== SHUFFLE AN ASSIGN ================================

  function shuffleAndAssign(players) {
    var shuffledPlayers = shuffle(players);
    assignTables(table_amount, shuffledPlayers);
  }

//========================= SHUFFLE PLAYER ARRAY ===============================

  function shuffle(array) {
    // temporaryValue and randomIndex are undefined values.
    var currentIndex = array.length, temporaryValue, randomIndex;

    /*
      While there remain elements to shuffle, pick a remaining element (randomIndex) and swap it with the current element by storing the array value = to the current index in temporaryValue.

      Replace the array value at the index = currentIndex with the array value at the randomIndex.

      Replace the array value at the randomIndex w/ the array pre-replaced value that was at the current index
    */

    while (0 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    return array;
  };

//============================== ASSIGN TABLES =================================

  function assignTables(tables, playerArray) {
    var counter = 1
    var forPlayer = true;
    $.each(playerArray, function(index, player) {
      var id = player.commander;
      var card = createCard(forPlayer);
      var cardImage = createImage(card, magicCommanders[id], forPlayer);
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
    var gameSet = game_amount * 5;
    console.log("gameSet", gameSet);
    console.log("gameDeck", gameDeck);

    for (var i = gameSet - 5; i < gameSet; i++) {
      var cardData = gameDeck[i];
      var card = createCard();
      var cardImage = createImage(card, cardData);
      $(".supp-cards").append(card);
    }
  }

//====================== CREATE PLAYER CARD =====================

  function createCard(forPlayer) {
    if (forPlayer) {
      return $("<div class='col user commanderCard card w3-hover-shadow' data-toggle='modal' data-target='#mtgModal'>");
    } else {
      return $("<div class='col user suppCard card w3-hover-shadow' data-toggle='modal' data-target='#mtgModal'>");
    }
  }

//=========================== CREATE COMMANDER IMAGE ===========================

  function createImage(card, cardData, forPlayer) {
    // Differentiate between supplemental cards and player cards (for CSS styling)
    if (forPlayer) {
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
    // Determine whether the tables are for the modal or the game page

    // If modal is true, it is for the modal
    for (var i = 1; i <= tables; i++) {
      if (modal) {
        var row = $("<section class='modal__table'>");
        var table_number = $("<div class='row modal__title'><h3 class='secondary-title'> Table " + [i] + "</h3></div>");
        var tableContent= $("<div class='modal__table-players' data-modal-table="+[i]+">");
        row.append(table_number);
        row.append(tableContent);
        // row.append(tableInfo);
        $(".table-content").append(row);
      } else {

        // IF IT IS FOR THE GAME PAGE...
        var table_section = $("<section class='table'>");
        var table_number = $("<div class='row title-row'><h3 class='table-title tertiary-title'> Table " + [i] + "</h3></div>");
        var card_container = $("<div class='row table__cards-container' data-table="+[i]+">");
        table_section.append(table_number);
        table_section.append(card_container);
        $(".tables_section").append(table_section);
      }
    };
  }

  //==============================================================
  //                          GAME MODAL
  //==============================================================

  // If a card is clicked on
  $(document).on("click", ".card-img-top", function() {
    console.log("Image Clicked");
    $(".top-close").css("display", "block");
    var image_url = $(this).attr("src");
    var card_name = $(this).attr("alt");

    modalCard(image_url, card_name);
  });

  function modalCard(image, name) {
    var card_image = $("<div class='modal-card-image'><img src=" + image + " alt=" + name + "></div>");
    clearModal();
    $("#title").text(name);
    $(".table-content").append(card_image);
    $(".modal_footer").css("visibility", "hidden");
    $("#mtgModal").css("display", "block");
  };

  function clearModal() {
    $("#title").empty();
    $(".table-content").empty();
    $(".modal_footer").css("visibility", "visible");
  }

  function clearBoard() {
    $(".supp-cards").empty();
    $(".tables_section").empty();
  }

  $(document).on("click", ".close", function(){
    $("#mtgModal").css("display", "none");
    clearModal();
  })


  $(document).on("click", ".end-game", function() {
    console.log("MTG Modal Btn");
    clearBoard();
    game_amount--
    forModal = true;
    $(".top-close").css("display", "none");

    if (game_amount == 0) {
      gameOver = true;
      $("#modal-close").text("Finished");
    } else {
      $("#modal-close").text("Next Game")
    }
    createTables(table_amount, forModal);
    organizeAndDisplay();
    console.log("playerEnd", players);
  });

// ====================== PLAYERS MODAL ========================
  function players_modal(table_data) {
    for (var i = 1; i <= tables; i++) {
      var row = $("<section class='modal__table'>");
      var table_number = $("<div class='row modal__title'><h3 class='secondary-title'> Table " + [i] + "</h3></div>");
      var tableContent= $("<div class='modal__table-players' data-modal-table="+[i]+">");
      row.append(table_number);
      row.append(tableContent);
      $(".table-content").append(row);
    }
  }


//===================== ORGANIZE AND DISPLAY =====================

  function organizeAndDisplay() {
    playerRows = [];
    $.each(players, function(index, player) {
      var player_data = $("<div class='row modal__player-data'>");
      listPlayer(player_data, player);
      commandersList(player_data, player, index);
      pointsCounter(player_data, player, index);
      playerRows.push(player_data)
      $("div[data-modal-table="+player.assignedTable+"]").append(player_data);
    });
    $("#mtgModal").css("display", "block");
    console.log("playerRows", playerRows);
  };


//===================== MODAL PLAYER NAMES =====================

  function listPlayer(row, player) {
    var name = $("<h4 class='modal_col modal__player'>"+ player.playerName + "</h4>");
    row.append(name);
  }

// ================= MODAL COMMANDER SELECTOR ====================

  function commandersList(row, player, id) {
    var commContainer = $("<div class='modal_col modal__commander'>");
    var currentCommander = player.commander;
    var selector = $("<select class=' modal__commander-select' data-commander="+ id +" name='selector'>");
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

//======================= MODAL POINTS ==========================

  function pointsCounter(row, player, index) {
    var addition = $("<button type='button' class='btn btn-circle add-point' data-id="+ index +"><span class='ion-plus-circled'></span></button>");
    var minusPoint = $("<button type='button' class='btn btn-circle minus-point'><span class='ion-ios-minus-outline'></span></button");
    var points = $("<h4 class='playerPoints points' data-id="+ index +" value="+ player.points +">"+ player.points +"</h4>");
    var pointsRow = $("<div class='row pointsRow'></div>");
    var playerPoints = $("<div class='modal_col modal__points'></div>");
    pointsRow.append(minusPoint);
    pointsRow.append(points);
    pointsRow.append(addition);
    playerPoints.append(pointsRow);
    row.append(playerPoints);
  }

//========================= ADD POINTS ===========================

  $(document).on("click", ".add-point", function() {
    var adding = true;
    var playerId = $(this).siblings("h4").data("id");
    updatePoints(playerId, adding);
    $("h4[data-id="+ playerId +"]").html(players[playerId].points);
  });

//======================= SUBTRACT POINTS ========================

  $(document).on("click", ".minus-point", function() {
    var playerId = $(this).siblings("h4").data("id");
    updatePoints(playerId);
    $("h4[data-id="+ playerId +"]").html(players[playerId].points);
  })

//==================== UPDATE MODAL POINTS =======================

  function updatePoints(id, add) {
    if (add) {
      var player = players[id].points++;
    } else {
      var player = players[id].points--;
    }
    return player;
  }

  $(document).on("click", "#modal-close", function() {
    console.log("MODAL CLOSED");
    var nextGameArray = [];
    var playerCount = players.length;
    $.each(players, function(index, player) {
      console.log("PLAYER NAME", player.playerName);
      var theCommander = playerRows[index].find(".modal__commander-select").val();
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

  function loadGame() {
    clearBoard();
    startGame(players);
  }


 //================================ BACKGROUND =================================

  var images = ["mtg-portrait-blue3.jpg", "mtg-portrait-red3.jpg", "mtg-portrait-gold3.jpg", "mtg-portrait-purple3.jpg", "mtg-portrait-green3.jpg"];
  var screenSize = Math.floor((Math.random() * images.length));
  var background = images[screenSize];
  if (screen.height > screen.width) {
    // console.log("portrait");
    $("body").css("background-image", "url(./images/backgrounds/" + background + ")");
  } else {
    // console.log("landscape");
    $("body").css("background-image", "url(./images/backgrounds/mtg-landscape-wallpaper2.jpg)");
  }

});
