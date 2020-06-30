  let Obj={
      check1:{
        val8:['val12'],
        val9:['val15']
      },
      check2:{
        val18:['val19']
      },
      setting:{
        val31:[],
        val32:['val33','val34','val35','val38','val39','val40','val43','val44','val45']
      },
      part3:['val34','val35','val38','val39','val40','val43','val44','val45'],
      thirdparty:{
        val34:['val35'],
        val38:[]
      },
      cash:{
        val39:['val40','val45'],
        val43:['val44','val45']
      },
      pass:{
        val44:['val45','val46','val47'],
        val48:['val49']
      },
      furniture:{
        val61:['val62'],
        val63:[]
      },
      carport:{
        val64:['val65','val66','val67','val68'],
        val69:[]
      },
      part6_2:['val73','val74','val77','val78','val79','val80','val81','val84','val85','val88','val89','val90','val91','val92'],
      part6_3:['val95','val96','val97','val98','val99','val100','val101'],
      part6_4:['val100','val101'],
      part9:['val125','val126','val127'],
      psecond:{
        val73:['val74'],
        val77:['val78']
      },
      check02:{
        val106:['val107'],
        val108:['val109']
      }
    }

    let Obj1={
      check0:{
        name:'prove',
        require:true
      },
      // check1:{
      //   name:'acquire',
      //   require:true
      // },
      // check120:{
      // 	name:'trader'
      // },
      check2:{
        name:'hasRunsh',
        require:true
      },
      check7:{
        name:'loans'
      },
      check8:{
        name:'pledge'
      },
      check9:{
        name:'transaction'
      },
      check10:{//房屋性质
        name:'nature',
        other:['val30'],
      },
      check3:{
        name:'setting',
        require:true
      },
      check11:{
        name:'rentout'
      },
      val46:'',
      check4:{
        name:'furniture',
        require:true
      },
      check5:{
        name:'carport',
        require:true
      },
      val70:'',
      val71:'',
      val72:'method2',
      val93:'',
      val94:'method3',
      check12:{
        name:'yes'
      },
      check6:{
        name:'check02',
        require:true
      },
      val110:'',
      val111:'',
      check14:{
        name:"check03"
      },
      check15:{
        name:"check04"
      },
      check16:{
        name:"check05"
      },
      check17:{
        name:"check06"
      },
      val121:'',
      check18:{
        name:"check07"
      },
      val200:'',
      val124:'method5',
      val129:'',
      check13:{
        name:'check01'
      },
      val130:'',
      val131:'',
      val132:'',
      val138:'',
    }
    function getCheckState(ele){
      return	!!(ele.querySelector('p').getAttribute('checked'))
    }
    let errorArr2=[]
    function submit(e,obj=Obj1,clear=false) {
      sessionStorage.setItem('templateError1',JSON.stringify([]))
      if(clear){
        errorArr2=[]
      }
      for(let item in obj){
        let itemType=Object.prototype.toString.call(obj[item])
        let errorMsg = JSON.parse(sessionStorage.getItem('templateError1'))
        if(errorMsg.length>0){
          break
        }
        if(itemType==='[object Object]'){
          let state=false
          if(obj[item].name==='textarea'){
            state=true
          }else {
            let box=document.querySelectorAll(`div[name=${obj[item].name}]`)
            let arr=Array.from(box)
            // let that=this
            state = arr.every(function (tagItem) {
              // return tagItem.checked===false
              return getCheckState(tagItem)===false
            })
          }
          if(state){
            if(obj[item].other){
              let otherState = obj[item].other.every(function (tip) {
                return document.querySelector(`span[extendparam=${tip}]`).innerHTML.length===0
              })
              if(otherState){
                // errorArr2.push({
                // 	type:'input',
                // 	name:obj[item].other[0]
                // })
                errorArr2.push(obj[item].name)
                break
              }
            }else {
              // console.log(obj[item].name,iframe.document.querySelector(`input[name=${obj[item].name}]`).offsetTop,'请勾选')
              errorArr2.push(obj[item].name)
              break
            }
          }else {
            //勾选后判断
            if(obj[item].require){
              let box=document.querySelectorAll(`div[name=${obj[item].name}]`)
              let detail={}
              switch (obj[item].name){
                case 'prove':
                  if(getCheckState(box[0])){
                    document.querySelector(`span[extendparam="val15"]`).classList.remove('BODERRED')
                    detail={
                      val12:''
                    }
                  }else{
                    document.querySelector(`span[extendparam="val12"]`).classList.remove('BODERRED')
                    detail={
                      val15:'',
                      check919:{
                        name:'trader'
                      }
                    }
                  }
                  break
                // case 'acquire':
                //   if(getCheckState(box[0])){
                //     detail={
                //       val12:''
                //     }
                //   }else {
                //     detail={
                //       val15:''
                //     }
                //   }
                //   break
                case 'hasRunsh':
                  if(getCheckState(box[0])){
                    detail={
                      val19:''
                    }
                  }
                  break
                case 'setting':
                  if(getCheckState(box[1])){
                    detail={
                      val33:'method1'
                    }
                  }
                  break
                case 'thirdparty':
                  if(getCheckState(box[0])){
                    detail={
                      val35:'',
                    }
                  }
                  break
                case 'cash':
                  if(getCheckState(box[0])){
                    detail={
                      val40:'',
                      val45:''
                    }
                  }else{
                    detail={
                      val44:'',
                      val45:''
                    }
                  }
                  break
                case 'pass':
                  if(getCheckState(box[0])){
                    detail={
                      val45:'',
                      val46:'',
                      val47:''
                    }
                  }else {
                    detail={
                      val49:''
                    }
                  }
                  break
                case 'furniture':
                  if(getCheckState(box[0])){
                    detail={
                      val62:''
                    }
                  }
                  break
                case 'carport':
                  if(getCheckState(box[0])){
                    detail={
                      check:{
                        name:'right'
                      },
                      val67:'',
                      val68:''
                    }
                  }
                  break
                case 'psecond':
                  if(getCheckState(box[0])){
                    detail={
                      val74:''
                    }
                  }else{
                    detail={
                      val78:''
                    }
                  }
                  break
                case 'loanstype':
                  if(getCheckState(box[0])||getCheckState(box[1])||getCheckState(box[2])){
                    detail={
                      val98:'',
                      val99:'method4'
                    }
                  }
                  break
                case 'check02':
                  if(getCheckState(box[0])){
                    detail={
                      val107:''
                    }
                  }else {
                    detail={
                      val109:''
                    }
                  }
                  break
              }
              // this.dealCheck(iframe,detail)
              submit(e,detail,true)
            }
          }
        }else {
          let methodDetail={}
          let val
          let classList = Array.from(document.querySelector(`*[extendparam=${item}]`).classList)
          if(classList.includes('dropdown-item')||classList.includes('calendar-item')){
            val=document.querySelector(`input[extendparam=${item}]`).value
          }else{
            val=document.querySelector(`span[extendparam=${item}]`).innerHTML
          }
          document.querySelector(`*[extendparam=${item}]`).classList.remove('BODERRED')
          if(obj[item]==='method1'){
            switch (val.toLowerCase()){
              case 'a':
                methodDetail={
                  check:{
                    name:'thirdparty',
                    require:true
                  }
                }
                break
              case 'b':
                methodDetail={
                  check:{
                    name:'cash',
                    require:true
                  }
                }
                break
              default:
                errorArr2.push({
                  type:'input',
                  name:item
                })
            }
            // this.dealCheck(iframe,methodDetail)
          }else if(obj[item]==='method2'){
            switch (val.toLowerCase()){
              case 'a':
                break
              case 'b':
                methodDetail={
                  check:{
                    name:'psecond',
                    require:true
                  },
                  val79:'',
                  val80:''
                }
                break
              case 'c':
                methodDetail={
                  val81:'',
                  val84:''
                }
                break
              case 'd':
                methodDetail={
                  val85:'',
                  val88:'',
                  check1:{
                    name:'pthird'
                  },
                  check2:{
                    name:'pfourth'
                  }
                }
                break
              default:
                errorArr2.push({
                  type:'input',
                  name:item
                })
            }
            // this.dealCheck(iframe,methodDetail)
          }else if(obj[item]==='method3'){
            switch (val.toLowerCase()){
              case 'a':
                break
              case 'b':
                methodDetail={
                  check:{
                    name:'loanstype',
                    require:true
                  }
                }
                break
              default:
                errorArr2.push({
                  type:'input',
                  name:item
                })
              // reject(`请输入,${item}`)
            }
            // this.dealCheck(iframe,methodDetail)
          }else if(obj[item]==='method4'){
            switch (val.toLowerCase()){
              case 'a':
                break
              case 'b':
                methodDetail={
                  val100:'',
                  val101:''
                }
                break
              case 'c':
                break
              default:
                errorArr2.push({
                  type:'input',
                  name:item
                })
              // reject(`请输入,${item}`)
            }
            // this.dealCheck(iframe,methodDetail)
          }else if(obj[item]==='method5'){
            switch (val.toLowerCase()){
              case 'a':
                methodDetail={
                  val125:''
                }
                break
              case 'b':
                methodDetail={
                  val126:''
                }
                break
              case 'c':
                methodDetail={
                  val127:''
                }
                break
              case 'd':
                break
              default:
                errorArr2.push({
                  type:'input',
                  name:item
                })
            }
            // this.dealCheck(iframe,methodDetail)
          }else {
            if(val.length===0){
              errorArr2.push({
                type:'input',
                name:item
              })
              break
            }
          }
          if(errorArr2.length===0){
            submit(e,methodDetail)
          }
        }
      }
      sessionStorage.setItem('templateError1',JSON.stringify(errorArr2))
      return errorArr2
    }
    //给按钮添加点击事件
    let mainBtn=document.querySelector('#submit');
    if(mainBtn){
      mainBtn.addEventListener('click',function(e){
        submit(e,Obj1,true)
      })
    }else{
      let btn=document.createElement('span')
      btn.id='submit'
      btn.style.display='none'
      btn.innerHTML='click'
      document.body.appendChild(btn)
      btn.addEventListener('click',function(e){
        submit(e,Obj1,true)
      })
    }

  //初始化时间控件
  Calendar.create({
        classN: 'calendar-item',
        callBack: function(bindElem, dateObj) {
            // bindElem.innerHTML = dateObj.year + '-' + dateObj.month + '-' + dateObj.date;
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
            // bindElem.innerHTML = dateObj.year + '-' + dateObj.month + '-' + dateObj.date;
            if(bindElem.tagName.toLowerCase()==='input'){
                bindElem.value=dateObj.value
                bindElem.setAttribute('value',bindElem.value)
                let attr = bindElem.getAttribute('inputmethod')
                if(attr){
                    if(attr==='diya'){
                        prohibit(bindElem,['a','b'],'diya')
                    }
                    if(attr==='delivery'){
                        prohibit(bindElem,['a','b','c','d'],'delivery')
                    }
                    if(attr==='reject'){
                        prohibit(bindElem,['a','b','c'],'reject')
                    }
                    if(attr==='loans1'){
                        prohibit(bindElem,['a','b'],'loans1',0)
                    }
                    if(attr==='pay'){
                        prohibit(bindElem,['a','b','c','d'],'pay')
                    }
                }
            }
        }
    })
  function cleanInput(tagNameList,onlyRead=1){
    tagNameList.forEach(function(item){
    let dom = document.querySelector(`*[extendparam=${item}]`)
    if(onlyRead===1){
      dom.setAttribute("readonly","readonly");
      dom.setAttribute('disabled',"disabled")
      dom.setAttribute('systemParam',"true")
    }
    let domType = dom.getAttribute('type')
    let domType1 = dom.getAttribute('tag')
    if(domType==='text'||domType==='number'||domType1==='input-auto'){
      if(dom.tagName.toLocaleLowerCase()==='input'){
        dom.value=''
        dom.removeAttribute("value")
      }else if(item==='val12'||item==='val15'){
        dom.innerHTML=dom.innerHTML
      }else{
        dom.innerHTML=''
      }
    }else{
      dom.querySelector('p').removeAttribute('checked')
    }
  })
  }

  let inputbox = document.querySelectorAll("input[tag='input']")
  for (let i = 0; i < inputbox.length; i++) {
      if(document.addEventListener){
          inputbox[i].addEventListener('change', function () {
              let addrReg=/\?|\？|\*|\"|\“|\”|\'|\‘|\’|\{|\}|\[|\]|\【|\】|\：|\:|\^|\$|\&|\!|\~|\`|\|/g
              let inputValue = this.value
              inputValue=inputValue.replace(/</g,"＜").replace(/>/g,"＞").replace(addrReg,'')
              this.setAttribute('value', inputValue)
              this.value = inputValue
              let attr = inputbox[i].getAttribute('inputmethod')
              if(attr){
                  if(attr==='diya'){
                      prohibit(inputbox[i],['a','b'],'diya')
                  }
                  if(attr==='delivery'){
                      prohibit(inputbox[i],['a','b','c','d'],'delivery')
                  }
                  if(attr==='reject'){
                      prohibit(inputbox[i],['a','b','c'],'reject')
                  }
                  if(attr==='loans1'){
                      prohibit(inputbox[i],['a','b'],'loans1',0)
                  }
                  if(attr==='pay'){
                      prohibit(inputbox[i],['a','b','c','d'],'pay')
                  }
                  if(attr==="totalprice"){
                    this.value=toChineseNumber(this.value)
                    this.setAttribute('value', this.value)
                  }
              }
          })

          inputbox[i].addEventListener('input', function () {
            let inputType = inputbox[i].getAttribute('inputmethod')
            if(inputType){
              if(inputType==="number"){
                this.setAttribute('value', this.value.replace(/[^0-9]/ig,""))
                this.value=this.value.replace(/[^0-9]/ig,"")
              }
              if(inputType==="priceone"){
                let numArr=["零", "壹", "贰", "叁", "肆", "伍", "陆", "柒", "捌", "玖"]
                if(!numArr.includes(this.value)){
                  let num = this.value.replace(/[^0-9]/ig,"")
                  if(num||num==='0'){
                    num = parseInt(num)
                    this.value=numArr[num]
                    this.setAttribute('value', numArr[num])
                  }else{
                    this.value=''
                    this.setAttribute('value', '')
                  }
                }
              }
            }
          })
      }else {
          inputbox[i].attachEvent('onchange', function (e) {
              this.setAttribute('value', this.value.replace(/</g,'＜').replace(/>/g,'＞'))
          })
      }
  }

  let checkboxs= document.querySelectorAll(".info-checkbox")
  for(let i=0;i<checkboxs.length;i++){
      checkboxs[i].addEventListener('click',function (obj) {
          let able = obj.currentTarget.getAttribute('readonly')
          if(!able){
              let tagName = obj.currentTarget.getAttribute('checkmodel')
              if(tagName){
                  var tagNameList=[]
                  for(var i in Obj[tagName]) {
                      tagNameList=tagNameList.concat(Obj[tagName][i])
                  }
                  cleanInput(tagNameList)
                  let checkDom=Obj[tagName][obj.currentTarget.getAttribute('extendparam')]
                  if(checkDom&&checkDom.length>0){
                      checkDom.forEach(function(item){
                        let dom = document.querySelector(`*[extendparam=${item}]`)
                        if(!['val33','val35','val40','val74'].includes(item)){
                          let classList = Array.from(dom.classList)
                          dom.removeAttribute('readonly')
                          dom.removeAttribute('disabled')
                          dom.removeAttribute('systemParam')
                        }else{
                          dom.removeAttribute('disabled')
                        }
                      })
                  }
              }

              var boxArray = document.getElementsByName(obj.currentTarget.getAttribute('name'));
              var ext15 = document.querySelector(`span[extendParam=val15]`)
              var ext12 = document.querySelector(`span[extendParam=val12]`)
              var ext16 = document.querySelector(`div[extendParam=val16]`)
              var ext17 = document.querySelector(`div[extendParam=val17]`)
              ext16.removeAttribute('readonly')
              ext17.removeAttribute('readonly')
              let $boxs = document.getElementsByName('acquire')
              for (let i = 0; i <= boxArray.length - 1; i++) {
                  if(boxArray[i] == obj.currentTarget){
                      if(boxArray[i].querySelector('p').getAttribute('checked')==='true'){
                          boxArray[i].querySelector('p').removeAttribute('checked')
                          if(obj.currentTarget.getAttribute('name')==='prove'){
                            Array.from($boxs).forEach((item,index)=>{
                              item.removeAttribute('readonly','readonly')
                              item.querySelector('p').removeAttribute('checked')
                            })
                            if(i===0){
                              ext12.innerHTML=''
                              ext12.classList.add('input-before')
                              ext15.removeAttribute('disabled')
                              ext15.removeAttribute('readonly')
                              ext15.removeAttribute('systemparam')
                            }else{
                              ext15.innerHTML=''
                              ext15.classList.add('input-before')
                              ext16.querySelector('p').removeAttribute('checked')
                              ext17.querySelector('p').removeAttribute('checked')
                              ext12.removeAttribute('disabled')
                              ext12.removeAttribute('readonly')
                              ext12.removeAttribute('systemparam')
                            }
                          }
                      }else {
                          boxArray[i].querySelector('p').setAttribute('checked', true)
                          if(obj.currentTarget.getAttribute('name')==='prove'){
                            Array.from($boxs).forEach((item,index)=>{
                              item.setAttribute('readonly','readonly')
                              item.querySelector('p').removeAttribute('checked')
                              if(index===i){
                                item.querySelector('p').setAttribute('checked', true)
                              }
                            })
                            if(i===0){
                              ext15.innerHTML=''
                              ext15.classList.add('input-before')
                              ext16.querySelector('p').removeAttribute('checked')
                              ext17.querySelector('p').removeAttribute('checked')
                              ext16.setAttribute('readonly','readonly')
                              ext17.setAttribute('readonly','readonly')
                            }else{
                              ext12.innerHTML=''
                              ext12.classList.add('input-before')
                              ext16.removeAttribute('readonly')
                              ext17.removeAttribute('readonly')
                            }
                          }
                      }
                  }else {
                      if(!obj.currentTarget.getAttribute('more')){
                          boxArray[i].querySelector('p').removeAttribute('checked')
                      }
                  }
              }
          }
      })
  }
  var nameArray = document.getElementsByName('prove');
  var _val12 = document.querySelector(`span[extendParam=val12]`).innerHTML
  var _val15 = document.querySelector(`span[extendParam=val15]`).innerHTML
  var _bool16 = document.querySelector(`div[extendParam=val16]`).querySelector('p').getAttribute('checked')
  var _bool17 = document.querySelector(`div[extendParam=val17]`).querySelector('p').getAttribute('checked')
  Array.from(nameArray).forEach((item,index) =>{
    if(item.querySelector('p').getAttribute('checked')){
      item.click()
      item.click()
      if(index===0){
        document.querySelector(`span[extendParam=val12]`).innerHTML = _val12
        document.querySelector(`span[extendParam=val12]`).classList.remove('input-before')
      }else{
        document.querySelector(`span[extendParam=val15]`).innerHTML = _val15
        document.querySelector(`span[extendParam=val15]`).classList.remove('input-before')
        if(_bool16){
          document.querySelector(`div[extendParam=val16]`).querySelector('p').setAttribute('checked',true)
        }else if(_bool17){
          document.querySelector(`div[extendParam=val17]`).querySelector('p').setAttribute('checked',true)
        }
      }
    }
  })

  // 输入框右侧吸边
  let contentWidth = document.querySelector('.container').clientWidth
  let textarea = document.querySelectorAll('.text-long')
  for(let i=0;i<textarea.length;i++){
      let textareaLeft = textarea[i].offsetLeft - parseInt((document.body.offsetWidth - contentWidth) / 2)
      textarea[i].style.width = contentWidth - 40 - textareaLeft+'px'
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
  let owner_ = document.querySelector(`*[systemparam='ownerNames']`)
  let guest_ = document.querySelector(`*[systemparam='guestNames']`)
  owner_.value=''
  guest_.value=''
  owner_.removeAttribute("value")
  guest_.removeAttribute("value")
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
        let companyName = document.querySelector(`input[extendParam="val46"]`)
        let companyNameTxt = msg[readonlyItem].join(',')
        companyName.setAttribute('list',companyNameTxt)
      }
    }

    let readonlyArr = ['ownerName','ownerID','ownerNames','ownerIDs','guestName','guestID','guestNames','guestIDs','propertyAddr','dealPriceUpper','square']
    if(onlyReadDom.length>0){
      onlyReadDom.forEach((element,index) => {
        if(readonlyItem==='signDate'){
           element.setAttribute('value', arr[index])
        }else if(readonlyArr.includes(readonlyItem)){
            if(element.getAttribute("extendParam")==="val7"){
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

  function prohibit(val,arr,checkName,onlyTwo=1){
    cleanInput(Obj[checkName==='loans1'?'part6_3':checkName==='delivery'?'part9':checkName==="diya"?'part3':checkName==='pay'?'part6_2':'part6_4'],0)
    let aaa = Array.from(document.querySelectorAll(`*[name*=${checkName}]`))
    let tip=arr.findIndex(function(item){
      return item===val.value.toLowerCase()
    })
    aaa.forEach(function(item,index){
      item.classList.remove('modal');
      let classList = Array.from(item.classList)
      if(onlyTwo===1){
        if(index!==tip&&tip>-1){
          if(!classList.includes('info-checkbox')){
            item.classList.add('modal')
          }
        }
      }else if(tip===0){
        if(!classList.includes('info-checkbox')){
            item.classList.add('modal')
          }
      }
    })

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

            let inputArea=document.querySelector('.alert-viwer')
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
                    ev.target.value=ev.target.value.replace(/[^\d\/]/g, "")
                }
                if(spanAttr==='chinese'){
                    ev.target.value=ev.target.value.replace(/[^\d\/]/g, "")
                    if(ev.target.value.length>0){
                      if(ev.target.value == '/') {
                        tip.target.innerHTML=ev.target.value
                      }else {
                        let str = toChineseNumber(ev.target.value)
                        let value=str.split('元')[0]
                        tip.target.innerHTML=value
                      }
                    }else {
                      tip.target.innerHTML=''
                      tip.target.classList.add('input-before')
                    }
                }else {
                    tip.target.innerHTML=ev.target.value
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
                }else if(btn==='保存'){

                }
                if(e.target!==e.currentTarget){
                    inputArea.style.display='none'
                    textArea.value=''
                }
            }
        }
    }