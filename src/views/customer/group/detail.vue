<template>
  <div class="app-container">

    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="100px">

      <el-form-item label="成员名称" prop="groupName">
        <el-input
          v-model="queryParams.groupMemberName"
          placeholder="请输入成员名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
        >添加成员
        </el-button>
      </el-col>

      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
        >删除
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="groupList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="成员编号" align="center" prop="groupMemberId"/>
      <el-table-column label="成员名称" align="center" prop="userName"/>
      <el-table-column label="联系方式" align="center" prop="userPhone"/>
      <el-table-column label="收款方式" align="center" prop="collectionType" :formatter="collectionTypeFormat"/>
      <el-table-column label="收款账号" align="center" prop="accountNumber"/>
      <el-table-column label="推荐码" align="center" prop="recommendCode"/>
      <el-table-column label="创建时间" align="center" prop="createTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
          >修改
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
          >删除
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

    <!-- 添加或修改岗位对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="选择成员" prop="userId">
          <el-select
            v-model="form.userName"
            placeholder="成员"
            clearable
            size="small"
            style="width: 240px" :disabled = userDisable>
            <el-option
              v-for="user in userOptions"
              :key="user.userId"
              :label="user.userName"
              :value="user.userId"/>
          </el-select>
        </el-form-item>

        <el-form-item label="收款方式" prop="collectionType">
          <el-select
            v-model="form.collectionType"
            placeholder="收款方式"
            clearable
            size="small"
            style="width: 240px">
            <el-option
              v-for="dict in collectionTypeOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"/>
          </el-select>
        </el-form-item>

        <el-form-item label="收款账号" prop="accountNumber">
          <el-input v-model="form.accountNumber" placeholder="请输入收款账号"/>
        </el-form-item>


        <el-form-item label="成员顺序" prop="sort">
          <el-input-number v-model="form.sort" controls-position="right" :min="0"/>
        </el-form-item>

        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入内容"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {
    listGroupMember,
    getGroupMember,
    delGroupMember,
    addGroupMember,
    updateGroupMember,
    listSalesMan
  } from "@/api/customer/groupMember";

  export default {
    name: "GroupDetail",
    data() {
      return {
        // 遮罩层
        loading: true,
        // 导出遮罩层
        exportLoading: false,
        // 选中数组
        ids: [],
        // 非单个禁用
        single: true,
        // 非多个禁用
        multiple: true,
        // 显示搜索条件
        showSearch: true,
        // 总条数
        total: 0,
        // 团队表格数据
        groupList: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,

        userDisable:true,

        //销售人员数据
        userOptions: [],
        collectionTypeOptions: [],
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          groupMemberName: undefined,
          groupId: undefined
        },
        // 表单参数
        form: {
          groupMemberId: undefined,
          groupId: undefined,
          userId: undefined,
          userName: undefined,
          collectionType: undefined,
          accountNumber: undefined,
          sort: 0,
          status: "0",
          remark: undefined,
        },
        // 表单校验
        rules: {
          groupName: [
            {required: true, message: "团队名称不能为空", trigger: "blur"}
          ],
          managerId: [
            {required: true, message: "团队负责人不能为空", trigger: "blur"}
          ],
          collectionType: [
            {required: true, message: "团队收款方式不能为空", trigger: "blur"}
          ],
          accountNumber: [
            {required: true, message: "收款账号不能为空", trigger: "blur"}
          ]
        }
      };
    },
    created() {
      this.form.groupId = this.$route.query.groupId;
      this.queryParams.groupId = this.$route.query.groupId;
      this.getList();
      this.getDicts("sys_collection_type").then(response => {
        this.collectionTypeOptions = response.data;
      });
    },
    activated() {
      let groupId = this.$route.query.userId;
      if (this.form.groupId !== groupId) {
        this.form.groupId = groupId;
        this.queryParams.groupId = groupId;
        this.getList();
      }
    },
    methods: {
      /** 查询岗位列表 */
      getList() {
        this.loading = true;
        listGroupMember(this.queryParams).then(response => {
          this.groupList = response.rows;
          this.total = response.total;
          this.loading = false;
        });
      },

      /** 查询销售人员列表 */
      getSalesMan() {
        listSalesMan().then(response => {
          this.userOptions = response.data;
        })
      },

      // 团队收款方式字典翻译
      collectionTypeFormat(row, column) {
        return this.selectDictLabel(this.collectionTypeOptions, row.collectionType);
      },

      // 取消按钮
      cancel() {
        this.open = false;
        this.reset();
      },
      // 表单重置
      reset() {
        this.form = {
          groupMemberId: undefined,
          userId: undefined,
          collectionType: undefined,
          accountNumber: undefined,
          sort: 0,
          status: "0",
          remark: undefined,
          groupId: this.$route.query.groupId
        };
        this.resetForm("form");
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
      // 多选框选中数据
      handleSelectionChange(selection) {
        this.ids = selection.map(item => item.groupMemberId)
        this.single = selection.length != 1
        this.multiple = !selection.length
      },
      /** 新增按钮操作 */
      handleAdd() {
        this.reset();
        this.userDisable = false;
        this.getSalesMan();
        this.open = true;
        this.title = "添加团队";
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset();
        this.userDisable = true;
        this.getSalesMan();
        const groupMemberId = row.groupMemberId || this.ids
        getGroupMember(groupMemberId).then(response => {
          this.form = response.data;
          this.open = true;
          this.title = "修改团队";
        });
      },
      /** 提交按钮 */
      submitForm: function () {
        this.$refs["form"].validate(valid => {
          if (valid) {
            if (this.form.groupMemberId != undefined) {
              updateGroupMember(this.form).then(response => {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              });
            } else {
              addGroupMember(this.form).then(response => {
                this.msgSuccess("新增成功");
                this.open = false;
                this.getList();
              });
            }
          }
        });
      },
      /** 删除按钮操作 */
      handleDelete(row) {
        const groupMemberIds = row.groupMemberId || this.ids;
        this.$confirm('是否确认删除成员编号为"' + groupMemberIds + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function () {
          return delGroupMember(groupMemberIds);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(() => {
        });
      },
      /** 导出按钮操作 */
      handleExport() {
        const queryParams = this.queryParams;
        this.$confirm('是否确认导出所有岗位数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.exportLoading = true;
          return exportPost(queryParams);
        }).then(response => {
          this.download(response.msg);
          this.exportLoading = false;
        }).catch(() => {
        });
      }
    }
  };
</script>
