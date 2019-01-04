<template>
    <div class="diseaseScheme">
        <!-- search -->
        <div v-if="!$store.state.listDiseaseScheme" class="search">
            <span>
                标题:
                <el-input placeholder="请输入标题" v-model="searchTitle" clearable style="width:200px;"></el-input> 
            </span>
            <span>
                推送范围:
                <el-input placeholder="请输入推送范围" v-model="searchValue" clearable style="width:250px;"></el-input> 
            </span>
            <span>
                状态:
                <el-select v-model="statusvalue" placeholder="请选择状态">
                    <el-option
                    v-for="items in this.$store.state.status"
                    :key="items.value"
                    :label="items.label"
                    :value="items.value">
                    </el-option>
                </el-select>
            </span>
            <el-button :disabled="$store.state.listDiseaseScheme" style="background:#83BDF9;color:#fff;margin-left:4px;" @click="getTableData">查询</el-button>
            <el-button :disabled="$store.state.addDiseaseScheme" @click="toEditDiseaseScheme" style="background:#83BDF9;color:#fff;margin-left:4px;">新增</el-button>
        </div>

        <!-- table -->
        <el-table v-if="!$store.state.listDiseaseScheme" :data="tabledata.list" class="border-radius ac" v-loading="loading">
            <el-table-column label="标题">
                <template slot-scope="scope">
                    <span>{{ scope.row.title?scope.row.title:'---' }}</span>
                </template>
            </el-table-column>

            <el-table-column label="推送范围">
                <template slot-scope="scope">
                    <span>{{ scope.row.pushValue?scope.row.pushValue:'---' }}</span>
                </template>
            </el-table-column>

            <el-table-column label="更新时间">
                <template slot-scope="scope">
                    <span>{{ scope.row.updateTime? scope.row.updateTime : '--' }}</span>
                </template>
            </el-table-column>

            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button :disabled="$store.state.changeDiseaseSchemeOpenFlag" size="mini" style="background:#83BDF9;color:#fff;" @click="showStatus(scope.$index, scope.row)">{{scope.row.openFlag == 0? '未公开' : '已公开'}}</el-button>
                    <el-button :disabled="$store.state.getDiseaseScheme" size="mini" style="background:#83BDF9;color:#fff;" @click="look(scope.$index,scope.row)">查看</el-button>
                    <el-button :disabled="$store.state.deleteDiseaseScheme" size="mini" style="background:#83BDF9;color:#fff;" type="" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- page -->
        <div v-if="!$store.state.listDiseaseScheme" class="block fr page">
            <common-page 
                :pageNum="pageNum"
                :pageSize="pageSize"
                :total="total"
                @current="getCurrent"
            >
            </common-page>
        </div>
        <div v-if="$store.state.listDiseaseScheme" class="ac">没有此权限</div>
    </div>
</template>

<style src="./diseaseScheme.scss" lang="scss">

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
              
                // 当前页
                pageNum:1,
                // 每页数量
                pageSize:10,
                total:0,

                // 标题
                searchTitle:'',
                // 状态
                statusvalue:'',
                searchValue:'',
               
                // table     
                tabledata:[]
                
            }
        },
        methods:{
            toEditDiseaseScheme(){
                this.$router.push({path: '/diseaseScheme/diseaseSchemeEdit'})
            },
            look(index,row){
                this.$router.push({path: '/diseaseScheme/diseaseSchemeLook', query:{"id": row.id}})
            },
       
            abnormal(data){
                this.$store.commit('responseStatus',{'self':this,'data':data})
            },
            error(data){
                this.$store.commit('error',{'self':this,'data':data})
            },

            // 删除    
            handleDelete(index, row) {
                this.$confirm('删除后方案将无法恢复, 是否继续?', '提示', {
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
                    http.delete(`/api/auth/v1/diseaseScheme/${row.id}`).then(res=>{
                        if(res.body.status.code == 0){
                            this.getTableData();
                            loading.close();
                            this.$message.success('删除成功');
                        }else{
                            loading.close();
                            this.abnormal(res.body.status);
                        }
                    }).catch(error=>{
                        loading.close();
                        this.error(error);
                    })
                }).catch(() => {
                    this.$message.info('已取消删除');          
                });                
            },

            // 是不公开          
            showStatus(index,row){
                let show = row.openFlag
                if(show == 1){
                    show = 0
                    this.$confirm('确认后，APP用户将无法查看或查找本内容，之后可重新公开','提示',{
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
                        http.post('/api/auth/v1/diseaseScheme/changeOpenFlag',{"openFlag":show,"id":row.id}).then(res=>{
                            if(res.status.code == 0){
                                this.getTableData();
                                loading.close();
                                this.$message.success('以设置为未公开状态!');
                                
                            }else{
                                loading.close();
                                this.abnormal(res.status);
                            }
                        }).catch(error=>{
                            loading.close();
                            this.error(error);
                        })
                    }).catch(() => {
                        this.$message.info('已取消设置');          
                    });        
                }else if(show == 0){
                    show = 1;
                    this.$confirm('确认后,该方案将推送至APP','提示',{
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
                        http.post('/api/auth/v1/diseaseScheme/changeOpenFlag',{"openFlag":show,"id":row.id}).then(res=>{
                            if(res.status.code == 0){
                                this.getTableData();
                                loading.close();
                                this.$message.success('以设置为已公开状态!');
                            }else{
                                loading.close();
                                this.abnormal(res.status);
                            }
                        }).catch(error=>{
                            loading.close();
                            this.error(error)
                        })
                    }).catch(() => {
                        this.$message.info('已取消设置');          
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
                    openFlag:this.statusvalue,
                    pushValue:this.searchValue,
                    pageNum:this.pageNum,
                    pageSize:this.pageSize
                }
                http.get('/api/auth/v1/diseaseScheme',params).then(res=>{
                    if(res.status.code == '0'){
                        this.tabledata = res.data;
                        this.total = res.data.total;
                        this.loading = false;
                    }else{
                        this.loading = false;
                        this.abnormal(res.status);
                    }
                }).catch(error => {
                    this.error(error);
                    this.loading = false;
                });
            },
        },
        mounted(){
            this.$store.commit('getRole','listDiseaseScheme,addDiseaseScheme,changeDiseaseSchemeOpenFlag,deleteDiseaseScheme,getDiseaseScheme')
            this.getTableData();
        }
    }
</script>