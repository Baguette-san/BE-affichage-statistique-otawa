var ID_NOM_FICHIER = "inputBinaire";
var ID_REPONSE_SERVEUR = "server_answer";
var GRAPH_WIDTH = 800;
var GRAPH_HEIGHT = 1000;

//Pour la fonction de coloration
var labels = ['ipet-total_time', 'ipet-total_count', ]; 
var backgrounds = ['#ffffff', '#eae7ff', '#d6cfff', '#c0b7ff', '#ab9eff', '#a194fa', '#9b8ef5', '#8c7ded', '#7b6ce3', '#7162dd']; 
var foregrounds = ['#000000', '#000000', '#000000', '#000000', '#000000', '#ffffff', '#ffffff', '#ffffff', '#ffffff', '#ffffff']; 
var s0 = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 2, 2, 2, 5, 9, 9, 0, 0, 0, 0, 6, 0, 0, 0, 3, 0, 0, 1, 1, 0, 0, 1, 1, 1, 1, 0, ]; 
var s1 = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 2, 2, 2, 9, 8, 8, 0, 0, 0, 0, 8, 0, 0, 0, 8, 0, 0, 2, 2, 0, 0, 2, 2, 2, 2, 0, ]; 

function displayGraph(graph){
  //clearDisplay()
  var viz = new Viz();

  viz.renderSVGElement(graph)
  .then(function(element) {
    afficherGrapheNouvelleFenetre(element);   
    //testNouvelleFenetre();
    //afficherGrapheMemeFenetre(element);  
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

function afficherGrapheMemeFenetre(element){
  let answerDiv = document.getElementById(ID_REPONSE_SERVEUR);
  answerDiv.append(element);
  traitementReponseHTML(answerDiv);
  traitementGraphHTML(answerDiv);
  answerDiv.style.transform = "scale(0.9, 0.9)"; //Faire en sorte de lire les valeurs de width et height (regex) et de scale pour que ça rentre parfaitement dans le cadre
  answerDiv.addEventListener('wheel', testResize);
  testNouvelleFenetre();
}

function afficherGrapheNouvelleFenetre(element){
  var strWindowFeatures = "";
  let graphHTML = document.createElement("p");
  graphHTML.append(element);
  traitementReponseHTML(graphHTML);
  let graphTitle = obtenirTitreGraphe(graphHTML);
  console.log(graphTitle);
  let windowObjectReference = window.open(`template.html#${graphTitle}`, `testGraph${graphTitle}`, strWindowFeatures);
  let templateHTML = `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><link rel="stylesheet" href="style.css"/><title>Template</title></head><body id="graph_body"><header><div id="enTete"> <img src="Obviews.jpeg" alt="Obviews" /> </div><nav><ul><li><a href="index.html">Accueil</a></li><li><a href="zone-de-test.html">Zone de test</a></li><li><a href="about.html">mode d'emploi</a></li></ul></nav></header><div id="graph_border"><div id="graph_frame"><div id="server_answer"></div></div></div><footer>More information : <br><ul><li><a href="about.html">About</a></li></ul></footer><script src="../javascript/node_modules/viz.js/viz.js"></script><script src="../javascript/node_modules/viz.js/full.render.js"></script><script src="../javascript/ajax.js"></script><script src="../javascript/requeteHTTP.js"></script><script src="../javascript/interactiveDOM.js"></script></body></html>`;
  windowObjectReference.document.write(templateHTML);
  windowObjectReference.document.close(); //Si il manque le close(), la page n'est pas prévenue de l'arret des modifications et peut ne pas se charger
  let answerDiv = windowObjectReference.document.getElementById(ID_REPONSE_SERVEUR);
  answerDiv.append(element);
  traitementReponseHTML(answerDiv);
  traitementGraphHTML(answerDiv);
  let graphWidth = obtenirLargeurGraphe(answerDiv)*1.33;
  let graphHeight = obtenirHauteurGraphe(answerDiv)*1.33;
  //console.log(graphWidth);
  //console.log(graphHeight);
  let graphWidthScale = GRAPH_WIDTH/graphWidth;
  let graphHeightScale = GRAPH_HEIGHT/graphHeight;
  let newScale = Math.min(graphWidthScale, graphHeightScale);
  answerDiv.style.transform = `scale(${newScale})`;
  /*
  answerDiv.style.left = "650px";
  answerDiv.style.top = "400px";
  console.log(answerDiv.offsetLeft);
  console.log(answerDiv.offsetTop);
  answerDiv.style.left = "365px";
  answerDiv.style.top = "130px";
  console.log(answerDiv.style.left);
  console.log(answerDiv.style.top);
  */
  let monSVG = windowObjectReference.document.getElementsByTagName("svg")[0];
  let monGraphe = windowObjectReference.document.getElementById("graph0");
  monSVG.offsetLeft = "200px";
  console.log(monSVG.offsetLeft);
  monGraphe.style.left = "400px";
  console.log(monGraphe.style.left);
  //monSVG.style.transform = "translate(0 0)";
  monGraphe.style.transform = "translate(0 0)";
  answerDiv.addEventListener('wheel', testResize);
  
}

function testNouvelleFenetre(){
  var strWindowFeatures = "";
  let rand = Math.floor(Math.random() * 1000); //Test de fenêtres avec un nom différent pour que la deuxième n'écrase pas la première
  let windowObjectReference = window.open(`template.html#${rand}`, `testGraph${rand}`, strWindowFeatures);
  let templateHTML = '<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Template</title></head><body><div id="graph_links" onload="chargerLiensGraphe();"></div><div id="server_answer"><p>tout</p></div><script src="../javascript/node_modules/viz.js/viz.js"></script><script src="../javascript/node_modules/viz.js/full.render.js"></script><script src="../javascript/ajax.js"></script><script src="../javascript/requeteHTTP.js"></script></body></html>';
  windowObjectReference.document.write(templateHTML);
  windowObjectReference.document.close(); //Si il manque le close(), la page n'est pas prévenue de l'arret des modifications et peut ne pas se charger
}

function arbreLiens(html){
  let listeLiens = trouverLiens(traitementReponseHTML(html));
  let nouveauxLiens = new Array();

  listeLiens.forEach(function(myLink){
    let linkTarget = trouverCibleLien(myLink);
    let newHTML = graphToHTML()
  });
}

function obtenirLargeurGraphe(answerDiv){
  var str = answerDiv.innerHTML.toString();
  return (str.match(/width="([^\#]*?)"/)[1]).replace(/pt/g, '');
}

function obtenirTitreGraphe(div){
  var str = div.innerHTML.toString();
  return (str.match(/\<title\>([^\#]*?)\<\/title\>/)[1]).replace(/pt/g, '');
}

function obtenirHauteurGraphe(answerDiv){
  var str = answerDiv.innerHTML.toString();
  return (str.match(/height="([^\#]*?)"/)[1]).replace(/pt/g, '');
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
  console.log(myLink);
  myLink = myLink.replace(/\.dot/, "");
  console.log(myLink);
  return myLink.match(/xlink:href="([^\#].*?)"/)[1];
}

function remplacerLienParAppelFonction(link, target, numFonction){
  switch (numFonction) {
    case 0:
      return link.replace(/xlink:href="([^\#].*?)"/, 'xlink:href="#" onclick="getGraphData(\'' + target + '\');"');
      break;
  
    default:
      return link.replace(/xlink:href="([^\#].*?)"/, 'xlink:href="#" onclick="getGraphData(\'' + target + '\');"');
      break;
  }
}

function remplacerLiensDansHTML(html, newLink){
  return html.replace(/\<a xlink:href="([^\#].*?)"(.*?)\/a>/g, newLink);
}


function displaySources(reponse){
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

  if(nomFichier.length > 1){
    getCodeData(nomFichier);
  }else{
    getSources();
  }
}

function getSources(){
  let url = `http://127.0.0.1:8000/stats/code/`;
  ajaxGet(url, displaySources);
}

function getGraphData(graphName){
  let typeColoration = "count";
  var url = `http://127.0.0.1:8000/stats/cfg/${graphName}?colored_by=${typeColoration}`;
  //var url = `http://127.0.0.1:8000/stats/cfg`;
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

function chargerLiensGraphe(){
  console.log("chargerLiensGraphes !");
  let url = "http://127.0.0.1:8000/stats/list_cfgs";
  ajaxGet(url, afficherLiensGraphe);
}

function afficherLiensGraphe(reponse){
  let liens = JSON.parse(reponse);
  let divLiens = document.getElementById("graph_links");

  liens.forEach(function(lien){
    //divLiens.innerHTML = divLiens.innerHTML + `<p>${lien.id}</p>`;
    //divLiens.innerHTML = divLiens.innerHTML + `<a href="#" onclick="getGraphData('${lien.id}');" name="voir_graphe">${lien.label} (${lien.id})</a><br>`;
   divLiens.innerHTML = divLiens.innerHTML + `<a href="javascript:getGraphData('${lien.id}')"  name="voir_graphe">${lien.label} (${lien.id})</a><br>`;

  });
}

function colorize(backs, label) { 
  document.getElementById("label").textContent = label; 
  trs = document.getElementById("stats").getElementsByTagName("tr"); 
  for(i = 0; i < trs.length; i++) { 
    trs[i].style.backgroundColor = backgrounds[backs[i]]; 
    trs[i].style.color = foregrounds[backs[i]]; 
  } 
} 
