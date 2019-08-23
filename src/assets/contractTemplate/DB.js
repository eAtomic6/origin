let obj = {
    val8:'',
    val10:'',
    val11:'',
    val12:'',
    val14:'',
    val15:'',
    val16:'',
    val17:'',
    check1:{
      name:'part'
    },
    val20:'',
    check2:{
      name:'owner',
      require:true
    },
    check3:{
      name:'guest',
      require:true
    },
}
let errorArr1=[]

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

function getCheckState(ele) {
    return !!(ele.querySelector('p').getAttribute('checked'))
}
//表单对象非空校验
function submit(e) {
    errorArr1=[]
    for(let item in obj){
      let itemType=Object.prototype.toString.call(obj[item])
      // console.log(itemType)
      if(itemType==='[object Object]'){
        let box=document.querySelectorAll(`div[name=${obj[item].name}]`)
        let arr=Array.from(box)
        let state = true
        if(obj[item].name==="owner"||obj[item].name==="guest"){
          state=false
        }else{
          state = arr.every(function (item) {
            return getCheckState(item)===false
          })
        }
        if(state){
          if(obj[item].other){
            let otherState = obj[item].other.every(function (tip) {
              return document.querySelector(`span[extendparam=${tip}]`).innerHTML.length===0
            })
            if(otherState){
              errorArr1.push({
                type:'input',
                name:obj[item].other[0]
              })
              break
            }
          }else {
            // console.log(document.querySelector(`input[name=${obj[item].name}]`).offsetTop,'请勾选')
            errorArr1.push(obj[item].name)
            break
          }
        }else {
          //勾选后判断
          if(obj[item].require){
            let box=Array.from(document.querySelectorAll(`div[name=${obj[item].name}]`))
            let detail={}
            switch (obj[item].name){
              case 'owner':
                box.forEach(element => {
                    let brother=element.parentElement.querySelector("input[type='text']")
                    let spanTag = element.parentElement.querySelector("span")
                    if(spanTag){
                      spanTag.classList.remove('WARNING')
                    }else{
                      brother.classList.remove('BODERRED')
                    }
                    if(getCheckState(element)){
                        if(brother.value.length===0){
                            if(spanTag){
                                spanTag.classList.add('WARNING')
                            }
                            errorArr1.push({
                                type:'input',
                                name:brother.getAttribute('extendparam')
                            })
                        }
                    }
                });
                break
              case 'guest':
                box.forEach(element => {
                    let brother=element.parentElement.querySelector("input[type='text']")
                    let spanTag = element.parentElement.querySelector("span")
                    if(spanTag){
                        spanTag.classList.remove('WARNING')
                    }else{
                        brother.classList.remove('BODERRED')
                    }
                    if(getCheckState(element)){
                        if(brother.value.length===0){
                            if(spanTag){
                                spanTag.classList.add('WARNING')
                            }
                            errorArr1.push({
                                type:'input',
                                name:brother.getAttribute('extendparam')
                            })
                        }
                    }
                });
                break
            }
          }
        }
      }else {
        let classList = Array.from(document.querySelector(`*[extendparam=${item}]`).classList)
        if(classList.includes('dropdown-item')||classList.includes('calendar-item')){
            obj[item]=document.querySelector(`input[extendparam=${item}]`).value
            document.querySelector(`input[extendparam=${item}]`).classList.remove('BODERRED')
        }else{
            obj[item]=document.querySelector(`span[extendparam=${item}]`).innerHTML
            document.querySelector(`span[extendparam=${item}]`).classList.remove('BODERRED')
        }
        // let val=iframe.document.querySelector(`input[extendparam=${item}]`).value
        // iframe.document.querySelector(`input[extendparam=${item}]`).classList.remove('BODERRED')
        if(obj[item].length===0){
          errorArr1.push({
            type:'input',
            name:item
          })
          break
        }
      }
    }
    // if(errorArr1.length>0&&errorArr1[0].type){
    //     document.querySelector(`*[extendparam=${errorArr1[0].name}]`).classList.add('BODERRED')
    // }
    sessionStorage.setItem('templateError',JSON.stringify(errorArr1))
    console.log(errorArr1)
    return errorArr1
}
//初始化下拉控件
Dropdown.create({
classN: 'dropdown-item',
callBack: function(bindElem, dateObj) {
   // bindElem.innerHTML = dateObj.year + '-' + dateObj.month + '-' + dateObj.date;
   if(bindElem.tagName.toLowerCase()==='input'){
       bindElem.value=dateObj.value
       bindElem.setAttribute('value',bindElem.value)
   }
}
})

let inputbox = document.querySelectorAll("input[tag='input']")
for (let i = 0; i < inputbox.length; i++) {
   if(document.addEventListener){
       inputbox[i].addEventListener('change', function () {
           let addrReg=/\?|\？|\*|\"|\“|\”|\'|\‘|\’|\{|\}|\[|\]|\【|\】|\：|\:|\、|\^|\$|\&|\!|\~|\`|\|/g
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

let numInput = document.querySelectorAll("input[listen='number']")
for (let i = 0; i < numInput.length; i++) {
   // debugger
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

let checkboxs= document.querySelectorAll(".info-checkbox")
for(let i=0;i<checkboxs.length;i++){
checkboxs[i].addEventListener('click',function (obj) {
   var boxArray = document.getElementsByName(obj.currentTarget.getAttribute('name'));
   for (let i = 0; i <= boxArray.length - 1; i++) {
       if(boxArray[i] == obj.currentTarget){
           if(boxArray[i].querySelector('p').getAttribute('checked')==='true'){
               boxArray[i].querySelector('p').removeAttribute('checked')
           }else {
               boxArray[i].querySelector('p').setAttribute('checked', true)
           }
       }else {
           if(!obj.currentTarget.getAttribute('more')){
               boxArray[i].querySelector('p').removeAttribute('checked')
           }
       }
   }
})
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

//自适应输入框
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

   let inputArea=document.querySelector('.model')
   inputArea.style.display='block'
   //获取文本框，并赋初值
   let textArea=document.getElementById('inputArea')
   textArea.value=initVal
   textArea.focus()
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
           //限制特殊字符的输入
           let addrReg=/\?|\？|\*|\"|\“|\”|\'|\‘|\’|\{|\}|\[|\]|\【|\】|\：|\:|\^|\$|\&|\!|\~|\`|\|/g;
           ev.target.value=ev.target.value.replace(/</g,"＜").replace(/>/g,"＞").replace(addrReg,'')
           tip.target.innerHTML=ev.target.value
       }
       tip.target.classList.remove('input-before')
       tip.target.classList.remove('input-title')
       tip.target.classList.remove('input-title2')
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
       let companyName = document.querySelector(`input[extendParam="val10"]`)
       let companyNameTxt = msg[readonlyItem].join(',')
       companyName.setAttribute('list',companyNameTxt)
   }
}
if(onlyReadDom.length>0){
   onlyReadDom.forEach((element,index) => {
       element.classList.remove('input-title')
       element.classList.remove('input-before')
       if(readonlyItem==='signDate'){
           element.setAttribute('value', arr[index])
       }else if(readonlyItem==='ownerName'){
           if(msg['ownerNames']){
               let names = msg['ownerName']+'、'+msg['ownerNames']
               element.innerHTML=names
           }else{
               element.innerHTML=msg['ownerName']
           }
       }else if(readonlyItem==='guestName'){
           if(msg['guestNames']){
               let names = msg['guestName']+'、'+msg['guestNames']
               element.innerHTML=names
           }else{
               element.innerHTML=msg['guestName']
           }
       }else if(readonlyItem==='ownerID'){
           if(msg['ownerIDs']){
               let names = msg['ownerID']+'、'+msg['ownerIDs']
               element.innerHTML=names
           }else{
               element.innerHTML=msg['ownerID']
           }
       }else if(readonlyItem==='guestID'){
           if(msg['guestIDs']){
               let names = msg['guestID']+'、'+msg['guestIDs']
               element.innerHTML=names
           }else{
               element.innerHTML=msg['guestID']
           }
       }else if(readonlyItem==='ownerTel'){
           if(msg['ownerTels']){
               let names = msg['ownerTel']+'、'+msg['ownerTels']
               element.innerHTML=names
           }else{
               element.innerHTML=msg['ownerTel']
           }
       }else if(readonlyItem==='guestTel'){
           if(msg['guestTels']){
               let names = msg['guestTel']+'、'+msg['guestTels']
               element.innerHTML=names
           }else{
               element.innerHTML=msg['guestTel']
           }
       }else if(readonlyItem==='propertyAddr'){
           element.innerHTML=msg[readonlyItem]
           element.classList.remove('input-title')
           element.classList.remove('input-before')
       }else{
           element.value=msg[readonlyItem]
           element.setAttribute('value', msg[readonlyItem])
       }
   });
}
}