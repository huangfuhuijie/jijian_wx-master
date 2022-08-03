<template>

  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="100px">

      <el-form-item label="课程名称" prop="cardName">
        <el-input
          v-model="queryParams.curriculumName"
          placeholder="请输入课程名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item label="老师名称" prop="cardName">
        <el-input
          v-model="queryParams.teacherName"
          placeholder="请输入老师名称"
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
          @click="handleAdd">新增课程
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="curriculumList">
      <el-table-column label="课程编号" align="center" prop="curriculumId"/>
      <el-table-column label="课程名称" align="center" prop="curriculumName"/>
      <el-table-column label="课程价格" align="center" prop="price"/>
      <el-table-column label="课程时间" align="center" prop="duration"/>
      <el-table-column label="老师名称" align="center" prop="teacherName"/>
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
        <el-form-item label="课程名称" prop="curriculumName">
          <el-input v-model="form.curriculumName" placeholder="请输入内容"/>
        </el-form-item>
        <el-form-item label="课程简介" prop="curriculumDescription">
          <el-input v-model="form.curriculumDescription" placeholder="请输入内容"/>
        </el-form-item>
        <el-form-item label="课程时长" prop="duration">
          <el-input v-model="form.duration" placeholder="请输入内容"> <template slot="append">分钟</template></el-input>
        </el-form-item>
        <el-form-item label="课程价格" prop="price">
          <el-input v-model="form.price" placeholder="请输入内容"/>
        </el-form-item>
        <el-form-item label="课程详情" prop="curriculumDetail">
          <el-input v-model="form.curriculumDetail" type="textarea" placeholder="请输入内容"/>
        </el-form-item>
        <el-form-item label="老师名称" prop="teacherName">
          <el-input v-model="form.teacherName" placeholder="请输入内容"/>
        </el-form-item>
        <el-form-item label="老师简介" prop="teacherDescription">
          <el-input v-model="form.teacherDescription" type="textarea" placeholder="请输入内容"/>
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
    listCurriculum,
    addCurriculum,
    updateCurriculum,
    delCurriculum
  } from "@/api/customer/curriculum";

  export default {
    name: "curriculum",
    data() {
      return {
        // 遮罩层
        loading: true,
        form: {
          curriculumId: undefined,
          curriculumName: undefined,
          curriculumDescription: undefined,
          curriculumDetail: undefined,
          price: undefined,
          duration: undefined,
          teacherName: undefined,
          teacherDescription: undefined
        },
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          curriculumName: undefined,
          teacherName: undefined
        },
        showSearch: true,
        // 总条数
        total: 0,
        //新增和修改dialog显示状态
        open: false,
        title: undefined,
        curriculumList: [],
        rules: {
          curriculumName: [
            {required: true, message: "课程名称不能为空", trigger: "blur"}
          ],
          teacherName: [
            {required: true, message: "老师名称不能为空", trigger: "blur"}
          ],
          price: [
            {required: true, message: "课程价格不能为空", trigger: "blur"},
          ],
          duration: [
            {required: true, message: "课程时间不能为空", trigger: "blur"}
          ]
        }
      }
    },

    created() {
      this.getList();
    },

    methods: {
      getList() {
        listCurriculum(this.queryParams).then(response => {
          console.log(response);
          let curriculumArray = new Array();
          for (let i = 0; i < response.rows.length; i++) {
            let curriculum = response.rows[i];
            curriculumArray.push({
              curriculumId: curriculum.curriculumId,
              curriculumName: curriculum.curriculumName,
              curriculumDescription: curriculum.curriculumDescription,
              curriculumDetail: curriculum.curriculumDetail,
              price: curriculum.price,
              duration: curriculum.duration,
              teacherName: curriculum.teacherName,
              teacherDescription: curriculum.teacherDescription
            })
          }
          this.curriculumList = curriculumArray;
          this.total = response.total;
          this.loading = false;
        })
      },

      // 表单重置
      reset() {
        this.form = {
          curriculumId: undefined,
          curriculumName: undefined,
          curriculumDescription: undefined,
          curriculumDetail: undefined,
          price: undefined,
          duration: undefined,
          teacherName: undefined,
          teacherDescription: undefined
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

      handleAdd() {
        this.reset();
        this.title = "新增课程";
        this.open = true;
      },

      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset();
          console.log("修改");
          let curriculum = row;
          this.form = {
            curriculumId: curriculum.curriculumId,
            curriculumName: curriculum.curriculumName,
            curriculumDescription: curriculum.curriculumDescription,
            curriculumDetail: curriculum.curriculumDetail,
            price: curriculum.price,
            duration: curriculum.duration,
            teacherName: curriculum.teacherName,
            teacherDescription: curriculum.teacherDescription
          };
          this.open = true;
          this.title = "修改课程";
      },

      submitForm() {
        this.$refs["form"].validate(valid => {
          if (valid) {
            if (this.form.curriculumId != undefined) {
              updateCurriculum(this.form).then(response => {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              });
            } else {
              addCurriculum(this.form).then(response => {
                this.msgSuccess("新增成功");
                this.open = false;
                this.getList();
              });
            }
          }
        });
      },

      cancel() {
        this.open = false;
      },

      /** 删除按钮操作 */
      handleDelete(row) {
        const curriculumId = row.curriculumId || this.ids;
        this.$confirm('是否确认删除团队编号为"' + curriculumId + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function () {
          return delCurriculum(curriculumId);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(() => {
        });
      }
    }
  }
</script>

<style scoped>

</style>
