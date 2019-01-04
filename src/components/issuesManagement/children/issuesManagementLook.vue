<template>
    <div class="issuesManagementLook border-radius">
        <div class="content">
            <p class="lh40">
                <el-col :span="8">
                    <span>提问人：{{details.askName?details.askName:'---'}}</span>
                </el-col>
                <el-col :span="8">
                    <span>类型：{{details.questionType?details.questionType:'---'}}</span>
                </el-col>
                <el-col :span="8">
                    <span>状态：{{details.replyStatus=='0'?'未回复':'已回复'}}</span>
                </el-col>
            </p>
            <p class="lh40">
                <span>提问：{{details.content}}</span>
            </p>
            <div>
                <p class="lh40">
                    <span>缩略图：</span><span v-if="!details.picUrl">- - -</span>
                </p>
                <span v-if="details.picUrl.length>=1" v-for="(key,index) in details.picUrl" :key="key.id">
                    <img :src="key" @click="openPicture($event,index,'0')" style="height:200px;width:300px;margin-left:4px;">
                </span>
            </div><br/>

            <div style="padding-top:20px;padding-right:20px;" v-for="(item,idx) in askQuestionReplys" :key="item.id">
                <div v-if="item.replyType == '0'" style="border-bottom:1px solid #ccc;">
                    <p>
                        <span>回复：{{item.content?item.content:'---'}}</span>
                    </p><br/>
                    <span v-if="item.picUrl">
                        <span  v-for="(key,index) in item.picUrl.split(',')" :key="key.id">
                            <img :src="key" @click="openPicture($event,index,'1',idx)" style="height:200px;width:300px;margin-left:4px;">
                        </span>
                    </span>
                    <p><br/>
                        <span>账号名：{{item.accountName?item.accountName:'---'}}</span><br/><br/>
                        <span>{{item.createTime?item.createTime:'---'}}</span>
                    </p>
                <br/><br/>
                </div>
                <div v-else style="border-bottom:1px solid #ccc;">
                    <p>
                        <span>提问：{{item.content?item.content:'---'}}</span>
                    </p><br/>
                    <p>
                        <span>{{item.createTime?item.createTime:'---'}}</span>
                    </p><br/>
                </div>
            </div><br/><br/>
            <span>12345654{{typeof($store.state[postType])=='boolean'}}</span>
            <div v-if="typeof($store.state[postType])=='boolean'">
                <p class="clearfix" style="width:600px;">
                    <span class="fl" style="margin-top:4px;">回复图片：</span>
                    <common-upload @upload="replyUpload" @remove="replyRemove" :condition="replyCondition" class="fl" ref="child"></common-upload>
                </p><br/>
                <p class="clearfix">
                    <textarea :disabled="$store.state[postType]" name="return" id="return" ref="return" cols="90" rows="14" class="fl" style="font-size:18px;"></textarea>
                    <el-button class="fl" style="background:#83BDF9;color:#fff;margin:244px 0px 0px 16px;" @click="reply($store.state[postType])">回复</el-button>
                </p>
            </div><br/><br/>

            <span v-for="key in details.picUrl" :key="key.id">
                <img :src="key" ref="size" style="display:none;">
            </span>

            <div id="look">
                <p v-for="item in askQuestionReplys" :key="item.id">
                    <i v-if="item.picUrl">
                        <span v-for="(key,index) in item.picUrl.split(',')" :key="key.id">
                            <img :src="key" @click="openPicture($event,index,'1')" style="display:none;" />
                        </span>
                    </i>
                </p>
            </div>
            
        </div>
        
        <el-dialog
            style="background:#000;"
            title="图片预览"
            :visible.sync="dialogVisible"
            :fullscreen="true">
            <div style="text-align: center;">
                <img :src="url" :style="'width:'+width+'px;height:'+height+'px;'">
            </div>
        </el-dialog>
    </div>
</template>

<style src="./issuesManagementLook.scss" lang="scss"></style>

<script>
    import http from '@/utils/HttpClient'
    import Upload from '@/common/upload/upload.vue'
    import mixin from '@/common/mixin/mixin'
    export default {
        components:{
            "common-upload":Upload
        },
        data(){
            Array.prototype.remove = function(val) { 
                var index = this.indexOf(val); 
                if (index > -1) { 
                    this.splice(index, 1); 
                } 
            };
            return {
                id:'',
                details:[],
                askQuestionReplys:[],
                dialogVisible:false,
                url:'',
                width:'',
                height:'',

                // 上传图片
                urlPicture:'',
                accountName:'',
                postType:'',

                replyCondition:{
                    num:3,
                    type:'png,jpeg,jpg',
                    title:'最多上传3张图片，格式为jpeg等图片格式'
                },
                arrayImg:[],
            }
        },
        mixins: [mixin],
        methods:{
            // 缩略图:
            replyUpload(data){
                this.arrayImg.push({url:data.uploadData.url.data.url,id:data.uploadData.idx});
            },
            replyRemove(data){
                for(let key of this.arrayImg){
                    if(key.id == data.removeIdx){
                        this.arrayImg.remove(key);
                    }
                }
            },
            openPicture(event,index,type,idx) {
                let imgSrc;
                let originalHeight;
                let originalWidth;

                if(type == '0'){
                    this.height = this.$refs.size[index].height;
                    this.width = this.$refs.size[index].width;
    
                    originalHeight = this.$refs.size[index].height;
                    originalWidth = this.$refs.size[index].width;
                }else if(type == '1'){
                    imgSrc = document.querySelector('#look').querySelectorAll('p');
                    imgSrc = imgSrc[idx].querySelectorAll('img');
                    this.height = imgSrc[index].height;
                    this.width = imgSrc[index].width;

                    originalHeight = imgSrc[index].height;
                    originalWidth = imgSrc[index].width;
                }
             
                if(this.height>=document.documentElement.clientHeight-114){
                    this.height = document.documentElement.clientHeight-120
                    this.width = this.height/originalHeight*this.width
                }

                if(this.width>=document.documentElement.clientWidth-60){
                    this.width = document.documentElement.clientWidth-60
                    this.height = this.width/originalWidth*this.height
                }

                if(originalHeight>=document.documentElement.clientHeight*2){
                    this.height = originalHeight
                    this.width = originalWidth
                }else if(originalWidth>=document.documentElement.originalWidth*2){
                    this.height = originalHeight
                    this.width = originalWidth
                }

                this.dialogVisible = true;
                this.url = event.target.src;
              
            },
            abnormal(data){
                this.$store.commit('responseStatus',{'self':this,'data':data})
            },
            error(data){
                this.$store.commit('error',{'self':this,'data':data})
            },

            // sale
            articleDetails(id){
                const loading = this.loading(this);
                http.get('/api/auth/v1/askQuestion/'+id).then(res=>{
                    if(res.status.code == 0){
                        this.details = res.data;  
                        if(this.details.picUrl.length>=1){
                            this.details.picUrl = this.details.picUrl.split(',')
                        }
                        this.askQuestionReplys = res.data.askQuestionReplys;
                        if(this.details.questionType == '0'){
                            this.details.questionType = '营养指导'
                            this.postType = 'nutritionReply'
                        }else if(this.details.questionType == '1'){
                            this.details.questionType = '运动指导'
                            this.postType = 'sportReply'
                        }else if(this.details.questionType == '2'){
                            this.details.questionType = '疾病防控'
                            this.postType = 'diseaseReply'
                        }else if(this.details.questionType == '3'){
                            this.details.questionType = 'APP问题反馈';
                            this.postType = 'questionReply'
                        }
                        loading.close();
                    }else{
                        loading.close();
                        this.abnormal(res.status);
                    }
                }).catch(error=>{
                    loading.close();
                    this.error(error);
                })
            },

            reply(role){
                let roleStatus = role.toString()
                if(roleStatus != 'false'){
                    return this.$message.warning('没有此权限');
                }
                
                if(this.$refs.return.value.length<=0){
                    return this.$message.warning('请填写回复内容');
                }
                
                 let loading = this.loading(this);

                if(this.arrayImg.length>=1){
                    let str = '';
                    for(let key of this.arrayImg){
                        str += key.url + ','
                    }
                    this.urlPicture = str.slice(0,-1);
                }

                let params = {
                    askQuestionId:this.details.id,
                    content:this.$refs.return.value,
                    picUrl:this.urlPicture,
                    accountName:this.accountName
                }

                http.post('/api/auth/v1/askQuestion/'+this.postType,params).then(res=>{
                    if(res.status.code == 0){
                        loading.close();
                        this.fileList2 = [];
                        this.$message.success('回复成功');
                        document.querySelector('ul.el-upload-list').innerHTML = '';
                        this.$refs.return.value = ''
                        this.articleDetails(this.id)
                        this.arrayImg = [];
                        this.urlPicture = '';
                        this.$refs.child.empty('string');
                    }else{
                        loading.close();
                        this.abnormal(res.status);
                    }
                }).catch(error=>{
                    loading.close();
                    this.error(error);
                })
            } 
        },
        mounted(){
            this.$store.commit('getRole','nutritionReply,sportReply,diseaseReply,questionReply')
            this.id = this.$route.query.id;
            this.articleDetails(this.id)
            const user = JSON.parse(window.localStorage.getItem('ydl_user'));
            this.accountName = user.username;
        },
        computed: {
            count(){
                return this.$store.state[this.postType]
            }
        } 
    }
</script>