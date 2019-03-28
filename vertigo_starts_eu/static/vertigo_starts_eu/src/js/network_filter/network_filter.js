
var currentMap;
var jsonContentData = {};
var markersGlobal = [];
var residenciesGlobal = {};

function parseJSON(jsonObject, map) {

  $(function() {

    var producers = [];

    if ('producers' in jsonObject) {
      producers = jsonObject["producers"];
    }

    var organizations = [];

    if ('organizations' in jsonObject) {
      organizations = jsonObject["organizations"];
    }

    var residencies = [];

    if ('residencies' in jsonObject) {
      residencies = jsonObject["residencies"];
    }

    var persons = [];

    if ('persons' in jsonObject) {
      persons = jsonObject["persons"];
    }

    if (organizations.length > 0) {
      producers = producers.concat(organizations);
    }

    if (residencies.length > 0) {
      producers = producers.concat(residencies);
    }

    if (persons.length > 0) {
      producers = producers.concat(persons);
    }

    var markers = L.markerClusterGroup({showCoverageOnHover: true,
                                        zoomToBoundsOnClick: true,
                                        removeOutsideVisibleBounds: true});

    var detailMarker = document.getElementById("detail-marker");

    detailMarker.style.display = 'none';

    var filterOrgs = [];

    for (var i = 0; i < producers.length; i++) {

      var item = producers[i];

      var lat = item["lat"];
      var lon = item["lon"];

      if ((lat != "null" && lat != null && lat != 0 && lat != undefined) && (lon != "null" && lon != null && lon != 0 && lon != undefined)) {

        filterOrgs.push(item);
      }
    }

    if (filterOrgs.length > 0) {
      producers = filterOrgs;
    }

    for (var i = 0; i < producers.length; i++) {

        var item = producers[i];

        var lat = item["lat"];
        var lon = item["lon"];
        var name = "";

        if ('name' in item) {
          name = item["name"];
        }

        if ('title' in item) {
          name = item["title"];
        }

        var marker = L.marker(new L.LatLng(lat, lon), {  title: name });
        marker.id_value = i;
        marker.title = name;
        marker.on('click', function (e) {

            var id = e.target.id_value;

            var item = producers[id];

            var htmlString = createCardHTML(item);

            detailMarker.innerHTML = htmlString;
            detailMarker.style.display = 'block';
        });

        markers.addLayer(marker);
    }

    map.addLayer(markers);
    markersGlobal.push(markers);

    map.on('click', function(e) {

        detailMarker.style.display = 'none';
    });
  });
}


function changeTags(object, event) {

  event.preventDefault();

  var selections = document.getElementsByClassName("article-box__select-tag-search");

  var contentTags = document.getElementById("section-0");
  contentTags.style.display = 'none';

  contentTags = document.getElementById("section-1");
  contentTags.style.display = 'block';

  var dotsElement = document.getElementById("dots-indicator");
  dotsElement.style.display = 'none';

  if (selections.length > 0) {

    var unselections = document.getElementsByClassName("article-box__unselect-tag-search");

    for (var i = 0; i < selections.length; i++) {

      var selItem = selections[i];
      var textSel = selItem.innerText;

      for (var j = 0; j < unselections.length; j++) {

        var unselItem = unselections[j];
        var textUnsel = unselItem.innerText;

        if (textSel == textUnsel) {

          unselItem.classList.remove("article-box__unselect-tag-search");
          unselItem.classList.add("article-box__select-tag-search");

          break;
        }
      }
    }
  }
}

function createCardHTML(item) {

  var title = "";

  if ('title' in item) {
    title = item["title"];
  }

  if ('name' in item) {
    title = item["name"];
  }

  var description = item["description"].substring(0,50) + "...";
  var city = item["city"];
  var keywords = [];

  if ('keywords' in item) {
    keywords = item["keywords"];
  }

  var location = item["mappable_location"];
  var detaillURL = item["url"];

  var htmlString = "<a href=\"" + detaillURL + "\" target=\"_blank\">";

  if ('card' in item) {
    htmlString += "<div class=\"article-box__hovering-map-card\" style=\"background-image: linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('" + item["card"] + "');background-size:cover;max-width:300px;max-height:300px;width:auto;height:300px;color:white\">";
  } else {
    htmlString += "<div class=\"article-box__hovering-map-card\" style=\"background:lightgray;height:100%;color:white\">";
  }

  htmlString += "<div style=\"padding-top:10%;position:relative\">"
  htmlString += "<center>";

  htmlString += "<div class=\"article-box__title-card-map\">" + title + "</div>";

  if (description != "") {

    htmlString += "<div class=\"article-box__description-card-map\">" + description + "</div><br>";
  } else {

    htmlString += "<br>";
  }

  if (keywords.length > 0) {

    htmlString += "<div class=\"article-box__wrap-tags-map-card\">";
    htmlString += "<div class=\"article-box__single-keyword-card-map\">" + keywords[0] + "</div>";

    if (keywords.length > 1) {
      htmlString += "<div class=\"article-box__keywords-card-map\">" + keywords[1] + "</div>";
    }

    htmlString +="</div><";
  }

  if (location != "" && location != null) {

    htmlString += "<div class=\"article-box__location-card-map\">" + location + "</div>";
  }

  htmlString += "</center>";
  htmlString += "</div></div></a>";

  return htmlString;
}

function createMap() {

  $(function() {

    currentMap = L.map('mapid').setView([47.91, 6.85], 3.2);

    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
            '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
            'Imagery <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox.streets',
        accessToken: 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw',
    }).addTo(currentMap);

  });
}

function showHideChevronTags(object, event) {

  event.preventDefault();

  var id_item = object.id;

  var chevronItem = document.getElementById("chevron-tags");
  var itemsClass = chevronItem.classList;
  var tagsDivContent = document.getElementById("tags-content");

  var openChevron = false;

  for (var i = 0; i < itemsClass.length; i++) {

    if (itemsClass[i].toLowerCase() == 'fa-chevron-down') {

      openChevron = true;
      break;
    }
  }

  if (openChevron) {

    chevronItem.classList.remove("fa-chevron-down");
    chevronItem.classList.add("fa-chevron-up");
    tagsDivContent.style.display = 'block';
  } else {

    chevronItem.classList.remove("fa-chevron-up");
    chevronItem.classList.add("fa-chevron-down");
    tagsDivContent.style.display = 'none';
  }
}

function parseJSONTags(jsonObject) {

    var residencies = jsonObject["residencies"];

    var tags = [];
    for (var i = 0; i < residencies.length; i++) {

      var dict = residencies[i];
      var tagsSingle = dict["keywords"];

      if (tagsSingle.length > 0) {

        tags.push.apply(tags, tagsSingle);
      }
    }

    tags = tags.filter(function(elem, index, self) {
        return index === self.indexOf(elem);
    });

    var counter = document.getElementById("tags-counter");
    counter.innerHTML = residencies.length + (residencies.length == 1 ? " result" : " results");

    globalTags = tags;

    var block = 28;
    var contentTags = document.getElementById("tags-content");

    if (tags.length > 0) {

      var splicedArray = splice_array(tags, block);

      if (splicedArray.length > 0) {

        var arrayTags = splicedArray[0];
        contentTags.innerHTML += "<div id=\"section-0\" style=\"display:block;width:60%;margin:0 auto\"></div>";
        var innerSection = document.getElementById("section-0");

        for (var j = 0; j < arrayTags.length; j++) {

            var tagText = arrayTags[j];
            var singleTag = "<div id=\"tag-search\" class=\"article-box__chevron-tag-style-search article-box__unselect-tag-search\" onclick=\"selectDesectedTag(this, event);\">" + tagText + "</div>"

            innerSection.innerHTML += singleTag;
        }

        if (splicedArray.length > 1) {

          contentTags.innerHTML += "<div id=\"section-1\" style=\"display:none;width:60%;margin:0 auto\"></div>";

          for (var i = 0; i < splicedArray.length; i++) {

            var moreTags = splicedArray[i];

            var innerSection = document.getElementById("section-1");

            for (var j = 0; j < moreTags.length; j++) {

                var tagText = moreTags[j];
                var singleTag = "<div id=\"tag-search\" class=\"article-box__chevron-tag-style-search article-box__unselect-tag-search\" onclick=\"selectDesectedTag(this, event);\">" + tagText + "</div>"

                innerSection.innerHTML += singleTag;
            }
          }

          var dotsElement = document.getElementById("dots-indicator");
          dotsElement.style.display = 'inline';

          for (var i = 0; i < 3; i++) {

            dotsElement.innerHTML += "<div id=\"dot-indicator-1\" class=\"article-box__dot-indicator\" style=\"margin-right:0.5%\"></div>";
          }
        }
      }
    }
}

function splice_array(arr, len) {

  var chunks = [],
      i = 0,
      n = arr.length;

  for (var i = 0; i < n; i += len) {
    chunks.push(arr.slice(i, i + len));
  }

  return chunks;
}

function removeDuplicates(arr, prop) {

  var obj = {};
  for ( var i = 0, len = arr.length; i < len; i++ ){
    if(!obj[arr[i][prop]]) obj[arr[i][prop]] = arr[i];
  }

  var newArr = [];
  for ( var key in obj ) newArr.push(obj[key]);
  return newArr;
}

function selectDesectedTag(object, event) {

  event.preventDefault();

  var clickedItem = object;

  var itemsClass = clickedItem.classList;

  var selectedTag = true;

  for (var i = 0; i < itemsClass.length; i++) {

    if (itemsClass[i].toLowerCase() == 'article-box__unselect-tag-search') {

      selectedTag = false;
      break;
    }
  }

  if (selectedTag) {

    clickedItem.classList.add("article-box__unselect-tag-search");
    clickedItem.classList.remove("article-box__select-tag-search");

  } else {

    clickedItem.classList.remove("article-box__unselect-tag-search");
    clickedItem.classList.add("article-box__select-tag-search");
  }

  triggerFilter();
}

function isEmpty(ob) {

  for(var i in ob){ return false;}
  return true;
}

function triggerFilter() {

  if (markersGlobal.length > 0 && this.currentMap != null) {

    for (var i = 0; i < markersGlobal.length; i++) {
        this.currentMap.removeLayer(markersGlobal[i]);
    }
  }

  var firstDiv = document.getElementById('section-0');
  var secondDiv = document.getElementById('section-1');

  var selectedTags = firstDiv.getElementsByClassName("article-box__select-tag-search");

  if (secondDiv.style.display == 'block') {
    selectedTags = secondDiv.getElementsByClassName("article-box__select-tag-search");
  }

  if (firstDiv.style.display == 'none') {

    var tempSelected = firstDiv.getElementsByClassName("article-box__select-tag-search");

    for (var i = 0; i < tempSelected.length; i++) {

      var auxItem = tempSelected[i];

      auxItem.classList.add("article-box__unselect-tag-search");
      auxItem.classList.remove("article-box__select-tag-search");
    }
  }

  if (secondDiv.style.display == 'none') {

    var tempSelected = secondDiv.getElementsByClassName("article-box__select-tag-search");

    for (var i = 0; i < tempSelected.length; i++) {

      var auxItem = tempSelected[i];

      auxItem.classList.add("article-box__unselect-tag-search");
      auxItem.classList.remove("article-box__select-tag-search");
    }
  }

  var finalDict = {};

  if (selectedTags.length > 0) {

     var finalObject = [];

     for (var i = 0; i < selectedTags.length; i++){

       var tagItem = selectedTags[i];
       var tagtext = tagItem.innerText;

       for (var j = 0; j < residenciesGlobal.length; j++) {

           var item = residenciesGlobal[j];

           var keywords = item["keywords"];

           if (arrayContains(tagtext, keywords)) {

             finalObject.push(item);
           }
       }
     }

     if (finalObject.length > 0) {

       finalObject = removeDuplicates(finalObject, "title");
       finalDict["residencies"] = finalObject;
     }
  }

  var counter = document.getElementById("tags-counter");

  var totalItems = 0;

  if (!isEmpty(finalDict)) {

    parseJSON(finalDict, this.currentMap);

    totalItems = finalDict["residencies"];

  } else {

    if (jsonContentData != null ) {

      parseJSON(jsonContentData, this.currentMap);

      totalItems = jsonContentData["residencies"];
    }
  }

  counter.innerHTML = totalItems.length + (totalItems.length == 1 ? " result" : " results");
}

function arrayContains(needle, arrhaystack) {

  return (arrhaystack.indexOf(needle) > -1);
}

function showGroupTags(object, event) {

  event.preventDefault();

  if (markersGlobal.length > 0 && this.currentMap != null) {

    for (var i = 0; i < markersGlobal.length; i++) {
        this.currentMap.removeLayer(markersGlobal[i]);
    }
  }

  var currentClassList = object.classList;

  if (!currentClassList.contains("active-tag")) {
    object.classList.add("article-box__active-tag");
  } else {
    object.classList.remove("article-box__active-tag");
  }

  var selectedTags = document.getElementsByClassName("active-tag")

  var finalObject = [];

  if (selectedTags.lenght == 0) {

    var totalItems = 0;

    for (var i = 0; i < selectedTags.length; i++){

      var item = selectedTag[i];
      var itemId = item.id.toLowerCase();

      if (itemId == "tag-calls") {


      }

      if (itemId == "tag-residencies") {
        finalObject["residencies"] = jsonContentData["residencies"];
      }

      if (itemId == "tag-users") {
        finalObject["persons"] = jsonContentData["persons"];
      }

      if (itemId == "tag-organizations") {
        finalObject["oraganizations"] = jsonContentData["oraganizations"];
      }

      if (itemId == "tag-producers") {
        finalObject["producers"] = jsonContentData["producers"];
      }

      if (itemId == "tag-partners") {

      }
    }

    parseJSON(finalObject, currentMap);
  }

  if (finalObject.lenght == 0) {

    for (var key in jsonContentData) {
      var values = dictionary[key];
      totalItems += values.length;
    }
  }

  counter.innerHTML = totalItems + (totalItems == 1 ? " result" : " results");
}

function createMapView() {

  $.ajax({
  type: 'GET',
  url: '/public-network-data/',
  dataType: 'json',
  contentType: 'application/json; charset=utf-8',
  success: function (data) {

        if (!currentMap) {

          createMap();
        }

        if (data && currentMap) {

          jsonContentData = data;
          residenciesGlobal = jsonContentData["residencies"];

          parseJSON(data, currentMap);

          //parseJSONTags(data);

          //triggerFilter();

          var itemsCount = 0;

          var residenciesItems = data["residencies"];

          if (residenciesItems.length > 0) {
            document.getElementById("tag-residencies").style.display = "block";
            itemsCount += residenciesItems.lenght;
          }

          var personsItems = data["persons"];

          if (personsItems.length > 0) {
            document.getElementById("tag-users").style.display = "block";
            itemsCount += personsItems.lenght;
          }

          var orgsItems = data["organizations"];

          if (orgsItems.length > 0) {
            document.getElementById("tag-organizations").style.display = "block";
            itemsCount += orgsItems.lenght;
          }

          var prodsItems = data["producers"];

          if (prodsItems.length > 0) {
            document.getElementById("tag-producers").style.display = "block";
            itemsCount += prodsItems.lenght;
          }

          var counter = document.getElementById("tags-counter");
          counter.style.display = "block";
          counter.innerHTML = itemsCount.length + (itemsCount.length == 1 ? " result" : " results");

        }
    },
    error: function(request, status, errorThrown) {

        if (!currentMap) {

          createMap();
        }
    }
  });
}
