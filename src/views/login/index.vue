<script setup lang="ts">
import { onMounted, ref, onUnmounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useMessage, NButton, NInput, NImage, NModal, NCard, NSpin } from "naive-ui";
import { LoginFrom } from "@/typings/user";
import Crypto from "@/utils/crypto";
import {
	getConfigKey,
	getMpQrCode,
	getLoginType,
	authSystem,
} from "@/api/user";
import { useUserStore } from "@/store/modules/user";
import to from "await-to-js";
import { useI18n } from "vue-i18n";
import { useBasicLayout } from "@/hooks/useBasicLayout";
const { isMobile } = useBasicLayout();
const { t } = useI18n();

const userStore = useUserStore();
const router = useRouter();
const route = useRoute();
const message = useMessage();
const user = ref<LoginFrom>(Object.create(null));

// 点击登录
let loginLoading = ref(false);
let loading = ref(false);
async function handleValidateButtonClick(e: MouseEvent) {
	e&&e.preventDefault();
	const { username, password } = user.value;
	// if (!validateAccount(username)) {
	// 	message.error(t("login.accountFormatError"));
	// 	return;
	// }
	if (username && password) {
		loginLoading.value = true;
		const [err] = await to(userStore.userLogin(user.value));
		if (!err) {
			message.success(t("login.loginSuccess"));
			await router.push("/");
			loginLoading.value = false;
			loading.value = false
		} else {
			message.error(err.message);
			loginLoading.value = false;
			loading.value = false
		}
	} else {
		message.error(t("login.usernameOrPasswordEmpty"));
	}
}

function validateAccount(account: string) {
	if (!account) {
		return false;
	}
	const phoneRegex = /^1[3456789]\d{9}$/;
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(account) || phoneRegex.test(account);
}

const handleRegistBtnClick = async (e: MouseEvent) => {
	router.push("/regist");
};

const copyright = ref("");

const logo = ref("");

const activate = ref(false);

const code = ref("");

const thridLogin = ref(false);

// 在组件挂载后执行异步操作
onMounted(async () => {
	console.log("onMounted", route.query);
	const { oauth } = route.query
	if (oauth){
		thridLogin.value = true
		const res = Crypto.AesDecrypt(oauth)
		const { u, p } = JSON.parse(res)
		user.value.username = u
		user.value.password = p
		loading.value = true
		handleValidateButtonClick()
	}

	const [err, res] = await to(getConfigKey("copyright"));
	if (err) {
		console.error("获取配置失败", err.message);
	} else {
		copyright.value = res.msg;
	}
});

const activeTab = ref("login");

const showModal = ref(false);

// 登录二维码
const qrCode = ref("");
const ticket = ref("");

let intervalId: string | number | NodeJS.Timer | undefined;
// 定义轮询间隔时间，例如每3秒轮询一次
const POLLING_INTERVAL = 3000;

async function handleWxLogin() {
	
	showModal.value = true
	//获取二维码信息
	const [err1, res1] = await to(getMpQrCode());
	if (err1) {
		message.error("获取二维码失败: " + err1.message);
	} else {
		qrCode.value = res1.data.qrCodeUrl;
		ticket.value = res1.data.ticket;
		intervalId = setInterval(slectLoginType, POLLING_INTERVAL);
	}
	
}

// 1. 定时查询是否登录成功
async function slectLoginType() {
	const [err, res] = await to(getLoginType(ticket.value));
	if (!err) {
		console.log("res.token", res);
		if (res.data.token) {
			// 2. 登录成功,保存token
			userStore.userQrLogin(res.data.token);
			clearInterval(intervalId);
			// 3. 跳转到主页
			message.success(t("login.loginSuccess"));
			await router.push("/");
		}
	}
}

onUnmounted(() => {
	// 页面组件卸载前清除定时器，避免内存泄漏
	if (intervalId !== undefined) {
		clearInterval(intervalId);
	}
});
</script>

<template>
	<div id="app">
		<div class="login-container">
			<div class="login-content">
				<!-- Logo -->
				<div class="logo-container">
					<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none">
						<path d="M24 4L35.8 10.5V23.5L24 30L12.2 23.5V10.5L24 4Z" stroke="#1677FF" stroke-width="2"/>
						<text x="20" y="22" fill="#1677FF" font-size="16">AI</text>
					</svg>
				</div>

				<!-- Title and Subtitle -->
				<div class="title-container">
					<h1 class="main-title">AI 知识库</h1>
					<p class="subtitle">知识的力量，智慧的源泉</p>
				</div>

				<!-- Login Form -->
				<div class="login-form">
					<div class="input-group">
						<input 
							v-model="user.username"
							type="text"
							placeholder="请输入账号"
							class="login-input"
						/>
					</div>
					<div class="input-group">
						<input 
							v-model="user.password"
							type="password"
							placeholder="请输入密码"
							class="login-input"
						/>
					</div>
					<button 
						class="login-button"
						:loading="loginLoading"
						@click="handleValidateButtonClick"
					>
						登录
					</button>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
#app {
	display: flex;
	align-items: center;
	justify-content: center;
	min-height: 100vh;
	background-color: #ffffff;
}

.login-container {
	width: 100%;
	max-width: 400px;
	padding: 20px;
}

.login-content {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 24px;
}

.logo-container {
	margin-bottom: 16px;
}

.title-container {
	text-align: center;
	margin-bottom: 32px;
}

.main-title {
	font-size: 28px;
	font-weight: 600;
	color: #333;
	margin-bottom: 8px;
}

.subtitle {
	font-size: 16px;
	color: #666;
}

.login-form {
	width: 100%;
	display: flex;
	flex-direction: column;
	gap: 16px;
}

.input-group {
	width: 100%;
}

.login-input {
	width: 100%;
	height: 40px;
	padding: 8px 12px;
	border: 1px solid #e5e7eb;
	border-radius: 8px;
	font-size: 14px;
	color: #333;
	background-color: #fff;
	transition: all 0.3s;
}

.login-input:focus {
	outline: none;
	border-color: #1677FF;
	box-shadow: 0 0 0 2px rgba(22, 119, 255, 0.1);
}

.login-input::placeholder {
	color: #9ca3af;
}

.login-button {
	width: 100%;
	height: 40px;
	background-color: #1677FF;
	color: white;
	border: none;
	border-radius: 8px;
	font-size: 16px;
	font-weight: 500;
	cursor: pointer;
	transition: background-color 0.3s;
}

.login-button:hover {
	background-color: #0958d9;
}

.login-button:active {
	background-color: #0958d9;
}

.login-button[loading] {
	opacity: 0.7;
	cursor: not-allowed;
}
</style>
