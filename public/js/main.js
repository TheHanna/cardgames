const connection = io();
const $newGameForm = $('#new-game');
const $joinGameForm = $('#join-game');
const $activeGameForm = $('#active-game');
const $actions = $('#actions');
const $roomList = $('#rooms');
const $title = $('h1');
const $code = jQuery('<span/>', {id: 'game-code'});

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

$newGameForm.submit(createNewGame);
$joinGameForm.submit(joinExistingGame);
$activeGameForm.submit(handlePlayerInput);

// Listen for event from socket
connection.on('join::player', (room) => {
  joined(room);
  $('#player').removeClass('hide');
});

connection.on('join::owner', (room) => {
  joined(room);
  $('#owner').removeClass('hide');
});

connection.on('create', (room) => {
  $roomList.append(`<li>${room.name}</li>`)
});

connection.on('join::error', (message) => {
  $actions.append(`<li class="error">${message}</li>`);
});

connection.on('shuffled', (res) => {
  $actions.append(`<li>${res}</li>`);
});
