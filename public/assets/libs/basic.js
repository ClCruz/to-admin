




/**
 * Exemplo de botão extra no mapa
 */

var getColumn = function() {
	return document.getElementById('teste').value;
};


/**
 * Retorna lista de assentos
 */
function moveMarker(marker, x, y) {

}




/**
 * https://github.com/perliedman/leaflet-realtime
 */
realtime = L.realtime({
	url: 'https://wanderdrone.appspot.com/',
	crossOrigin: true,
	type: 'json'
}, {
	// interval: 3 * 1000
})

