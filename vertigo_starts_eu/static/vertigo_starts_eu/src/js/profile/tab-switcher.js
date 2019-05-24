window.addEventListener('load', function(){
    var container = document.getElementById('settings-profile-container')
    if (! container) {
        return
    }

    var containerProfileId = container.getAttribute('data-profile-tab')
    
    if (! containerProfileId) {
        return
    }
    
    var tab = document.getElementById(containerProfileId)

    if (! tab) {
        return
    }

    tab.className = "page__option-selected";
});
