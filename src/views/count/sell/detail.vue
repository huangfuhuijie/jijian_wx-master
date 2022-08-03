<template>

  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="时间查询">
        <el-date-picker
          v-model="dateRange"
          size="small"
          style="width: 240px"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="pickerOptions"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <div style="padding: 10px">
      销售总额：{{count}}
    </div>
    <el-table v-loading="loading" :data="activateCardList">
      <el-table-column label="会员卡编号" align="center" prop="activateCardId"/>
      <el-table-column label="会员卡名称" align="center" prop="cardName"/>
      <el-table-column label="会员昵称" align="center" prop="nickName"/>
      <el-table-column label="会员电话" align="center" prop="phone"/>
      <el-table-column label="实际金额" align="center" prop="realAmount"/>
<!--      <el-table-column label="套餐金额" align="center" prop="price"/>-->
      <el-table-column label="推荐码" align="center" prop="recommendCode"/>
      <el-table-column label="购买时间" align="center" prop="createTime">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建人" align="center" prop="createBy"/>
    </el-table>
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
  </div>
</template>

<script>
  import {
    listCustomer,
  } from "@/api/count/sellCountDetail";

  export default {
    name: "sellCountDetail",
    data() {
      return {
        // 遮罩层
        loading: true,
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          userId:undefined
        },
        showSearch: true,
        // 总条数
        total: 0,
        activateCardList: [],
        count:0,
        // 日期范围
        dateRange: [],
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() > Date.now();
          },
          shortcuts: [{
            text: '今天',
            onClick(picker) {
              const date = new Date();
              picker.$emit('pick', [date,date]);
            }
          }, {
            text: '一个月',
            onClick(picker) {
              const date = new Date();
              date.setMonth(date.getMonth()-1);
              picker.$emit('pick', [date,new Date()]);
            }
          }]
        },
      }
    },

    created() {
      this.queryParams.userId=this.$route.query.userId;
      this.getList();
    },

    methods: {
      /** 查询用户列表 */
      getList() {
        this.loading = true;
        listCustomer(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
          let activateCardArray = new Array();
          this.count=response.count;
          for (let i = 0; i < response.list.rows.length; i++) {
            let activateCard = response.list.rows[i];
            activateCardArray.push({
              activateCardId: activateCard.activateCardId,
              cardName: activateCard.card.cardName,
              nickName: activateCard.user.nickName,
              phone: activateCard.user.phonenumber,
              payTime: activateCard.payTime,
              expiryTime: activateCard.expiryTime,
              createTime: activateCard.createTime,
              createBy: activateCard.createBy,
              activateCardId: activateCard.activateCardId,
              recommendCode: activateCard.recommendCode,
              realAmount: activateCard.realAmount,
              price: activateCard.card.price
            })
          }
          this.activateCardList = activateCardArray;
          this.total = response.list.total;
          this.loading = false;
          }
        );
      },
      /** 搜索按钮操作 */
      handleQuery() {
        this.queryParams.pageNum = 1;
        this.getList();
      },
      /** 重置按钮操作 */
      resetQuery() {
        this.dateRange = [];
        this.resetForm("queryForm");
        this.handleQuery();
      },
    }
  }
</script>

<style scoped>

</style>
