<template>
    <div style="color:#fff;">
        <p class="rootelement" style="height:120px;">
            <img src="./../../assets/imgs/gzhc_icon.png" alt="" style="width:100px;height:100px;" class="center">
        </p>
        <el-tree :data="menuData" :props="defaultProps" @node-click="handleNodeClick" class="eltree" style="padding:10px 0px 10px 0px;background:#29ADFF;color:#E5E5E5;height:100%;"></el-tree>
    </div>
</template>
<style src="./nav.scss"></style>

<script>
import http from "@/utils/HttpClient";

export default {
    data() {
        return {
            menuData:[],
            defaultProps: {
                children: "children",
                label: "name"
            }
        };
    },
    methods: {
        handleNodeClick(data) {
            if(data.href != '' && data.href != null){
                this.$router.push({path:data.href});
            }else if(data.href == null || data.href == ''){
                return;
            }else{
                return this.$message({
                    type: 'error',
                    message: '该模板功能尚未完成'
                });
            }
        },
        handleOpen(key, keyPath) {

        },
        handleClose(key, keyPath) {

        }

    },
    mounted() {
        this.menuData = JSON.parse(localStorage.getItem("menuData"));
        if(this.menuData){
            if(this.menuData == '' || this.menuData == null || this.menuData == undefined){
                this.$router.push({name: 'login'});
            }
        }

    }
};
</script>