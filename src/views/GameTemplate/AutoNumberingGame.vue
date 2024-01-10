<template>
    <div>
        <br>
        <br>
        <div class="container">
            <canvas ref="canvas" width="700" height="400"></canvas>
            <p class="h3">{{ this.question.Text }}</p>
            <p class="h5">請點擊下方的按鈕選擇答案</p>
            <div id="error_msg">{{ errorMsg }}</div>
            <div class="d-flex flex-row  flex-wrap">
                <button v-for="(items,index) in btn" class="btn btn-primary m-1 flex-grow-1" @click="judgeAnswer(items)">
                    {{ items }}
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import Desribepng from '@/assets/GamePic/Source/description.png';
export default {
    name: 'AutoNumberingGame',
    data() {
        return {
            picture_total: 0,
            QuestionRange: [],
            picture_type: '.png',
            targetWidth: 100,
            targetHeight: 100,
            minDistance: 100,
            positions: [],
            exist_image: 0,
            wrong_time: 0,
            level: 0,
            canvas: null,
            context: null,
            error_text: null,
            errorMsg: '',
            btn:[],
        };
    },
    props: {
        question: {
            type: Object,
            required: true
        },
        answer: {
            type: Array,
            required: true
        }
    },
    created() {
        // this.picture_type="sth"//FIXME
        this.QuestionRange = this.question.Range;
        for (var i in this.question.ObjImgList) {
            this.picture_total += 1;
        }
        for(var i=this.question.Range[0];i<=this.question.Range[1];i++){
            this.btn.push(i);
        }
    },
    mounted() {
        this.canvas = this.$refs.canvas;
        this.context = this.canvas.getContext('2d');
        this.error_text = document.getElementById("error_msg");
        this.loadDescriptionImage();
    },
    methods: {
        getRandPicture() {
            const num = Math.floor(Math.random() * this.picture_total) + 1;
            var b = new URL(`../../assets/GamePic/${this.question.Root}/S_${num}${this.picture_type}`, import.meta.url).href;
            return b
        },
        randomPicturePosition() {
            var numImages = Math.floor(Math.random() * (this.question.Range[1]-this.question.Range[0])) + this.question.Range[0];
            const image = new Image();
            this.exist_image = 0;
            image.src = this.getRandPicture();
            this.positions = [];
            image.addEventListener('load', () => {
                for (let i = 0; i < numImages; i++) {
                    const x = Math.random() * (this.canvas.width - this.targetWidth);
                    const y = Math.random() * (this.canvas.height - this.targetHeight);
                    let isTooClose = false;
                    for (const d in this.positions) {
                        const existingX = this.positions[d][0];
                        const existingY = this.positions[d][1];
                        const distance = Math.sqrt((x - existingX) ** 2 + (y - existingY) ** 2);
                        if (distance < this.minDistance) {
                            isTooClose = true;
                            break;
                        }
                    }
                    if (!isTooClose) {
                        this.context.drawImage(image, x, y, this.targetWidth, this.targetHeight);
                        const position_of_image = [x, y];
                        this.positions.push(position_of_image);
                        this.exist_image += 1;
                    } else {
                        numImages += 1;
                    }
                }
                console.log(this.positions);
            });
        },
        drawCircleWithText(x, y, text) {
            this.context.beginPath();
            this.context.arc(x, y, 50, 0, 2 * Math.PI);
            this.context.strokeStyle = 'black';
            this.context.lineWidth = 1;  
            this.context.stroke();
            this.context.fillStyle = 'black';
            this.context.font = '20px Arial';
            this.context.textAlign = 'center';
            this.context.fillText(text, x, y + 70);
        },
        judgeAnswer(num) {
            console.log(num);
            //FIXME Wait for add Hint Swith
            if (num === this.exist_image) {
                console.log("Correct");
                this.newGame();
            } else if (this.wrong_time >= 3) {
                this.errorMsg = "請根據提示回答答案";
                this.drawClue();
            } else {
                num = 3 - this.wrong_time;
                this.errorMsg = `錯誤，請再試一次，剩餘${num}次機會`;
                this.wrong_time += 1;
            }
        },
        clearCanvas() {
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        },
        drawClue() {
            let num = 1;
            for (const i in this.positions) {
                this.drawCircleWithText(this.positions[i][0] + 50, this.positions[i][1] + 50, num.toString());
                num++;
            }
        },
        win() {
            if (this.level === 6) {
                setTimeout(() => {
                    location.reload();
                }, 3000);
            }
        },
        newGame() {
            this.level += 1;
            this.win();
            this.errorMsg = "";
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.context.font = '24px Arial';
            this.context.fillStyle = 'black';
            this.context.fillText('答對了', this.canvas.width / 2 - 50, this.canvas.height / 2);
            setTimeout(this.clearCanvas, 1500);
            setTimeout(this.randomPicturePosition, 1500);
        },
        loadDescriptionImage() {
            var start = true;
            const img = new Image();
            img.src = new URL(`../../assets/GamePic/${this.question.Root}/description.png`, import.meta.url).href;
            img.onload = () => {
                const scale = this.canvas.width / img.width;
                const height = img.height * scale;
                this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
                this.context.drawImage(img, 0, 0, this.canvas.width, height);
                this.canvas.addEventListener('click', () => {
                    if (start === true) {
                        this.clearCanvas();
                        this.randomPicturePosition();
                        start = false;
                    }
                });
            };
        },
    },
};
</script>