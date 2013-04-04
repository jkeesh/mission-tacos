// var SignupForm = (function() {

//   var register_form = $("form", this.registration_container);
//   var login_form = $("form", this.login_container);

//   var initialize = function(options) {
//     var registration_container = $(options.register_form_container);
//     register_form = $("form", registration_container);
//     var login_container = $(options.login_form_container);
//     login_form = $("form", login_container);
//     console.info(this.login_form);

//     setupEvents();
//   };

//   var submitFormToUrl = function(url, form, success_cb) {
//     $.ajax({
//         type: "POST",
//         url: url,
//         data: $(form).serialize(),
//         success: function(resp){
//             console.info(resp);
//         },
//         dataType: 'json'
//     });
//   };

//   var bindFormAction = function(elem, success_cb) {
//     elem.submit(function(ev) {
//       ev.preventDefault();
//       submitFormToUrl("/login/", this, success_cb);
//     });
//   };

//   var setupEvents = function() {
//     console.info(register_form);
//     bindFormAction(register_form, function(data) {
//         console.info(data);
//     });

//     bindFormAction(login_form, function(data) {
//         console.info(data);
//     });
//   };

//   return {
//     'initialize': initialize
//   }

// })();

$(function(){

  var tacos = [];

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

  // Close all info windows
  function closeAll(){
    for(var i = 0; i < TACO_PLACES.length; i++){
      var cur = TACO_PLACES[i];
      if(cur.infowindow){
        cur.infowindow.close();
      }
    }
  }

  // Get the rating from the JS objects passed in
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
      var initialRating = null;
      if(info.rating != "None"){
        initialRating = info.rating * 10;
      }else{
        initialRating = 50;
      }

      console.log(initialRating);

      $("." +info.hash + " .slider").slider({
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
                    hash: info.hash
                },
                success: function(resp){
                    console.log(resp);
                },
                dataType: 'json'
              });
            }
        });
  }

  function handleRegistrationButton() {
    $("#register-button").bind("click", function(ev){
      ev.preventDefault();
      $("#login-form-container").hide();
      $("#register-form-container").show();
      $(this).hide();
      $("#login-button").show();
      $(".header-error").hide()
    });
    $("#login-button").bind("click", function(ev){
      ev.preventDefault();
      $("#register-form-container").hide();
      $("#login-form-container").show();
      $(this).hide();
      $("#register-button").show();
      $(".header-error").hide()
    });
  }


  // Add the taco info to the list
  function addToList(info){
    var html = "<div class='info-item taco-click' data-id='"+info.idx+"'><div class='name'>";

    html += info.name;
    html += "</div><div class='addr'>"
    html += info.addr;
    html += "</div>My Rating: " + "<span class='rr'>"+info.rating+"</span>";
    html += "</div>";

    var container_html = "<div class='info-item-container'>" + html + "</div>";
    $("#taco-list-info").append(container_html);
  }

  // Set the box to open when you click this marker
  function getClickBox(info){
    var rating = info.rating;

    var html = "<div class='info-item taco-box "+info.hash+"' data-id='"+info.idx+"'><div class='name'>";

    html += info.name;
    html += "</div><div class='addr'>";
    html += info.addr;
    html += "</div><div class='rating'>";
    html += "My Rating: " + "<span class='rr'>"+rating+"</span> <div class='slider'></div>";
    html += "</div></div>";

    var infowindow = new google.maps.InfoWindow({
      content: html,
      size: new google.maps.Size(50,50)
    });

    return infowindow;
  }

  function clickEvents(info){

    // When a taco shop is clicked, focus in
    function showPopup(info){
        closeAll();
        if(!info.open){
          info.infowindow.open(map, info.marker);
          makeSliders(info);
        }else{
          info.infowindow.close();
        }
        info.open = !info.open;
    }

    // For clicking on a marker
    google.maps.event.addListener(info.marker, 'click', function(event) {
        showPopup(info);
    });

    // For clicking on the side list
    $(".taco-click[data-id='"+info.idx+"']").click(function(){
        showPopup(info);
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

        clickEvents(cur);
    }
    console.log(TACO_PLACES);
  }

  initialize();
  addTacoPlaces();
  handleRegistrationButton();
  console.log(TACO_PLACES);

  // SignupForm.initialize({
  //   'register_form_container': '#register-form-container',
  //   'login_form_container': '#login-form-container'
  // });
});