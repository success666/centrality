<template>
    <span>
        <el-upload
            v-loading="loading"
            accept="image/*"
            class="upload-demo"
            :action="uploadPictureUrl"
            :on-remove="handleRemove"
            :http-request="request"
            :before-upload="beforeAvatarUpload"
            :file-list="fileList"
            list-type="picture">
            <el-button size="small" type="primary">点击上传</el-button>
            <span style="color:red;font-size:12px;">{{condition.title}}</span>
        </el-upload>
    </span>
</template>
<style>

</style>
<script>
import superagent from 'superagent'
import mixin from '@/common/mixin/mixin'
export default {
    data(){
        Array.prototype.remove = function(val) { 
            var index = this.indexOf(val); 
            if (index > -1) { 
                this.splice(index, 1); 
            } 
        };
        return{
            loading:false,
            uploadPictureUrl:'',
            fileList:[],
            idx:'',
            fileName:[],
            removeTarget:''

        }
    },
    props:["condition","imgsrc"],
    methods:{
        empty(data){
            this.fileName = [];
        },
        handleRemove(file, fileList) {
            if(this.fileName.length>0 || this.fileList.length>0){
                for(let key of this.fileName){
                    if(key.id == file.raw.index){
                        this.removeTarget = key;
                        this.fileName.remove(key);
                    }
                }
                if(this.condition.num == 1){
                    this.$emit('remove', {removeIdx: {url:''}});
                }else{
                    this.$emit('remove', {removeIdx: this.removeTarget.id});
                }
            }
        },
        beforeAvatarUpload(file) {
            if(this.fileName.length + 1 > this.condition.num){
                this.$message.warning(
                    `当前限制选择${this.condition.num}个文件`
                );
                return false;
            }

            if(JSON.stringify(this.fileName).indexOf(file.name)>=0){
                this.$message.warning(`图片已存在`);
                return false;
            }else{
                var myData = new Date(); 
                this.idx = myData.getTime()
                this.fileName.push({name:file.name,id:this.idx});
                file.index = this.idx;
            }
           
            if(this.condition.type.indexOf('gif')<0){
                let arrayImg = file.name.split('.');
                let len = arrayImg.length-1;
                if(arrayImg[len] == 'gif'){
                    this.$message.warning(
                        `不可以上传gif图片`
                    );
                    return false;
                }
            }
        },
        request(content){
            this.loading = true;
            let formData = new FormData;
            formData.append('file', content.file);
            var myData = new Date(); 
            var times = myData.getTime()
            let name = content.file.name;
            let arrayImg = name.split('.');
            let len = arrayImg.length-1;
            formData.append('fileName',times+'.'+arrayImg[len]);
            formData.append('dir','/img/article/thumbnail')
            superagent
            .post(this.uploadPictureUrl)
            .set('Accept','application/json')
            .send(formData)
            .end((res,rep)=>{
                if(rep.body.status.code == 0){
                    this.$emit('upload', {uploadData: {url:rep.body,idx:this.idx}});
                    this.loading = false;
                    this.$message.success(
                        `上传成功`
                    );
                }else{
                    this.$message.warning(rep.body.status.msg);
                    this.loading = false;
                }
            })
        },
    },
   watch: {
        imgsrc(val) {
            this.fileList = [{url:val}];
        }
    },
    mounted(){
        this.uploadPictureUrl = process.env.UPLOAD_API + '/api/upload'
    }
}
</script>
