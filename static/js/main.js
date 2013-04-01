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
    for(var i = 0; i < TACO_PLACES.length; i++){
      var cur = TACO_PLACES[i];
      if(cur.infowindow){
        cur.infowindow.close();
      }
    }
  }

  function getRating(hash){
    for(var i = 0; i < ratings.length; i++){
      var cur = ratings[i];
      if(cur.key == hash){
        return cur.val;
      }
    }
    return "None";
  }

  function makeSliders(info){
//      console.log(info);

      var initialRating = null;
      if(info.rating != "None"){
        initialRating = info.rating;
      }else{
        initialRating = 50;
      }

      console.log(initialRating);

      if($(".slider").slider('instance')){
        $( ".slider" ).slider( "destroy" );
      }

      $( ".slider" ).slider({
            value: initialRating,
            slide: function(event, ui){
              var value = ui.value / 10;
              $this = $(this);
              var $parent = $this.parent();
              var $rating = $parent.find('.rr');
              $rating.html(value);
            },
            stop: function(event, ui){
              var value = ui.value / 10;

              $.ajax({
                type: "POST",
                url: "/save_rating",
                data: {
                    value: value,
                    hash: tacoPlace.hash
                },
                success: function(resp){
                    console.log(resp);
                },
                dataType: 'json'
              });
            }
        });
  }


  // Add the taco info to the list
  function addToList(info){
    var html = "<div class='info-item' data-id='"+info.idx+"'><div class='name'>";

    html += info.name;
    html += "</div><div class='addr'>"
    html += info.addr;
    html += "</div>Rating: " + "<span class='rr'>"+info.rating+"</span>";
    html += "</div>";
    $("#taco-list-info").append(html);

    $(".info-item[data-id='"+info.idx+"']").click(function(){
        closeAll();
        info.infowindow.open(map, info.marker);
        //makeSliders(tacoInfo);
    })

  }

  // Set the box to open when you click this marker
  function getClickBox(info){
    var rating = info.rating;

    var html = "<div class='info-item' data-id='"+info.idx+"'><div class='name'>";

    html += info.name;
    html += "</div><div class='addr'>";
    html += info.addr;
    html += "</div><div class='rating'>";
    html += "Rating: " + "<span class='rr'>"+rating+"</span> <div class='slider'></div>";
    html += "</div></div>";

    var infowindow = new google.maps.InfoWindow({ 
      content: html,
      size: new google.maps.Size(50,50)
    });

    return infowindow;



    // var taco = {
    //   info: tacoPlace,
    //   //latLng: latLong,
    //   marker: marker,
    //   infowindow: infowindow,
    //   open: false,
    //   id: id, 
    //   rating: rating
    // };






    // addToList(taco);

    // tacos.push(taco);

    // google.maps.event.addListener(marker, 'click', function(event) {
    //   closeAll();
    //   if(!taco.open){
    //     infowindow.open(map, marker);
    //     makeSliders();
    //   }else{
    //     infowindow.close();        
    //   }
    //   taco.open = !taco.open;        
    // });


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

    return marker;
  }

  function addTacoPlaces(){
    for(var i = 0; i < TACO_PLACES.length; i++){
        var cur = TACO_PLACES[i];
        cur.idx = i;
        cur.marker = addMarker(cur, i);
        cur.rating = getRating(cur.hash);
        cur.infowindow = getClickBox(cur);
        cur.listDiv = addToList(cur);
    }
    console.log(TACO_PLACES);
  }

  initialize();
  addTacoPlaces();
  console.log(TACO_PLACES);
});