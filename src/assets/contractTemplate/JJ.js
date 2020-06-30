    let obj = {
        val3:'',
        val5:'',
        val6:'',
        val7:'',
        val8:'',
        val9:'',
        val10:''
    }

    let Obj1 = {
        val3:'',
        val5:'',
        val6:'',
        val9:'',
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
        // Obj1[item]=iframe.document.querySelector(`input[extendparam=${item}]`).value
        // iframe.document.querySelector(`input[extendparam=${item}]`).classList.remove('BODERRED')
        if(Obj1[item].length===0){
            errorArr.push({
            type:'input',
            name:item
            })
            break
        }
        }
        console.log(errorArr)
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
    
    //初始化下拉控件
	Dropdown.create({
        classN: 'dropdown-item',
        callBack: function(bindElem, dateObj) {
            // bindElem.innerHTML = dateObj.year + '-' + dateObj.month + '-' + dateObj.date;
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
    let contentWidth = document.querySelector('.container').clientWidth
    let textarea = document.querySelectorAll('.text-long')
    for(let i=0;i<textarea.length;i++){
        let textareaLeft = textarea[i].offsetLeft - parseInt((document.body.offsetWidth - contentWidth) / 2)
        textarea[i].style.width = contentWidth - 40 - textareaLeft+'px'
    }

    let numInput = document.querySelectorAll("input[listen='number']")
    for (let i = 0; i < numInput.length; i++) {
        if(document.addEventListener){
            numInput[i].addEventListener('input', function () {
                this.value=this.value.replace(/[^\d]/g, "")
                this.setAttribute('value', this.value)
            })
        }else {
            numInput[i].attachEvent('onpropertychange', function (e) {
                this.value=this.value.replace(/[^\d]/g, "")
                this.setAttribute('value', this.value)
            })
        }
    }

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
                }else if(readonlyItem==='ownerID'){
                    if(msg['ownerIDs']){
                        let names = msg['ownerID']+'、'+msg['ownerIDs']
                        element.innerHTML = names
                    }else{
                        element.innerHTML = msg['ownerID']
                    }
                }else if(readonlyItem==='guestName'){
                    if(msg['guestNames']){
                        let names = msg['guestName']+'、'+msg['guestNames']
                        // element.setAttribute('value', names)
                        element.innerHTML = names
                    }else{
                        // element.setAttribute('value', msg['guestName'])
                        element.innerHTML = msg['guestName']
                    }
                }else if(readonlyItem==='guestID'){
                    if(msg['guestIDs']){
                        let names = msg['guestID']+'、'+msg['guestIDs']
                        // element.setAttribute('value', names)
                        element.innerHTML = names
                    }else{
                        // element.setAttribute('value', msg['guestID'])
                        element.innerHTML = msg['guestID']
                    }
                }else if(readonlyItem==='propertyAddr'||readonlyItem==='ownerCommissionUpper'||readonlyItem==='custCommissionUpper'){
                    if(element.getAttribute("extendParam")==="val4"){
                        let value = msg["propertyAddr"]
                        if(value.substring(0,3)==="武汉市"){
                            element.innerHTML=value.replace("武汉市",'')
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
    function ChineseToNumber(chnStr){
        var rtn = 0;
        var section = 0;
        var number = 0;
        var secUnit = false;
        var chnNumChar = {
            零:0,
            壹:1,
            贰:2,
            叁:3,
            肆:4,
            伍:5,
            陆:6,
            柒:7,
            捌:8,
            玖:9
        };
        var chnNameValue = {
            拾:{value:10, secUnit:false},
            佰:{value:100, secUnit:false},
            仟:{value:1000, secUnit:false},
            万:{value:10000, secUnit:true},
            亿:{value:100000000, secUnit:true}
        }
        var str = chnStr.split('');

        for(var i = 0; i < str.length; i++){
            var num = chnNumChar[str[i]];
            if(typeof num !== 'undefined'){
                number = num;
                if(i === str.length - 1){
                    section += number;
                }
            }else{
                var unit = chnNameValue[str[i]].value;
                secUnit = chnNameValue[str[i]].secUnit;
                if(secUnit){
                    section = (section + number) * unit;
                    rtn += section;
                    section = 0;
                }else{
                    section += (number * unit);
                }
                number = 0;
            }
        }
        return rtn + section;
    }
    let toChineseNumber=function (money) {
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
        return chineseStr;
    }
    // let chineseNumberInput = document.querySelectorAll("input[listen='chinese']")
    // for(let i=0;i<chineseNumberInput.length;i++){
    //     chineseNumberInput[i].addEventListener('change',function () {
    //         let str = toChineseNumber(this.value.replace(/[^\d]/g, ""))
    //         this.value=str.split('元')[0]
    //         this.setAttribute('value', this.value)
    //         if(this.getAttribute('extendparam')==='val5'||this.getAttribute('extendparam')==='val6'){
    //             let brother = document.querySelector(`input[extendparam="${this.getAttribute('extendparam')}_add"]`)
    //             brother.value=ChineseToNumber(this.value)
    //             brother.setAttribute('value', brother.value)
    //         }
    //     })
    // }

    //输入自适应
    let inputAutoBoxs = document.querySelectorAll("span[tag='input-auto']")
    for(let i=0;i<inputAutoBoxs.length;i++){
        inputAutoBoxs[i].onclick=function (tip) {
            if(tip.target.getAttribute('systemParam')){
                return
            }
            //获取span标签的基本配置属性
            let initVal=tip.target.innerHTML
            let type=tip.target.getAttribute('listen')
            let max=tip.target.getAttribute('max')
            let brother = tip.target.getAttribute('brother')
            let tips= document.querySelectorAll(`span[brother="${brother}"]`)
            let bro2
            if(brother){
                bro2=tips[1].innerHTML
            }

            let inputArea=document.querySelector('.model')
            inputArea.style.display='block'
            //获取文本框，并赋初值
            let textArea=document.getElementById('inputArea')
            textArea.focus()
            textArea.value=initVal
            if(max){//监听max属性，判断文本框是有有输入长度限制
                textArea.setAttribute('maxLength',parseInt(max))
            }else {
                textArea.removeAttribute('maxLength')
            }
            textArea.oninput=function (ev) {
                //监听listen属性，判断是否有输入类型限制
                let spanAttr=tip.target.getAttribute('listen')
                if(spanAttr==='number'){
                    ev.target.value=ev.target.value.replace(/[^\d]/g, "")
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
                //监听brother属性,判断是否有关联元素
                if(brother){
                    tips[1].innerHTML=ev.target.value
                }
                tip.target.classList.remove('input-before')
                if(ev.target.value.length===0){
                    tip.target.classList.add('input-before')
                }
            }
            document.onclick=function (e) {
                // console.log('test',e.target,inputArea.children)
                let parentBox=Array.from(inputArea.children)
                parentBox.push(inputArea)
                let hiddenModal=parentBox.includes(e.target)||parentBox.includes(e.target.parentNode)
                if(!hiddenModal&&e.target!==tip.target){
                    inputArea.style.display='none'
                    textArea.value=''
                }
            }
            document.querySelector('.control-btn').onclick=function (e) {
                let btn=e.target.innerHTML
                if(btn==='取消'){
                    if(initVal.length>0){
                        tip.target.innerHTML=initVal
                        tip.target.classList.remove('input-before')
                    }else {
                        tip.target.innerHTML=''                       
                        tip.target.classList.add('input-before')
                    }
                    if(brother){
                        if(initVal.length>0){
                            tips[1].innerHTML=bro2
                        }else{
                            tips[1].innerHTML=''
                        }
                    }
                }else if(btn==='保存'){

                }
                if(e.target!==e.currentTarget){
                    inputArea.style.display='none'
                    textArea.value=''
                }
            }
        }
    }