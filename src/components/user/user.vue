<template>
    <div class="rootelementa">
        <!-- search -->
        <div v-if="!$store.state.listUser" class="search">
            账号/手机号/使用人:
            <el-input placeholder="请输入内容" v-model="searchvalue" clearable style="width:180px;"></el-input> 
            角色:
            <el-select v-model="rolevalue" placeholder="请选择角色" style="width:160px;">
                <el-option
                v-for="item in userroledata"
                :key="item.id"
                :label="item.name"
                :value="item.id">
                </el-option>
            </el-select>
            状态:
            <el-select v-model="statusvalue" placeholder="请选择状态" style="width:120px;">
                <el-option
                v-for="items in this.$store.state.user"
                :key="items.value"
                :label="items.label"
                :value="items.value">
                </el-option>
            </el-select>
            <el-button type="" style="background:#83BDF9;color:#fff;margin-left:4px;" @click="getTableData">查询</el-button>
            <el-button type="" style="background:#83BDF9;color:#fff;margin-left:4px;" @click="dialogFormVisibleFn" :disabled="$store.state.addUser">新增</el-button>
        </div>

        <!-- 新增 -->
        <el-dialog title="新增用户" :visible.sync="dialogFormVisible">
            <el-form :model="adduserdata" status-icon :rules="rules2" ref="adduserdata" label-width="100px" class="demo-ruleForm">
                
                <el-form-item label="邮箱地址：" prop="emailAddress">
                    <el-input v-model="adduserdata.emailAddress" placeholder="请输入邮箱"></el-input>
                </el-form-item>

                <el-form-item label="*联系号码：" prop="phoneNo">
                    <el-input v-model="adduserdata.phoneNo" placeholder="请输入联系号码"></el-input>
                </el-form-item>
                
                <el-form-item label="*账号：" prop="account">
                    <el-input v-model="adduserdata.account" placeholder="请输入账号"></el-input>
                </el-form-item>
                
                <el-form-item label="*使用人：" prop="username">
                    <el-input v-model="adduserdata.username" placeholder="请输入使用人"></el-input>
                </el-form-item>

                <el-form-item label="*密码：" prop="password">
                    <el-input v-model="adduserdata.password" placeholder="请输入密码" type="password"></el-input>
                </el-form-item>

                <el-form-item label="*角色：" prop="1">
                    <el-select v-model="adduserdata.roleId" placeholder="请选择角色">
                        <el-option
                        v-for="item in rolesarray"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="*状态：">
                    <el-select v-model="adduserdata.status" prop="status" placeholder="请选择状态">
                        <el-option
                        v-for="items in this.$store.state.userStatus"
                        :key="items.value"
                        :label="items.label"
                        :value="items.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                

            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button style="background:#83BDF9;color:#fff;" @click="resetForm('adduserdata')">重置</el-button>
                <el-button style="background:#83BDF9;color:#fff;" @click="dialogFormVisible = false">取 消</el-button>
                <el-button style="background:#83BDF9;color:#fff;" type="" @click="adduser('adduserdata')">保 存</el-button>
            </div>
        </el-dialog>

        <!-- table -->
        <el-table v-if="!$store.state.listUser" :data="tabledata.list" style="width:100%;text-align:center;" class="border-radius" v-loading="loading">
            <el-table-column label="账号">
                <template slot-scope="scope">
                    <span>{{ scope.row.account?scope.row.account:'---' }}</span>
                </template>
            </el-table-column>

            <el-table-column label="角色">
                <template slot-scope="scope">
                    <span>{{ scope.row.roleId =='0' ? '超级管理员' : scope.row.roleName }}</span>
                </template>
            </el-table-column>

            <el-table-column label="使用人">
                <template slot-scope="scope">
                    <span>{{ scope.row.username?scope.row.username:'---' }}</span>
                </template>
            </el-table-column>

            <el-table-column label="联系号码">
                <template slot-scope="scope">
                    <span>{{ scope.row.phoneNo?scope.row.phoneNo:'---' }}</span>
                </template>
            </el-table-column>

            <el-table-column label="状态">
                <template slot-scope="scope">
                    <span>{{ scope.row.status == 1? '启用':'禁用' }}</span>
                </template>
            </el-table-column>

            <el-table-column label="操作"  width="320">
                <template slot-scope="scope">
                    <el-button :disabled="$store.state.getUser" size="mini" style="background:#83BDF9;color:#fff;" @click="handleEdit(scope.$index, scope.row)">查看</el-button>
                    <el-button :disabled="$store.state.updateUser" size="mini" style="background:#83BDF9;color:#fff;" @click="handleEdit(scope.$index, scope.row,'edit')">编辑</el-button>
                    <el-button :disabled="$store.state.resetPassword" size="mini" style="background:#83BDF9;color:#fff;" @click="resetpasswor(scope.$index, scope.row)">重置密码</el-button>
                    <el-button :disabled="$store.state.deleteUser" size="mini" style="background:#83BDF9;color:#fff;" type="" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- 查看 -->
        <el-dialog title="查看" :visible.sync="compile">
            <el-form :model="compiledata" status-icon label-width="100px" class="demo-ruleForm">

                <el-form-item label="邮箱地址：">
                    <el-input v-model="compiledata.emailAddress" clearable disabled></el-input>
                </el-form-item>

                <el-form-item label="手机号：">
                    <el-input v-model="compiledata.phoneNo" clearable disabled></el-input>
                </el-form-item>

                <el-form-item label="账户：">
                    <el-input v-model="compiledata.account" clearable disabled></el-input>
                </el-form-item>

                <el-form-item label="中文名称：">
                    <el-input v-model="compiledata.username" clearable disabled></el-input>
                </el-form-item>

                <el-form-item label="角色：" prop="1">
                    <el-select v-model="compiledata.roleId" placeholder="请选择角色" disabled>
                        <el-option
                        v-for="item in rolesarray"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="账户状态：">
                    <el-select v-model="compiledata.status" prop="1" placeholder="请选择状态" style="width:200px;" disabled>
                        <el-option
                        v-for="items in this.$store.state.userStatus"
                        :key="items.value"
                        :label="items.label"
                        :value="items.value">
                        </el-option>
                    </el-select> 
                </el-form-item>

            </el-form>
           
        </el-dialog>

        <!-- 编辑 -->
        <el-dialog title="编辑" :visible.sync="compileEdit">
            <el-form :model="compiledata" status-icon label-width="100px" class="demo-ruleForm">

                <el-form-item label="邮箱地址：">
                    <el-input v-model="compiledata.emailAddress" clearable></el-input>
                </el-form-item>

                <el-form-item label="*手机号：">
                    <el-input v-model="compiledata.phoneNo" clearable ></el-input>
                </el-form-item>

                <el-form-item label="*账户：">
                    <el-input v-model="compiledata.account" clearable ></el-input>
                </el-form-item>

                <el-form-item label="*中文名称：">
                    <el-input v-model="compiledata.username" clearable ></el-input>
                </el-form-item>

                <el-form-item label="*角色：" prop="1">
                    <el-select v-model="compiledata.roleId" placeholder="请选择角色">
                        <el-option
                        v-for="item in rolesarray"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="*账户状态：">
                    <el-select v-model="compiledata.status" prop="1" placeholder="请选择状态" style="width:200px;">
                        <el-option
                        v-for="items in this.$store.state.userStatus"
                        :key="items.value"
                        :label="items.label"
                        :value="items.value">
                        </el-option>
                    </el-select> 
                </el-form-item>

            </el-form>
            
            <div slot="footer" class="dialog-footer">
                <el-button @click="compileEdit = false" style="background:#83BDF9;color:#fff;">取 消</el-button>
                <el-button type="" style="background:#83BDF9;color:#fff;" @click="compilesave" :disabled="$store.state.updateUser">保 存</el-button>
            </div>
        </el-dialog>

        <!-- page -->
        <div v-if="!$store.state.listUser" class="block fr" style="padding:14px 26px;">
            <common-page 
                :pageNum="pageNum"
                :pageSize="pageSize"
                :total="total"
                @current="getCurrent"
            >
            </common-page>
        </div>

        <div v-if="$store.state.listUser" style="text-align:center;">没有此权限</div>
    </div>
</template>

<style src="./user.scss">

</style>

<script>
    import http from '@/utils/HttpClient'
    import Page from '@/common/page/page.vue'
    export default {
        components: {
            "common-page": Page
        },
        data(){
            var validateAccount = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('账号不能为空'));
                }
                callback();
            };
            // var validateRoleId = (rule, value, callback) => {
            //     if (!value) {
            //         return callback(new Error('角色不能为空'));
            //     }
            //     callback();
            // };
            var validateUsername = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('使用人不能为空'));
                }
                callback();
            };
            var validateNumber = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('联系号码不能为空'));
                }else if(!(/^1[34578]\d{9}$/.test(value))){
                    return callback(new Error('联系号码格式有误'));
                }
                callback();
            };
            var validateStatus = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('状态不能为空'));
                }
                callback();
            };
            // var validateEmail = (rule, value, callback) => {
            //     if(value && !(/^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/.test(value))){
            //         return callback(new Error('邮箱格式有误'));
            //     }
            //     callback();
            // };
            var validatePassword = (rule, value, callback) => {
                let regExp=/^(?!^\d*$)(?!^[a-zA-Z]*$)(?!^[-_*+@]*$)[-\d\w*+@]{6,16}$/;
                if (!value) {
                    return callback(new Error('密码不能为空'));
                }else if(!regExp.test(value)){
                    return callback(new Error('字母、数字、特殊字符任意两种或以上组合, 6-16位'));
                }
                callback();
            };
            return {
                // loading
                loading:false,
                // 新增
                rolesarray:[],
                dialogFormVisible:false,
                // addstatus:'',
                adduserdata:{
                    account:'',
                    roleId:'',
                    username:'',
                    password:'',
                    status:'',
                    phoneNo:'',
                    emailAddress:''
                },
                rules2: {
                    account: [{ validator: validateAccount, trigger: 'blur' }],
                    status:[{ validator: validateStatus, trigger: 'blur' }],
                    // role:[{ validator: validateRoleId, trigger: 'blur' }],
                    username:[{ validator: validateUsername, trigger: 'blur' }],
                    phoneNo:[{ validator: validateNumber, trigger: 'blur' }],
                    // emailAddress:[{ validator: validateEmail, trigger: 'blur' }],
                    password:[{ validator: validatePassword, trigger: 'blur' }],
                },

                // look
                compile:false,
                // 编辑
                compileEdit:false,
                ID:'',
                compiledata:{},
                
             
                value: '',
                // uservalue:'',

                searchvalue:'',
                
                rolevalue:'',
                statusvalue:'',

                tabledata:[],


                userroledata:[],


              
                // 当前页
                pageNum:1,
                // 每页数量
                pageSize:10,
                total:0
            }
            
        },
        methods:{
           
            // 新增用户可选角色
            adduserroles() {
                this.getRole();
            },
            abnormal(data){
                this.$store.commit('responseStatus',{'self':this,'data':data})
            },
            error(data){
                this.$store.commit('error',{'self':this,'data':data})
            },
            getRole(){
                http.get('/api/auth/v1/user/roles').then(res=>{
                    if(res.status.code == 0){
                        this.rolesarray = res.data;
                    }else{
                        this.abnormal(res.status);
                    }
                }).catch(error=>{
                    this.error(error);
                })
            },

            open(test) {
                this.$message.warning(test);
            },
            erroropen(test) {
                this.$message.error(test);
            },

            dialogFormVisibleFn(){
                this.adduserroles();
                this.dialogFormVisible = true;
            },

            //新增
            adduser(formName){
               
                if(this.adduserdata.emailAddress != '' && !(/^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/.test(this.adduserdata.emailAddress))){
                    this.erroropen('邮箱格式有误');
                }else{
                    this.adduserdata.emailAddress = '';
                }
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if(this.adduserdata.status == ''){
                            this.open('请选择状态');
                        }else if(this.adduserdata.roleId == ''){
                            this.open('请选择角色');
                        }else{
                            const loading = this.$loading({
                                lock: true,
                                text: 'Loading',
                                spinner: 'el-icon-loading',
                                background: 'rgba(0, 0, 0, 0.7)'
                            });
                            http.post('/api/auth/v1/user',this.adduserdata).then(res=>{
                                if(res.status.code == 0){
                                    this.getTableData();
                                    this.dialogFormVisible = false
                                    this.$refs[formName].resetFields();
                                    this.adduserdata.status = '';
                                    this.adduserdata.roleId = '';
                                    loading.close();
                                    let obj = {
                                        self:this,
                                        type:'success',
                                        text:'新增成功'
                                    }
                                    this.$store.commit('openSuccess',obj);
                                    
                                }else{
                                    loading.close();
                                    this.abnormal(res.status);
                                }
                            }).catch(error=>{
                                loading.close();
                                this.error(error);
                            })
                        }
                    } else {
                        return false;
                    }
                });
            },    
            resetForm(formName) {
                this.$refs[formName].resetFields();
                this.adduserdata.status = '';
                this.adduserdata.roleId = '';
            },

            // 编辑
            handleEdit(index, row, status) {
                if(status == 'edit'){
                    this.compileEdit = true;
                }else{
                    this.compile = true;
                }
                this.ID = row.id;
                
                http.get('/api/auth/v1/user/'+row.id).then(res=>{
                    if(res.status.code == '0'){
                        this.compiledata = res.data;
                        if(this.compiledata.emailAddress == '' || this.compiledata.emailAddress == null){
                            this.compiledata.emailAddress = ''
                        }
                      
                        this.compiledata.status = String(this.compiledata.status)
                    }else{
                        this.abnormal(res.status);
                    }
                }).catch(error=>{
                    this.error(error);
                })
            },
            // 保存编辑
            compilesave(){

                if(this.compiledata.emailAddress != '' && !(/^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/.test(this.compiledata.emailAddress))){
                    return this.erroropen('邮箱格式有误');
                }else{
                    this.compiledata.emailAddress = '';
                }
                
                if(this.compiledata.phoneNo !=''){
                    if(!(/^1[34578]\d{9}$/.test(this.compiledata.phoneNo))){
                        return this.$message({
                            type: 'warning',
                            message: '手机号码格式有误'
                        })
                    }
                }
                if(this.compiledata.account==''||this.compiledata.roleId==''&&this.compiledata.roleId!=0||this.compiledata.username==''||this.compiledata.phoneNo==''){
                    this.$message({
                        type: 'warning',
                        message: '请求把数据填写完整'
                    })
                }else{
                    if(this.compiledata.status == '停用'){
                        this.compiledata.status = 0;
                    }else if(this.compiledata.status == '启用'){
                        this.compiledata.status = 1;
                    }

                    let obj = {
                        account:this.compiledata.account,
                        roleId:this.compiledata.roleId,
                        username:this.compiledata.username,
                        phoneNo:this.compiledata.phoneNo,
                        status:this.compiledata.status,
                        emailAddress:this.compiledata.emailAddress,
                        id:this.ID
                    }
                    const loading = this.$loading({
                        lock: true,
                        text: 'Loading',
                        spinner: 'el-icon-loading',
                        background: 'rgba(0, 0, 0, 0.7)'
                    });
                    http.post('/api/auth/v1/user/'+this.ID,obj).then(res=>{
                        if(res.status.code=='0'){
                            this.compileEdit = false;
                            this.compile = false;
                            this.getTableData();
                            loading.close();
                            this.$message({
                                type: 'success',
                                message: '编辑成功'
                            });
                        }else{
                            loading.close();
                            this.abnormal(res.status);
                        }
                    }).catch(error=>{
                        loading.close();
                        this.error(error);
                    })
                }
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
                    http.delete(`/api/auth/v1/user/${row.id}`).then(res=>{
                        if(res.body.status.code == 0){
                            this.getTableData();
                            loading.close();
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                        }else{
                            loading.close();
                            this.abnormal(res.body.statu);
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



            // 重置密码
            resetpasswor(index,row){
                this.$confirm('重置后密码将变成aaa111', '提示', {
                    confirmButtonText: '重置',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    http.post('/api/auth/v1/user/resetPassword',{userId:row.id}).then(res=>{
                        if(res.status.code == 0){
                            this.$message({
                                type: 'success',
                                message: '重置成功!'
                            });
                        }else{
                            this.abnormal(res.status);
                        }
                    }).catch(error=>{
                        this.error(error);
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消重置'
                    });          
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
                    condition:this.searchvalue,
                    roleId:this.rolevalue,
                    status:this.statusvalue,
                    pageNum:this.pageNum,
                    pageSize:this.pageSize
                }
                http.get('/api/auth/v1/user/list',params).then(res=>{
                    if(res.status.code === 0){
                        this.tabledata = res.data;
                        this.total = res.data.total;
                        for(var i=0; i<this.tabledata.list.length; i++) {
                            if(this.tabledata.list[i].roleId == '0') {
                                this.tabledata.list.splice(i, 1);
                                break;
                            }
                        }
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


            //角色列表
            getRoleData(){
                http.get('/api/auth/v1/user/roles',this.page).then(res=>{
                    if(res.status.code == 0){
                        this.userroledata = res.data
                        this.userroledata.unshift({
                            id:'',
                            name:'全部'
                        })
                    }else{
                       this.abnormal(res.status);
                    }
                }).catch(error => {
                    this.erroropen('角色列表数据获取失败');
                });
            }
        },
        mounted(){
            this.$store.commit('getRole','listUser,addUser,getUser,updateUser,resetPassword,deleteUser')
            this.getTableData();
            this.getRoleData();
            this.getRole();
        }
          
    }
</script>