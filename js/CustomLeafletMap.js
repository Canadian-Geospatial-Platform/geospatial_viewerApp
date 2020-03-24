
var customleafletMap= (function (){
 var markerArray=[],tiles,printer,mymap,geojson,featuresLayer,geojsonMarkerOptions;
  function _initialization(){
    const attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors';
        tiles=L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png?',{attribution});
        var mapOptions = {
                    center: [55.585901, -105.750596],
                    zoom: 4,
                    editable:true,
                    zoomControl: false
                               }
        mymap = new L.map('mymapid', mapOptions) // Creating a map object
         L.control.zoom({
              maxZoom: 18,
              position:'topright'
         }).addTo(mymap)

            L.control.scale({
              position:'topleft'
            }).addTo(mymap)

            L.control.pan({
              position:'topright'
            }).addTo(mymap)

            L.easyButton('fa-arrows-alt', function()
            {
            mymap.setView([55.585901, -105.750596],4);
          }).addTo(mymap),
            tiles.addTo(mymap)

             printer = L.easyPrint({
                  tileLayer: tiles,
                  sizeModes: ['Current'],
                  filename: 'myMap',
                  exportOnly: true,
                  hidden:true,
                  hideControlContainer: true
            }).addTo(mymap)

            myLayer = L.geoJSON(ProvData)
            myLayer.addData(ProvData).addTo(mymap)

            geojson = L.geoJson(CanData, {
             // style: this.style,
              onEachFeature: onEachFeature
            }).addTo(mymap)

            geojsonMarkerOptions = {
             radius: 10,
             fillColor: "#67363A",
             color: "#000",
             weight: 1,
             opacity: 1,
             fillOpacity: 0.8
           }
           // var jsonLayer = L.geoJson(ProvData, {
	         //    onEachFeature: function (feature, layer) {
           //      layer.bindContextMenu({
           //        contextmenu: true,
	         //         contextmenuItems: [{
	         //            text: 'Marker item'
	         //           }]
           //         });
	         //        }
           //      }).addTo(mymap)

            featuresLayer = new L.geoJSON(ProvData, {
               pointToLayer: function(feature, latlng) {
                 //console.log(latlng);
                  var ciclemarker=  L.circleMarker(latlng,geojsonMarkerOptions).addTo(mymap);
                  var marker=L.marker(latlng, {icon: L.icon.glyph({ prefix: 'glyphicon', glyph: 'adjust' }) }).addTo(mymap);
                 marker.bindPopup('<p align=center>' + '<strong>Short: </strong>'+  feature.properties.short + '<br/>' + '<strong>Province: </strong>' + feature.properties.Name + '<br/>' + '<strong>Population: </strong>' + feature.properties.population);
                 return marker
               }
             })
             setMapId(mymap);
        return mymap
      }; //end function


  function setMapId(idmap){
    mymap=idmap;
   }

  function _getMapId(){
    return mymap;
  }

 function getColor(d) {
   return d > 1000 ? '#800026' :
          d > 500  ? '#BD0026' :
          d > 200  ? '#E31A1C' :
          d > 100  ? '#FC4E2A' :
          d > 50   ? '#FD8D3C' :
          d > 20   ? '#FEB24C' :
          d > 10   ? '#FED976' :
                     '#FFEDA0';
 }

 function style(feature) {
   return {
       fillColor: getColor(feature.properties.rank),
       weight: 2,
       opacity: 1,
       color: 'white',
       dashArray: '3',
       fillOpacity: 0.7
   }
 }
 // L.geoJson(CanData, {style:style}).addTo(mymap);

function highlightFeature(e) {
     var layer = e.target;
     layer.setStyle({
       weight: 5,
       color: '#F78181',
       dashArray: '',
       fillOpacity: 0.3
   })
   if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
       layer.bringToFront();
   }
 }

function resetHighlight(e) {
   geojson.resetStyle(e.target);
 }
 function zoomToFeature(e) {
    mymap.fitBounds(e.target.getBounds());
 }

 function onEachFeature(feature, layer) {
   layer.on({
      // mouseover:  highlightFeature,
       mouseout:  resetHighlight,
       click:  zoomToFeature
   })
 }
 function _export(){
   printer.printMap('CurrentSize', 'MyManualPrint')
 }

 function _selectBasemap(valueid,mymap){
   var layer;
   var layerLabels;
   console.log(valueid);
   if (layer) {
     mymap.removeLayer(layer);
   }
   layer = L.esri.basemapLayer(valueid).addTo(mymap);
 };

 function newmarker(k,v){
   var marker=L.marker(k, {icon: L.icon.glyph({ prefix: 'glyphicon', glyph: 'adjust' }) }).addTo(mymap);
   console.log(v);
   marker.bindPopup('<p align=center>' + '<strong>Short: </strong>'+  v.short + '<br/>' + '<strong>Province: </strong>' + v.capital + '<br/>' + '<strong>Population: </strong>' + v.population);
   return marker
 };

 function _MoveMarketSelected(url2,val2){
   map=_getMapId();
   $.getJSON(url2, function (data) {
   $.each(data, function(i, v) {
       if (v.short == val2) {
           var position=new L.LatLng(v.latitude, v.longitude )
           var greenIcon = new L.Icon({
               iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
               shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
               iconSize: [25, 41],
               iconAnchor: [12, 41],
               popupAnchor: [1, -34],
               shadowSize: [41, 41]
             });
             if (markerArray.length===0)  {
                        markerArray.push(position);
                        //console.log(arr);
                        //console.log(markerArray.length);
             }
             else {
               var k=markerArray.pop();
               //console.log(k);
               markerArray.push(position);
               //console.log(position);
                newmarker(k,v);
             }
           L.marker(position, {icon: greenIcon}).addTo(map);
           map.flyTo(position,4);
           return;
       }
   });
     });
 }


 return {
   initialization:_initialization,
   export:_export,
   getMapId:_getMapId,
   MoveMarketSelected:_MoveMarketSelected,
   selectBasemap: _selectBasemap
 };
})();//end


var CustomleaflteMapEdit=(function(){
  var colorSelected,
      layersArray,
      layer,
      editableLayers;
      function showCoordinates (e) {
        alert(e.latlng);
      }

  function zoomIn (e) {
        mymap.zoomIn();
  }
  function zoomOut (e) {
    mymap.zoomOut();
  }
  function _createLine(){
    var polylineDrawer = new L.Draw.Polyline(customleafletMap.getMapId())
        polylineDrawer.enable();
     }
  function addLabel(layer){
     bootbox.prompt({title: "Adding Label",
                    message: "Enter a label to identify the sahpe you draw.",
                    closeButton: true,
                    buttons:{
                      cancel:{
                        label:'<i class="fa fa-times"></i> Cancel'
                      },
                      confirm:{
                        label:'<i class="fa fa-check"></i> Add'
                      }
                    },
                     callback: function putTooltip(result) {
                       if (result !== null){
                         layersArray.bindTooltip(result, {'permanent': true, 'interactive': true, 'direction':'center'});
                       }
                       //layer.bindTooltip(Number.parseFloat(theRadius).toString(), {'permanent': true, 'interactive': true, 'direction':'top'});
                       }
                   });
               }
  function deleteshape(){
    bootbox.confirm({
    title: "Delete confirmation?",
    message: "Do you want to delete?,Please confirm.",
    buttons: {
        cancel: {
            label: '<i class="fa fa-times"></i> No'
        },
        confirm: {
            label: '<i class="fa fa-check"></i> Yes'
        }
    },
    callback: function (result) {
        if (result==true) {
                 layersArray.remove();
               }
    }
  });
  }

  function getinformation(){
    alert((layersArray.getRadius()/1000).toFixed(2));

  }
 function _createPolygon() {
    var polygonDrawer = new L.Draw.Polygon(customleafletMap.getMapId());
        polygonDrawer.enable();
  }
  function _createCircle(){
    var theRadius;
    var theCenterPt;
    var center;
    var circleDrawer = new L.Draw.Circle(customleafletMap.getMapId());
    circleDrawer.enable();
  }
  function _createShape(ShapeType){
    init();
    if (ShapeType=="circle"){
      _createCircle();
     }
     if (ShapeType=="polygon"){
      _createPolygon();
    }
    if (ShapeType=="line"){
      _createLine();
   }
   drawshape();
 }
  function drawshape(){
    mymap.on('draw:created', function (e) {
     console.log("on draw created event");
     console.log(colorSelected);
     if (colorSelected==null) {
       console.log("Vacio");
       colorSelected="Brown"
       }
        layersArray=e.layer;
       var type = e.layerType;
           layer = e.layer;
           e.layer.setStyle({color: colorSelected});
           console.log(type);

             editableLayers.addLayer(layer);
             layersArray.addTo( editableLayers);
             layersArray.bindContextMenu({
               contextmenu: true,
                 contextmenuWidth: 140,
                  contextmenuItems: [{
                     text: 'Show coordinates',
                      callback: showCoordinates
                     },
                      '-', {
                           text: 'Zoom in',
                             callback: zoomIn
                            },{
                               text: 'Zoom out',
                                 callback: zoomOut
                               },{
                                 text:'Get Information',
                                 callback: getinformation
                               },
                                 '-',{
                                   text: 'Delete',
                                   callback:deleteshape
                                 },{
                                   text: 'Add label',
                                   callback:addLabel
                                 }

                              ]
                });
                  if (type=='circle'){
                    theRadius = layer.getRadius()/1000;
                    var _radius=Math.round(theRadius*(Math.pow(10,3)))/(Math.pow(10,3));
                    console.log(_radius.toFixed(2) + " Kms");
                  //  layersArray.bindTooltip( _radius.toFixed(2) + " Kms", {'permanent': true, 'interactive': true, 'direction':'top', 'className': "my-label"});
         }
         //   if (type=='circle'){
         //     theCenterPt = layer.getLatLng();
         //     center = [theCenterPt.lng,theCenterPt.lat];
         //     theRadius = layer.getRadius();
         //     editableLayers.addLayer(layer);
         //     group1.addLayer(layer);
         //     mymap.addLayer(group1);
         //    var circle = L.circle(theCenterPt, theRadius,{units: 'meters'}).addTo(editableLayers);
         //    bootbox.prompt({title: "Any information?", closeButton: false, callback: putTooltip});
         //      function putTooltip(result) {
         //    circle.bindTooltip(result, {'permanent': true, 'interactive': true});
         //    }
         //   //circle.enableEdit();
         //   if (mymap.hasLayer(group1)) {
         //     console.log("Cirle Draw to delete");
         //     mymap.removeLayer(group1);
         //   }
         //   circle.on('dblclick', L.DomEvent.stop).on('dblclick', circle.toggleEdit);
         //  circle.on('click', function (e) {
         //    circle.enableEdit();
         //       if ((e.originalEvent.ctrlKey || e.originalEvent.metaKey) && this.editEnabled()) {
         //         this.editor.newHole(e.latlng);
         //       }
         //   });
         // };//type circle
          mymap.addLayer(layer);
     });
  }
  function _dropdownColor(){
    _colors=$('._select_color_drop li');
    var color_text
    //console.log(_colors);
        for (var i = _colors.length - 1; i >= 0; i--) {
            $(_colors[i]).click(function(){
                var color_text = $(this).find('span').attr('_text_display');
                var elemnt = $(this).closest('._select_color_drop').prev();
                elemnt.find('span.color').remove();
                $(this).find('span').clone().appendTo(elemnt);
                var contents = $(elemnt).contents();
                if (contents.length > 0) {
                    if (contents.get(0).nodeType == Node.TEXT_NODE) {
                        $(elemnt).html(color_text).append(contents.slice(1));
                    }
                }
                if($('[name=_color]').val() == undefined){
                    elemnt.next().append("<input type='hidden' name='_color' value='"+color_text+"'>");
                }else{
                    $('[name=_color]').val(color_text);
                }

                colorSelected = color_text
                console.log(colorSelected);
            })
        };
      }
      function init(){
        editableLayers =  new L.FeatureGroup();
        var group1= new L.FeatureGroup() ;
        mymap.addLayer(editableLayers);
      }
 return {
 dropdownColor: _dropdownColor,
 CreateShape:_createShape
};
})();
