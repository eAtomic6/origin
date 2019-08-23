import {contractConfig} from "./base.js"

let obj = {
    val3:'',
    val4:'',
    val5:'',
    val6:'',
    val8:'',
    val10:''
}

let Obj1 = {
    val3:'',
    val5:'',
    val6:'',
    val8:'',
    val10:''
}
let errorArr=[]
function submit() {
    errorArr=[]
    for(let item in Obj1){
    let classList = Array.from(document.querySelector(`*[extendparam=${item}]`).classList)
    if(classList.includes('dropdown-item')||classList.includes('calendar-item')){
        if(item==='val3'){
            Obj1[item]=document.querySelector(`span[extendparam=${item}]`).innerHTML
        }else{
            Obj1[item]=document.querySelector(`input[extendparam=${item}]`).value
        }
        document.querySelector(`*[extendparam=${item}]`).classList.remove('BODERRED')
    }else{
        Obj1[item]=document.querySelector(`span[extendparam=${item}]`).innerHTML
        document.querySelector(`span[extendparam=${item}]`).classList.remove('BODERRED')
    }
    if(Obj1[item].length===0){
        errorArr.push({
        type:'input',
        name:item
        })
        break
    }
    }
    sessionStorage.setItem('templateError',JSON.stringify(errorArr))
    return errorArr
}
//给按钮添加点击事件
let mainBtn=document.querySelector('#submit');
if(mainBtn){
    mainBtn.addEventListener('click',submit)
}else{
    let btn=document.createElement('span')
    btn.id='submit'
    btn.style.display='none'
    btn.innerHTML='click'
    document.body.appendChild(btn)
    btn.addEventListener('click',submit)
}

//初始化时间控件
Calendar.create({
    classN: 'calendar-item',
    callBack: function(bindElem, dateObj) {
        if(bindElem.tagName.toLowerCase()==='input'){
            bindElem.value=`${dateObj.year}年${dateObj.month}月${dateObj.date}日`
            bindElem.setAttribute('value',bindElem.value)
            bindElem.setAttribute('random',dateObj.random)
        }
    }
})

//初始化下拉控件
Dropdown.create({
    classN: 'dropdown-item',
    callBack: function(bindElem, dateObj) {
        if(bindElem.tagName.toLowerCase()==='span'){
            bindElem.innerHTML = dateObj.value
            bindElem.classList.remove('input-select')
            bindElem.classList.remove('input-before')
        }
    }
})

let inputbox = document.querySelectorAll("input[tag='input']")
for (let i = 0; i < inputbox.length; i++) {
    if(document.addEventListener){
        inputbox[i].addEventListener('change', function () {
            let addrReg=/\?|\？|\*|\"|\“|\”|\'|\‘|\’|\{|\}|\[|\]|\【|\】|\：|\:|\^|\$|\&|\!|\~|\`|\|/g
            let inputValue = this.value
            inputValue=inputValue.replace(/</g,"＜").replace(/>/g,"＞").replace(addrReg,'')
            this.setAttribute('value', inputValue)
            this.value = inputValue
        })
    }else {
        inputbox[i].attachEvent('onchange', function (e) {
            this.setAttribute('value', this.value.replace(/</g,"＜").replace(/>/g,"＞"))
        })
    }
}

// 输入框右侧吸边
let textLong = Array.from(document.querySelectorAll('.text-limit'))
textLong.forEach(function (item) {
    item.addEventListener('input', function () {
        let leng = this.value.length
        for (let i = 0; i < leng; i++) {
            if (this.scrollWidth > this.clientWidth) {
                this.value = this.value.substring(0, this.value.length - 1)
            }
        }
    })
})

//基础数据赋值
let msg = JSON.parse(window.sessionStorage.getItem("contractMsg"));
for(let readonlyItem in msg){
    let onlyReadDom = Array.from(document.querySelectorAll(`*[systemparam=${readonlyItem}]`));
    let arr= []
    if(readonlyItem==='signDate'){
        let time = new Date(msg.signDate)
        arr.push(time.getFullYear())
        arr.push(time.getMonth()+1)
        arr.push(time.getDate())
    }
    if(readonlyItem==="companyNames"){
        if(msg[readonlyItem].length>0){
            let companyName = document.querySelector(`*[extendParam="val3"]`)
            let companyNameTxt = msg[readonlyItem].join(',')
            companyName.setAttribute('list',companyNameTxt)
        }
    }
    if(onlyReadDom.length>0){
        onlyReadDom.forEach((element,index) => {
            if(readonlyItem==='signDate'){
                element.setAttribute('value', arr[index])
            }else if(readonlyItem==='ownerName'){
                if(msg['ownerNames']){
                    let names = msg['ownerName']+'、'+msg['ownerNames']
                    element.innerHTML = names
                }else{
                    element.innerHTML = msg['ownerName']
                }
            }else if(readonlyItem==='guestName'){
                if(msg['guestNames']){
                    let names = msg['guestName']+'、'+msg['guestNames']
                    element.innerHTML = names
                }else{
                    element.innerHTML = msg['guestName']
                }
            }else if(readonlyItem==='propertyAddr'){
                if(element.getAttribute("extendParam")==="val4"){
                    let value = msg["propertyAddr"]
                    if(value.substring(0,3)==="襄阳市"){
                        element.innerHTML=value.replace("襄阳市",'')
                    }else{
                        element.innerHTML=value
                    }
                }else{
                    element.innerHTML=msg[readonlyItem]
                }
                element.classList.remove('input-before')
            }else{
                element.value=msg[readonlyItem]
                element.setAttribute('value', msg[readonlyItem])
            }
        });
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
        if(money==='0'){
            return cnNums[0];
        }else{
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
    return chineseStr.split('元')[0];
}

//输入自适应
contractConfig.inputListener(function(ev,tip){
    let max=tip.target.getAttribute('max')
    let textArea=document.getElementById('inputArea')
    if(max){//监听max属性，判断文本框是有有输入长度限制
        textArea.setAttribute('maxLength',parseInt(max))
    }else {
        textArea.removeAttribute('maxLength')
    }
    //监听listen属性，判断是否有输入类型限制
    let spanAttr=tip.target.getAttribute('listen')
    if(spanAttr==='number'){
        ev.target.value=ev.target.value.replace(/[^\d]/g, "")
        let toChineseArr = ['val6','val8','val10']
        let chineseStr = tip.target.getAttribute('extendparam')
        if(toChineseArr.includes(chineseStr)){
            document.querySelector(`*[extendparam=${chineseStr}_add]`).innerHTML = toChineseNumber(ev.target.value)
        }
    }
    if(spanAttr==='chinese'){
        ev.target.value=ev.target.value.replace(/[^\d]/g, "")
        if(ev.target.value.length>0){
        let str = toChineseNumber(ev.target.value)
        let value=str.split('元')[0]
        tip.target.innerHTML=value
        }else {
        tip.target.innerHTML=''
        tip.target.classList.add('input-before')
        }
    }else {
        tip.target.innerHTML=ev.target.value
    }
},function(tip){
    //获取输入框的默认值
    let initVal=tip.target.innerHTML
    let ArrCn = ['val6','val8','val10']
    let strCn = tip.target.getAttribute('extendparam')
    if(ArrCn.includes(strCn)){
        if(initVal.length>0){
            document.querySelector(`*[extendparam=${strCn}_add]`).innerHTML = toChineseNumber(initVal)
        }else{
            document.querySelector(`*[extendparam=${strCn}_add]`).innerHTML = ''
        }
    }
})