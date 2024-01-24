<template>
    <div>
        <div class="mva-search-box">
            <!-- 自动化代码工具 -->
            <el-form ref="autoCodeForm" :rules="rules" :model="form" label-width="120px" :inline="true">
                <el-form-item label="文件名称" prop="fileName">
                    <el-input v-model="form.fileName" placeholder="小驼峰写法"/>
                </el-form-item>
                <el-form-item label="TableName" prop="tableName">
                    <el-input v-model="form.tableName" placeholder="指定表名（非必填）"/>
                </el-form-item>
            </el-form>
        </div>
        <!-- 组件列表 -->
        <div class="gva-table-box">
            <div class="gva-btn-list">
                <el-button type="primary" @click="editAndAddField">新增字段</el-button>
            </div>
            <el-table :data="form.fields">
                <el-table-column align="left" type="index" label="序列" width="60"/>
                <el-table-column align="left" prop="fieldName" label="字段名称" width="160">
                    <template #default="{row}">
                        <el-input v-model="row.fieldName"/>
                    </template>
                </el-table-column>
                <el-table-column align="left" prop="fieldDesc" label="中文名" width="160">
                    <template #default="{row}">
                        <el-input v-model="row.fieldDesc"/>
                    </template>
                </el-table-column>
                <el-table-column align="left" prop="require" label="必填">
                    <template #default="{row}">
                        <el-checkbox v-model="row.require"/>
                    </template>
                </el-table-column>
                <el-table-column align="left" prop="sort" label="排序">
                    <template #default="{row}">
                        <el-checkbox v-model="row.sort"/>
                    </template>
                </el-table-column>
                <el-table-column align="left" prop="fieldJson" width="160px" label="字段Json">
                    <template #default="{row}">
                        <el-input v-model="row.fieldJson"/>
                    </template>
                </el-table-column>
                <el-table-column align="left" prop="fieldType" label="字段类型" width="160">
                    <template #default="{row}">
                        <el-select
                            v-model="row.fieldType"
                            style="width:100%"
                            placeholder="请选择字段类型"
                            clearable
                        >
                            <el-option
                                v-for="item in typeOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            />
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column align="left" prop="dataTypeLong" label="数据库字段长度" width="160">
                    <template #default="{row}">
                        <el-input v-model="row.dataTypeLong"/>
                    </template>
                </el-table-column>
                <el-table-column align="left" prop="columnName" label="数据库字段" width="160">
                    <template #default="{row}">
                        <el-input v-model="row.columnName"/>
                    </template>
                </el-table-column>
                <el-table-column align="left" prop="comment" label="数据库字段描述" width="160">
                    <template #default="{row}">
                        <el-input v-model="row.columnName"/>
                    </template>
                </el-table-column>
                <el-table-column align="left" prop="fieldSearchType" label="搜索条件" width="130">
                    <template #default="{row}">
                        <el-select
                            v-model="row.fieldSearchType"
                            style="width:100%"
                            placeholder="请选择字段查询条件"
                            clearable
                        >
                            <el-option
                                v-for="item in typeSearchOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                                :disabled="
                  (row.fieldType!=='string'&&item.value==='LIKE')||
                    ((row.fieldType!=='int'&&row.fieldType!=='time.Time'&&row.fieldType!=='float64')&&(item.value==='BETWEEN' || item.value==='NOT BETWEEN'))
                "
                            />
                        </el-select>
                    </template>

                </el-table-column>
                <el-table-column align="left" label="操作" width="300" fixed="right">
                    <template #default="scope">
                        <el-button

                            type="primary"
                            link
                            icon="edit"
                            @click="editAndAddField(scope.row)"
                        >高级编辑
                        </el-button>
                        <el-button

                            type="primary"
                            link
                            :disabled="scope.$index === 0"
                            @click="moveUpField(scope.$index)"
                        >上移
                        </el-button>
                        <el-button

                            type="primary"
                            link
                            :disabled="(scope.$index + 1) === form.fields.length"
                            @click="moveDownField(scope.$index)"
                        >下移
                        </el-button>
                        <el-popover v-model="scope.row.visible" placement="top">
                            <p>确定删除吗？</p>
                            <div style="text-align: right; margin-top: 8px;">
                                <el-button type="primary" link @click="scope.row.visible = false">取消</el-button>
                                <el-button type="primary" @click="deleteField(scope.$index)">确定</el-button>
                            </div>
                            <template #reference>
                                <el-button type="primary" link icon="delete" @click="scope.row.visible = true">删除
                                </el-button>
                            </template>
                        </el-popover>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 组件列表 -->
            <div class="gva-btn-list justify-end mt-4">
                <el-button type="primary" @click="enterForm(true)">预览代码</el-button>
                <el-button type="primary" @click="enterForm(false)">生成代码</el-button>
            </div>
        </div>
        <!-- 组件弹窗 -->
        <el-dialog v-model="dialogFlag" width="70%" title="组件内容">
            <FieldDialog ref="fieldDialogNode" :dialog-middle="dialogMiddle" :typeOptions="typeOptions" :typeSearchOptions="typeSearchOptions"/>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="closeDialog">取 消</el-button>
                    <el-button type="primary" @click="enterDialog">确 定</el-button>
                </div>
            </template>
        </el-dialog>

        <el-dialog v-model="previewFlag">
            <template #header>
                <div class="flex items-center py-1.5">
                    <p>操作栏：</p>
                    <el-button type="primary" @click="selectText">全选</el-button>
                    <el-button type="primary" @click="copy">复制</el-button>
                </div>
            </template>
            <template #footer>
                <div class="dialog-footer" style="padding-top:14px;padding-right:14px">
                    <el-button type="primary" @click="previewFlag = false">确 定</el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script setup>

import FieldDialog                                       from './component/fieldDialog.vue'
import {ref, getCurrentInstance, reactive, watch, toRaw} from 'vue'
import {useRoute, useRouter}                             from 'vue-router'
import {ElMessage}                                       from 'element-plus'

const typeOptions = ref([
    {
        label: '字符串',
        value: 'string'
    },
    {
        label: '富文本',
        value: 'richtext'
    },
    {
        label: '整型',
        value: 'int'
    },
    {
        label: '布尔值',
        value: 'bool'
    },
    {
        label: '浮点型',
        value: 'float64'
    },
    {
        label: '时间',
        value: 'time.Time'
    },
    {
        label: '枚举',
        value: 'enum'
    },
    {
        label: '单图片（字符串）',
        value: 'picture',
    },
    {
        label: '多图片（json字符串）',
        value: 'pictures',
    },
    {
        label: '文件（json字符串）',
        value: 'file',
    }
])

const typeSearchOptions = ref([
    {
        label: '=',
        value: '='
    },
    {
        label: '<>',
        value: '<>'
    },
    {
        label: '>',
        value: '>'
    },
    {
        label: '<',
        value: '<'
    },
    {
        label: 'LIKE',
        value: 'LIKE'
    },
    {
        label: 'BETWEEN',
        value: 'BETWEEN'
    },
    {
        label: 'NOT BETWEEN',
        value: 'NOT BETWEEN'
    }
])

const fieldTemplate = {
    fieldName: '',
    fieldDesc: '',
    fieldType: '',
    dataType: '',
    fieldJson: '',
    columnName: '',
    dataTypeLong: '',
    comment: '',
    require: false,
    sort: false,
    errorText: '',
    clearable: true,
    fieldSearchType: '',
    dictType: ''
}
const route = useRoute()
const router = useRouter()
const activeNames = reactive([])
const preViewCode = ref({})
const dbform = ref({
    businessDB: '',
    dbName: '',
    tableName: ''
})
const tableOptions = ref([])
const addFlag = ref('')
const fdMap = ref({})
const form = ref({
    fileName: '',
    tableName: '',
    fields: []
})
const rules = ref({
    structName: [
        {required: true, message: '请输入结构体名称', trigger: 'blur'}
    ],
    abbreviation: [
        {required: true, message: '请输入结构体简称', trigger: 'blur'}
    ],
    description: [
        {required: true, message: '请输入结构体描述', trigger: 'blur'}
    ],
    packageName: [
        {
            required: true,
            message: '文件名称：sysXxxxXxxx',
            trigger: 'blur'
        }
    ],
    package: [
        {required: true, message: '请选择package', trigger: 'blur'}
    ]
})
const dialogMiddle = ref({})
const bk = ref({})
const dialogFlag = ref(false)
const previewFlag = ref(false)
const previewNode = ref(null)
const selectText = () => {
    previewNode.value.selectText()
}
const copy = () => {
    previewNode.value.copy()
}
const editAndAddField = (item) => {
    dialogFlag.value = true
    if(item) {
        addFlag.value = 'edit'
        bk.value = JSON.parse(JSON.stringify(item))
        dialogMiddle.value = item
    } else {
        addFlag.value = 'add'
        dialogMiddle.value = JSON.parse(JSON.stringify(fieldTemplate))
    }
}
const moveUpField = (index) => {
    if(index === 0) {
        return
    }
    const oldUpField = form.value.fields[index - 1]
    form.value.fields.splice(index - 1, 1)
    form.value.fields.splice(index, 0, oldUpField)
}
const moveDownField = (index) => {
    const fCount = form.value.fields.length
    if(index === fCount - 1) {
        return
    }
    const oldDownField = form.value.fields[index + 1]
    form.value.fields.splice(index + 1, 1)
    form.value.fields.splice(index, 0, oldDownField)
}

const currentInstance = getCurrentInstance()
const enterDialog = () => {
    currentInstance.refs.fieldDialogNode.fieldDialogFrom.validate(valid => {
        if(valid) {
            console.log()
            if(addFlag.value === 'add') {
                form.value.fields.push(dialogMiddle.value)
            }
            dialogFlag.value = false
        } else {
            return false
        }
    })

}
const closeDialog = () => {
    if(addFlag.value === 'edit') {
        dialogMiddle.value = bk.value
    }
    dialogFlag.value = false
}
const deleteField = (index) => {
    form.value.fields.splice(index, 1)
}
const autoCodeForm = ref(null)
const enterForm = async (isPreview) => {
    if(form.value.fields.length <= 0) {
        ElMessage({
            type: 'error',
            message: '请填写至少一个field'
        })
        return false
    }
    if(
        form.value.fields.some(item => item.fieldName === form.value.structName)
    ) {
        ElMessage({
            type: 'error',
            message: '存在与结构体同名的字段'
        })
        return false
    }

    if(form.value.package === form.value.abbreviation) {
        ElMessage({
            type: 'error',
            message: 'package和结构体简称不可同名'
        })
        return false
    }

    autoCodeForm.value.validate(async valid => {
        if(valid) {
            for (const key in form.value) {
                if(typeof form.value[key] === 'string') {
                    form.value[key] = form.value[key].trim()
                }
            }
            form.value.structName = toUpperCase(form.value.structName)
            form.value.tableName = form.value.tableName.replace(' ', '')
            if(!form.value.tableName) {
                form.value.tableName = toSQLLine(toLowerCase(form.value.structName))
            }
            if(form.value.structName === form.value.abbreviation) {
                ElMessage({
                    type: 'error',
                    message: 'structName和struct简称不能相同'
                })
                return false
            }
            form.value.humpPackageName = toSQLLine(form.value.packageName)
            if(isPreview) {
                const data = await preview(form.value)
                preViewCode.value = data.data.autoCode
                previewFlag.value = true
            } else {
                const data = await createTemp(form.value)
                if(data.headers?.success === 'false') {
                    return
                } else {
                    if(form.value.autoMoveFile) {
                        ElMessage({
                            type: 'success',
                            message: '自动化代码创建成功，自动移动成功'
                        })
                        return
                    }
                    ElMessage({
                        type: 'success',
                        message: '自动化代码创建成功，正在下载'
                    })
                }
                const blob = new Blob([data])
                const fileName = 'ginvueadmin.zip'
                if('download' in document.createElement('a')) {
                    // 不是IE浏览器
                    const url = window.URL.createObjectURL(blob)
                    const link = document.createElement('a')
                    link.style.display = 'none'
                    link.href = url
                    link.setAttribute('download', fileName)
                    document.body.appendChild(link)
                    link.click()
                    document.body.removeChild(link) // 下载完成移除元素
                    window.URL.revokeObjectURL(url) // 释放掉blob对象
                } else {
                    // IE 10+
                    window.navigator.msSaveBlob(blob, fileName)
                }
            }
        } else {
            return false
        }
    })
}

watch(() => route.params.id, () => {
    if(route.name === 'autoCodeEdit') {
        init()
    }
})

</script>

<script>

export default {
    name: 'AutoCode'
}
</script>