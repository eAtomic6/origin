const receiptCheck = {
  props: {
    type: {//列表类型
      type: Number,
      default: 1
    },
    list: {
      type: Array,
      default() {
        return []
      }
    },
    tableHeight: {//列表table的maxHeight设置初值
      type: Number,
      default: 0
    }
  },
  computed: {
    getList: function () {
      return this.list
    },
    getType: function () {
      let res = '';
      switch (this.type) {
        case 1:
          res = 'xf';
          break;
        case 2:
          res = 'cz';
          break;
        case 3:
          res = 'jr'
          break;
        default:
          res = 'xf';
      }
      return res;
    },
  },
  methods: {
    /**
     * 合同信息操作
     * @param type
     */
    toLink: function (row, type) {
      if (this.power[`sign-${type}-com-htdetail`].state) {
        this.setPath(this.getPath.concat({name: '合同详情'}))
        this.$router.push({
          path: '/otherContractDetail',
          query: {
            id: row.cid,
            type: this.type === 1 ? 'newHouse' : this.type === 2 ? 'longRent' : this.type === 3 ? 'financial' : ''
          }
        })
      } else {
        this.noPower(`查看${this.power[`sign-${type}-com-htdetail`].name}`)
      }
    },
    toDetails: function (row) {
      if (this.power[`sign-${this.getType}-com-revdetail`].state) {
        this.$router.push({
          path: '/receiptBillDetails',
          query: {
            id: row.id,
            type: this.type
          }
        })
      } else {
        this.noPower(`查看${this.power[`sign-${this.getType}-com-revdetail`].name}`)
      }
    },
    //操作
    cellOpera: function (row, type = 'check') {
      if (type === 'edit') {
        this.setPath(this.getPath.concat({name: '编辑收款'}))
        this.$router.push({
          path: '/receiptBill_simple',
          query: {
            id: row.id,
            contId: row.cid,
            type: this.type,
            edit: true
          }
        })
      } else {
        // this.toDetails(row)
        if(this.getUser.user.empId === row.auditId){
          this.toDetails(row)
        }else{
          this.$ajax.get('/api/machine/getAuditAuth',{bizCode:row.payCode,flowType:1}).then(res=>{
            res=res.data
            if(res.status===200){
              this.toDetails(row)
            }
          }).catch(error=>{
            this.$message({
              message:`${error}`
            })
          })
        }
      }
    },
    //设置审核人
    choseCheckPerson(row, type) {
      this.$emit('choseCheckPerson', {row, type})
    }
  }
}
export {
  receiptCheck
}
