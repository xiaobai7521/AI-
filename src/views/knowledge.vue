<template>
  <div>
    <PageHead title="知识文章">
      <template #buttons>
        <el-button type="primary" @click="handleEdit({})">新增</el-button>
        <!-- <el-button type="primary" @click="dialogVisible = true">编辑</el-button> -->
      </template>
    </PageHead>
    <TableSearch :formItem="formItem" @search="handleSearch"></TableSearch>
    <el-table :data="tableData" style="width: 100%; margin-top: 25px">
      <el-table-column label="文章标题" width="350" fixed="left">
        <template #default="scope">
          <div style="display: flex; align-items: center">
            <el-icon><timer /></el-icon>
            <span>{{ scope.row.title }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="分类" width="200">
        <template #default="scope">
          <div style="display: flex; align-items: center">
            <el-icon><timer /></el-icon>
            <span>{{ categoryMap[scope.row.categoryId] }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="authorName" label="作者" width="150" />
      <el-table-column prop="readCount" label="阅读量" width="150" />
      <el-table-column label="发布时间" width="150">
        <template #default="scope">
          {{ scope.row.publishedAt || scope.row.updatedAt }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="240" fixed="right">
        <template #default="scope">
          <el-button text type="primary" @click="handleEdit(scope.row)">
            编辑
          </el-button>
          <el-button
            @click="handlePublish(scope.row)"
            v-if="scope.row.status === 0 || scope.row.status === 2"
            text
            type="success"
          >
            发布
          </el-button>
          <el-button
            @click="handleUnpublish(scope.row)"
            v-if="scope.row.status === 1"
            text
            type="warning"
          >
            下线
          </el-button>
          <el-button @click="handleDelete(scope.row)" text type="danger">
            删除
          </el-button>
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
    <ArticleDialog
      v-model:modeValue="dialogVisible"
      :article="currentArticle"
      :categories="categories"
      @success="handleSuccess"
    />
  </div>
</template>
<script setup>
import { onMounted, ref, reactive } from 'vue'
import PageHead from '@/components/PageHead.vue'
import TableSearch from '@/components/TableSearch.vue'
import {
  categoryTree,
  articlePage,
  getArticleDetail,
  changeArticleStatus,
  deleteArticle
} from '@/api/admin'
import { Timer } from '@element-plus/icons-vue'
import ArticleDialog from '@/components/ArticleDialog.vue'
import { ElMessageBox, ElMessage } from 'element-plus'

const formItem = [
  {
    label: '文章标题',
    prop: 'title',
    comp: 'input',
    placeholder: '请输入文章标题'
  },
  {
    label: '分类',
    prop: 'categoryId',
    comp: 'select',
    placeholder: '请选择分类'
  },
  {
    comp: 'select',
    prop: 'status',
    label: '状态',
    placeholder: '请选择状态',
    options: [
      {
        label: '草稿',
        value: '0'
      },
      {
        label: '已发布',
        value: '1'
      },
      {
        label: '已下线',
        value: '2'
      }
    ]
  }
]

// 分页参数
const pagination = reactive({
  currentPage: 1,
  size: 10,
  total: 0
})

const handleSearch = async (formData = {}) => {
  console.log(formData, '查询参数')

  // 添加筛选条件
  const params = {
    ...pagination,
    ...formData
  }

  const { records, total } = await articlePage(params)
  tableData.value = records
  pagination.total = total
}

const handleChange = page => {
  pagination.currentPage = page
  handleSearch()
}

// 分类映射
const categoryMap = reactive({})
// 分类列表
const categories = ref([])
// 列表数据
const tableData = ref([])

// 新增和编辑弹窗
const dialogVisible = ref(false)
const currentArticle = ref(null)
const handleSuccess = () => {
  dialogVisible.value = false
  // 刷新列表
  handleSearch()
}
const handleEdit = row => {
  if (!row.id) {
    // 新增
    currentArticle.value = null
    dialogVisible.value = true
  } else {
    // 编辑文章
    getArticleDetail(row.id).then(res => {
      console.log(res, '编辑详情')
      currentArticle.value = res
      dialogVisible.value = true
    })
  }
}

// 发布
const handlePublish = row => {
  ElMessageBox.confirm(`确认发布文章${row.title}吗？`, `确认`, {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'info'
  }).then(() => {
    // 发布文章
    changeArticleStatus(row.id, { status: 1 }).then(res => {
      ElMessage.success('发布成功')
      handleSuccess()
    })
  })
}

const handleUnpublish = row => {
  ElMessageBox.confirm(`确认下线文章${row.title}吗？`, `确认`, {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    // 下线文章
    changeArticleStatus(row.id, { status: 2 }).then(res => {
      ElMessage.success('下线成功')
      handleSuccess()
    })
  })
}

// 删除
const handleDelete = row => {
  ElMessageBox.confirm(`确认删除文章${row.title}吗？`, `确认`, {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'danger'
  }).then(() => {
    // 删除文章
    deleteArticle(row.id).then(res => {
      ElMessage.success('删除成功')
      handleSuccess()
    })
  })
}

onMounted(async () => {
  const data = await categoryTree()
  categories.value = data.map(item => {
    categoryMap[item.id] = item.categoryName
    return {
      label: item.categoryName,
      value: item.id
    }
  })
  console.log(categories.value)
  formItem[1].options = categories.value

  handleSearch()
})
</script>
