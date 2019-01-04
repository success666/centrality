<template>
    <div ref="motionFeedbackStatistics" class="motionFeedbackStatistics">
        <!-- search -->
        <div class="search" v-if="!$store.state.sportExerciseFeedbackList">
            <ul class="clearfix titleul">
                <li>
                    反馈日期:
                    <el-date-picker
                        style="width:140px;"
                        v-model="valueData"
                        type="date"
                        value-format="yyyy-MM-dd"
                        placeholder="选择日期">
                    </el-date-picker>
                </li>
                <li>
                    <common-eare @currentEare="getEare"></common-eare>
                </li>
                <li>
                    学校:
                    <el-input placeholder="请输入学校" v-model.trim="schoolName" clearable style="width:200px;"></el-input>
                </li>
                <li>
                    班级:
                    <el-input placeholder="请输入班级" v-model.trim="classValue" clearable style="width:200px;"></el-input>
                </li>
                <li>
                    学生身份信息:
                    <el-input placeholder="请输入学生身份信息" v-model.trim="studentMessage" clearable style="width:180px;"></el-input> 
                </li>
                <li>
                    学生姓名:
                    <el-input placeholder="请输入学生姓名" v-model.trim="diseaseName" clearable style="width:180px;"></el-input>
                </li>
                <li>
                    周计划：
                    <el-select v-model="isWeekLyPlanValue" placeholder="请选周计划" style="width:120px;">
                        <el-option
                        v-for="item in this.$store.state.isWeekLyPlan"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                        </el-option>
                    </el-select>
                </li>
                <li>
                    <el-button type="" @click="getTableData" style="margin-left:4px;background:#83BDF9;color:#fff;">查询</el-button>
                </li>
                <li>
                    <a id="downlink"></a>
                    <el-button :disabled="$store.state.feedbackListExport" style="margin-left:4px;background:#83BDF9;color:#fff;" @click="down">导出Excel</el-button>
                </li>
            </ul>               
        </div>


        <!-- table -->
        <el-table v-if="!$store.state.sportExerciseFeedbackList" :data="tabledata.list" style="width:100%;text-align:center;" class="border-radius" v-loading="loading">

            <el-table-column label="反馈日期">
                <template slot-scope="scope">
                    <span>{{ scope.row.createTime?scope.row.createTime.slice(0,10):'---' }}</span>
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
                    <span>{{ scope.row.name?scope.row.name:'---' }}</span>
                </template>
            </el-table-column>

            <el-table-column label="运动时长">
                <template slot-scope="scope">
                    <span>{{ scope.row.quOne?scope.row.quOne:'---' }}分钟</span>
                </template>
            </el-table-column>

            <el-table-column label="周计划">
                <template slot-scope="scope">
                    <span>{{ scope.row.isWeekLyPlan?scope.row.isWeekLyPlan:'---' }}</span>
                </template>
            </el-table-column>

        </el-table>

       <!-- page -->
        <div v-if="!$store.state.sportExerciseFeedbackList" class="block fr" style="padding:14px 26px;">
            <common-page 
                :pageNum="pageNum"
                :pageSize="pageSize"
                :total="total"
                @current="getCurrent"
            >
            </common-page>
        </div>

        <div v-if="$store.state.sportExerciseFeedbackList" class="ac">没有此权限</div>
    </div>
</template>
<style src="./motionFeedbackStatistics.scss" lang="scss"></style>

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
                // loading
                loading:false,

                excelUrl:'',

                valueData:'',
               
                eareValue:'',
                isWeekLyPlanValue:'',
                classValue:'',
                relation:'',
                schoolName:'',
                student:'',
                studentMessage:'',
                diseaseName:'',
               
                tabledata: [],
               
               
                // 当前页
                pageNum:1,
                // 每页数量
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
                    dataCode:this.eareValue,
                    schoolName:this.schoolName,
                    classTitle:this.classValue,
                    name:this.student,
                    identityNumber:this.studentMessage,
                    name:this.diseaseName,
                    isWeekLyPlan:this.isWeekLyPlanValue,
                    createTime:this.valueData,
                    pageNum:this.pageNum,
                    pageSize:this.pageSize
                }
                http.get('/api/auth/v1/sportExercise/feedbackList',params).then(res=>{
                    if(res.status.code == '0'){
                        this.tabledata = res.data
                        this.total = res.data.total;
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
            getEare(current){
               this.eareValue = current.eare;
            },

            down(){
                let obj = {
                    dataCode:this.eareValue,
                    schoolName:this.schoolName,
                    classTitle:this.classValue,
                    name:this.student,
                    identityNumber:this.studentMessage,
                    name:this.diseaseName,
                    isWeekLyPlan:this.isWeekLyPlanValue,
                    createTime:this.valueData,
                }
                let str = '';
                for(let key in obj){
                    // console.log(key);
                    if(obj[key]!=''&&obj[key]!=undefined){
                        str+=key+'='+obj[key]+'&';
                    }
                }
                str = str.slice(0,-1);
                // console.log(str);
                window.open(this.excelUrl + "/api/auth/v1/sportExercise/feedbackList/export?"+str)
            }
        },

        mounted(){
            this.$store.commit('getRole','sportExerciseFeedbackList,feedbackListExport')
            this.excelUrl = process.env.BASE_API
            this.getTableData();
        }
    }
</script>