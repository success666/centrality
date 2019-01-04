<template>

    <div ref="history" class="history">
        <!-- search -->
        <div v-if="!$store.state.listAppLoginLog" class="search">
            <ul class="clearfix titleul">
                <li>
                    在线日期:
                    <el-date-picker
                        style="width:140px;"
                        v-model="valueData"
                        type="date"
                        value-format="yyyy-MM-dd"
                        placeholder="选择日期">
                    </el-date-picker>
                </li>
                <li>
                    手机号:
                    <el-input placeholder="请输入手机号" v-model.trim="number" clearable style="width:140px;"></el-input> 
                </li>
                <li>
                    用户身份:
                    <el-select v-model="userStatus" placeholder="请选择用户身份" style="width:90px;">
                        <el-option
                            v-for="item in this.$store.state.identity"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </li>
                <li>
                    学校:
                    <el-input placeholder="请输入学校" v-model.trim="schoolName" clearable style="width:150px;"></el-input>
                </li>
                <li>
                    <common-eare @currentEare="getEare"></common-eare>
                </li>
                <li>
                    班级:
                    <el-input placeholder="请输入班级" v-model.trim="className" clearable style="width:140px;"></el-input>
                </li>
                <li>
                    学生身份信息:
                    <el-input placeholder="请输入学生身份信息" v-model.trim="identityNumber" clearable style="width:180px;"></el-input> 
                </li>
                <li>
                    学生姓名:
                    <el-input placeholder="请输入学生姓名" v-model.trim="studentName" clearable style="width:150px;"></el-input>
                </li>
                <li>
                    <el-button :disabled="$store.state.listAppLoginLog" type="" @click="getTableData" style="margin-left:4px;background:#83BDF9;color:#fff;">查询</el-button>
                </li>
                <li>
                    <el-button :disabled="$store.state.appLoginLogExport" type="" style="margin-left:4px;background:#83BDF9;color:#fff;" @click="down">导出Excel</el-button>
                </li>
            </ul>               
        </div>


        <!-- table -->
        <el-table v-if="!$store.state.listAppLoginLog" :data="tabledata.list" style="width:100%;text-align:center;" class="border-radius" v-loading="loading">

            <el-table-column label="在线日期">
                <template slot-scope="scope">
                    <span>{{ scope.row.createTime?scope.row.createTime.slice(0,10):'---' }}</span>
                </template>
            </el-table-column>

            <el-table-column label="手机号">
                <template slot-scope="scope">
                    <span>{{ scope.row.phoneNo?scope.row.phoneNo:'---' }}</span>
                </template>
            </el-table-column>

            <el-table-column label="用户身份">
                <template slot-scope="scope">
                    <span>{{ scope.row.identityType == '0'?'家长':'学生' }}</span>
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
          
        </el-table>

       <!-- page -->
        <div v-if="!$store.state.listAppLoginLog" class="block fr" style="padding:14px 26px;">
            <common-page 
                :pageNum="pageNum"
                :pageSize="pageSize"
                :total="total"
                @current="getCurrent"
            >
            </common-page>
        </div>

        <div v-if="$store.state.listAppLoginLog" style="text-align:center">没有此权限</div>

    </div>
</template>
<style src="./onlineStatistics.scss">
        
</style>

<script>
    import http from '@/utils/HttpClient'
    import Page from '@/common/page/page.vue'
    import Eare from '@/common/optionEare/optionEare.vue' 
    export default {
        components: {
            "common-page": Page,
            "common-eare": Eare
        },
         data(){
            return {
                // excelUrl
                excelUrl:'',
                // loading
                loading:false,
                valueData: '',
                number:'',
                userStatus:'',
                eareValue:'',
                schoolName:'',
                className:'',
                identityNumber:'',
                studentName:'',

                tabledata: [],

                pageNum:1,
                pageSize:10,
                total:0
                
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
            getTableData(){
                this.loading = true;
                let params = {
                    phoneNo:this.number,
                    studentName:this.studentName,
                    identityNumber:this.identityNumber,
                    schoolName:this.schoolName,
                    classTitle:this.className,
                    createTime:this.valueData,
                    identityType:this.userStatus,
                    dataCode:this.eareValue,
                    pageNum:this.pageNum,
                    pageSize:this.pageSize
                }
                http.get('/api/auth/v1/appLoginLog',params).then(res=>{
                    if(res.status.code === 0){
                        this.tabledata = res.data
                        this.total = res.data.total;
                        this.loading = false;
                    }else{
                        this.loading = false;
                        this.$store.commit('responseStatus',{'self':this,'data':res.status});
                    }
                }).catch(error => {
                    this.loading = false;
                    this.$store.commit('error',{'self':this,'data':error});
                });
            },
            down(){
                let obj = {
                    phoneNo:this.number,
                    studentName:this.studentName,
                    identityNumber:this.identityNumber,
                    schoolName:this.schoolName,
                    classTitle:this.className,
                    createTime:this.valueData,
                    identityType:'',
                    dataCode:this.eareValue
                }
                let str = '';
                for(let key in obj){
                    if(obj[key]!=''&&obj[key]!=undefined){
                        str+=key+'='+obj[key]+'&';
                    }
                }
                str = str.slice(0,-1);
                window.open(this.excelUrl + "/api/v1/appLoginLog/export?"+str)
            },
            getEare(current){
                this.eareValue = current.eare;
            }
        },
        mounted(){
            this.$store.commit('getRole','listAppLoginLog,appLoginLogExport')
            this.getTableData();
            this.excelUrl = process.env.BASE_API
        }
    }
</script>