<template>
    <div class="articlelook">
        <div class="clearfix">
            <p class="header fr">
                <el-button :disabled="$store.state.getArticleComment" @click="toreview" style="background:#83BDF9;color:#fff;">查看评论</el-button>
                <el-button :disabled="$store.state.updateArticle" @click="goedit" style="background:#83BDF9;color:#fff;">编辑</el-button>
            </p>
        </div>
        <div class="content">
            <p class="lh40">
                <el-col :span="24">
                    <span>标题：{{details.title?details.title:'---'}}</span>
                </el-col>
            </p>
            <p class="lh40">
                <el-col :span="8">
                    <span>作者：{{details.author?details.author:'---'}}</span>
                </el-col>
                <el-col :span="8">
                    <span>类型：{{details.articleType}}</span>
                </el-col>
                <span>更新时间：{{details.updateTime?details.updateTime:'---'}}</span>
            </p>
            <div>
                <p class="lh40">
                    <span>缩略图：</span>
                </p>
                <img @click="openPicture($event)" :src="details.picUrl?details.picUrl:'./../../../../static/imgs/placeholder.jpg'" alt="" style="height:200px;width:300px;">
            </div>

            <div><br/>
                <h5>推送范围：</h5>

                <p class="lh40" v-if="pushType2">
                    <el-col :span="2">
                        <span>个人版：</span>
                    </el-col>
                    <span v-show="details.pushAge">年龄：</span><span v-show="details.pushAge" class="mr">{{details.pushAge?details.pushAge:'---'}}</span>
                    <span v-show="details.gradeId">年级：</span><span v-show="details.gradeId" class="mr">{{details.gradeId?details.gradeId:'---'}}</span>
                    <span>性别：</span><span>{{details.sex?details.sex:'---'}}</span>
                </p>

                <p class="lh40" v-if="pushType1"> 
                    <el-col :span="2">
                        <span>学校版：</span>
                    </el-col>
                    <span>学校类型：</span><span>{{details.schoolType?details.schoolType:'---'}}</span>
                </p>
            </div>

            <div class="article">
                <h1 class="lh40">文章内容</h1>
                <div ref="content"></div><br/><br/>
            </div>
        </div>

        <img style="display:none;" ref="img" :src="details.picUrl?details.picUrl:'./../../../../static/imgs/placeholder.jpg'" alt="">

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

<style src="./articlelook.scss" lang="scss">

</style>


<script>
    import http from '@/utils/HttpClient'
    import mixin from '@/common/mixin/mixin'
    export default {
        data(){
            return {
                id:'',
                details:[],
                pushType1:false,
                pushType2:false,
                dialogVisible:false,
                height:'',
                width:'',
                url:''
            }
        },
        mixins: [mixin],
        methods:{
            openPicture(event) {
                this.viewImage(this,event);
            },
            // 文章详情
            articleDetails(id){
                const loading = this.loading(this);
                http.get('/api/auth/v1/article/'+id).then(res=>{
                    if(res.status.code == '0'){

                        if(res.data.pushVersion == '0'){
                            this.pushType1 = true;
                            this.pushType2 = false;
                        }else if(res.data.pushVersion == '1'){
                            this.pushType1 = false;
                            this.pushType2 = true;
                        }else if(res.data.pushVersion == '0,1' || res.data.pushVersion == '1,0'){
                            this.pushType1 = true;
                            this.pushType2 = true;
                        }


                        this.details = res.data;
                        // console.log('details',this.details)
                        // 文章类型
                        if(this.details.articleType == null){
                            this.details.articleType = '未知类型'
                        }else if(this.details.articleType == 0){
                            this.details.articleType = '营养'
                        }else if(this.details.articleType == 1){
                            this.details.articleType = '健康'
                        }else if(this.details.articleType == 2){
                            this.details.articleType = '运动'
                        }else if(this.details.articleType == 3){
                            this.details.articleType = '疾病'
                        }

                        // 推送年龄
                        if(this.details.pushAge == null || ''){
                            this.details.pushAge = '---'
                        }else{
                            let arr = this.details.pushAge.split(',');
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
                            this.details.pushAge = str
                        }

                        if(this.details.pushGrade == null || ''){
                            this.details.pushGrade = '---'
                        }else{
                            let arr = this.details.pushGrade.split(',');
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
                            this.details.gradeId = str.slice(0,-1);
                        }
                        
                      
                        // 推送性别
                        if(this.details.sex == null || ''){
                            this.details.sex = '---'
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
                            this.details.schoolType = '---'
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
                        this.$store.commit('responseStatus',{'self':this,'data':res.status})
                    }
                }).catch(error=>{
                    loading.close();
                    this.$store.commit('error',{'self':this,'data':error})
                })
            },
            // 评论
            toreview(){
                this.$router.push({path: '/article/articlereview', query:{"id": this.id}})
            },
            goedit(){
                this.$router.push({path: '/article/articleEdit', query:{"id": this.id}})
            }
        },
        mounted(){
            this.$store.commit('getRole','getArticleComment,updateArticle')
            this.id = this.$route.query.id;
            this.articleDetails(this.id)
        }
    }
</script>