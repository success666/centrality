<template>
    <div class="problemBaseLook">
        <div class="clearfix">
            <p class="header fr">
                <el-button :disabled="$store.state.updateProblemLibrary" @click="goedit" style="background:#83BDF9;color:#fff;">编辑</el-button>
            </p>
        </div>
        <div class="content">
            <p class="lh40">
                <el-col :span="8">
                    <span>标题：{{details.title?details.title:'---'}}</span>
                </el-col>
                <span>类型：{{details.problemType}}</span>
            </p>
            <p class="lh40">
                <el-col :span="8">
                    <span>创建时间：{{details.createTime?details.createTime:'---'}}</span>
                </el-col>
                <span>更新时间：{{details.updateTime?details.updateTime:'---'}}</span>
            </p>
          
            <div class="article">
                <h2 class="lh40 font20">正文内容</h2>
                <div ref="content" style="padding-bottom:60px;"></div>
            </div>
        </div>
    </div>
</template>

<style src="./problemBaseLook.scss" lang="scss">

</style>


<script>
    import http from '@/utils/HttpClient'
    export default {
        data(){
            return {
                id:'',
                details:[],
            }
        },
        methods:{
            // 问题库详情   
            problemBaseDetails(id){
                const loading = this.$loading({
                    lock: true,
                    text: 'Loading',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)'
                });
                http.get('/api/auth/v1/problemLibrary/'+id).then(res=>{
                    if(res.status.code == 0){
                        this.details = res.data;
                        // 文章类型
                        if(this.details.problemType == null){
                            this.details.problemType = '未知类型'
                        }else if(this.details.problemType == 0){
                            this.details.problemType = '营养指导'
                        }else if(this.details.problemType == 1){
                            this.details.problemType = '运动指导'
                        }else if(this.details.problemType == 2){
                            this.details.problemType = '疾病防控'
                        }
                       
                        this.$refs.content.innerHTML = this.details.content
                        loading.close();
                    }else{
                        loading.close();
                        this.$store.commit('responseStatus',{'self':this,'data':res.status});
                    }
                }).catch(error=>{
                    loading.close();
                    this.$store.commit('error',{'self':this,'data':error});
                })
            },
        
            goedit(){
                this.$router.push({path: '/problemBase/problemBaseEdit', query:{"id": this.id}})
            }
        },
        mounted(){
            this.$store.commit('getRole','updateProblemLibrary')
            this.id = this.$route.query.id;
            this.problemBaseDetails(this.id)
        }
    }
</script>