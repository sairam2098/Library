// JavaScript source code
function show() {
    document.getElementById('ListToDo').innerHTML = "";
    const url = 'http://localhost:3400/api/user';
    fetch(url)
        .then(resp => resp.json())
        .then((todosA) => {
            todosA.forEach((todo)=> {
                list = "<li>" + todo.text + "<button id = " + todo.id + " onclick =  deleteToDo(id) >X</button>" + "</li>";
                document.getElementById("ListToDo").innerHTML += list;
            })
        }).catch(function (error) {
            console.log(console.error);
        });
}

function getById(){
    var todoId = document.getElementById('ToDoId').value;
    const url = 'http://localhost:3400/api/user/' + todoId ;
    fetch(url)
        .then(resp => resp.json())
        .then((todo)=>{
            list = "<li>" + todo.text + "<button id = " + todoId + " onclick =  deleteToDo(id) >X</button>" + "</li>";
            document.getElementById("ListToDo").innerHTML = list;
        }).catch(function(error){
            console.log(console.error);
        });
}

function deleteToDo(i) {
    const url = 'http://localhost:3400/api/user/' + i ;
    fetch(url,{
        method : 'Delete'
     }).then((resp) => {
         if(resp.status === 200) {
             show();
         }
    });
}

function post(){
    var texttodo = document.getElementById('ToDoEvent').value;
    const data = { text: texttodo };
    fetch('http://localhost:3400/api/user', {
        method: 'POST', // or 'PUT'
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    }).then((resp) => {
        if(resp.status === 200) {
            show();
        }
   });
}

function update(){
    var todoId = document.getElementById('ToDoIdU').value;
    var texttodo = document.getElementById('ToDoEventU').value;
    const data = { text: texttodo };
    const url = 'http://localhost:3400/api/user/' + todoId;
    fetch(url,{
        method: 'Put',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    }).then((resp) => {
        if(resp.status === 200) {
            show();
        }
   });
}