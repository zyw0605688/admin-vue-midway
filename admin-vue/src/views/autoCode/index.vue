<template>
    <div class="mva-container-wrap">
        <div class="mva-search-box">
            <!-- 自动化代码工具 -->
            <el-form ref="autoCodeForm" :model="form" :inline="true" :rules="rules">
                <el-form-item label="文件名称" prop="fileName">
                    <el-input v-model="form.fileName" placeholder="小驼峰写法"/>
                </el-form-item>
                <el-form-item label="TableName" prop="tableName">
                    <el-input v-model="form.tableName" placeholder="指定表名（非必填）"/>
                </el-form-item>
            </el-form>
        </div>
        <!-- 组件列表 -->
        <div class="mva-table-box">
            <div class="mva-btn-list">
                <el-button type="primary" @click="editAndAddField(false)">新增字段</el-button>
            </div>
            <el-table :data="form.fields">
                <el-table-column align="left" type="index" label="序列" width="60"/>
                <el-table-column align="left" prop="fieldName" label="字段名称" width="160">
                    <template #default="{row}">
                        <el-input v-model="row.fieldName"/>
                    </template>
                </el-table-column>
                <el-table-column align="left" prop="comment" label="数据库描述" width="160">
                    <template #default="{row}">
                        <el-input v-model="row.comment"/>
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
                        <el-button type="primary" link icon="edit" @click="editAndAddField(scope.row)">高级编辑
                        </el-button>
                        <el-button type="primary" link :disabled="scope.$index === 0" @click="moveUpField(scope.$index)">
                            上移
                        </el-button>
                        <el-button type="primary" link :disabled="(scope.$index + 1) === form.fields.length" @click="moveDownField(scope.$index)">
                            下移
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
            <div class="create-btn-list">
                <el-button type="primary" @click="createCodeToFile">生成代码</el-button>
            </div>
        </div>
        <!-- 组件弹窗 -->
        <el-dialog v-model="dialogFlag" width="70%" title="组件内容">
            <FieldDialog ref="fieldDialogNode" :dialog-middle="dialogMiddle" :typeOptions="typeOptions" :typeSearchOptions="typeSearchOptions"/>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="dialogFlag = false">取 消</el-button>
                    <el-button type="primary" @click="enterDialog">确 定</el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script setup>
import FieldDialog from './component/fieldDialog.vue'
import {ref, getCurrentInstance} from 'vue'

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
const formFlag = ref('')
const form = ref({
    fileName: '',
    tableName: '',
    fields: []
})
const rules = ref({
    fileName: [
        {required: true, message: '请输入文件名称', trigger: 'blur'}
    ],
})
const dialogMiddle = ref({})
const dialogFlag = ref(false)
const editAndAddField = (item) => {
    dialogFlag.value = true
    if(item) {
        formFlag.value = 'edit'
        dialogMiddle.value = item
    } else {
        formFlag.value = 'add'
        dialogMiddle.value = JSON.parse(JSON.stringify(fieldTemplate))
    }
    console.log("formFlag:", formFlag.value)
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
            if(formFlag.value === 'add') {
                form.value.fields.push(currentInstance.refs.fieldDialogNode.middleDate)
            }
            dialogFlag.value = false
        } else {
            return false
        }
    })
}
const deleteField = (index) => {
    form.value.fields.splice(index, 1)
}
const createCodeToFile = async () => {
    console.log(form.value)
}
</script>
<style lang="scss" scoped>
.create-btn-list {
    float: right;
    padding-top: 13px;
}
</style>
