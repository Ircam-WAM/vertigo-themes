
function showFullNotice(object,event) {

  event.preventDefault();

  var bodyDiv = document.getElementById("body");

  closeOverlay();

  var htmlTag = document.getElementsByTagName("html");

  if (htmlTag != null) {
    htmlTag[0].style.overflow = "hidden";
  }

  var dynamicDiv = document.createElement('div');
  dynamicDiv.id = 'overlay-news';
  dynamicDiv.className = "home-page__overlay-style-home";

  var innerString = "<div style=\"cursor:pointer\" onclick=\"closeOverlay();\">";
  innerString += "<i class=\"fa fa-times home-page__overlay_close-home\" aria-hidden=\"true\"></i>";
  innerString += "<div class=\"home-page__overlay-contaner-info-home\">";
  innerString += "<div class=\"home-page__overlay-content-title-home\">";
  innerString += "{{ article.title }}";
  innerString += "</div>";
  innerString += "<img class=\"home-page__public-article-image\" src=\"{{ MEDIA_URL }}{% thumbnail article.images.all|first 300 300 padding=true %}\" >";
  innerString += "<div class=\"home-page__overlay-description-home\">";
  innerString += "{{ article.description|richtext_filters|safe|truncatechars_html:1000 }}";
  innerString += "</div>";
  innerString += "</div>";
  innerString += "</div>";

  dynamicDiv.innerHTML = innerString;

  bodyDiv.insertBefore(dynamicDiv, bodyDiv.firstChild);
}

function closeOverlay() {

  var htmlTag = document.getElementsByTagName("html");

  if (htmlTag != null) {
    htmlTag[0].style.overflow = "auto";
  }

  var childrenOverlay = document.getElementsByClassName("home-page__overlay-style-home");

  if (childrenOverlay != null) {

    var bodyDiv = document.getElementById("body");

    for (var i = 0; i < childrenOverlay.length; i++) {

      var child = childrenOverlay[i];

      bodyDiv.removeChild(child);
    }
  }
}
