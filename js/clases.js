"user strict";
class Personaje { // Cualquier personaje que se mueva. Puede ser personaje principal o enemigos.
    constructor(capa) {
        this.capa = capa;
        this.izquierda = capa.offset().left;
        this.arriba = capa.offset().top;
        this.altura = capa.outerHeight(true);
        this.anchura = capa.outerWidth(true);
        this.derecha = this.izquierda + this.anchura;
        this.abajo = this.arriba + this.altura;
    }
    colisionaPorAbajo(tipo) {
        let colisiona = false;
        if (tipo == "terreno") {
            let terrenos = getTerrenos();
            terrenos.forEach(val => {
                if (this.abajo + 10 > val.arriba && this.arriba < val.abajo && this.derecha > val.izquierda && this.izquierda < val.derecha) {
                    colisiona = true;
                }
            });
        }
        return colisiona;
    }
    colisionaPorArriba(tipo) {
        let colisiona = false;
        if (tipo == "terreno") {
            let terrenos = getTerrenos();
            terrenos.forEach(val => {
                if (this.abajo > val.arriba && this.arriba - 10 < val.abajo && this.derecha > val.izquierda && this.izquierda < val.derecha) {
                    colisiona = true;
                }
            });
        }
        return colisiona;
    }
    colisionaPorDerecha(tipo) {
        let colisiona = false;
        if (tipo == "terreno") {
            let terrenos = getTerrenos();
            terrenos.forEach(val => {
                if (this.abajo > val.arriba && this.arriba < val.abajo && this.derecha + 10 > val.izquierda && this.izquierda < val.derecha) {
                    colisiona = true;
                }
            });
        }
        return colisiona;
    }
    colisionaPorIzquierda(tipo) {
        let colisiona = false;
        if (tipo == "terreno") {
            let terrenos = getTerrenos();
            terrenos.forEach(val => {
                if (this.abajo > val.arriba && this.arriba < val.abajo && this.derecha > val.izquierda && this.izquierda - 10 < val.derecha) {
                    colisiona = true;
                }
            });
        }
        return colisiona;
    }
    moverArriba() {
        this.capa.animate({ top: this.arriba -= 10 }, { duration: 10, queue: false });
        this.actualizaCoordenadas();
    }
    moverAbajo() {
        this.capa.animate({ top: this.arriba += 10 }, { duration: 10, queue: false });
        this.actualizaCoordenadas();
    }
    moverDerecha() {
        this.capa.animate({ left: this.izquierda += 10 }, { duration: 10, queue: false });
        this.actualizaCoordenadas();
    }
    moverIzquierda() {
        this.capa.animate({ left: this.izquierda -= 10 }, { duration: 10, queue: false });
        this.actualizaCoordenadas();
    }
    actualizaCoordenadas() {
        this.derecha = this.izquierda + this.anchura;
        this.abajo = this.arriba + this.altura;
    }
}

class Terreno { // Cualquier capa inmovil
    constructor(capa) {
        this.capa = capa;
        this.izquierda = parseInt(capa.offset().left);
        this.arriba = parseInt(capa.offset().top);
        this.altura = parseInt(capa.outerHeight(true));
        this.anchura = parseInt(capa.outerWidth(true));
        this.derecha = parseInt(this.izquierda + this.anchura);
        this.abajo = parseInt(this.arriba + this.altura);
    }
}