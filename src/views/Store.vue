<template>
    <el-row id="head-menu">
        <el-col :span="12">
            <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
                <el-menu-item index="chat">消息中心</el-menu-item>
                <el-menu-item index="people">联系人</el-menu-item>
                <el-menu-item index="store">店铺列表</el-menu-item>
            </el-menu>
        </el-col>
        <el-col :span="12">
            <el-header style="text-align: right; font-size: 12px">
                <div class="toolbar">
                    <el-text class="mx-1" type="primary" style="margin-right: 10px;">{{ message }}</el-text>
                    
                    <ElButton type="primary" style="margin-right: 10px;" @click="reconnect('正在退出中...')">退出登录</ElButton>
                    <div>
                        <span style=" margin-right: 10px;margin-left: 10px;">{{ user.name }}</span>
                        <el-avatar size="default" fit="fit"> {{ user.name }} </el-avatar>
                    </div>
                </div>
            </el-header>
        </el-col>
    </el-row>

    <!-- 店铺列表中心 -->
    <el-row id="store-item" v-show="checkActiveShow('store')">
        <el-col :span="24">
            <el-scrollbar height="600px" view-style="display: flex !important;padding-left:20px" style="background: rgba(244, 244, 245,0.5);">
                <el-row :gutter="20" style="width: 100%;">
                    <el-col :span="12"  v-for="(item,idx) in storeItem.rows" :key="idx" style="margin-bottom: 10px;">
                        <el-card class="box-card" shadow="hover">
                            <template #header>
                            <div class="card-header">
                                <el-avatar size="large" fit="fit"> {{ item.name }} </el-avatar>
                                <template v-if="checkJoin(item) == 0">
                                    <el-button style="float: right; padding: 3px 0" type="text" @click="memberJoin(item)">成为会员</el-button>
                                </template>
                                <template v-else-if="checkJoin(item) == 1">
                                    <el-button style="float: right; padding: 3px 0" type="text">我的店铺</el-button>
                                </template>
                            </div>
                            </template>
                            <el-row class="text item">
                                <el-col :span="7">店铺名</el-col>
                                <el-col :span="1"><el-divider direction="vertical"></el-divider></el-col>
                                <el-col :span="15"><el-row type="flex" class="row-bg" justify="end">{{ item.name }}</el-row></el-col>
                            </el-row>
                            <el-divider></el-divider>
                            <el-row class="text item">
                                <el-col :span="7">人数</el-col>
                                <el-col :span="1"><el-divider direction="vertical"></el-divider></el-col>
                                <el-col :span="15"><el-row type="flex" class="row-bg" justify="end">{{ item.contacts }} / 50</el-row></el-col>
                            </el-row>
                            <el-divider></el-divider>
                            <el-row class="text item">
                                <el-col :span="7">店铺描述</el-col>
                                <el-col :span="1"><el-divider direction="vertical"></el-divider></el-col>
                                <el-col :span="15" style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">{{ item.desc }}</el-col>
                            </el-row>
                        </el-card>
                    </el-col>
                </el-row>
            </el-scrollbar>
        </el-col>
        <el-divider></el-divider>
    </el-row>
    
    <!-- 联系人中心 -->
    <el-row id="people" v-show="checkActiveShow('people')" style="height: 600px;">
        <el-col :span="6" style="height: 100%;">
            <el-menu :default-openeds="defaultOpeneds" style="height:100%;">
                <el-sub-menu index="1">
                    <template #title>
                        <el-icon></el-icon>我的店铺
                    </template>
                    <el-menu-item-group v-for="(item,k) in myApp.myStore" :key="item.storeId" style="position: relative;">
                        <el-menu-item :index="parseInt(k)" @click="handleStoreInfo(parseInt(k),'1')" class="store-item">
                            <el-row style="width: 100%;" justify="center" class="store-row">
                                <el-col :span="4"></el-col>
                                <el-col :span="6">
                                    <el-avatar shape="square" size="number" fit="fit" icon="el-icon-picture-outline-round"> {{ item.avatar }} </el-avatar>
                                </el-col>
                                <el-col :span="14" class="tag">
                                    {{ item.name }}
                                </el-col>
                            </el-row>
                        </el-menu-item>
                    </el-menu-item-group>
                </el-sub-menu>
                <el-sub-menu index="2">
                    <template #title>
                        <el-icon></el-icon>好友
                    </template>
                    <el-menu-item-group>
                        
                    </el-menu-item-group>
                </el-sub-menu>
                <el-sub-menu index="3">
                    <template #title>
                        <el-icon><icon-menu /></el-icon>会员店铺
                    </template>
                    <el-menu-item-group v-for="(item,k) in myApp.storeItem" :key="item.storeId" style="position: relative;">
                        <el-menu-item :index="parseInt(k)" @click="handleStoreInfo(parseInt(k),'3')" class="store-item">
                            <el-row style="width: 100%;" justify="center" class="store-row">
                                <el-col :span="4"></el-col>
                                <el-col :span="6">
                                    <el-avatar shape="square" size="number" fit="fit" icon="el-icon-picture-outline-round"> {{ item.avatar }} </el-avatar>
                                </el-col>
                                <el-col :span="14" class="tag">
                                    {{ item.name }}
                                </el-col>
                            </el-row>
                        </el-menu-item>
                    </el-menu-item-group>
                </el-sub-menu>
            </el-menu>
        </el-col>
        <el-col :span="18" style="height: 100%;">
            <el-container>
                <el-header class="info" :class="myApp.myStoreClass">
                    <el-row type="flex" class="row-bg" justify="center">
                        <el-col>
                            <el-row type="flex" class="row-bg" justify="center"><el-avatar size="number" fit="fit" icon="el-icon-picture-outline-round"> {{ myApp.action.avatar }} </el-avatar></el-row>
                        </el-col>
                        <el-col style="margin: 10px 0">
                            <el-row type="flex" class="row-bg" justify="center">{{ myApp.action.name }}</el-row>
                        </el-col>
                        <el-col>
                            <el-row type="flex" class="row-bg" justify="center"><el-button round><i class="el-icon-chat-dot-round"></i>进入群聊</el-button></el-row>
                        </el-col>
                    </el-row>
                </el-header>
                <el-main class="detail">
                    <el-row type="flex" class="row-bg" justify="center">
                        <el-col :span="24">
                            <el-card class="box-card" shadow="hover">
                                <template v-if="myApp.myStoreShow">
                                    <el-row class="text item">
                                        <el-col :span="7">店长</el-col>
                                        <el-col :span="1"><el-divider direction="vertical"></el-divider></el-col>
                                        <el-col :span="15"><el-row type="flex" class="row-bg" justify="end">{{ myApp.action.storeUser.name }}</el-row></el-col>
                                    </el-row>
                                    <el-divider></el-divider>
                                </template>
                                <el-row class="text item">
                                    <el-col :span="7">店铺名</el-col>
                                    <el-col :span="1"><el-divider direction="vertical"></el-divider></el-col>
                                    <el-col :span="15"><el-row type="flex" class="row-bg" justify="end">{{ myApp.action.name }}</el-row></el-col>
                                </el-row>
                                <el-divider></el-divider>
                                <el-row class="text item">
                                    <el-col :span="7">人数</el-col>
                                    <el-col :span="1"><el-divider direction="vertical"></el-divider></el-col>
                                    <el-col :span="15"><el-row type="flex" class="row-bg" justify="end">{{ myApp.action.contacts }} / 50</el-row></el-col>
                                </el-row>
                                <el-divider></el-divider>
                                <el-row class="text item">
                                    <el-col :span="7">店铺描述</el-col>
                                    <el-col :span="1"><el-divider direction="vertical"></el-divider></el-col>
                                    <el-col :span="15" style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">{{ myApp.action.desc }}</el-col>
                                </el-row>
                            </el-card>
                        </el-col>
                    </el-row>
                </el-main>
            </el-container>
        </el-col>
        <el-divider></el-divider>
    </el-row>

    <!-- 消息中心 -->
    <el-row id="chat" v-show="checkActiveShow('chat')"  style="height: 600px;">
        <el-col :span="6" style="height: 100%;" id="store-chat">
            <el-menu style="height:100%;">
                <el-menu-item v-for="item in storeChatItems.items" :key="item.storeId" class="store-item" @click="enterChat(item)">
                    <el-row style="width: 100%;" justify="center" class="store-row">
                        <el-col :span="6">
                            <el-avatar shape="square" size="number" fit="fit" > {{ item.storeName }} </el-avatar>
                        </el-col>
                        <el-col :span="18" class="tag">
                            <el-row :justify="center" :align="middle" style="height: 100%;padding: 10px 0">
                                <el-col>{{ item.storeName }}</el-col>
                                <el-col style="font-size: 12px;color: #C0C4CC">{{ item.message }}</el-col>
                            </el-row>
                        </el-col>
                    </el-row>
                </el-menu-item>
            </el-menu>
        </el-col>
        <!-- 聊天记录 -->
        <el-col :span="18" style="height: 100%;">
            <el-row>
                <el-col style="height: 50px;line-height: 50px;padding: 0 20px">{{ chatDetail.name }}</el-col>
                <el-divider style="margin: 0px"></el-divider>
            </el-row>
            <el-row style="height: calc(100% - 52px);">
                <el-col :span="18" style="height: 100%;">
                    <!-- 消息信息 -->
                    <el-row style="height: 80%;">
                        <el-col>
                            <el-scrollbar ref="scrollbar" style="margin-top: 1px ;" always @scroll="scroll" height="438">
                                    <div class="loading-chat" v-show="loading">-- 加载更多 --</div>
                                    <div class="content" ref="content">
                                        <div v-for="item,$index in chatDetail.items" :key="$index" ref="innerRef">
                                            <!-- 左边 -->
                                            <div v-if="user.uid != item.userId" style="margin-left: 10px;margin-bottom: 8px;">
                                                <el-row class="row-bg" type="flex" align="middle">
                                                    <el-avatar size="default" shape="square" fit="fit">{{ item.userName }}</el-avatar>
                                                    <span style="margin-left: 10px">{{ item.createAt }}</span>
                                                </el-row>

                                                <el-row>
                                                    <el-col :span="1000" :offset="1" class="msg">
                                                        {{ item.message }}
                                                    </el-col>
                                                </el-row>
                                            </div>

                                            <!-- 右边 -->
                                            <div v-else style="margin-right: 10px;margin-bottom: 8px;">
                                                <el-row class="row-bg" type="flex" justify="end" align="middle">
                                                    <span style="margin-right: 10px">{{ item.createAt }}</span>
                                                    <el-avatar size="default" shape="square" fit="fit"> {{ user.name }} </el-avatar>
                                                </el-row>

                                                <el-row justify="end">
                                                    <el-col :span="1000" class="msg2" style="margin-right: 20px;">
                                                        {{ item.message }}
                                                    </el-col>
                                                </el-row>
                                            </div>
                                        </div>
                                    </div>
                            </el-scrollbar>
                        </el-col>
                    </el-row>
                    <el-divider style="margin: 0px"></el-divider>
                    <!-- 输入框 -->
                    <el-row style="height: calc(20% - 2px);">
                        
                    </el-row>
                </el-col>
                <el-col :span="6" style="height: 100%;border-left: 1px var(--el-border-color) var(--el-border-style);">

                </el-col>
            </el-row>
        </el-col>
        
        
        <el-divider style="margin: 0px"></el-divider>
    </el-row>
</template>
<style>
.el-badge__content.is-fixed{
    top:18px !important;
}
.store-item-check{
    background-color: #F2F6FC;
}
.store-row *{
    vertical-align: middle !important;
}
#chat #store-chat .el-menu-item .tag .el-col{
    height: 20px;
    line-height: 20px;
    white-space: nowrap;          /* 不换行 */
    overflow: hidden;             /* 超出隐藏 */
    text-overflow: ellipsis;      /* 用省略号表示超出部分 */
}
.el-menu-item-group__title {
    padding: 0 !important;
}

.msg {
    background-color: #12B7F5;
    /* box-shadow: rgba(18, 23, 45, 0.6) 0px 8px 24px; */
    border-radius: 4px;
    padding: 10px;
    font-size: 18px;
    line-height: 16px;
    /* width: auto; */
    /* max-width: 330px; */
    margin-top: 20px;
    color: white;
}

.msg2 {
    background-color: #12B7F5;
    /* box-shadow: rgba(18, 23, 45, 0.6) 0px 8px 24px; */
    border-radius: 4px;
    padding: 10px;
    font-size: 18px;
    line-height: 16px;
    /* width: auto; */
    /* max-width: 330px; */
    margin-top: 20px;
    color: white;
}
.chat-container {
  max-height: 438px;
  overflow-y: auto; /* 确保父元素可以滚动 */
}
.loading-chat{
    text-align: center;
    font-size: 12px;
    color: #909399;
    padding: 10px;
}
</style>
<script>
import { ref,onMounted, nextTick } from 'vue';
import { ElMessage,ElLoading,ElMessageBox  } from 'element-plus'
import { userInfo } from '@/api/user.js'
import { storeItem,storeInfo,memberJoin,initChatLog,getChatLog } from '@/api/store.js'
import { socketManager } from '../assets/socket.js';
let  ws = ref(socketManager.getSocket()).value;
export default {
    setup(props,context) {
        
    },
    name: "Store",
    components: {
    },
    watch:{
        storeChatItems: {
            handler(newValue, oldValue) {
                // console.log('storeChatItems has changed:', newValue);
            },
            deep: true, // 深度观察，监听对象内部的变化
        },
        'chatDetail.items':{
            handler(newValue, oldValue) {
                this.$nextTick(() => {
                    this.scrollToBottom()
                });


                if (newValue.length > 0){
                    this.chatDetail.timestamp = newValue[0].timestamp
                }
            },
            deep: true, // 深度观察，监听对象内部的变化
        },
    },
    data() {
        return {
            loading: false,
            message: "待连接...",
            activeIndex: "people",
            defaultOpeneds:["1"],
            user:{
                uid: localStorage.getItem("UserId"),
                name:"",
                mobile: "",
                avatar:"",
            },
            storeItem:{
                total:0,
                page:0,
                limit:0,
                current:0,
                rows:[],
            },
            chatLogPage:{
                initPage:0,
                msgPage:0,
            },
            storeChatItems:{
                total:0,
                sum:0,
                items:[],
            },
            chatDetail:{
                scrollTop:0,
                initStatus:0,
                noMore:false,
                name:"",
                storeId:"",
                timestamp:"",
                items:[],
            },
            myApp:{
                friend:[],
                storeItem:[],
                myStore:[],
                myStoreClass:'',
                myStoreShow:false,
                action:{
                    avatar:"",
                    name:"",
                    contacts:0,
                    desc:"",
                    storeUser:{},
                },

            }
        };
    },
    //watch 中的函数, 给一个变量发送变化的回调函数, 如果变
    mounted() {
        this.goLogin()

        this.getUserInfo()
        this.getMyStore()
        this.getStoreList(this.activeIndex)
        this.initChat()

        setTimeout(()=>{
            if (this.myApp.myStoreShow){
                this.defaultOpeneds = ["1"]
                this.handleStoreInfo(0,'1')
            }else{
                this.defaultOpeneds = ["3"]
                if (this.myApp.storeItem.length > 0){
                    this.handleStoreInfo(0,'3')
                }
            }
        },500)

        setTimeout(()=>{
            // this.initWs()
        },700)
    },
    computed: {
        
    },
    methods: {

        // 校验是否登录状态
        goLogin(){
            if (localStorage.getItem("Authorization") == null || localStorage.getItem("Authorization") == "null"  || localStorage.getItem("Authorization") == "undefined"){
                socketManager.close();
                this.$router.push("/login");
                return;
            }
        },

        // 获取用户信息
        getUserInfo(){
            userInfo({
                "userId": this.user.uid
            }).then(result=>{
                if (result.code == "200"){
                    this.user.name = result.data.name
                    this.user.mobile = result.data.mobile
                    this.user.avatar = result.data.avatar
                }else{
                    ElMessageBox.alert(
                        result.message,
                        "用户信息"
                    )
                }
            })
        },

        // 获取我的店铺
        getMyStore(){
            storeInfo({
                "userId":this.user.uid
            }).then(result=>{
                if (result.code == "200"){
                    this.myApp.myStore = []
                    this.myApp.myStore.push(result.data)
                    this.myApp.myStoreClass = 'el-myStore'
                    this.myApp.myStoreShow = true
                }else if (result.code == "10202"){
                    this.myApp.myStoreClass = ''
                    this.myApp.myStoreShow = false
                    this.defaultOpeneds = ["3"]
                }else{
                    ElMessageBox.alert(
                        result.message,
                        "我的店铺"
                    )
                }
            })
        },
        
        // 获取店铺列表
        getStoreList(active){
            var userId = "0"
            if (active === "people"){
                userId = this.user.uid
            }
            storeItem({
                "userId":userId
            }).then(result=>{
                if (result.code == "200"){
                    switch (active){
                        case "chat":
                            break;
                        case "people":
                            this.myApp.storeItem = result.data.rows
                            break;
                        case "store":
                            this.storeItem = result.data
                        break;
                    }
                }else{
                    ElMessageBox.alert(
                        result.message,
                        "店铺列表"
                    )
                }
            })
        },

        // 获取消息列表
        initChat(){
            initChatLog({
                "userId":this.user.uid,
                "offset":this.chatLogPage.initPage,
            }).then(result=>{
                if (result.code == "200"){
                    this.chatLogPage.initPage = result.data.page
                    this.storeChatItems.total = result.data.total
                    this.storeChatItems.items = this.storeChatItems.items.concat(result.data.rows)
                    this.storeChatItems.sum = this.storeChatItems.items.length
                }else{
                    ElMessageBox.alert(
                        result.message,
                        "消息列表"
                    )
                }
            })
        },
        
        // 获取店铺聊天消息
        getChat(type=""){
            getChatLog({
                "storeId":this.chatDetail.storeId,
                "offset":1,
                "timestamp":this.chatDetail.timestamp,
            }).then(result=>{
                if (result.code == "200"){
                    if (result.data.total == 0){
                        this.chatDetail.noMore = true
                    }
                    result.data.rows.forEach((element,index) => {
                        this.chatDetail.items.unshift(element)
                    });

                    if (type == "init"){
                        this.chatDetail.initStatus = 0
                    }else{
                        this.chatDetail.initStatus = 1
                    }
                }else{
                    ElMessageBox.alert(
                        result.message,
                        "聊天记录"
                    )
                }
                this.loading = false
            })
        },
        // 切换店铺聊天消息
        enterChat(item){
            this.chatDetail={
                initStatus:0,
                noMore:false,
                name:"",
                storeId:"",
                timestamp:"",
                items:[],
            }
            this.chatDetail.name = item.storeName
            this.chatDetail.storeId = item.storeId
            this.chatDetail.timestamp = item.timestamp + 1 // 把最新一条也拿出来，所以要+1
            this.getChat("init")
        },

        // 切换当前显示标题
        handleSelect(key, keyPath) {
            this.activeIndex = key;
            switch (key){
                case "chat":
                    break;
                case "people":
                    // this.getStoreList(key)
                    this.getMyStore()
                    this.getStoreList(key)

                    setTimeout(()=>{
                        if (this.myApp.myStoreShow){
                            this.defaultOpeneds = ["1"]
                            this.handleStoreInfo(0,'1')
                        }else{
                            this.defaultOpeneds = ["3"]
                            if (this.myApp.storeItem.length > 0){
                                this.handleStoreInfo(0,'3')
                            }
                        }
                    },500)
                    break;
                case "store":
                    this.getStoreList(key)
                break;
            }
        },

        // 切换联系人当前显示
        checkActiveShow(key){
            if (this.activeIndex === key){
                return true
            }else{
                return false
            }
        },


        // 切换店铺明细
        handleStoreInfo(idx,action){
            if (action == 1){
                this.myApp.myStoreClass = 'el-myStore'
                this.myApp.myStoreShow = true
                this.myApp.action = {
                    avatar:this.myApp.myStore[idx].avatar,
                    name:this.myApp.myStore[idx].name,
                    contacts:this.myApp.myStore[idx].contacts,
                    desc:this.myApp.myStore[idx].desc,
                    storeUser:this.myApp.myStore[idx].storeUser,
                }
            }else if (action == 3){
                this.myApp.myStoreClass = ''
                this.myApp.myStoreShow = false
                this.myApp.action = {
                    avatar:this.myApp.storeItem[idx].avatar,
                    name:this.myApp.storeItem[idx].name,
                    contacts:this.myApp.storeItem[idx].contacts,
                    desc:this.myApp.storeItem[idx].desc,
                }
            }
            
        },

        // 加入店铺会员
        checkJoin(store){
            let type = 0
            for (var i in this.myApp.myStore){
                let item = this.myApp.myStore[i]
                if (item.storeId === store.storeId){
                    type = 1
                    break;
                }
            }
            if (type != 0){
                return type
            }
            for (var ii in this.myApp.storeItem){
                let item = this.myApp.storeItem[ii]
                if (item.storeId === store.storeId){
                    type = 2
                    break;
                }
            }
            return type
        },
        
        // 店铺列表校验是否已成为会员
        memberJoin(store){
            memberJoin({
                "storeId":store.storeId
            }).then(result=>{
                if (result.code == "200"){
                    this.handleSelect("people");
                }else{
                    ElMessageBox.alert(
                        result.message,
                        "店铺列表"
                    )
                }
            })
        },

        // 聊天信息变动
        scrollToBottom() {
            const scrollbar = this.$refs.scrollbar;
            const content = this.$refs.content
            if (this.chatDetail.initStatus === 0){
                scrollbar.setScrollTop(content.scrollHeight - scrollbar.$el.clientHeight);
            }else{
                scrollbar.setScrollTop(1);
            }
        },
        scroll(scrollTop){
            if (scrollTop.scrollTop !== 0 ){
                return 
            }
            if (this.chatDetail.noMore === false && this.loading === false) {
                this.loading = true
                setTimeout(() => {
                    this.getChat()
                }, 1000);
            }
        },


        /*****************************WS事件*********************************/

        initWs(){
            if (socketManager.getSocket() != null){
                // 关闭之前的连接
                socketManager.close();
            }

            if (socketManager.getSocket() == null) {
                socketManager.connect(process.env.VUE_APP_WS_URL + "?Authorization=" + localStorage.getItem("Authorization"))
            }else{
                return;
            }
            setTimeout(function () {
                if (socketManager.getSocket().readyState === WebSocket.OPEN) {
                    console.log("socketManager.getSocket().readyState", socketManager.getSocket().readyState);
                }
            }, 1000);
            ws = ref(socketManager.getSocket()).value;
            ws.addEventListener("open", this.handleWsOpen.bind(this), false);
            ws.addEventListener("close", this.handleWsClose.bind(this), false);
            ws.addEventListener("error", this.handleWsError.bind(this), false);
            ws.addEventListener("message", this.handleWsMessage.bind(this), false);
        },
        handleWsOpen(e) {
            this.message = "连接成功";
            this.message = "在线";
        },
        handleWsClose(e) {
            this.message = "离线中,请重连!";
            socketManager.close();
        },
        handleWsError(e) {
            console.log("websocket error 前端错误", e);
            this.message = "连接错误,请重连或者检查网络!";
            socketManager.close();
        },
        handleWsMessage(e) {
            this.goLogin()
            let data = JSON.parse(e.data);
            console.log("websocket message 前端接收", data);
            // if (result.operate == MessageType.OPERATE_SINGLE){
            //     if (result.method == MessageType.METHOD_NORAML){
            //         this.setText(agrs,result)
            //     }else{
            //         this.resultSingleMsg(result)
            //     }
            // } else if (result.operate == MessageType.OPERATE_GROUP){
            //     this.setText(agrs,result)
            // }
            
            return;
        },

        /*****************************WS事件*********************************/
    },
    activated(){
        
    },
};
</script>

  
<style scoped>
#head-menu {
    border-bottom: solid 1px var(--el-menu-border-color);
}
.el-menu-demo{
    border-bottom:none !important;
}
.toolbar {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    right: 5px;
}

#store-item .el-divider--horizontal{
    margin: 15px 0 !important;
}


#people .el-header{
    padding: 30px 15px;
    background-color: rgb(160, 207, 255);
    height: 200px;
}
#people .el-myStore{
    background-color: rgb(253, 226, 226) !important;
}
</style>
  