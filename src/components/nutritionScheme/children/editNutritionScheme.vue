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
                <!-- <span class="fl" style="padding-top:8px;">*推送范围：</span>    -->
                
                <!-- 年龄 -->
                <p class="fl clearfix" style="width:880px;margin-bottom:16px;">
                    <span class="fl">
                        <el-radio v-model="radio" label="1" @change="radioChange">年龄</el-radio>
                        <el-select
                            :disabled="age"
                            class="select"
                            style="width:330px;"
                            v-model="pushAge"
                            multiple
                            placeholder="请选择推送年龄">
                            <el-option
                            v-for="item in pushAgeData"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                    </span>

                    <span class="fl" style="margin-left:8px;">
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

            </div>
        </div>

        <h2>*方案内容</h2><br/>

        <!-- 富文本编辑器 -->
        <Ueditor :content="content" :config="config" :id="ue" ref="ue"></Ueditor>

        <!-- footer -->
        <div style="text-align:center;padding:18px 0px 18px 0px;">
            <p>
                <el-button @click="$router.go(-1)" style="background:#83BDF9;color:#fff;">取消</el-button>
                <el-button @click="publicSave($event,'1',$store.state.addNutritionScheme,$store.state.updateNutritionScheme)" style="background:#83BDF9;color:#fff;">保存并公开</el-button>
                <el-button @click="saveArticle($event,'0',$store.state.addNutritionScheme,$store.state.updateNutritionScheme)" style="background:#83BDF9;color:#fff;">保存</el-button>
            </p>
        </div>
    </div>
</template>


<style src="./editNutritionScheme.scss" scoped lang="scss">
    
</style>
<script>
    import Ueditor from '@/../static/ueditor.vue'
    import http from '@/utils/HttpClient'
    import Filtrate from '@/common/filtrate/filtrate.vue'
    export default {
        components:{
            Ueditor,
            "common-filtrate": Filtrate,
        },
        data(){
            return {
                options: [],
                configuration:{
                    value:'id',
                    label:'name',
                    children:'children'
                },
                selectedOptions: [],

                pushAgeData:[{
                    id:0,
                    value:'0',
                    label:'6-10岁'
                },{
                    id:1,
                    value:'1',
                    label:'11-13岁'
                },{
                    id:2,
                    value:'2',
                    label:'14岁以上'
                }],
                // 推送年龄
                pushAge:[],
               
                // 参数 
                editData:{
                    createUser:'',
                    title:'',//标题
                    content:'',//文章内容
                    pushAge:'',//推送范围条件-年龄  0-( 6-10岁） 1-(11-13)  2-(14岁以上)
                    openFlag:'',//是否公开
                    pushType:'',//推送类型 1 年龄，2健康问题
                    pushValue:'',//字段
                    healthType:'126' ////健康分类,参考疾病分类表id
                },


                // 年龄 年级单选
                radio: '',
                age:true,
                health:true,


                // 富文本
                content: '',
                config: {
                    initialFrameWidth: '100%',
                    initialFrameHeight: 1000,
                    wordCount: false,
                },
                ue: "ue", // 不同编辑器必须不同的id

                id:''
            }
        },
        methods:{
            // 单选选中的项
            getRadio(radio){
                this.editData.pushType = radio.radioTarget;
            },
            // 多选
            getCondition(data){
                // console.log('multipleCondition',data.multipleCondition)
            },
            handleChange(value) {
                return this.$refs.cascader.currentLabels;
            },
           
            publicSave(event,num,addTpye,editType){
                this.saveArticle(event,num,addTpye,editType)
            },

            abnormal(data){
                this.$store.commit('responseStatus',{'self':this,'data':data})
            },
            error(data){
                this.$store.commit('error',{'self':this,'data':data})
            },

            saveArticle(event,number,addTpye,editType){
                // console.log(addTpye,editType);
                if(this.id == '' && addTpye != false){
                    return this.$message({
                        type: 'error',
                        message: '没此这权限'
                    });
                }

                if(this.id != '' && editType != false){
                    return this.$message({
                        type: 'error',
                        message: '没此这权限'
                    });
                }
                // console.log(this.pushAge)
                this.getUEContent();
                this.editData.content = this.getUEContent();
                // 一般非空判断


                if(this.editData.title == ''){
                    return this.$message({
                        type: 'warning',
                        message: '请填写标题'
                    });
                }else if(this.editData.content == ''){
                    return this.$message({
                        type: 'warning',
                        message: '请选添加内容'
                    });
                }else if(this.radio == ''){
                    return this.$message({
                        type: 'warning',
                        message: '请选推送范围'
                    });
                }else if(this.pushAge.length<= '0' && this.selectedOptions.length<= '0'){
                    return this.$message({
                        type: 'warning',
                        message: '请选推送范围'
                    });
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
                    this.editData.pushType = '1'
                }else{
                    this.editData.pushAge = '';
                }

                if(this.selectedOptions.length>=1){
                    let valueData = '';
                    let healthValue = this.handleChange();
                    for(var i=0;i<healthValue.length;i++){
                        // console.log(healthValue[i])
                        valueData += healthValue[i] + ','
                    }

                    let strString = '';
                    for(let keys of this.selectedOptions){
                        strString += keys + ',';
                    }
                    this.editData.healthType = strString.slice(0,-1);

                    this.editData.pushValue = valueData.slice(0,-1);
                    this.editData.pushType = '2'
                }else{
                    this.editData.healthType = '';
                }


                this.editData.content = this.getUEContent();

                // console.log('editData',this.editData);

                if(number == 1){
                    if(this.id){
                        this.editData.id = this.id;
                       
                        this.editPost('/api/auth/v1/nutritionScheme/',this.id,this.editData)
                    }else{
                        this.editData.openFlag = '1';
                        this.editPost('/api/auth/v1/nutritionScheme','',this.editData)
                    }
                   
                }else{
                    this.editData.openFlag = 0;
                    if(this.id){
                        this.editData.id = this.id;
                        
                        this.editPost('/api/auth/v1/nutritionScheme/',this.id,this.editData)
                    }else{
                        this.editPost('/api/auth/v1/nutritionScheme','',this.editData)
                    }
                }
            },

            editPost(url,id,data){
                const loading = this.$loading({
                    lock: true,
                    text: 'Loading',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)'
                });
                http.post(url+id,data).then(res=>{
                    if(res.status.code == 0){
                        loading.close();
                        this.$message({
                            type: 'success',
                            message: '保存成功'
                        });
                        this.$router.push('/nutritionScheme');
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
            //    console.log('单选框',this.radio)
            },

            // 获取ueditor的html
            getUEContent() {
                return UE.getEditor(this.ue).getContent();
            },
            edit(id){
                const loading = this.$loading({
                    lock: true,
                    text: 'Loading',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)'
                });
                http.get('/api/auth/v1/nutritionScheme/'+id).then(res=>{
                    if(res.status.code == '0'){
                        // console.log('edit',res);
                        // content 富文本
                        this.content = res.data.content;
                        this.editData = res.data;
                     

                        if(this.editData.healthType){
                            // console.log(this.editData.healthType)
                            let arraySelect = this.editData.healthType.split(',')
                            // console.log(arraySelect)
                            for(var i=0;i<arraySelect.length;i++){
                                console.log(arraySelect[i])
                                this.selectedOptions.push(arraySelect[i]*1);
                            }
                            // console.log(this.selectedOptions)
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
                        this.abnormal(res.status);
                    }
                }).catch(error=>{
                    loading.close();
                    this.error(error);
                })
            },
            dropDownList(){
                const loading = this.$loading({
                    lock: true,
                    text: 'Loading',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)'
                });
                http.get('/api/auth/v1/diseaseClassify').then(res=>{
                    if(res.status.code == 0){
                    //    console.log(res);
                       this.options = res.data;
                       for(let key of this.options){
                        //    console.log(key);
                           if(key.children.length>=1){
                               for(let item of key.children){
                                //    console.log('一级',item)
                                   if(item.children.length>=1){
                                       for(let keys of item.children){
                                        //    console.log('二级',keys)
                                           if(keys.children.length>=1){
                                            //    for(let items of keys.children){
                                            //        console.log('三级',items)

                                            //        if(items.children.length>=1){

                                            //        }else{
                                            //            delete items.children
                                            //        }
                                            //    }
                                           }else{
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
            this.$store.commit('getRole','addNutritionScheme,updateNutritionScheme')
            this.id = this.$route.query.id || '';
            if(this.id){
                this.edit(this.id);
            }
            this.dropDownList();
        }
    }

</script>