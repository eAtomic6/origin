<template>
  <div class="login-container" v-if="show">
    <!--<p>用户ID：<input type="number" v-model="userId"></p>
    <p @click="login">登录</p>-->
  </div>
</template>

<script>
import { mapMutations } from "vuex";

export default {
  name: "login",
  data() {
    return {
      userId: "",
      code: {},
      show: false
    };
  },
  created() {
    let param = this.$route.query;
    // this.setPath([])
    if (param.newToken) {
      document.cookie = `ERP-Test=${this.$route.query.newToken}`;
    } else if (param.onlineToken) {
      document.cookie = `ERP=${this.$route.query.onlineToken}`;
    } else if (param.empcode) {
      for (let item in param) {
        if (item === "empcode") {
          param[item] = parseInt(param[item]);
        }
      }
      this.code = Object.assign({}, param);
    }
    // console.log(this.code,param)
    this.login();
  },
  methods: {
    login: function() {
      this.$ajax
        .post("/api/verify", this.code)
        .then(res => {
          res = res.data;
          if (res.status === 200) {
            this.$ajax.get("/api/me", { time: new Date() }).then(res => {
              res = res.data;
              if (res.status === 200) {
                this.$store.commit("setUser", res.data);
                let host = window.location.host;
                if (
                  host === "sign2.jjw.com" &&
                  res.data.user &&
                  res.data.user.empId === 37109
                ) {
                  this.$router.push({
                    path: "commission"
                  });
                  return;
                }
                if (res.data.privileges.length > 0) {
                  let arr = res.data.privileges;
                  let views = this.$tool.pathList.map(item =>
                    Object.assign({}, item)
                  );
                  let sliders = [];

                  views.forEach((item, index) => {
                    //获取侧边栏信息中用户可访问的元素
                    item.child.forEach(tip => {
                      tip.child.forEach(grade => {
                        if (arr.includes(grade.code)) {
                          sliders.push(grade);
                        }
                      });
                    });
                  });

                  let _appPath = {
                    path: "",
                    query: {
                      source: "uplus"
                    }
                  };
                  let pageIndex = Number(this.$route.query.pageName);
                  switch (pageIndex) {
                    case 1:
                      _appPath.path = "contractCheck";
                      break;
                    case 2:
                      _appPath.path = "signedCheck";
                      break;
                    case 3:
                      _appPath.path = "adjustCheck";
                      break;
                    case 4:
                      _appPath.path = "changeCheck";
                      break;
                    case 5:
                      _appPath.path = "cancelCheck";
                      break;
                    case 6:
                    case 7:
                      _appPath = {
                        path: "moneyCheck",
                        query: {
                          type: pageIndex === 6 ? 1 : 2,
                          source: "uplus"
                        }
                      };
                      break;
                    case 8:
                      _appPath.path = "actualAchievement";
                      break;
                    case 99:
                      _appPath.path = "ledger";
                      break;
                    case 100:
                      _appPath = {
                        path: "choseCont",
                        query: {
                          houseId: this.$route.query.houseId
                        }
                      };
                      break;
                  }
                  if (!!_appPath.path) {
                    this.$router.push(_appPath);
                  } else {
                    this.$router.push({
                      path: sliders[0].path
                    });
                  }
                } else {
                  this.$message({
                    message: "无任何权限"
                  });
                }
              }
            });
          }
        })
        .catch(error => {
          this.$router.push({
            path: "/error",
            query: { msg: error }
          });
        });
    },
    ...mapMutations(["setPath"])
  }
};
</script>

<style scoped>
</style>
