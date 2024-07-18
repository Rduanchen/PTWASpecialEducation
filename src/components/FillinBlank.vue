<template>
<div v-html="renderedContent" class="Content"></div>
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
name: 'FillinBlank',
data() {
    return {
    Data: {
        Render: `
        # Header 1
        ---
        123432
        ## Header 2
        ### Header 3
        **Bold Text**
        - List 1
        $i$ Input Box
        $t$ tab
        $s$ space
        $n$ new line
        `
    },
    inputIndex: 0
    };
},
methods: {
    reply(index) {
    console.log(`Input at index ${index} changed`);
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
        const inputHTML = `<input type="text" @input="reply($event,${index})" />`;
        index++;
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
  