<template>
    <div>
        <div  class="clearfix">
            <div class="fr header">
                <!-- header -->
                <h2 class="fl font20">广州市中小学卫生健康促进中心 APP管理后台</h2>
                <el-dropdown :hide-on-click="false" class="fr">
                    <span class="el-dropdown-link">
                        <img src="./../../assets/imgs/user_icon.png" alt="">
                        <span>{{userName}}</span>
                        <i class="el-icon-arrow-down el-icon--right"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item>
                            <el-button type="text" @click="dialogFormVisible = true">修改密码</el-button>
                        </el-dropdown-item>
                        <el-dropdown-item>
                            <el-button type="text" @click="help">操作帮助</el-button>
                        </el-dropdown-item>
                        <el-dropdown-item>
                            <span @click="logout()">退出登录</span>
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
                
                <!-- 修改密码 -->
                <el-dialog title="修改密码" :visible.sync="dialogFormVisible">
                    <el-form :model="ruleForm2" status-icon :rules="rules2" ref="ruleForm2" label-width="100px" class="demo-ruleForm">
                        <el-form-item label="原密码" prop="oldpassword">
                            <el-input v-model.number="ruleForm2.oldpassword" type="password"></el-input>
                        </el-form-item>
                        <el-form-item label="新密码" prop="pass">
                            <el-input type="password" v-model="ruleForm2.pass" auto-complete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="确认密码" prop="checkPass">
                            <el-input type="password" v-model="ruleForm2.checkPass" auto-complete="off"></el-input>
                        </el-form-item>
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                        <el-button @click="resetForm('ruleForm2')">重置</el-button>
                        <el-button @click="dialogFormVisible = false">取 消</el-button>
                        <el-button type="primary" @click="changePassword('ruleForm2')">确 定</el-button>
                    </div>
                </el-dialog>
            </div>
        </div>
       
        <a :href="href" id="href" target="_blank"></a>
        <div style="height:30px;padding:8px 8px;">
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item>首页</el-breadcrumb-item>
                <el-breadcrumb-item v-if="nav1status">{{nav1.name}}</el-breadcrumb-item>
                <el-breadcrumb-item v-if="nav2status">{{nav2.name}}</el-breadcrumb-item>
                <el-breadcrumb-item v-if="eidtLook">{{nav3}}</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
    </div>
</template>
<style src="./header.scss" scoped lang="scss"></style>

<script>
    import http from '@/utils/HttpClient'
    import {mapState} from 'vuex';
    
    export default {
        computed: mapState({
            count: state => state.Breadcrumb
        }),
        data(){

            // 修改密码
            let regExp=/^(?!^\d*$)(?!^[a-zA-Z]*$)(?!^[-_*+@]*$)[-\d\w*+@]{6,16}$/;
            var checkAge = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('原密码不能为空'));
                }
                callback();
            };
            var validatePass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入密码'));
                } else if(value!='' && !regExp.test(value)){
                    callback(new Error('字母、数字、特殊字符任意两种或以上组合, 6-16位'));
                }else {
                    if (this.ruleForm2.checkPass !== '') {
                        this.$refs.ruleForm2.validateField('checkPass');
                    }
                    callback();
                }
            };
            var validatePass2 = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请再次输入密码'));
                } else if(value!='' && !regExp.test(value)){
                    callback(new Error('字母、数字、特殊字符任意两种或以上组合, 6-16位'));
                }else if (value !== this.ruleForm2.pass) {
                    callback(new Error('两次输入密码不一致!'));
                } else {
                    callback();
                }
            };

            
            return {
                //url 
                Url:'',
                // nav
                menuData:[],
                nav1:'',
                nav1status:true,
                nav2status:true,
                eidtLook:true,
                nav2:'',
                nav3:'',

                href:'',



                // 当前用户信息
                userName:'',

                // 修改密码
                dialogFormVisible: false,
                ruleForm2: {
                    pass: '',
                    checkPass: '',
                    oldpassword: ''
                },
                rules2: {
                    pass: [
                        { validator: validatePass, trigger: 'blur' }
                    ],
                    checkPass: [
                        { validator: validatePass2, trigger: 'blur' }
                    ],
                    oldpassword: [
                        { validator: checkAge, trigger: 'blur' }
                    ]
                },

              
            }
        },
        methods:{

            // 消息提示
            open(test) {
                this.$message.warning(test);
            },
            successopen(){
                this.$message.success('修改密码成功');
            },

            help(){
                window.open('http://file.gzhc.dev.xiaotitong.com/document/%E5%81%A5%E5%BA%B7%E4%BF%83%E8%BF%9B%E4%B8%AD%E5%BF%83%E7%AE%A1%E7%90%86%E5%90%8E%E5%8F%B0%E6%93%8D%E4%BD%9C%E6%89%8B%E5%86%8C%20V1.0.pdf');
                http.get('/api/v1/getOperationManual').then(res=>{
                    if(res.status.code == '0'){
                        this.href = res.data;
                        document.querySelector('#href').click();
                    }else{
                        this.$store.commit('responseStatus',{'self':this,'data':res.status})
                    }
                }).catch(error=>{
                    this.$store.commit('error',{'self':this,'data':error})
                })
            },

            // 退出登录
            logout(){
                http.get('/api/auth/v1/logout').then((res) => {
                    if(res.status.code == '0'){
                        this.$store.commit('clearState')
                        localStorage.clear();
                        sessionStorage.clear();
                        this.$message.success('成功退出');
                        this.$router.push({path: '/login'});
                    }else{
                        this.$store.commit('responseStatus',{'self':this,'data':res.status})
                    }
                }).catch(error=>{
                    this.$store.commit('error',{'self':this,'data':error})
                })
            },


            // 修改密码（重置）
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },


            // 修改密码
            changePassword(formName){
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if(this.ruleForm2.pass === this.ruleForm2.checkPass){
                            let changepad = {
                                oldPassword:String(this.ruleForm2.oldpassword),
                                newPassword:this.ruleForm2.pass
                            }
                            http.post('/api/auth/v1/user/updatePersonPassword',changepad).then(res=>{
                                if(res.status.code==500){
                                    this.open(res.status.msg);
                                }else if(res.status.code==0){
                                    this.successopen()
                                    localStorage.clear();
                                    sessionStorage.clear();
                                    this.$router.push({path: '/login'});
                                }else{
                                    this.$store.commit('responseStatus',{'self':this,'data':res.status})
                                }
                            }).catch(error => {
                                this.$store.commit('error',{'self':this,'data':error})
                            });
                        }
                        this.dialogFormVisible = false

                    } else {
                        return false;
                    }
                });
            },

            // 导航 
            getBread(){
                this.breadlist = this.$route.matched;
                this.$route.matched.forEach((item,index)=>{
                   
                    var paths;
                    if(this.breadlist[1] != undefined){
                        this.pathStatus = true;
                        paths = this.breadlist[1].path;
                    }else{
                        this.pathStatus = false;
                    }

                    let localStorageMenuData = localStorage.getItem("menuData");
                    if(localStorageMenuData){
                        this.menuData = JSON.parse(localStorageMenuData);
                    }

                    if(!this.menuData){
                        this.$router.push({name: 'login'});
                    }

                    let sessionStorageStatus = sessionStorage.getItem('key');
                    if(sessionStorageStatus){
                    }else{
                        localStorage.clear();
                        sessionStorage.clear();
                    }

                    for(let key of this.menuData){
                        if(key.href == paths){
                            this.nav1 = key;
                            this.nav2status = false;
                            this.eidtLook = false;
                            this.nav1status = true;
                            return;

                        }else if(paths.toUpperCase() == (key.href + key.href + 'Look').toUpperCase()){
                            this.eidtLook = false;
                            this.nav2status = true;
                            this.nav1 = key;
                            this.nav2 = {name:key.name + '详情'};
                        }else if(paths.toUpperCase() == (key.href + key.href + 'Edit').toUpperCase()){
                             this.eidtLook = false;
                            this.nav2status = true;
                            this.nav1 = key;
                            this.nav2 = {name:key.name + '(新增/编辑)'};

                        }else if(paths.toUpperCase() == (key.href + key.href + 'Review').toUpperCase()){
                             this.eidtLook = false;
                            this.nav2status = true;
                            this.nav1 = key;
                            this.nav2 = {name:key.name + '评论'};

                        }else if(paths == '/pagehome'){
                             this.nav2status = false;
                             this.nav1status = false;
                             this.eidtLook = false;
                             return;
                        }else{
                            this.nav2status = true;
                            this.nav1status = true;
                            for(let item of key.children){
                                if(item.href.toUpperCase() == paths.toUpperCase()){
                                    this.eidtLook = false;
                                    this.nav1 = key;
                                    this.nav2 = item;
                                }else if(paths.toUpperCase() == (item.href + item.href + 'Look').toUpperCase()){
                                    this.eidtLook = true;
                                    this.nav1 = key;
                                    this.nav2 = item;
                                    this.nav3 = item.name + '详情'
                                }else if(paths.toUpperCase() == (item.href + item.href + 'Edit').toUpperCase()){
                                    this.eidtLook = true;
                                    this.nav1 = key;
                                    this.nav2 = item;
                                    this.nav3 = item.name + '(新增/编辑)'
                                }
                            }
                        }
                    }

                });
            }
        },

        mounted(){
            // 当前用户init
            const user = JSON.parse(window.localStorage.getItem('ydl_user'));
            if(user){
                this.userName = user.username;

            }else{
                this.userName = '';
            }
            this.Url = process.env.BASE_API
        },

        created(){
            this.menuData = JSON.parse(localStorage.getItem("menuData"));
            if(!this.menuData){
                
                this.$router.push({name: 'login'});
            }else{

                this.getBread();
            }
        },
        watch:{
            $route(){
                this.getBread();
            }
        },
    }

</script>

