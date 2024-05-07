<template>
<div class="container">
    <div class="clock">
        <div class="clock-face">
            <div class="hand hour-hand"></div>
            <div class="hand min-hand"></div>
            <div class="hand second-hand"></div>
        </div>
    </div>
</div>
</template>
<script>
export default {
    name: 'Clock',
    data(){
        return {

        }
    },
    props: {
        Data: {
            type: Object,
            required: true
        }
    },
    mounted(){
        const secondHand = document.querySelector('.second-hand')
        const minHand = document.querySelector('.min-hand')
        const hourHand = document.querySelector('.hour-hand')
        
        const secondsDegrees = ((this.Data.sec / 60) * 360)
        secondHand.style.transform = `rotate(${secondsDegrees}deg)`
        const minsDegrees = ((this.Data.min / 60) * 360)
        minHand.style.transform = `rotate(${minsDegrees}deg)`
        const hourDegrees = ((this.Data.hour / 12) * 360 + ((this.Data.min / 60) * 30))
        hourHand.style.transform = `rotate(${hourDegrees}deg)`
        
    }
}
</script>
<style>

.clock {
    width: 20rem;
    height: 20rem;
	border: 20px solid #333;
	border-radius: 50%;
	margin: 50px auto;
	position: relative;
	padding: 2rem;
}

.clock-face {
	position: relative;
	width: 100%;
	height: 100%;
	transform: translateY(-3px); /* account for the height of the clock hands */
}

.clock-face:after {
	content:'';
	display:block;
	width: 30px;
	height:30px;
	border-radius: 100%;
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%,-50%);
	background-color: #F00;
}

.hand {
	position: absolute;
	width: 100%;
	height: 100%;
}

.second-hand:after{
	position: absolute;
	content:'';
	display:block;
	width: 5px;
	height: 50%;
	background-color: red;
	left: 50%;
	/* bottom: 50%; */
	transform: translate(-50%,0%);
	/* transform: rotate(20deg); */
}

.min-hand:after{
	position: absolute;
	content:'';
	display:block;
	width: 10px;
	height: 40%;
	background-color: black;
	left: 50%;
	bottom: 50%;
	transform: translate(-50%,0%);
}

.hour-hand:after{
	position: absolute;
	content:'';
	display:block;
	width: 15px;
	height: 20%;
	background-color: black;
	left: 50%;
	bottom: 50%;
	transform: translate(-50%,0%);
}

</style>