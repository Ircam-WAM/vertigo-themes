var ProjectDetail = function() {

    //
    // Init
    //
    this.init();

};

ProjectDetail.prototype.init = function() {

    var that = this;
    this.drawLines();
    window.onresize = function(event) {
        that.drawLines();
    };

};

ProjectDetail.prototype.getOffset = function(el) {
    var rect = el.getBoundingClientRect();
    return {
        left: rect.left + window.pageXOffset,
        top: rect.top + window.pageYOffset,
        width: rect.width || el.offsetWidth,
        height: rect.height || el.offsetHeight
    };
}

ProjectDetail.prototype.connect = function(id1, id2, idDivisor, idParent) {
    var thickness = 5;
    // Get elements
    var el1 = document.getElementById(id1);
    var el2 = document.getElementById(id2);
    var divisor = document.getElementById(idDivisor);
    var parent = document.getElementById(idParent);
    // Get offset of elements
    var off1 = this.getOffset(el1);
    var off2 = this.getOffset(el2);
    var offParent = this.getOffset(parent);
    // Middle right of element 1
    var x1 = off1.left + off1.width;
    var y1 = off1.top + (off1.height / 2);
    // Middle left of element 2
    var x2 = off2.left;
    var y2 = off2.top + (off2.height / 2);
    // Distance
    var length = Math.sqrt(((x2-x1) * (x2-x1)) + ((y2-y1) * (y2-y1)));
    // Center
    var cx = ((x1 + x2) / 2) - (length / 2) - offParent.left;
    var cy = ((y1 + y2) / 2) - (thickness / 2) - offParent.top;
    // Change divisor style
    divisor.style.height = thickness + "px";
    divisor.style.left = (cx - 4) + "px"; // Hardcoded -4px to compensate icon size 
    divisor.style.top = cy + "px";
    divisor.style.width = (length + 8) + "px"; // Hardcoded 8px to compensate icon size
}

ProjectDetail.prototype.drawLines = function() {

    this.connect("timeline-open-call", "timeline-in-residency", "timeline-divisor-left", "timeline-block");
    this.connect("timeline-in-residency", "timeline-residency-outcome", "timeline-divisor-right", "timeline-block");

};

window.onresize = function() {
   document.write('Resized'); // or whatever you want to do...
};

module.exports = ProjectDetail;