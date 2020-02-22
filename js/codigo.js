var personaje;
var ultimaDireccion = "";
var estatico = false;
var nivelActual = 8;
var enemigos = [];
var puntuacionActual = 0;
var nVidas = 3;
var colisionable = true;
var muerto = false;

$(function() {

    //intervalos
    setInterval(comprobarEstado,2000);
    setInterval(comprobarEnemigos, 50)

    //dialogo puntuaciones
    //$("#puntuaciones").dialog();

    personaje = new Personaje($('#medico'));

    let keys = {};

    $(document).keydown(function(e) {
        keys[e.which] = true;
        //mueve();
    });
    $(document).keyup(function(e) {
        delete keys[e.which];
        ponerPersonajeEstatico();
    });

    function ponerPersonajeEstatico() {
        if (!muerto){
            if (ultimaDireccion == "izquierda"){
                $("#medico").attr("src", "img/personajes/estatico-izquierda.jpg");
            }
            else if (ultimaDireccion == "derecha"){
                $("#medico").attr("src", "img/personajes/estatico-derecha.png");
            }
            else if (ultimaDireccion == "arriba"){
                $("#medico").attr("src", "img/personajes/estatico-detras.jpg");
            }
            else{
                $("#medico").attr("src", "img/personajes/estatico-delante.jpg");
            }
            estatico = true;
        }
    }

    //mover dependiendo de codigo tecla
    function mueve() {
        if (!muerto){
            if (keys[37]) {
                if (!personaje.colisionaPorIzquierda("terreno")) {
                    if (ultimaDireccion != "izquierda" || (estatico)){
                        $("#medico").attr("src", "img/personajes/correr-izquierda.gif");
                        estatico = false;
                    }
                    personaje.moverIzquierda();
                    ultimaDireccion = "izquierda";
                }
            }
            if (keys[38]) {
                if (!personaje.colisionaPorArriba("terreno")) {
                    if (ultimaDireccion != "arriba" || (estatico)){
                        $("#medico").attr("src", "img/personajes/correr-arriba.gif");
                        estatico = false;
                    }
                    personaje.moverArriba();
                    ultimaDireccion = "arriba";
                }
            }
            if (keys[39]) {
                if (!personaje.colisionaPorDerecha("terreno")) {
                    if (ultimaDireccion != "derecha" || (estatico)){
                        $("#medico").attr("src", "img/personajes/correr-derecha.gif");
                        estatico = false;
                    }
                    personaje.moverDerecha();
                    ultimaDireccion = "derecha";
                }
            }
            if (keys[40]) {
                if (!personaje.colisionaPorAbajo("terreno")) {
                    if (ultimaDireccion != "abajo" || (estatico)){
                        $("#medico").attr("src", "img/personajes/correr-abajo.gif");
                        estatico = false;
                    }
                    personaje.moverAbajo();
                    ultimaDireccion = "abajo";
                }
            }
            setTimeout(mueve, 50);
        }
    }

    mueve();

    function comprobarEstado() {
        if (numeroEnemigos() == 0){
            nivelActual++;
            añadirEnemigos();
        }
        comprobarColisionEnemigo();
        actualizarPuntuacion();
    }

    function comprobarEnemigos(){
        moverEnemigos();
        comprobarColisionEnemigo();
    }

    function comprobarColisionEnemigo(){
        if (colisionable){
            enemigos.forEach(val => {
                if (personaje.abajo > val.arriba && personaje.arriba < val.abajo && personaje.derecha > val.izquierda && personaje.izquierda - 10 < val.derecha){
                    quitarVida();
                }
            });
        }
    }

    function quitarVida(){
        nVidas -= 1;
        if (nVidas == 0){
            morir();
        }
        else{
            personajeGolpeado();
        }
    }

    function morir(){
        if (ultimaDireccion == "izquierda"){
            $("#medico").attr("src", "img/personajes/morir-izquierda.gif");
        }
        else{
            $("#medico").attr("src", "img/personajes/morir-derecha.gif");
        }
        muerto = true;
        setTimeout(function(){$("#medico").fadeOut("slow")}, 500);
        $("#alerta").text("Has muerto! El juego se va a reiniciar");
        setTimeout(function(){location.reload();}, 5000);
    }

    function personajeGolpeado(){
        colisionable = false;
        setTimeout(function(){
            colisionable = true;
            if (nVidas > 1){
                $("#vida").css({"opacity": "1", "top": "50%", "display": "none"});
            }
        }, 3000);
        animacionGolpe();
        mostrarMsgVida();
    }

    function mostrarMsgVida() {
        $("#vida").show();
        $("#vida").animate({
            top: "20%",
            opacity: "0"
        }, "slow");
    }

    function animacionGolpe(){
        if (!muerto){
            for (let i = 0; i < 5; i++) {
                $("#medico").fadeTo("fast", 0.01);
                $("#medico").fadeTo("fast", 1);
            }
        }
    }


    //añade numero enemigos dependiendo del nivel actual
    function añadirEnemigos() {
        if (nivelActual < 10){
            for (let i = 0; i < nivelActual*2; i++) {
                enemigos.push(new Personaje($('<img>', {src: 'img/personajes/virus.gif',class: 'enemigo'}).appendTo("#enemigos")));
            }
        }
    }

    function actualizarPuntuacion(){
        document.title = "Puntuacion: "+puntuacionActual;
    }

    //devuelve el numero de enemigos que hay
    function numeroEnemigos(){
        let n = $('.enemigo').length;
        return n;
    }

    function moverEnemigos(){
        enemigos.forEach(enemigo => {
            let random = Math.floor(Math.random()*(4-1+1)+1);
            switch (random) {
                case 1:
                    if (!enemigo.colisionaPorDerecha("terreno")){
                        enemigo.moverDerecha();
                    }
                    break;
                case 2:
                    if (!enemigo.colisionaPorIzquierda("terreno")){
                        enemigo.moverIzquierda();
                    }
                    break;
                case 3:
                    if (!enemigo.colisionaPorArriba("terreno")){
                        enemigo.moverArriba();
                    }
                    break;
                case 4:
                    if (!enemigo.colisionaPorAbajo("terreno")){
                        enemigo.moverAbajo();
                    }
                    break;
            }
        });
    }
});

//devuelve array con objetos terreno con cada capa que tenga que colisionar
function getTerrenos() {
    let terrenos = [];
    $(".pared").each((i,val) => {
        let terreno = new Terreno($(val));
        terrenos.push(terreno);
    });
    return terrenos;
}
