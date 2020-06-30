import {contractConfig} from "./base.js"

let sub = {
	'val8': null,
	'val10': null,
	'val11': null,
	'val12': null,
	'val14': null,
    'checkbox_handle': null,
	'val15': null,
	'val16': null,
    'checkbox_pay': null,
	'val17': null,
}

//给按钮添加点击事件
let mainBtn=document.querySelector('#submit');
if(mainBtn){
    mainBtn.addEventListener('click',function(e){
        contractConfig.submit(e,sub)
    })
}else{
    let btn=document.createElement('span')
    btn.id='submit'
    btn.style.display='none'
    btn.innerHTML='click'
    document.body.appendChild(btn)
    btn.addEventListener('click',function(e){
        contractConfig.submit(e,sub)
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

// 勾选框逻辑
contractConfig.checkboxListener(function(el,index){
  let elementDom=el.currentTarget
  if(['owner','guest'].includes(elementDom.getAttribute('name'))){
    let inputCell=document.getElementById(`menu${elementDom.getAttribute('menu')}`)
    if(elementDom.querySelector('p').getAttribute('checked')){
      inputCell.innerHTML=''
      inputCell.classList.add('input-before')
      inputCell.setAttribute('systemParam',true)
    }else{
      inputCell.removeAttribute('systemParam')
    }
  }
})

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
      tip.target.innerHTML = ev.target.value
    }
  },function(){})

//基础数据赋值
let msg = JSON.parse(window.sessionStorage.getItem("contractMsg"));
// let msg = {
// 	ownerName: 'jlkjlk',
// 	ownerID: '1215454',
// 	propertyAddr: 'joajgrj',
// 	ownerTel: '13025468744',
// 	guestName: 'jljkl',
// 	guestID: '13565',
// 	guestTel: '465465464',
// 	code: '46464645',
// 	companyNames: ['jhljo']
// }
for(let readonlyItem in msg){
	let onlyReadDom = Array.from(document.querySelectorAll(`*[systemparam=${readonlyItem}]`));
	if(onlyReadDom.length > 0){
		onlyReadDom.forEach((element => {
			if(readonlyItem === 'code'){
				element.value = msg[readonlyItem]
				element.setAttribute('value', msg[readonlyItem])
			} else if(readonlyItem === 'companyNames') {
				if(msg[readonlyItem].length>0){
					element.innerHTML=msg[readonlyItem][0]
				}
			} else {
				element.innerHTML = msg[readonlyItem]
			}
		}))
	}
}
