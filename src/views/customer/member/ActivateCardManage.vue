<template>

  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="100px">

      <el-form-item label="会员卡名称" prop="cardName">
        <el-input
          v-model="queryParams.cardName"
          placeholder="请输入会员卡名称"
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
          @click="handleAdd">开卡
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="activateCardList">
      <el-table-column label="会员卡名称" align="center" prop="cardName"/>
      <el-table-column label="会员昵称" align="center" prop="nickName"/>
      <el-table-column label="会员电话" align="center" prop="phone"/>
      <el-table-column label="开始日期" align="center" prop="payTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.payTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="截止日期" align="center" prop="expiryTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.expiryTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="推荐码" align="center" prop="recommendCode"/>
      <el-table-column label="购买时间" align="center" prop="createTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="开卡金额" align="center" prop="realAmount"/>
      <el-table-column label="优惠力度" align="center" prop="discountAmount"/>
      <el-table-column label="创建人" align="center" prop="createBy"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">

          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-has-role="['user']"
          >修改
          </el-button>

          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-has-role="['user']"
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
        <el-form-item label="开卡人" prop="userId">
          <el-input v-model="form.nickName" disabled/>
        </el-form-item>

        <el-form-item label="会员卡" prop="cardId">
          <el-select
            v-model="form.cardId"
            placeholder="请选择会员卡类型"
            clearable
            size="small"
            style="width: 240px" @change="selectCard">
            <el-option
              v-for="card in cardOptions"
              :key="card.cardId"
              :label="card.cardName"
              :value="card.cardId"/>
          </el-select>
        </el-form-item>

        <el-form-item label="开始日期">
          <el-date-picker
            value-format="yyyy-MM-dd HH:mm:ss"
            v-model="form.payTime"
            type="date"
            placeholder="选择开始日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="开卡金额" prop="remark">
          <el-input v-model="form.realAmount" placeholder="请输入内容" type="number" @change="realAmountChange"/>
        </el-form-item>
        <el-form-item label="优惠力度" prop="remark">
          <el-input v-model="form.discountAmount" placeholder="请输入内容" type="number" @change="discountAmountChange"/>
        </el-form-item>
        <el-form-item label="推荐码" prop="remark">
          <el-input v-model="form.recommendCode" placeholder="请输入内容"/>
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
    listActivateCard,
    getUserById,
    listSysCard,
    addActivateCard,
    updateActivateCard,
    delActivateCard
  } from "@/api/customer/activateCard";
  import {getActivateCard} from "../../../api/customer/activateCard";

  export default {
    name: "ActivateCardManage",
    data() {
      return {
        // 遮罩层
        loading: true,
        selectCardPrice: undefined,//目前选中卡的类型id
        form: {
          activateCardId: undefined,
          userId: undefined,
          cardId: undefined,
          remark: undefined,
          nickName: undefined,
          payTime: undefined,
          recommendCode: undefined,
          realAmount: undefined,
          discountAmount: undefined,
        },
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          cardName: undefined
        },
        showSearch: true,
        // 总条数
        total: 0,

        //新增和修改dialog显示状态
        open: false,
        title: undefined,

        activateCardList: [],

        //会员卡
        cardOptions: [],

        rules: {
          userId: [
            {required: true, message: "用户不能为空", trigger: "blur"}
          ],
          cardId: [
            {required: true, message: "会员卡类型不能为空", trigger: "blur"}
          ],
          payTime: [
            {required: true, message: "开始时间不能为空", trigger: "blur"}
          ]
        }
      }
    },

    created() {
      this.form.userId = this.$route.query.userId;
      this.queryParams.userId = this.$route.query.userId;
      console.log(this.form.userId);
      this.getList();
      this.getAllCard();
    },
    activated() {
      let userId = this.$route.query.userId;
      if (this.form.userId !== userId) {
        this.form.userId = userId;
        this.queryParams.userId = userId;
        this.getList();
      }
    },
    methods: {
      /**
       * 自动计算优惠力度
       */
      realAmountChange(realAmount) {
        this.form.discountAmount = this.selectCardPrice - realAmount;
      },
      /**
       * 根据优惠力度自动计算价格
       */
      discountAmountChange(discountAmount) {
        this.form.realAmount = this.selectCardPrice - discountAmount;
      },
      /**
       *  选中赋值
       */
      selectCard(cardId) {
        let card = this.getCardByCardId(cardId);
        this.selectCardPrice = card.price;
        this.form.realAmount = card.price;
        this.form.discountAmount = 0;
      },
      getCardByCardId(cardId) {
        let card = {};
        for (let i = 0; i < this.cardOptions.length; i++) {
          if (cardId === this.cardOptions[i].cardId) {
            card = this.cardOptions[i];
          }
        }
        return card;
      },
      getList() {
        listActivateCard(this.queryParams).then(response => {
          console.log(response);
          let activateCardArray = new Array();
          for (let i = 0; i < response.rows.length; i++) {
            let activateCard = response.rows[i];
            activateCardArray.push({
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
              discountAmount: activateCard.discountAmount,
            })
          }
          this.activateCardList = activateCardArray;
          this.total = response.total;
          ;
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
          recommendCode: undefined,
          realAmount: undefined,
          discountAmount: undefined,
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

      handleAdd() {
        this.reset();
        this.title = "新增开卡";
        this.getUserById();
      },

      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset();
        const activateCardId = row.activateCardId || this.ids
        getActivateCard(activateCardId).then(response => {
          console.log("修改");
          console.log(response);
          let data = response.data;
          this.selectCard(data.card.cardId);
          this.form = {
            activateCardId: data.activateCardId,
            userId: data.user.userId,
            recommendCode: data.recommendCode,
            realAmount: data.realAmount,
            discountAmount: data.discountAmount,
            cardId: data.card.cardId,
            remark: data.user.remark,
            nickName: data.user.nickName,
            payTime: data.payTime,
          };
          this.open = true;
          this.title = "修改团队";
        });
      },

      submitForm() {
        this.$refs["form"].validate(valid => {
          if (valid) {
            if (this.form.activateCardId != undefined) {
              updateActivateCard(this.form).then(response => {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              });
            } else {
              addActivateCard(this.form).then(response => {
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

      getUserById() {
        console.log(this.form.userId);
        getUserById(this.form.userId).then(response => {
          this.open = true;
          console.log(response);
          this.form.nickName = response.data.nickName;

        });
      },

      getAllCard() {
        listSysCard(this.queryParams).then(response => {
          console.log(response);
          this.cardOptions = response.rows;

        });
      },

      /** 删除按钮操作 */
      handleDelete(row) {
        const activateCardIds = row.activateCardId || this.ids;
        this.$confirm('是否确认删除团队编号为"' + activateCardIds + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function () {
          return delActivateCard(activateCardIds);
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
