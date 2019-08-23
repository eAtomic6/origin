let stepIndex = 0 //记录执行合并次数
let otherStep = 0 //除合并外，剩余行数

let TOOL = {
  pathList: [
    {
      id: 1,
      name: "合同",
      path: "1",
      icon: "icon-huaban",
      child: [
        {
          name: "合同列表",
          path: "contractList",
          code: "sign-ht-info-query"
        },
        {
          name: "合同审核",
          path: "contractCheck",
          code: "sign-ht-htsh-query"
        },
        {
          name: "调佣审核",
          path: "adjustCheck",
          code: "sign-ht-maid-query"
        },
        {
          name: "结算审核",
          path: "settleCheck",
          code: "sign-ht-js-query"
        }
      ]
    },
    {
      id: 2,
      name: "财务",
      path: "2",
      icon: "icon-huaban1",
      child: [
        {
          name: "收付款单",
          path: "Bill",
          code: "sign-cw-debt-query"
        },
        {
          name: "收款审核",
          path: "moneyCheck?type=1",
          code: "sign-cw-rev-query"
        },
        {
          name: "付款审核",
          path: "moneyCheck?type=2",
          code: "sign-cw-pay-query"
        },
        {
          name: "应收实收",
          path: "actualHarvest",
          code: "sign-cw-rec-query"
        },
        {
          name: "票据管理",
          path: "paperSet",
          code: "sign-cw-bill-query"
        },
        {
          name: '分账记录',
          path: 'routingRecord',
          code: 'sign-ht-fz-query'
        },
        {
          name: "打款记录",
          path: "debitRecord",
          code: "sign-ht-dk-query"
        }
      ]
    },
    {
      id: 3,
      name: "业绩",
      path: "3",
      icon: "icon-huaban4",
      child: [
        {
          name: "应收业绩",
          path: "actualAchievement",
          code: "sign-yj-rev-query"
        },
        {
          name: "结算业绩",
          path: "receivableAchievement",
          code: "sign-yj-rec-query"
        },
        {
          name: "业绩申诉审核",
          path: "achAppeal",
          code: "sign-yj-appeal-query"
        },
        // {
        //   name:'业绩报表',
        //   path:'storeReceive',
        //   code: "sign-yj-report-query"
        // }
      ]
    },
    {
      id: 4,
      name: "签后",
      path: "4",
      icon: "icon-huaban2",
      child: [
        {
          name: "后期接收",
          path: "postReceive",
          code: "sign-qh-rev-query"
        },
        {
          name: "后期管理",
          path: "postManage",
          code: "sign-qh-mgr-query"
        },
        {
          name: "后期监控",
          path: "postMonitor",
          code: "sign-qh-cont-query"
        }
      ]
    },
    {
      id: 5,
      name: "设置",
      path: "5",
      icon: "icon-huaban3",
      child: [
        {
          name: "公司设置",
          path: "company",
          code: "sign-set-gs"
        },
        {
          name: "合同模板设置",
          path: "contractTemplate",
          code: "sign-set-ht-query"
        },
        {
          name: "后期流程设置",
          path: "postProcess",
          code: "sign-set-hq"
        },
        {
          name: "款类设置",
          path: "moneyType",
          code: "sign-set-kl-query"
        },
        {
          name: "操作日志",
          path: "operationLog",
          code: "sign-set-log-query"
        },
        {
          name: "审核流程",
          path: "approvalProcess",
          code: "sign-set-verify"
        },
        {
          name: "低佣比例设置",
          path: "lowCommission",
          code: "sign-set-dybl"
        },
        {
          name: "手续费设置",
          path: "commission",
          code: "sign-set-sxf"
        },
        {
          name: "业绩申诉有效时间",
          path: "aplTime",
          code: "sign-set-vtime"
        },
      ]
    }
  ], //侧边栏导航
  closeOnClickModal: false,
  contType: {
    "4": 4, //意向金
    "5": 5 //定金
  },
  dropdown: {
    dateType: [
      {
        label: "开票日期",
        value: 1
      },
      {
        label: "作废日期",
        value: 2
      },
      {
        label: "核销日期",
        value: 3
      },
      {
        label: "回收日期",
        value: 4
      }
    ],
    dateType_money: [
      /*{
        label: '选择时间',
        value: 1
      },*/
      {
        label: "收款时间",
        value: 2
      },
      {
        label: "付款时间",
        value: 3
      },
      {
        label: "入账时间",
        value: 4
      }
    ]
  },
  // 操作状态
  OPERATION: {
    start: 1, //已办理
    backlog: 2, //待办理
    sure: 3, //需确认（代办）
    not: 4, //不可办理
    amend: 5 //修改
    // timeoutNot:5,    //超时未办
    // timeoutStart:6,    //超时已办
  },
  /**
   * 获取鼠标坐标
   * @param event
   * @returns {{x: number, y: number}}
   */
  getMousePos: function (event) {
    var e = event || window.event;
    var scrollX =
      document.documentElement.scrollLeft || document.body.scrollLeft;
    var scrollY = document.documentElement.scrollTop || document.body.scrollTop;
    var x = e.pageX || e.clientX + scrollX;
    var y = e.pageY || e.clientY + scrollY;

    return {
      x: x,
      y: y
    };
  },
  /**
   * 合并表格某列的单元格
   * @param rowIndex 当前单元格的行数
   * @param rowTotal 该列的总行数
   * @param collapse 该列单元格的合并场景，举例：[3,2,1]表示1-3行合并；4-5行合并，6单独
   * @param type     该列所有单元格是否合并为一个
   * @returns {*}
   */
  collapseRow: function ({ rowIndex, rowTotal, collapse, type }) {
    // collapse=collapseMsg
    // debugger
    if (type === "all") {
      if (rowIndex === 0) {
        return {
          rowspan: rowTotal,
          colspan: 1
        };
      } else {
        return {
          rowspan: 0,
          colspan: 0
        };
      }
    }
    /*if (rowIndex + 1 === rowTotal) {
      stepIndex = 0 //初始化合并次数，必需，不然再表格发生重绘时，会出现第一列消失的情况
    }*/
    /*if(collapse.length===0){
      return
    }
    if (rowIndex === 0 || rowIndex === rowTotal - otherStep) {
      otherStep = 0 //初始化剩余行数
      let activeItem=collapse.splice(0,1)
      collapse.forEach(item=>{
        otherStep=otherStep+item
      })
      debugger
      /!*collapse.forEach((item, index) => {
        //统计剩余行数
        if (index > stepIndex) {
          otherStep += item
        }
      })
      stepIndex++*!/
      // collapse.splice(0,1)
      return {
        rowspan: activeItem[0],
        colspan: 1
      }
    } else if (rowIndex < rowTotal - otherStep) {
      return {
        rowspan: 0,
        colspan: 0
      };
    }*/
    if (rowIndex === 0 || rowIndex === rowTotal - otherStep) {
      // debugger
      otherStep = 0; //初始化剩余行数
      collapse.forEach((item, index) => {
        //统计剩余行数
        if (index > stepIndex) {
          otherStep += item;
        }
      });
      if (rowIndex + collapse[collapse.length - 1] === rowTotal) {
        stepIndex = 0; //初始化合并次数，必需，不然再表格发生重绘时，会出现第一列消失的情况
        return {
          rowspan: collapse[collapse.length - 1],
          colspan: 1
        };
      } else {
        stepIndex++;
        return {
          rowspan: collapse[stepIndex - 1],
          colspan: 1
        };
      }
    } else if (rowIndex < rowTotal - otherStep) {
      return {
        rowspan: 0,
        colspan: 0
      };
    }
  },
  /**
   * 重置表单对象
   * @param form
   */
  clearForm: function (form, num = false) {
    for (let item in form) {
      let type = typeof form[item];
      switch (type) {
        case "string":
          form[item] = "";
          break;
        case "number":
          form[item] = num ? 0 : "";
          break;
        case "boolean":
          form[item] = false;
          break;
        case "object":
          if (Object.prototype.toString.call(form[item]) === "[object Array]") {
            form[item] = [];
          } else {
            form[item] = {};
          }
          break;
        default:
          form[item] = "";
      }
    }
  },
  /**
   * 表单校验 rule{'propName':{name:'label',type:'变量类型'}}
   */
  checkForm: function (form, rule) {
    return new Promise((resolve, reject) => {
      for (let item in rule) {
        let val = form[item];
        let type = Object.prototype.toString.call(val);
        let typeInfo = rule[item].type;
        let res = {
          title: rule[item].name,
          msg: ""
        };
        // debugger
        if (type === "[object Number]") {
          if (val <= 0 && typeInfo !== "negativeNum") {
            if (typeInfo !== "zeroNum") {
              res.msg = "请输入大于0的数字";
              reject(res);
              return;
            }
          }
        }
        if (type === "[object String]") {
          if (!val) {
            res.msg = "不能为空";
            reject(res);
            return;
          } else if (typeInfo === "money") {
            if (parseFloat(val) <= 0) {
              res.msg = "请输入大于0的数字";
              reject(res);
              return;
            }
          } else if (typeInfo === "bankCard") {
            if (val.length < 16) {
              res.msg = "银行卡号位数不正确";
              reject(res);
              return;
            }
          } else if (typeInfo === "mobile") {
            if (val.length < 11) {
              res.msg = "手机号不正确";
              reject(res);
              return;
            }
          } else if (typeInfo === "idCard") {
            if (val.length < 18) {
              res.msg = "身份证号不正确";
              reject(res);
              return;
            }
          }
        }
        if (type === "[object Array]") {
          if (val.length === 0) {
            res.msg = "不能为空";
            reject(res);
            return;
          }
        }
      }
      resolve();
    });
  },

  //数字转中文数字
  toChineseNumber: function (money) {
    //汉字的数字
    var cnNums = new Array(
      "零",
      "壹",
      "贰",
      "叁",
      "肆",
      "伍",
      "陆",
      "柒",
      "捌",
      "玖"
    );
    //基本单位
    var cnIntRadice = new Array("", "拾", "佰", "仟");
    //对应整数部分扩展单位
    var cnIntUnits = new Array("", "万", "亿", "兆");
    //对应小数部分单位
    var cnDecUnits = new Array("角", "分", "毫", "厘");
    //整数金额时后面跟的字符
    var cnInteger = "整";
    //整型完以后的单位
    var cnIntLast = "元";
    //最大处理的数字
    var maxNum = 9999999999999.99;
    //金额整数部分
    var integerNum;
    //金额小数部分
    var decimalNum;
    //输出的中文金额字符串
    var chineseStr = "";
    //分离金额后用的数组，预定义
    var parts;
    if (!money) {
      chineseStr = cnNums[0] + cnIntLast + cnInteger;
      return chineseStr;
    }
    money = parseFloat(money);
    if (money >= maxNum) {
      //超出最大处理数字
      return "";
    }
    //转换为字符串
    money = money.toString();
    if (money.indexOf(".") == -1) {
      integerNum = money;
      decimalNum = "";
    } else {
      parts = money.split(".");
      integerNum = parts[0];
      decimalNum = parts[1].substr(0, 4);
    }
    //获取整型部分转换
    if (parseInt(integerNum, 10) > 0) {
      var zeroCount = 0;
      var IntLen = integerNum.length;
      for (var i = 0; i < IntLen; i++) {
        var n = integerNum.substr(i, 1);
        var p = IntLen - i - 1;
        var q = p / 4;
        var m = p % 4;
        if (n == "0") {
          zeroCount++;
        } else {
          if (zeroCount > 0) {
            chineseStr += cnNums[0];
          }
          //归零
          zeroCount = 0;
          chineseStr += cnNums[parseInt(n)] + cnIntRadice[m];
        }
        if (m == 0 && zeroCount < 4) {
          chineseStr += cnIntUnits[q];
        }
      }
      chineseStr += cnIntLast;
    }
    //小数部分
    if (decimalNum != "") {
      var decLen = decimalNum.length;
      for (var i = 0; i < decLen; i++) {
        var n = decimalNum.substr(i, 1);
        if (n != "0") {
          chineseStr += cnNums[Number(n)] + cnDecUnits[i];
        }
      }
    }
    if (chineseStr == "") {
      chineseStr += cnNums[0] + cnIntLast + cnInteger;
    } else if (decimalNum == "") {
      chineseStr += cnInteger;
    }
    return chineseStr;
  },
  dateFormat: function (val, type = 1) {
    if (!val) {
      return "--";
    } else {
      let time = new Date(val);
      let y = time.getFullYear();
      let M = time.getMonth() + 1;
      let D = time.getDate();
      return type === 1
        ? `${y}-${M > 9 ? M : "0" + M}-${D > 9 ? D : "0" + D}`
        : `${y}/${M > 9 ? M : "0" + M}/${D > 9 ? D : "0" + D}`;
    }
  },
  timeFormat: function (val) {
    if (!val) {
      return "--";
    } else {
      let time = new Date(val);
      let y = time.getFullYear();
      let M = time.getMonth() + 1;
      let D = time.getDate();
      let h = time.getHours();
      let m = time.getMinutes();
      let s = time.getSeconds();
      return `${y}-${M > 9 ? M : "0" + M}-${D > 9 ? D : "0" + D} ${
        h > 9 ? h : "0" + h
        }:${m > 9 ? m : "0" + m}:${s > 9 ? s : "0" + s}`;
    }
  },
  nullFormat: function (val) {
    if (!val && typeof val !== "number") {
      return "--";
    } else {
      return val;
    }
  },
  //上传拼接
  getFilePath: function (arr) {
    let newArr = [];
    arr.forEach(item => {
      newArr.push(`${item.path}?${item.name}`);
    });
    return newArr;
  },
  cutFilePath: function (arr) {
    let newArr = [];
    arr.forEach(item => {
      let cell = {
        path: item.split("?")[0],
        name: item.split("?")[1],
        type: this.get_suffix(item.split("?")[1])
      };
      newArr.push(cell);
    });
    return newArr;
  },
  //获取文件的后缀
  get_suffix(filename) {
    let pos = filename.lastIndexOf(".");
    let suffix = "";
    if (pos != -1) {
      suffix = filename.substring(pos);
    }
    return suffix;
  },
  //保留小数位
  cutFloat: function ({ val, max, num = 2 }) {
    val = val
      .toString()
      .replace(/[^\d.]/g, "")
      .replace(/\.{2,}/g, "");
    let point = "";
    if (parseFloat(val) >= max) {
      return max;
    }
    let pos = val.indexOf(".");
    if (pos > -1) {
      point = val.split(".")[1];
      if (point.length > num) {
        point = point.substring(0, num);
      }
      return `${val.slice(0, pos)}.${point}`;
    } else {
      return val;
    }
  },
  textInput: function (val, type = 1) {
    // debugger
    if (type === 1) {
      return val.replace(/[^\a-zA-Z\u4E00-\u9FA5]/g, "").replace(/\s/g, "");
    } else if (type === 2) {
      return val.replace(/[^\d\a-zA-Z]/g, "").replace(/\s/g, "");
    }else if(type===3){
      return val.replace(/[^\u4E00-\u9FA5]/g, "").replace(/\s/g, "");
    }else if(type===4){
      return val.replace(/[^\d\a-zA-Z\u4E00-\u9FA5]/g, "").replace(/\s/g, "");
    }
  },
  numberInput: function (val) {
    return val.replace(/[^\d]/g, "");
  },
  //数组是否有重复元素
  repeatCell: function (arr) {
    // debugger
    let old = arr.length;
    let newArr = new Set(arr);
    if (old === newArr.size) {
      return true;
    } else {
      return false;
    }
  },
  //生成面包屑导航数组
  getRouter: function (arr, root) {
    return arr.map(item => {
      return { name: item, path: root };
    });
  }
};

export {
  TOOL
}
