<template>
  <div>
    <div class="home">极健健身管理系统</div>
    <div class="app-container" style="margin:0 25%">
      <el-row :gutter="16">
        <el-col :span="20" :xs="24">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>个人信息</span>
            </div>
            <div>
              <div class="text-center">
                <userAvatar :user="user" />
              </div>
              <ul class="list-group list-group-striped">
                <li class="list-group-item">
                  <svg-icon icon-class="user" />用户名称
                  <div class="pull-right">{{ user.userName }}</div>
                </li>
                <li class="list-group-item">
                  <svg-icon icon-class="phone" />手机号码
                  <div class="pull-right">{{ user.phonenumber }}</div>
                </li>
                <li class="list-group-item">
                  <svg-icon icon-class="email" />用户邮箱
                  <div class="pull-right">{{ user.email }}</div>
                </li>
                <li class="list-group-item">
                  <svg-icon icon-class="tree" />所属部门
                  <div class="pull-right" v-if="user.dept">{{ user.dept.deptName }} / {{ postGroup }}</div>
                </li>
                <li class="list-group-item">
                  <svg-icon icon-class="peoples" />所属角色
                  <div class="pull-right">{{ roleGroup }}</div>
                </li>
                <li class="list-group-item">
                  <svg-icon icon-class="date" />创建日期
                  <div class="pull-right">{{ user.createTime }}</div>
                </li>
                <li class="list-group-item">
                  <svg-icon icon-class="table" />用户码
                  <div class="pull-right">{{ user.userCode }}</div>
                </li>
              </ul>
            </div>
          </el-card>
        </el-col>
        <el-col :span="4">
          <el-button type="success" @click="countCellDetail">业绩查询</el-button>
        </el-col>
      </el-row>
    </div>
  </div>


</template>

<script>
  import userAvatar from "../views/system/user/profile/userAvatar";
  import { getUserProfile } from "@/api/system/user";

  export default {
    name: "index",
    components:{userAvatar},
    data() {
      return {
        // 版本号
        version: "1.0.0",
        user: {},
        roleGroup: {},
        postGroup: {},
        activeTab: "userinfo"
      };
    },
    created() {
      this.getUser();
    },
    methods: {
      getUser() {
        getUserProfile().then(response => {
          this.user = response.data;
          this.roleGroup = response.roleGroup;
          this.postGroup = response.postGroup;
        });
      },
      /**跳转到销售统计页面 */
      countCellDetail(){
        this.$router.push({path: "/count/detail", query: {userId: this.user.userId}});
      },
    }
  };
</script>

<style scoped lang="scss">
  .home {
    padding: 10px 20px;
    margin: 0 0 20px;
    font-size: 60px;
    color: #1ab394;
    text-align: center;
    border-left: 5px solid #eee;
  }

</style>

