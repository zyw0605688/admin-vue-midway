<template>
    <div>
        <el-form
            ref="fieldDialogFrom"
            :model="middleDate"
            :rules="rules"
            label-width="120px"
            label-position="right"
            class="grid grid-cols-2"
        >
            <el-form-item label="字段" prop="fieldName">
                <el-input v-model="middleDate.fieldName" autocomplete="off"/>
            </el-form-item>
            <el-form-item label="字段描述" prop="comment">
                <el-input v-model="middleDate.comment" autocomplete="off"/>
            </el-form-item>
            <el-form-item label="字段类型" prop="fieldType">
                <el-select
                    v-model="middleDate.fieldType"
                    style="width:100%"
                    placeholder="请选择字段类型"
                    clearable
                    @change="clearOther"
                >
                    <el-option
                        v-for="item in typeOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                        :disabled="item.disabled"
                    />
                </el-select>
            </el-form-item>
            <el-form-item :label="middleDate.fieldType === 'enum' ? '枚举值' : '类型长度'" prop="dataTypeLong">
                <el-input v-model="middleDate.dataTypeLong" :placeholder="middleDate.fieldType === 'enum'?`例:'北京','天津'`:'数据库类型长度'"/>
            </el-form-item>
            <el-form-item label="字段查询条件" prop="fieldSearchType">
                <el-select
                    v-model="middleDate.fieldSearchType"
                    style="width:100%"
                    placeholder="请选择字段查询条件"
                    clearable
                >
                    <el-option
                        v-for="item in typeSearchOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                        :disabled="canSelect(item.value)"
                    />
                </el-select>
            </el-form-item>
            <el-form-item label="是否必填">
                <el-switch v-model="middleDate.require"/>
            </el-form-item>
            <el-form-item label="是否可清空">
                <el-switch v-model="middleDate.clearable"/>
            </el-form-item>
        </el-form>
    </div>
</template>

<script setup>
import {onMounted, ref, watch} from 'vue'

const props = defineProps({
    dialogMiddle: {
        type: Object,
        default: function () {
            return {}
        }
    },
    typeOptions: {
        type: Array,
        default: function () {
            return []
        }
    },
    typeSearchOptions: {
        type: Array,
        default: function () {
            return []
        }
    },
})

const middleDate = ref({})

const rules = ref({
    fieldName: [
        {required: true, message: '请输入字段英文名', trigger: 'blur'}
    ],
    fieldType: [
        {required: true, message: '请选择字段类型', trigger: 'blur'}
    ]
})


watch(() => props.dialogMiddle, (val) => {
    middleDate.value = props.dialogMiddle
}, {
    deep: true,
    immediate: true
})


const canSelect = (item) => {
    const fieldType = middleDate.value.fieldType
    if(fieldType !== 'string' && item === 'LIKE') {
        return true
    }
    return (fieldType !== 'int' && fieldType !== 'time.Time' && fieldType !== 'float64') && (item === 'BETWEEN' || item === 'NOT BETWEEN');

}

const clearOther = () => {
    middleDate.value.fieldSearchType = ''
    middleDate.value.dictType = ''
}

const fieldDialogFrom = ref(null)
defineExpose({fieldDialogFrom, middleDate})
</script>

<script>

export default {
    name: 'FieldDialog'
}
</script>
