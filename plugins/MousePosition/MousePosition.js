// Descripcion General del Plugin.
// * * * * * * * * * ** * * * * * * 

// MousePosition es un simple control de posicion del puntero del mouse, 
// el cual se puede colocar en el mapa base de Leaflet, y que le permite 
// observar las coordenadas geograficas referidas al codigo EPSG: 4326
// (World Geodetic System 1984) por defecto, de igual manera, permite observar
// las coordenadas relativas referidas a la proyeccion cartografica local 
// con codigo EPSG: 3115 (MAGNA SIRGAS/ Colombia West Zone) mediante una 
// conversion de sistemas coordenadas, para este caso se aplica el modelo
// matematico definido por el I.G.A.C.(Documento "Aspectos practicos 
// de la adopcion del marco geocentrico nacional de referencia MAGNA/SIRGAS
// como datum oficial de colombia") a partir del evento "mousemove";
// El método mousemove () activa el evento mousemove o adjunta una función
// para que se ejecute cuando ocurre un evento mousemove. Cada vez que el 
// usuario mueve el mouse un píxel, ocurre un evento mousemove, de esta forma, 
// permitiendo obtener las coordenadas de cualquier punto de interes
// dentro del elemento selecionado. 

// Este Plugin fue adaptado de Ardhi Lukianto Copyright 2012, 
// disponible en: https://github.com/ardhi/Leaflet.MousePosition 

// Este plugin fue modificado por: Ing. Jhon Edwin Arias Reyes Copyright 2022.
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

// variables 
var character_lat = "<b>Latitud: </b>" + ' ';
var character_lat_sto = "° N"
var character_lng = "<b>Longitud: </b>";
var character_lng_sto = "° W";
var character_norte = "<b>Norte: </b>"
var character_este = "<b>Este: </b>"
var character_unidad = " m"


// procesos

L.Control.MousePosition = L.Control.extend({
  // parametros por defecto del control L.control.mousePosition()
  options: {
    position: 'bottomleft',
    separator: ' | ',
    emptyString: 'Coordenadas No Definidas',
    lngFirst: false,
    numDigits: 7,
    lngFormatter: undefined,
    latFormatter: undefined,    
    prefix: ""
  },
  // Conexion DOM
  onAdd: function (map) {
    this._container = L.DomUtil.create('div', 'leaflet-control-mouseposition');
    L.DomEvent.disableClickPropagation(this._container);
    map.on('mousemove', this._onMouseMove, this);
    this._container.innerHTML=this.options.emptyString;
    return this._container;
  },
  // Evento mousemove
  onRemove: function (map) {
    map.off('mousemove', this._onMouseMove)
  },
  // captura de informacion del evento declarado; mousemove(e)
  _onMouseMove: function (e) {
    // identifica tipo de coordenadas definido por el usuario
    var tipo_coordenada= document.getElementById("tipo-cod");  

    // sentencia condicional que muestra las coordenadas del mouse
    // de acuerdo al valor retornado en tipo_coordenada   
    
    // si se elige coordenadas Elipsoidales
    if(tipo_coordenada.value == 1){     
      var longitud = this.options.lngFormatter ? this.options.lngFormatter(e.latlng.lng) : L.Util.formatNum(e.latlng.lng, this.options.numDigits);      
      var longitud = character_lng + longitud +character_lng_sto;      
      var latitud = this.options.latFormatter ? this.options.latFormatter(e.latlng.lat) : L.Util.formatNum(e.latlng.lat, this.options.numDigits);
      var latitud = character_lat + latitud + character_lat_sto;      
    }
    // si se elige coordenadas Gauss Kruger Origen Oeste
    if(tipo_coordenada.value == 2){
      // Parametros WGS84
      var semi_a = 6378137;
      var semi_b = 6356752.31414;
      var pri_exc = ((Math.pow(semi_a,2))-(Math.pow(semi_b,2)))/(Math.pow(semi_a,2));
      var seg_exc = ((Math.pow(semi_a,2))-(Math.pow(semi_b,2)))/(Math.pow(semi_b,2));

      // parametros Origen Cartografico Gauss Kruger Origen Oeste
      var gk_lat_org = (4+(35/60)+(46.3215/3600))*(Math.PI/180);      
      var gk_lng_org = ((77+(4/60)+(39.0285/3600))*(-1))*(Math.PI/180);
      var norte_falsa = 1000000;
      var este_falsa = 1000000;

      // punto de interes
      var longitud = this.options.lngFormatter ? this.options.lngFormatter(e.latlng.lng) : L.Util.formatNum(e.latlng.lng, this.options.numDigits);      
      var longitud_rad= (longitud*(Math.PI/180));
      var latitud = this.options.latFormatter ? this.options.latFormatter(e.latlng.lat) : L.Util.formatNum(e.latlng.lat, this.options.numDigits);      
      var latitud_rad = (latitud*(Math.PI / 180));

      // calculo de terminos auxiliares
      var pl= (longitud_rad - gk_lng_org);
      var pt= Math.tan(latitud_rad);
      var pn2 = (seg_exc* (Math.pow(Math.cos(latitud_rad),2)));
      var pn= (semi_a-semi_b)/(semi_a+semi_b);
      var pN= (semi_a)/(Math.sqrt((1-(pri_exc*Math.pow(Math.sin(latitud_rad),2)))));

      // calculo del arco de meridiano
      var palfa= ((semi_a + semi_b)/2)*(1+((1/4)*Math.pow(pn,2))+((1/64)*Math.pow(pn,4)));
      var pbeta= (((-3/2)*pn)+((9/16)*Math.pow(pn,3))+((-3/32)*Math.pow(pn,5)));
      var py= (((15/16)*Math.pow(pn,2))+((-15/32)*Math.pow(pn,4)));
      var ps= (((-35/48)*Math.pow(pn,3))+((105/256)*Math.pow(pn,5)));
      var pE= ((315/512)*Math.pow(pn,4));

      // calculo Arco meridiano del punto de interes para la Latitud
      var pGp= (palfa*(latitud_rad+(pbeta*Math.sin(2*latitud_rad))+(py*Math.sin(4*latitud_rad))+(ps*Math.sin(6*latitud_rad))+(pE*Math.sin(8*latitud_rad))));
      // calculo Arco meridiano del punto de origen para la Latitud
      var pGo= (palfa*(gk_lat_org+(pbeta*Math.sin(2*gk_lat_org))+(py*Math.sin(4*gk_lat_org))+(ps*Math.sin(6*gk_lat_org))+(pE*Math.sin(8*gk_lat_org))));

      // calculo parametros de la coordenada Norte del punto de Interes
      var np1= pGp-pGo;
      var np2=((pt/2)*pN*(Math.pow(pl,2))*(Math.pow(Math.cos(latitud_rad),2)));
      var np3= ((pt/24)*pN*(Math.pow(Math.cos(latitud_rad),4))*((5-(Math.pow(pt,2))+(9*pn2)+(4*Math.pow(pn2,4)))*(Math.pow(pl,4))));
      var np4= ((pt/720)*pN*(Math.pow(Math.cos(latitud_rad),6))*((61-(58*Math.pow(pt,2))+(Math.pow(pt,4))+(270*pn2)-(330*Math.pow(pt,2)*pn2))*Math.pow(pl,6)));
      var np5= ((pt/40320)*pN*(Math.pow(Math.cos(latitud_rad),8))*((1385-(3111*Math.pow(pt,2))+(543*Math.pow(pt,4))-(Math.pow(pt,6)))*Math.pow(pl,8)));

      // suma parcial de parametos (DeltaNorte)
      var sdn = (np1+np2+np3+np4+np5); 

      // calculo del valor de la coordenada Norte (m)
      var norte= (norte_falsa + sdn);
      var norte = (Math.round((norte+Number.EPSILON)*1000)/1000);

      // calculo parametros 
      var ep1= (pN*pl* Math.cos(latitud_rad));
      var ep2= ((1/6)*pN*(Math.pow(Math.cos(latitud_rad),3))*((1-(Math.pow(pt,2))+pn2)*Math.pow(pl,3)));
      var ep3= ((1/120)*pN*(Math.pow(Math.cos(latitud_rad),5))*((5-(18*Math.pow(pt,2))+(Math.pow(pt,4))+(14*pn2)-(58*Math.pow(pt,2))*pn2)*Math.pow(pl,5)));
      var ep4= ((1/5040)*pN*(Math.pow(Math.cos(latitud_rad),7))*((61-(479*Math.pow(pt,2))+(179*Math.pow(pt,4))-Math.pow(pt,6))*Math.pow(pl,7)));

      // suma parcial de parametros (DeltaEste)
      var sde= (ep1+ep2+ep3+ep4);

      // calculo del valor de la coordenada Este (m)
      var este= (este_falsa+sde);
      var este= (Math.round((este+Number.EPSILON)*1000)/1000);

      // almacenamiento resultado en cadena             
      var longitud= este;          
      var longitud = character_este + longitud + character_unidad;   
      var latitud = norte;    
      var latitud = character_norte + latitud + character_unidad;
    
      
    };
    // cadena que almacena el resultado    
    $('.datos-mouse').html(latitud +' '+ longitud);
    var value = this.options.lngFirst ? + character_lng + longitud + this.options.separator + latitud :  latitud + this.options.separator + longitud;
    var prefixAndValue = this.options.prefix + ' ' + value;
    this._container.innerHTML = prefixAndValue;
  }
});
// retorno final del plugin
L.Map.mergeOptions({
    positionControl: false
});

L.Map.addInitHook(function () {
    if (this.options.positionControl) {
        this.positionControl = new L.Control.MousePosition();
        this.addControl(this.positionControl);
    }
});

L.control.mousePosition = function (options) {
    return new L.Control.MousePosition(options);
};



