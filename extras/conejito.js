var typed = new Typed('.typed',{
    strings: ['','...',''],
    typeSpeed: 75, //tiempo para para poner letras
    startDelay: 1200, //tiempo de retraso para iniciar
    backDelay: 3000, //Tiempo de espera para borrar
    backSpeed: 35, //Velocidad para borrar
    loopCount: false, //repetir infinitamente
    showCursor: true, //Mostrar cursor palpitando

});

let imgchange = document.getElementById("imgchange");
let cambio = document.getElementById("conejito");

cambio.onclick = function(){
    imgchange.src = "../img/samurai.png";
}