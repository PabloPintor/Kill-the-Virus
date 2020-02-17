var personaje;
var ultimaDireccion = "";

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
        //mueve();
    });

    //mover dependiendo de codigo tecla
    function mueve() {
        if (keys[37]) {
            if (!personaje.colisionaPorIzquierda("terreno")) {
                if (ultimaDireccion != "izquierda"){
                    $("#medico").attr("src", "img/personajes/correr-izquierda.gif");
                }
                personaje.moverIzquierda();
                ultimaDireccion = "izquierda";
            }
        }
        if (keys[38]) {
            if (!personaje.colisionaPorArriba("terreno")) {
                if (ultimaDireccion != "arriba"){
                    $("#medico").attr("src", "img/personajes/correr-arriba.gif");
                }
                personaje.moverArriba();
                ultimaDireccion = "arriba";
            }
        }
        if (keys[39]) {
            if (!personaje.colisionaPorDerecha("terreno")) {
                if (ultimaDireccion != "derecha"){
                    $("#medico").attr("src", "img/personajes/correr-derecha.gif");
                }
                personaje.moverDerecha();
                ultimaDireccion = "derecha";
            }
        }
        if (keys[40]) {
            if (!personaje.colisionaPorAbajo("terreno")) {
                if (ultimaDireccion != "abajo"){
                    $("#medico").attr("src", "img/personajes/correr-abajo.gif");
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