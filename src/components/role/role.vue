<template>
    <div>
        <div class="role">
            <p class="clearfix">
                <el-button :disabled="$store.state.addRole" @click="toRoleEdit" type="" style="background:#83BDF9;color:#fff;margin-left:14px;" class="fr">新增</el-button>
            </p>
            <el-table v-if="!$store.state.listRole" :data="tableData.list" style="width: 100%;text-align:center;" class="border-radius" v-loading="loading">
                <el-table-column label="角色" >
                    <template slot-scope="scope">
                        <span>{{ scope.row.name == ''? '--':scope.row.name }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button size="mini" type="" style="background:#83BDF9;color:#fff;" @click="handleEdit(scope.$index, scope.row)" :disabled="$store.state.updateRole">编辑</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <!-- page -->
            <div class="block fr" style="padding:14px 26px;" v-if="!$store.state.listRole">
                <common-page 
                    :pageNum="pageNum"
                    :pageSize="pageSize"
                    :total="total"
                    @current="getCurrent"
                >
                </common-page>
            </div>

        </div>
        <p v-if="$store.state.listRole" style="text-align:center;">
            没有此权限
        </p>
    </div>
</template>
<style src="./role.scss" lang="scss">

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
                tableData:[],
                id:'',
                name:'',
               
                // 当前页
                pageNum:1,
                // 每页数量
                pageSize:10,
                total:0
            }
        },
        methods:{
            toRoleEdit(){
                this.$router.push({path: '/role/roleEdit'})
            },
            handleEdit(index, row) {
                this.id = row.id;
                this.name = row.name;
                this.$router.push({path: '/role/roleEdit', query:{id: this.id,name:this.name}})
            },

            getCurrent(current) {
                if (current.currentPage) {
                    this.pageNum = current.currentPage;
                }
                if (current.currentSize) {
                    this.pageSize = current.currentSize;
                }
                this.getRoleList();
            },

            getRoleList(){
                this.loading = true;
                let params = {
                    pageNum:this.pageNum,
                    pageSize:this.pageSize
                }
                http.get('/api/auth/v1/role',params).then(res=>{
                    if(res.status.code == 0){
                        this.tableData = res.data;
                        this.total = res.data.total;
                        this.loading = false;
                    }else{
                        this.loading = false;
                        this.$store.commit('responseStatus',{'self':this,'data':res.status});
                    }
                }).catch(error=>{
                    this.loading = false;
                    this.$store.commit('error',{'self':this,'data':error});
                })
           },
        },
        mounted(){
            this.$store.commit('getRole','listRole,addRole,updateRole')
            this.getRoleList();
        }
    }
</script>