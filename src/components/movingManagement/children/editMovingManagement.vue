<template>
    <div>
        <div class="clearfix">
            <!-- title -->
            <p style="padding:10px 0px;">
                *名称：
                <el-input placeholder="请输入名称" v-model="editData.title" clearable style="width:80%;"></el-input>
            </p>
            <!-- 上传图片 -->
            <p class="clearfix" style="width:550px;">
                <span class="fl" style="margin-top:4px;">*缩略图：</span>
                <common-upload @upload="thumbnailUpload" @remove="thumbnailRemove" :condition="thumbnailCondition" :imgsrc="thumbnaiImgsrc" class="fl"></common-upload>
            </p>
            <br/><hr/><br/>
            <!-- 适合人群 -->
            <div>
                <p>适合人群</p><br/>
                <el-row>
                    <el-col :span="12">
                        *年级
                        <el-select
                            style="width:200px;"
                            v-model="pushClass"
                            multiple
                            collapse-tags
                            placeholder="请选推送年级">
                            <el-option
                            v-for="item in classData"
                            :key="item.code"
                            :label="item.name"
                            :value="item.code">
                            </el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="12">
                        *性别
                        <el-select
                            style="width:200px;"
                            v-model="sex"
                            multiple
                            placeholder="请选推送性别">
                            <el-option
                            v-for="item in $store.state.sexData"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                    </el-col>
                </el-row>
            </div>
            <br/><hr/><br/>
            <!-- 指导点属性 -->
            <div>
                <p>动作点属性</p><br/>
                <p>
                    <el-col :span="8">
                        *运动类型：
                        <el-select
                            style="width:220px;"
                            v-model="sportTypeData"
                            multiple
                            collapse-tags
                            placeholder="请选推送运动类型">
                            <el-option
                            v-for="item in sportType"
                            :key="item.code"
                            :label="item.name"
                            :value="item.code">
                            </el-option>
                        </el-select>
                    </el-col>
                    *锻炼部位：
                    <el-select
                        style="width:220px;"
                        v-model="exercisePositionData"
                        multiple
                        collapse-tags
                        placeholder="请选推送锻炼部位">
                        <el-option
                        v-for="item in exercisePosition"
                        :key="item.code"
                        :label="item.name"
                        :value="item.code">
                        </el-option>
                    </el-select>
                </p><br/>
                <p>
                    <el-col :span="8">
                        <span style="margin-left:32px;">
                            *强度：
                            <el-select
                                style="width:220px;"
                                v-model="exerciseIntensityData"
                                filterable
                                allow-create
                                default-first-option
                                placeholder="请选推送强度">
                                <el-option
                                v-for="item in $store.state.strengthStatus.slice(1)"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                                </el-option>
                            </el-select>
                        </span>
                    </el-col>
                    <span style="margin-left:16px;">
                        *运动数：
                        <el-input placeholder="组数量" v-model="editData.exerciseGroup" clearable style="width:120px;"></el-input>
                        组&nbsp;&nbsp;
                        每组
                        <el-input placeholder="每组数量" v-model="editData.groupValue" clearable style="width:120px;"></el-input>
                        <el-select
                            style="width:120px;"
                            v-model="editData.groupType"
                            filterable
                            allow-create
                            default-first-option
                            placeholder="请选择单位">
                            <el-option
                            v-for="item in sportNumber"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                    </span>
                    
                </p><br/>
                <p>
                    <el-col :span="8">
                        <span style="margin-left:32px;">
                            *场地：
                            <el-select
                                style="width:220px;"
                                v-model="editData.site"
                                filterable
                                allow-create
                                default-first-option
                                placeholder="请选推送场地">
                                <el-option
                                v-for="item in site"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                                </el-option>
                            </el-select>
                        </span>
                    </el-col>
                    <span style="margin-left:32px;">
                        *器械：
                        <el-select
                            style="width:220px;"
                            v-model="instrumentData"
                            multiple
                            collapse-tags
                            placeholder="请选推送器械">
                            <el-option
                            v-for="item in instrument"
                            :key="item.code"
                            :label="item.name"
                            :value="item.code">
                            </el-option>
                        </el-select>
                    </span>
                </p><br/>
                <p>
                    <el-col :span="8">
                        *关联素质：
                        <el-select
                            style="width:220px;"
                            v-model="relevanceQualityData"
                            multiple
                            collapse-tags
                            placeholder="请选推送关联素质">
                            <el-option
                            v-for="item in relevanceQuality"
                            :key="item.code"
                            :label="item.name"
                            :value="item.code">
                            </el-option>
                        </el-select>
                    </el-col>
                    <span  style="visibility:hidden;">*</span>关联运动：
                    <el-select
                        style="width:220px;"
                        v-model="relevanceSportData"
                        multiple
                        collapse-tags
                        placeholder="请选推送关联运动">
                        <el-option
                        v-for="item in relevanceSport"
                        :key="item.code"
                        :label="item.name"
                        :value="item.code">
                        </el-option>
                    </el-select>
                </p>
                
            </div>
            <br/><hr/><br/>


            <div>
                <p>动作点内容</p><br/>
                <p>*动作描述：</p><br/>
                <Ueditor :content="content" :config="config" :id="ue" ref="ue"></Ueditor><br/>
                <!-- 上传图片 -->
                <p class="clearfix" style="width:400px;">
                    <span class="fl" style="margin-top:4px;">*封面图：</span>
                    <common-upload @upload="surfacePlotUpload" @remove="surfacePlotRemove" :condition="surfacePlotCondition" :imgsrc="surfacePlotImgsrc" class="fl"></common-upload>
                </p>
            </div>
        </div><br/>
        <!-- 富文本编辑器 -->


        <!-- footer -->
        <div style="text-align:center;">
            <p>
                <el-button @click="goback" style="background:#83BDF9;color:#fff;">取消</el-button>
                <el-button @click="publicSave($event,'1',$store.state.addSportPoint,$store.state.updateSportPoint)" style="background:#83BDF9;color:#fff;">保存并公开</el-button>
                <el-button @click="saveArticle($event,'0',$store.state.addSportPoint,$store.state.updateSportPoint)" style="background:#83BDF9;color:#fff;">保存</el-button>
            </p>
        </div><br/>
    </div>
</template>


<style src="./editMovingManagement.scss" scoped lang="scss">
    
</style>
<script>
    import Ueditor from '@/../static/ueditor.vue'
    import http from '@/utils/HttpClient'
    import Upload from '@/common/upload/upload.vue'
    import mixin from '@/common/mixin/mixin'
    export default {
        components:{
            Ueditor,
            "common-upload":Upload
        },
        data(){
            return {
                classData:[],
                pushClass:[],
                sex:[],
                sportType:[],
                sportTypeData:[],
                exercisePosition:[],
                exercisePositionData:[],
                exerciseIntensityData:[],
                sportNumber:[{
                    id:'0',
                    value:'0',
                    label:'次',
                },{
                    id:'1',
                    value:'1',
                    label:'秒'
                }],

                site:[{
                    id:'0',
                    value:'0',
                    label:'室内'
                },{
                    id:'1',
                    value:'1',
                    label:'室外'
                }],
                instrument:[],
                instrumentData:[],
                relevanceQuality:[],
                relevanceQualityData:[],
                relevanceSport:[],
                relevanceSportData:[],

                editData:{
                    title: "",//标题
                    sex: "",//推送条件-性别 0 男 ；1 女 可多选
                    content: "",//动作描述
                    picUrl: "",//缩略图
                    coverPic: "",//封面图
                    pushClass: "",//推送条件-年级 可多选 关联 t_dict_details(code)
                    openFlag: '',//公开状态 0 不公开 1公开
                    sportType: "",//运动类型 关联 t_dict_details(code)
                    exercisePosition: "",//锻炼位置 关联 t_dict_details(code)
                    exerciseIntensity:'',//锻炼强度 0 低 1 中 2 高
                    exerciseGroup: "",//运动数(多少组)
                    groupValue: "",//每组的数量
                    groupType: '',//0 次 1 秒 (组单位)
                    site:'',//0 室内 1 室外
                    instrument: "",//锻炼器械 关联 t_dict_details(code)
                    relevanceQuality: "",//关联素质 关联 t_dict_details(code)
                    relevanceSport: "",//关联运动 关联 t_dict_details(code)
                    // delFlag: '',//删除标识 0-否 1- 是
                    createUser: '',//创建用户id
                    // pushStatus: ''//推送标识 0-否 1- 是
                },
               
                // 富文本
                content: '',
                config: {
                    initialFrameWidth: '100%',
                    initialFrameHeight: 400,
                    wordCount: false,
                },
                ue: "ue", // 不同编辑器必须不同的id
                id:'',

                thumbnailCondition:{
                    num:1,
                    type:'png,jpeg,jpg',
                    title:'建议上传180*130图片，大小不超过100KB，格式为jpeg等图片格式'
                },
                thumbnaiImgsrc:'',

                surfacePlotCondition:{
                    num:1,
                    type:'png,jpeg,jpg,gif',
                    title:'建议上传4:3图片，格式为jpeg等图片格式'
                },
                surfacePlotImgsrc:''
            }
        },
        mixins: [mixin],
        methods:{
            // 缩略图:
            thumbnailUpload(data){
                this.editData.picUrl = data.uploadData.url.data.url;
            },
            thumbnailRemove(data){
                this.editData.picUrl = data.removeIdx.url;
            },
            // 封面图
            surfacePlotUpload(data){
                this.editData.coverPic = data.uploadData.url.data.url;
            },
            surfacePlotRemove(data){
                this.editData.coverPic = data.removeIdx.url;
            },

            // 取消
            goback(){
                this.$router.go(-1);
            },
            // 保存
            publicSave(event,num,addTpye,editType){
                this.saveArticle(event,num,addTpye,editType)
            },

            // 返回处理
            abnormal(data){
                this.$store.commit('responseStatus',{'self':this,'data':data})
            },
            error(data){
                this.$store.commit('error',{'self':this,'data':data})
            },

            saveArticle(event,number,addTpye,editType){
                if(this.id == '' && addTpye != false){
                    return this.$message.error('没此这权限');
                }
                if(this.id != '' && editType != false){
                    return this.$message.error('没此这权限');
                }
                this.editData.createUser = JSON.parse(localStorage.getItem("ydl_user")).userId;
                if(this.editData.title.length<1){
                    return this.$message.warning('请输入名称')
                }
                if(this.editData.picUrl == ''){
                    return this.$message.warning('请上传缩略图')
                }
                if(this.pushClass.length>=1){
                    this.editData.pushClass = this.arrayToString(this.pushClass)
                }else{
                    return this.$message.warning('请选推送年级')
                }
                if(this.sex.length>=1){
                    this.editData.sex = this.arrayToString(this.sex)
                }else{
                    return this.$message.warning('请选推送性别')
                }
                if(this.sportTypeData.length>=1){
                    this.editData.sportType = this.arrayToString(this.sportTypeData)
                }else{
                    return this.$message.warning('请选推送运动类型')
                }
                if(this.exercisePositionData.length>=1){
                    this.editData.exercisePosition = this.arrayToString(this.exercisePositionData)
                }else{
                    return this.$message.warning('请选推送锻炼部位')
                }
                if(this.exerciseIntensityData.length>=1){
                    this.editData.exerciseIntensity = this.exerciseIntensityData;
                }else{
                    return this.$message.warning('请选推送强度')
                }
                if(this.relevanceQualityData.length>=1){
                    this.editData.relevanceQuality = this.arrayToString(this.relevanceQualityData)
                }else{
                    return this.$message.warning('请选推送关联素质')
                }
                if(this.relevanceSportData.length>=1){
                    this.editData.relevanceSport = this.arrayToString(this.relevanceSportData)
                }else{
                    // return this.$message({
                    //     type:'warning',
                    //     message:'请选推送关联运动'
                    // })
                    this.editData.relevanceSport = '';
                }
                if(this.instrumentData.length>=1){
                    this.editData.instrument = this.arrayToString(this.instrumentData)
                }else{
                    return this.$message.warning('请选推送器械')
                }
                this.editData.content = this.getUEContent();
                if(this.editData.content.length<1){
                    return this.$message.warning('请输入内容')
                }
                if(this.editData.coverPic == ''){
                    return this.$message.warning('请上传封面图')
                }
                if(number == 1){
                    this.editData.openFlag = '1';
                    if(this.id){
                        this.editData.createUser = this.id;
                        this.addpost('/api/auth/v1/sportPoint/',this.id,this.editData)
                    }else{
                        this.addpost('/api/auth/v1/sportPoint/','',this.editData)
                    }
                }else{
                    this.editData.openFlag = '0';
                    if(this.id){
                        this.editData.createUser = this.id;
                        this.addpost('/api/auth/v1/sportPoint/',this.id,this.editData)
                    }else{
                        this.addpost('/api/auth/v1/sportPoint/','',this.editData)
                    }
                }
            },

            addpost(url,id,data){
                const loading = this.loading(this);
                http.post(url+id,data).then(res=>{
                    if(res.status.code == '0'){
                        this.$message.success('保存成功');
                        this.$router.push('/movingManagement');
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

            // 运动类型数据
            getSportType(){
                http.get('/api/auth/v1/common/getSportType').then(res=>{
                    if(res.status.code == '0'){
                        this.sportType = res.data;
                    }else{
                        this.abnormal(res.status);
                    }
                }).catch(error=>{
                    this.error(error);
                })
            },
            // 锻炼部位数据
            getExercisePosition(){
                http.get('/api/auth/v1/common/getExercisePosition').then(res=>{
                    if(res.status.code == '0'){
                        this.exercisePosition = res.data;
                    }else{
                        this.abnormal(res.status);
                    }
                }).catch(error=>{
                    this.error(error);
                })
            },

            // 器械数据
            getInstrumentType(){
                const loading = this.loading(this);
                http.get('/api/auth/v1/common/getInstrumentType').then(res=>{
                    if(res.status.code == '0'){
                        this.instrument = res.data;
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
            // 关联素质数据
            getSportQuality(){
                http.get('/api/auth/v1/common/getSportQuality').then(res=>{
                    if(res.status.code == '0'){
                        this.relevanceQuality = res.data;
                    }else{
                        this.abnormal(res.status);
                    }
                }).catch(error=>{
                    this.error(error);
                })
            },
            
            // 关联运动数据
            getRelevanceSportType(){
                http.get('/api/auth/v1/common/getRelevanceSportType').then(res=>{
                    if(res.status.code == '0'){
                        this.relevanceSport = res.data
                    }else{
                        this.abnormal(res.status);
                    }
                }).catch(error=>{
                    this.error(error);
                })
            },
            // 年级类型
            getClass(){
                http.get('/api/auth/v1/common/getPushClass').then(res=>{
                    if(res.status.code == 0){
                        this.classData = res.data;
                    }else{
                        this.abnormal(res.status);
                    }
                }).catch(error=>{
                    this.error(error);
                })
            },

            // 获取ueditor的html
            getUEContent() {
                return UE.getEditor(this.ue).getContent();
            },
            edit(id){
                const loading = this.loading(this);
                http.get('/api/auth/v1/sportPoint/'+id).then(res=>{
                    if(res.status.code == '0'){
                        this.editData = res.data;
                        this.thumbnaiImgsrc = this.editData.picUrl
                        this.surfacePlotImgsrc = this.editData.coverPic
                        this.pushClass = this.editData.pushClass.split(',');
                        this.instrumentData = this.editData.instrument.split(',');
                        this.sex = this.editData.sex.split(',');
                        this.sportTypeData = this.editData.sportType.split(',');
                        this.exercisePositionData = this.editData.exercisePosition.split(',')
                        this.exerciseIntensityData = String(this.editData.exerciseIntensity);
                        if(this.editData.site == '0'){
                            this.editData.site = '0'
                        }else if(this.editData.site == '1'){
                            this.editData.site = '1'
                        }
                        this.editData.groupType = String(this.editData.groupType);
                        this.relevanceQualityData = this.editData.relevanceQuality.split(',');
                        if(this.editData.relevanceSport){
                            this.relevanceSportData = this.editData.relevanceSport.split(',')
                        }
                        this.content = this.editData.content;
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
            this.$store.commit('getRole','addSportPoint,updateSportPoint')
            this.id = this.$route.query.id || ''; 
            if(this.id){
                this.edit(this.id);
            }
            this.getClass();
            this.getSportType();
            this.getExercisePosition();
            this.getSportQuality();
            this.getRelevanceSportType();
            this.getInstrumentType();
        }
    }
</script>