import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
    state:{
        // 公共的下拉
        identity:[{
            id:'',
            name:'全部'
        },{
            id:'0',
            name:'家长'
        },{
            id:'1',
            name:'学生'
        }],
        isWeekLyPlan:[{
            id:'',
            name:'全部'
        },{
            id:'0',
            name:'否'
        },{
            id:'1',
            name:'是'
        }],
        relationData:[{
            id:'',
            name:'全部'
        },{
            id:'0',
            name:'本人'
        },{
            id:'1',
            name:'母亲'
        },{
            id:'2',
            name:'父亲'
        },{
            id:'3',
            name:'兄弟'
        },{
            id:'4',
            name:'姐妹'
        }],
        status:[{
            value:'',
            label:'全部'
        },{
            value: '0',
            label: '未公开'
            }, {
            value: '1',
            label: '已公开'
        }],
        sexStatus:[{
            id:'',
            value:'',
            label:'全部'
        },{
            id:0,
            value:'0',
            label:'男'
        },{
            id:1,
            value:'1',
            label:'女'
        }],
        strengthStatus:[{
            value:'',
            label:'全部'
        },{
             value:'0',
            label:'低'
        },{
             value:'1',
            label:'中'
        },{
             value:'2',
            label:'高'
        }],
        articletype:[{
            value:'',
            label:'全部'
        },{
             value:'0',
            label:'营养'
        },{
             value:'1',
            label:'健康'
        },{
             value:'2',
            label:'运动'
        },{
             value:'3',
            label:'疾病'
        }],
        articletypeProblemBase:[{
            value:'3',
            label:'全部'
        },{
             value:'0',
            label:'营养'
        },{
             value:'1',
            label:'运动'
        },{
             value:'2',
            label:'疾病'
        }],
        reviewStatus:[{
            value:'',
            label:'全部'
        },{
            value: '0',
            label: '未回复'
            }, {
            value: '1',
            label: '已回复'
        }],
        userStatus:[{
            value: '1',
            label: '启用'
            }, {
            value: '0',
            label: '禁用'
        }],
        user:[{
            value:'',
            label:'全部'
        },{
            value: '1',
            label: '启用'
            }, {
            value: '0',
            label: '禁用'
        }],
        sexData:[{
            id:0,
            value:'0',
            label:'男'
        },{
            id:1,
            value:'1',
            label:'女'
        }],
        pushAgeData:[{
            id:0,
            value:'0',
            label:'6-10岁'
        },{
            id:1,
            value:'1',
            label:'11-13岁'
        },{
            id:2,
            value:'2',
            label:'14岁以上'
        }],

        // app版本号管理 
        listAppVersion:'',
        addAppVersion:'',
        getAppVersion:'',
        deleteAppVersion:'',

        // APP用户管理s
        listAppAccount:'',
        accountMgmtExport:'',
        deleteRelation:'',

        // 在线统计
        listAppLoginLog:'',
        appLoginLogExport:'',

        // 运动记录统计                  
        sportExerciseFeedbackList:'',
        feedbackListExport:'',

        // 运动更新统计
        sportExerciseUpdateList:'',
        seUpdateListExport:'',


        // 学生关系疾病史
        listStudentRelationDiseaseHistory:'',

        // 疾病方案管理
        listDiseaseScheme:'',
        addDiseaseScheme:'',
        deleteDiseaseScheme:'',
        getDiseaseScheme:'',
        changeDiseaseSchemeOpenFlag:'',
        updateDiseaseScheme:'',

        // 运动点方案
        lietSportPoint:'',
        addSportPoint:'',
        updateSportPoint:'',
        deleteSportPoint:'',
        getSportPoint:'',

        // 营养方案管理
        listNutritionScheme:'',
        addNutritionScheme:'',
        updateNutritionScheme:'',
        deleteNutritionScheme:'',
        getNutritionScheme:'',
        changeNutritionSchemeOpenFlag:'',

        // 文章
        listArticle:'',
        addArticle:'',
        updateArticle:'',
        deleteArticle:'',
        getArticle:'',
        changeArticleOpenFlag:'',
        getArticleComment:'',
        changeArticleCommentShow:'',

        // 问题库
        listProblemLibrary:'',
        addProblemLibrary:'',
        getProblemLibrary:'',
        deleteProblemLibrary:'',
        changeProblemLibraryOpenFlag:'',
        updateProblemLibrary:'',

        // 提问管理
        listAskQuestion:'',
        getQuestionReplyList:'',
        nutritionReply:'',
        sportReply:'',
        diseaseReply:'',
        questionReply:'',

        // 用户管理
        listUser:'',
        getUser:'',
        addUser:'',
        updateUser:'',
        deleteUser:'',
        resetPassword:'',

        // 角色管理
        listRole:'',
        updateRole:true,
        addRole:true,

        // 更新密码
        updatePassword:'',
        Breadcrumb:''
    },
    mutations:{
        getRole(event,str){
            let array = str.split(',');
            let token = window.localStorage.getItem('access_token')
            if(token == '' || token == null || token == undefined){
                return this.$router.push({name: 'login'});
            }
            let beforeNum = token.indexOf('.');
            token = token.slice(beforeNum*1+1);
            let lastNum = token.indexOf('.');
            token = token.slice(0,lastNum);
            let reg = new RegExp( '_' , "g" )
            let regexp = new RegExp('-',"g");
            token = token.replace(reg,'/').replace(regexp,'+')

            let tokenObj
            
            tokenObj = decodeURIComponent(atob(token).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            tokenObj = JSON.parse(JSON.parse(tokenObj).sub).menus
           
            // 权限
            for(let i=0;i<array.length;i++){
                for(let item of tokenObj){
                    if(item.code == array[i]){
                        this.state[array[i]] = false;
                    }
                }
            }
          
        },
        clearState(){
            for(let key in this.state){
                if(typeof(this.state[key]) != 'object'){
                    this.state[key] = '';
                }
            }
        },
        responseStatus(event,res){
            if(res.data.code == '2010001'){
                res.self.$message({
                    type: 'error',
                    message: 'token失效请重新登录'
                });
                res.self.$router.push({path: '/login'})
            }else{
                res.self.$message({
                    type: 'error',
                    message: res.data.msg
                });
            }
        },
        error(event,error){
            if(error.data.toString().indexOf('the network is offline')>=0){
                error.self.$message({
                    type: 'error',
                    message: '目前无法连接服务器 ，请检查您的网络连接'
                });
            }else{
                error.self.$message({
                    type: 'error',
                    message: error.data
                });
            }
        }
        
     
    },
    actions:{
       
    }
})

export default store;