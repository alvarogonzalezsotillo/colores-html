function imposibleDeCompartirEntreWorkerYModule(palabra){
    // https://stackoverflow.com/questions/44118600/web-workers-how-to-import-modules
    // Este codigo debería poder compartirse con colores.mjs, para que
    // pudiera generar la página estáticamente desde nodejs. De momento,
    // no es posible hacer un worker que sea un módulo de es16, así que uso cortapega.
    const letrasPermitidas = {
        "a": "A",
        "b": "B",
        "c": "C",
        "d": "D",
        "e": "E",
        "f": "F",
    };

    const letrasExtraPermitidas = {
        "a": "A",
        "b": "B",
        "c": "C",
        "d": "D",
        "e": "E",
        "f": "F",
        "o": "0",
        "i": "1",
        "g": "6",
        "s": "5"
    };


    function colorDesdePalabra(s,permitidas){

        function quitaAcentos(silaba){
            const map = { "á": "a", "é": "e", "í": "i", "ó": "o", "ú": "u" };
            return silaba.toLowerCase().split("").map( l =>{
                return map[l] ? map[l] : l;
            }).join("");
        }

        
        if( s.length != 6 ){
            return null;
        }
        s = quitaAcentos(s.toLowerCase());

        const ls = s.split("");
        if( ls.some( l => !permitidas[l] ) ){
            return null;
        }

        return ls.map( l => permitidas[l] ).join("");
    }

    return colorDesdePalabra(palabra,letrasExtraPermitidas);
}


function startSearch(corpus){
    let indice = 0;
    let total = corpus.length;
    for( let palabra of corpus ){
        indice += 1;
        if( imposibleDeCompartirEntreWorkerYModule(palabra) ){
            self.postMessage({
                palabra: palabra,
                indice: indice,
                total: total,
                finalizado: false
            });
        }
    }

    self.postMessage({
        finalizado: true
    });
}


self.addEventListener("message", (message) =>{

    switch( message.data.type ){
    case "search" :
        startSearch(
            message.data.corpus
        );
        break;
    }
    
});


