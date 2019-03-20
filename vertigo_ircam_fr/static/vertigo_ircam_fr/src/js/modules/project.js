var Project = function() {

    //
    // Init
    //
    this.init();

};

Project.prototype.init = function() {

    var that = this;

};

Project.prototype.projectSelect = function(id) {

    selectors = document.getElementsByClassName("project__type__all");
    for (i = 0; i < selectors.length; i++) {
        selectors[i].className = "project__type__all project__type-unselected";
    }
    selector_selected = document.getElementById("project__selector__id__" + id);
    selector_selected.className = "project__type__all project__type-selected";

    blocks = document.getElementsByClassName("project__list");
    for (i = 0; i < blocks.length; i++) {
        blocks[i].className = "project__list project__list-block-hidden";
    }
    block_selected = document.getElementById("project__block__id__" + id);
    block_selected.className = "project__list project__list-block";

};

module.exports = Project;