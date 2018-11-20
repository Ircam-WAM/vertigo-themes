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

    s_artist.className = "call__all call__artist-unselected call__selector-responsive-item";
    s_project.className = "call__all call__project-unselected call__selector-responsive-item";
    s_producer.className = "call__all call__producer-unselected call__selector-responsive-item";

    i_artist.className = "call__info-block-hidden";
    i_project.className = "call__info-block-hidden";
    i_producer.className = "call__info-block-hidden";

    d_call_steps_project = document.getElementById("call-steps-list-project");
    d_call_steps_artist = document.getElementById("call-steps-list-artist");

    if (type == "artist") {

        s_artist.className = "call__all call__artist-selected call__selector-responsive-item";
        i_artist.className = "call__info-block";
        d_call_steps_artist.className = "call__steps call__call-step-artist-responsive";

    } else if (type == "project") {

        s_project.className = "call__all call__project-selected call__selector-responsive-item";
        i_project.className = "call__info-block";
        d_call_steps_project.className = "call__steps call__call-step-project-responsive";

    } else if (type == "producer") {

        s_producer.className = "call__all call__producer-selected call__selector-responsive-item";
        i_producer.className = "call__info-block";
    }

};

module.exports = Call;
