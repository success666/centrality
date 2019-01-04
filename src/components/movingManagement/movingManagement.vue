<template>
    <div class="rootelementa">
        <!-- search -->
        <div v-if="!$store.state.lietSportPoint" class="search clearfix">
            <p class="fl" style="padding:10px 6px 2px 0px;">
                标题:
                <el-input placeholder="请输入标题" v-model="searchTitle" clearable style="width:200px;"></el-input> 
            </p>
            <p class="fl" style="padding:10px 6px 2px 0px;">
                年级:
                <el-select v-model="gradeType" placeholder="请选择年级" style="width:120px;">
                    <el-option
                    v-for="item in grade"
                    :key="item.code"
                    :label="item.name"
                    :value="item.code">
                    </el-option>
                </el-select>
            </p>
            <p class="fl" style="padding:10px 6px 2px 0px;">
                性别:
                <el-select v-model="sexType" placeholder="请选择性别" style="width:80px;">
                    <el-option
                    v-for="items in this.$store.state.sexStatus"
                    :key="items.value"
                    :label="items.label"
                    :value="items.value">
                    </el-option>
                </el-select>
            </p>  
            <p class="fl" style="padding:10px 6px 2px 0px;">
                强度:
                <el-select v-model="strengthType" placeholder="请选择强度" style="width:80px;">
                    <el-option
                    v-for="items in this.$store.state.strengthStatus"
                    :key="items.value"
                    :label="items.label"
                    :value="items.value">
                    </el-option>
                </el-select>
            </p>
            <p class="fl" style="padding:10px 6px 2px 0px;">
                状态:
                <el-select v-model="statusType" placeholder="请选择状态" style="width:100px;">
                    <el-option
                    v-for="items in this.$store.state.status"
                    :key="items.value"
                    :label="items.label"
                    :value="items.value">
                    </el-option>
                </el-select>
            </p>
            <p class="fl" style="padding:10px 6px 2px 0px;">
                <el-button :disabled="$store.state.lietSportPoint" type="" @click="getTableData" style="background:#83BDF9;color:#fff;">查询</el-button>
            </p>
            <p class="fl" style="padding:10px 6px 2px 0px;">
                <el-button :disabled="$store.state.addSportPoint" @click="goedit" style="background:#83BDF9;color:#fff;">新增</el-button>
            </p>
        </div>

        <!-- table -->
        <el-table v-if="!$store.state.lietSportPoint" :data="tabledata.list" style="width: 100%;text-align:center;" class="border-radius" v-loading="loading">
            <el-table-column label="标题">
                <template slot-scope="scope">
                    <span>{{ scope.row.title?scope.row.title:'---' }}</span>
                </template>
            </el-table-column>

            <el-table-column label="年级">
                <template slot-scope="scope">
                    <span style="word-break:keep-all">{{ scope.row.pushClassName?scope.row.pushClassName:'---' }}</span>
                </template>
            </el-table-column>

            <el-table-column label="性别">
                <template slot-scope="scope">
                    <span>{{ scope.row.sex?scope.row.sex:'---' }}</span>
                </template>
            </el-table-column>

            <el-table-column label="强度">
                <template slot-scope="scope">
                    <span>{{ scope.row.exerciseIntensity?scope.row.exerciseIntensity:'---' }}</span>
                </template>
            </el-table-column>

            <el-table-column label="更新时间">
                <template slot-scope="scope">
                    <span>{{ scope.row.updateTime? scope.row.updateTime.slice(0,10) : '--' }}</span>
                </template>
            </el-table-column>

            <el-table-column label="操作" width="250">
                <template slot-scope="scope">
                    <el-button size="mini" @click="showStatus(scope.$index, scope.row)" style="background:#83BDF9;color:#fff;">{{scope.row.openFlag == '0'?'未公开':'已公开'}}</el-button>
                    <el-button :disabled="$store.state.getSportPoint" size="mini" @click="look(scope.$index,scope.row)" style="background:#83BDF9;color:#fff;">查看</el-button>
                    <el-button :disabled="$store.state.deleteSportPoint" size="mini" type="" @click="handleDelete(scope.$index, scope.row)" style="background:#83BDF9;color:#fff;">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- page -->
        <div v-if="!$store.state.lietSportPoint" class="block fr" style="padding:14px 26px;">
            <common-page 
                :pageNum="pageNum"
                :pageSize="pageSize"
                :total="total"
                @current="getCurrent"
            >
            </common-page>
        </div>

        <div v-if="$store.state.lietSportPoint" style="text-align:center">没有此权限</div>    
    </div>
</template>

<style src="./movingManagement.scss">

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
                grade:[],
               
               
               
                pageNum:1,
                pageSize:10,
                total:0,
                // search
                searchTitle:'',
                statusType:'',
                sexType:'',
                gradeType:'',
                strengthType:'',

                // table     
                tabledata:[]
                
            }
        },
        methods:{
            look(index,row){
                this.$router.push({path: '/movingManagement/movingManagementLook', query:{"id": row.id}})
            },
            goedit(){
                this.$router.push({path: '/movingManagement/movingManagementEdit'});
            },
            abnormal(data){
                this.$store.commit('responseStatus',{'self':this,'data':data})
            },
            error(data){
                this.$store.commit('error',{'self':this,'data':data})
            },
            forType(data){
                for(let key of data){
                    if(key.exerciseIntensity == '0'){
                        key.exerciseIntensity = '低'
                    }else if(key.exerciseIntensity == '1'){
                        key.exerciseIntensity = '中'
                    }else if(key.exerciseIntensity == '2'){
                        key.exerciseIntensity = '高'
                    }

                    if(key.sex == '0'){
                        key.sex = '男'
                    }else if(key.sex == '1'){
                        key.sex = '女'
                    }else if(key.sex == '0,1' || key.sex == '1,0'){
                        key.sex = '男,女'
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
                this.$confirm('删除后,将影响到已推送的用户 是否继续?', '提示', {
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
                    http.delete(`/api/auth/v1/sportPoint/${row.id}`).then(res=>{
                        if(res.body.status.code == '0'){
                            this.getTableData();
                            loading.close();
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                        }else{
                            loading.close();
                            this.abnormal(res.status);
                        }
                    }).catch(error=>{
                        loading.close();
                        this.error(error);
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
                    this.$confirm('确认后APP用户将无法查看或查找本内容,之后可重新公开','提示',{
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
                        http.post('/api/auth/v1/sportPoint/changeOpenFlag',{"openFlag":show,"id":row.id}).then(res=>{
                            // console.log(res);
                            if(res.status.code == '0'){
                                this.getTableData();
                                loading.close();
                                this.$message({
                                    type: 'success',
                                    message: '以设置为未公开状态'
                                });
                            }else{
                                loading.close();
                                this.abnormal(res.status);
                            }
                        }).catch(error=>{
                            loading.close();
                            this.error(error);
                        })
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消设置'
                        });          
                    });        
                }else if(show == 0){
                    show = 1;
                    this.$confirm('确认后,该内容将公开','提示',{
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
                        http.post('/api/auth/v1/sportPoint/changeOpenFlag',{"openFlag":show,"id":row.id}).then(res=>{
                            if(res.status.code == '0'){
                                this.getTableData();
                                loading.close();
                                this.$message({
                                    type: 'success',
                                    message: '以设置为已公开状态!'
                                });
                            }else{
                                loading.close();
                                this.abnormal(res.status);
                            }
                        }).catch(error=>{
                            loading.close();
                            this.error(error);
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
                    title:this.searchTitle?this.searchTitle:'',
                    pushClass:this.gradeType?this.gradeType:'',
                    openFlag:this.statusType?this.statusType:'',
                    sex:this.sexType?this.sexType:'',
                    exerciseIntensity:this.strengthType?this.strengthType:'',
                    pageNum:this.pageNum,
                    pageSize:this.pageSize
                }
                http.get('/api/auth/v1/sportPoint',params).then(res=>{
                    if(res.status.code == '0'){
                        this.tabledata = res.data;
                        this.total = res.data.total;
                        this.forType(this.tabledata.list)
                        this.loading = false;
                    }else{
                        this.loading = false;
                        this.abnormal(res.status);
                    }
                }).catch(error => {
                    this.loading = false;
                    this.error(error);
                });
            },
            // 年级类型
            getClass(){
                http.get('/api/auth/v1/common/getPushClass').then(res=>{
                    if(res.status.code == '0'){
                        this.grade = res.data;
                        let obj = {
                            id:'',
                            name:'全部',
                            code:''
                        }
                        this.grade.unshift(obj);
                    }else{
                        this.abnormal(res.status);
                    }
                }).catch(error=>{
                   this.error(error);
                })
            },
            
        },
        mounted(){
            this.$store.commit('getRole','lietSportPoint,addSportPoint,getSportPoint,deleteSportPoint')
            this.getTableData();
            this.getClass();
        }
    }
</script>