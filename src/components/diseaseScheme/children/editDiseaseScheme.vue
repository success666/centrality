<template>
    <div>
        <div class="clearfix">
            <!-- title -->
            <p style="padding:10px 0px;">
                *标题：
                <el-input placeholder="请输入标题" v-model="editData.title" clearable style="width:80%;"></el-input>
            </p>
           
            <!-- 推送范围 -->
            <div class="fl clearfix">
                <span class="fl" style="padding-top:8px;">*推送范围：</span>
                <p class="fl clearfix" style="margin-bottom:10px;">
                    <span class="fl">
                        <el-radio v-model="radio" label="1" @change="radioChange">年龄</el-radio>
                        <el-select
                            class="select"
                            style="width:330px;"
                            :disabled="age"
                            v-model="pushAge"
                            multiple
                            placeholder="请选择推送年龄">
                            <el-option
                            v-for="item in $store.state.pushAgeData"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                    </span>
                    <span class="fl" style="margin-left:10px;">
                        <el-radio v-model="radio" label="2" @change="radioChange">健康问题</el-radio>
                        <el-cascader
                            style="width:260px;"
                            ref="cascader"
                            :disabled="health"
                            :options="options"
                            :props="configuration"
                            v-model="selectedOptions"
                            @change="handleChange"
                            placeholder="请选择健康问题">
                        </el-cascader>
                    </span>
                </p>

                <!-- <span class="fl" style="padding-top:14px;">*推送范围：</span>
                <p class="fl">
                    <common-filtrate @radioType="getRadio" @multiple="getCondition"></common-filtrate>
                </p> -->

                <p>
                    <span class="fl" style="margin-top:4px;">*缩略图：</span>
                    <common-upload @upload="upload" @remove="remove" :condition="condition" :imgsrc="imgsrc" class="fl"></common-upload>
                </p>
            </div>
        </div><br/>
        <!-- 富文本编辑器 -->
        <h2>*方案内容</h2>
        <div><br/>
            <Ueditor :content="content" :config="config" :id="ue" ref="ue"></Ueditor>
        </div><br/>

        <!-- footer -->
        <div class="ac">
            <p>
                <el-button @click="$router.go(-1)" style="background:#83BDF9;color:#fff;">取消</el-button>
                <el-button @click="publicSave($event,'1',$store.state.addDiseaseScheme,$store.state.updateDiseaseScheme)" style="background:#83BDF9;color:#fff;">保存并公开</el-button>
                <el-button @click="saveArticle($event,'0',$store.state.addDiseaseScheme,$store.state.updateDiseaseScheme)" style="background:#83BDF9;color:#fff;">保存</el-button>
            </p><br/>
        </div>
    </div>
</template>


<style src="./editDiseaseScheme.scss" scoped lang="scss">
    
</style>
<script>
    import Ueditor from '@/../static/ueditor.vue'
    import http from '@/utils/HttpClient'
    import Filtrate from '@/common/filtrate/filtrate.vue'
    import Upload from '@/common/upload/upload.vue'
    import mixin from '@/common/mixin/mixin'
    export default {
        components:{
            Ueditor,
            "common-filtrate": Filtrate,
            "common-upload":Upload
        },
        data(){
            return {
               
                options: [],
                selectedOptions: [],
                configuration:{
                    value:'id',
                    label:'name',
                    children:'children'
                },

                userId:'',
               
                // 推送年龄
                pushAge:[],
              
                // 参数 
                editData:{
                    createUser:'',
                    title:'',//标题
                    picUrl:'',//缩略图
                    content:'',//文章内容
                    pushAge:'',//推送范围条件-年龄  0-( 6-10岁） 1-(11-13)  2-(14岁以上)
                    pushValue:'',
                    healthType:'', 
                    pushType:''// 1.0.4版本
                },

                // 年龄 年级单选
                radio: '',
                age:true,
                health:true,

                // 富文本
                content: '',
                config: {
                    initialFrameWidth: '100%',
                    initialFrameHeight: 400,
                    wordCount: false,
                },
                ue: "ue", // 不同编辑器必须不同的id
                id:'',

                condition:{
                    num:1,
                    type:'png,jpeg,jpg',
                    title:'建议上传图片大小为160*160，格式为jpeg等图片格式'
                },
                imgsrc:''
            }
        },
        mixins: [mixin],
        methods:{
            // 上传图片
            upload(data){
                this.editData.picUrl = data.uploadData.url.data.url;
            },
            // 移除图片
            remove(data){
                this.editData.picUrl = data.removeIdx.url;
            },
            // 多选
            getCondition(data){
                // console.log('multipleCondition',data.multipleCondition)
            },
            // 单选选中的项
            getRadio(radio){
                this.editData.pushType = radio.radioTarget;
            },

            // 请求返回处理
            abnormal(data){
                this.$store.commit('responseStatus',{'self':this,'data':data})
            },
            error(data){
                this.$store.commit('error',{'self':this,'data':data})
            },


            handleChange(value) {
                return this.$refs.cascader.currentLabels;
            },

            publicSave(event,num,addTpye,editType){
                if(this.id == '' && addTpye == true){
                    return this.$message.error('没此这权限');
                }

                if(this.id != '' && editType == true){
                    return this.$message.error('没此这权限');
                }
                this.saveArticle(event,num)
            },
            saveArticle(event,number,addTpye,editType){
                if(this.id == '' && addTpye == true){
                    return this.$message.error('没此这权限');
                }

                if(this.id != '' && editType == true){
                    return this.$message.error('没此这权限');
                }
                this.getUEContent();
                
                this.editData.content = this.getUEContent();
                // // 一般非空判断
                if(this.editData.title == ''){
                    return this.$message.warning('请填写标题');
                }else if(this.editData.content == ''){
                    return this.$message.warning('请选添加内容');
                }else if(this.radio == ''){
                    return this.$message.warning('请选推送范围');
                }else if(this.pushAge.length<= '0' && this.selectedOptions.length<= '0'){
                    return this.$message.warning('请选推送范围');
                }
            
                if(this.pushAge.length>=1){
                    let str = '';
                    let ageData = '';
                    for(let key of this.pushAge){
                        if(key == '0'){
                            ageData += '6-10岁,'
                        }else if(key == '1'){
                            ageData += '11-13岁,'
                        }else if(key == '2'){
                            ageData += '14岁以上,'
                        }
                        str += key+',';
                    }
                    this.editData.pushAge = str.slice(0,-1);
                    this.editData.pushValue = ageData.slice(0,-1)
                    this.editData.pushType = 1;
                }else{
                    this.editData.pushAge = '';
                }

                if(this.selectedOptions.length>=1){
                    let valueData = '';
                    let healthValue = this.handleChange();
                    for(var i=0;i<healthValue.length;i++){
                        valueData += healthValue[i] + ','
                    }
                    let strString = '';
                    for(let keys of this.selectedOptions){
                        strString += keys + ',';
                    }
                    this.editData.healthType = strString.slice(0,-1);
                    this.editData.pushValue = valueData.slice(0,-1);
                    this.editData.pushType = 2;
                }else{
                    this.editData.healthType = '';
                }

                this.editData.createUser = this.userId;
                if(this.editData.picUrl == ''){
                    return this.$message.warning('请上传图片');
                }
                this.editData.content = this.getUEContent();

                if(number == 1){
                    if(this.id){
                        this.editData.id = this.id;
                        this.addpost('/api/auth/v1/diseaseScheme/',this.id,this.editData)
                    }else{
                        this.editData.openFlag = '1';
                        this.addpost('/api/auth/v1/diseaseScheme','',this.editData)
                    }
                }else{
                    this.editData.openFlag = 0;
                    if(this.id){
                        this.editData.id = this.id;
                        this.addpost('/api/auth/v1/diseaseScheme/',this.id,this.editData)
                    }else{
                        this.addpost('/api/auth/v1/diseaseScheme','',this.editData)
                    }
                }
            },

            addpost(url,id,data){
                const loading = this.loading(this);
                http.post(url+id,data).then(res=>{
                    if(res.status.code == 0){
                        loading.close();
                        this.$message.success('保存成功');
                        this.$router.push('/diseaseScheme');
                    }else{
                        loading.close();
                        this.abnormal(res.status);
                    }
                }).catch(error=>{
                    loading.close();
                    this.error(error);
                })
            },

            // 单选清空多选输入框
            radioChange(){
                if(this.radio == 1){
                    this.age = false;
                    this.health = true;
                    this.selectedOptions = [];
                }else if(this.radio == 2){
                    this.health = false;
                    this.age = true;
                    this.pushAge = [];
                }
            },

            // 获取ueditor的html
            getUEContent() {
                return UE.getEditor(this.ue).getContent();
            },
            edit(id){
                const loading = this.loading(this);
                http.get('/api/auth/v1/diseaseScheme/'+id).then(res=>{
                    if(res.status.code == 0){
                        // content 富文本
                        this.content = res.data.content;
                        this.editData = res.data;
                        // 缩略图片
                        this.imgsrc = this.editData.picUrl
                        if(this.editData.healthType){
                            let arraySelect = this.editData.healthType.split(',')
                            for(var i=0;i<arraySelect.length;i++){
                                this.selectedOptions.push(arraySelect[i]*1);
                            }
                            this.radio = '2';
                            this.age = true;
                            this.health = false;
                            this.pushAge = [];
                        }
                        if(this.editData.pushAge){
                            this.pushAge = this.editData.pushAge.split(',')
                            this.radio = '1';
                            this.age = false;
                            this.health = true;
                            this.selectedOptions = []
                        }
                        loading.close();
                    }else{
                        loading.close();
                        this.abnormal(res.status)
                    }
                }).catch(error=>{
                    loading.close();
                    this.error(error);
                })
            },
          
            dropDownList(){
                const loading = this.loading(this);
                http.get('/api/auth/v1/diseaseClassify').then(res=>{
                    if(res.status.code == 0){
                       this.options = res.data;
                       for(let key of this.options){
                           if(key.children.length>=1){
                               for(let item of key.children){
                                   if(item.children.length>=1){
                                       for(let keys of item.children){
                                           if(keys.children.length<=0){
                                               delete keys.children
                                           }
                                       }
                                   }else{
                                       delete item.children
                                   }
                               }
                           }else{
                               delete key.children;
                           }
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
            }
        },
        mounted(){
            this.id = this.$route.query.id || '';
            if(this.id){
                this.edit(this.id);
            }
            this.userId = JSON.parse(localStorage.getItem("ydl_user")).userId;
            this.dropDownList();
        }
    }
</script>