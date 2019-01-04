<template>
    <div style="height:100%;">
        <el-container style="height:100%;">
            <el-aside width="200px" style="height:100%;background:#29ADFF;">
                <gzhc-nav></gzhc-nav>
            </el-aside>
            <el-container>
                <el-header height="80" style="padding-left:0px;">
                    <gzhc-header></gzhc-header>  
                </el-header>
                <el-main style="background:#EFEFEF;height:100%;">
                    <div style="height:100%;">
                        <router-view></router-view>
                    </div>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>
<style src="./home.scss" scoped>
</style>

<script>
    import Header from "./../header/header.vue";
    import Nav from "./../nav/nav.vue";
    import http from "@/utils/HttpClient";

export default {
    components: {
        "gzhc-header": Header,
        "gzhc-nav":Nav
    },
    data() {
        return {
            tokenData:[]
        }
    },
    mounted() {
        this.tokenData = window.localStorage.getItem('access_token')
        if(!this.tokenData){
            this.$router.push({name: 'login'});
        }
    }
}
</script>