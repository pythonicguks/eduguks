"use strict";
/* Affichage de l'écran courant */

const app=document.getElementById('app');
function render(){
  app.classList.toggle('playing',screen==='game');
  app.innerHTML=screen==='game'?viewGame():screen==='result'?viewResult():screen==='album'?viewAlbum():screen==='parents'?viewParents():screen==='hangar'?viewHangar():screen==='pals'?viewPals():viewHome();
}
