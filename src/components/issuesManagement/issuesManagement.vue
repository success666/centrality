<template>
    <div class="issuesManagement">
        <!-- search -->
        <div v-if="!$store.state.listAskQuestion" class="search">
            <span>
                提问:
                <el-input placeholder="请输入提问人" v-model="searchTitle" clearable style="width:200px;"></el-input> 
            </span>
            <span>
                类型:
                <el-select v-model="type" placeholder="请选择类型">
                    <el-option
                    v-for="item in articletype"
                    :key="item.code"
                    :label="item.name"
                    :value="item.code">
                    </el-option>
                </el-select>
            </span>
            <span>
                状态:
                <el-select v-model="statusvalue" placeholder="请选择状态">
                    <el-option
                    v-for="items in this.$store.state.reviewStatus"
                    :key="items.value"
                    :label="items.label"
                    :value="items.value">
                    </el-option>
                </el-select>
            </span>
            <el-button type="" style="background:#83BDF9;color:#fff;maring-left:4px;" @click="getTableData">查询</el-button>
        </div>

        <!-- table -->
        <el-table v-if="!$store.state.listAskQuestion" :data="tabledata.list" style="width: 100%;text-align:center;" class="border-radius" v-loading="loading">
            
            <el-table-column label="最新提问时间">
                <template slot-scope="scope">
                    <span>{{ scope.row.updateTime?scope.row.updateTime:'---' }}</span>
                </template>
            </el-table-column>

            <el-table-column label="类型">
                <template slot-scope="scope">
                    <span>{{ scope.row.questionType?scope.row.questionType:'---' }}</span>
                </template>
            </el-table-column>

            <el-table-column label="提问人">
                <template slot-scope="scope">
                    <span>{{ scope.row.askName?scope.row.askName:'---' }}</span>
                </template>
            </el-table-column>

            <el-table-column label="提问">
                <template slot-scope="scope">
                    <span>{{ scope.row.content?scope.row.content:'---' }}</span>
                </template>
            </el-table-column>

            <el-table-column label="状态">
                <template slot-scope="scope">
                    <span>{{ scope.row.replyStatus==0?'未回复':'已回复' }}</span>
                </template>
            </el-table-column>

            <el-table-column label="最新回复时间">
                <template slot-scope="scope">
                    <span>{{ scope.row.replyTime? scope.row.replyTime : '---' }}</span>
                </template>
            </el-table-column>

            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button :disabled="$store.state.getQuestionReplyList" size="mini" style="background:#83BDF9;color:#fff;" @click="look(scope.$index,scope.row)">查看</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- page -->
        <div v-if="!$store.state.listAskQuestion" class="block fr" style="padding:14px 26px;">
            <common-page 
                :pageNum="pageNum"
                :pageSize="pageSize"
                :total="total"
                @current="getCurrent"
            >
            </common-page>
        </div>

        <div v-if="$store.state.listAskQuestion" style="text-align:center;">没有此权限</div>
    </div>
</template>

<style src="./issuesManagement.scss" lang="scss">

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
                articletype:[],
                
               
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
            look(index,row){
                // console.log(row);
                this.$router.push({path: '/issuesManagement/issuesManagementLook', query:{"id": row.id}})
            },
       
            // questionType 
            forOfType(array){
                for(let key of array){
                    if(key.questionType == 0){
                        key.questionType = '营养指导';
                    }else if(key.questionType == 1){
                        key.questionType = '运动指导';
                    }else if(key.questionType == 2){
                        key.questionType = '疾病防控';
                    }else if(key.questionType == 3){
                        key.questionType = 'APP问题反馈';
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
                    askName:this.searchTitle,
                    questionType:this.type,
                    replyStatus:this.statusvalue,
                    pageNum:this.pageNum,
                    pageSize:this.pageSize
                }
                http.get('/api/auth/v1/askQuestion',params).then(res=>{
                    if(res.status.code == '0'){
                        this.tabledata = res.data
                        this.total = res.data.total
                        this.forOfType(this.tabledata.list)
                        this.loading = false;
                    }else{
                        this.loading = false;
                        this.$store.commit('responseStatus',{'self':this,'data':res.status});
                    }
                }).catch(error => {
                    this.loading = false;
                    this.$store.commit('error',{'self':this,'data':error})
                });
                
            },

            getType(){
                http.get('/api/auth/v1/common//getAskQuestionType').then(res=>{
                    if(res.status.code === 0){
                        let objType = {
                            name:'全部',
                            code:'',
                        }
                        this.articletype = res.data;
                        this.articletype.unshift(objType);
                    }else{
                        this.$store.commit('responseStatus',{'self':this,'data':res.status});
                    }
                }).catch(error => {
                    this.loading = false;
                    this.$store.commit('error',{'self':this,'data':error})
                });
            }

        },
        mounted(){
            this.$store.commit('getRole','listAskQuestion,getQuestionReplyList,nutritionReply,sportReply,diseaseReply,questionReply')
            this.getType();
            this.getTableData();
        }
          
    }
</script>