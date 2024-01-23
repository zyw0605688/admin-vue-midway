<template>
    <div class="mva-container-wrap">
        <div class="mva-search-box">
            <el-form ref="elSearchFormRef" :inline="true" :model="searchInfo" class="demo-form-inline" @keyup.enter="onSearch">
                <el-form-item label="用户名">
                    <el-input v-model="searchInfo.username" placeholder="搜索用户名"/>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" icon="search" @click="onSearch">查询</el-button>
                    <el-button icon="refresh" @click="onSearchReset">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="mva-table-box">
            <div class="mva-btn-list">
                <el-button type="primary" icon="plus" @click="openCreateFormDialog">新增</el-button>
                <el-popover v-model:visible="batchDeleteVisible" :disabled="!multipleSelection.length" placement="top" width="160">
                    <p>确定要删除吗？</p>
                    <div style="text-align: right; margin-top: 8px;">
                        <el-button type="primary" link @click="batchDeleteVisible = false">取消</el-button>
                        <el-button type="primary" @click="onBatchDelete">确定</el-button>
                    </div>
                    <template #reference>
                        <el-button icon="delete" type="danger" style="margin-left: 10px;" :disabled="!multipleSelection.length" @click="batchDeleteVisible = true">
                            批量删除
                        </el-button>
                    </template>
                </el-popover>
            </div>
            <el-table
                ref="multipleTable"
                style="width: 100%;"
                tooltip-effect="dark"
                :data="tableData"
                row-key="id"
                @selection-change="handleSelectionChange"
            >
                <el-table-column type="selection" width="55"/>
                <el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>
                <el-table-column prop="username" label="用户名" align="center"></el-table-column>
                <el-table-column prop="password" label="密码" align="center"></el-table-column>
                <el-table-column prop="email" label="邮箱" align="center"></el-table-column>
                <el-table-column prop="create_at" label="创建时间" align="center"></el-table-column>
                <el-table-column align="left" label="操作">
                    <template #default="scope">
                        <el-button type="primary" link class="table-button" @click="getDetailAndShowDetailDialog(scope.row)">
                            <el-icon style="margin-right: 5px">
                                <InfoFilled/>
                            </el-icon>
                            查看
                        </el-button>
                        <el-button type="primary" link icon="edit" class="table-button" @click="getDetailAndShowUpdateFormDialog(scope.row)">
                            编辑
                        </el-button>
                        <el-button type="primary" link icon="delete" @click="deleteRow(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="mva-pagination">
                <el-pagination
                    layout="total, sizes, prev, pager, next, jumper"
                    :current-page="page"
                    :page-size="pageSize"
                    :page-sizes="[10, 15, 20, 30, 50, 100]"
                    :total="total"
                    @current-change="handleCurrentChange"
                    @size-change="handleSizeChange"
                />
            </div>
        </div>
        <el-dialog v-model="formDialogVisible" :before-close="closeFormDialog" :title="type==='create'?'添加':'修改'" destroy-on-close>
            <el-scrollbar height="500px">
                <el-form :model="formData" label-position="right" ref="elFormRef" :rules="rule" label-width="100px">
                    <el-form-item label="用户名" prop="username">
                        <el-input v-model="formData.username"></el-input>
                    </el-form-item>
                    <el-form-item label="密码" prop="password">
                        <el-input v-model="formData.password"></el-input>
                    </el-form-item>
                    <el-form-item label="邮箱" prop="email">
                        <el-input v-model="formData.email"></el-input>
                    </el-form-item>
                    <el-form-item label="手机" prop="phone">
                        <el-input v-model="formData.phone"></el-input>
                    </el-form-item>
                </el-form>
            </el-scrollbar>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="closeFormDialog">取 消</el-button>
                    <el-button type="primary" @click="onSubmit">确 定</el-button>
                </div>
            </template>
        </el-dialog>

        <el-dialog v-model="detailDialogVisible" style="width: 800px" lock-scroll :before-close="closeDetailDialog" title="查看详情" destroy-on-close>
            <el-scrollbar height="550px">
                <el-descriptions :column="1" border>
                    <el-descriptions-item label="用户名">
                        {{formData.username}}
                    </el-descriptions-item>
                    <el-descriptions-item label="密码">
                        {{formData.password}}
                    </el-descriptions-item>
                    <el-descriptions-item label="邮箱">
                        {{formData.email}}
                    </el-descriptions-item>
                    <el-descriptions-item label="电话">
                        {{formData.phone}}
                    </el-descriptions-item>
                </el-descriptions>
            </el-scrollbar>
        </el-dialog>
    </div>
</template>

<script setup lang="ts" name="User">
import {
    create,
    deleteByIds,
    updateById,
    getDetailById,
    getPageList,
} from '@/api/user'

// 全量引入格式化工具 请按需保留
import {ElMessage, ElMessageBox} from 'element-plus'
import {ref, reactive, onMounted} from 'vue'

onMounted(async () => {
    await getTableData()
})
// =========== 表格控制部分 ===========
const page = ref(1)
const pageSize = ref(10)
const total = ref(0)
const tableData = ref([])
const searchInfo = ref({})
const elSearchFormRef = ref()

// 搜索重置
const onSearchReset = () => {
    searchInfo.value = {}
    getTableData()
}

// 搜索
const onSearch = () => {
    elSearchFormRef.value?.validate(async (valid) => {
        if (!valid) return
        page.value = 1
        pageSize.value = 10
        getTableData()
    })
}

// 修改页码
const handleSizeChange = (val) => {
    pageSize.value = val
    getTableData()
}

// 修改页面容量
const handleCurrentChange = (val) => {
    page.value = val
    getTableData()
}

// 查询，根据所有条件
const getTableData = async () => {
    const params = {page: page.value, pageSize: pageSize.value, ...searchInfo.value}
    const res = await getPageList(params)
    if (res.code === 0) {
        tableData.value = res.data.list
        total.value = res.data.total
        page.value = res.data.page
        pageSize.value = res.data.pageSize
    }
}

// ============== 表格控制部分结束 ===============
// ============== 批量删除开始 ===============
// 多选数据
const multipleSelection = ref([])
// 多选
const handleSelectionChange = (val) => {
    multipleSelection.value = val
}

// 批量删除控制标记
const batchDeleteVisible = ref(false)

// 多选删除
const onBatchDelete = async () => {
    const ids = []
    if (multipleSelection.value.length === 0) {
        ElMessage({
            type: 'warning',
            message: '请选择要删除的数据'
        })
        return
    }
    multipleSelection.value &&
    multipleSelection.value.map(item => {
        ids.push(item.id)
    })
    const res = await deleteByIds({ids: ids.join(",")})
    if (res.code === 0) {
        ElMessage({
            type: 'success',
            message: '删除成功'
        })
        if (tableData.value.length === ids.length && page.value > 1) {
            page.value--
        }
        batchDeleteVisible.value = false
        getTableData()
    }
}
// ============== 批量删除结束 ===============
// ============== 表单开始 ===============
const formData = ref({
    username: '',
    password: '',
    email: '',
    phone: '',
})
const elFormRef = ref()
// 验证规则
const rule = reactive({
    username: [
        {
            required: true,
            message: '',
            trigger: ['input', 'blur'],
        },
        {
            whitespace: true,
            message: '不能只输入空格',
            trigger: ['input', 'blur'],
        }
    ],
    password: [
        {
            required: true,
            message: '',
            trigger: ['input', 'blur'],
        }
    ],
    email: [
        {
            required: true,
            message: '',
            trigger: ['input', 'blur'],
        }
    ],
    phone: [
        {
            required: true,
            message: '',
            trigger: ['input', 'blur'],
        }
    ],
})
// 弹窗控制标记
const formDialogVisible = ref(false)
// 弹窗行为控制标记（弹窗内部增还是改create，update）
const type = ref('')


// 打开新增弹窗
const openCreateFormDialog = () => {
    type.value = 'create'
    formDialogVisible.value = true
}

// 打开更新弹窗
const getDetailAndShowUpdateFormDialog = async (row) => {
    const res = await getDetailById({id: row.id})
    type.value = 'update'
    if (res.code === 0) {
        formData.value = res.data
        formDialogVisible.value = true
    }
}

// 弹窗内确定提交
const onSubmit = async () => {
    elFormRef.value?.validate(async (valid) => {
        if (!valid) return
        let res
        switch (type.value) {
            case 'create':
                res = await create(formData.value)
                break
            case 'update':
                res = await updateById(formData.value)
                break
        }
        if (res.code === 0) {
            ElMessage({
                type: 'success',
                message: '操作成功'
            })
            closeFormDialog()
            getTableData()
        }
    })
}

// 关闭弹窗
const closeFormDialog = () => {
    formDialogVisible.value = false
    formData.value = {
        username: '',
        password: '',
        email: '',
        phone: '',
    }
}

// 查看详情控制标记
const detailDialogVisible = ref(false)

// 打开详情
const getDetailAndShowDetailDialog = async (row) => {
    // 打开弹窗
    const res = await getDetailById({id: row.id})
    if (res.code === 0) {
        formData.value = res.data
        detailDialogVisible.value = true
    }
}

// 关闭详情弹窗
const closeDetailDialog = () => {
    detailDialogVisible.value = false
    formData.value = {
        username: '',
        password: '',
        email: '',
        phone: '',
    }
}

// 删除行
const deleteRow = async (row) => {
    try {
        const temp = await ElMessageBox.confirm('确定要删除吗?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        })
        if (temp) {
            await deleteByIds({ids: row.id})
            await getTableData()
        }
    } catch (e) {
    }
}
// ============== 表单结束 ===============
</script>
