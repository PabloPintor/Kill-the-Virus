var personaje;
var ultimaDireccion = "";
var estatico = false;
var nivelActual = 1;
var enemigos = [];
var puntuacionActual = 0;
var nVidas = 4;
var colisionable = true;
var muerto = false;
var disparable = true;
var numeroEnemigos = 0;
var balaGolpea = false;
var nivelMax = 6;
var juegoAcabado = false;
var vidasBoss = 10;

$(function() {

    //intervalos
    setInterval(comprobarEstado,2000);
    setInterval(comprobarEnemigos, 50);

    $("#btnReiniciar").click(function(){location.reload();});

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
            if (keys[37] || keys[65]) {
                if (!personaje.colisionaPorIzquierda("terreno")) {
                    if (ultimaDireccion != "izquierda" || (estatico)){
                        $("#medico").attr("src", "img/personajes/correr-izquierda.gif");
                        estatico = false;
                    }
                    personaje.moverIzquierda();
                    ultimaDireccion = "izquierda";
                }
            }
            if (keys[38] || keys[87]) {
                if (!personaje.colisionaPorArriba("terreno")) {
                    if (ultimaDireccion != "arriba" || (estatico)){
                        $("#medico").attr("src", "img/personajes/correr-arriba.gif");
                        estatico = false;
                    }
                    personaje.moverArriba();
                    ultimaDireccion = "arriba";
                }
            }
            if (keys[39] || keys[68]) {
                if (!personaje.colisionaPorDerecha("terreno")) {
                    if (ultimaDireccion != "derecha" || (estatico)){
                        $("#medico").attr("src", "img/personajes/correr-derecha.gif");
                        estatico = false;
                    }
                    personaje.moverDerecha();
                    ultimaDireccion = "derecha";
                }
            }
            if (keys[40] || keys[83]) {
                if (!personaje.colisionaPorAbajo("terreno")) {
                    if (ultimaDireccion != "abajo" || (estatico)){
                        $("#medico").attr("src", "img/personajes/correr-abajo.gif");
                        estatico = false;
                    }
                    personaje.moverAbajo();
                    ultimaDireccion = "abajo";
                }
            }

            if (keys[32]){
                if (disparable){
                    disparar();
                }
            }
            setTimeout(mueve, 50);
        }
    }

    mueve();

    //intervalo probar disparos
    //setInterval(disparar, 1000);

    //intervalo probar numero enemigos
    //setInterval(function(){console.log(numeroEnemigos)}, 1000)

    function disparar() {
        let img = $('<img id="jeringuilla">');
        let left = personaje.izquierda+(personaje.anchura/3);
        let top = personaje.arriba+(personaje.altura/3);
        $("#bala").css({
            "top": top,
            "left": left,
            "display": "block",
            "opacity": "1"
        });
        if (ultimaDireccion == "arriba"){
            img.attr("src", "img/jeringuillas/jeringuilla-arriba.png");
            img.attr("class", "jeringuilla-vertical");
            top -= 300;
        }
        else if(ultimaDireccion == "abajo"){
            img.attr("src", "img/jeringuillas/jeringuilla-abajo.png");
            img.attr("class", "jeringuilla-vertical");
            top += 300;
        }
        else if(ultimaDireccion == "izquierda"){
            img.attr("src", "img/jeringuillas/jeringuilla-izquierda.png");
            img.attr("class", "jeringuilla-horizontal");
            left -= 300;
        }
        else if(ultimaDireccion == "derecha"){
            img.attr("src", "img/jeringuillas/jeringuilla-derecha.png");
            img.attr("class", "jeringuilla-horizontal");
            left += 300;
        }
        $("#bala").append(img);
        disparable = false;

        $("#bala").animate({
            left: left,
            top: top+"px",
            opacity: "0"
        }, "slow");

        setTimeout(function(){disparable = true}, 500);
        setTimeout(function(){$("#bala").empty();}, 500);
    }

    function comprobarEstado() {
        if (numeroEnemigos == 0){
            nivelActual++;
            añadirEnemigos();
        }
        comprobarColisionEnemigo();
    }

    function comprobarEnemigos(){
        if (!juegoAcabado){
            moverEnemigos();
            comprobarColisionEnemigo();
            comprobarColisionBala();
            actualizarPuntuacion();
        }
    }

    function actualizarCorazones() {
        $("#corazones > img:nth-child(1)").remove();
    }

    function comprobarColisionEnemigo(){
        if (colisionable){
            enemigos.forEach(val => {
                if (personaje.abajo > val.arriba && personaje.arriba < val.abajo && personaje.derecha > val.izquierda && personaje.izquierda - 10 < val.derecha){
                    quitarVida();
                    puntuacionActual -= 10;
                    actualizarCorazones();
                }
            });
        }
    }

    function comprobarColisionBala(){
        let bala = $("#jeringuilla");
        if (bala.length == 1){
            enemigos.forEach(val => {
                if (!balaGolpea && bala.offset().top + bala.outerHeight(true) > val.arriba && bala.offset().top < val.abajo && bala.offset().left + bala.outerWidth(true) > val.izquierda && bala.offset().left - 10 < val.derecha){
                    balaGolpea = true;
                    if (nivelActual == nivelMax && vidasBoss > 0){
                        vidasBoss--;
                        $("#bossBar").progressbar({value: vidasBoss*10});
                    }
                    else{
                        numeroEnemigos--;
                        puntuacionActual += 25;
                        val.capa.fadeOut("slow").remove();
                        enemigos.splice(enemigos.indexOf(val), 1);
                    }
                    setTimeout(function(){balaGolpea = false;}, 500);
                }
            });
        }
    }

    function quitarVida(){
        nVidas -= 1;
        if (nVidas == 0){
            morir();
            mostrarDialogoFinal();
        }
        else{
            personajeGolpeado();
        }
    }

    function mostrarDialogoFinal() {
        let texto = "<p>Has obtenido: "+puntuacionActual+" puntos! La proxima vez sera!</p>";
        $("#parrafoPuntuaciones").append(texto);
        $("#btnReiniciar").button();
        $("#puntuaciones").dialog();
    }

    function morir(){
        if (ultimaDireccion == "izquierda"){
            $("#medico").attr("src", "img/personajes/morir-izquierda.gif");
        }
        else{
            $("#medico").attr("src", "img/personajes/morir-derecha.gif");
        }
        muerto = true;
        setTimeout(function(){$("#medico").fadeOut("slow").remove()}, 500);
        personaje = "";

        $("#alerta").text("Has muerto!");
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
        //añadir contador aqui
        enemigos = [];
        if (nivelActual < nivelMax){
            let top = 0;
            let capa;
            for (let i = 0; i < nivelActual*2; i++) {
                top = ((i/(nivelActual*2))*90)+10;
                capa = $('<img>', {src: 'img/personajes/virus_2.png',class: 'enemigo'}).appendTo("#enemigos");
                capa.css({"top": top+"%", "left": "62.5%"});
                enemigos.push(new Personaje(capa));
                numeroEnemigos++;
            }
        }
        else if(nivelActual == nivelMax){
            let boss = $('<img>', {src: 'img/personajes/virus_2.png',class: 'enemigo'}).appendTo("#enemigos");
            boss.css({"top": "30%", "left": "30%", "width": "200px", "height": "200px"});
            enemigos.push(new Personaje(boss));
            numeroEnemigos++;
            bossBar();
        }
        else if(nivelActual > nivelMax){
            final();
        }
    }

    function bossBar(){
        $("#bossBar").progressbar({value: 100});
        $("#bossBar").css("class", "mt-3");
        $("#bossBar > div").append($("<div>").text("CORONAVIRUS").css("class", "progress-label"));
    }

    function final(){
        if (!juegoAcabado){
            juegoAcabado = true;
            let texto = "<p>Has obtenido: "+puntuacionActual+" puntos! Enhorabuena!</p>";
            $("#parrafoPuntuaciones").append(texto);
            $("#btnReiniciar").button();
            $("#puntuaciones").dialog();
        }
    }

    function actualizarPuntuacion(){
        document.title = "Puntuacion: "+puntuacionActual;
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
