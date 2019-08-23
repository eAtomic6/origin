(function () {
  var utils = {
    addClass: function (target, className) {
      class_arr = target.getAttribute('class') ? target.getAttribute('class').split(' ') : [];
      class_arr.push(className);
      target.setAttribute('class', class_arr.join(' '));
      return target;
    },
    hasClass: function (target, className) {
      class_arr = target.getAttribute('class') ? target.getAttribute('class').split(' ') : [];
      return class_arr.indexOf(className) > -1;
    },
    attr: function (target, prop, value) {
      if (value) {
        target.setAttribute(prop, value);
        return target;
      } else {
        return target.getAttribute(prop);
      }
    },
    css: function (target, cssObj) {
      for (var prop in cssObj) {
        target.style[prop] = cssObj[prop];
      }
      return target;
    },
    show: function (target) {
      this.attr(target, 'isShow', 'on');
      clearInterval(target.timer);
      this.css(target, {
        display: 'block',
        opacity: 1
      });
    },
    hide: function (target) {
      this.attr(target, 'isShow', 'off');
      this.css(target, {
        display: 'none'
      });
    },
    formatDate: function (num) {
      return num < 10 ? '0' + num : num;
    },
    fadeOut: function (target) {
      if (this.attr(target, 'isShow') == 'off') return;
      this.attr(target, 'isShow', 'off');
      var opacity = 100;
      var _this = this;
      //销毁控件容器，使控件每次触发时重新挂载
      var wrapClasses = Array.from(target.classList)
      var wrapKey = wrapClasses.find(function (item) {
        return item.indexOf(Dropdown.originOpt.PANELSTR) > -1
      })
      var tapElement = document.querySelector('*[' + Dropdown.originOpt.PANELKEY + '="' + wrapKey.split(Dropdown.originOpt.PANELSTR)[1] + '"]')
      tapElement.classList.remove(Dropdown.originOpt.PICKERNAME)
      tapElement.removeAttribute(Dropdown.originOpt.PANELKEY)
      document.body.removeChild(target)

      target.timer = setInterval(function () {
        opacity -= opacity / 20;
        opacity < 80 && _this.css(target, {
          opacity: opacity / 100
        })
        if (opacity <= 5) {
          clearInterval(target.timer);
          _this.css(target, {
            display: 'none',
            opacity: 1
          })
        }
      }, 10);
    },
  };

  function Dropdown(elem, elemArr) {
    // 参数
    this.bindElem = elem; // 绑定的元素
    this.elem_wrap = null; // calendar-wrap
    this.timer = null; // 本插件异步全都用macroTask中的setTimeout来处理
    this.isSelected = false; // 是否触发了选择日期动作
    this.isYearChange = false; // 是否触发了切换年
    this.isMonthChange = false; // 是否触发了切换月份
    var date = new Date();
    this.dateOpt = {
      _year: date.getFullYear(),
      _month: date.getMonth(),
      _date: date.getDate(),
      selectYear: date.getFullYear(),
      selectMonth: date.getMonth(),
      selectDate: date.getDate(),
    }

    this.elem_container = document.querySelector('body');
    this.init(elemArr);

  };
  Dropdown.create = function (opt) {
    for (var prop in opt) {
      Dropdown.Opt[prop] = opt[prop];
    }
    ;
    var elemArr = document.getElementsByClassName(Dropdown.Opt.classN);

    for (var i = 0; i < elemArr.length; i++) {
      elemArr[i].calendar = new Dropdown(elemArr[i], elemArr);
    }
    console.log(elemArr)
  }
  Dropdown.originOpt = {
    PICKERNAME: 'calendar-btn',
    PANELKEY: 'self-panel-key', // 存储picker对应的calendar的唯一key
    PANELSTR: 'calendar-panel_',
    PANELWRAPCLASS: 'calendar-wrap'
  }
  Dropdown.Opt = {
    classN: '',
    callBack: function (bindElem, selectDate) {
    }
  };
  Dropdown.version = '1.0.0';

  Dropdown.prototype = {
    constructor: Dropdown,
    init: function (arr) {
      var _this = this;
      this.bindElem.addEventListener('click', function (e) {
        _this.openPanel(this, arr);
        e.stopPropagation();
      }, false);
    },
    openPanel: function (target, arr) {
      for (var i = 0; i < arr.length; i++) {//多个控件同时存在时，收起其他控件，保证只展示一个
        if (utils.hasClass(arr[i], Dropdown.originOpt.PICKERNAME) && target !== arr[i]) {
          var key = utils.attr(arr[i], Dropdown.originOpt.PANELKEY)
          arr[i].elem_wrap = document.querySelector('.' + Dropdown.originOpt.PANELSTR + key);
          utils.fadeOut(arr[i].elem_wrap);
        }
      }
      if (utils.attr(target, 'disabled') === 'disabled') {
        return
      }
      if (utils.hasClass(target, Dropdown.originOpt.PICKERNAME)) { // 说明该元素已经挂载
        var only_key = utils.attr(target, Dropdown.originOpt.PANELKEY);
        this.elem_wrap = document.querySelector('.' + Dropdown.originOpt.PANELSTR + only_key);
        if (utils.attr(this.elem_wrap, 'isShow') == 'off') {
          utils.show(this.elem_wrap);
        } else {
          utils.fadeOut(this.elem_wrap);
        }
      } else {
        this.create(target);
      }
    },
    create: function (target) {
      var only_key = +new Date();
      var div = document.createElement('div');

      utils.attr(target, Dropdown.originOpt.PANELKEY, only_key);
      utils.addClass(target, Dropdown.originOpt.PICKERNAME);

      div.className = Dropdown.originOpt.PANELWRAPCLASS + ' ' + Dropdown.originOpt.PANELSTR + only_key;
      div.innerHTML = this.getTemplate(utils.attr(target, 'list'));
      utils.attr(div, 'isShow', 'on');
      this.elem_wrap = div; // 控件容器
      this.elem_panel = div.children[0]; // 控件面板

      // 设置定位位置
      var elem = target;
      var top = elem.offsetTop;
      var left = elem.offsetLeft;
      while (elem.offsetParent) {
        top += elem.offsetParent.offsetTop;
        left += elem.offsetParent.offsetLeft;
        elem = elem.offsetParent;
      }

      utils.css(this.elem_panel, {
        "position": "absolute",
        "z-index": 99,
        "top": top + target.offsetHeight + 10 + "px",
        "left": left + "px",
        "list-style": "none",
        "padding": 0,
        "margin": 0,
        "min-width": target.clientWidth + "px"
      });

      this.elem_container.appendChild(div);
      this.initEvent();
    },
    getTemplate: function (list) {
      var childNodes = ''
      list = !list ? ['无'] : list.split(',')
      for (var i = 0; i < list.length; i++) {
        childNodes += '<li class="dropdown-tips" style="white-space:nowrap;">' + list[i] + '</li>'
      }
      return '<ul class="dropdown">' + childNodes + '</ul>'
    },
    initEvent: function () {
      var self = this;
      this.elem_wrap.addEventListener('click', function (e) {
        e.stopPropagation();
        var target = e.target;
        if (utils.hasClass(target, 'dropdown-tips')) {
          Dropdown.Opt.callBack && Dropdown.Opt.callBack(self.bindElem, {
            value: target.innerHTML
          });
          utils.fadeOut(self.elem_wrap);
        }
      }, false);
      document.addEventListener('click', function () {
        utils.fadeOut(self.elem_wrap);
      }, false);
    },
    // 重置开关状态
    resetOnoff: function () {
      this.isSelected = false;
      this.isMonthChange = false;
      this.isYearChange = false;
    },
  }
  window.Dropdown = Dropdown;
})()
