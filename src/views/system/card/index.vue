<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="卡名称" prop="name">
        <el-input
          v-model="queryParams.cardName"
          placeholder="请输入健身卡名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"/>
      </el-form-item>

      <el-form-item label="卡类型" prop="cardType">
        <el-select
          v-model="queryParams.cardType"
          placeholder="健身卡类型"
          clearable
          size="small"
          style="width: 240px">
          <el-option
            v-for="dict in cardTypeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"/>
        </el-select>
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
          v-hasPermi="['system:card:add']"
        >新增
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
          v-hasPermi="['system:card:remove']"
        >删除
        </el-button>
      </el-col>
<!--      <el-col :span="1.5">-->
<!--        <el-button-->
<!--          type="success"-->
<!--          plain-->
<!--          icon="el-icon-download"-->
<!--          size="mini"-->
<!--          :loading="exportLoading"-->
<!--          @click="handleExport"-->
<!--          v-hasPermi="['system:card:export']"-->
<!--        >导入-->
<!--        </el-button>-->
<!--      </el-col>-->
<!--      </el-col>-->
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="cardList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="编号" align="center" prop="cardId"/>
      <el-table-column label="名称" align="center" prop="cardName"/>
      <el-table-column label="类型" align="center" prop="cardType" :formatter="cardTypeFormat"/>
      <el-table-column label="有效期(天)" align="center" prop="duration" />
      <el-table-column label="价格" align="center" prop="price"/>
      <el-table-column label="状态" align="center" prop="status" :formatter="statusFormat"/>
      <el-table-column label="备注" align="center" prop="remark"/>
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
            v-hasPermi="['system:card:edit']"
          >修改
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:card:remove']"
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
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="卡名称" prop="name">
          <el-input v-model="form.cardName" placeholder="请输入健身卡名称"/>
        </el-form-item>
        <el-form-item label="卡类型" prop="cardType">
          <el-select
            v-model="form.cardType"
            placeholder="健身卡类型"
            clearable
            size="small"
            style="width: 240px">
            <el-option
              v-for="dict in cardTypeOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"/>
          </el-select>
        </el-form-item>
        <el-form-item label="卡价格" prop="price">
          <el-input v-model="form.price" placeholder="请输入健身卡价格"/>
        </el-form-item>
        <el-form-item label="有效期(天)" prop="duration">
          <el-input v-model="form.duration" placeholder="请输入健身卡有效期"/>
        </el-form-item>
        <el-form-item label="卡顺序" prop="cardSort">
          <el-input-number v-model="form.cardSort" controls-position="right" :min="0"/>
        </el-form-item>
        <el-form-item label="卡状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio
              v-for="dict in statusOptions"
              :key="dict.dictValue"
              :label="dict.dictValue"
            >{{dict.dictLabel}}
            </el-radio>
          </el-radio-group>
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
  import {listCard, getCard, delCard, addCard, updateCard} from "@/api/system/card";

  export default {
    name: "Card",
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
        // 卡表格数据
        cardList: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        // 状态数据字典
        statusOptions: [],
        //健身卡类型数据字典
        cardTypeOptions: [],
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          cardName: undefined,
          cardType: undefined,
        },
        // 表单参数
        form: {},
        // 表单校验
        rules: {
          cardName: [
            {required: true, message: "卡名称不能为空", trigger: "blur"}
          ],
          cardType: [
            {required: true, message: "卡类型不能为空", trigger: "blur"}
          ],
          price: [
            {required: true, message: "卡价格不能为空", trigger: "blur"}
          ],

          duration: [
            {required: true, message: "卡有效期不能为空", trigger: "blur"}
          ],
          cardSort: [
            {required: true, message: "卡顺序不能为空", trigger: "blur"}
          ]
        }
      };
    },
    created() {
      this.getList();
      this.getDicts("sys_normal_disable").then(response => {
        this.statusOptions = response.data;
      });
      this.getDicts("sys_card_type").then(response => {
        this.cardTypeOptions = response.data;
      });
    },
    methods: {
      /** 查询健身卡列表 */
      getList() {
        this.loading = true;
        listCard(this.queryParams).then(response => {
          this.cardList = response.rows;
          this.total = response.total;
          this.loading = false;
        });
      },
      // 卡状态字典翻译
      statusFormat(row, column) {
        return this.selectDictLabel(this.statusOptions, row.status);
      },

      // 卡类型字典翻译
      cardTypeFormat(row, column) {
        return this.selectDictLabel(this.cardTypeOptions, row.cardType);
      },
      // 取消按钮
      cancel() {
        this.open = false;
        this.reset();
      },
      // 表单重置
      reset() {
        this.form = {
          cardId: undefined,
          cardName: undefined,
          cardType: undefined,
          price: undefined,
          duration: undefined,
          cardSort: 0,
          status: "0",
          remark: undefined,
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
        this.queryParams.cardName = undefined;
        this.handleQuery();
      },
      // 多选框选中数据
      handleSelectionChange(selection) {
        this.ids = selection.map(item => item.cardId)
        this.single = selection.length != 1
        this.multiple = !selection.length
      },
      /** 新增按钮操作 */
      handleAdd() {
        this.reset();
        this.open = true;
        this.title = "添加健身卡卡";
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset();
        const cardId = row.cardId || this.ids
        getCard(cardId).then(response => {
          this.form = response.data;
          this.open = true;
          this.title = "修改卡";
        });
      },
      /** 提交按钮 */
      submitForm: function () {
        this.$refs["form"].validate(valid => {
          if (valid) {
            if (this.form.cardId != undefined) {
              updateCard(this.form).then(response => {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              });
            } else {
              addCard(this.form).then(response => {
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
        const cardIds = row.cardId || this.ids;
        this.$confirm('是否确认删除卡编号为"' + cardIds + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function () {
          return delCard(cardIds);
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
