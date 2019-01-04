<template>
    <div class="view">
        <div class="articlereview clearfix">
            <p>
                <el-button @click="goback" style="background:#83BDF9;color:#fff;">取消</el-button>
                <el-button :disabled="$store.state.changeArticleCommentShow" @click="toggleSelection" style="background:#83BDF9;color:#fff;">保存</el-button>
            </p>
        </div>

        <!-- table -->
        <el-table
            ref="multipleTable" :data="tabledata.list" tooltip-effect="dark" @selection-change="handleSelectionChange" v-loading="loading">

            <el-table-column type="selection">
            </el-table-column>

            <el-table-column label="用户">
                <template slot-scope="scope">{{ scope.row.name?scope.row.name:'---' }}</template>
            </el-table-column>

            <el-table-column label="评论">
                <template slot-scope="scope">{{ scope.row.content?scope.row.content:'---' }}</template>
            </el-table-column>

            <el-table-column label="评论状态">
                <template slot-scope="scope">{{ scope.row.isShow == 0?'未公开':'已公开' }}</template>
            </el-table-column>

            <el-table-column label="评论时间">
                <template slot-scope="scope">{{ scope.row.createTime?scope.row.createTime:'---' }}</template>
            </el-table-column>
        </el-table>
        
        <!-- page -->
        <div class="block fr page">
            <common-page 
                :pageNum="pageNum"
                :pageSize="pageSize"
                :total="total"
                @current="getCurrent"
            >
            </common-page>
        </div>

    </div>
</template>

<style src="./articlereview.scss" lang="scss">

</style>

<script>
import Page from '@/common/page/page.vue'
import http from '@/utils/HttpClient'
export default {
    components: {
        "common-page": Page
    },
    data() {
        return {
            // loading
            loading:false,
            multipleSelection: [],
            // page  .........................
            tabledata:[],

            articleId:'',
            // 当前页
            pageNum:1,
            // 每页数量
            pageSize:10,
            total:0
               
        }
    },
    methods: {
        goback() {
            this.$router.go(-1)
        },
        // 评论是否公开          
        toggleSelection() {
            const loading = this.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            });
            for(let key of this.multipleSelection){
                // console.log(key);
                if(key.isShow == 1){
                    key.isShow = 0
                }else{
                    key.isShow = 1;
                }
            }
            http.post('/api/auth/v1/article/changeArticleCommentShow',this.multipleSelection).then(res=>{
                if(res.status.code == 0){
                    // this.multipleSelection = [];
                    // this.handleSelectionChange(this.multipleSelection);
                    this.$message({
                        type: 'success',
                        message: '保存成功'
                    });
                    this.getTableData(this.page);
                    // console.log(res);
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
        // 选择
        handleSelectionChange(val) {
            this.multipleSelection = val;
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
            let params = {
                articleId:this.articleId,
                pageNum:this.pageNum,
                pageSize:this.pageSize
            }
            this.loading = true;
            http.get('/api/auth/v1/article/commentList',params).then(res=>{
                if(res.status.code === 0){
                    this.tabledata = res.data
                    // console.log('data',res.data);
                    this.total = res.data.total;
                    this.loading = false;
                }else{
                    this.loading = false;
                    this.$store.commit('responseStatus',{'self':this,'data':res.status})
                }
            }).catch(error => {
                this.loading = false;
                this.$store.commit('error',{'self':this,'data':error})
            });
        },
    },
     mounted(){
        this.$store.commit('getRole','changeArticleCommentShow')
        this.articleId = this.$route.query.id;
        this.getTableData();
    }
};
</script>