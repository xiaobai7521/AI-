<template>
  <div>
    <PageHead title="情绪日志" />
    <TableSearch :formItem="formItem" @search="handleSearch" />
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="id" Label="用户ID" width="80" />
      <el-table-column label="会话ID" width="80">
        <template #default="scope">
          <el-avatar>{{ scope.row.nickname }}</el-avatar>
        </template>
      </el-table-column>
      <el-table-column prop="diaryDate" Label="记录日期" width="120" />
      <el-table-column label="情绪评分">
        <template #default="scope">
          <el-rate :model-value="scope.row.moodScore" :max="10" disabled />
        </template>
      </el-table-column>
      <el-table-column label="生活指标" width="120">
        <template #default="scope">
          <div>
            <p>睡眠：{{ scope.row.sleepQuality }} / 5</p>
            <p>压力：{{ scope.row.stressLevel }} / 5</p>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="emotionTrigger" Label="情绪触发因素" width="120" />
      <el-table-column prop="diaryContent" Label="日记内容" width="250" />
      <el-table-column label="操作" width="240" fixed="right">
        <template #default="scope">
          <el-button text type="primary">详情</el-button>
          <el-button text type="danger">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      margin-top="25px"
      :page-size.sync="pagination.size"
      layout="prev, pager, next"
      :total="pagination.total"
      @change="handleChange"
    />
  </div>
</template>
<script setup>
import PageHead from '@/components/PageHead.vue'
import TableSearch from '@/components/TableSearch.vue'
import { getEmotionalPage } from '@/api/admin'
import { onMounted, ref, reactive } from 'vue'

const formItem = [
  {
    label: '用户ID',
    prop: 'userId',
    comp: 'input',
    placeholder: '请输入用户ID'
  },
  {
    label: '情绪评分',
    prop: 'moodScreRange',
    comp: 'select',
    placeholder: '请选择情绪评分范围',
    options: [
      {
        label: '低分(1-3分)',
        value: '1-3'
      },
      {
        label: '中分(4-6分)',
        value: '4-6'
      },
      {
        label: '高分(7-10分)',
        value: '7-10'
      }
    ]
  }
]

// 列表
const tableData = ref([])

// 分页参数
const pagination = reactive({
  currentPage: 1,
  size: 10,
  total: 0
})

const handleChange = page => {
  pagination.currentPage = page
  handleSearch()
}

const handleSearch = async formData => {
  const params = {
    ...pagination,
    ...formData
  }

  const { records, total } = await getEmotionalPage(params)
  tableData.value = records
  pagination.total = total
}

onMounted(() => {
  handleSearch()
})
</script>
