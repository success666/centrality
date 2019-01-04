<template>
    <div class="movingManagementLook" style="background:#EFEFEF;">
        <div class="clearfix">
            <p class="header fr">
                <el-button :disabled="$store.state.updateSportPoint" @click="goedit" style="background:#83BDF9;color:#fff;">编辑</el-button>
            </p>
        </div>
        <div class="content">
            <P class="lh40">
                <span>标题：{{details.title?details.title:'---'}}</span>   
            </P>
            <div>
                <p class="lh40">
                    <span>缩略图：</span>
                </p>
                <img @click="openPicture($event,'picUrl')" :src="details.picUrl?details.picUrl:'./../../../../static/imgs/placeholder.jpg'" alt="" style="height:200px;width:300px;">
            </div><br/>
            <hr/>
            <div class="lh40">
                <h2>适合人群</h2>
                <p>
                    <span>年级：{{details.pushClass?details.pushClass:'---'}}</span>
                </p>
                <p>
                    <span>姓别：{{details.sex?details.sex:'---'}}</span>
                </p>
            </div>
            <hr/>

            <div>
                <h5 style="padding:20px 0px;">动作点属性</h5>
                <p class="lh40">
                    <span>运动类型：{{details.sportTypeName?details.sportTypeName:'---'}}</span>
                </p>
                <p class="lh40">
                    <span>锻炼部位：{{details.exercisePositionName?details.exercisePositionName:'---'}}</span>
                </p>
                <p class="lh40">
                    <span>强度：{{details.exerciseIntensity?details.exerciseIntensity:'---'}}</span>
                </p>
                <p class="lh40">
                    <span>场地：{{details.site == '0'?'室内':'室外'}}</span>
                </p>
                
                <p class="lh40">
                    <span>运动数：{{details.exerciseGroup?details.exerciseGroup:'---'}}组，</span>每组<span>{{details.groupValue}}</span><span>{{details.groupType == '0'?'次':'秒'}}</span>   
                </p>
                <p class="lh40">
                    <span>器械：{{details.instrumentName?details.instrumentName:'---'}}</span>
                </p>
                <p class="lh40">
                    <span>关联素质：{{details.relevanceQualityName?details.relevanceQualityName:'---'}}</span>
                </p>
                <p class="lh40">
                    <span>关联运动：{{details.relevanceSportName?details.relevanceSportName:'---'}}</span>
                </p>
            </div>
            <hr/>

            <div class="article">
                <h1 class="lh40 font20">动作点内容</h1>
                <p class="lh40">动作描述：</p>
                <div ref="content"></div>
            </div>
            <div>
                <p class="lh40">
                    <span>封面图：</span>
                </p>
                <img @click="openPicture($event,'coverPic')" :src="details.coverPic?details.coverPic:'./../../../../static/imgs/placeholder.jpg'" alt="" style="height:200px;width:300px;">
            </div>

            <img style="display:none;" ref="picUrl" :src="details.picUrl?details.picUrl:'./../../../../static/imgs/placeholder.jpg'" alt="">

            <img style="display:none;" ref="coverPic" :src="details.coverPic?details.coverPic:'./../../../../static/imgs/placeholder.jpg'" alt="">
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

<style src="./movingManagementLook.scss" lang="scss">

</style>


<script>
    import http from '@/utils/HttpClient'
    export default {
        data(){
            return {
                id:'',
                details:[],
                dialogVisible:false,
                height:'',
                width:'',
                url:''
            }
        },
        methods:{
            openPicture(event,pictureType) {
                let originalHeight = '';
                let originalWidth = '';
                if(pictureType == 'picUrl'){
                    this.height = this.$refs.picUrl.height;
                    originalHeight = this.$refs.picUrl.height;
                    this.width = this.$refs.picUrl.width;
                    originalWidth = this.$refs.picUrl.width;
                }else if(pictureType == 'coverPic'){
                    this.height = this.$refs.coverPic.height;
                    originalHeight = this.$refs.coverPic.height;
                    this.width = this.$refs.coverPic.width;
                    originalWidth = this.$refs.coverPic.width;
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
            articleDetails(id){
                const loading = this.$loading({
                    lock: true,
                    text: 'Loading',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)'
                });
                http.get('/api/auth/v1/sportPoint/'+id).then(res=>{
                    if(res.status.code == '0'){
                        this.details = res.data;
                        // 文章类型
                        if(this.details.exerciseIntensity == '0'){
                            this.details.exerciseIntensity = '低'
                        }else if(this.details.exerciseIntensity == '1'){
                            this.details.exerciseIntensity = '中'
                        }else if(this.details.exerciseIntensity == '2'){
                            this.details.exerciseIntensity = '高'
                        }

                        // 推送年龄
                        if(this.details.puchAge == null || ''){
                            this.details.puchAge = '未知推送年龄范围'
                        }else{
                            let arr = this.details.puchAge.split(',');
                            let str = '';
                            for(let key of arr){
                                if(key == '0'){
                                    str += '(6-10岁) '
                                }else if(key == '1'){
                                    str += '(6-10岁) '
                                }else if(key == '2'){
                                    str += '(14岁以上) '
                                }
                            }
                            this.details.puchAge = str
                        }

                        if(this.details.pushClass == null || ''){
                            this.details.pushClass = '未知推送年级范围'
                        }else{
                            let arr = this.details.pushClass.split(',');
                            let str = '';
                            for(let key of arr){
                                if(key == '104010'){
                                    str += '一年级,'
                                }else if(key == '104020'){
                                    str += '二年级 '
                                }else if(key == '104030'){
                                    str += '三年级,'
                                }else if(key == '104040'){
                                    str += '四年级,'
                                }else if(key == '104050'){
                                    str += '五年级,'
                                }else if(key == '104060'){
                                    str += '六年级,'
                                }else if(key == '104070'){
                                    str += '初一,'
                                }else if(key == '104080'){
                                    str += '初二,'
                                }else if(key == '104090'){
                                    str += '初三,'
                                }else if(key == '104100'){
                                    str += '高一,'
                                }else if(key == '104110'){
                                    str += '高二,'
                                }else if(key == '104120'){
                                    str += '高三,'
                                }
                            }
                            this.details.pushClass = str.slice(0,-1);
                        }
                        
                      
                        // 推送性别
                        if(this.details.sex == null || ''){
                            this.details.sex = '未知推送性别'
                        }else{
                            let arr = this.details.sex.split(',');
                            let str = '';
                            for(let key of arr){
                                if(key == '0'){
                                    str += '男 '
                                }else if(key == '1'){
                                    str += '女 '
                                }
                            }
                            this.details.sex = str
                        }
                        
                   

                        // 学校类型
                        if(this.details.schoolType == null || ''){
                            this.details.schoolType = '未知学校类型'
                        }else{
                            let arr = this.details.schoolType.split(',');
                            let str = '';
                            for(let key of arr){
                                if(key == '0'){
                                    str += '小学 '
                                }else if(key == '1'){
                                    str += '初中 '
                                }else if(key == '2'){
                                    str += '高中 '
                                }
                            }
                            this.details.schoolType = str
                        }

                        this.$refs.content.innerHTML = this.details.content
                        loading.close();
                    }else{
                        loading.close();
                        this.$store.commit('responseStatus',{'self':this,'data':res.status});
                    }
                }).catch(error=>{
                    loading.close();
                    this.$store.commit('error',{'self':this,'data':error})
                })
            },
            
            goedit(){
                this.$router.push({path: '/movingManagement/movingManagementEdit', query:{"id": this.id}})
            }
        },
        mounted(){
            this.$store.commit('getRole','updateSportPoint')
            this.id = this.$route.query.id;
            if(this.id){
                this.articleDetails(this.id)
            }
        }
    }
</script>