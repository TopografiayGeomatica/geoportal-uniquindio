// 13: parametros del mapa base 

// coordenadas del centro del mapa y nivel de Zoom por defecto
var map = L.map('map',{center:[4.5545,-75.6607], zoom: 16});

// Capa cartografica base de OSM general.
var osm = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {attribution: "© OpenStreetMap"})

// Implementacion de la clase addLayer para cargar capas cartograficas al elemento "map"
map.addLayer(osm);

