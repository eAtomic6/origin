   let obj = {
        val3: '',
        val8: '',
        val9: '',
        val12: '',
        val13: '',
        val16: '',
    }
    let Obj4 = {  //校验
        val3: '',
        val8: '',
        val9: '',
        val12: '',
        val13: '',
        val16: '',
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
    function getCheckState(ele){
        return	!!(ele.querySelector('p').getAttribute('checked'))
      }
       //意向校验
    function submit(e,obj=Obj4){
        errorArr1=[]
        for (let item in obj) {
          document.querySelector(`*[extendparam=${item}]`).classList.remove('BODERRED')
          if(item==="val3"){
            obj[item] = document.querySelector(`input[extendparam=${item}]`).value
          }else{
            obj[item] = document.querySelector(`span[extendparam=${item}]`).innerHTML
          }
          if (obj[item].length === 0) {
            errorArr1.push({
              type:'input',
              name:item
            })
            break
          }
        }
        sessionStorage.setItem('templateError',JSON.stringify(errorArr1))
        console.log(errorArr1)
        return errorArr1
      }
    //   document.querySelector('#submit').addEventListener('click',submit)
   

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
                    let addrReg=/\?|\？|\*|\"|\“|\”|\'|\‘|\’|\{|\}|\[|\]|\【|\】|\：|\:|\、|\^|\$|\&|\!|\~|\`|\|/g;
                    ev.target.value=ev.target.value.replace(/</g,"＜").replace(/>/g,"＞").replace(addrReg,'')
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

    //基础数据赋值
    let msg = JSON.parse(window.sessionStorage.getItem("contractMsg"));
    for(let readonlyItem in msg){
        let onlyReadDom = Array.from(document.querySelectorAll(`span[systemparam=${readonlyItem}]`));
        let arr= []
        if(readonlyItem==='signDate'){
            let time = new Date(msg.signDate)
            arr.push(time.getFullYear())
            arr.push(time.getMonth()+1)
            arr.push(time.getDate())
        }
        if(readonlyItem==="companyNames"){
            if(msg[readonlyItem].length>0){
                let companyName = document.querySelector(`input[extendParam="val3"]`)
                let companyNameTxt = msg[readonlyItem].join(',')
                companyName.setAttribute('list',companyNameTxt)
            }
        }
        if(onlyReadDom.length>0){
            onlyReadDom.forEach((element,index) => {
                element.innerHTML=msg[readonlyItem]
                element.classList.remove('input-before')
            });
        }
    }
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