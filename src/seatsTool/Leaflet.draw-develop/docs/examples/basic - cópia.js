var yx = L.latLng;

var xy = function(x, y) {
	if (L.Util.isArray(x)) {
		// When doing xy([x, y]);
		return yx(x[1], x[0]);
	}
	return yx(y, x); // When doing xy(x, y);
};

function onMarkerClick(itemsID) {
	debugger;
	return function(ev) {
		window.location.href = 'Items.php?parkid=' + itemsID;
	};
}

var osm;
var map = L.map('map', {
	zoom: 0,
	renderer: L.svg(),
	crs: L.CRS.Simple,
	center: [ 305, 	480 ]
});



L.control.custom({
	position: 'topright',
	content : 			
	'	<select class="form-control" id="teste"> <option>1</option> <option>2</option> <option>3</option> <option>4</option> <option>5</option> </select>',
	classes : 'btn-group-vertical btn-group-sm',
	style   :
	{
			margin: '10px',
			padding: '0px 10px 0 0',
			cursor: 'pointer',
	},
	datas   :
	{
			'foo': 'bar',
	},
	events:
	{
			click: function(data)
			{
					console.log('wrapper div element clicked');
					console.log(data);
			},
			dblclick: function(data)
			{
					console.log('wrapper div element dblclicked');
					console.log(data);
			},
			contextmenu: function(data)
			{
					console.log('wrapper div element contextmenu');
					console.log(data);
			},
	}
})
.addTo(map);




var getColumn = function() {
	return document.getElementById('teste').value;
}

var MyCustomMarker = L.Icon.extend({
	options: {
		shadowUrl: null,
		iconAnchor: new L.Point(12, 12),
		iconSize: new L.Point(15, 15),
		iconUrl: 'https://cdn2.iconfinder.com/data/icons/interface-elements-i/512/Circle-512.png',
		title: getColumn(),	
		draggable: true,
	}
});



var markerIcon = L.icon({
	shadowUrl: null,
	iconAnchor: new L.Point(0, 0),
	iconSize: new L.Point(15, 15),
	iconUrl: 'https://cdn2.iconfinder.com/data/icons/interface-elements-i/512/Circle-512.png'
});

// create the image
var imageUrl = 'data:image/png;base64,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',
	imageBounds = [ [ 0, 0 ], [ 610, 960 ] ];

L.imageOverlay(imageUrl, imageBounds).addTo(map);
var drawnItems = new L.FeatureGroup();
map.addLayer(drawnItems);

// Set the title to show on the polygon button
L.drawLocal.draw.toolbar.buttons.polygon = 'Draw a sexy polygon!';



var drawControl = new L.Control.Draw({
	position: 'topleft',
	draw: {
		polyline: false,
		polygon: true,
		marker: {
			icon: new MyCustomMarker(),
			repeatMode: true,
		},
		rectangle: false
	},
	edit: {
		featureGroup: drawnItems,
		remove: true
	}
});

map.addControl(drawControl);

map.on(L.Draw.Event.CREATED, function(e) {
	var type = e.layerType,
		layer = e.layer;

	if (type == "marker") {
		layer.options.icon.options.title = getColumn();
		layer.options.draggable = true;
		layer.bindPopup(layer.options.icon.options.title);
	} else {
		console.log(layer._latlng);

		var lat = layer._latlng.lat;
		var lng = layer._latlng.lng;

		var quantityOfColumns = document.getElementById('seats-quantity').value;
		var rowName = document.getElementById('row-name').value;

		var markers = [];

		// debugger
		for (var i = 0; i <= quantityOfColumns; i++) {
			var y = {xy: xy([ lng + (i * 20)	, lat ]), class: 'available', title: rowName + ' - ' + i, count: i}
			markers.push(y);
		}

		
		markers.forEach(function(value) {
			console.log(value);

			L.marker(value.xy, {
				icon: markerIcon,
				name: 'Connaught Place',
				type: 'Neighbourhood',
				customClass: value.customClass,
				title: value.title,
				clickable: true,
				draggable: true
			})
				.on('click', onClick)
				.addTo(map)
				.bindPopup(value.title)
				.on('mouseover', function(e) {
					this.openPopup();
				})
				.on('mouseout', function(e) {
					this.closePopup();
				});
		});

		layer.parentNode.removeChild();
	}

	

	drawnItems.addLayer(layer);
});

function saveIdIW() {
	var sName = $('#shapeName').val();
	var sDesc = $('#shapeDesc').val();

	var drawings = drawnItems.getLayers();  //drawnItems is a container for the drawn objects
	drawings[drawings.length - 1].title = sName;
	drawings[drawings.length - 1].content = sDesc;

	if (idIW) {
		 map.closePopup();
	}
}

var height = map._lastCenter.lat * 2;

var pointsForJson = [
	{ xy: xy([ (194)	, (height - 112) ]), class: 'available', title: 'A - 01',  },
	{ xy: xy([ (214)	, (height - 112) ]), class: 'available', title: 'A - 01',  },
	{ xy: xy([ (234)	, (height - 112) ]), class: 'available', title: 'A - 01',  },
	{ xy: xy([ (254)	, (height - 112) ]), class: 'available', title: 'A - 01',  },
	{ xy: xy([ (274)	, (height - 112) ]), class: 'available', title: 'A - 01',  },
	{ xy: xy([ (294)	, (height - 112) ]), class: 'available', title: 'A - 01',  },
	{ xy: xy([ (194)	, (height - 134) ]), class: 'available', title: 'A - 01',  },
	{ xy: xy([ (214)	, (height - 134) ]), class: 'available', title: 'A - 01',  },
	{ xy: xy([ (234)	, (height - 134) ]), class: 'available', title: 'A - 01',  },
	{ xy: xy([ (254)	, (height - 134) ]), class: 'available', title: 'A - 01',  },
	{ xy: xy([ (274)	, (height - 134) ]), class: 'available', title: 'A - 01',  },
	{ xy: xy([ (294)	, (height - 134) ]), class: 'available', title: 'A - 01',  },
	{ xy: xy([ (194)	, (height - 154) ]), class: 'available', title: 'A - 01',  },
	{ xy: xy([ (214)	, (height - 154) ]), class: 'available', title: 'A - 01',  },
	{ xy: xy([ (234)	, (height - 154) ]), class: 'available', title: 'A - 01',  },
	{ xy: xy([ (254)	, (height - 154) ]), class: 'available', title: 'A - 01',  },
	{ xy: xy([ (274)	, (height - 154) ]), class: 'available', title: 'A - 01',  },
	{ xy: xy([ (294)	, (height - 154) ]), class: 'available', title: 'A - 01',  },
	{ xy: xy([ (194)	, (height - 174) ]), class: 'available', title: 'A - 01',  },
	{ xy: xy([ (214)	, (height - 174) ]), class: 'available', title: 'A - 01',  },
	{ xy: xy([ (234)	, (height - 174) ]), class: 'available', title: 'A - 01',  },
	{ xy: xy([ (254)	, (height - 174) ]), class: 'available', title: 'A - 01',  },
	{ xy: xy([ (274)	, (height - 174) ]), class: 'available', title: 'A - 01',  },
	{ xy: xy([ (294)	, (height - 174) ]), class: 'available', title: 'A - 01',  },
	{ xy: xy([ (194)	, (height - 194) ]), class: 'available', title: 'A - 01',  },
	{ xy: xy([ (214)	, (height - 194) ]), class: 'available', title: 'A - 01',  },
	{ xy: xy([ (234)	, (height - 194) ]), class: 'available', title: 'A - 01',  },
	{ xy: xy([ (254)	, (height - 194) ]), class: 'available', title: 'A - 01',  },
	{ xy: xy([ (274)	, (height - 194) ]), class: 'available', title: 'A - 01',  },
	{ xy: xy([ (294)	, (height - 194) ]), class: 'available', title: 'A - 01',  },
	{ xy: xy([ (194)	, (height - 214) ]), class: 'available', title: 'A - 01',  },
	{ xy: xy([ (214)	, (height - 214) ]), class: 'available', title: 'A - 01',  },
	{ xy: xy([ (234)	, (height - 214) ]), class: 'available', title: 'A - 01',  },
	{ xy: xy([ (254)	, (height - 214) ]), class: 'available', title: 'A - 01',  },
	{ xy: xy([ (274)	, (height - 214) ]), class: 'available', title: 'A - 01',  },
	{ xy: xy([ (294)	, (height - 214) ]), class: 'available', title: 'A - 01',  },
	{ xy: xy([ (194)	, (height - 234) ]), class: 'available', title: 'A - 01',  },
	{ xy: xy([ (214)	, (height - 234) ]), class: 'available', title: 'A - 01',  },
	{ xy: xy([ (234)	, (height - 234) ]), class: 'available', title: 'A - 01',  },
	{ xy: xy([ (254)	, (height - 234) ]), class: 'available', title: 'A - 01',  },
	{ xy: xy([ (274)	, (height - 234) ]), class: 'available', title: 'A - 01',  },
	{ xy: xy([ (294)	, (height - 234) ]), class: 'available', title: 'A - 01',  },
	{ xy: xy([ (194)	, (height - 254) ]), class: 'available', title: 'A - 01',  },
	{ xy: xy([ (214)	, (height - 254) ]), class: 'available', title: 'A - 01',  },
	{ xy: xy([ (234)	, (height - 254) ]), class: 'available', title: 'A - 01',  },
	{ xy: xy([ (254)	, (height - 254) ]), class: 'available', title: 'A - 01',  },
	{ xy: xy([ (274)	, (height - 254) ]), class: 'available', title: 'A - 01',  },
	{ xy: xy([ (294)	, (height - 254) ]), class: 'available', title: 'A - 01',  },
	{ xy: xy([ (194)	, (height - 274) ]), class: 'available', title: 'A - 01',  },
	{ xy: xy([ (214)	, (height - 274) ]), class: 'available', title: 'A - 01',  },
	{ xy: xy([ (234)	, (height - 274) ]), class: 'available', title: 'A - 01',  },
	{ xy: xy([ (254)	, (height - 274) ]), class: 'available', title: 'A - 01',  },
	{ xy: xy([ (274)	, (height - 274) ]), class: 'available', title: 'A - 01',  },
	{ xy: xy([ (294)	, (height - 274) ]), class: 'available', title: 'A - 01',  },
	{ xy: xy([ (194)	, (height - 294) ]), class: 'available', title: 'A - 01',  },
	{ xy: xy([ (214)	, (height - 294) ]), class: 'available', title: 'A - 01',  },
	{ xy: xy([ (234)	, (height - 294) ]), class: 'available', title: 'A - 01',  },
	{ xy: xy([ (254)	, (height - 294) ]), class: 'available', title: 'A - 01',  },
	{ xy: xy([ (274)	, (height - 294) ]), class: 'available', title: 'A - 01',  },
	{ xy: xy([ (294)	, (height - 294) ]), class: 'available', title: 'A - 01',  },
	{ xy: xy([ (194)	, (height - 314) ]), class: 'available', title: 'A - 01',  },
	{ xy: xy([ (214)	, (height - 314) ]), class: 'available', title: 'A - 01',  },
	{ xy: xy([ (234)	, (height - 314) ]), class: 'available', title: 'A - 01',  },
	{ xy: xy([ (254)	, (height - 314) ]), class: 'available', title: 'A - 01',  },
	{ xy: xy([ (274)	, (height - 314) ]), class: 'available', title: 'A - 01',  },
	{ xy: xy([ (294)	, (height - 314) ]), class: 'available', title: 'A - 01',  },
	{ xy: xy([ (194)	, (height - 334) ]), class: 'available', title: 'A - 01',  },
	{ xy: xy([ (214)	, (height - 334) ]), class: 'available', title: 'A - 01',  },
	{ xy: xy([ (234)	, (height - 334) ]), class: 'available', title: 'A - 01',  },
	{ xy: xy([ (254)	, (height - 334) ]), class: 'available', title: 'A - 01',  },
	{ xy: xy([ (274)	, (height - 334) ]), class: 'available', title: 'A - 01',  },
	{ xy: xy([ (294)	, (height - 334) ]), class: 'available', title: 'A - 01',  },
];



pointsForJson.forEach(function(value) {

	L.marker(value.xy, {
		icon: markerIcon,
		name: 'Connaught Place',
		type: 'Neighbourhood',
		customClass: value.customClass,
		title: value.title,
		clickable: true,
		draggable: true
	})
		.on('click', onClick)
		.addTo(map)
		.bindPopup(value.title)
		.on('mouseover', function(e) {
			this.openPopup();
		})
		.on('mouseout', function(e) {
			this.closePopup();
		});
});

function onClick(e) {
	console.log(e);
}
