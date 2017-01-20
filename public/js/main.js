let connection;
const $connectForm = $('#connect');
const $leave = $('#leave');
const $disconnect = $('#disconnect');
const $newGameForm = $('#new-game');
const $joinGameForm = $('#join-game');
const $activeGameForm = $('#active-game');
const $actions = $('#actions');
const $roomList = $('#rooms');
const $title = $('h1');
const $code = jQuery('<span/>', {id: 'game-code'});

function socketSetup() {
  connection.on('join::player', (room) => {
    joined(room);
    $('#player').removeClass('hide');
  });

  connection.on('join::owner', (room) => {
    joined(room);
    $('#owner').removeClass('hide');
  });

  connection.on('create', (room) => {
    $roomList.append(`<li>${room.name}</li>`);
  });

  connection.on('join::error', (message) => {
    $actions.append(`<li class="error">${message}</li>`);
  });

  connection.on('shuffled', (res) => {
    $actions.append(`<li>${res}</li>`);
  });
}

function connect(evt) {
  evt.preventDefault();
  let form = $(evt.target);
  connection = io();
  connection.emit('init', form.serializeObject());
  socketSetup();
  $connectForm.addClass('hide');
  $newGameForm.removeClass('hide');
  $joinGameForm.removeClass('hide');
}

function disconnect(evt) {
  evt.preventDefault();
  connection.close();
  $connectForm.removeClass('hide');
  $newGameForm.addClass('hide');
  $joinGameForm.addClass('hide');
  $activeGameForm.addClass('hide');
  $title.text('Card Games');
}

function createNewGame(evt) {
  evt.preventDefault();
  let form = $(evt.target);
  connection.emit('create', form.serializeObject());
}

function joinExistingGame(evt) {
  evt.preventDefault();
  let form = $(evt.target);
  connection.emit('join', form.serializeObject());
}

function leaveRoom(evt) {
  evt.preventDefault();
  connection.emit('leave');
}

function handlePlayerInput(evt) {
  evt.preventDefault();
  console.log(evt.target.id);
  // connection.emit('shuffle');
}

function joined(room) {
  $joinGameForm.hide();
  $newGameForm.hide();
  $code.text(`(${room.code})`);
  $title.html(`${room.name} `).append($code);
}

$connectForm.submit(connect);
$disconnect.click(disconnect);
$leave.click(leaveRoom);
$newGameForm.submit(createNewGame);
$joinGameForm.submit(joinExistingGame);
$activeGameForm.submit(handlePlayerInput);
