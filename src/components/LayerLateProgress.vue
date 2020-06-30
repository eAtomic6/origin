<template>
  <div>
    <!-- 后期进度弹层 -->
    <el-dialog
      :title="getTitle"
      :close-on-click-modal="$tool.closeOnClickModal"
      :close-on-press-escape="$tool.closeOnClickModal"
      :visible.sync="layerShow"
      width="1000px"
      class="layer-paper layer-scroll-auto"
    >
      <LayerScrollAuto>
        <div class="layer-progress">
          <ul class="ul">
            <li>
              <span class="cl-2 mr-30">{{layerShowData.transFlowName}}</span>
            </li>
            <li>
              <span class="cl-1 mr-10">佣金结算状态：</span>
              <span class="cl-2">{{layerShowData.statusReceiveAmount.label}}</span>
            </li>
          </ul>
          <el-table
            border
            v-loading="loading"
            :data="tableProgress"
            :formatter="nullFormatter"
            class="paper-table mt-20"
          >
            <el-table-column label="步骤类型" align="center" min-width="120px">
              <template slot-scope="scope">
                <span
                  :class="scope.row.isOvertime.value === ISOVERTIME?'red':'cl-2'"
                >{{getDataVal(scope.row.transactionStepsType)}}</span>
              </template>
            </el-table-column>
            <el-table-column label="步骤名称" align="center" min-width="120px">
              <template slot-scope="scope">
                <span
                  :class="scope.row.isOvertime.value === ISOVERTIME?'red':'cl-2'"
                >{{getDataVal(scope.row.transactionSteps)}}</span>
              </template>
            </el-table-column>
            <el-table-column label="结算百分比" align="center">
              <template slot-scope="scope">
                <span
                  :class="scope.row.isOvertime.value === ISOVERTIME?'red':'cl-2'"
                >{{percentageFn(scope.row.settlePercent)}}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作人" align="center">
              <template slot-scope="scope">
                <span
                  :class="scope.row.isOvertime.value === ISOVERTIME?'red':'cl-2'"
                >{{getDataVal(scope.row.operatorName)}}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作日期" align="center">
              <template slot-scope="scope">
                <span
                  :class="scope.row.isOvertime.value === ISOVERTIME?'red':'cl-2'"
                >{{dateFormat(scope.row.operationTime)}}</span>
              </template>
            </el-table-column>
            <el-table-column label="责任人" align="center">
              <template slot-scope="scope">
                <span
                  :class="scope.row.isOvertime.value === ISOVERTIME?'red':'cl-2'"
                >{{getDataVal(scope.row.personLiableName)}}</span>
              </template>
            </el-table-column>
            <el-table-column label="确定日期" align="center">
              <template slot-scope="scope">
                <span
                  :class="scope.row.isOvertime.value === ISOVERTIME?'red':'cl-2'"
                >{{dateFormat(scope.row.endDatetime)}}</span>
              </template>
            </el-table-column>
            <el-table-column label="办理天数" align="center">
              <template slot-scope="scope">
                <span
                  :class="scope.row.isOvertime.value === ISOVERTIME?'red':'cl-2'"
                >{{getDataVal(scope.row.actualDay)}}</span>
              </template>
            </el-table-column>
            <el-table-column label="规定天数" align="center">
              <template slot-scope="scope">
                <span
                  :class="scope.row.isOvertime.value === ISOVERTIME?'red':'cl-2'"
                >{{getDataVal(scope.row.specifiedDay)}}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" min-width="120px" align="center">
              <template slot-scope="scope">
                <el-button
                  v-if="operationBoolFn(scope.row)"
                  @click="operationFn(scope.row.id,scope.row)"
                  class="blue"
                  type="text"
                >查看</el-button>
                <template v-else>--</template>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="line"></div>
      </LayerScrollAuto>
    </el-dialog>
    <!-- 查看 -->
    <el-dialog
      :close-on-click-modal="$tool.closeOnClickModal"
      :close-on-press-escape="$tool.closeOnClickModal"
      title="查看"
      :visible.sync="stepsDataShow"
      width="740px"
      class="layer-paper layer-scroll-auto handle-dialog"
    >
      <LayerScrollAuto>
        <div class="steps-from">
          <div class="select-title">
            <ul class="select-option" v-if="stepReportData.length>0">
              <li
                v-for="item in optionTab"
                :key="item.id"
                :class="[activeItem===item.id?'active':'']"
                @click="changeTab(item)"
              >{{item.name}}</li>
            </ul>
            <div class="stepsData-tit" v-else>查看</div>
          </div>
          <el-form
            ref="stepsFrom"
            :model="stepsFrom"
            v-loading.fullscreen.lock="LookStepLoad"
            label-width="150px"
            v-if="activeItem===1"
          >
            <el-form-item
              v-for="(item,index) in stepsFrom.list"
              :prop="'list.' + index + '.val'"
              :key="'bl'+item.id + index"
              :label="item.title+ '：'"
              :rules="item.rules"
            >
              <!-- 查看 -->
              <template
                v-if="item.type === STEPSINPUT.start || item.type === STEPSINPUT.time || item.type === STEPSINPUT.textarea || item.type === STEPSINPUT.num"
              >
                <div class="steps-see">{{item.val}}</div>
              </template>
              <template v-else>
                <ul class="steps-img">
                  <el-tooltip
                    class="item"
                    effect="dark"
                    :content="i.name"
                    placement="bottom"
                    v-for="(i,n) in item.val"
                    :key="i.name"
                  >
                    <li @click="previewPhoto(item.val,n)">
                      <img
                        class="suolue-img"
                        :src="i.path|getSignImage(preloadFiles)"
                        alt
                        v-if="isPictureFile(i.type)"
                        width="70%"
                      />
                      <div class="img" v-else>
                        <uploadCell :type="stepsTypeImg(item.type)"></uploadCell>
                      </div>
                      <p class="p">{{i.name}}</p>
                    </li>
                  </el-tooltip>
                </ul>
              </template>
            </el-form-item>
          </el-form>
          <div class="paper-table step-report-table" v-if="stepReportData.length>0&&activeItem===2">
            <!-- <div class="title">跟进记录：</div> -->
            <el-table border :data="stepReportData">
              <el-table-column align="center" label="跟进人" prop="reportingtor"></el-table-column>
              <el-table-column align="center" label="跟进时间">
                <template slot-scope="scope">{{dateFormat(scope.row.reportingDate)}}</template>
              </el-table-column>
              <el-table-column
                align="center"
                label="日志内容"
                prop="reportingRemake"
                :formatter="nullFormatterData"
              ></el-table-column>
            </el-table>
          </div>
          <!-- 预览 -->
          <preview
            :imgList="previewFiles"
            :start="previewIndex"
            v-if="preview"
            @close="preview=false"
          ></preview>
          <div class="evaluation">
            <p class="p1">评价信息：</p>
            <ul class="ul">
              <li class="li cl-000" style="font-size:20px;width:100%;">
                <em>步骤名称：</em>{{getDataVal(lookRowVal.transactionSteps)}}
              </li>
            </ul>
            <ul class="ul">
              <li class="li" style="width:100%;">
                <em class="cl-999">负责人：</em>{{getDataVal(lookRowVal.personLiableName)}}
              </li>
            </ul>
            <div class="p2">
              <span class="cl-999">专业度</span>
              <i class="el-icon-star-on" :class="evaluateInfo.Professionalism >=1?'on':''"></i>
              <i class="el-icon-star-on" :class="evaluateInfo.Professionalism >=2?'on':''"></i>
              <i class="el-icon-star-on" :class="evaluateInfo.Professionalism >=3?'on':''"></i>
              <i class="el-icon-star-on" :class="evaluateInfo.Professionalism >=4?'on':''"></i>
              <i class="el-icon-star-on" :class="evaluateInfo.Professionalism >=5?'on':''"></i>
            </div>
            <div class="p2">
              <span class="cl-999">友善度</span>
              <i class="el-icon-star-on" :class="evaluateInfo.Friendliness >=1?'on':''"></i>
              <i class="el-icon-star-on" :class="evaluateInfo.Friendliness >=2?'on':''"></i>
              <i class="el-icon-star-on" :class="evaluateInfo.Friendliness >=3?'on':''"></i>
              <i class="el-icon-star-on" :class="evaluateInfo.Friendliness >=4?'on':''"></i>
              <i class="el-icon-star-on" :class="evaluateInfo.Friendliness >=5?'on':''"></i>
            </div>
            <div class="p2">
              <span class="cl-999">响应度</span>
              <i class="el-icon-star-on" :class="evaluateInfo.Responsiveness >=1?'on':''"></i>
              <i class="el-icon-star-on" :class="evaluateInfo.Responsiveness >=2?'on':''"></i>
              <i class="el-icon-star-on" :class="evaluateInfo.Responsiveness >=3?'on':''"></i>
              <i class="el-icon-star-on" :class="evaluateInfo.Responsiveness >=4?'on':''"></i>
              <i class="el-icon-star-on" :class="evaluateInfo.Responsiveness >=5?'on':''"></i>
            </div>
            <div class="p3">评价内容：{{evaluateInfo.Content?evaluateInfo.Content:"无"}}</div>
          </div>
        </div>
      </LayerScrollAuto>
    </el-dialog>
  </div>
</template>

<script>
import { FILTER } from "@/assets/js/filter";
import { TOOL } from "@/assets/js/common";
import { MIXINS } from "@/assets/js/mixins";
import LayerScrollAuto from "@/components/LayerScrollAuto";

// 是否超时
const ISOVERTIME = 1;
// 办理输入框
const STEPSINPUT = {
  start: 0, //input 文本输入框
  num: 1, //input number类型
  time: 2, //时间选择
  img: 3, //图片
  mp4: 4, //视频
  pdf: 5, //pdf文件
  excel: 6, //表格
  word: 7, //文档
  textarea: 8 //文本框输入
};
// 操作状态
const OPERATION = TOOL.OPERATION;

export default {
  mixins: [FILTER, MIXINS],
  data() {
    return {
      OPERATION,
      // 显示隐藏
      layerShow: false,
      // 后期进度列表
      tableProgress: [],
      // 是否超时
      ISOVERTIME,
      layerShowData: {
        statusReceiveAmount: {
          label: ""
        }
      },
      // 加载
      loading: false,
      // 查看
      STEPSINPUT,
      stepsDataShow: false,
      LookStepLoad: false,
      stepsFrom: {
        list: [],
        id: ""
      },
      stepReportData: [],
      optionTab: [
        {
          id: 1,
          name: "查看"
        },
        {
          id: 2,
          name: "跟进记录"
        }
      ],
      activeItem: 1,
      preloadFiles: [],
      evaluateInfo: {},
      Friendliness: 1,
      Professionalism: 3,
      Responsiveness: 5,
      lookRowVal: {}
    };
  },
  props: {
    title: {
      type: String,
      default: ""
    }
  },
  computed: {
    getTitle() {
      return this.title;
    }
  },
  methods: {
    // 百分比转换
    percentageFn(val) {
      if (val > 0) {
        return `${val}%`;
      } else {
        return "--";
      }
    },
    operationBoolFn(row) {
      if (!row.stepState) {
        return false;
      }
      let val = row.stepState.value;
      if (
        val === OPERATION.start ||
        val === OPERATION.sure ||
        val === OPERATION.amend
      ) {
        return true;
      } else {
        return false;
      }
    },
    // 时间处理
    dateFormat(val) {
      return TOOL.dateFormat(val);
    },
    // 后期进度获取数据
    lateProgressFn() {
      this.$ajax
        .get("/api/postSigning/getLastStepList", {
          id: this.layerShowData.id
        })
        .then(res => {
          res = res.data;
          if (res.status === 200) {
            this.tableProgress = res.data;
          }
          this.$nextTick(() => {
            this.loading = false;
          });
        })
        .catch(err => {
          this.$message.error(err);
          this.$nextTick(() => {
            this.loading = false;
          });
        });
    },
    show(data) {
      this.loading = true;
      this.layerShow = true;
      this.layerShowData = data;
      this.lateProgressFn();
    },
    hid() {
      this.layerShow = false;
    },
    changeTab(item) {
      this.activeItem = item.id;
    },
    // 查看
    operationFn(id, val) {
      this.getLookStepFn(id);
      this.lookRowVal = val;
    },
    getLookStepFn(id) {
      this.LookStepLoad = true;
      this.activeItem = 1;
      this.$ajax
        .get("/api/postSigning/lookStep", {
          id
        })
        .then(res => {
          res = res.data;
          if (res.status === 200) {
            let resData = res.data;
            let arr = [...resData.transAtepsAttach];
            this.stepReportData = resData.stepReportings
              ? [...resData.stepReportings]
              : [];
            console.log("7777");
            console.log(resData.evaluateInfo);
            resData.evaluateInfo
              ? (this.evaluateInfo = resData.evaluateInfo)
              : (this.evaluateInfo = {});
            let arr2 = [
              {
                val: this.dateFormat(resData.handleDatetime),
                title: "办理日期",
                isRequired: true,
                type: 2,
                id: "bj" + resData.id + 1,
                rules: {
                  required: true,
                  message: `请输入办理日期`
                }
              },
              {
                val: resData.remarks,
                title: "备注",
                isRequired: false,
                type: 8,
                id: "bj" + resData.id + 2,
                rules: {
                  required: false
                }
              }
            ];

            arr.map(e => {
              let j = {};
              if (
                e.type === STEPSINPUT.start ||
                e.type === STEPSINPUT.time ||
                e.type === STEPSINPUT.textarea ||
                e.type === STEPSINPUT.num
              ) {
                e.val = e.value;
                j.message = `请输入${e.title}`;
              } else {
                if (e.value) {
                  e.val = this.$tool.cutFilePath(e.value.split(","));
                } else {
                  e.val = [];
                }
                j.message = `请上传${e.title}`;
              }
              if (e.isRequired) {
                j.required = true;
                j.trigger = "blur";
              } else {
                j.required = false;
              }
              e.rules = j;
            });
            this.stepsFrom = {
              list: [...arr, ...arr2],
              id: resData.id
            };
            this.$nextTick(() => {
              this.LookStepLoad = false;
            });
            this.stepsDataShow = true;
            if (this.$refs.stepsFrom != undefined)
              this.$refs.stepsFrom.resetFields();
            let preloadList = [];
            resData.transAtepsAttach.forEach(e => {
              if (e.type == 3) {
                e.val.forEach(t => {
                  if (this.isPictureFile(t.type)) {
                    preloadList.push(t.path);
                  }
                });
              }
            });
            if (preloadList.length) {
              this.fileSign(preloadList, "preload").then(res => {
                this.preloadFiles = res;
              });
            }
          }
        })
        .catch(err => {
          this.$nextTick(() => {
            this.LookStepLoad = false;
          });
          this.$message.error(err);
        });
    },
    // 图片格式状态判定
    stepsTypeImg(type) {
      switch (type) {
        case STEPSINPUT.img:
          return ".png";
          break;
        case STEPSINPUT.mp4:
          return ".mp4";
          break;
        default:
          return ".doc";
          break;
      }
    },
    // 点击眼睛
    eyeClickFn() {
      console.log(222);
    }
  },
  components: {
    LayerScrollAuto
  }
};
</script>

<style scoped lang="less">
@import "~@/assets/common.less";
@import "~@/assets/less/lsx.less";
.blue {
  color: @color-blue;
}
.mr-30 {
  margin-right: 30px;
}
.mt-20 {
  margin-top: 20px;
}
.red {
  color: #ff3e3e;
}
.cl-2 {
  color: #233241;
}
// 弹层
.layer-paper {
  /deep/.el-dialog__body {
    padding: 0;
  }
  /deep/.el-dialog__header {
    padding: 20px;
    border-bottom: 1px solid #edecf0;
  }
  /deep/.el-dialog__headerbtn {
    font-size: 26px;
  }
}
// 列表
.paper-table {
  // width: 100%;
  /deep/.el-table__header-wrapper,
  /deep/.el-table__fixed-header-wrapper {
    border-radius: 4px;
    overflow: hidden;
  }
  /deep/.el-table__header th {
    background-color: #eef2fb;
    line-height: 30px;
    color: #6c7986;
  }
  /deep/&.el-table td {
    padding: 25px 0;
  }
  /deep/&.el-table td:last-child > .cell {
    padding-right: 0;
  }
  .line {
    background-color: #e5e4ea;
    display: inline-block;
    height: 14px;
    width: 1px;
    margin: 0 6px;
    position: relative;
    top: 3px;
  }
}
// 后期进度弹层
.layer-progress {
  padding: 20px 20px 30px;
  line-height: 36px;
  .ul {
    display: flex;
  }
  .ul-line {
    line-height: 36px;
  }
  /deep/.paper-table.el-table td {
    padding: 15px 0;
  }
}
// 查看
.steps-from {
  padding: 20px 20px 40px 0;
}
.steps-img {
  overflow: hidden;
  > li {
    float: left;
    margin-left: 12px;
    margin-top: 10px;
    width: 120px;
    height: 120px;
    position: relative;
    border-radius: 4px;
    &:first-child {
      margin-left: 0;
    }
    .icon-tubiao-6 {
      display: none;
      position: absolute;
      right: 3px;
      top: -5px;
      font-size: 22px;
      color: #f56c6c;
      cursor: pointer;
      &::before {
        position: relative;
        z-index: 1;
      }
      &::after {
        content: "";
        position: absolute;
        left: 6px;
        right: 6px;
        top: 10px;
        bottom: 10px;
        background-color: #fff;
        border-radius: 50%;
      }
    }
    > .img {
      position: relative;
      top: 35px;
      left: 30px;
    }
    > .p {
      position: absolute;
      bottom: 6px;
      line-height: 20px;
      left: 0;
      right: 0;
      height: 20px;
      overflow: hidden;
      text-align: center;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    &:hover {
      background-color: #f2f3f8;
      .icon-tubiao-6 {
        display: block;
      }
    }
  }
}
.line {
  height: 20px;
  background-color: #f5f5f5;
}
.evaluation {
  padding: 0 20px 20px;
  .cl-999 {
    color: #999;
  }
  .p1 {
    font-size: 16px;
    color: #333;
    line-height: 30px;
    padding: 20px 0 8px;
  }
  .ul {
    display: flex;
    height: 36px;
    align-items: center;
    .li {
      width: 140px;
      margin-right: 30px;
      height: 100%;
      display: flex;
      align-items: center;
      line-height: 36px;
    }

    .el-icon-view {
      padding: 0 10px;
      cursor: pointer;
    }
  }
  .p2 {
    display: flex;
    height: 36px;
    align-items: center;
    .el-icon-star-on {
      font-size: 16px;
      padding-left: 10px;
      padding-right: 5px;
      color: #999;
      &.on {
        color: #ffc345;
      }
    }
  }
  .p3 {
    color: #666;
    line-height: 36px;
  }
}
</style>