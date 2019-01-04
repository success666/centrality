<template>

    <div ref="history" class="appUser">
        <!-- search -->
        <div v-if="!$store.state.listAppAccount" class="search">
            <ul class="clearfix titleul">
                <li class="f">
                    <span>
                        手机号:
                        <el-input placeholder="请输入手机号" v-model.trim="number" clearable style="width:200px;"></el-input> 
                    </span>
                    <span>{{$store.state.vuexdata}}</span>
                </li>
                <li class="fl">
                    <span>
                        用户身份:
                        <el-select v-model="userStatus" placeholder="请选择用户身份" style="width:100px;">
                            <el-option
                            v-for="item in this.$store.state.identity"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                            </el-option>
                        </el-select>
                    </span>
                </li>
                <li class="fl">
                    <span>
                        学校:
                        <el-input placeholder="请输入学校" v-model.trim="school" clearable style="width:200px;"></el-input>
                    </span>
                </li>
                <li class="fl">
                    <span>
                        班级:
                        <el-input placeholder="请输入班级" v-model.trim="classValue" clearable style="width:160px;"></el-input>
                    </span>
                </li>
                <li class="fl">
                    <common-eare @currentEare="getEare"></common-eare>
                </li>
                <li class="fl">
                    <span>
                        学生身份信息:
                        <el-input placeholder="请输入学生身份信息" v-model.trim="student" clearable style="width:190px;"></el-input> 
                    </span>
                </li>
                <li class="fl">
                    <span>
                        学生姓名:
                        <el-input placeholder="请输入学生姓名" v-model.trim="studentName" clearable style="width:150px;"></el-input>
                    </span>
                </li>
                <li class="fl">
                    <el-button ref="searchData" @click="getTableData" style="background:#83BDF9;color:#fff;">查询</el-button>
                </li>
                <li class="fl">
                    <el-button :disabled="$store.state.accountMgmtExport" style="background:#83BDF9;color:#fff;" @click="down">导出Excel</el-button>
                </li>
            </ul>               
        </div>


        <!-- table -->
        <el-table v-if="!$store.state.listAppAccount" :data="tabledata.list" class="border-radius ac" v-loading="loading">
          
            <el-table-column label="绑定时间">
                <template slot-scope="scope">
                    <span>{{ scope.row.createTime | formatDate }}</span>
                </template>
            </el-table-column>

            <el-table-column label="手机号">
                <template slot-scope="scope">
                    <span>{{ scope.row.phoneNo?scope.row.phoneNo:'---' }}</span>
                </template>
            </el-table-column>

            <el-table-column label="用户身份">
                <template slot-scope="scope">
                    <span>{{ scope.row.identityType | identityType }}</span>
                </template>
            </el-table-column>

            <el-table-column label="区">
                <template slot-scope="scope">
                    <span>{{ scope.row.dataName?scope.row.dataName:'---' }}</span>
                </template>
            </el-table-column>

            <el-table-column label="学校">
                <template slot-scope="scope">
                    <span>{{ scope.row.schoolName?scope.row.schoolName:'---' }}</span>
                </template>
            </el-table-column>

            <el-table-column label="班级">
                <template slot-scope="scope">
                    <span>{{ scope.row.classTitle?scope.row.classTitle:'---' }}</span>
                </template>
            </el-table-column>

            <el-table-column label="学生身份信息">
                <template slot-scope="scope">
                    <span>{{ scope.row.identityNumber?scope.row.identityNumber:'---' }}</span>
                </template>
            </el-table-column>

            <el-table-column label="学生姓名">
                <template slot-scope="scope">
                    <span>{{ scope.row.studentName?scope.row.studentName:'---' }}</span>
                </template>
            </el-table-column>

            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button
                    :disabled="$store.state.deleteRelation"
                    size="mini"
                    style="background:#83BDF9;color:#fff;"
                    @click="unbundle(scope.$index, scope.row)">解绑</el-button>
                </template>
            </el-table-column>

        </el-table>

       <!-- page -->
        <div v-if="!$store.state.listAppAccount" class="block fr page">
            <common-page 
                :pageNum="pageNum"
                :pageSize="pageSize"
                :total="total"
                @current="getCurrent"
            >
            </common-page>
        </div>

        <div v-if="$store.state.listAppAccount" class="ac">没有此权限</div>

    </div>
</template>

<style src="./appUser.scss" lang="scss">
    
</style>

<script>
    import http from '@/utils/HttpClient'
    import Page from '@/common/page/page.vue'
    import Eare from '@/common/optionEare/optionEare.vue' 
    import { formatDate } from '@/common/date/date'
    
    export default {
        components: {
            "common-page": Page,
            "common-eare": Eare,
        },
        data(){
            return {
                // excel
                excelUrl:'',
                // loading
                loading:false,
                number:'',
                userStatus:'',
                eareValue:'',
                eare:[],
                school:'',
                classValue:'',
                student:'',
                studentName:'',

                relation:'',
               
                // table
                tabledata: [],

                // page 
                pageNum:1,
                pageSize:10,
                total:0,

                userId:''
             }
        },
       
        // 过滤器
        filters: {
            formatDate(time) {
                var date = new Date(time);
                return formatDate(date, 'yyyy-MM-dd hh:mm');
            },
            identityType(data){
                if(data == '0'){
                    return '家长'
                }else if(data == '1'){
                    return '学生'
                }
            }
        },
        methods:{
           
             getCurrent(current) {
                if (current.currentPage) {
                    this.pageNum = current.currentPage;
                }
                if (current.currentSize) {
                    this.pageSize = current.currentSize;
                }
                this.getTableData();
            },

            //解绑
            unbundle(index,row){
                // console.log(row)
                 this.$confirm('解绑后,该用户将无法再查看该生信息,但可再进行绑定?', '提示', {
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
                    http.delete(`/api/auth/v1/accountMgmt/${row.accountStuRelId}`).then(res=>{
                        if(res.body.status.code == '0'){
                            loading.close();
                            this.$message.success('解绑成功');
                            let paramsData = {
                                phoneNo:this.number,
                                identityType:this.userStatus,
                                dataCode:this.eareValue,
                                schoolName:this.school,
                                classTitle:this.classValue,
                                identityNumber:this.student,
                                studentName:this.studentName,
                                pageNum:1,
                                pageSize:10
                            }
                            this.getTableData(paramsData);
                            loading.close()
                        }else{
                            this.$store.commit('responseStatus',{'self':this,'data':res.body.status})
                            loading.close()
                        }
                    }).catch(error=>{
                        this.$store.commit('error',{'self':this,'data':error})
                        loading.close()
                    })
                }).catch(() => {
                    this.$message.info('已取消解绑');          
                });               
            },

            // get data
            getTableData(){
                this.loading = true;
                let params = {
                    phoneNo:this.number,
                    identityType:this.userStatus,
                    dataCode:this.eareValue,
                    schoolName:this.school,
                    classTitle:this.classValue,
                    identityNumber:this.student,
                    studentName:this.studentName,
                    pageNum:this.pageNum,
                    pageSize:this.pageSize
                }
                http.get('/api/auth/v1/accountMgmt',params).then(res=>{
                    
                    if(res.status.code == '0'){
                        this.tabledata = res.data
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

            // 导出
            down(){
                let obj = {
                    phoneNo:this.number,
                    identityType:this.userStatus,
                    dataCode:this.eareValue,
                    schoolName:this.school,
                    classTitle:this.classValue,
                    identityNumber:this.student,
                    studentName:this.studentName
                }
                let str = '';
                for(let key in obj){
                    if(obj[key]!=''&&obj[key]!=undefined){
                        str+=key+'='+obj[key]+'&';
                    }
                }
                str = str.slice(0,-1);
                window.open(this.excelUrl + "/api/v1/accountMgmt/export?"+str)
            },

            getEare(current){
                this.eareValue = current.eare;
            }
           
        },
        mounted(){
            this.$store.commit('getRole','listAppAccount,accountMgmtExport,deleteRelation')
            this.getTableData();
            this.userId = JSON.parse(localStorage.getItem("ydl_user")).userId;
            this.excelUrl = process.env.BASE_API

        }
       
    }
</script>