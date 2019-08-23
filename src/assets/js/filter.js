let getVal=function (val) {
  let type=Object.prototype.toString.call(val)
  if(type!=='[object Number]'&&!val){
    return '--'
  }else if(type==='[object Object]'){
    return val.label
  }else {
    return val
  }
}

let FILTER={
  methods:{
    nullFormatter:function (row, column, cellValue) {
      return getVal(cellValue)
    },
    booleanFormatter: function(row, column, cellValue, index) {
      // debugger
      if (!cellValue && cellValue != 0) {
        return "--";
      } else {
        return cellValue===1?'是':'否';
      }
    },
    nullFormatterData(row, column, cellValue){
      return this.getDataVal(cellValue)
    },
    getDataVal(val) {
      if(val == undefined || val === ''){
        return '--'
      }else {
        return val
      }
    }
  },
  filters:{
    getLabel:function (val) {
      return getVal(val)
    }
  },
}
export {
  FILTER
}
