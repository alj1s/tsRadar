/// <reference path="radar-jan14.ts" />
class Radar {

    rings : Array<Ring>;
    sectors : Array<Sector>;

    outerRadius = 320;

    step = 80;

	constructor(techniques : any, tools : any, platforms : any, libraries : any){

		this.rings = new Array<Ring>();
		this.rings.push(new Ring("Adopt", this.outerRadius - (3 * this.step)));
		this.rings.push(new Ring("Trial", this.outerRadius - (2 * this.step)));
		this.rings.push(new Ring("Assess", this.outerRadius - this.step));
		this.rings.push(new Ring("Hold", this.outerRadius));

		this.sectors = new Array<Sector>();
		this.sectors.push(new Sector("Tools", tools, Math.PI/2, "legend0"));
	    this.sectors.push(new Sector("Techniques", techniques, Math.PI, "legend1"));
		this.sectors.push(new Sector("Platforms and Languages", platforms, 3 * Math.PI / 2, "legend2"));
		this.sectors.push(new Sector("Libraries and Frameworks", libraries, 2 * Math.PI, "legend3"));
	}

}

class Ring { 

	constructor (public name : string, public radius : number) {}

}

class Sector{

	constructor (public name : string, public data : any, public angle : number, public divId : string){

	}
}

class Point {

	constructor(public x : number, public y: number){}
}

class Renderer {

	private center : Point;
	private canvas : HTMLCanvasElement;

	constructor(public canvasId : string) {
    	this.canvas = <HTMLCanvasElement>document.getElementById(this.canvasId);
    	this.center = new Point(this.canvas.width/2, this.canvas.height/2);

	}

    render(radar : Radar) {
    	var context = this.canvas.getContext("2d");
    	context.strokeStyle = "green";
    	context.fillStyle = "green";

    	this.renderSectorLines(context, radar);

    	radar.rings.forEach( (ring) => this.renderRing(ring, context) );
    	radar.sectors.forEach( (sector) => this.renderSector(radar, sector, context));

	}

	private renderRing(ring : Ring, context : CanvasRenderingContext2D) {

		context.beginPath();
    	context.arc(this.center.x, this.center.y, ring.radius, 0, 2 * Math.PI);
    	context.stroke();

    	this.renderArcText(ring, context);
   	}

   	private renderArcText(ring : Ring, context : CanvasRenderingContext2D){

		var len : number = ring.name.length;
		var angle : number = Math.PI * 5 / 180;

		context.font = "16px Monaco";

		context.save();
    	context.translate(this.center.x, this.center.y);

        for(var n = 0; n < len; n++) {
          context.save();
          context.translate(5, (-1 * ring.radius) - 5);
          context.fillText(ring.name[n], 0, 0);
          context.restore();
          context.rotate(angle * 100/ring.radius);

        }
        context.restore();
	}

   	private renderSectorLines(context : CanvasRenderingContext2D, radar : Radar){
		context.moveTo(this.center.x, this.center.y - radar.outerRadius);
		context.lineTo(this.center.x, this.center.y + radar.outerRadius);
		context.stroke();

		context.moveTo(this.center.x - radar.outerRadius, this.center.y);
		context.lineTo(this.center.x + radar.outerRadius, this.center.y);
		context.stroke();
	}

	private renderSector(radar : Radar, sector : Sector, context : CanvasRenderingContext2D){

		var increment : number = Math.PI/ (2 * (sector.data.length + 2));
		var angle : number = sector.angle + increment;

		this.renderLegend(sector);

		sector.data.forEach ( (blip) => { 

			console.log(angle);

			this.renderBlip(angle, radar, blip, context);
			angle = angle + increment;

		});

	}

	private renderLegend(sector: Sector){

		var sectorDiv = document.getElementById(sector.divId);

		var header = document.createElement("h4");
		header.appendChild(document.createTextNode(sector.name));
		sectorDiv.appendChild(header);

		var list = document.createElement("ul");

		sector.data.forEach((blip) => {

			var item = document.createElement("li");
			item.appendChild(document.createTextNode(blip.name));
			list.appendChild(item);

			});


		sectorDiv.appendChild(list);
	}

	private renderBlip(angle : number, radar : Radar, blip : any, context : CanvasRenderingContext2D){

		context.fillStyle = "lime";
		context.save();
		
    	context.translate(this.center.x, this.center.y);
		context.rotate(-angle);

		var radius : number = this.getRadius(radar.step/2, blip.status);

		if(blip.movement == "s"){
			context.translate(0, radius);
			context.rotate(angle);
			context.fillRect(0, 0, 10, 10);
		}
		if(blip.movement == "t"){
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
		if(blip.movement == "c"){
			context.beginPath();
			context.save();
			context.translate(0, radius);
			context.arc(0, 0, 5, 0, 2 * Math.PI);
			context.fill();
			context.restore();
		}

		context.restore();
	}

	private getRadius(length : number, status : string) : number {
		var radius : number = 0;

		if(status == "Adopt"){
			radius = length;
		}
		if(status == "Trial"){
			radius = 3 * length;
		}
		if(status == "Assess"){
			radius = 5 * length;
		}
		if(status == "Hold"){
			radius = 7 * length;
		}

		return radius;

	}
}

function run(){
	var radar = new Radar(techniques, tools, libraries, platforms);
	var renderer = new Renderer("radar");
	renderer.render(radar);
}

run();