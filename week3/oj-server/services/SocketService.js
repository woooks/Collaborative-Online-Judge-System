var redisClient = require('../modules/redisClient');
const TIMEOUT_IN_SECONDS = 3600;

module.exports = function(io) {

  var collaborations = {};
  var socketIdToSessionId = {};

  var sessionPath = "/temp_sessions";

  io.on('connection', (socket) => {
    console.log('socket ID: ' + socket.id + ' connected');
    let sessionId = socket.handshake.query['sessionId'];

    socketIdToSessionId[socket.id] = sessionId;
    console.log("collaborations" + collaborations);
    if (sessionId in collaborations) {
      collaborations[sessionId]['participants'].push(socket.id);
    } else {
      redisClient.get(sessionPath + '/' + sessionId, function(data) {
        if (data) {
          console.log("session terminated previously: pulling back from Redis.");
          collaborations[sessionId] = {
            'cachedChangeEvents': JSON.parse(data),
            'participants': []
          };
        } else {
          console.log("creating new session");
          collaborations[sessionId] = {
            'cachedChangeEvents': [],
            'participants': []
          };
        }
        collaborations[sessionId]['participants'].push(socket.id);
        console.log("collaborations[sessionId]['participants']: " + collaborations[sessionId]['participants']);

      });
    }

    socket.on('change', delta => {
      let sessionId = socketIdToSessionId[socket.id];
      if (sessionId in collaborations) {
        collaborations[sessionId]['cachedChangeEvents'].push(["change", delta, Date.now()]);
      }
      fowardEvents(socket.id, 'change', delta);
    });

    // Handle Cursor move
    socket.on('cursorMove', cursor => {
      cursor = JSON.parse(cursor);
      cursor['socketId'] = socket.id;
      fowardEvents(socket.id, 'cursorMove', JSON.stringify(cursor));
    });

    socket.on('restoreBuffer', () => {
      let sessionId = socketIdToSessionId[socket.id];
      console.log('restoring buffer for session: ' + sessionId + ' socket: ' + socket.id);
      console.log("collaborations[sessionId]['participants']: " + collaborations[sessionId]['participants']);
      if (sessionId in collaborations) {
        console.log('sessionId in collaborations')
        let changeEvents = collaborations[sessionId]['cachedChangeEvents'];
        for (let i = 0; i < changeEvents.length; i++) {
          socket.emit(changeEvents[i][0], changeEvents[i][1]);
        }
      }
    });

    socket.on('disconnect', function() {
      let sessionId = socketIdToSessionId[socket.id];
      console.log('socket ' + socket.id + ' disconnect');
      if (sessionId in collaborations) {
        console.log(sessionId);
        let participants = collaborations[sessionId]['participants'];
        let index = participants.indexOf(socket.id);
        console.log('index:' + index);
        if (index >= 0) {
          participants.splice(index, 1);
          if (participants.length == 0) {
            console.log("last participant left. Storing in redis.");
            let key = `${sessionPath}/${sessionId}`;
            let value = JSON.stringify(collaborations[sessionId]['cachedChangeEvents']);
            redisClient.set(key, value, redisClient.redisPrint);
            redisClient.expire(key, TIMEOUT_IN_SECONDS);
            delete collaborations[sessionId];
          }
        }
      }

    });

    function fowardEvents(socketId, eventName, dataString) {
      console.log(eventName + " " + socketIdToSessionId[socketId] + " " + dataString);
      let sessionId = socketIdToSessionId[socketId];
      if (sessionId in collaborations) {
        let participants = collaborations[sessionId]["participants"];
        for (let i = 0; i < participants.length; i++) {
          if (socketId != participants[i]) {
            io.to(participants[i]).emit(eventName, dataString);
          }
        }
      } else {
        console.log("WARNING: could not tie socket_id to any collaboration");
      }
    }

  });
}
