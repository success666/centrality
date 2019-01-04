<template>
    <div class="filtrate">
        <div class="fl">
            <el-radio-group v-model="radio" @change="radioChange">
                <el-radio :label="3" class="filtrate_radio">年龄</el-radio>
                <el-radio :label="6" class="filtrate_radio">年级</el-radio>
                <el-radio :label="9" class="filtrate_radio">健康问题</el-radio>
            </el-radio-group>
        </div>
        <div class="fl">
            <div class="drop_down">
                <!-- <span>年龄</span> -->
                <el-select
                    :disabled="radio == 3?false:true"
                    v-model="Age"
                    multiple
                    collapse-tags
                    @visible-change="pullDownChange(Age,'Age')"
                    placeholder="请选择年龄">
                    <el-option
                    v-for="item in $store.state.pushAgeData"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
                <span class="sex">性别</span>
                <el-select
                    :disabled="radio == 3?false:true"
                    v-model="ageSex"
                    multiple
                    collapse-tags
                    @visible-change="pullDownChange(ageSex,'ageSex')"
                    placeholder="请选择性别">
                    <el-option
                    v-for="item in $store.state.sexData"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <div class="drop_down">
                <!-- <span>年级</span> -->
                <el-select
                    :disabled="radio == 6?false:true"
                    v-model="Class"
                    multiple
                    collapse-tags
                    @visible-change="pullDownChange(Class,'Class')"
                    placeholder="请选择年级">
                    <el-option
                    v-for="item in classData"
                    :key="item.code"
                    :label="item.name"
                    :value="item.code">
                    </el-option>
                </el-select>
                <span class="sex">性别</span>
                <el-select
                    :disabled="radio == 6?false:true"
                    v-model="classSex"
                    multiple
                    collapse-tags
                    @visible-change="pullDownChange(classSex,'classSex')"
                    placeholder="请选择性别签">
                    <el-option
                    v-for="item in $store.state.sexData"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <div class="drop_down">
                <!-- <span>健康问题</span> -->
                <el-cascader
                    :disabled="radio == 9?false:true"
                    style="width:300px;"
                    ref="cascader"
                    :options="options"
                    :props="configuration"
                    v-model="selectedOptions"
                    @change="pullDownChange(selectedOptions,'selectedOptions')"
                    placeholder="请选择健康问题">
                </el-cascader>
                <i class="el-icon-circle-plus-outline filtrate_add" @click="addHealthProblem"></i>
                <div v-if="health.length" class="healthbox">
                    <span class="checkboxNum">你已选择{{health.length}}个健康问题</span>
                    <span  v-for="(key,index) in health" :key="index">
                        <span class="addtarget">{{key.text}}</span><i class="el-icon-remove-outline" @click="del(index)"></i>
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>
<style lang="scss">
.filtrate{
    .filtrate_radio{
        display:block;
        margin:0!important;
        padding:20px 20px 20px 20px;
    }
    .drop_down{
        padding: 8px 8px 8px 0px;
        .sex{
          margin-left: 30px;
        }
        .healthbox{
            width: 800px;
            position: relative;
            .checkboxNum{
                position: absolute;
                top:20px;
                left: -170px;
            }
            .addtarget{
                display:inline-block;
                width: 300px;
                background: #fff;
                text-align: center;
                line-height: 42px;
                margin:10px 6px 0px 0px;
                border-radius: 5px;
            }
            .el-icon-remove-outline{
                margin-right: 20px;
            }
        }
    }
    // .drop_down:nth-child(-n+2){
    //   margin-left: 32px;
    // }
    .filtrate_add{
        font-size: 16px;
    }
}
</style>
<script>
import http from '@/utils/HttpClient';
export default {
    data(){
        return {
            Age:[],
            ageSex:[],
            Class:[],
            classSex:[],
            radio:[],
            classData:[],
            options: [],
            configuration:{
                value:'id',
                label:'name',
                children:'children'
            },

            selectedOptions: [],
            health:[]
        }
    },
    methods:{
        radioChange(event){
            this.$emit('radioType', {radioTarget: event});
            if(event != 3){
                this.Age = []
                this.ageSex = []
            }
            if(event != 6){
                this.Class = []
                this.classSex = []
            }   
            if(event != 9){
                this.selectedOptions = []
                this.health = []
            }
        },
        pullDownChange(value,type) {

            this.$emit('multiple', {multipleCondition: {value:value,type:type}});

        },
        del(idx){
            // console.log(idx);
            this.health.splice(idx,1);
        },
        addHealthProblem(){
            // console.log(this.selectedOptions);
            if(this.selectedOptions.length=='0'){
                this.$message('请先选择康健问题后再添加');
            }else{
                let healthTarget = this.$refs.cascader.$el.querySelector('input').getAttribute('value')
                // console.log(this.$refs.cascader.$el.querySelector('input').getAttribute('value'))
                if(JSON.stringify(this.health).indexOf(healthTarget)>=0){
                    this.$message('该康健问题已存在');
                }else{
                    let healthString = this.selectedOptions.join(',');
                    // console.log(healthString);
                    this.health.push({text:healthTarget,code:healthString});
                }
            }
        },
        getClass(){
            http.get('/api/auth/v1/common/getPushClass').then(res=>{
                if(res.status.code == 0){
                    this.classData = res.data;
                    // console.log(this.classData);
                }else{
                    this.$store.commit('responseStatus',{'self':this,'data':res.status})
                }
            }).catch(error=>{
                this.$store.commit('error',{'self':this,'data':error})
            })
        },
        dropDownList(){
            http.get('/api/auth/v1/diseaseClassify').then(res=>{
                if(res.status.code == 0){
                    this.options = res.data;
                    for(let key of this.options){
                        if(key.children.length>=1){
                            for(let item of key.children){
                                if(item.children.length>=1){
                                    for(let keys of item.children){
                                        if(keys.children.length<=0){
                                            delete keys.children
                                        }
                                    }
                                }else{
                                    delete item.children
                                }
                            }
                        }else{
                            delete key.children;
                        }
                    }
                }else{
                    this.$store.commit('responseStatus',{'self':this,'data':res.status})
                }
            }).catch(error=>{
                this.$store.commit('error',{'self':this,'data':error})
            })
        }
    },
    mounted(){
        this.dropDownList();
        this.getClass();
    }
}
</script>
