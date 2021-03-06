(function () {
    var userName = document.getElementById('nameInput');
    var messages = document.getElementById('messages');
    var mesText = document.getElementById('textInput');
    var sendButton = document.getElementById('sendButton');
    
    
 
    
    
    
    
    sendButton.onclick = function () {
        var user = userName.value;
        var text = mesText.value;
        if(user === '' || text === ''){
            alert("All fields must be fill");
            return;
        }
        req({
            method: 'POST',
            url: '/messages',
            data: {
              author: user,
              text: text  
            },
            callback: function(msg){
                mesText.value='';
                getData();
            }
        });
    }
    function req(options) {
       var url = options.url || '/',
				method = options.method || 'GET',
				callback = options.callback || function() {},
				data = options.data || {},
				http = new XMLHttpRequest();
			http.open(method, url, true);
			http.setRequestHeader('Content-Type', 'application/json');
			http.send(JSON.stringify(data));
           	http.onreadystatechange = function() {
				if(http.status == 200 && http.readyState === 4) {
					callback(http.responseText);
				}
			};
    }
    
    function getData() {
        req({
            method: 'GET',
            url: '/messages',
            callback: function(msg){
                messages.innerHTML='';
                msg = JSON.parse(msg);
                for (i in msg){
                    if(msg.hasOwnProperty(i)){
                        var element = document.createElement('li');
                        element.innerText=msg[i].author + ': ' + msg[i].text;
                        messages.appendChild(element); 
                    }
                } 
            }
        });
    }
    getData();
    
    
    
    var liElement = document.getElementById('mesArea').getElementsByTagName('li');
    
    
    
    document.getElementById("mesArea").addEventListener("click",function(e) {
        if(e.target && e.target.nodeName == "LI") {
            var fullText = e.target.innerText;
            
            var point = fullText.indexOf(':');
	    var author = fullText.substr(0, point);
	    var text = fullText.substr(point + 2, fullText.length); 
             req({
            method: 'DELETE',
            url: '/messages',
            data: {
              author: author,
              text: text  
            },
            callback: function(msg){
                getData();
            }
        });
        }
    });
    setInterval(function() {
			getData();
		}, 2000);
    
})();
