const connection = io();

$('#new-game').submit((evt) => {
  evt.preventDefault();
  console.log($(evt.target).serializeArray());
  $.get(`/validate?${$(evt.target).serialize()}`, (res) => {
    if (res.valid) {
      connection.emit('join', res.params);
    }
  });
});

$('#join-game').submit((evt) => {
  evt.preventDefault();
  connection.emit('join', $('#join-game input').val());
})

connection.on('joined', (room) => {
  $('#rooms').append(`<li>${room.name} (${room.code})</li>`);
})