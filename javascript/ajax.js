function ajaxGet(url, callback){
    var req = new XMLHttpRequest();
    req.open("GET", url);
    req.addEventListener("load", function(){
        if(req.status >= 200 && req.status < 400){
            //Appelle la fonction callback en lui passant la réponse de la requête
            callback(req.responseText);
        }else{
            console.error("req.status !€ [200,400[ : " + req.status + " " + req.statusText + " " + url);
        }
    });
    req.addEventListener("error", function(){
        console.error("Erreur réseau avec l'url " + url);
    });
    req.send(null);
}

function ajaxReturn(url, callback){
    var req = new XMLHttpRequest();
    req.open("GET", url);
    req.addEventListener("load", function(){
        if(req.status >= 200 && req.status < 400){
            //Appelle la fonction callback en lui passant la réponse de la requête
            let res = callback(req.responseText);
            console.log("ajaxReturn res : " + res);
            return res;
        }else{
            console.error("req.status !€ [200,400[ : " + req.status + " " + req.statusText + " " + url);
        }
    });
    req.addEventListener("error", function(){
        console.error("Erreur réseau avec l'url " + url);
    });
    req.send(null);
}

function ajaxTest(url, callback){
    var req = new XMLHttpRequest();
    req.open("GET", url);
    req.addEventListener("load", function(){
        if(req.status >= 200 && req.status < 400){
            //Appelle la fonction callback en lui passant la réponse de la requête
            let res = callback(req.responseText);
            console.log("ajaxTest res : " + res);
            return res;
        }else{
            console.error("req.status !€ [200,400[ : " + req.status + " " + req.statusText + " " + url);
        }
    });
    req.addEventListener("error", function(){
        console.error("Erreur réseau avec l'url " + url);
    });
    req.send(null);
}