import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)


import Home from '@/common/home/home.vue'
import Login from './../components/login/login.vue'
import AppVersion from './../components/appVersion/appVersion.vue'
import User from './../components/user/user.vue'
import Role from './../components/role/role.vue'
import RoleEdit from './../components/role/children/roleedit.vue'
import Article from './../components/article/article.vue'
import AddArticle from './../components/article/children/addarticle.vue'
import ArticleLook from './../components/article/children/articlelook.vue'
import ArticleReview from './../components/article/children/articlereview.vue'
import DiseasesHistory from './../components/diseasesHistory/diseasesHistory.vue'
import ProblemBase from './../components/problemBase/problemBase.vue'
import EditProblemBase from './../components/problemBase/children/editProblemBase.vue'
import ProblemBaseLook from './../components/problemBase/children/problemBaseLook.vue'
import DiseaseScheme from './../components/diseaseScheme/diseaseScheme.vue'
import EditDiseaseScheme from './../components/diseaseScheme/children/editDiseaseScheme.vue'
import DiseaseSchemeLook from './../components/diseaseScheme/children/diseaseSchemeLook.vue'
import IssuesManagement from './../components/issuesManagement/issuesManagement.vue'
import IssuesManagementLook from './../components/issuesManagement/children/issuesManagementLook.vue'
import NutritionScheme from './../components/nutritionScheme/nutritionScheme.vue'
import EditNutritionScheme from './../components/nutritionScheme/children/editNutritionScheme.vue'
import NutritionSchemeLook from './../components/nutritionScheme/children/nutritionSchemeLook.vue'
import AppUser from './../components/appUser/appUser.vue'
import OnlineStatistics from './../components/onlineStatistics/onlineStatistics.vue'
import MovingManagement from './../components/movingManagement/movingManagement.vue'
import EditMovingManagement from './../components/movingManagement/children/editMovingManagement.vue'
import MovingManagementLook from './../components/movingManagement/children/movingManagementLook.vue'
import MotionFeedbackStatistics from './../components/motionFeedbackStatistics/motionFeedbackStatistics.vue'
import MotionUpdateStatistics from './../components/motionUpdateStatistics/motionUpdateStatistics.vue'
import Pagehome from '@/common/pagehome/pagehome.vue'

const router = new VueRouter({
    routes : [{
        path:'/',
        redirect: '/login',
        name:'home',
        component:Home,
        children:[{
            path:'/pagehome',
            name:'pagehome',
            component:Pagehome
        },{
            // APP版本号管理
            path:'/appVersion',
            name:'appVersion',
            component:AppVersion
        },{
            // 用户管理
            path:'/user',
            name:'name',
            component:User
        },{
            // 角色管理
            path:'/role',
            name:'role',
            component:Role
        },{
            // 角色管理 -> 角色编辑
            path:'/role/roleEdit',
            name:'roleEdit',
            component:RoleEdit
        },{
            // 文章管理
            path:'/article',
            name:'article',
            component:Article
        },{
            // 文章管理 -> 新增/编辑
            path:'/article/articleEdit',
            name:'articleEdit',
            component:AddArticle
        },{
            // 文章详情
            path:'/article/articlelook',
            name:'articlelook',
            component:ArticleLook
        },{
            // 文章评论
            path:'/article/articlereview',
            name:'articlereview',
            component:ArticleReview
        },{
            // 疾病史
            path:'/diseasesHistory',
            name:'diseasesHistory',
            component:DiseasesHistory
        },{
            // 问题库
            path:'/problemBase',
            name:'problemBase',
            component:ProblemBase
        },{
            // 问题库 -> 编辑/新增
            path:'/problemBase/problemBaseEdit',
            name:'problemBaseEdit',
            component:EditProblemBase
        },{
            // 问题库详情
            path:'/problemBase/problemBaseLook',
            name:'problemBaseLook',
            component:ProblemBaseLook
        },{
            // 疾病方案管理
            path:'/diseaseScheme',
            name:'diseaseScheme',
            component:DiseaseScheme
        },{
            // 疾病方案管理 -> 新增/编辑
            path:'/diseaseScheme/diseaseSchemeEdit',
            name:'diseaseSchemeEdit',
            component:EditDiseaseScheme
        },{
            // 疾病方案详情
            path:'/diseaseScheme/diseaseSchemeLook',
            name:'diseaseSchemeLook',
            component:DiseaseSchemeLook
        },{
            // 提问管理
            path:'/issuesManagement',
            name:'issuesManagement',
            component:IssuesManagement
        },{
            // 提问详情
            path:'/issuesManagement/issuesManagementLook',
            name:'issuesManagementLook',
            component:IssuesManagementLook
        },{
            // 营养方案
            path:'/nutritionScheme',
            name:'nutritionScheme',
            component:NutritionScheme
        },{
            // 营养方案 -> 新增/编辑
            path:'/nutritionScheme/nutritionSchemeEdit',
            name:'nutritionSchemeEdit',
            component:EditNutritionScheme
        },{
            // 营养方案 查看 
            path:'/nutritionScheme/nutritionSchemeLook',
            name:'nutritionSchemeLook',
            component:NutritionSchemeLook 
        },{
            // APP用户管理
            path:'/appUser',
            name:'appUser',
            component:AppUser
        },{
            // 在线统计
            path:'/onlineStatistics',
            name:'onlineStatistics',
            component:OnlineStatistics
        },{
            // 运动点管理
            path:'/movingManagement',
            name:'movingManagement',
            component:MovingManagement
        },{
            // 运动点管理
            path:'/movingManagement/movingManagementEdit',
            name:'movingManagementEdit',
            component:EditMovingManagement
        },{
            // 运动点管理
            path:'/movingManagement/movingManagementLook',
            name:'movingManagementLook',
            component:MovingManagementLook
        },{
            path:'/motionFeedbackStatistics',
            name:'motionFeedbackStatistics',
            component:MotionFeedbackStatistics
        },{
            path:'/motionUpdateStatistics',
            name:'motionUpdateStatistics',
            component:MotionUpdateStatistics
        }]
    },{ 
        path:'/login',
        name:'login',
        component:Login
    },{
        path:'*',
        component:Pagehome
    }]
})

export default router;