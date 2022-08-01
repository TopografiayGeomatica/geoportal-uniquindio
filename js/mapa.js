// 13: parametros del mapa base 

// coordenadas del centro del mapa y nivel de Zoom por defecto
var map = L.map('map',{center:[4.5545,-75.6607], zoom: 16});
// Capa cartografica base de OSM general.
var osm = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {attribution: "© OpenStreetMap"});
// Implementacion de la clase addLayer para cargar capas cartograficas al elemento "map"
map.addLayer(osm);
// codigo para cambiar la posicion del control de zoom
map.zoomControl.setPosition("topright");

// coordenadas del centro del mapa de geolocalizacion
var mapGeolocalizacion = L.map('mapGeolocalizacion',{center: [3.77, -73.22], zoom: 4});
// capa cartografica base de OSM general.
var osm_mapGeolocalizacion = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png");
// cargamos la capa base de OSM a el contenedor generico de map-geolocalizacion
mapGeolocalizacion.addLayer(osm_mapGeolocalizacion);

// funcion que muestra u oculta el minimapa de geolocalizacion
var mapGeolocalizacion = document.getElementById("mapGeolocalizacion");
var contador = 1
function MostrarGeolocalizacion(){    
    if(contador == 1){
        mapGeolocalizacion.style.visibility = "visible";
        contador = 0;
    }else{
        mapGeolocalizacion.style.visibility = "hidden";
        contador = 1
    }
};

// funcion que muestra la pantalla completa del visorGeografico
var mapId = document.getElementById("map");
function MostrartPantallaCompleta (){
    mapId.requestFullscreen();
};
function SalirPantallaCompleta (){
    document.exitFullscreen();
};

// Codigo para agregar la escala del mapa
var control_escala = L.control.scale({
    metric: true,
    imperial: false,    
});
map.addControl(control_escala);


// implementacion del plugin de mousePosition 
L.control.mousePosition({
    numDigits:7,
}).addTo(map);




