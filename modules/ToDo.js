// JavaScript source code

function getById(){
    var todoId = document.getElementById('ToDoId').value;
    const url = 'http://localhost:3400/api/user/' + todoId ;
    fetch(url)
        .then(resp => resp.json())
        .then((todosA)=>{
            let list = "<table><tr><th>ISBN</th><th>TITLE</th><th>NAME</th></tr>"
            todosA.forEach((todo)=> {
                list = list + "<tr><td>" + todo.Isbn + "</td>" + "<td>" + todo.Title + "</td>" + "<td>" + todo.Name + "</td></tr>";
            })
            list = list + "</table>";
            document.getElementById("ListToDo").innerHTML = list;
        }).catch(function(error){
            console.log(console.error);
        });
}
