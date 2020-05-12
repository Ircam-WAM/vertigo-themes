
function changeOptionDetail(event,link) {

    event.preventDefault();

    var aboutItemContent = document.getElementById("content-about-item");
    var artisticItemContent = document.getElementById("content-artistic-item");
    var artistItemContent = document.getElementById("content-artist-item");
    var outcomeItemContent = document.getElementById("content-outcome-item");

    aboutItemContent.style.display = 'none';
    artisticItemContent.style.display = 'none';
    artistItemContent.style.display = 'none';
    outcomeItemContent.style.display = 'none';

    var linkAbout = document.getElementById("about-item");
    var linkArtistic = document.getElementById("artistic-item");
    var linkArtist = document.getElementById("artist-item");
    var linkBlog = document.getElementById("blog-item");
    var linkFollowers = document.getElementById("followers-item");
    var linkOutcome = document.getElementById("outcome-item")

    var buttons = document.getElementsByClassName('link-sections');

    for (var i = 0; i < buttons.length; i++)
    {
        buttons[i].classList.remove('page__option-selected');
        buttons[i].classList.add('page__option-unselected');
    }

    var map = document.getElementById("map-element-content");

    if (map != null) {
      map.style.display = "block";
    }

    if (link.id === 'about-item')
    {
        aboutItemContent.style.display = 'block';
        linkAbout.classList.add('page__option-selected');
        linkAbout.classList.remove('page__option-unselected');
    }

    if (link.id === 'artistic-item')
    {
        artisticItemContent.style.display = 'block';
        linkArtistic.classList.add('page__option-selected');
        linkArtistic.classList.remove('page__option-unselected');

        if (map != null) {
          map.style.display = "none";
        }
    }

    if (link.id === 'artist-item')
    {
        artistItemContent.style.display = 'block';
        linkArtist.classList.add('page__option-selected');
        linkArtist.classList.remove('page__option-unselected');
    }

    if (link.id === 'outcome-item')
    {
        outcomeItemContent.style.display = 'block';
        linkOutcome.classList.add('page__option-selected');
        linkOutcome.classList.remove('page__option-unselected');
    }
}

function changeFollowStatus(event,object) {

  event.preventDefault();

  var styleList = document.getElementById("element-social").classList;

  var followItem = document.getElementById("element-social-follow");
  var unfollowItem = document.getElementById("element-social-unfollow");

  var followItemContent = document.getElementById("start-follow-item");
  var unfollowItemContent = document.getElementById("stop-follow-item");

  for (var i = 0; i < styleList.length;i++) {

    var currentStyle = styleList[i];

    if (currentStyle == "page__circle-cross-red-detail-residencies") {

      object.classList.add("page__circle-check-green-detail-residencies");
      object.classList.remove("page__circle-cross-red-detail-residencies");

      followItem.style.display = "block";
      unfollowItem.style.display = "none";

      followItemContent.style.display = "block";
      unfollowItemContent.style.display = "none";
      break;
    }

    if (currentStyle == "page__circle-check-green-detail-residencies") {

      object.classList.add("page__circle-cross-red-detail-residencies");
      object.classList.remove("page__circle-check-green-detail-residencies");

      followItem.style.display = "none";
      unfollowItem.style.display = "block";

      followItemContent.style.display = "none";
      unfollowItemContent.style.display = "block";
      break;
    }
  }
}

var currentMap;

function createMap() {

  if (!currentMap) {
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
}

function insertAfter(el, referenceNode) {
	referenceNode.parentNode.insertBefore(el, referenceNode.nextSibling);
}

function reworkFooter() {

  var currentFooter = document.getElementsByTagName("footer");

  if (currentFooter != null) {

    var tempFooter = currentFooter[0];
    tempFooter.style.display = "none";

    var mapElement = document.getElementById("map-element-content");

    var cloneFooter = tempFooter.cloneNode(true);
    cloneFooter.id = "footer-rework";
    cloneFooter.style.display = "block";

    insertAfter(cloneFooter, mapElement);
  }
}

function reworkContent() {

  var currentMain = document.getElementsByTagName("main");

  if (currentMain != null) {

    var tempMain = currentMain[0];
    tempMain.style.display = "none";
  }
}
