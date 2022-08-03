<template>
  <section>
    <el-tabs v-model="activeName" @tab-click="handleClick" style="margin-left: 20px; margin-right: 20px">
      <el-tab-pane label="基本信息" name="first">
        <VBasicDetail ref=""></VBasicDetail>
      </el-tab-pane>
      <el-tab-pane label="开卡管理" name="second">
        <VActivateCardManage></VActivateCardManage>
      </el-tab-pane>
      <el-tab-pane label="充值管理" name="third">
        <VRechargeManage></VRechargeManage>
      </el-tab-pane>
      <el-tab-pane label="消费管理" name="fourth">
        <VConsumeManage></VConsumeManage>
      </el-tab-pane>
    </el-tabs>
  </section>




</template>

<script>
  import Card from "../../system/card/index";
  import VBasicDetail from "./BasicDetail"
  import VActivateCardManage from "./ActivateCardManage"
  import VRechargeManage from "./RechargeManage"
  import VConsumeManage from "./ConsumeManage"

  export default {
    name: "MemberDetail",
    components:{
      VBasicDetail,
      VActivateCardManage,
      VRechargeManage,
      VConsumeManage
    },
    data() {
      return {
        activeName: 'second',
      };
    },
    methods: {
      handleClick(tab, event) {
        console.log(tab, event);
      }
    },
  }
</script>

<style scoped>

</style>
