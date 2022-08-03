<template>

  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="100px">

      <el-form-item label="会员昵称" prop="cardName">
        <el-input
          v-model="queryParams.nickName"
          placeholder="请输入会员昵称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item label="手机号码" prop="cardName">
        <el-input
          v-model="queryParams.phonenumber"
          placeholder="请输入手机号码"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
      <span style = "float: right; color: #1c84c6">提示：扫描类型1代表进场，2代表出场</span>
    </el-form>


    <el-table v-loading="loading" :data="scanRecordList">

      <el-table-column label="会员昵称" align="center" prop="nickName"/>
      <el-table-column label="会员卡编号" align="center" prop="cardId"/>
      <el-table-column label="会员电话" align="center" prop="phone"/>
      <el-table-column label="扫码时间" align="center" prop="scanTime">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.scanTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="扫码类型" align="center" prop="scanType"/>
      <el-table-column label="创建人" align="center" prop="createBy"/>
      <!--      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">-->
      <!--        <template slot-scope="scope">-->

      <!--          <el-button-->
      <!--            size="mini"-->
      <!--            type="text"-->
      <!--            icon="el-icon-edit"-->
      <!--            @click="handleUpdate(scope.row)"-->
      <!--          >修改-->
      <!--          </el-button>-->

      <!--          <el-button-->
      <!--            size="mini"-->
      <!--            type="text"-->
      <!--            icon="el-icon-delete"-->
      <!--            @click="handleDelete(scope.row)"-->
      <!--          >删除-->
      <!--          </el-button>-->
      <!--        </template>-->
      <!--      </el-table-column>-->
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
    listScanRecord,
  } from "@/api/customer/scanRecord";

  export default {
    name: "ActivateCardManage",
    data() {
      return {
        // 遮罩层
        loading: true,
        form: {
          activateCardId: undefined,
          userId: undefined,
          cardId: undefined,
          remark: undefined,
          nickName: undefined,
          payTime: undefined,
          recommendCode: undefined
        },
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          nickName: undefined,
          phonenumber: undefined
        },
        showSearch: true,
        // 总条数
        total: 0,

        //新增和修改dialog显示状态
        open: false,
        title: undefined,

        scanRecordList: [],

        //会员卡
        cardOptions: [],

        rules: {
          userId: [
            {required: true, message: "用户不能为空", trigger: "blur"}
          ],
          cardId: [
            {required: true, message: "会员卡类型不能为空", trigger: "blur"}
          ]
        }
      }
    },

    created() {
      this.getList();
    },

    methods: {
      getList() {
        listScanRecord(this.queryParams).then(response => {
          console.log(response);
          let scanRecordArray = new Array();
          for (let i = 0; i < response.rows.length; i++) {
            let scanRecord = response.rows[i];
            scanRecordArray.push({
              cardId: scanRecord.cardId,
              nickName: scanRecord.user.nickName,
              phone: scanRecord.user.phonenumber,
              scanTime: scanRecord.scanTime,
              scanType: scanRecord.scanType,
              createBy: scanRecord.createBy,
            })
          }
          this.scanRecordList = scanRecordArray;
          this.total = response.total;
          this.loading = false;
        })
      },

      // 表单重置
      reset() {
        this.form = {
          activateCardId: undefined,
          cardId: undefined,
          remark: undefined,
          nickName: undefined,
          payTime: undefined,
          recommendCode: undefined
        };
        this.resetForm("form");
        this.form.userId = this.$route.query.userId;
      },

      /** 搜索按钮操作 */
      handleQuery() {
        this.queryParams.pageNum = 1;
        this.getList();
      },
      /** 重置按钮操作 */
      resetQuery() {
        this.resetForm("queryForm");
        this.handleQuery();
      },











    }
  }
</script>

<style scoped>

</style>
