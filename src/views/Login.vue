<template>
<div id="login">
    <div class="form-wrap">
    <h2 style="text-align: center;">店铺会员聊天系统</h2>
    <ul class="menu-tab">
        <li
        @click="currentMenu(item.type)"
        :class="{ current: current_menu === item.type }"
        v-for="item in tab_menu"
        :key="item.type"
        >
        {{ item.label }}
        </li>
    </ul>
    <el-form ref="account_form" :model="form" :rules="rules">
        <el-form-item prop="mobile">
            <label class="form-label">手机号</label>
            <el-input v-model="form.mobile"></el-input>
        </el-form-item>
        <el-form-item prop="name" v-if="current_menu === 'register'">
            <label class="form-label">用户名</label>
            <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item prop="password">
            <label class="form-label">密码</label>
            <el-input type="password" v-model="form.password"></el-input>
        </el-form-item>
        <el-form-item prop="passwords" v-if="current_menu === 'register'">
            <label class="form-label">确认密码</label>
            <el-input type="password" v-model="form.passwords"></el-input>
        </el-form-item>
        <el-form-item>
            <el-button
                type="danger"
                @click="submitForm('rules')"
                :disabled="submit_button_disabled"
                :loading="submit_button_loading"
                class="el-button-block"
            >
                {{ current_menu === "login" ? "登录" : "注册" }}
            </el-button>
        </el-form-item>
    </el-form>
    </div>
</div>
</template>
<script>
import { inject, ref } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';
import { ElLoading } from 'element-plus'
import { userLogin,userRegister } from '@/api/user.js'

export default {
    name: "Register",
    data() {
        return {
            rules: {
                mobile: [
                    { required: true, validator: (rule,value,callback)=>{
                        let regPassword = this.validate_phone(value);
                        if (value === "") {
                            callback(new Error("请输入手机号"));
                        } else if (!regPassword) {
                            callback(new Error("手机号格式不正确"));
                        } else {
                            callback();
                        }
                    },trigger: 'blur'}
                ],
                name: [
                    { required: true, message: '请输入昵称',trigger: 'blur'}
                ],
                password: [
                    { required: true, validator: (rule,value,callback) => {
                        if (this.current_menu == "login"){
                            callback();
                        }
                        let regPassword = this.validate_password(value);
                        if (value === "") {
                            callback(new Error("请输入密码"));
                        } else if (!regPassword) {
                            callback(new Error("请输入>=6并且<=20位的密码"));
                        } else {
                            callback();
                        }
                    },trigger: 'blur'}
                ],
                passwords: [
                    { required: true, validator: (rule,value,callback) => {
                        if (this.current_menu == "login"){
                            callback();
                        }
                        let regPassword = this.validate_password(value);
                        const passwordValue = this.form.password;
                        if (value === "") {
                            callback(new Error("请输入密码"));
                        } else if (!regPassword) {
                            callback(new Error("请输入>=6并且<=20位的密码"));
                        } else if (passwordValue && passwordValue !== value) {
                            callback(new Error("两次密码不一致"));
                        } else {
                            callback();
                        }
                    },trigger: 'blur'}
                ],
            },
            form: {
                mobile:"", // 手机号
                name: "", // 用户名
                password: "", // 密码
                passwords: "", // 确认密码
            },
            tab_menu: [
                { type: "login", label: "登录" },
                { type: "register", label: "注册" },
            ],
            current_menu: "login",
        };
    },
    setup() {
        const router = useRouter();
        const message = ref("");
        const handleGoHome = (e) => {
            router.push("/store");
        }
        const handleGoLogin = (e) => {
            router.push("/login");
        }
        return {handleGoHome,handleGoLogin}
    },
    mounted() {
        if (localStorage.getItem("Authorization") === null){
            this.handleGoLogin()
        }
    },
    methods: {
        currentMenu(type){
            this.current_menu = type
        },
        validate_phone(value){
            let regPhone = /^1[345789]{1}\d{9}$/;
            return regPhone.test(value);
        },
        validate_password(value){
            let regPassword = /\S{6,20}$/;
            return regPassword.test(value);
        },
        submitForm(){
            this.$refs.account_form.validate((valid,validObj)=>{
                if (!valid){
                    return false;
                }
                if (this.current_menu == "login"){
                    userLogin({
                        "mobile": this.form.mobile,
                        "password": this.form.password,
                    }).then(result=>{
                        if (result.code == "200"){
                            localStorage.setItem("Authorization", result.data.token);
                            localStorage.setItem("UserId", result.data.userId);
                            this.handleGoHome()
                        }else{
                            ElMessageBox.alert(
                                result.message,
                                "登录异常"
                            )
                        }
                    })
                }else{
                    userRegister({
                        "mobile": this.form.mobile,
                        "name": this.form.name,
                        "password": this.form.password,
                    }).then(result=>{
                        if (result.code == "200"){
                            localStorage.setItem("Authorization", result.data.token);
                            localStorage.setItem("UserId", result.data.userId);
                            this.handleGoHome()
                        }else{
                            ElMessageBox.alert(
                                result.message,
                                '注册异常',
                            )
                        }
                    })
                }
            })
        }
    }
}
</script>

<style scoped lang="css">
#login {
  height: 100vh;
  background-color: #fff;
}
.form-wrap {
  width: 320px;
  padding-top: 100px;
  margin: auto;
}
.menu-tab {
  text-align: center;
  li {
    display: inline-block;
    padding: 10px 24px;
    margin: 0 10px;
    color: #000;
    font-size: 14px;
    border-radius: 5px;
    cursor: pointer;
    &.current {
      background-color: rgba(0, 0, 0, 0.1);
    }
  }
}
.form-label {
  display: block;
  color: #000;
  font-size: 14px;
}
</style>
