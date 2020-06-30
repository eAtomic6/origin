import Vue from 'vue'
import Router from 'vue-router'
// 模块懒加载

const Index = () => import("@/pages/Index");

//设置模块
const contractTemplate = () => import('@/pages/setting/contractTemplate')
const contraPreview = () => import('@/pages/setting/contraPreview')

const postProcess = () => import('@/pages/setting/postProcess')
const Company = () => import('@/pages/setting/company')
const moneyType = () => import('@/pages/setting/moneyType')
const ruleSetting = () => import('@/pages/setting/ruleSetting')
const operationLog = () => import('@/pages/setting/operationLog')
const approvalProcess = () => import('@/pages/setting/approvalProcess')
const commission = () => import('@/pages/setting/commission')
const commissionOff = () => import('@/pages/setting/commissionOff')

//票据管理
const paperSet = () => import('@/pages/finance/paperSet')

// 签后
const postManage = () => import('@/pages/postSigning/postManage')
const postMonitor = () => import('@/pages/postSigning/postMonitor')
const postReceive = () => import('@/pages/postSigning/postReceive')

//业绩模块
const actualAchievement = () => import('@/pages/achievement/actualAchievement')
const receivableAchievement = () => import('@/pages/achievement/receivableAchievement')
const storeReceive = () => import('@/pages/achievement/storeReceive.vue')
const achPage = () => import('@/pages/achievement/achPage')
const achDetial = () => import('@/pages/achievement/achDetial')
const achAppeal = () => import('@/pages/achievement/achAppeal')
const aplPage = () => import('@/pages/achievement/aplPage')
const storePage = () => import('@/pages/achievement/storePage')

const actualHarvest = () => import('@/pages/finance/actualHarvest')
const moneyCheck = () => import('@/pages/finance/moneyCheck')
const Bill = () => import('@/pages/finance/bill')
const billDetails = () => import('@/pages/finance/billDetails')
const payBill = () => import('@/pages/finance/payBill')
const payResult = () => import('@/pages/finance/payResult')
const receiptBill = () => import('@/pages/finance/receiptBill')
const receiptResult = () => import('@/pages/finance/receiptResult')
const receiptCheck = () => import('@/pages/finance/receiptCheck')
const receiptBill_simple = () => import('@/pages/finance/receiptBill_simple')
const receiptBillDetails = () => import('@/pages/finance/receiptBillDetails')

// 合同模块
const newIntention = () => import("@/pages/contract/contractList/newIntention")
// const editIntention = () => import("@/pages/contract/contractList/editIntention")
const detailIntention = () => import("@/pages/contract/contractList/detailIntention")
const adjustCheck = () => import("@/pages/contract/contractList/adjustCheck");
const settleCheck = () => import("@/pages/contract/contractList/settleCheck");
const contractList = () => import("@/pages/contract/contractList/contractList")
const addContract = () => import("@/pages/contract/contractList/addContract")
const contractDetails = () => import("@/pages/contract/contractList/contractDetails")
const contractPreview = () => import("@/pages/contract/contractList/contractPreview")
// const layerAudit = () => import("@/pages/contract/contractDialog/layerAudit");
// const layerSettle = () => import("@/pages/contract/contractDialog/layerSettle");
// const changeCancel = () => import("@/pages/contract/contractDialog/changeCancel");
const routingRecord = () => import("@/pages/contract/contractList/routingRecord");
const contractCheck = () => import("@/pages/contract/contractList/contractCheck");
const debitRecord = () => import("@/pages/contract/contractList/debitRecord");
const routingRemitDetail = () => import("@/pages/contract/contractList/routingRemitDetail");
const extendParams = () => import("@/pages/contract/contractList/extendParams");
//其他类型合同
const otherContractList = () => import("@/pages/contract/otherContract/otherContractList")
const addOtherContract = () => import("@/pages/contract/otherContract/addOtherContract")
const otherContractDetail = () => import("@/pages/contract/otherContract/otherContractDetail")
//变更解约审核
const changeCheck = () => import("@/pages/contract/contractList/changeCheck")
const cancelCheck = () => import("@/pages/contract/contractList/cancelCheck")
//合同主体签后审核
const signedCheck = () => import("@/pages/contract/contractList/signedCheck")

const Login = () => import("@/login")
const iframTest = () => import("@/pages/iframe/iframeTest")

//记账本
const ledger = () => import("@/pages/ledger/ledgerDetails")
const errorMsg = () => import("@/errorMsg")

// Vue.use(Router)

export default new Router({
  routes: [{
      path: "/",
      component: Index,
      redirect: "/login",
      children: [
        // 设置模块
        {
          path: "contractTemplate",
          component: contractTemplate,
          meta: {
            root: true,
            list: ["设置", "后台设置", "合同模板设置"]
          }
        },
        {
          path: "contraPreview",
          component: contraPreview
        },
        {
          path: "postProcess",
          component: postProcess,
          meta: {
            root: true,
            list: ["设置", "业务设置", "后期流程设置"]
          }
        },
        {
          path: "company",
          component: Company,
          meta: {
            root: true,
            list: ["设置", "业务设置", "公司设置"]
          }
        },
        {
          path: "moneyType",
          component: moneyType,
          meta: {
            root: true,
            list: ["设置", "后台设置", "款类设置"]
          }
        },
        {
          path: "ruleSetting",
          component: ruleSetting,
          meta: {
            root: true,
            list: ["设置", "业务设置", "规则设置"]
          }
        },
        {
          path: "approvalProcess",
          component: approvalProcess,
          meta: {
            root: true,
            list: ["设置", "业务设置", "审核流程"]
          }
        },
        {
          path: "commission",
          component: commission,
          meta: {
            root: true,
            list: ["手续费设置"]
          }
        },
        {
          path: "commissionOff",
          component: commissionOff,
          meta: {
            root: true,
            list: ["设置", "后台设置", "线下手续费设置"]
          }
        },
        //设置模块 end
        //操作模块 start
        {
          path: "operationLog",
          component: operationLog,
          meta: {
            root: true,
            list: ["操作日志"]
          }
        },
        //操作模块 end
        // 票据管理
        {
          path: "paperSet",
          component: paperSet,
          meta: {
            root: true,
            list: ["二手房", "财务", "票据管理"]
          }
        },
        //分账记录
        {
          path: "routingRecord",
          component: routingRecord,
          meta: {
            root: true,
            list: ["二手房", "财务", "分账记录"]
          }
        },
        //打款记录
        {
          path: "debitRecord",
          component: debitRecord,
          meta: {
            root: true,
            list: ["二手房", "财务", "打款记录"]
          }
        },
        {
          path: "actualHarvest",
          component: actualHarvest,
          meta: {
            root: true,
            list: ["二手房", "财务", "应收实收"]
          }
        },
        {
          path: "moneyCheck",
          component: moneyCheck,
          meta: {
            root: true
          }
        },
        {
          path: "receiptCheck",
          component: receiptCheck,
          meta: {
            root: true,
            list: ["财务", "收款审核"]
          }
        },
        // 业绩板块
        {
          path: "actualAchievement",
          component: actualAchievement,
          meta: {
            root: true,
            list: ["二手房", "业绩", "应收业绩"]
          }
        },
        {
          path: "achAppeal",
          component: achAppeal,
          meta: {
            root: true,
            list: ["二手房", "业绩", "业绩申诉审核"]
          }
        },
        {
          path: "achPage",
          component: achPage,
        },
        {
          path: "aplPage",
          component: aplPage,
        },
        {
          path: "storePage",
          component: storePage,
        },
        {
          path: "achDetial",
          component: achDetial,
        },
        {
          path: "receivableAchievement",
          component: receivableAchievement,
          meta: {
            root: true,
            list: ["二手房", "业绩", "结算业绩"]
          }
        },
        {
          path: "storeReceive",
          component: storeReceive,
          meta: {
            root: true,
            list: ["二手房", "业绩", "业绩报表"]
          }
        },
        // 业绩板块 end
        {
          path: "Bill",
          component: Bill,
          meta: {
            root: true,
            list: ["二手房", "财务", "收付款单"]
          }
        },
        {
          path: "billDetails",
          component: billDetails,
          meta: {
            getParent: true
          }
        },
        // 合同——合同列表——新增意向金
        {
          path: "newIntention",
          component: newIntention
          // meta: {
          //   root: true,
          //   list: ['合同', '新增合同']
          // }
        },
        {
          path: "detailIntention",
          component: detailIntention
          // meta: {
          //   root: true,
          //   list: ['合同', '合同列表', '合同详情']
          // }
        },
        {
          path: "adjustCheck",
          component: adjustCheck,
          meta: {
            root: true,
            list: ["二手房", "合同", "调佣审核"]
          }
        },
        {
          path: "settleCheck",
          component: settleCheck,
          meta: {
            root: true,
            list: ["二手房", "合同", "结算审核"]
          }
        },
        {
          path: "payBill",
          component: payBill,
          meta: {
            getParent: true
          }
        },
        {
          path: "payResult",
          component: payResult
        },
        {
          path: "receiptBill",
          component: receiptBill,
          meta: {
            getParent: true
          }
        },
        {
          path: "receiptBill_simple",
          component: receiptBill_simple,
          meta: {
            getParent: true
          }
        },
        {
          path: "receiptBillDetails",
          component: receiptBillDetails,
          meta: {
            getParent: true
          }
        },
        {
          path: "receiptResult",
          component: receiptResult
        },
        {
          path: "contractList",
          component: contractList,
          meta: {
            root: true,
            list: ["二手房", "合同", "合同列表"]
          }
        },
        // 签后
        {
          path: "postReceive",
          component: postReceive,
          meta: {
            root: true,
            list: ["二手房", "签后", "后期接收"]
          }
        },
        {
          path: "postManage",
          component: postManage,
          meta: {
            root: true,
            list: ["二手房", "签后", "后期管理"]
          }
        },
        {
          path: "postMonitor",
          component: postMonitor,
          meta: {
            root: true,
            list: ["二手房", "签后", "后期监控"]
          }
        },
        //新增合同
        {
          path: "addContract",
          component: addContract
        },
        //合同详情
        {
          path: "contractDetails",
          component: contractDetails
        },
        //合同预览
        {
          path: "contractPreview",
          component: contractPreview
        },
        //合同审核
        {
          path: "contractCheck",
          component: contractCheck,
          meta: {
            root: true,
            list: ["二手房", "合同", "合同审核"]
          }
        },
        //合同主体审核
        {
          path: "signedCheck",
          component: signedCheck,
          meta: {
            root: true,
            list: ["二手房", "合同", "签后审核"]
          }
        },
        //变更解约审核
        {
          path: "changeCheck",
          component: changeCheck,
          meta: {
            root: true,
            list: ["二手房", "合同", "变更审核"]
          }
        },
        {
          path: "cancelCheck",
          component: cancelCheck,
          meta: {
            root: true,
            list: ["二手房", "合同", "解约审核"]
          }
        },
        //分账/打款详情
        {
          path: "routingRemitDetail",
          component: routingRemitDetail
        },
        //扩展参数
        {
          path: "extendParams",
          component: extendParams
        },
        {
          path: 'iframe',
          component: iframTest
        },
        //其他合同列表
        {
          path: "otherContractList",
          component: otherContractList,
          meta: {
            root: true,
            list: ["合同", "合同列表"]
          }
        },
        //新增
        {
          path: "addOtherContract",
          component: addOtherContract,
        },
        //详情
        {
          path: "otherContractDetail",
          component: otherContractDetail,
        },
      ]
    },
    {
      path: "/login",
      component: Login
    },
    {
      path: "/ledger",
      component: ledger
    },
    {
      path: "/error",
      component: errorMsg
    },
    {
      path: "/choseCont",
      component: resolve => require(["@/pages/contract/contractList/choseCont"], resolve)
    }
  ]
});
