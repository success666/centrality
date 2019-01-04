<template>
    <div class="appVersion">
        <p>
            <el-button :disabled="$store.state.addAppVersion" @click="dialogFormVisible = true" style="background:#83BDF9;color:#fff;margin:0px 50px 20px 0px;" class="fr">新增</el-button>
        </p>
        <!-- table -->
        <el-table v-if="!$store.state.listAppVersion" :data="tabledata.list" class="table border-radius ac" v-loading="loading">
            <el-table-column label="版本名">
                <template slot-scope="scope">
                    <span>{{ scope.row.name == 1?'家长app' : '学校app' }}</span>
                </template>
            </el-table-column>

            <el-table-column label="创建时间">
                <template slot-scope="scope">
                    <span>{{ scope.row.createTime?scope.row.createTime.slice(0,10):'---' }}</span>
                </template>
            </el-table-column>

            <el-table-column label="平台">
                <template slot-scope="scope">
                    <span>{{ scope.row.platform == 1? 'ios' : '安卓' }}</span>
                </template>
            </el-table-column>

            <el-table-column label="版本号">
                <template slot-scope="scope">
                    <span>{{ scope.row.versionNum?scope.row.versionNum:'---' }}</span>
                </template>
            </el-table-column>

            <el-table-column label="安装包路径">
                <template slot-scope="scope">
                    <span>{{ scope.row.packageUrl?scope.row.packageUrl:'---' }}</span>
                </template>
            </el-table-column>

            <el-table-column label="描述">
                <template slot-scope="scope">
                    <span>{{ scope.row.description?scope.row.description:'---' }}</span>
                </template>
            </el-table-column>

            <el-table-column label="操作"  width="260">
                <template slot-scope="scope">
                    <el-button :disabled="$store.state.getAppVersion" size="mini" @click="handleEdit(scope.$index, scope.row)" style="background:#83BDF9;color:#fff;">查看</el-button>
                    <el-button :disabled="$store.state.deleteAppVersion" size="mini" style="background:#83BDF9;color:#fff;" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>


        <!-- 新增 -->
        <el-dialog title="新增" :visible.sync="dialogFormVisible">
            <el-form :model="addData" status-icon :rules="rules2" ref="addData" label-width="110px" class="demo-ruleForm">
                <el-form-item label="*描述：" prop="description">
                    <el-input v-model="addData.description" placeholder="请输入描述"></el-input>
                </el-form-item>

                <el-form-item label="*版本号：" prop="versionNum">
                    <el-input v-model="addData.versionNum" placeholder="请输入版本号"></el-input>
                </el-form-item>
                
                <el-form-item label="*安装包路径：" prop="packageUrl">
                    <el-input v-model="addData.packageUrl" placeholder="请输入安装包路径"></el-input>
                </el-form-item>

                <el-form-item label="*版本名：" prop="1">
                    <el-select v-model="namestatus" placeholder="请选择版本名">
                        <el-option
                        v-for="item in versions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="*平台：" prop="1">
                    <el-select v-model="platformstatus" placeholder="请选择平台">
                        <el-option
                        v-for="items in platform"
                        :key="items.value"
                        :label="items.label"
                        :value="items.value">
                        </el-option>
                    </el-select> 
                </el-form-item>

            </el-form>

            <div slot="footer" class="dialog-footer">
                <el-button @click="resetForm('addData')" style="background:#83BDF9;color:#fff;">重置</el-button>
                <el-button @click="cancel('addData')" style="background:#83BDF9;color:#fff;">取 消</el-button>
                <el-button @click="adduser('addData')" style="background:#83BDF9;color:#fff;">保 存</el-button>
            </div>
            
        </el-dialog>


        <!-- 查看 -->
        <el-dialog title="查看" :visible.sync="compile">
            <el-form :model="lookdata" status-icon label-width="100px" class="demo-ruleForm">
                
                <el-form-item label="描述：">
                    <el-input v-model="lookdata.description" :disabled="true"></el-input>
                </el-form-item>
                
                <el-form-item label="版本号：">
                    <el-input v-model="lookdata.versionNum" :disabled="true"></el-input>
                </el-form-item>

                <el-form-item label="安装包路径：">
                    <el-input v-model="lookdata.packageUrl" :disabled="true"></el-input>
                </el-form-item>

                <el-form-item label="版本名：">
                    <el-input v-model="lookdata.name" :disabled="true"></el-input>
                </el-form-item>

                <el-form-item label="平台：">
                    <el-input v-model="lookdata.platform" :disabled="true"></el-input>
                </el-form-item>

                <el-form-item label="创建时间：">
                    <el-input v-model="lookdata.createTime" :disabled="true"></el-input>
                </el-form-item>
                
            </el-form>
        </el-dialog>

        <!-- page -->
        <div v-if="!$store.state.listAppVersion" class="block fr page">
            <common-page 
                :pageNum="pageNum"
                :pageSize="pageSize"
                :total="total"
                @current="getCurrent"
            >
            </common-page>
        </div>

        <div v-if="$store.state.listAppVersion" class="ac">没有此列表权限</div>
    </div>
</template>

<style src="./appVersion.scss" lang="scss">
</style>

<script>
    import http from '@/utils/HttpClient'
    import Page from '@/common/page/page.vue'
    export default {
        components: {
            "common-page": Page
        },
        data(){
            var validateDescription = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('描述不能为空'));
                }
                callback();
            };
            var validateVersionNum = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('版本号不能为空'));
                }
                callback();
            };
            var validatePackageUrl = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('安装包路径不能为空'));
                }
                callback();
            };
           
            return {
                // loading
                loading:false,
                // 新增
                platformstatus:'',
                namestatus:'',
                dialogFormVisible:false,
                addData:{
                    description:'',
                    versionNum:'',
                    packageUrl:'',
                    platformstatus:'',
                    name:''
                },
                 versions:[{
                    value: '1',
                    label: '家长app'
                    }, {
                    value: '2',
                    label: '学校app'
                }],
                platform:[{
                    value: '1',
                    label: 'ios'
                    }, {
                    value: '2',
                    label: '安卓'
                }],
                rules2: {
                    description: [{ validator: validateDescription, trigger: 'blur' }],
                    versionNum:[{ validator: validateVersionNum, trigger: 'blur' }],
                    packageUrl:[{ validator: validatePackageUrl, trigger: 'blur' }],
                },
                // 查看 
                compile:false,
                lookdata:{},
             
                // table列表 
                tabledata:[],

                //分页
                pageNum:1,
                pageSize:10,
                total:0
            }
            
        },
       
        methods:{
            cancel(formName){
                this.dialogFormVisible = false
                this.$refs[formName].resetFields();
            },
            //新增
            adduser(formName){
                this.$refs[formName].validate((valid) => {
                    if(this.platformstatus == ''){
                        return this.$message.warning('请选择平台')
                    }else if(this.namestatus == ''){
                        return this.$message.warning('请选择版本名')
                    }else{
                        this.addData.platform = this.platformstatus;
                        this.addData.name = this.namestatus;
                        if (valid) {
                            const loading = this.$loading({
                                lock: true,
                                text: 'Loading',
                                spinner: 'el-icon-loading',
                                background: 'rgba(0, 0, 0, 0.7)'
                            });
                            http.post('/api/auth/v1/appVersion',this.addData).then(res=>{
                                if(res.status.code == 0){
                                    this.platformstatus = '';
                                    this.namestatus = '';
                                    this.dialogFormVisible = false
                                    this.$message.success('保存成功');
                                    this.getTableData();
                                    this.$refs[formName].resetFields();
                                    loading.close();
                                }else{
                                    loading.close();
                                    this.$store.commit('responseStatus',{'self':this,'data':res.status})
                                }
                            }).catch(error=>{
                                loading.close();
                                this.$store.commit('error',{'self':this,'data':error})
                            })
                        }
                    }
                });
            },  
            // 重置  
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },

            // 查看 
            handleEdit(index, row) {
                const loading = this.$loading({
                    lock: true,
                    text: 'Loading',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)'
                });
                this.compile = true;
                http.get('/api/auth/v1/appVersion/'+row.id).then(res=>{
                    if(res.status.code == '0'){
                        this.lookdata = res.data;
                        if(res.data.platform == 1){
                            this.lookdata.platform = 'ios'
                        }else if(res.data.platform == 2){
                            this.lookdata.platform = '安卓'
                        }

                        if(res.data.name == 1){
                            this.lookdata.name = '家长app'
                        }else if(res.data.name == 2){
                            this.lookdata.name = '学校app'
                        }
                        this.lookdata.createTime = this.lookdata.createTime.slice(0,10);
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
          

            // 删除
            handleDelete(index, row) {
                this.$confirm('删除后账号无法恢复, 是否继续?', '提示', {
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
                    http.delete(`/api/auth/v1/appVersion/${row.id}`).then(res=>{
                        if(res.body.status.code == '0'){
                            loading.close();
                            this.$message.success('删除成功!');
                            this.getTableData();
                        }else{
                            loading.close();
                            this.$store.commit('responseStatus',{'self':this,'data':res.body.status})
                        }
                    }).catch(error=>{
                        loading.close();
                        this.$store.commit('error',{'self':this,'data':error})
                    })
                }).catch(() => {
                    this.$message.info('已取消删除');          
                });                
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
                    pageNum:this.pageNum,
                    pageSize:this.pageSize
                }
                http.get('/api/auth/v1/appVersion',params).then(data=>{
                    if(data.status.code === 0){
                        this.tabledata = data.data
                        this.total = data.data.total;
                        this.loading = false;
                    }else{
                        this.loading = false;
                        this.$store.commit('responseStatus',{'self':this,'data':data.status})
                    }
                }).catch(error => {
                    this.loading = false;
                    this.$store.commit('error',{'self':this,'data':error})
                });
            },
        },
        mounted(){
            this.$store.commit('getRole','listAppVersion,addAppVersion,getAppVersion,deleteAppVersion')
            this.getTableData();
            
        }
    }
</script>