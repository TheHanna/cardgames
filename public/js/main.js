const connection = io();
const $newGameForm = $('#new-game');
const $joinGameForm = $('#join-game');
const $activeGameForm = $('#active-game');
const $actions = $('#actions');
const $roomList = $('#rooms');
const $title = $('h1');

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

function shuffleDeck(evt) {
  evt.preventDefault();
  connection.emit('shuffle');
}

$newGameForm.submit(createNewGame);
$joinGameForm.submit(joinExistingGame);
$activeGameForm.submit(shuffleDeck);

// Listen for event from socket
connection.on('joined', (room) => {
  $joinGameForm.hide();
  $newGameForm.hide();
  $activeGameForm.removeClass('hide');
  $title.text(room.name);
});

connection.on('shuffled', (res) => {
  $actions.append(`<li>${res}</li>`);
});