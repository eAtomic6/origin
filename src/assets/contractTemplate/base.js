let contractConfig = {
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
  dropdownListener:function (val,datalist,dropdownName,callback) {
    let domList = Array.from(document.querySelectorAll(`*[name*=${dropdownName}]`))//查找与下拉框关联的dom列表
    //当前拉下框选中domList的哪一项
    let tip=datalist.findIndex(function(item){
      return item===val
    })
    domList.forEach(function(item,index){
      item.classList.remove('modal');
      //为非选项添加modal遮罩层
      if(tip>-1&&index!==tip){
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
  initForm:function (config,readonly=1) {
    config.forEach(function(item){
      let dom = document.querySelector(`*[extendparam=${item}]`)
      if(readonly===1){
        dom.setAttribute("readonly","readonly");
        dom.setAttribute('disabled',"disabled")
        dom.setAttribute('systemParam',"true")
      }
      let domType = dom.getAttribute('type')
      let domTag = dom.getAttribute('tag')
      //判断标签元素为输入框、下拉框（变相的也算输入框）时清空输入内容，勾选框时取消勾选状态
      if(domType==='text'||domType==='number'||domTag==='input-auto'){
        if(dom.tagName.toLocaleLowerCase()==='input'){
          dom.value=''
          dom.removeAttribute("value")
        }else{
          dom.innerHTML=''
          dom.classList.add('input-before')
        }
      }else{
        dom.querySelector('p').removeAttribute('checked')
      }
    })
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
