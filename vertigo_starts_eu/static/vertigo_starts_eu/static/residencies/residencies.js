
function changeOptionDetail(event,link) {

    event.preventDefault();

    var aboutItemContent = document.getElementById("content-about-item");
    var artisticItemContent = document.getElementById("content-artistic-item");
    var artistItemContent = document.getElementById("content-artist-item");
    var blogItemContent = document.getElementById("content-blog-item");
    var followersTitemContent = document.getElementById("content-followers-item");

    aboutItemContent.style.display = 'none';
    artisticItemContent.style.display = 'none';
    artistItemContent.style.display = 'none';
    blogItemContent.style.display = 'none';
    followersTitemContent.style.display = 'none';

    var linkAbout = document.getElementById("about-item");
    var linkArtistic = document.getElementById("artistic-item");
    var linkArtist = document.getElementById("artist-item");
    var linkBlog = document.getElementById("blog-item");
    var linkFollowers = document.getElementById("followers-item");

    var buttons = document.getElementsByClassName('link-sections');

    for (var i = 0; i < buttons.length; i++)
    {
        buttons[i].classList.remove('page__option-selected');
        buttons[i].classList.add('page__option-unselected');
    }

    var map = document.getElementById("mapid");

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

    if (link.id === 'blog-item')
    {
        blogItemContent.style.display = 'block';
        linkBlog.classList.add('page__option-selected');
        linkBlog.classList.remove('page__option-unselected');
    }

    if (link.id === 'followers-item')
    {
        followersTitemContent.style.display = 'block';
        linkFollowers.classList.add('page__option-selected');
        linkFollowers.classList.remove('page__option-unselected');
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

    if (currentStyle == "page__circle-cross-red") {

      object.classList.add("page__circle-check-green");
      object.classList.remove("page__circle-cross-red");

      followItem.style.display = "block";
      unfollowItem.style.display = "none";

      followItemContent.style.display = "block";
      unfollowItemContent.style.display = "none";
      break;
    }

    if (currentStyle == "page__circle-check-green") {

      object.classList.add("page__circle-cross-red");
      object.classList.remove("page__circle-check-green");

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
