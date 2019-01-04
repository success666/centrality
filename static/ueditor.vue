<template>
  <div>
    <!--<p>富文本编辑器</p>-->
    <script :id="id" type="text/plain"></script>
  </div>
</template>

<script>
  import './UE/themes/default/css/ueditor.css'
  import './UE/ueditor.config.js'
  import './UE/ueditor.all'
  import './UE/lang/zh-cn/zh-cn'
  import './UE/ueditor.parse.min'
  var _this;
  export default {
    data() {
      return {
        editor: null
      }
    },
    props: {
      content: {
        type: String,
        default: ''
      },
      config: {
        type: Object
      },
      id: {
        type: String
      }
    },
    mounted() {
      _this = this;

     
      _this.editor = UE.getEditor(_this.id, _this.config)// 初始化UE
   
    
        
    },
    watch: {
      content(val) {
        if (val) {
          this.editor.ready(function(editor) {
            _this.editor.setContent(val)
          })
        }
      }
    },
    methods: {
      getContent() { // 获取内容方法
        return this.editor.getContent()
      }
    },
    destroyed() {
      this.editor.destroy()
    }
  }
</script>

<style scoped>

</style>
