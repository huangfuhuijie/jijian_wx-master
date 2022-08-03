<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="100px">

      <el-form-item label="课程时间">
        <el-date-picker
          v-model="dateRange"
          size="small"
          style="width: 240px"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
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
          @click="handleAdd">新增课表
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="timetableList">
      <el-table-column label="课程名称" align="center" prop="curriculumName"/>
      <el-table-column label="老师名称" align="center" prop="teacherName"/>
      <el-table-column label="课程价格" align="center" prop="price"/>
      <el-table-column label="课程时长(分钟)" align="center" prop="duration"/>
      <el-table-column label="开始时间" align="center" prop="startTime"/>
      <el-table-column label="课程地点" align="center" prop="address"/>
      <el-table-column label="是否预约" align="center" prop="appointmentType" :formatter="typeFormatter"/>
      <el-table-column label="预约上限(人)" align="center" prop="appointmentNum"/>
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
        <el-form-item label="课程" prop="curriculumId">
          <el-select
            v-model="form.curriculumId"
            placeholder="请选择课程"
            clearable
            @change="handleCurriculumSelectChange"
            size="small"
            style="width: 240px">
            <el-option
              v-for="dict in curriculumOptions"
              :key="dict.curriculumId"
              :label="dict.curriculumName"
              :value="dict.curriculumId"/>
          </el-select>
        </el-form-item>
        <el-form-item label="课程名称" prop="curriculumName">
          <el-input :disabled="true" v-model="form.curriculumName"/>
        </el-form-item>
        <el-form-item label="老师名称" prop="teacherName">
          <el-input :disabled="true" v-model="form.teacherName" />
        </el-form-item>

        <el-form-item label="开始时间" prop="startTime">
          <el-date-picker
            v-model="form.startTime"
            type="datetime"
            style="width: 240px"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择日期时间">
          </el-date-picker>
        </el-form-item>

        <el-form-item label="课程时长" prop="duration">
          <el-input :disabled="true" v-model="form.duration">
            <template slot="append">分钟</template>
          </el-input>
        </el-form-item>
        <el-form-item label="课程价格" prop="price">
          <el-input :disabled="true" v-model="form.price" />
        </el-form-item>
        <el-form-item label="课程地址" prop="address">
          <el-input v-model="form.address"/>
        </el-form-item>
        <el-form-item label="人数上限" prop="appointmentNum">
          <el-input v-model="form.appointmentNum"  />
        </el-form-item>
        <el-form-item label="是否预约" prop="appointmentType">
          <el-select v-model="form.appointmentType" placeholder="请选择">
            <el-option
              v-for="item in appointmentTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
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
    listTimetable,
    addTimetable,
    updateTimetable,
    delTimetable
  } from "@/api/customer/timetable";

  import {
    listCurriculum,
  } from "@/api/customer/curriculum";


  export default {
    name: "timetable",
    data() {
      return {
        // 遮罩层
        loading: true,
        // 日期范围
        dateRange: [],
        //课程数据字典
        curriculumOptions: [],
        appointmentTypeOptions: [
          {
            value: '0',
            label: '不需要'
          }, {
            value: '1',
            label: '需要'
          }
        ],
        form: {
          curriculumId: undefined,
          curriculumName: undefined,
          price: undefined,
          duration: undefined,
          teacherName: undefined,
          timetableId: undefined,
          startTime: undefined,
          address: undefined,
          appointmentType: undefined,
          appointmentNum: undefined
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
        timetableList: [],
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
          ],
          startTime: [
            {required: true, message: "开始时间不能为空", trigger: "blur"}
          ],

        }
      }
    },

    created() {
      this.getList();
      this.getCurriculumList();
    },

    methods: {
      typeFormatter:function(row){
        let type=row.appointmentType;
        return  type==='1'?"需要":type==='0'?"不需要":"其他";
      },
      getList() {
        this.loading = true;
        listTimetable(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
          let timetableArray = new Array();
          for (let i = 0; i < response.rows.length; i++) {
            let timetable = response.rows[i];
            timetableArray.push({
              timetableId:timetable.timetableId,
              curriculumId: timetable.curriculum.curriculumId,
              curriculumName: timetable.curriculum.curriculumName,
              curriculumDescription: timetable.curriculum.curriculumDescription,
              curriculumDetail: timetable.curriculum.curriculumDetail,
              price: timetable.curriculum.price,
              duration: timetable.curriculum.duration,
              teacherName: timetable.curriculum.teacherName,
              startTime: timetable.startTime,
              address: timetable.address,
              appointmentType: timetable.appointmentType,
              appointmentNum: timetable.appointmentNum
            })
          }
          this.timetableList = timetableArray;
          this.total = response.total;
          this.loading = false;
        })
      },

      getCurriculumList(){
        listCurriculum(this.queryParams).then(response => {
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
              teacherDescription: curriculum.teacherDescription,
            })
          }
          this.curriculumOptions = curriculumArray;
        })
      },

      // 表单重置
      reset() {
        this.form = {
          curriculumId: undefined,
          curriculumName: undefined,
          curriculumDescription: undefined,
          curriculumDetail: undefined,
          timetableId:undefined,
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
        this.title = "新增课表";
        this.open = true;
      },

      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset();
        console.log("修改");
        let timetable = row;
        this.form = {
          curriculumId: timetable.curriculumId,
          curriculumName: timetable.curriculumName,
          price: timetable.price,
          duration: timetable.duration,
          teacherName: timetable.teacherName,
          teacherDescription: timetable.teacherDescription,
          address: timetable.address,
          startTime:timetable.startTime,
          appointmentType: timetable.appointmentType,
          appointmentNum: timetable.appointmentNum,
          timetableId:timetable.timetableId
        };
        this.open = true;
        this.title = "修改课表";
        console.info(this.form)
      },

      submitForm() {
        this.$refs["form"].validate(valid => {
          if (valid) {
            if (this.form.timetableId != undefined) {
              updateTimetable(this.form).then(response => {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              });
            } else {
              addTimetable(this.form).then(response => {
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
        const timetableId = row.timetableId || this.ids;
        this.$confirm('是否确认删除团队编号为"' + timetableId + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function () {
          return delTimetable(timetableId);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(() => {
        });
      },

      handleCurriculumSelectChange(row){
        console.log(row);
        for (let i = 0; i < this.curriculumOptions.length; i++) {
          let curriculum = this.curriculumOptions[i];
          if(curriculum.curriculumId == row){
            this.form = curriculum;
            break;
          }
          else{
            continue;
          }
        }
        console.log(this.form);
      }
    }
  }
</script>

<style scoped>

</style>
