<template>
    <div class="article">
        <!-- search -->
        <div v-if="!$store.state.listArticle" class="border-radius">
            标题:
            <el-input placeholder="请输入标题" v-model="searchTitle" clearable style="width:200px;"></el-input> 
            类型:
            <el-select v-model="type" placeholder="请选择类型">
                <el-option
                v-for="item in this.$store.state.articletype"
                :key="item.value"
                :label="item.label"
                :value="item.value">
                </el-option>
            </el-select>
            状态:
            <el-select v-model="statusvalue" placeholder="请选择状态">
                <el-option
                v-for="items in this.$store.state.status"
                :key="items.value"
                :label="items.label"
                :value="items.value">
                </el-option>
            </el-select>
            <el-button @click="getTableData" style="background:#83BDF9;color:#fff;margin-left:4px;">查询</el-button>
            <el-button :disabled="$store.state.addArticle" @click="toAddArticle" style="background:#83BDF9;color:#fff;margin-left:4px;">新增</el-button>
        </div><br/>

        <!-- table -->
        <el-table v-if="!$store.state.listArticle" :data="tabledata.list" class="border-radius ac" v-loading="loading">
            <el-table-column label="标题">
                <template slot-scope="scope">
                    <span>{{ scope.row.title?scope.row.title:'---' }}</span>
                </template>
            </el-table-column>

            <el-table-column label="类型">
                <template slot-scope="scope">
                    <span>{{ scope.row.articleType?scope.row.articleType:'---' }}</span>
                </template>
            </el-table-column>

            <el-table-column label="赞">
                <template slot-scope="scope">
                    <span>{{ scope.row.likeCount?scope.row.likeCount:'---' }}</span>
                </template>
            </el-table-column>

            <el-table-column label="收藏">
                <template slot-scope="scope">
                    <span>{{ scope.row.collectCount?scope.row.collectCount:'---' }}</span>
                </template>
            </el-table-column>

            <el-table-column label="评论">
                <template slot-scope="scope">
                    <span>{{ scope.row.commentProportion? scope.row.commentProportion : '---'}}</span>
                </template>
            </el-table-column>

            <el-table-column label="更新时间">
                <template slot-scope="scope">
                    <span>{{ scope.row.updateTime? scope.row.updateTime.slice(0,10) : '---' }}</span>
                </template>
            </el-table-column>

            <el-table-column label="操作"  width="320">
                <template slot-scope="scope">
                    <el-button :disabled="$store.state.changeArticleOpenFlag" size="mini" @click="showStatus(scope.$index, scope.row)" style="background:#83BDF9;color:#fff;">{{scope.row.openFlag == 0? '未公开' : '已公开'}}</el-button>
                    <el-button :disabled="$store.state.getArticle" size="mini" @click="look(scope.$index,scope.row)" style="background:#83BDF9;color:#fff;">查看</el-button>
                    <el-button :disabled="$store.state.updateArticle" size="mini" @click="edit(scope.$index,scope.row)" style="background:#83BDF9;color:#fff;">编辑</el-button>
                    <el-button :disabled="$store.state.deleteArticle" size="mini" @click="handleDelete(scope.$index, scope.row)" style="background:#83BDF9;color:#fff;">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- page -->
        <div v-if="!$store.state.listArticle" class="block fr page">
            <common-page 
                :pageNum="pageNum"
                :pageSize="pageSize"
                :total="total"
                @current="getCurrent"
            >
            </common-page>
        </div>

        <div v-if="$store.state.listArticle" class="ac">没有此权限</div>
    </div>
</template>

<style src="./article.scss" lang="scss">

</style>

<script>
    import http from '@/utils/HttpClient'
    import Page from '@/common/page/page.vue'
    export default {
        components: {
            "common-page": Page
        },
        data(){
            return {
                // loading
                loading:false,
                // search 
                
                // 当前页
                pageNum:1,
                // 每页数量
                pageSize:10,
                total:0,

                // 标题
                searchTitle:'',
                // 状态
                statusvalue:'',
                // 类型
                type:'',

                // table   
                tabledata:[]
                
            }
        },
        methods:{
            toAddArticle(){
                this.$router.push({path: '/article/articleEdit'})
            },
            look(index,row){
                // console.log(row);
                this.$router.push({path: '/article/articlelook', query:{"id": row.id}})
            },
            edit(index,row){
                // console.log(row);
                this.$router.push({path: '/article/articleEdit', query:{"id": row.id}})
            },
            // articleType    
            forOfType(array){
                for(let key of array){
                    if(key.articleType == 0){
                        key.articleType = '营养';
                    }else if(key.articleType == 1){
                        key.articleType = '健康';
                    }else if(key.articleType == 2){
                        key.articleType = '运动';
                    }else if(key.articleType == 3){
                        key.articleType = '疾病';
                    }
                }
            },

            // 提示    
            open(test) {
                this.$message.warning(test);
            },
            erroropen(test) {
                this.$message.error(test);
            },


            // 删除    
            handleDelete(index, row) {
                this.$confirm('删除后文章将无法恢复, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    const loading = this.$loading({
                        lock: true,
                        text: 'Loading',
                        spinner: 'el-icon-loading',
                        background: 'rgba(0, 0, 0, 0.7)'
                    });
                    http.delete(`/api/auth/v1/article/${row.id}`).then(res=>{
                        // console.log(res,'删除成功');
                        if(res.body.status.code == 0){
                            this.getTableData();
                            loading.close();
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            });

                        }else{
                            loading.close();
                            this.$store.commit('responseStatus',{'self':this,'data':res.status})
                        }
                    }).catch(error=>{
                        loading.close();
                        this.$store.commit('error',{'self':this,'data':error})
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });          
                });                
            },



            // 是不公开            
            showStatus(index,row){
                // console.log(index,row);
                let show = row.openFlag
                if(show == 1){
                    show = 0
                    this.$confirm('确认后APP用户将无法查看或查找文章,之后可重新公开','提示',{
                        confirmButtonText: '确认',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        const loading = this.$loading({
                            lock: true,
                            text: 'Loading',
                            spinner: 'el-icon-loading',
                            background: 'rgba(0, 0, 0, 0.7)'
                        });
                        http.post('/api/auth/v1/article/changeOpenFlag',{"openFlag":show,"id":row.id}).then(res=>{
                            if(res.status.code == '0'){
                                this.getTableData();
                                loading.close();
                                this.$message({
                                    type: 'success',
                                    message: '以设置为未公开状态!'
                                });
                               
                            }else{
                                loading.close();
                                this.$store.commit('responseStatus',{'self':this,'data':res.status})
                            }
                        }).catch(error=>{
                            loading.close();
                            this.$store.commit('error',{'self':this,'data':error})
                        })
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消设置'
                        });          
                    });        
                }else if(show == '0'){
                    show = 1;
                    this.$confirm('确认后,该文章将推送至APP','提示',{
                        confirmButtonText: '确认',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        const loading = this.$loading({
                            lock: true,
                            text: 'Loading',
                            spinner: 'el-icon-loading',
                            background: 'rgba(0, 0, 0, 0.7)'
                        });
                        http.post('/api/auth/v1/article/changeOpenFlag',{"openFlag":show,"id":row.id}).then(res=>{
                            if(res.status.code == '0'){
                                this.getTableData();
                                loading.close();
                                this.$message({
                                    type: 'success',
                                    message: '以设置为已公开状态!'
                                });
                              
                            }else{
                                loading.close();
                                this.$store.commit('responseStatus',{'self':this,'data':res.status})
                            }
                        }).catch(error=>{
                            loading.close();
                            this.$store.commit('error',{'self':this,'data':error})
                        })
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消设置'
                        });          
                    });        
                }
                
            },

            getCurrent(current) {
                if (current.currentPage) {
                    this.pageNum = current.currentPage;
                }
                if (current.currentSize) {
                    this.pageSize = current.currentSize;
                }

                this.getTableData();
            },

            // table数据          
            getTableData(){
                this.loading = true;
                let params = {
                    title:this.searchTitle,
                    articleType:this.type,
                    openFlag:this.statusvalue,
                    pageNum:this.pageNum,
                    pageSize:this.pageSize
                }
                http.get('/api/auth/v1/article',params).then(data=>{
                    if(data.status.code == '0'){
                        this.tabledata = data.data;
                        this.total = data.data.total;
                        this.forOfType(this.tabledata.list)
                        this.loading = false;
                    }else{
                        this.$store.commit('responseStatus',{'self':this,'data':res.status})
                    }
                }).catch(error => {
                    this.loading = false;
                    this.$store.commit('error',{'self':this,'data':error})
                });
            },

            
        },
        mounted(){
            this.$store.commit('getRole','listArticle,addArticle,changeArticleOpenFlag,getArticle,getArticle,updateArticle,deleteArticle')
            this.getTableData();
        }
          
    }
</script>