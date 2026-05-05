
const socket = io();

function join(){
  socket.emit("join", name.value);
}

socket.on("question",(q)=>{
  question.innerText = q.q;
  answers.innerHTML = "";
  q.options.forEach(o=>{
    let b = document.createElement("button");
    b.innerText = o;
    b.onclick = ()=> socket.emit("answer", o);
    answers.appendChild(b);
  });
});

socket.on("players",(p)=>{
  players.innerHTML = "";
  Object.values(p).forEach(x=>{
    players.innerHTML += `<p>${x.name||"anon"} - ${x.score}</p>`;
  });
});
