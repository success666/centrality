<template>
    <div class="login">
        <div class="center">
            <el-form :model="ruleForm" status-icon :rules="rules2" ref="ruleForm" label-width="56px" class="demo-ruleForm">
                <div class="grid-content bg-purple-dark">
                    <h1 class="ac">健康促进中心个人APP管理后台</h1>
                </div>

                <el-form-item label="账号：" prop="username">
                    <el-input v-model="ruleForm.username" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="密码：" prop="password">
                    <el-input type="password" v-model="ruleForm.password" auto-complete="off"></el-input>
                </el-form-item>

                <div class="ac pb">
                    <span class="fl">验证码：</span>
                    <el-input v-model="authCode" auto-complete="off" placeholder="请输入验证码" class="code">
                    </el-input>
                    <el-button @click="yzminit" class="el-button el-button--info yzmbutton">
                        <div ref="yzm" class="yzm">
                        </div>
                    </el-button>
                </div>

                <div class="ac">
                    <el-button class="bgColor" @click="forgetPassword">忘记密码</el-button>
                    <el-button class="bgColor" type="primary" @click="openFullScreen2">登录</el-button>
                </div>
            </el-form>
        </div>
    </div>
</template>

<style lang="scss" src="./login.scss">

</style>

<script>
    import http from '@/utils/HttpClient'

    export default {
        data(){
            // 提示
            var validateAccount = (rule,value,callback) => {
                if(value === ''){
                    callback(new Error('请输入账号'));
                }else{
                    callback();
                }
            }
            var validatePass = (rule,value,callback) => {
                if (value === '') {
                    callback(new Error('请输入密码'));
                }else {
                    callback();
                }
            };

            return {
                // 图片验证码
                str:'0123456789qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM',
                color:['#7FFFD4','#7FFF00','#483D8B','#B0C4DE','#696969','#D3D3D3','#CD853F','#8B4513','#8A2BE2'],
                arrayYzm: [3,24,36,62],
                rotate: [5,-8,8,-4],
                fullscreenLoading: false,
                authCode: '',
                test: '',
                num:0,
                ruleForm: {
                    username: '',
                    password: ''
                },
                rules2: {
                    username:[{validator:validateAccount,trigger:'blur'}],
                    password: [{ validator: validatePass, trigger: 'blur' }]
                }
            }
        },
        methods:{
            // 忘记密码
            forgetPassword(){
                this.$message('请联系管理员重置密码');
            },

            // 验证码
            randomNumber(min,max){
                return Math.floor(Math.random()*(max-min+1)+min);
            },
            yzminit(){
                this.test = '';
                var yzm = this.$refs.yzm
                yzm.innerHTML = '';
                var arr = this.str.split('');
                for(var i=0;i<4;i++){
                    var number = this.randomNumber(0,61);
                    var p = `p${i}`
                    p = document.createElement('p');
                    p.innerHTML = arr[number]
                    p.style.position='absolute';
                    p.style.left= this.arrayYzm[i] +'px';
                    p.style.transform = `rotate(${this.rotate[i]}deg)`;
                    yzm.appendChild(p)

                    this.test += arr[number];
                }
                var colorNumber = this.randomNumber(0,8);
                yzm.style.textShadow = `2px 2px 2px ${this.color[colorNumber]}`;
            },

            // login
            login(){
                var reg = new RegExp(this.test, 'i');
                this.yzminit();
                // if(this.num>=3){
                    // this.yzminit();
                    if(!this.authCode.match(reg)){
                        return this.$message({
                            type: 'error',
                            message: '请输入正确的验证码'
                        });
                    }
                // }
                const loading = this.$loading({
                    lock: true,
                    text: 'Loading',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)'
                });
                http.post('/api/v1/login',this.ruleForm).then(res=>{
                    if(res.status.code == '0'){
                        sessionStorage.setItem('key', 'login');
                        localStorage.setItem('access_token', res.data.token);
                        localStorage.setItem('ydl_user', JSON.stringify(res.data));
                        localStorage.setItem('menuData', JSON.stringify(res.data.menus));
                        this.$router.push({path: '/pagehome'});

                        loading.close();
                    }else{
                        this.$message({
                            type: 'error',
                            message: res.status.msg
                        });
                        this.num++
                        // if(this.num == 3){
                        //     this.$message.warning('你已经三次输入有误，请输入验证码');
                        // }
                        loading.close();
                    }
                }).catch(err => {
                    this.$message({
                        type: 'error',
                        message: '登录不成功'
                    });
                    loading.close();
                });
            },

            // 判断是为空
            openFullScreen2() {
                if(this.ruleForm.username == '' || this.ruleForm.password == ''){
                    return this.$message({
                        type: 'error',
                        message: '请填写用户名或密码'
                    });
                }
                
                this.login();
            }
        },


        mounted(){
            this.yzminit();
            // let token = window.localStorage.getItem('access_token')
            // if(token){
            //     this.$router.push({name: 'pagehome'});
            // }else{
            //     this.$router.push({name: 'login'});
            // }
            document.onkeydown = event => {
                var e = event || window.event || arguments.callee.caller.arguments[0];
                if(e && e.keyCode==13){ 
                    let currenthref = location.href  
                    if(currenthref.endsWith('/login')){
                        this.openFullScreen2();
                    }
                }
            }
        }
    }
</script>