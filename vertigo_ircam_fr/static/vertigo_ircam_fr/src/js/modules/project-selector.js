var ProjectSelector = function() {

    //
    // Init
    //
    this.init();

};

ProjectSelector.prototype.init = function() {

    var that = this;
    /* Get the project from GET param and select it in Project selector */
    var project_slug = findGetParameter("project");
    var selector_id = "id_techproject";
    if (project_slug != null) {
        var selector = document.getElementById(selector_id);
        if (selector != null) {
            if (selector.innerHTML.indexOf('value="' + project_slug + '"') > -1) {
                selector.value = project_slug;
            }
        }
    }

};

/* Find a parameter from GET or return null */
function findGetParameter(parameterName) {
    var result = null,
        tmp = [];
    var items = location.search.substr(1).split("&");
    for (var index = 0; index < items.length; index++) {
        tmp = items[index].split("=");
        if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
    }
    return result;
}



module.exports = ProjectSelector;