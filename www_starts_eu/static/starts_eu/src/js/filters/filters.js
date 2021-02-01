var currentMap;

function reloadContentTags(id_item) {

    var clickedItem = document.getElementById(id_item);
    var altItem = document.getElementById((id_item == "dots-item") ? "map-marker" : "dots-item");

    var clickedItemIcon = document.getElementById(id_item + "-icon");
    var altItemIcon = document.getElementById(((id_item == "dots-item") ? "map-marker" : "dots-item") + "-icon");

    altItem.classList.remove("article-box__icon-marker-item-highlight");
    altItem.classList.add("article-box__icon-marker-item-clean");

    altItemIcon.classList.remove("article-box__icon-marker-item-highlight-icon");
    altItemIcon.classList.add("article-box__icon-marker-item-clean-icon");

    clickedItem.classList.add("article-box__icon-marker-item-highlight");
    clickedItem.classList.remove("article-box__icon-marker-item-clean");

    clickedItemIcon.classList.add("article-box__icon-marker-item-highlight-icon");
    clickedItemIcon.classList.remove("article-box__icon-marker-item-clean-icon");

    var mapElement = document.getElementById("map-element-content");
    var listElemet = document.getElementById("residency-list");

    if (id_item == "dots-item") {

      mapElement.style.display = "none";
      listElemet.style.display = "block";

    } else {

      mapElement.style.display = "block";
      listElemet.style.display = "none";

      if (jsonContentData) {

        if (!currentMap) {
          createMap();
        }

        if (currentMap) {

          triggerFilter();
        }

      } else {

          createMap();
      }
   }
}

function changeViewItems(object, event) {

  event.preventDefault();

  var id_item = object.id;

  reloadContentTags(id_item);
}

function createMap() {

  $(function() {

      currentMap = L.map('mapid').setView([47.91, 6.85], 2);

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

function parseJSON(jsonObject, map) {

  if (!map) {
    return;
  }

  $(function() {

      var residencies = jsonObject["residencies"];

      var markers = L.markerClusterGroup({showCoverageOnHover: true,
                                          zoomToBoundsOnClick: true,
                                          removeOutsideVisibleBounds: true});

      var detailMarker = document.getElementById("detail-marker");

      detailMarker.style.display = 'none';

      for (var i = 0; i < residencies.length; i++) {

          var item = residencies[i];

          var lat = item["lat"];
          var lon = item["lon"];
          var title = item["title"];

          var marker = L.marker(new L.LatLng(lat, lon), {  title: title });
          marker.id_value = i;
          marker.title = title;
          marker.on('click', function (e) {

              var id = e.target.id_value;

              var item = residencies[id];

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

function createCardHTML(item) {

  var title = item["title"];
  var description = item["description"].substring(0,50) + "...";
  var city = item["city"];
  var keywords = item["keywords"];
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

function arrayContains(needle, arrhaystack) {

  return (arrhaystack.indexOf(needle) > -1);
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

  var listContainer = document.getElementById("residency-list");
  listContainer.innerHTML = "";

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
    createListItems(finalDict);

    totalItems = finalDict["residencies"];

  } else {

    parseJSON(jsonContentData, this.currentMap);
    createListItems(jsonContentData);

    totalItems = jsonContentData["residencies"];
  }

  counter.innerHTML = totalItems.length + (totalItems.length == 1 ? " result" : " results");
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

function createListCardHTML(item) {

  var title = item["title"];
  var description = item["description"].substring(0,130) + "...";
  var city = item["city"];
  var keywords = item["keywords"];
  var location = item["mappable_location"];
  var detaillURL = item["url"];

  var htmlString = "";

  if ('card' in item) {
    htmlString += "<div class=\"article-box__hovering-map-card\" style=\"background-image: linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('" + item["card"] + "');background-size:cover;max-width:400px;max-height:400px;width:auto;height:400px;color:white\">";
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

    htmlString +="</div>";
  }

  if (location != "" && location != null) {

    htmlString += "<div class=\"article-box__location-card-map\">" + location + "</div>";
  }

  htmlString += "</center>";
  htmlString += "</div></div>";

  return htmlString;
}

function createListItems(content) {

  var allResidencies = content["residencies"];

  var listContainer = document.getElementById("residency-list");

  if (allResidencies.length > 0) {

    for (var i = 0; i < allResidencies.length; i++) {

      var singleItem = allResidencies[i];

      var titleValue = singleItem["title"];
      var urlValue = singleItem["url"];

      var htmlContent = "<div class=\"col-xs-8 page__row-responsive\" id=\"" + titleValue + "\">";
      htmlContent += "<a href=\"" + urlValue + "\" target=\"_blank\" class=\"residency-box\">";
      htmlContent += createListCardHTML(singleItem);
      htmlContent += "</a><div>";

      listContainer.innerHTML += htmlContent;
    }
  }
}

var jsonContentData = {};
var residenciesGlobal = {};
var markersGlobal = [];
var globalTags = [];

function loadContent() {

  $.ajax({
    type: 'GET',
    url: '/public-network-data/',
    dataType: 'json',
    contentType: 'application/json; charset=utf-8',
    success: function (data) {

        if (data) {

          jsonContentData = data;
          residenciesGlobal = jsonContentData["residencies"];

          parseJSONTags(jsonContentData);
          createListItems(jsonContentData);

          var chevronItem = document.getElementById("chevron-tags");
          var tagsDivContent = document.getElementById("tags-content");

          chevronItem.classList.remove("fa-chevron-down");
          chevronItem.classList.add("fa-chevron-up");
          tagsDivContent.style.display = 'block';
        }
    },
    error: function(request, status, errorThrown) {

    }
  });
}
