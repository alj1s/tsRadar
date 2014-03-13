/// <reference path="radar-jan14.ts" />
var Radar = (function () {
    function Radar(techniques, tools, platforms, libraries) {
        this.outerRadius = 320;
        this.step = 80;
        this.rings = new Array();
        this.rings.push(new Ring("Adopt", this.outerRadius - (3 * this.step)));
        this.rings.push(new Ring("Trial", this.outerRadius - (2 * this.step)));
        this.rings.push(new Ring("Assess", this.outerRadius - this.step));
        this.rings.push(new Ring("Hold", this.outerRadius));

        this.sectors = new Array();
        this.sectors.push(new Sector("Tools", tools, Math.PI / 2, "legend0"));
        this.sectors.push(new Sector("Techniques", techniques, Math.PI, "legend1"));
        this.sectors.push(new Sector("Platforms and Languages", platforms, 3 * Math.PI / 2, "legend2"));
        this.sectors.push(new Sector("Libraries and Frameworks", libraries, 2 * Math.PI, "legend3"));
    }
    return Radar;
})();

var Ring = (function () {
    function Ring(name, radius) {
        this.name = name;
        this.radius = radius;
    }
    return Ring;
})();

var Sector = (function () {
    function Sector(name, data, angle, divId) {
        this.name = name;
        this.data = data;
        this.angle = angle;
        this.divId = divId;
    }
    return Sector;
})();

var Point = (function () {
    function Point(x, y) {
        this.x = x;
        this.y = y;
    }
    return Point;
})();

var Renderer = (function () {
    function Renderer(canvasId) {
        this.canvasId = canvasId;
        this.canvas = document.getElementById(this.canvasId);
        this.center = new Point(this.canvas.width / 2, this.canvas.height / 2);
    }
    Renderer.prototype.render = function (radar) {
        var _this = this;
        var context = this.canvas.getContext("2d");
        context.strokeStyle = "green";
        context.fillStyle = "green";

        this.renderSectorLines(context, radar);

        radar.rings.forEach(function (ring) {
            return _this.renderRing(ring, context);
        });
        radar.sectors.forEach(function (sector) {
            return _this.renderSector(radar, sector, context);
        });
    };

    Renderer.prototype.renderRing = function (ring, context) {
        context.beginPath();
        context.arc(this.center.x, this.center.y, ring.radius, 0, 2 * Math.PI);
        context.stroke();

        this.renderArcText(ring, context);
    };

    Renderer.prototype.renderArcText = function (ring, context) {
        var len = ring.name.length;
        var angle = Math.PI * 5 / 180;

        context.font = "16px Monaco";

        context.save();
        context.translate(this.center.x, this.center.y);

        for (var n = 0; n < len; n++) {
            context.save();
            context.translate(5, (-1 * ring.radius) - 5);
            context.fillText(ring.name[n], 0, 0);
            context.restore();
            context.rotate(angle * 100 / ring.radius);
        }
        context.restore();
    };

    Renderer.prototype.renderSectorLines = function (context, radar) {
        context.moveTo(this.center.x, this.center.y - radar.outerRadius);
        context.lineTo(this.center.x, this.center.y + radar.outerRadius);
        context.stroke();

        context.moveTo(this.center.x - radar.outerRadius, this.center.y);
        context.lineTo(this.center.x + radar.outerRadius, this.center.y);
        context.stroke();
    };

    Renderer.prototype.renderSector = function (radar, sector, context) {
        var _this = this;
        var increment = Math.PI / (2 * (sector.data.length + 2));
        var angle = sector.angle + increment;

        this.renderLegend(sector);

        sector.data.forEach(function (blip) {
            console.log(angle);

            _this.renderBlip(angle, radar, blip, context);
            angle = angle + increment;
        });
    };

    Renderer.prototype.renderLegend = function (sector) {
        var sectorDiv = document.getElementById(sector.divId);

        var header = document.createElement("h4");
        header.appendChild(document.createTextNode(sector.name));
        sectorDiv.appendChild(header);

        var list = document.createElement("ul");

        sector.data.forEach(function (blip) {
            var item = document.createElement("li");
            item.appendChild(document.createTextNode(blip.name));
            list.appendChild(item);
        });

        sectorDiv.appendChild(list);
    };

    Renderer.prototype.renderBlip = function (angle, radar, blip, context) {
        context.fillStyle = "lime";
        context.save();

        context.translate(this.center.x, this.center.y);
        context.rotate(-angle);

        var radius = this.getRadius(radar.step / 2, blip.status);

        if (blip.movement == "s") {
            context.translate(0, radius);
            context.rotate(angle);
            context.fillRect(0, 0, 10, 10);
        }
        if (blip.movement == "t") {
            context.save();
            context.translate(0, radius);
            context.rotate(angle);
            context.beginPath();
            context.moveTo(0, 0);
            context.lineTo(5, -10);
            context.lineTo(10, 0);
            context.closePath();
            context.fill();
            context.restore();
        }
        if (blip.movement == "c") {
            context.beginPath();
            context.save();
            context.translate(0, radius);
            context.arc(0, 0, 5, 0, 2 * Math.PI);
            context.fill();
            context.restore();
        }

        context.restore();
    };

    Renderer.prototype.getRadius = function (length, status) {
        var radius = 0;

        if (status == "Adopt") {
            radius = length;
        }
        if (status == "Trial") {
            radius = 3 * length;
        }
        if (status == "Assess") {
            radius = 5 * length;
        }
        if (status == "Hold") {
            radius = 7 * length;
        }

        return radius;
    };
    return Renderer;
})();

function run() {
    var radar = new Radar(techniques, tools, libraries, platforms);
    var renderer = new Renderer("radar");
    renderer.render(radar);
}

run();
