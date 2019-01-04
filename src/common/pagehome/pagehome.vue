<template>
    <div style="height:100%;position:relative;">
        <h1 class="center" style="font-size:50px;font-family:STXingkai,KaiTi,SimSun;color:#000;">健康生活由我们开启</h1>
    </div>
</template>

<script>
    export default {
        data(){
            return {

            }
        },
        mounted() {
            setInterval(()=>{
                let tokenData = window.localStorage.getItem('access_token')
                if(!tokenData){
                    this.$router.push({name: 'login'});
                }
            },2000);
        },
    }
</script>