
var CustomleafletMap={
 tiles:"",
 printer:"",
 mymap:"",
_initialzation:function(){
    const attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors';
        tiles=L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png?',{attribution});
        var mapOptions = {
                    center: [55.585901, -105.750596],
                    zoom: 4,
                    editable:true,
                    zoomControl: false
                 }
        mymap = new L.map('mymapid', mapOptions); // Creating a map object
         L.control.zoom({
              maxZoom: 18,
              position:'topright'
         }).addTo(mymap);
            L.control.scale({
              position:'topleft'
            }).addTo(mymap);

            L.control.pan({
              position:'topright'
            }).addTo(mymap);

            L.easyButton('fa-arrows-alt', function()
            {
            mymap.setView([55.585901, -105.750596],4);
            }).addTo(mymap);
            tiles.addTo(mymap);

             printer = L.easyPrint({
                  tileLayer: tiles,
                  sizeModes: ['Current'],
                  filename: 'myMap',
                  exportOnly: true,
                  hidden:true,
                  hideControlContainer: true
            }).addTo(mymap);
        return mymap;
      },
 _export:function(){
   printer.printMap('CurrentSize', 'MyManualPrint')
 }
  };


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
 }




}
