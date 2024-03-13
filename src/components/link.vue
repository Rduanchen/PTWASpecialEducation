<template>
    <!-- {{ this.DotLocation }} -->
    <div class="canvas-container">
        <canvas id="responsive-bg" class="position-absolute"></canvas>
        <canvas ref="line_keeper" id="line_keeper" class="position-absolute"></canvas>
    </div>

    
</template>

<script>
import icon from '@/assets/GamePic/Cat.png';
export default {
    name: 'Link',
    data(){
        return{
            // RWD Setting
            Min_border: 10,
            Min_RowGap :30,
            Min_ImgWidth: 300,
            RWD_Img_Width: null,
            RWD_Gap_Width: null,

            // Game Setting
            TouchSensitive: 1, //This should be bigger than 0 , and the smaller more sensitive
            DotRadius: 7, //max


            //Line Drawer
            isDrawing: false,
            paths: [],


            //Line Checker
            ontouch_group:0,
            DotLocation:[],
            OnclickLocation:[], // [RowID,Index]

            //Check Answer

            //Fake Data
            QuestionDataStructure:[
                ['assets/GamePic/Cat.png','assets/GamePic/Cat.png','assets/GamePic/Cat.png'],
                ['assets/GamePic/Cat.png','assets/GamePic/Cat.png','assets/GamePic/Cat.png','assets/GamePic/Cat.png','assets/GamePic/Cat.png'],
                ['assets/GamePic/Cat.png','assets/GamePic/Cat.png']
            ],
            ans:[
                [[0,0],[1,0]],
                [[0,1],[1,2]],
                [[0,2],[1,1]]
            ]
        }
    },
    mounted() {
        const canvas1 = $('#responsive-bg')[0];
        const context1 = canvas1.getContext('2d');
        
        
        // Set Canvas size to full screen
        
        canvas1.width = window.innerWidth;
        canvas1.height = window.innerHeight;
        context1.clearRect(0, 0, canvas1.width, canvas1.height);
        
        let RWD_Info = this.CountRWDWidth(this.QuestionDataStructure);
        console.log(RWD_Info);
        this.RWD_Img_Width = RWD_Info.Img_width;
        this.RWD_Gap_Width = RWD_Info.Gap_width;
        this.DrawImgOnCanvas(this.QuestionDataStructure,context1);
            
        window.addEventListener('resize', () => {

            context1.clearRect(0, 0, canvas1.width, canvas1.height);
            canvas1.width = window.innerWidth;
            canvas1.height = window.innerHeight;
            let RWD_Info = this.CountRWDWidth(this.QuestionDataStructure);
            console.log(RWD_Info);
            this.RWD_Img_Width = RWD_Info.Img_width;
            this.RWD_Gap_Width = RWD_Info.Gap_width;
            this.DrawImgOnCanvas(this.QuestionDataStructure,context1);
        });
        this.canvas = this.$refs.line_keeper;
        this.context = this.canvas.getContext('2d');
        this.canvas.width= window.innerWidth;
        this.canvas.height= window.innerHeight;
        this.canvas.addEventListener('mousedown', this.handleMouseDown);
        this.canvas.addEventListener('mousemove', this.handleMouseMove);
        this.canvas.addEventListener('mouseup', this.handleMouseUp);
        this.canvas.addEventListener('touchstart', this.handleTouchStart);
        this.canvas.addEventListener('touchmove', this.handleTouchMove);
        this.canvas.addEventListener('touchend', this.handleTouchEnd);
    },
    methods: {
        CountRWDWidth(question){
            //利用比例計算出每個圖片的大小
            //如果太多列導致圖片太小則以圖片最小值為主
            let RowAmount=question.length;
            let column = parseInt((window.innerWidth-this.Min_border*2)/(RowAmount*2+(RowAmount-1)*3)) // 扣掉邊界後，根據比例計算出圖片、間隔的大小(2:3)
            return {
                Img_width : column*2,
                Gap_width : column*3
            }
        },
        CountMaxImgSize(ImageRowAmount){
            //參數為每一欄圖片的數量 
            //計算出每個圖片的最大大小
            let Height= (window.innerHeight-this.Min_border*2)/ImageRowAmount;
            let Width = this.RWD_Img_Width;
            return{
                Max_Height: Height,
                Max_Width: Width
            }
        },
        ResizeRWDImg(ImgMaxSizeInfo,Img){
            let Img_Final_Height;
            let Img_Final_Width;
            let ratio =Img.height/Img.width;
            Img_Final_Height = ImgMaxSizeInfo.Max_Height;
            Img_Final_Width = ImgMaxSizeInfo.Max_Height/ratio;
            if (Img_Final_Width > ImgMaxSizeInfo.Max_Width) {
                Img_Final_Width = ImgMaxSizeInfo.Max_Width;
                Img_Final_Height = ImgMaxSizeInfo.Max_Width*ratio;
            }
            return {
                New_Height: Img_Final_Height,
                New_Width: Img_Final_Width
            }   
        },
        CountRWDYGap(question){
            //回傳每一欄沒有用到的圖片的間隔
            let full_space = 0;
            let Max_Img_Size = this.CountMaxImgSize(question.length);
            console.log(Max_Img_Size.Max_Height);
            for(var i in question){
                let img = new Image();
                // img.src = question[i];
                img.src = icon //FIXME: 這裡要改成vue動態匯入
                let Img_Size = this.ResizeRWDImg(Max_Img_Size,img);
                console.log(Img_Size.New_Height);
                full_space += Img_Size.New_Height;
            }
            return (window.innerHeight-this.Min_border*2-full_space)/(question.length+1)
            // return 0
        },
        DrawImgOnCanvas(question,context1,){
            let Column_Amount=question.length;
            var onchangegroup = false;
            let Column_ID = 1
            let Group = 1
            for (let col = 0; col < question.length; col++) { //Column
                //紀錄錨點資訊
                // let Dot_Row_ID = 1
                const Max_Img_Size = this.CountMaxImgSize(this.QuestionDataStructure[col].length);
                let RWD_Colum_Gap=this.CountRWDYGap(question[col])
                
                console.log(RWD_Colum_Gap);

                for (let Dot_Row_ID = 0; Dot_Row_ID < question[col].length; Dot_Row_ID++) { //Row
                    let Img = new Image();
                    // let Image_Url=new URL(`../../${question[col][row]}`, import.meta.url).href
                    let Image_Url = icon //FIXME: 這裡要改成vue動態匯入
                    Img.src = Image_Url;

                    let Img_Size = this.ResizeRWDImg(Max_Img_Size,Img);
                    // Img.height = Img_Size.New_Height;
                    // Img.width = Img_Size.New_Width;

                    let x = this.Min_border + Max_Img_Size.Max_Width*col + this.RWD_Gap_Width*col
                    let y = this.Min_border + RWD_Colum_Gap + Max_Img_Size.Max_Height*Dot_Row_ID
                    // let bordr=100

                    Img.onload = () => {
                        console.log(this.Min_border);
                        context1.drawImage(Img, x, y, Img_Size.New_Width, Img_Size.New_Height);
                        context1.beginPath();
                        if (col == 0) {
                            // add on right
                            context1.arc((x+Img_Size.New_Width+this.Min_border), (y+(Img_Size.New_Height/2)), this.DotRadius, 0, Math.PI * 2, true);
                            this.DotLocation.push([[Dot_Row_ID,col,Group],[x+Img_Size.New_Width+this.Min_border, y+Img_Size.New_Height/2]]);
                            
                            console.log(Dot_Row_ID,col,Group);

                            context1.fillStyle = 'black';
                            context1.fill();
                            
                            // this.DotLocation.push([x+Img_Size.New_Width+this.Min_border-this.TouchSensitive, y+Img_Size.New_Height/2-this.TouchSensitive]);
                        }
                        else if (col == Column_Amount-1) {
                            // add on left
                            context1.arc(x-this.Min_border,(y+(Img_Size.New_Height/2)), this.DotRadius, 0, Math.PI * 2, true);
                            this.DotLocation.push([[Dot_Row_ID,col,Group],[x-this.Min_border, y+Img_Size.New_Height/2]]);
                            context1.fillStyle = 'black';
                            context1.fill();
                            
                            // this.DotLocation.push([x+Img_Size.New_Width+this.Min_border-this.TouchSensitive, y+Img_Size.New_Height/2-this.TouchSensitive]);
                        }
                        else{
                            // onchangegroup = true;
                            // add on both side
                            console.log("Add Both Side");
                            context1.arc(x-this.Min_border,(y+(Img_Size.New_Height/2)), this.DotRadius, 0, Math.PI * 2, true);
                            context1.arc((x+Img_Size.New_Width+this.Min_border), (y+(Img_Size.New_Height/2)), this.DotRadius, 0, Math.PI * 2, true);
                            //Right
                            this.DotLocation.push([[Dot_Row_ID,col+1,Group+1],[x+Img_Size.New_Width+this.Min_border, y+Img_Size.New_Height/2]]);
                            //Left
                            this.DotLocation.push([[Dot_Row_ID,col,Group],[x-this.Min_border, y+Img_Size.New_Height/2]]);
                            // console.log(Dot_Row_ID,Column_ID,Group);

                            context1.fillStyle = 'black';
                            context1.fill();
                            
                            // this.DotLocation.push([x+Img_Size.New_Width+this.Min_border-this.TouchSensitive, y+Img_Size.New_Height/2-this.TouchSensitive]);
                            
                        }
                        context1.closePath();
                    }
                    // Row_ID++;
                }
                if(col != Column_Amount-1 && col != 0){
                    console.log("Change Group");
                    Group+=1;
                    onchangegroup = false;
                }
            }
        },
        getEventPos(evt) {
            const rect = this.canvas.getBoundingClientRect();
            return {
                x: evt.clientX - rect.left,
                y: evt.clientY - rect.top
            };
        },
        handleMouseDown(e) {
            var rep =this.JudgeRange(e.clientX,e.clientY);
            console.log(rep);
            this.row=rep.RowID;
            this.ontouch_group=rep.Group;
            if(rep.Locate){
                if (!this.isDrawing) {
                    console.log("Start Drawing");
                    this.isDrawing = true;
                    const startPos = this.getEventPos(e);
                    this.paths.push({ startX: startPos.x, startY: startPos.y });
                    this.OnclickLocation=[rep.RowID,rep.Index];
                } 
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
            var rep =this.JudgeRange(e.clientX,e.clientY);
            // var CA =this.CheckAnswer(this.OnclickLocation[0],this.OnclickLocation[1],rep.RowID,rep.Index)
            let CA=true; //temp
            if(rep.Locate && this.ontouch_group==rep.Group && this.row!=rep.RowID && CA){
                if (this.isDrawing) {
                    this.isDrawing = false;
                    const endPos = this.getEventPos(e);
                    this.paths[this.paths.length - 1].endX = endPos.x;
                    this.paths[this.paths.length - 1].endY = endPos.y;
                    this.drawPaths();
                }
                this.ontouch_group=0;
            }
            else{
                this.isDrawing = false;
                this.clearLastPath();
            }
        },
        handleTouchStart(e) {
            var rep =this.JudgeRange(e.touches[0].clientX,e.touches[0].clientY);
            this.row=rep.RowID;
            this.ontouch_group=rep.Group;
            if(rep.Locate){
                e.preventDefault();
                this.isDrawing = true;
                const startPos = this.getEventPos(e.touches[0]);
                this.paths.push({ startX: startPos.x, startY: startPos.y });
                this.OnclickLocation=[rep.RowID,rep.Index];
            }
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
            var rep =this.JudgeRange(e.changedTouches[0].clientX,e.changedTouches[0].clientY);
            // var CA =this.CheckAnswer(this.OnclickLocation[0],this.OnclickLocation[1],rep.RowID,rep.Index)
            let CA=true; //temp
            if(rep.Locate && this.ontouch_group==rep.Group && this.row!=rep.RowID && CA){
                if (this.isDrawing) {
                    e.preventDefault();
                    this.isDrawing = false;
                    const endPos = this.getEventPos(e.changedTouches[0]);
                    this.paths[this.paths.length - 1].endX = endPos.x;
                    this.paths[this.paths.length - 1].endY = endPos.y;
                    this.drawPaths();
                    this.ontouch_group=0;
                }
            }
            else{
                this.isDrawing = false;
                this.clearLastPath();
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
        },
        JudgeRange(x,y){
            for(var i=0;i<this.DotLocation.length;i++){
                // 利用兩線段的距離公式來判斷是否在點的範圍內
                length =((this.DotLocation[i][1][0] - x )**2+(this.DotLocation[i][1][1] - y )**2)**0.5;
                if(length<=(this.DotRadius)){
                    console.log(this.DotLocation[i][0][0],this.DotLocation[i][0][1],this.DotLocation[i][0][2],i);
                    return {Locate:true , Group:this.DotLocation[i][0][2], RowID:this.DotLocation[i][0][0], Index:this.DotLocation[i][0][1]};
                }
            }
            return {Locate:false , Group:undefined};
        },
        CheckAnswer(o_row,o_index,row,index){
            var find_ans=false;
            for(var i in this.ans){
                if(this.ans[i][0][0]==o_row && this.ans[i][0][1]==o_index && this.ans[i][1][0]==row && this.ans[i][1][1]==index){
                    find_ans=true;
                    break;
                }
                else if(this.ans[i][1][0]==o_row && this.ans[i][1][1]==o_index && this.ans[i][0][0]==row && this.ans[i][0][1]==index){
                    find_ans=true;
                    break;
                }
            }
            if(find_ans){
                console.log("Link Template Return Correct");
                this.Runtimes=this.Runtimes+1;
                if(this.Runtimes==this.TotalAmount){
                    this.GameOver();
                    this.$emit('play-effect', 'CorrectSound',)
                    // this.$emit('add-record',[[[row,index],[]],[row,index],"正確"])
                    this.$emit('add-record',["","","正確"])

                }
                return true;
            }
            else{
                console.log("Link Template Return Wrong");
                this.$emit('play-effect', 'WrongSound',)
                this.$emit('add-record',["","","錯誤"])
                return false;
            }

        },
        GameOver(){
            console.log("Component 'Link' post GameOver,All Answer Right")
            // this.$emit('check-answer',true);
            this.$emit('play-effect', 'CorrectSound',)
            this.$emit('add-record',["","","全對"])
            this.$emit('next-question');
        }
    }
}
</script>    
<style scoped>
    /* Your component styles go here */
    .canvas-container {
        display: flex; /* 使用 Flexbox 布局 */
        flex-direction: column; /* 子元素垂直排列 */
        align-items: center; /* 子元素水平居中 */
        position: relative; /* 相對定位，作為子元素的定位參考 */
    }
    canvas {
        position: absolute; /* 絕對定位來疊加 */
        top: 0;
        left: 0;
    }
    #myButton {
        margin-top: 20px; /* 按鈕與 canvas 區塊之間的距離 */
        /* 其他按鈕樣式 */
    }
    
</style>
    