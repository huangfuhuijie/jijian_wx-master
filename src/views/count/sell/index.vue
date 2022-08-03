<template>

  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="用户名称" prop="userName">
        <el-input
          v-model="queryParams.userName"
          placeholder="请输入用户名称"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="手机号码" prop="phonenumber">
        <el-input
          v-model="queryParams.phonenumber"
          placeholder="请输入手机号码"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table v-loading="loading" :data="userList">
      <el-table-column label="用户编号" align="center" key="userId" prop="userId"/>
      <el-table-column label="用户名称" align="center" key="userName" prop="userName"
                       :show-overflow-tooltip="true"/>
      <el-table-column label="用户昵称" align="center" key="nickName" prop="nickName"
                       :show-overflow-tooltip="true"/>
      <el-table-column label="部门" align="center" key="deptName" prop="dept.deptName"
                       :show-overflow-tooltip="true"/>
      <el-table-column label="手机号码" align="center" key="phonenumber" prop="phonenumber"
                       width="120"/>
      <el-table-column label="用户码" align="center" prop="userCode"></el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime" width="160">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        width="160"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope" v-if="scope.row.userId !== 1">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleDetail(scope.row)"
          >详情
          </el-button>
        </template>
      </el-table-column>
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
    listUser,
  } from "@/api/count/sellCountIndex";

  export default {
    name: "sellCountIndex",
    data() {
      return {
        // 遮罩层
        loading: true,
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          nickName: undefined,
          phonenumber:undefined
        },
        showSearch: true,
        // 总条数
        total: 0,
        userList:[],
      }
    },

    created() {
      this.getList();
    },

    methods: {
      /**查询列表 */
      getList() {
        this.loading = true;
        listUser(this.queryParams).then(response => {
            this.userList = response.rows;
            this.total = response.total;
            this.loading = false;
          }
        );
      },
      /** 销售详情 */
      handleDetail(row){
        this.$router.push({path: "/count/detail", query: {userId: row.userId}});
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
