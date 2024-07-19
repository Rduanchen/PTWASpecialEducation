<template>
<div>
    <div v-html="renderedContent" class="Content"></div>    
</div>
</template>

<script>
/*
    Simple Markdown
    # Header 1
    ## Header 2
    ### Header 3
    **Bold Text**
    $i$ Input Box
    $t$ tab
    $s$ space
    $n$ new line
    - List 1
*/
export default { 
name: 'Markdown',
props: {
    Data: {
        type: Object,
        required: true
    }
},
data() {
    return {
        // Data: {
        //     Render: `
        //         123432
        //         # Header 1
        //         ## Header 2
        //         ### Header 3
        //         **Bold Text**
        //         - List 1
        //         $i$ $i$ Input Box
        //         $i$ Input Box
        //         $t$ tab
        //         $s$ space
        //         $n$ new line
        //     `,
        //     Answers: [
        //         '1',
        //         '2',
        //         '3'
        //     ]
        // },
        inputIndex: 0,
        InputVal: [],
        temp: false,
    };
},
methods: {
    reply(index) {
        this.InputVal[index] = document.getElementById(`Box${index}`).value;
        let check = true;
        for (let i = 0; i < this.Data.Answers.length; i++) {
            if (this.Data.Answers[i] == this.InputVal[i]) {
                check = true;
            } else {
                check = false;
            }
        }
        if (check) {
            this.$emit('ReplyAnswer', true);
            this.temp = true;
        }
        else{
            this.$emit('ReplyAnswer', false);
            this.temp = false;
        }
    }
},
mounted() {
    const matches = this.Data.Render.match(/\$i\$/g);
    const count = matches ? matches.length : 0;
    for (let i = 0; i < count; i++) {
        this.InputVal.push(0);
    }
    for (let i = 0; i < this.inputIndex; i++) {
        document.getElementById(`Box${i}`).addEventListener('input', (event) => {
            this.reply(i);
        });
    }
},
computed: {
    renderedContent() {
        let content = this.Data.Render;
        let index = 0;
        content = content.replace(/### (.*?)\n/g, '<h3>$1</h3>\n'); // ### Header 3
        content = content.replace(/## (.*?)\n/g, '<h2>$1</h2>\n'); // ## Header 2
        content = content.replace(/# (.*?)\n/g, '<h1>$1</h1>\n'); // # Header 1
        content = content.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>'); // **Bold Text**
        content = content.replace(/\$i\$/g, () => {
            const inputHTML = `<input type="text" id="Box${this.inputIndex}"/>`;
            this.inputIndex ++ ;
            return inputHTML;
        }); // $i$ Input Box
        content = content.replace(/\$t\$/g, '&nbsp;&nbsp;&nbsp;&nbsp;'); // $t$ tab
        content = content.replace(/\$s\$/g, '&nbsp;'); // $s$ space
        content = content.replace(/\$n\$/g, '<br/>'); // $n$ new line
        content = content.replace(/---\n/g, '<hr>\n'); // - List 1
        content = content.replace(/- (.*?)\n/g, '<ul><li>$1</li></ul>\n'); // - List 1
        return content;
    }
}
};
</script>
<style scoped>
/* Your component's styles go here */
.Content {
    padding: 20px;
    font-family: Arial, sans-serif;
    width: 100%;
    height: 100%;
}
</style>
  