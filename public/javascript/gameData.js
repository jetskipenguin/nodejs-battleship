function room(peopleCount, roomId) 
{
    this.peopleCount = peopleCount;
    this.roomId = roomId;
}

rooms = [];

function idGen(yourNumber){
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  
    for (var i = 0; i < yourNumber; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
  
   return text;
}

module.exports = {room, rooms, idGen}