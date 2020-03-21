var CustomleafletMap={
 tiles:"",
 printer:"",
 mymap:"",
 geojson:"",
 featuresLayer:"",
 ProvData:"",
 geojsonMarkerOptions:"",
_initialzation:function(){
    const attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors';
        tiles=L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png?',{attribution});
        var mapOptions = {
                    center: [55.585901, -105.750596],
                    zoom: 4,
                    editable:true,
                    zoomControl: false
                 },
        mymap = new L.map('mymapid', mapOptions) // Creating a map object
         L.control.zoom({
              maxZoom: 18,
              position:'topright'
         }).addTo(mymap),
            L.control.scale({
              position:'topleft'
            }).addTo(mymap),

            L.control.pan({
              position:'topright'
            }).addTo(mymap),

            L.easyButton('fa-arrows-alt', function()
            {
            mymap.setView([55.585901, -105.750596],4);
          }).addTo(mymap),
            tiles.addTo(mymap),

             printer = L.easyPrint({
                  tileLayer: tiles,
                  sizeModes: ['Current'],
                  filename: 'myMap',
                  exportOnly: true,
                  hidden:true,
                  hideControlContainer: true
            }).addTo(mymap),
            myLayer = L.geoJSON(ProvData),
            myLayer.addData(ProvData).addTo(mymap),
            geojson = L.geoJson(CanData, {
             // style: this.style,
              onEachFeature: this.onEachFeature
            }).addTo(mymap),
            geojsonMarkerOptions = {
             radius: 10,
             fillColor: "#67363A",
             color: "#000",
             weight: 1,
             opacity: 1,
             fillOpacity: 0.8
           }
            featuresLayer = new L.geoJSON(ProvData, {
               pointToLayer: function(feature, latlng) {
                 //console.log(latlng);
                  var ciclemarker=  L.circleMarker(latlng,geojsonMarkerOptions).addTo(mymap);
                  var marker=L.marker(latlng, {icon: L.icon.glyph({ prefix: 'glyphicon', glyph: 'adjust' }) }).addTo(mymap);
                 marker.bindPopup('<p align=center>' + '<strong>Short: </strong>'+  feature.properties.short + '<br/>' + '<strong>Province: </strong>' + feature.properties.Name + '<br/>' + '<strong>Population: </strong>' + feature.properties.population);
                 return marker
               }
             })
        return mymap
      },//end initialization function


 _export:function(){
   printer.printMap('CurrentSize', 'MyManualPrint')
 },


 getColor:function(d) {
   return d > 1000 ? '#800026' :
          d > 500  ? '#BD0026' :
          d > 200  ? '#E31A1C' :
          d > 100  ? '#FC4E2A' :
          d > 50   ? '#FD8D3C' :
          d > 20   ? '#FEB24C' :
          d > 10   ? '#FED976' :
                     '#FFEDA0';
 },
 style:function (feature) {
   return {
       fillColor: this.getColor(feature.properties.rank),
       weight: 2,
       opacity: 1,
       color: 'white',
       dashArray: '3',
       fillOpacity: 0.7
   }
 },
 // L.geoJson(CanData, {style:style}).addTo(mymap);

highlightFeature:function(e) {
     layer : e.target,
     layer.setStyle({
       weight: 5,
       color: '#F78181',
       dashArray: '',
       fillOpacity: 0.3
   })
   if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
       layer.bringToFront();
   }
 },
resetHighlight:function(e) {
   geojson.resetStyle(e.target);
 },
 zoomToFeature:function(e) {
   this.mymap.fitBounds(e.target.getBounds());
 },

 onEachFeature:function(feature, layer) {
   layer.on({
       mouseover: this.highlightFeature,
       mouseout: this.resetHighlight,
       click: this.zoomToFeature
   })
 }





}//end


var CustomleaflteMapEdit={
  CreateLine:function (){
    var polylineDrawer = new L.Draw.Polyline(mymap)
        polylineDrawer.enable();
     },
 CreatePolygon:function() {
    var polygonDrawer = new L.Draw.Polygon(mymap);
        polygonDrawer.enable();
  },

  CreateCircle:function(){
    var theRadius;
    var theCenterPt;
    var center;
    var circleDrawer = new L.Draw.Circle(mymap);
    circleDrawer.enable();
  },
  CreateShape:function (ShapeType){
    if (ShapeType=="circle"){
      this.CreateCircle();
     }
     if (ShapeType=="polygon"){
      this.CreatePolygon();
    }
    if (ShapeType=="line"){
      this.CreateLine();
   }
 },
_selectbaseMap:function(valueid,mymap){
  var layer;
  var layerLabels;
  if (layer) {
     mymap.removeLayer(layer);
  }
  layer = L.esri.basemapLayer(valueid).addTo(mymap);
  //console.log(this.value);
}



}
