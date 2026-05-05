
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

let players = {};
let index = 0;

const questions = [
  { q: "2 + 2 = ?", a: "4", options: ["3","4","5","6"] },
  { q: "عاصمة مصر؟", a: "القاهرة", options: ["القاهرة","الجيزة","أسوان","سينا"] }
];

function sendQuestion(){
  if(index >= questions.length) return;
  io.emit("question", questions[index]);
}

io.on("connection",(socket)=>{
  players[socket.id] = {score:0};

  socket.on("join",(name)=>{
    players[socket.id].name = name;
    io.emit("players", players);
  });

  socket.on("answer",(ans)=>{
    let q = questions[index];
    if(q && ans === q.a){
      players[socket.id].score += 10;
    }
    index++;
    io.emit("players", players);
    sendQuestion();
  });

  socket.on("disconnect",()=>{
    delete players[socket.id];
    io.emit("players", players);
  });

  sendQuestion();
});

server.listen(process.env.PORT || 3000, ()=>console.log("running"));
