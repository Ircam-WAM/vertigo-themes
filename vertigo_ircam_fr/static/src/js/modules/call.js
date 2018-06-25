var Call = function() {

    //
    // Init
    //
    this.init();

};

Call.prototype.init = function() {

    var that = this;

};

Call.prototype.callSelect = function(type, img_url) {

    workflow = document.getElementById("call__workflow")
    workflow.src = img_url;

    s_artist = document.getElementById("call__select-artist");
    s_project = document.getElementById("call__select-project");
    s_producer = document.getElementById("call__select-producer");

    i_artist = document.getElementById("call__info-artist");
    i_project = document.getElementById("call__info-project");
    i_producer = document.getElementById("call__info-producer");

    s_artist.className = "call__all call__artist-unselected";
    s_project.className = "call__all call__project-unselected";
    s_producer.className = "call__all call__producer-unselected";

    i_artist.className = "call__info-block-hidden";
    i_project.className = "call__info-block-hidden";
    i_producer.className = "call__info-block-hidden";

    if (type == "artist") {
        s_artist.className = "call__all call__artist-selected";
        i_artist.className = "call__info-block";
    } else if (type == "project") {
        s_project.className = "call__all call__project-selected";
        i_project.className = "call__info-block";
    } else if (type == "producer") {
        s_producer.className = "call__all call__producer-selected";
        i_producer.className = "call__info-block";
    }

};

module.exports = Call;