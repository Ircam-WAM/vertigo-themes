
function showFullNotice() {

  closeOverlay();

  var htmlTag = document.getElementsByTagName("html");

  if (htmlTag != null) {
    htmlTag[0].style.overflow = "hidden";
  }

  var bodyDiv = document.getElementById("body");
  var childBody = document.getElementById("overlay-news");

  if (childBody != null) {
      bodyDiv.removeChild(childBody);
  }

  var hiddenDiv = document.getElementById("overlay-news-temp");
  var cloneDiv = hiddenDiv.cloneNode(true);
  cloneDiv.id = "overlay-news";
  cloneDiv.style.display = "block";

  bodyDiv.insertBefore(cloneDiv, bodyDiv.firstChild);
}

function closeOverlay() {

  var htmlTag = document.getElementsByTagName("html");

  if (htmlTag != null) {
    htmlTag[0].style.overflow = "auto";
  }

  var bodyDiv = document.getElementById("body");
  var childBody = document.getElementById("overlay-news");

  if (childBody != null) {
      bodyDiv.removeChild(childBody);
  }
}


  $(document).on( 'keydown', function ( e ) {
    if ( e.keyCode === 27 ) { // ESC
        closeOverlay();
    }
  });
