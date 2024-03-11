<template>
    <canvas id="canvas" width="1000" height="500" style="border: solid;"></canvas>
</template>
<script>
import canvas from './canvas.vue';

export default {
    mounted() {
        this.canvas = document.getElementById('canvas');
        this.context = this.canvas.getContext('2d');
        this.isDrawing = false;
        this.x = 0;
        this.y = 0;
        this.offsetX = 0;
        this.offsetY = 0;
        this.ongoingTouches = [];
        this.canvas.addEventListener('touchstart', this.handleStart);
        this.canvas.addEventListener('touchend', this.handleEnd);
        this.canvas.addEventListener('touchcancel', this.handleCancel);
        this.canvas.addEventListener('touchmove', this.handleMove);
        this.canvas.addEventListener('mousedown', this.handleMouseDown);
        this.canvas.addEventListener('mousemove', this.handleMouseMove);
        this.canvas.addEventListener('mouseup', this.handleMouseUp);
    },
    methods: {
        changeLineWidth(width){
            this.lineWidth = width;
        },
        setcolor(color){
            this.color = color;
        },
        handleStart(evt) {
            console.log();
            evt.preventDefault();
            const touches = evt.changedTouches;
            this.offsetX = this.canvas.getBoundingClientRect().left;
            this.offsetY = this.canvas.getBoundingClientRect().top;
            for (let i = 0; i < touches.length; i++) {
                this.ongoingTouches.push(this.copyTouch(touches[i]));
            }
        },
        handleMove(evt) {
            evt.preventDefault();
            const touches = evt.changedTouches;
            for (let i = 0; i < touches.length; i++) {
                const idx = this.ongoingTouchIndexById(touches[i].identifier);
                if (idx >= 0) {
                    this.context.beginPath();
                    this.context.moveTo(this.ongoingTouches[idx].clientX - this.offsetX, this.ongoingTouches[idx].clientY - this.offsetY);
                    this.context.lineTo(touches[i].clientX - this.offsetX, touches[i].clientY - this.offsetY);
                    this.context.lineWidth = this.lineWidth;
                    this.context.strokeStyle = this.color;
                    this.context.lineJoin = "round";
                    this.context.closePath();
                    this.context.stroke();
                    this.ongoingTouches.splice(idx, 1, this.copyTouch(touches[i]));  // swap in the new touch record
                }
            }
        },
        handleEnd(evt) {
            evt.preventDefault();
            const touches = evt.changedTouches;
            for (let i = 0; i < touches.length; i++) {
                let idx = this.ongoingTouchIndexById(touches[i].identifier);
                if (idx >= 0) {
                    this.context.lineWidth = this.lineWidth;
                    this.context.fillStyle = this.color;
                    this.ongoingTouches.splice(idx, 1);  // remove it; we're done
                }
            }
        },
        handleCancel(evt) {
            evt.preventDefault();
            const touches = evt.changedTouches;
            for (let i = 0; i < touches.length; i++) {
                let idx = this.ongoingTouchIndexById(touches[i].identifier);
                this.ongoingTouches.splice(idx, 1);  // remove it; we're done
            }
        },
        handleMouseDown(e) {
            this.x = e.clientX - this.offsetX;
            this.y = e.clientY - this.offsetY;
            this.isDrawing = true;
        },
        handleMouseMove(e) {
            if (this.isDrawing) {
                this.drawLine(this.x, this.y, e.clientX - this.offsetX, e.clientY - this.offsetY);
                this.x = e.clientX - this.offsetX;
                this.y = e.clientY - this.offsetY;
            }
        },
        handleMouseUp(e) {
            if (this.isDrawing) {
                this.drawLine(this.x, this.y, e.clientX - this.offsetX, e.clientY - this.offsetY);
                this.x = 0;
                this.y = 0;
                this.isDrawing = false;
            }
        },
        copyTouch({ identifier, clientX, clientY }) {
            return { identifier, clientX, clientY };
        },
        ongoingTouchIndexById(idToFind) {
            for (let i = 0; i < this.ongoingTouches.length; i++) {
                const id = this.ongoingTouches[i].identifier;
                if (id === idToFind) {
                    return i;
                }
            }
            return -1;    // not found
        },
        drawLine(x1, y1, x2, y2) {
            this.context.beginPath();
            this.context.strokeStyle = this.color;
            this.context.lineWidth = this.lineWidth;
            this.context.lineJoin = "round";
            this.context.moveTo(x1, y1);
            this.context.lineTo(x2, y2);
            this.context.closePath();
            this.context.stroke();
        },
        clearArea() {
            this.context.setTransform(1, 0, 0, 1, 0, 0);
            this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
        }
    },
    data() {
        return {
            lineWidth: '8',
            color: '#000'
        };
    }
};
</script>

<style lang="scss">
    #canvas {
        border: solid;
    }
</style>
