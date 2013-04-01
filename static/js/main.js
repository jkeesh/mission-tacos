$(function(){

  var tacos = []

  String.prototype.hashCode = function() {
    for(var ret = 0, i = 0, len = this.length; i < len; i++) {
      ret = (31 * ret + this.charCodeAt(i)) << 0;
    }
    return ret;
  };

  // Initialize the map
  function initialize() {
    var mapOptions = {
      center: new google.maps.LatLng(37.758636,-122.419088),
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    map = new google.maps.Map(document.getElementById("map-canvas"),
    mapOptions);
  }

  function closeAll(){
    for(var i = 0; i < tacos.length; i++){
      var cur = tacos[i];
      cur.infowindow.close();
    }
  }



  // Add the taco info to the list
  function addToList(tacoInfo){
    var html = "<div class='info-item' data-id='"+tacoInfo.id+"'><div class='name'>";

    html += tacoInfo.info.name;
    html += "</div><div class='addr'>"
    html += tacoInfo.info.addr;
    html += "</div></div>";
    $("#taco-list-info").append(html);

    $(".info-item[data-id='"+tacoInfo.id+"']").click(function(){
        closeAll();
        tacoInfo.infowindow.open(map, tacoInfo.marker);
    })

  }

  // Set the box to open when you click this marker
  function setClickBox(marker, tacoPlace, latLong, id){


    var html = "<div class='info-item' data-id='"+tacoPlace.id+"'><div class='name'>";

    html += tacoPlace.name;
    html += "</div><div class='addr'>";
    html += tacoPlace.addr;
    html += "</div><div class='rating'>";
    html += "Rating: " + "<span class='rr'>None</span> <div class='slider'></div>";
    html += "</div></div>";

    var infowindow = new google.maps.InfoWindow({ 
      content: html,
      size: new google.maps.Size(50,50)
    });




    var taco = {
      info: tacoPlace,
      latLng: latLong,
      marker: marker,
      infowindow: infowindow,
      open: false,
      id: id
    };






    addToList(taco);

    tacos.push(taco);

    google.maps.event.addListener(marker, 'click', function(event) {
      closeAll();
      if(!taco.open){
        infowindow.open(map, marker);

        $( ".slider" ).slider({
            slide: function(event, ui){
              var value = ui.value / 10;
              $this = $(this);
              var $parent = $this.parent();
              var $rating = $parent.find('.rr');
              $rating.html(value);
            },
            stop: function(event, ui){
              var value = ui.value / 10;

              alert(value);
            }
        });
      }else{
        infowindow.close();        
      }
      taco.open = !taco.open;        
    });


  }

  // Add the marker on the map for this place
  function addMarker(tacoPlace, id){
    console.log(tacoPlace);
    var name = tacoPlace.name;
    var myLatlng = new google.maps.LatLng(tacoPlace.lat, tacoPlace.lng);

    var marker = new google.maps.Marker({
        position: myLatlng,
        map: map,
        title: name
    });

    setClickBox(marker, tacoPlace, myLatlng, id);
  }

  function addTacoPlaces(){
    for(var i = 0; i < TACO_PLACES.length; i++){
        addMarker(TACO_PLACES[i], i);
    }
  }

  initialize();
  addTacoPlaces();
  console.log(TACO_PLACES);
});