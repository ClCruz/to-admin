



var ret;

map.on('areaselected', (e) => {
	console.log(e.bounds);

	markersToEdit.map(x => {
		x.sourceTarget.options.clicked = false;
		x.sourceTarget._icon.classList.remove('seat__clicked');
	})
	markersToEdit = [];
	ret = e.bounds; // lon, lat, lon, lat

	// console.log(ret);
	
	getMarkersSorted().map(x => {
		if (x._latlng.lat > ret._southWest.lat && x._latlng.lat < ret._northEast.lat && x._latlng.lng > ret._southWest.lng && x._latlng.lng < ret._northEast.lng) {
			x.options.clicked = true;
			x._icon.classList.add('seat__clicked');

			y = {
				sourceTarget: x
			}
			markersToEdit.push(y);
		}
	})
});

/**
 * Exemplo de botão extra no mapa
 */

var getColumn = function() {
	return document.getElementById('teste').value;
};


/**
 * Ativa quando qualquer elemento for inserido no mapa. 
 * Se for marker ele confere se existem opções de número ou nome de linha
 */
map.on(L.Draw.Event.CREATED, function(e) {
	var type = e.layerType,
		layer = e.layer;

	if (type == 'marker') {
		console.log(layer._latlng);
		layer.options.draggable = true;

		var lat = layer._latlng.lat;
		var lng = layer._latlng.lng;

		var quantityOfColumns = document.getElementById('seats-quantity').value;
		var rowName = document.getElementById('row-name').value;
		var steps = document.getElementById('steps-quantity').value;
		var initialValue = document.getElementById('initial-value').value;
		var spaceBetween = document.getElementById('space-between').value;

		var markers = [];

		initialValue == '' ? (initialValue = parseInt(0)) : (initialValue = parseInt(initialValue));
		steps == '' ? (steps = parseInt(1)) : (steps = parseInt(steps));
		spaceBetween == '' ? (spaceBetween = parseInt(20)) : (spaceBetween = parseInt(spaceBetween));

		// debugger
		for (var i = 0; i < quantityOfColumns; i++) {
			seatNumber = initialValue + (i == 0 ? i : i * steps);
			var y = {
				xy: xy([ lng + i * spaceBetween, lat ]),
				class: 'available',
				title: rowName + ' - ' + seatNumber,
				count: i,
				rowname: 'teste'
			};
			markers.push(y);
		}

		insertSeats(markers);

		try {
			layer.parentNode.removeChild();
		} catch {
			return 'Dont have a parent';
		}
	}

	drawnItems.addLayer(map._layers)
});

var height = map._lastCenter.lat * 2;

var pointsForJson = [
	{ xy: xy([ 194, height - 112 ]), available: true, customClass: '', clicked: false, title: 'A - 01' },
	{ xy: xy([ 214, height - 112 ]), available: true, customClass: '', clicked: false, title: 'A - 01' },
	{ xy: xy([ 234, height - 112 ]), available: true, customClass: '', clicked: false, title: 'A - 01' },
	{ xy: xy([ 254, height - 112 ]), available: true, customClass: '', clicked: false, title: 'A - 01' },
	{ xy: xy([ 274, height - 112 ]), available: true, customClass: '', clicked: false, title: 'A - 01' },
	{ xy: xy([ 294, height - 112 ]), available: true, customClass: '', clicked: false, title: 'A - 01' },
	{ xy: xy([ 194, height - 134 ]), available: true, customClass: '', clicked: false, title: 'A - 01' },
	{ xy: xy([ 214, height - 134 ]), available: true, customClass: '', clicked: false, title: 'A - 01' },
	{ xy: xy([ 234, height - 134 ]), available: true, customClass: '', clicked: false, title: 'A - 01' },
	{ xy: xy([ 254, height - 134 ]), available: true, customClass: '', clicked: false, title: 'A - 01' },
	{ xy: xy([ 274, height - 134 ]), available: true, customClass: '', clicked: false, title: 'A - 01' },
	{ xy: xy([ 294, height - 134 ]), available: true, customClass: '', clicked: false, title: 'A - 01' },
	{ xy: xy([ 194, height - 154 ]), available: true, customClass: '', clicked: false, title: 'A - 01' },
	{ xy: xy([ 214, height - 154 ]), available: true, customClass: '', clicked: false, title: 'A - 01' },
	{ xy: xy([ 234, height - 154 ]), available: true, customClass: '', clicked: false, title: 'A - 01' },
	{ xy: xy([ 254, height - 154 ]), available: true, customClass: '', clicked: false, title: 'A - 01' },
	{ xy: xy([ 274, height - 154 ]), available: true, customClass: '', clicked: false, title: 'A - 01' },
	{ xy: xy([ 294, height - 154 ]), available: true, customClass: '', clicked: false, title: 'A - 01' },
	{ xy: xy([ 194, height - 174 ]), available: true, customClass: '', clicked: false, title: 'A - 01' },
	{ xy: xy([ 214, height - 174 ]), available: true, customClass: '', clicked: false, title: 'A - 01' },
	{ xy: xy([ 234, height - 174 ]), available: true, customClass: '', clicked: false, title: 'A - 01' },
	{ xy: xy([ 254, height - 174 ]), available: true, customClass: '', clicked: false, title: 'A - 01' },
	{ xy: xy([ 274, height - 174 ]), available: true, customClass: '', clicked: false, title: 'A - 01' },
	{ xy: xy([ 294, height - 174 ]), available: true, customClass: '', clicked: false, title: 'A - 01' },
	{ xy: xy([ 194, height - 194 ]), available: true, customClass: '', clicked: false, title: 'A - 01' },
	{ xy: xy([ 214, height - 194 ]), available: true, customClass: '', clicked: false, title: 'A - 01' },
	{ xy: xy([ 234, height - 194 ]), available: true, customClass: '', clicked: false, title: 'A - 01' },
	{ xy: xy([ 254, height - 194 ]), available: true, customClass: '', clicked: false, title: 'A - 01' },
	{ xy: xy([ 274, height - 194 ]), available: true, customClass: '', clicked: false, title: 'A - 01' },
	{ xy: xy([ 294, height - 194 ]), available: true, customClass: '', clicked: false, title: 'A - 01' },
	{ xy: xy([ 194, height - 214 ]), available: true, customClass: '', clicked: false, title: 'A - 01' },
	{ xy: xy([ 214, height - 214 ]), available: true, customClass: '', clicked: false, title: 'A - 01' },
	{ xy: xy([ 234, height - 214 ]), available: true, customClass: '', clicked: false, title: 'A - 01' },
	{ xy: xy([ 254, height - 214 ]), available: true, customClass: '', clicked: false, title: 'A - 01' },
	{ xy: xy([ 274, height - 214 ]), available: true, customClass: '', clicked: false, title: 'A - 01' },
	{ xy: xy([ 294, height - 214 ]), available: true, customClass: '', clicked: false, title: 'A - 01' },
	{ xy: xy([ 194, height - 234 ]), available: true, customClass: '', clicked: false, title: 'A - 01' },
	{ xy: xy([ 214, height - 234 ]), available: true, customClass: '', clicked: false, title: 'A - 01' },
	{ xy: xy([ 234, height - 234 ]), available: true, customClass: '', clicked: false, title: 'A - 01' },
	{ xy: xy([ 254, height - 234 ]), available: true, customClass: '', clicked: false, title: 'A - 01' },
	{ xy: xy([ 274, height - 234 ]), available: true, customClass: '', clicked: false, title: 'A - 01' },
	{ xy: xy([ 294, height - 234 ]), available: true, customClass: '', clicked: false, title: 'A - 01' },
	{ xy: xy([ 194, height - 254 ]), available: true, customClass: '', clicked: false, title: 'A - 01' },
	{ xy: xy([ 214, height - 254 ]), available: true, customClass: '', clicked: false, title: 'A - 01' },
	{ xy: xy([ 234, height - 254 ]), available: true, customClass: '', clicked: false, title: 'A - 01' },
	{ xy: xy([ 254, height - 254 ]), available: true, customClass: '', clicked: false, title: 'A - 01' },
	{ xy: xy([ 274, height - 254 ]), available: true, customClass: '', clicked: false, title: 'A - 01' },
	{ xy: xy([ 294, height - 254 ]), available: true, customClass: '', clicked: false, title: 'A - 01' },
	{ xy: xy([ 194, height - 274 ]), available: true, customClass: '', clicked: false, title: 'A - 01' },
	{ xy: xy([ 214, height - 274 ]), available: true, customClass: '', clicked: false, title: 'A - 01' },
	{ xy: xy([ 234, height - 274 ]), available: true, customClass: '', clicked: false, title: 'A - 01' },
	{ xy: xy([ 254, height - 274 ]), available: true, customClass: '', clicked: false, title: 'A - 01' },
	{ xy: xy([ 274, height - 274 ]), available: true, customClass: '', clicked: false, title: 'A - 01' },
	{ xy: xy([ 294, height - 274 ]), available: true, customClass: '', clicked: false, title: 'A - 01' },
	{ xy: xy([ 194, height - 294 ]), available: true, customClass: '', clicked: false, title: 'A - 01' },
	{ xy: xy([ 214, height - 294 ]), available: true, customClass: '', clicked: false, title: 'A - 01' },
	{ xy: xy([ 234, height - 294 ]), available: true, customClass: '', clicked: false, title: 'A - 01' },
	{ xy: xy([ 254, height - 294 ]), available: true, customClass: '', clicked: false, title: 'A - 01' },
	{ xy: xy([ 274, height - 294 ]), available: true, customClass: '', clicked: false, title: 'A - 01' },
	{ xy: xy([ 294, height - 294 ]), available: true, customClass: '', clicked: false, title: 'A - 01' },
	{ xy: xy([ 194, height - 314 ]), available: true, customClass: '', clicked: false, title: 'A - 01' },
	{ xy: xy([ 214, height - 314 ]), available: true, customClass: '', clicked: false, title: 'A - 01' },
	{ xy: xy([ 234, height - 314 ]), available: true, customClass: '', clicked: false, title: 'A - 01' },
	{ xy: xy([ 254, height - 314 ]), available: true, customClass: '', clicked: false, title: 'A - 01' },
	{ xy: xy([ 274, height - 314 ]), available: true, customClass: '', clicked: false, title: 'A - 01' },
	{ xy: xy([ 294, height - 314 ]), available: true, customClass: '', clicked: false, title: 'A - 01' },
	{ xy: xy([ 194, height - 334 ]), available: true, customClass: '', clicked: false, title: 'A - 01' },
	{ xy: xy([ 214, height - 334 ]), available: true, customClass: '', clicked: false, title: 'A - 01' },
	{ xy: xy([ 234, height - 334 ]), available: true, customClass: '', clicked: false, title: 'A - 01' },
	{ xy: xy([ 254, height - 334 ]), available: true, customClass: '', clicked: false, title: 'A - 01' },
	{ xy: xy([ 274, height - 334 ]), available: true, customClass: '', clicked: false, title: 'A - 01' },
	{ xy: xy([ 294, height - 334 ]), available: true, customClass: '', clicked: false, title: 'A - 01' }
];

/**
 * 
 * TODO: conectar ao serviço do banco
 * @param  {array} list - Lista de assentos no padrão [ { xy: xy([ 294, height - 334 ]), available: true, customClass: '', clicked: false, title: 'A - 01' } ] 
 * 
 */

 markers = []

function insertSeats(list) {
	list.forEach(function(value) {
		var marker = L.marker(value.xy, {
			icon: markerIcon,
			customClass: value.customClass,
			available: value.available,
			clicked: value.clicked,
			title: value.title,
			rowname: value.rowname,
			clickable: true,
			draggable: true
		});

		marker.on('click', onClick)
			.addTo(map)
			.bindPopup(value.title)
			.on('mouseover', function(e) {
				this.openPopup();
			})
			.on('mouseout', function(e) {
				this.closePopup();
			})
			.on('drag', function(e) {})
			.on('dragstart', function(e) {
				console.log('marker dragstart event');
			})
			.on('dragend', function(e) {
				console.log('marker dragend event');
			});

			this.markers.push(marker);

	});
}


/**
 * Modo edição: add assentos para edição
 * Modo compra: reserva assento
 * @param  {} e
 */

 var markersToEdit = [];


 var g;
function onClick(e) {
	if (e.target.options.clicked === true) {

		g = e;
		
		e.target.options.clicked = false;
		e.target._icon.classList.remove('seat__clicked');
		let index = markersToEdit
			.map(function(x) {
				return JSON.stringify(x.containerPoint);
			})
			.indexOf(JSON.stringify(e.containerPoint));

		if (index != -1) {
			markersToEdit.splice(index, 1);
		}
	} else {

		g = e;

		e.target.options.clicked = true;
		e.target._icon.classList.add('seat__clicked');
		markersToEdit.push(e);
	}
	// console.log(markersToEdit);


	updateFirstName();
	document.getElementById('markers_quantity').innerText = markersToEdit.length; 
	sidebarEdit.show();
  console.log(e);
}
/**
 * Retorna lista de assentos
 */
function getMarkers() {
	var markersList = map._layers;

	return markersList;
}

function getMarkersSorted() {
	var list = [];
	markersList = getMarkers();

	for (var key in markersList) {
		if (markersList.hasOwnProperty(key)) {
			list.push(markersList[key]);
		}
	}

	list = list.filter((x) => x !== undefined);
	list = list.slice(2,);
	return list;
}

function moveMarker(marker, x, y) {

}

function getXY(markersList) {
	var list = [];

	for (var key in markersList) {
		if (markersList.hasOwnProperty(key)) {
			list.push(markersList[key]._latlng);
		}
	}
	list = list.filter((x) => x !== undefined);
	return list;
}

function checkYaxis(markerLists) {
	return markerLists.map((x) => x.lat);
}

// Funções relacionadas com add de assento


document.getElementById('enable-seats').onchange = function() {
	document.getElementById('initial-value').disabled = !this.checked;
	document.getElementById('steps-quantity').disabled = !this.checked;
};


/**
 * Aplica os valores do formulário para a inclusão de assentos
 */
function apply() {
	var span = document.getElementById('result');
	span.innerHTML = '';

	var quantityOfColumns = document.getElementById('seats-quantity').value;
	var rowName = document.getElementById('row-name').value;
	var steps = document.getElementById('steps-quantity').value;
	var initialValue = document.getElementById('initial-value').value;

	var markersExample = [];

	initialValue == '' ? (initialValue = parseInt(0)) : (initialValue = parseInt(initialValue));
	steps == '' ? (steps = parseInt(1)) : (steps = parseInt(steps));

	for (var i = 0; i < quantityOfColumns; i++) {
		seatNumber = initialValue + (i == 0 ? i : i * steps);
		var y = { title: rowName + ' - ' + seatNumber };
		markersExample.push(y);
	}

	markersExample.forEach((x) => (span.innerHTML += x.title + ', '));

	span = markersExample;
}

// insertSeats(pointsForJson);

L.easyButton( 'fa fa-edit', function(){
  sidebarEdit.toggle();
}).addTo(map);


var sidebarEdit = L.control.sidebar('sidebar_edit', {
	position: 'right',
	closeButton: true,
	autoPan: false,
});

var sidebarCreate = L.control.sidebar('sidebar_create', {
	position: 'right',
	closeButton: true,
	autoPan: false
})

map.addControl(sidebarEdit);
map.addControl(sidebarCreate);

document.getElementById('move_left').onclick = function() {

	var value = document.getElementById('move_quantity').value;

	value == '' ? (value = parseInt(1)) : (value = parseInt(value));

	if (markersToEdit.length > 0) {
		markersToEdit.map(x => 
			x.sourceTarget.slideTo([x.sourceTarget._latlng.lat, x.sourceTarget._latlng.lng - value], {duration: 1, keepAtCenter: false}
		))
	}
};

document.getElementById('move_right').onclick = function() {

	var value = document.getElementById('move_quantity').value;

	value == '' ? (value = parseInt(1)) : (value = parseInt(value));

	if (markersToEdit.length > 0) {
		markersToEdit.map(x => 
			x.sourceTarget.slideTo([x.sourceTarget._latlng.lat, x.sourceTarget._latlng.lng + value], {duration: 1, keepAtCenter: false}
		))
	}
};

document.getElementById('move_up').onclick = function() {

	var value = document.getElementById('move_quantity').value;

	value == '' ? (value = parseInt(1)) : (value = parseInt(value));

	if (markersToEdit.length > 0) {
		markersToEdit.map(x => 
			x.sourceTarget.slideTo([x.sourceTarget._latlng.lat + value, x.sourceTarget._latlng.lng ], {duration: 1, keepAtCenter: false}
		))
	}
};

document.getElementById('move_down').onclick = function() {

	var value = document.getElementById('move_quantity').value;

	value == '' ? (value = parseInt(1)) : (value = parseInt(value));

	if (markersToEdit.length > 0) {
		markersToEdit.map(x => 
			x.sourceTarget.slideTo([x.sourceTarget._latlng.lat - value, x.sourceTarget._latlng.lng ], {duration: 1, keepAtCenter: false}
		))
	}
};
document.getElementById('reset_markers').onclick = function() {

	if (markersToEdit.length > 0) {
		markersToEdit.map(x => 
			x.sourceTarget.slideTo([x.latlng.lat, x.latlng.lng ], {duration: 1, keepAtCenter: false}
		))
	}
};
document.getElementById('delete_markers').onclick = function() {

	if (markersToEdit.length > 0) {
		markersToEdit.map(
			x => map.removeLayer(x.sourceTarget)
		)

		markersToEdit = [];
		document.getElementById('markers_quantity').innerText = markersToEdit.length; 
	}
};
document.getElementById('accessible_markers').onclick = function() {

	if (markersToEdit.length > 0) {
		markersToEdit.map(
			x => {
				if (x.sourceTarget._icon.classList.contains('seat__accessibility')) {
						x.sourceTarget._icon.classList.remove('seat__accessibility')
					} else {	
						x.sourceTarget._icon.classList.add('seat__accessibility')
						x.sourceTarget._icon.classList.remove('seat__clicked')
						x.sourceTarget._icon.classList.add('seat__clicked')
				}
			}
		)
	}
};
document.getElementById('delete_markers').onclick = function() {

	if (markersToEdit.length > 0) {
		markersToEdit.map(
			x => map.removeLayer(x.sourceTarget)
		)

		markersToEdit = [];
		document.getElementById('markers_quantity').innerText = markersToEdit.length; 
	}
};
/**
 * Abre sidebar de criação de assento ao clicar no icone
 * @param  {} '#map>div.leaflet-control-container>div.leaflet-top.leaflet-left>div.leaflet-draw.leaflet-control>div>div>a'
 * @param  {} .onclick=function(
 */
document.querySelector('#map > div.leaflet-control-container > div.leaflet-top.leaflet-left > div.leaflet-draw.leaflet-control > div > div > a').onclick = function() {
	sidebarCreate.show();	
};
/**
 * TODO: Editar multiplas fileiras
 */


// function updateListToEdit() {
	
// 	document.getElementById('seats_to_edit').innerHTML = ''; 
	
// 	markersToEdit.map(x => {
// 		document.getElementById('seats_to_edit').innerHTML += 
// 			'<div class="form-inline mt-2">' +
// 			'<label class="mb-2" for="">Nome do assento: ' + x.sourceTarget.options.title +'</label>' +
// 			'<input class="input-small" id="row-name" type="text" placeholder="Novo nome (Ex: AA 03)">'+
// 		'</div>'
// 	});
// }

/**
 * Atualiza nome do primeiro selecionado na ferramenta de edição
 */
function updateFirstName() {
	document.getElementById('seat_name').innerText = '' + markersToEdit[0].sourceTarget.options.title;
}


document.getElementById('update_first_seat').onclick = function() {
	markersToEdit[0].sourceTarget.options.title = document.getElementById('new_seat_name').value;

	updateFirstName();
};

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

