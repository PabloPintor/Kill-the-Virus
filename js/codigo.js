var personaje;
var ultimaDireccion = "";
var estatico = false;

$(function() {
    //dialogo puntuaciones
    //$("#puntuaciones").dialog();

    personaje = new Personaje($('#medico'));

    let keys = {};

    $(document).keydown(function(e) {
        keys[e.which] = true;
        mueve();
    });
    $(document).keyup(function(e) {
        delete keys[e.which];
        console.log("keyup");
        ponerPersonajeEstatico();
    });

    function ponerPersonajeEstatico() {
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

    //mover dependiendo de codigo tecla
    function mueve() {
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