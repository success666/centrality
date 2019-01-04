<template>
    <div>
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pageNum"
            :page-sizes="[5, 10, 20, 50, 100]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
        </el-pagination>
    </div>
</template>

<style>

</style>

<script>
export default {
    data(){
        return{

        }
    },
    props: ['pageNum', 'pageSize', 'total'],
    methods:{
         handleSizeChange(val) {
            // console.log(`每页 ${val} 条`);
            this.$emit('current', {currentSize: val});
             
        },
        handleCurrentChange(val) {
            // console.log(`当前页: ${val}`);
            this.$emit('current', {currentPage: val});
            
        },
    }
}
</script>
