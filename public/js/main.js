let connection;
let code;
let user;
const $connectForm = $('#connect');
const $leave = $('.leave');
const $disconnect = $('.disconnect');
const $newRoomForm = $('#new-room');
const $joinRoomForm = $('#join-room');
const $activeGameForm = $('#active-game');
const $actions = $('#actions');
const $roomList = $('#rooms');
const $title = $('h1');
const $code = jQuery('<span/>', {id: 'game-code'});

function socketSetup() {
  connection.on('user::create', (id) => {
    console.log(id);
    user = id;
  });

  connection.on('user::disconnect', () => {
    connection.emit('user::disconnect', user);
  });

  connection.on('room::create', (room) => {
    $roomList.append(`<li>${room.name}</li>`);
  });

  connection.on('room::join', (room) => {
    joined(room);
  });

  connection.on('base::error', (message) => {
    $actions.append(`<li class="error">${message}</li>`);
  });

  connection.on('room::leave', (message) => {
    $actions.append(`<li class="error">${message}</li>`);
  });
}

function connect(evt) {
  evt.preventDefault();
  let form = $(evt.target);
  connection = io();
  connection.emit('user::create', form.serializeObject());
  socketSetup();
  $connectForm.addClass('hide');
  $newRoomForm.removeClass('hide');
  $joinRoomForm.removeClass('hide');
}

function disconnect(evt) {
  evt.preventDefault();
  connection.close();
  $connectForm.removeClass('hide');
  $newRoomForm.addClass('hide');
  $joinRoomForm.addClass('hide');
  $activeGameForm.addClass('hide');
  $title.text('Card Games');
}

function createNewRoom(evt) {
  evt.preventDefault();
  let params = $(evt.target).serializeObject();
  params.user = user;
  connection.emit('room::create', params);
}

function joinExistingRoom(evt) {
  evt.preventDefault();
  let params = $(evt.target).serializeObject();
  params.user = user;
  connection.emit('room::join', params);
}

function leaveRoom(evt) {
  evt.preventDefault();
  let params = { code: code, user: user };
  connection.emit('room::leave', params);
}

// function handlePlayerInput(evt) {
//   evt.preventDefault();
//   console.log(evt.target.id);
//   connection.emit('shuffle');
// }

function joined(room) {
  $joinRoomForm.hide();
  $newRoomForm.hide();
  if (room.role === 'member') $('#player').removeClass('hide');
  if (room.role === 'owner') $('#owner').removeClass('hide');
  code = room.code;
  $code.text(`(${room.code})`);
  $title.html(`${room.name} `).append($code);
}

$connectForm.submit(connect);
$disconnect.click(disconnect);
$leave.click(leaveRoom);
$newRoomForm.submit(createNewRoom);
$joinRoomForm.submit(joinExistingRoom);
// $activeGameForm.submit(handlePlayerInput);
