let contractConfig = {
  /**
   * 校验配置对象
   * 勾选框key值必须使用'checkbox'开头，下划线后面跟勾选框的name属性值
   * 下拉框key值必须使用'drapdown'开头，下划线后面跟下拉框的inputmethod属性值
   * 时间选择控件key值必须使用'time'开头，下划线后面跟控件的extendparam属性值
   * 输入框key值使用相应的extendparam属性值
   * 重点：1.有子项校验时，value值为一个带有stateful属性的对象，否则取null;
   * 2.stateful为一个返回子项校验配置对象的方法;
   * 3.key值带有'info'表示stateful方法有自定义校验,
   * 4.clear属性为改部件下所有的子项，方便清空其所有子项状态
   */
  sub: Object.create(null),
  errorArr: [],//存储校验未通过项
  /**
   * 表单校验方法
   * obj配置对象
   * storage保存errorArr校验结果的本地缓存。当模板为买卖的传templateError1，其他情况下都传递templateError
   */
  submit: function (e, obj,storage='templateError') {
    //初始化
    contractConfig.errorArr = [];
    sessionStorage.setItem(storage,JSON.stringify([]));

    for (let item in obj) {
      // contractConfig.errorArr=JSON.parse(sessionStorage.getItem("templateError"));
      if (contractConfig.errorArr.length > 0) {
        break;
      }
      if (item.includes('checkbox')) {
        let doms = Array.from(document.querySelectorAll(`*[name=${item.split('_')[1]}]`));
        let checkedIndex = doms.findIndex(function (cell) {//是否有勾选
          return cell.querySelector('p').getAttribute('checked')
        })
        if (checkedIndex === -1) {
          contractConfig.errorArr.push(item.split('_')[1]);
          break;
        } else {
          if(obj[item]&&obj[item].state) {
            // checkbox为多选且有子项要验证需配置属性state:true
            for(let i = 0; i < doms.length; i++) {
              if(doms[i].querySelector('p').getAttribute('checked')) {
                if(contractConfig.errorArr.length) {
                  break
                }
                obj[item] && obj[item]['stateful'] && contractConfig.submit(e, obj[item]['stateful'](i),storage)
              }
            }
          } else {
            obj[item] && obj[item]['stateful'] && contractConfig.submit(e, obj[item]['stateful'](checkedIndex),storage)
          }
        }
      } else if (item.includes('drapdown')) {
        let dropdown = document.querySelector(`*[inputmethod=${item.split('_')[1]}]`);
        dropdown.classList.remove('BODERRED');
        let dropdownVal = dropdown.tagName.toLowerCase() === 'span' ? dropdown.innerHTML : dropdown.value;
        if (dropdownVal.length === 0) {
          contractConfig.errorArr.push({
            type:'input',
            name:dropdown.getAttribute('extendparam')
          });
          break;
        } else {
          obj[item] && obj[item]['stateful'] && contractConfig.submit(e, obj[item]['stateful'](dropdownVal),storage)
        }
      } else if (item.includes('time')) {
        let time = document.querySelector(`*[extendparam=${item.split('_')[1]}]`);
        time.classList.remove('BODERRED');
        let timeVal = time.tagName.toLowerCase() === 'span' ? time.innerHTML : time.value;
        if (timeVal.length === 0) {
          contractConfig.errorArr.push({
            type:'input',
            name:item.split('_')[1]
          });
          break;
        }
      } else if (item.includes('info')) {
        contractConfig.submit(e, obj[item]['stateful'](),storage);
      } else {//输入框非空校验
        let input = document.querySelector(`*[extendparam=${item}]`);
        input.classList.remove('BODERRED');
        let inputVal = input.tagName.toLowerCase() === 'span' ? input.innerHTML : input.value;
        if (inputVal.length === 0) {
          let _errorMsg={
            type:'input',
            name:item
          }
          input.getAttribute('company')&&(_errorMsg.company=true)
          contractConfig.errorArr.push(_errorMsg);
          break;
        }
      }
    }
    sessionStorage.setItem(storage,JSON.stringify(contractConfig.errorArr))
    return contractConfig.errorArr;
  },
  /**
   * 监听自适应输入框
   * @param callback 弹窗中多行文本框的输入回调,success为取消按钮的回调
   * 注意弹窗必须是一个div.alert-viwer，子元素有textarea#inputArea、p.control-btn
   */
  inputListener: function (callback, success) {
    let inputAutoBoxs = document.querySelectorAll("*[tag='input-auto']")
    for (let i = 0; i < inputAutoBoxs.length; i++) {
      inputAutoBoxs[i].onclick = function (tip) {
        if (tip.target.getAttribute('systemParam')) {
          return
        }
        //获取输入框的默认值
        let initVal = tip.target.innerHTML
        //获取文本弹窗
        let inputArea = document.querySelector('.alert-viwer')
        //获取文本框，并赋初值
        let textArea = document.getElementById('inputArea')
        textArea.value = initVal
        inputArea.style.display = 'block'
        textArea.focus()

        textArea.oninput = function (ev) {
          tip.target.innerHTML = ev.target.value
          callback && callback(ev, tip)//回调要放在赋值之后，防止回调函数的数据操作无效了
          tip.target.classList.remove('input-before')
          if (ev.target.value.length === 0) {
            tip.target.classList.add('input-before')
          }
        }
        document.onclick = function (e) {
          // console.log('test',e.target,inputArea.children)
          let parentBox = Array.from(inputArea.children)
          parentBox.push(inputArea)
          let hiddenModal = parentBox.includes(e.target) || parentBox.includes(e.target.parentNode)
          if (!hiddenModal && e.target !== tip.target) {
            inputArea.style.display = 'none'
            textArea.value = ''
          }
        }
        document.onkeydown=function(e){
          if(e.key==='Enter'){
            let btns=document.querySelector('.control-btn').getElementsByTagName('span')
            btns[0].click()
          }
        }
        document.querySelector('.control-btn').onclick = function (e) {
          let btn = e.target.innerHTML
          if (btn === '取消') {
            if (initVal.length > 0) {
              tip.target.innerHTML = initVal
              tip.target.classList.remove('input-before')
            } else {
              tip.target.innerHTML = ''
              tip.target.classList.add('input-before')
            }
            success && success(tip)
          }
          if (e.target !== e.currentTarget) {
            inputArea.style.display = 'none'
            textArea.value = ''
          }
        }
      }
    }
  },
  /**
   * 监听勾选框
   * @param success 当前勾选框选中的回调，此时状态还未改变，即勾线之前的操作
   * @param callback 勾选之后的操作
   */
  checkboxListener: function (success, callback) {
    let checkboxs = document.querySelectorAll(".info-checkbox")
    for (let i = 0; i < checkboxs.length; i++) {
      checkboxs[i].addEventListener('click', function (obj) {
          let able = obj.currentTarget.getAttribute('readonly') //当前勾选框是否readonly
          if (!able) {
            let boxArray = document.getElementsByName(obj.currentTarget.getAttribute('name'));
            for (let i = 0; i < boxArray.length; i++) {
              let checkboxTip = boxArray[i].querySelector('p')
              if (boxArray[i] === obj.currentTarget) {
                success && success(obj, i)
                if (checkboxTip.getAttribute('checked') === 'true') {
                  checkboxTip.removeAttribute('checked')
                } else {
                  checkboxTip.setAttribute('checked', true)
                }
              } else {
                !obj.currentTarget.getAttribute('more') && checkboxTip.removeAttribute('checked')
              }
            }
            callback && callback(obj, boxArray)
          }
        }
      )
    }
  },
  /**
   * 监听下拉筛选框
   * @param val下拉框当前选中的值
   * @param datalist下拉框列表数据
   * @param dropdownName下拉框的name，用于查找与下拉框关联的dom列表
   * @param callback选择筛选项之后的回调
   */
  dropdownListener: function (val, datalist, dropdownName, callback) {
    let domList = Array.from(document.querySelectorAll(`*[name*=${dropdownName}]`))//查找与下拉框关联的dom列表
    //当前拉下框选中domList的哪一项
    let tip = datalist.findIndex(function (item) {
      return item === val
    })
    domList.forEach(function (item, index) {
      item.classList.remove('modal');
      //为非选项添加modal遮罩层
      if (tip > -1 && index !== tip) {
        item.classList.add('modal')
      }
    })
    callback()
  },
  /**
   * 操作带有交互性的勾选框、下拉筛选框之后，初始化（清空）相关的子表单元素
   * @param config配置对象（以extendparam属性名作为key值的集合）--交互性的勾选框、下拉筛选框相关的子表单元素
   * @param readonly初始化子元素时，判断是否只可读（默认只读）
   */
  initForm: function (config, readonly = 1) {
    config.forEach(function (item) {
      let isCheckBox=(item.indexOf('checkbox')===-1)
      let dom = isCheckBox?document.querySelector(`*[extendparam=${item}]`):document.querySelectorAll(`*[name=${item.split('_')[1]}]`)//将子项中的勾选框和其他表单元素区别
      if(isCheckBox){
        if (readonly === 1) {
          dom.setAttribute('systemParam', "true");
          dom.setAttribute("readonly", "readonly");
          dom.setAttribute("disabled", "disabled");
        }else{
          dom.removeAttribute('systemParam');
          // dom.removeAttribute("readonly");
          dom.removeAttribute("disabled");
        }
        let domType = dom.getAttribute('type')
        let domTag = dom.getAttribute('tag')
        //判断标签元素为输入框、下拉框（变相的也算输入框）时清空输入内容，勾选框时取消勾选状态
        if (domType === 'text' || domType === 'number' || domTag === 'input-auto') {
          if (dom.tagName.toLocaleLowerCase() === 'input') {
            dom.value = ''
            dom.removeAttribute("value")
          } else {
            dom.innerHTML = ''
            //判断是否需要'input-before'类来显示placeholder属性
            if(item.indexOf('_')==-1){
              dom.classList.add('input-before')
            }
            //清空中文数字不可编辑项2020-04-24加
            let chineseSpan=document.querySelector(`*[extendparam=${item+'_add'}]`)
            if(chineseSpan){
              chineseSpan.innerHTML=''
            }
          }
        }
      }else {
        dom.forEach(item=>{
          item.querySelector('p').removeAttribute('checked')
          if (readonly === 1) {
            item.setAttribute("readonly", "readonly");
          }else{
            item.removeAttribute('readonly')
          }
        })
      }
    })
  },
  /**
   * 带有交互的下拉框，选择时为其子项添加遮罩层
   * @param val下拉框当前选择值
   * @param arr下拉框options数组，如['a','b','c'....]
   * @param checkName下拉框inputmethode属性的值（或者子项的name属性值）
   * @param callback回调函数
   */
  prohibit: function (val, arr, checkName, callback) {
    let options = Array.from(document.querySelectorAll(`*[name*=${checkName}]`))//获取所有选择项
    let tip = arr.findIndex(function (item) {//获取当前选择项的下标
      return item === val.value.toLowerCase()
    })
    options.forEach(function (item, index) {
      item.classList.remove('modal');//初始化遮罩样式
      if (index !== tip && tip > -1) {
        item.classList.add('modal')
      }
    })
    callback && callback()
  }
}
let toChineseNumber = function (money) {
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
    if (money === '0') {
      return cnNums[0];
    } else {
      return ''
    }
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
}

export {
  contractConfig,
  toChineseNumber
}
