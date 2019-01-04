<template>
    <div class="diseaseSchemeLook">
        <div class="clearfix">
            <p class="header fr">
                <el-button :disabled="$store.state.updateDiseaseScheme" @click="goedit" style="background:#83BDF9;color:#fff;">编辑</el-button>
            </p>
        </div>
        <div class="content">
            <p class="lh40">
                <span>标题：{{details.title?details.title:'---'}}</span>
            </p>
            <div>
                <el-col :span="8">
                    <span>推送范围：</span>
                    <span>{{details.pushValue?details.pushValue:'---'}}</span>
                </el-col>
                <span>更新时间：{{details.updateTime?details.updateTime:'---'}}</span>
            </div>
            <div>
                <p class="lh40">
                    <span>缩略图：</span>
                </p>
                <img  @click="openPicture($event)" :src="details.picUrl?details.picUrl:'./../../../../static/imgs/placeholder.jpg'" alt="" style="height:200px;width:300px;">
            </div>

            <div class="article">
                <h1 class="lh40 font20">方案内容</h1>
                <div ref="content" style="padding-bottom:60px;"></div>
            </div>

            <img style="display:none;" ref="img" :src="details.picUrl?details.picUrl:'./../../../../static/imgs/placeholder.jpg'" alt=""/>

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

    </div>
</template>

<style src="./diseaseSchemeLook.scss" lang="scss">

</style>

<script>
    import http from '@/utils/HttpClient'
    import mixin from '@/common/mixin/mixin'
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
        mixins: [mixin],
        methods:{
            openPicture(event) {
                this.viewImage(this,event);
            },
            // 文章详情
            Details(id){
                const loading = this.loading(this);
                http.get('/api/auth/v1/diseaseScheme/'+id).then(res=>{
                    if(res.status.code == 0){
                        this.details = res.data;
                        this.$refs.content.innerHTML = this.details.content
                        if(this.details.pushType == 2){
                            let reg = new RegExp( ',' , "g" )
                            this.details.pushValue = this.details.pushValue.replace( reg , '>' );
                        }
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

            goedit(){
                this.$router.push({path: '/diseaseScheme/diseaseSchemeEdit', query:{"id": this.id}})
            }
        },
        mounted(){
            this.$store.commit('getRole','updateDiseaseScheme')
            this.id = this.$route.query.id;
            this.Details(this.id)
        }
    }
</script>