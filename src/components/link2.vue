<template>
    <div>
        <canvas ref="myCanvas" width="400" height="400"></canvas>
        <button @click="clearLastPath">清除上一个轨迹</button>
    </div>
</template>

<script>
export default {
    data() {
        return {
            isDrawing: false,
            paths: []
        };
    },
    mounted() {
        this.canvas = this.$refs.myCanvas;
        this.context = this.canvas.getContext('2d');
        this.canvas.addEventListener('mousedown', this.handleMouseDown);
        this.canvas.addEventListener('mousemove', this.handleMouseMove);
        this.canvas.addEventListener('mouseup', this.handleMouseUp);
        this.canvas.addEventListener('touchstart', this.handleTouchStart);
        this.canvas.addEventListener('touchmove', this.handleTouchMove);
        this.canvas.addEventListener('touchend', this.handleTouchEnd);
    },
    methods: {
        getEventPos(evt) {
            const rect = this.canvas.getBoundingClientRect();
            return {
                x: evt.clientX - rect.left,
                y: evt.clientY - rect.top
            };
        },
        handleMouseDown(e) {
            if (!this.isDrawing) {
                this.isDrawing = true;
                const startPos = this.getEventPos(e);
                this.paths.push({ startX: startPos.x, startY: startPos.y });
            } else {
                this.isDrawing = false;
                const endPos = this.getEventPos(e);
                this.paths[this.paths.length - 1].endX = endPos.x;
                this.paths[this.paths.length - 1].endY = endPos.y;
                this.drawPaths();
            }
        },
        handleMouseMove(e) {
            if (this.isDrawing) {
                const currentPos = this.getEventPos(e);
                this.paths[this.paths.length - 1].currentX = currentPos.x;
                this.paths[this.paths.length - 1].currentY = currentPos.y;
                this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
                this.drawPaths();
            }
        },
        handleMouseUp(e) {
            if (this.isDrawing) {
                this.isDrawing = false;
                const endPos = this.getEventPos(e);
                this.paths[this.paths.length - 1].endX = endPos.x;
                this.paths[this.paths.length - 1].endY = endPos.y;
                this.drawPaths();
            }
        },
        handleTouchStart(e) {
            e.preventDefault();
            this.isDrawing = true;
            const startPos = this.getEventPos(e.touches[0]);
            this.paths.push({ startX: startPos.x, startY: startPos.y });
        },
        handleTouchMove(e) {
            if (this.isDrawing) {
                e.preventDefault();
                const currentPos = this.getEventPos(e.touches[0]);
                this.paths[this.paths.length - 1].currentX = currentPos.x;
                this.paths[this.paths.length - 1].currentY = currentPos.y;
                this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
                this.drawPaths();
            }
        },
        handleTouchEnd(e) {
            if (this.isDrawing) {
                e.preventDefault();
                this.isDrawing = false;
                const endPos = this.getEventPos(e.changedTouches[0]);
                this.paths[this.paths.length - 1].endX = endPos.x;
                this.paths[this.paths.length - 1].endY = endPos.y;
                this.drawPaths();
            }
        },
        drawPaths() {
            this.paths.forEach(path => {
                this.context.beginPath();
                this.context.moveTo(path.startX, path.startY);
                this.context.lineTo(path.currentX, path.currentY);
                this.context.stroke();
                this.context.closePath();
            });
        },
        clearLastPath() {
            this.paths.pop();
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.drawPaths();
        }
    }
};
</script>
