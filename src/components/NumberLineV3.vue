<template>
  <div class="OutterContainer">
    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" class="svg">
    </svg>
  </div>
</template>
<script>
    export default {
      name: 'NumberLine',
      mounted() {
        let Svg = document.querySelector('svg');
        Svg.appendChild(this.SvgAddComponent(10, 20, 30, 30));
      },
      methods: {
            SvgAddComponent(x, y, width, height) {
              let component = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject');
              component.setAttribute('x', x);
              component.setAttribute('y', y);
              component.setAttribute('width', width);
              component.setAttribute('height', height);
              let slot = document.createElement('slot');
              component.appendChild(slot);
              return component;
            }
      }
    }
 </script>