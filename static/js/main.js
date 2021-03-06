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
    for(var i = 0; i < USER_TACO_INFO.length; i++){
        var cur = USER_TACO_INFO[i];
        if(cur.taco_hash == hash){
            return cur.rating;
        }
    }
    return "None";
  }

  // Get the rating from the JS objects passed in
  function getVisits(hash){
    for(var i = 0; i < USER_TACO_INFO.length; i++){
        var cur = USER_TACO_INFO[i];
        if(cur.taco_hash == hash){
            return cur.num_visits;
        }
    }
    return 0;
  }

  function visitedButton(info){
      console.log(info);

      $("." +info.hash + " .visit-btn").click(function(){

            var $elem = $(this);

            $.ajax({
                type: "POST",
                url: "/add_visit",
                data: {
                    hash: info.hash
                },
                success: function(resp){
                    var $el = $("." +info.hash + " .num-visits");
                    /// Update the number of visits
                    $el.html(resp.message)
                },
                dataType: 'json'
              });

      });
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


  function sortListRating(){
    // function sortUsingNestedText(parent, childSelector, keySelector) {
    //     var items = parent.children(childSelector).sort(function(a, b) {
    //         var vA = $(keySelector, a).text();
    //         var vB = $(keySelector, b).text();
    //         return (vA < vB) ? -1 : (vA > vB) ? 1 : 0;
    //     });
    //     parent.append(items);
    // }
    // Sorting by price can then be done as such:

    // sortUsingNestedText($('#sortThis'), "div", "span.price");

    function getVal(elem){
        var val = $(elem).find('.rr').html();
        if(val == "None"){
            return -1;
        }
        return parseFloat(val);
    }

        var items = $('.info-item-container').sort(function(a, b){

            var vA = getVal(a);
            var vB = getVal(b);

            console.log(vA);
            console.log(vA);


            return (vA < vB) ? 1 : (vA > vB) ? -1 : 0;
        });

        console.log(items);
        $('#taco-list-info').html(items);

  }
  window.sortListRating = sortListRating;

  function sortList(){
    // function sortUsingNestedText(parent, childSelector, keySelector) {
    //     var items = parent.children(childSelector).sort(function(a, b) {
    //         var vA = $(keySelector, a).text();
    //         var vB = $(keySelector, b).text();
    //         return (vA < vB) ? -1 : (vA > vB) ? 1 : 0;
    //     });
    //     parent.append(items);
    // }
    // Sorting by price can then be done as such:

    // sortUsingNestedText($('#sortThis'), "div", "span.price");

        var items = $('.info-item-container').sort(function(a, b){
                console.log("A");
            console.log(a);
            console.log("B");
            console.log(b);

            var vA = parseInt($(a).find('.vv').html());
            var vB = parseInt($(b).find('.vv').html());



            console.log(vA);
            console.log(vA);


            return (vA < vB) ? 1 : (vA > vB) ? -1 : 0;
        });

        console.log(items);
        $('#taco-list-info').html(items);

  }
  window.sortList = sortList;

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
    var html = "<div class='info-item taco-click' data-id='"+info.idx+"'>"

    html += "<div class='name'>";
    html += info.name;
    html += "</div>"

    html += "<div class='addr'>"
    html += info.addr;
    html += "</div>";

    html += "My Rating: " + "<span class='rr'>"+info.rating+"</span>";
    html += "<br/>";
    html += "Visits: " + "<span class='vv'>"+info.num_visits+"</span>";

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
    html += "<div class='visit-wrap'><a href='#' class='btn btn-primary visit-btn'>Visited!</a>Vists: <span class='num-visits'>"+info.num_visits+"</span></div>";
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
          visitedButton(info);
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
        cur.num_visits = getVisits(cur.hash);
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