(function () {
    var userName = document.getElementById('nameInput');
    var messages = document.getElementById('messages');
    var mesText = document.getElementById('textInput');
    var sendButton = document.getElementById('sendButton');
   
    var socket = io.connect();
    
    sendButton.onclick = function () {
        var user = userName.value;
        var text = mesText.value;
        if(user === '' || text === ''){
            alert("All fields must be fill");
            return;
        }
        
        var data = {
              author: user,
              text: text  
        }
        console.log(data);
       mesText.value='';
        socket.emit('message', data);
    }
    socket.on('history',function(msg){
        console.log(msg);
        messages.innerHTML='';
        for (i in msg){
            if(msg.hasOwnProperty(i)){
                var element = document.createElement('li');
                element.innerText=msg[i].author + ': ' + msg[i].text;
                messages.appendChild(element); 
            }
        } 
    });

    var liElement = document.getElementById('mesArea').getElementsByTagName('li');
    
    
    
    document.getElementById("mesArea").addEventListener("click",function(e) {
        if(e.target && e.target.nodeName == "LI") {
            var fullText = e.target.innerText;
            
            var point = fullText.indexOf(':');
            var data = {
              author: fullText.substr(0, point),
              text: fullText.substr(point + 2, fullText.length),  
            }
              console.log(data);
             socket.emit('delete', data);
        }
    });

})();
