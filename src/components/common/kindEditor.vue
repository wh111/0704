<template>
  <div id="hello" style="width: 100%">
    <h1>vue-kindedtior demo</h1>
    <editor id="editor_id" height="500px" width="100%" :content="editorText"
            :afterChange="afterChange()"
            pluginsPath="/static/kindeditor/plugins/"
            :loadStyleMode="false"

            @on-content-change="onContentChange"></editor>


  </div>
</template>

<script>

  export default {
    name: 'hello',
    data () {
      return {
        editorText: '',
        editorText2: '',
        config: [
          'source', '|', 'undo', 'redo', '|', 'preview', 'print', 'template', 'code', 'cut', 'copy', 'paste',
          'plainpaste', 'wordpaste', '|', 'justifyleft', 'justifycenter', 'justifyright'
        ]
      }
    },
    created () {
    },
    methods: {
      onContentChange (val) {
        this.editorText = val
      },
      onContentChange2 (val) {
        this.editorText2 = val

      },
      afterChange () {
          console.log("____")
      }
    }
  }
</script>

<style>
  #hello {
    float: left;
  }
</style>
