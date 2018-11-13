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
