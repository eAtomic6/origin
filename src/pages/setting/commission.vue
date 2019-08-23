<template>
    <div ref="tableComView">
        <ScreeningTop @propQueryFn="queryFn" @propResetFormFn="resetFormFn">
            <div class="content">
                <div>
                    <label>体系</label>
                    <el-select size="small" class="w300" v-model="systemTag">
                        <el-option v-for="item in systemTagList" :key="item.key" :label="item.value" :value="item.key"></el-option>
                    </el-select>
                </div>
                <div>
                    <label>设置时间</label>
                    <el-date-picker
                    size="small"
                    v-model="settingTime"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    value-format="yyyy-MM-dd">
                    </el-date-picker>
                </div>
                <div>
                    <label>最新修改时间</label>
                    <el-date-picker
                    size="small"
                    v-model="updateTime"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    value-format="yyyy-MM-dd">
                    </el-date-picker>
                </div>
            </div>
        </ScreeningTop>
        <!-- table表格 -->
        <div class="table-box">
            <p v-if="power['sign-set-sxf'].state">
                <span><i class="iconfont icon-tubiao-11 mr-8"></i>数据列表</span>
                <el-button icon="el-icon-plus" @click="openFn(1)" round type="primary">新增手续费</el-button>
            </p>
            <el-table
            :data="list"
            style="width: 100%"
            border
            ref="tableCom"
            :max-height="tableNumberCom">
                <el-table-column align="center" label="体系" prop="systemTag">
                    <template slot-scope="scope">
                        <span v-for="item in systemTagList" :key="item.key" v-if="item.key===scope.row.systemTag">{{item.value}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="收佣手续费" width="350">
                    <template slot-scope="scope">
                        <span :class="i!=scope.row.commissionFee.length-1?'mr-10':''" v-for="(item,i) in scope.row.commissionFee" :key="i">{{addSignFn(item.payType.label,item.fee)}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="分账/付款手续费" width="350">
                    <template slot-scope="scope">
                        <span :class="i!=scope.row.sepaFee.length-1?'mr-10':''" v-for="(item,i) in scope.row.sepaFee" :key="i">{{addTextFn(item.accountType.label,item.feeMoney)}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="设置时间" prop="settingTime">
                    <template slot-scope="scope">{{scope.row.settingTime|formatTime}}</template>
                </el-table-column>
                <el-table-column align="center" label="最新修改时间" prop="updateTime">
                    <template slot-scope="scope">{{scope.row.updateTime|formatTime}}</template>
                </el-table-column>
                <el-table-column align="center" label="操作">
                    <template slot-scope="scope">
                        <el-button type="text" @click="openFn(2,scope.row)">编辑</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
    import {FILTER} from "@/assets/js/filter";
    import {MIXINS} from "@/assets/js/mixins";
    export default {
        name: "commission",
        mixins: [MIXINS, FILTER],
        data() {
            return {
                systemTag: '',
                settingTime: [],
                updateTime: [],
                list: [],
                power: {
                    'sign-set-sxf': {
                        name: '查询',
                        state: false
                    }
                }
            }
        },
        created() {
            // 获取体系
            this.getSystemTag()
            let res = this.getDataList
            if(res&&(res.route === this.$route.path)){
                this.list = res.data
                let session = JSON.parse(sessionStorage.getItem('sessionQuery'))
                let query = session.query
                this.systemTag = query.systemTag
                this.settingTime = query.settingTimeStart ? [query.settingTimeStart,query.settingTimeEnd] : []
                this.updateTime = query.updateTimeStart ? [query.updateTimeStart,query.updateTimeEnd] : []
            }else{
                // 列表查询
                this.getData()  
            }
        },
        methods: {
            addSignFn(n,i) {
                return `${n}${i}%`
            },
            addTextFn(n,i) {
                return `${n}${i}元/笔`
            },
            // 列表
            getData(type='init') {
                let bool1 = this.settingTime!=null&&this.settingTime.length
                let bool2 = this.updateTime!=null&&this.updateTime.length
                let param = {
                    cityId: this.userInfo.cityId,
                    systemTag: this.systemTag,
                    settingTimeStart: bool1 ? this.settingTime[0] : '',
                    settingTimeEnd: bool1 ? this.settingTime[1] : '',
                    updateTimeStart: bool2 ? this.updateTime[0] : '',
                    updateTimeEnd: bool2 ? this.updateTime[1] : ''
                }

                //点击查询时，缓存筛选条件
                if(type==='search'){
                    sessionStorage.setItem('sessionQuery',JSON.stringify({
                        path:'/commission',
                        url:'/feesetting/operateQry',
                        query:param
                    }))
                }

                this.$ajax.get('/api/feesetting/operateQry',
                    param
                ).then(res => {
                    res = res.data
                    if(res.status === 200) {
                        this.list = res.data
                    }
                }).catch(err=>{
                    this.$message({message:err})
                })
            },
            openFn(type,row) {
                this.setPath(this.getPath.concat({name: type===1?'新增手续费':'编辑手续费'}))
                this.$router.push({
                    path: 'commissionDialog',
                    query: {
                        type
                    }
                })
                if(type===2){
                    localStorage.setItem('row',JSON.stringify(row))
                }
            },
            // 查询
            queryFn() {
                this.getData('search')
            },
            // 重置
            resetFormFn() {
                this.systemTag = ''
                this.settingTime = []
                this.updateTime = []
            }
        },
        computed: {
            userInfo(){
                return this.getUser.user
            }
        }
    }
</script>

<style lang="less" scoped>
    @import "~@/assets/common.less";
    .content {
        display: flex;
        padding-bottom: 10px;
        >div {
            margin-right: 20px;
            >label {
                margin-right: 5px;
            }
        }
    }
    .table-box {
        background-color: #fff;
        padding: 0 10px;
        margin-top: 20px;
        > p {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 5px;
            font-size: @size-14;
            .mr-8 {
                margin-right: 8px;
            }
            > .el-button {
                width:120px;
                padding: 9px 15px;
                display: flex;
                justify-content: center;
                color: #fff;
            }
        }
        .mr-10 {
            margin-right: 10px;
        }
    }
    /deep/ .el-table th {
        background: @bg-th;
    }
</style>
