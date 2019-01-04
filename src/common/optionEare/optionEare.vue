<template>
    <span>
        区:
        <el-select v-model="eareValue" placeholder="请选择区" @change="target" style="width:120px;">
            <el-option
            v-for="item in eare"
            :key="item.id"
            :label="item.dataName"
            :value="item.dataCode">
            </el-option>
        </el-select>
    </span>
</template>

<script>
    import http from '@/utils/HttpClient'
    export default {
        data(){
            return {
                eareValue:'',
                eare:[]
            }
        },
        methods:{
           getEare(){
                http.get('/api/v1/area/list').then(res=>{
                    if(res.status.code == '0'){
                        let eareObj = {
                            dataCode:'',
                            dataName:'全部'
                        }
                        this.eare = res.data;
                        this.eare.unshift(eareObj)
                    }else{
                        this.$store.commit('responseStatus',{'self':this,'data':res.status})
                    }
                }).catch(error=>{
                    this.$store.commit('error',{'self':this,'data':error})
                })
                
            },
            target(event){
                this.$emit('currentEare', {eare: event});
            }
        },
        mounted(){
            this.getEare();
        }
    }
</script>