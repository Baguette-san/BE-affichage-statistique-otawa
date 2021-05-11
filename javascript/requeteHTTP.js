var ID_NOM_FICHIER = "inputBinaire";
var ID_REPONSE_SERVEUR = "server_answer";

function displayGraph(graph){
  //clearDisplay()
  var viz = new Viz();

  viz.renderSVGElement(graph)
  .then(function(element) {
    afficherGrapheNouvelleFenetre(element);     
  })
  .catch(error => {
  // Create a new Viz instance (@see Caveats page for more info)
  viz = new Viz();

  // Possibly display the error
  console.error(error);
  });

}

function graphToHTML(graph){
  var viz = new Viz();

  viz.renderSVGElement(graph)
  .then(function(element) {
    var newDiv = document.createElement("div");
    newDiv.appendChild(element);
    traitementReponseHTML(newDiv);
    return newDiv;
  })
  .catch(error => {
  // Create a new Viz instance (@see Caveats page for more info)
  viz = new Viz();

  // Possibly display the error
  console.error(error);
  });
}

function afficherGrapheNouvelleFenetre(element){
  var strWindowFeatures = "";
  let rand = Math.floor(Math.random() * 1000); //Test de fenêtres avec un nom différent pour que la deuxième n'écrase pas la première
  let windowObjectReference = window.open(`template.html#${rand}`, `testGraph${rand}`, strWindowFeatures);
  let templateHTML = '<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Template</title></head><body><div id="server_answer"><p>tout</p></div><script src="./node_modules/viz.js/viz.js"></script><script src="./node_modules/viz.js/full.render.js"></script><script src="./ajax.js"></script><script src="./requeteHTTP.js"></script></body></html>';
  windowObjectReference.document.write(templateHTML);
  windowObjectReference.document.close(); //Si il manque le close(), la page n'est pas prévenue de l'arret des modifications et peut ne pas se charger
  let answerDiv = windowObjectReference.document.getElementById(ID_REPONSE_SERVEUR);
  //console.log(answerDiv);
  answerDiv.append(element);
  traitementReponseHTML(answerDiv);
  traitementGraphHTML(answerDiv);
  answerDiv.style.transform = "scale(0.9, 0.9)";
  answerDiv.addEventListener('wheel', testResize);
}

function arbreLiens(html){
  let listeLiens = trouverLiens(traitementReponseHTML(html));
  let nouveauxLiens = new Array();

  listeLiens.forEach(function(myLink){
    let linkTarget = trouverCibleLien(myLink);
    let newHTML = graphToHTML()
  });
}

function traitementReponseHTML(answerDiv){
  var str = answerDiv.innerHTML.toString();
  str = JSON.stringify(str);
  str = str.replace(/\\n/g,'');
  str = str.replace(/\\/g,'');
  answerDiv.innerHTML = str;
}

function traitementGraphHTML(graphDiv){
  var str = graphDiv.innerHTML.toString();
  var n1 = trouverLiens(str);
  
  if(n1 != null){
    n1.forEach(function(myLink){
      var linkName = trouverCibleLien(myLink);
      myLink = remplacerLienParAppelFonction(myLink, linkName, 0);
      graphDiv.innerHTML = remplacerLiensDansHTML(graphDiv.innerHTML, myLink);
    });
  }
}

function trouverLiens(str){
  let regex = /<a(.*?)\/a>/g;
  return str.match(regex);
}

function trouverCibleLien(myLink){
  return myLink.match(/xlink:href="([^\#].*?)"/)[1];
}

function remplacerLienParAppelFonction(link, target, numFonction){
  switch (numFonction) {
    case 0:
      return link.replace(/xlink:href="([^\#].*?)"/, 'xlink:href="#" onclick=getGraphData("' + target + '")');
      break;
  
    default:
      return link.replace(/xlink:href="([^\#].*?)"/, 'xlink:href="#" onclick=getGraphData("' + target + '")');
      break;
  }
}

function remplacerLiensDansHTML(html, newLink){
  return html.replace(/\<a xlink:href="([^\#].*?)"(.*?)\/a>/g, newLink);
}


function displayData(reponse){
  clearDisplay();
  var answerDiv = document.getElementById(ID_REPONSE_SERVEUR);
  var answerHTML = document.createElement("p");
  answerHTML.innerHTML = reponse;
  answerDiv.appendChild(answerHTML);
  traitementReponseHTML(answerDiv);
  traitementDataHTML(answerDiv);
  console.log(reponse);
}

function displayCode(reponse){
  clearDisplay();
  var answerDiv = document.getElementById(ID_REPONSE_SERVEUR);
  var answerHTML = document.createElement("p");
  answerHTML.innerHTML = reponse;
  answerDiv.appendChild(answerHTML);
  traitementReponseHTML(answerDiv);
  console.log(reponse);
}

function traitementDataHTML(dataDiv){
  var str = dataDiv.innerHTML.toString();

  let regex = /<a(.*?)\/a>/g;
  var n1 = str.match(regex);
  //console.log(n1);
  
  if(n1 != null){
    n1.forEach(function(myLink){
      var linkName = myLink.match(/href="([^\#].*?)"/)[1];
      console.log(linkName);
      myLink = myLink.replace(/href="([^\#].*?)"/, 'href="#" onclick=getCodeData("' + linkName + '")');
      dataDiv.innerHTML = dataDiv.innerHTML.replace(/\<a href="([^\#].*?)"(.*?)\/a>/g, myLink);
    });
  }
}

function testResize(evt){
  console.log("resize !");
  evt.preventDefault();

  let maDiv = evt.currentTarget;
  let oldScale = maDiv.style.transform.toString();
  let scaleValueRegex = /\(([^)]+)\)/;
  let oldScaleValue = parseFloat(oldScale.match(scaleValueRegex)[1]);

  let newScaleValue = oldScaleValue +  evt.deltaY * -0.001;

  // Restrict scale
  newScaleValue = Math.min(Math.max(.125, newScaleValue), 2);

  // Apply scale transform
  maDiv.style.transform = `scale(${newScaleValue})`;
  console.log(oldScaleValue);
  console.log(newScaleValue);
}

function clearDisplay(){
  let answerDiv = document.getElementById(ID_REPONSE_SERVEUR);
  answerDiv.innerText = "";
}

function getData(){
  let nomFichier = document.getElementById(ID_NOM_FICHIER).value;
  let typeColoration = "count";
  let url = `http://127.0.0.1:8000/stats/code/${nomFichier}?colored_by=${typeColoration}`;
  ajaxGet(url, displayData);
}

function getGraphData(graphName){
  let typeColoration = "count";
  var url = `http://127.0.0.1:8000/stats/cfg/${graphName}?colored_by=${typeColoration}`;
  ajaxGet(url, displayGraph);
}


function getCodeData(codeName){
  let typeColoration = "count";
  let url = `http://127.0.0.1:8000/stats/code/${codeName}?colored_by=${typeColoration}`;
  ajaxGet(url, displayCode);
}

function testFonction(){
  alert("ça marche !");
}