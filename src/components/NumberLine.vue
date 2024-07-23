<template>
    <div class="OutterContainer">
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" class="svg">
      </svg>
    </div>
    </template>
    
<script>
  import { defineAsyncComponent } from 'vue';
  export default {
    name: 'NumberLine',
    components: {
      Fractions: defineAsyncComponent(() => import('@/components/Fractions.vue')),
      Input: defineAsyncComponent(() => import('@/components/ReplyInput.vue'))
    },
    data() {
      return {
        bais: 20,
        NowX: 0,
        Gap : undefined,
        Data: {
          Unit : "Number",
          Start: 0,
          End: 1000,
          Increment: 100,
          Annotate: 200,
          SlotComponentName: "Fractions",          
          Blank : {
            200: {
              Answer: {
                Mother: 2,
                Son: 3
              }
            },
            300: {
              Answer: {
                Mother: 3,
                Son: 4
              }
            }
          },
          // Blank : {
          //   200: {
          //     Answer: {
          //       Number: 200
          //     }
          //   },
          //   300: {
          //     Answer: {
          //       Number: 300
          //     }
          //   }
          // }
        },
        AnnotateLineHeight: 30,
        IncrementLineHeight: 15,
        SvgHeight: 100,
        SvgWidth: 500,
        FontSize: 17
      };
    },
    created() {
      // Code to run when the component is created
      this.NowX = this.bais;
    },
    mounted() {
      let OutterContainer = document.querySelector('.OutterContainer');
      // this.SvgHeight = OutterContainer.clientHeight;
      // this.SvgWidth = OutterContainer.clientWidth;
      // this.AnnotateLineHeight = this.SvgHeight / 2;
      // this.IncrementLineHeight = this.SvgHeight / 3;
      // this.bais = this.SvgWidth / 10;
      // this.FontSize = this.SvgHeight / 3 / ((this.Data.End - this.Data.Start) / this.Data.Annotate);
      this.NowX = this.bais;
      let Svg = document.querySelector('svg');
      Svg.style.height = this.SvgHeight;
      Svg.style.width = this.SvgWidth;
      Svg.appendChild(this.SvgAddLine(this.bais, this.AnnotateLineHeight / 2, this.SvgWidth - this.bais, this.AnnotateLineHeight / 2));
      this.CountGap(this.SvgWidth);
      for (let i = this.Data.Start; i <= this.Data.End; i += this.Data.Increment){
        if ( i in this.Data.Blank){
          // Svg.appendChild(this.SvgAddComponent(this.NowX, this.AnnotateLineHeight + this.FontSize, i));
          Svg.appendChild(this.SvgAddInputBox(this.NowX, this.AnnotateLineHeight + this.FontSize, i));
          console.log(i,"Blank");
        }
        else if ( i % this.Data.Annotate == 0 ){
          Svg.appendChild(this.SvgAddText(this.NowX, this.AnnotateLineHeight + this.FontSize, i));
        }
        if (i % this.Data.Annotate == 0){
          console.log(i);
          Svg.appendChild(this.SvgAddLine(this.NowX, 0 , this.NowX, this.AnnotateLineHeight));
        } else {
          Svg.appendChild(this.SvgAddLine(this.NowX, this.AnnotateLineHeight / 2 - this.IncrementLineHeight / 2, this.NowX, this.AnnotateLineHeight / 2 + this.IncrementLineHeight / 2));
        }
        this.NowX += this.Gap;
      }
    },
    methods: {
      CountGap(CanvasWidth){
        this.Gap =( CanvasWidth - this.bais * 2) / ( Math.abs(this.Data.End - this.Data.Start) / this.Data.Increment);
      },
      SvgAddLine(startX,StartY,EndX,EndY){
        let Line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        Line.setAttribute('x1', startX);
        Line.setAttribute('y1', StartY);
        Line.setAttribute('x2', EndX);
        Line.setAttribute('y2', EndY);
        Line.setAttribute('stroke', 'black');
        Line.setAttribute('stroke-width', 3);
        return Line;
      },
      SvgAddText(x, y, textContent){
        // Use forgeinObject to create a text element.
        let Text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        Text.setAttribute('x', x);
        Text.setAttribute('y', y);
        Text.setAttribute('font-size', this.FontSize);
        Text.setAttribute('text-anchor', 'middle');
        Text.textContent = textContent;
        return Text;
      },
      SvgAddInputBox(x, y, index){
        let component = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject');
        component.setAttribute('x', x);
        component.setAttribute('y', y);
        component.setAttribute('width', 30);
        component.setAttribute('height', 30);
        component.setAttribute('text-anchor', 'middle');
        let div = document.createElement('div');
        div.setAttribute('class', 'InputBox');
        div.setAttribute('contenteditable', 'true');
        div.setAttribute('style', 'border: solid 1px black;');
        component.appendChild(div);
        return component;
      },
      SvgAddComponent(x, y, index) {
        let component = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject');
        component.setAttribute('x', x);
        component.setAttribute('y', y);
        component.setAttribute('width', 30);
        component.setAttribute('height', 30);
        let div = document.createElement('div');

      }
    }
  };
  </script>
  <style scoped>
  .OutterContainer{
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    border: solid 1px black;
    .svg{
      width: 10vw;
      height: 10vh;
    }
  }
  </style>