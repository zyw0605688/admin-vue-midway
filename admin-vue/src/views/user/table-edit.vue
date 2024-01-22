<template>
	<el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
		<el-form-item label="用户名" prop="username">
			<el-input v-model="form.username"></el-input>
		</el-form-item>
        <el-form-item label="密码" prop="password">
            <el-input v-model="form.password"></el-input>
        </el-form-item>
		<el-form-item label="邮箱" prop="email">
			<el-input v-model="form.email"></el-input>
		</el-form-item>
        <el-form-item label="手机" prop="phone">
            <el-input v-model="form.phone"></el-input>
        </el-form-item>
		<el-form-item>
			<el-button type="primary" @click="saveEdit(formRef)">保 存</el-button>
		</el-form-item>
	</el-form>
</template>

<script lang="ts" setup>
import { ElMessage, FormInstance, FormRules, UploadProps } from 'element-plus';
import { ref } from 'vue';
const emit = defineEmits(["saveEdit"])

const props = defineProps({
	data: {
		type: Object,
		required: true
	},
	edit: {
		type: Boolean,
		required: false
	},
	update: {
		type: Function,
		required: true
	}
});

const defaultData = {
	username: '',
	email: '',
	phone: '',
};

const form = ref({ ...(props.edit ? props.data : defaultData) });

const rules: FormRules = {
	username: [{ required: true, message: '用户名', trigger: 'blur' }]
};
const formRef = ref<FormInstance>();
const saveEdit = (formEl: FormInstance | undefined) => {
	if (!formEl) return;
	formEl.validate(valid => {
		if (!valid) return false;
		props.update(form.value);
        emit("saveEdit",form.value)
		ElMessage.success('保存成功！');
	});
};

</script>

<style>
.avatar-uploader .el-upload {
	border: 1px dashed var(--el-border-color);
	border-radius: 6px;
	cursor: pointer;
	position: relative;
	overflow: hidden;
	transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
	border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
	font-size: 28px;
	color: #8c939d;
	width: 178px;
	height: 178px;
	text-align: center;
}
</style>
