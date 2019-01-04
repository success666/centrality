<template>
    <div class="nutritionSchemeLook">
        <div class="clearfix">
            <p class="header fr">
                <el-button :disabled="$store.state.updateNutritionScheme" @click="goedit" style="background:#83BDF9;color:#fff;">编辑</el-button>
            </p>
        </div>
        <div class="content">
            <p class="lh40">
                <el-col :span="8">
                    <span>标题：{{details.title?details.title:'---'}}</span>
                </el-col>
                <span>更新时间：{{details.updateTime?details.updateTime:'---'}}</span>
            </p>
            <div>
                <span>推送范围：</span>
                <span>{{details.pushValue?details.pushValue:'---'}}</span>
            </div>
            <div class="article">
                <h1 class="lh40 font20">方案内容</h1>
                <div ref="content" style="padding-bottom:60px;"></div>
            </div>
        </div>
    </div>
</template>

<style src="./nutritionSchemeLook.scss" scoped lang="scss"></style>
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
            // 文章详情
            articleDetails(id){
                const loading = this.$loading({
                    lock: true,
                    text: 'Loading',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)'
                });
                http.get('/api/auth/v1/nutritionScheme/'+id).then(res=>{
                    if(res.status.code == '0'){
                        this.details = res.data;
                        this.$refs.content.innerHTML = this.details.content
                        if(this.details.pushType == 2){

                            let reg = new RegExp( ',' , "g" )
                            this.details.pushValue = this.details.pushValue.replace( reg , '>' );
                        }
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
                this.$router.push({path: '/nutritionScheme/nutritionSchemeEdit', query:{"id": this.id}})
            }
        },
        mounted(){
            this.$store.commit('getRole','updateNutritionScheme')
            this.id = this.$route.query.id;
            this.articleDetails(this.id)
        }
    }
</script>