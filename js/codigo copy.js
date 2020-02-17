"user strict";
let personaje;
let suelo;
$(document).ready(function() {
    personaje = new Personaje($('#pelota'));

    let keys = {};

    $(document).keydown(function(e) {
        keys[e.which] = true;
        mueve();
    });
    $(document).keyup(function(e) {
        delete keys[e.which];
        mueve();
    });

    function mueve() {
        if (keys[37]) {
            if (!personaje.colisionaPorIzquierda("terreno")) {
                personaje.moverIzquierda();
            }
        }
        if (keys[38]) {
            if (!personaje.colisionaPorArriba("terreno")) {
                personaje.moverArriba();
            }
        }
        if (keys[39]) {
            if (!personaje.colisionaPorDerecha("terreno")) {
                personaje.moverDerecha();
            }
        }
        if (keys[40]) {
            if (!personaje.colisionaPorAbajo("terreno")) {
                personaje.moverAbajo();
            }
        }
    }
});

function getTerrenos() {
    let terrenos = [];
    $(".suelo").each((i,val) => {
        let terreno = new Terreno($(val));
        terrenos.push(terreno);
    });
    return terrenos;
}