function clickedOptionDiv(link,event) {

    event.preventDefault();

    var leftDiv = document.getElementById("left-item");
    var rightDiv = document.getElementById("right-item");

    var dashes = document.getElementsByClassName((link.id === 'left-item') ? 'vertical-dash': "horizontal-dash");

    for (var i = 0; i < dashes.length; i++)
    {
        dashes[i].classList.remove('home-page__dash-gray');
        dashes[i].classList.add('home-page__dash-black');
    }

    dashes = document.getElementsByClassName((link.id === 'left-item') ? 'horizontal-dash': "vertical-dash");

    for (var i = 0; i < dashes.length; i++)
    {
        dashes[i].classList.remove('home-page__dash-black');
        dashes[i].classList.add('home-page__dash-gray');
    }

    if (link.id === 'left-item')
    {
        rightDiv.classList.remove('home-page__private-black-bottom-border');
        rightDiv.classList.add('home-page__private-gray-bottom-border');

        leftDiv.classList.remove('home-page__private-gray-bottom-border');
        leftDiv.classList.add('home-page__private-black-bottom-border');

        var rightContentItem = document.getElementById("right-div-content");
        rightContentItem.classList.remove('home-page__show-content');
        rightContentItem.classList.add('home-page__hide-content');

        var leftContentItem = document.getElementById("left-div-content");
        leftContentItem.classList.remove('home-page__hide-content');
        leftContentItem.classList.add('home-page__show-content');
    }

    if (link.id === 'right-item')
    {
        leftDiv.classList.remove('home-page__private-black-bottom-border');
        leftDiv.classList.add('home-page__private-gray-bottom-border');

        rightDiv.classList.remove('home-page__private-gray-bottom-border');
        rightDiv.classList.add('home-page__private-black-bottom-border');

        var rightContentItem = document.getElementById("right-div-content");
        rightContentItem.classList.remove('home-page__hide-content');
        rightContentItem.classList.add('home-page__show-content');

        var leftContentItem = document.getElementById("left-div-content");
        leftContentItem.classList.remove('home-page__show-content');
        leftContentItem.classList.add('home-page__hide-content');
    }
}

function formStyleSelection() {

  $("iframe").contents().find("body").append("<style type='text/css'> .mceContentBody>p::selection { background:#50e3c2 !important; color: white !important }</style>");
  $("iframe").contents().find("body").append("<style type='text/css'> .mceContentBody>p>span::selection { background:#50e3c2 !important; color: white !important }</style>");
  $("iframe").contents().find("body").append("<style type='text/css'> .mceContentBody>p>em>span::selection { background:#50e3c2 !important; color: white !important }</style>");
  $("iframe").contents().find("body").append("<style type='text/css'> .mceContentBody>p>strong>span::selection { background:#50e3c2 !important; color: white !important }</style>");
  $("iframe").contents().find("body").append("<style type='text/css'> .mceContentBody>p>span>span::selection { background:#50e3c2 !important; color: white !important }</style>");
  $("iframe").contents().find("body").append("<style type='text/css'> .mceContentBody>p>strong::selection { background:#50e3c2 !important; color: white !important }</style>");
  $("iframe").contents().find("body").append("<style type='text/css'> .mceContentBody>p>span>strong::selection { background:#50e3c2 !important; color: white !important }</style>");
  $("iframe").contents().find("body").append("<style type='text/css'> .mceContentBody>p>em>span>strong::selection { background:#50e3c2 !important; color: white !important }</style>");
  $("iframe").contents().find("body").append("<style type='text/css'> .mceContentBody>p>em::selection { background:#50e3c2 !important; color: white !important }</style>");
  $("iframe").contents().find("body").append("<style type='text/css'> .mceContentBody>p>strong>em::selection { background:#50e3c2 !important; color: white !important }</style>");
  $("iframe").contents().find("body").append("<style type='text/css'> .mceContentBody>p>em>strong::selection { background:#50e3c2 !important; color: white !important }</style>");
  $("iframe").contents().find("body").append("<style type='text/css'> .mceContentBody>p>span>em>strong::selection { background:#50e3c2 !important; color: white !important }</style>");
  $("iframe").contents().find("body").append("<style type='text/css'> .mceContentBody>p>span>em::selection { background:#50e3c2 !important; color: white !important }</style>");
  $("iframe").contents().find("body").append("<style type='text/css'> .mceContentBody>p>em>strong>span::selection { background:#50e3c2 !important; color: white !important }</style>");
  $("iframe").contents().find("body").append("<style type='text/css'> .mceContentBody>p>strong>span>em::selection { background:#50e3c2 !important; color: white !important }</style>");
  $("iframe").contents().find("body").append("<style type='text/css'> .mceContentBody>p>span>strong>em::selection { background:#50e3c2 !important; color: white !important }</style>");

  $("iframe").contents().find("body").append("<style type='text/css'> .mce-content-body>p::selection { background:#50e3c2 !important; color: white !important }</style>");
  $("iframe").contents().find("body").append("<style type='text/css'> .mce-content-body>p>span::selection { background:#50e3c2 !important; color: white !important }</style>");
  $("iframe").contents().find("body").append("<style type='text/css'> .mce-content-body>p>em>span::selection { background:#50e3c2 !important; color: white !important }</style>");
  $("iframe").contents().find("body").append("<style type='text/css'> .mce-content-body>p>strong>span::selection { background:#50e3c2 !important; color: white !important }</style>");
  $("iframe").contents().find("body").append("<style type='text/css'> .mce-content-body>p>span>span::selection { background:#50e3c2 !important; color: white !important }</style>");
  $("iframe").contents().find("body").append("<style type='text/css'> .mce-content-body>p>strong::selection { background:#50e3c2 !important; color: white !important }</style>");
  $("iframe").contents().find("body").append("<style type='text/css'> .mce-content-body>p>span>strong::selection { background:#50e3c2 !important; color: white !important }</style>");
  $("iframe").contents().find("body").append("<style type='text/css'> .mce-content-body>p>em>span>strong::selection { background:#50e3c2 !important; color: white !important }</style>");
  $("iframe").contents().find("body").append("<style type='text/css'> .mce-content-body>p>em::selection { background:#50e3c2 !important; color: white !important }</style>");
  $("iframe").contents().find("body").append("<style type='text/css'> .mce-content-body>p>strong>em::selection { background:#50e3c2 !important; color: white !important }</style>");
  $("iframe").contents().find("body").append("<style type='text/css'> .mce-content-body>p>em>strong::selection { background:#50e3c2 !important; color: white !important }</style>");
  $("iframe").contents().find("body").append("<style type='text/css'> .mce-content-body>p>span>em>strong::selection { background:#50e3c2 !important; color: white !important }</style>");
  $("iframe").contents().find("body").append("<style type='text/css'> .mce-content-body>p>span>em::selection { background:#50e3c2 !important; color: white !important }</style>");
  $("iframe").contents().find("body").append("<style type='text/css'> .mce-content-body>p>em>strong>span::selection { background:#50e3c2 !important; color: white !important }</style>");
  $("iframe").contents().find("body").append("<style type='text/css'> .mce-content-body>p>strong>span>em::selection { background:#50e3c2 !important; color: white !important }</style>");
  $("iframe").contents().find("body").append("<style type='text/css'> .mce-content-body>p>span>strong>em::selection { background:#50e3c2 !important; color: white !important }</style>");

  $("iframe").contents().find("body").append("<style type='text/css'> .mce-content-body>div>p::selection { background:#50e3c2 !important; color: white !important }</style>");
  $("iframe").contents().find("body").append("<style type='text/css'> .mce-content-body>div>p>span::selection { background:#50e3c2 !important; color: white !important }</style>");
  $("iframe").contents().find("body").append("<style type='text/css'> .mce-content-body>div>p>em>span::selection { background:#50e3c2 !important; color: white !important }</style>");
  $("iframe").contents().find("body").append("<style type='text/css'> .mce-content-body>div>p>strong>span::selection { background:#50e3c2 !important; color: white !important }</style>");
  $("iframe").contents().find("body").append("<style type='text/css'> .mce-content-body>div>p>span>span::selection { background:#50e3c2 !important; color: white !important }</style>");
  $("iframe").contents().find("body").append("<style type='text/css'> .mce-content-body>div>p>strong::selection { background:#50e3c2 !important; color: white !important }</style>");
  $("iframe").contents().find("body").append("<style type='text/css'> .mce-content-body>div>p>span>strong::selection { background:#50e3c2 !important; color: white !important }</style>");
  $("iframe").contents().find("body").append("<style type='text/css'> .mce-content-body>div>p>em>span>strong::selection { background:#50e3c2 !important; color: white !important }</style>");
  $("iframe").contents().find("body").append("<style type='text/css'> .mce-content-body>div>p>em::selection { background:#50e3c2 !important; color: white !important }</style>");
  $("iframe").contents().find("body").append("<style type='text/css'> .mce-content-body>div>p>strong>em::selection { background:#50e3c2 !important; color: white !important }</style>");
  $("iframe").contents().find("body").append("<style type='text/css'> .mce-content-body>div>p>em>strong::selection { background:#50e3c2 !important; color: white !important }</style>");
  $("iframe").contents().find("body").append("<style type='text/css'> .mce-content-body>div>p>span>em>strong::selection { background:#50e3c2 !important; color: white !important }</style>");
  $("iframe").contents().find("body").append("<style type='text/css'> .mce-content-body>div>p>span>em::selection { background:#50e3c2 !important; color: white !important }</style>");
  $("iframe").contents().find("body").append("<style type='text/css'> .mce-content-body>div>p>em>strong>span::selection { background:#50e3c2 !important; color: white !important }</style>");
  $("iframe").contents().find("body").append("<style type='text/css'> .mce-content-body>div>p>strong>span>em::selection { background:#50e3c2 !important; color: white !important }</style>");
  $("iframe").contents().find("body").append("<style type='text/css'> .mce-content-body>div>p>span>strong>em::selection { background:#50e3c2 !important; color: white !important }</style>");

}
