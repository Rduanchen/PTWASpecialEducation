<template>
	<div class="Outter">
		<canvas id="clock">
		</canvas>
	</div>
</template>

<script>
import { GetSlotComponentData } from '../utilitys/get_assets';
import Img from '../assets/SlotComponentData/Clock/Clock.png';
export default {
	name: 'Clock',
	data() {
		return {
			// Your data properties go here
		};
	},
	props: {
		ID: {
			type: String,
			required: true
		},
		Data: {
			type: Object,
			required: false
		}
	},
	mounted() {
		let canvas = document.getElementById('clock');
		let ctx = canvas.getContext('2d');
		let Outter = document.getElementsByClassName('Outter')[0].getBoundingClientRect();

		let border = Math.max(Outter.width, Outter.height)

		canvas.width = border;
		canvas.height = border;
		
		let img = new Image();
		img.onload = () => {
			ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
		};
		img.src = Img;

		class Vector {
			constructor(startX, startY, angle, length) {
				this.startX = startX;
				this.startY = startY;
				this.angle = Math.PI * (angle-90) / 180;
				this.length = length;
				this.endX = this.startX + Math.cos(this.angle) * this.length;
				this.endY = this.startY + Math.sin(this.angle) * this.length;
			}
		}
		if(this.Data.sec != undefined || this.Data.sec != ""){
			let Lsec = border / 2 * 0.7
			let sec = new Vector(border / 2, border / 2, this.Data.sec * 6, Lsec);
			ctx.beginPath();
			ctx.moveTo(border / 2, border / 2);
			ctx.lineTo(sec.endX, sec.endY);
			ctx.lineWidth = 3;
			ctx.strokeStyle = 'black';
			ctx.stroke();
			ctx.closePath();
		}
		
		if(this.Data.min != undefined || this.Data.min != ""){
			let Lmin = border / 2 * 0.6
			let min = new Vector(border / 2, border / 2, this.Data.min * 6, Lmin);
			ctx.beginPath();
			ctx.moveTo(border / 2, border / 2);
			ctx.lineTo(min.endX, min.endY);
			ctx.lineWidth = 4;
			ctx.strokeStyle = 'blue';
			ctx.stroke();
			ctx.closePath();
		}

		if(this.Data.hour != undefined || this.Data.hour != ""){
			let Lhour = border / 2 * 0.4
			let hour = new Vector(border / 2, border / 2, this.Data.hour * 30, Lhour);
			ctx.beginPath();
			ctx.moveTo(border / 2, border / 2);
			ctx.lineTo(hour.endX, hour.endY);
			ctx.strokeStyle = 'red';
			ctx.lineWidth = 5;
			ctx.stroke();
			ctx.closePath();
		}
	},
	// Other Vue component options go here
};
</script>

<style scoped>
/* Your component-specific styles go here */
.Outter{
	width: 50vh;
	height: 50vh;
}
</style>