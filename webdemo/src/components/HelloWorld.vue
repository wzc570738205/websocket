<template>
  <div class="hello">
    <el-container>
      <el-header>
        当前在线人数:{{ count }}
        <span v-if="false">{{ newuser }}加入了聊天室</span>
        <span @click="loginout" class="logout">更改用户名</span>
      </el-header>

      <el-main id="message" style="padding: 0; overflow-x: hidden;">
        <ul style="width: 100%; overflow-x: hidden;" id="messui">
          <li
            v-for="(item, index) in infoList"
            :key="index"
            style="width: 100%; margin: 0;"
          >
            <div class="time">
              <span>{{ item.time }}</span>
            </div>
            <div class="info" :class="item.id == id ? 'my' : ''">
              <div v-html="item.svg" class="header"></div>
              <div>
                <span style="color: blue;">{{ item.userName }}：</span>
              </div>
            </div>
            <div class="message" :class="item.id == id ? 'myinfo' : ''">
              <span v-if="item.type == 'message'">{{ item.userValue }}</span>
              <img
                :src="item.src"
                alt
                v-if="item.type == 'img'"
                style="width: 150px;"
                @click="goimg(item.src)"
              />
            <!--   <div class="demo-image__preview" v-if="item.type == 'img'">
                <el-image
                  style="width: 150px;"
                  :src="item.src"
                  :preview-src-list="[item.src]"
                >
                </el-image>
              </div> -->
            </div>
          </li>
        </ul>
      </el-main>

      <el-footer style="height: 40px; padding: 0px;">
        <div class="keybord">
          <el-input
            placeholder="请输入内容"
            v-model="userValue"
            clearable
            @blur="inputBlur"
            @keyup.enter.native="send"
          ></el-input>
          <el-button
            type="primary"
            style="
              width: 80px;
              overflow: hidden;
              font-size: 20px;
              padding-left: 15px;
              position: relative;
            "
          >
            <i class="el-icon-picture-outline-round"></i>
            <input
              type="file"
              @change="sendimg"
              id="image"
              accept="image/*"
              style="
                opacity: 0;
                position: absolute;
                width: 100%;
                height: 100%;
                top: 0;
                left: 0;
              "
            />
          </el-button>
          <el-button
            type="primary"
            @click="send"
            :disabled="!userValue"
            style="margin-left: 2px;"
            >发送</el-button
          >
        </div>
      </el-footer>
    </el-container>

    <el-dialog
      title="请输入用户名"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :show-close="false"
    >
      <el-input placeholder="请输入用户名" v-model="userName"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="login">确 定</el-button>
      </span>
    </el-dialog>
    <div id="imgbox" v-if="dialogVisible2" @click="dialogVisible2  =false;bigimg = ''">
      <img :src="bigimg" alt="">
    </div>
  </div>
</template>

<script>
import Avatars from "@dicebear/avatars";
import sprites from "@dicebear/avatars-male-sprites";
import { service } from "./service.js";

export default {
  name: "HelloWorld",
  data() {
    //  this.ws = new WebSocket('ws://192.168.1.45:3000');
    this.ws = new WebSocket("ws://111.229.113.161:3000");
    return {
      timer: null,
      userValue: "",
      infoList: [],
      userName: "",
      dialogVisible: false,
      dialogVisible2: false,
      count: 0,
      userList: [],
      newuser: "",
      id: localStorage.getItem("userName"),
      svg: "",
      base64Url: "",
      bigimg:''
    };
  },
  mounted() {
    this.ws.onopen = () => {
      if (localStorage.getItem("userName")) {
        this.userName = localStorage.getItem("userName");
        this.dialogVisible = false;
        let userObj = {
          type: "login",
          username: localStorage.getItem("userName"),
        };
        this.id = localStorage.getItem("userName");
        this.ws.send(JSON.stringify(userObj));

        this.drawImg();
      } else {
        this.dialogVisible = true;
      }
      this.onmessage();
      clearInterval(this.timer);
      this.timer = setInterval(() => {
        this.ws.send(
          JSON.stringify({
            type: "heart",
          })
        );
      }, 60000);
    };
  },
  methods: {
    sendimg(e) {
      let fileList = e.target.files;
      if (fileList.length > 0) {
        let file = fileList[0];
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (ev) => {
          // this.base64Url = reader.result; //本地baser64（快）
          let result = ev.target.result;
          this.postimg(result);
        };
      }
    },
    compress(img) {
      let canvas = document.createElement("canvas");
      let ctx = canvas.getContext("2d");
      let width = img.width;
      let height = img.height;
      canvas.width = width;
      canvas.height = height;
      // 铺底色
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, width, height);

      //进行最小压缩
      let ndata = canvas.toDataURL("image/jpeg", 0.1);
      return ndata;
    },

    send() {
      if (!this.userValue) return;
      let obj = {
        type: "message",
        userName: this.userName,
        userValue: this.userValue,
        time: new Date().toLocaleString(),
        id: localStorage.getItem("userName"),
        svg: this.svg,
      };
      this.ws.send(JSON.stringify(obj));
      this.userValue = "";
    },
    login() {
      if (this.userName) {
        this.dialogVisible = false;
        localStorage.setItem(
          "userName",
          this.userName + "--" + new Date().getTime()
        );
        let userObj = {
          type: "login",
          username: localStorage.getItem("userName"),
        };
        this.id = localStorage.getItem("userName");
        this.ws.send(JSON.stringify(userObj));
        this.drawImg();
      }
    },
    onmessage() {
      this.ws.onmessage = (event) => {
        console.log(event);

        if (typeof JSON.parse(event.data) == "number") {
          this.count = event.data;
        } else if (JSON.parse(event.data).type == "newuser") {
          this.newuser = JSON.parse(event.data).user.replace(
            JSON.parse(event.data).user.slice(-15),
            ""
          );
          this.$message({
            message: this.newuser + "加入了聊天室",
            type: "success",
            duration: 1000,
          });
        } else if (JSON.parse(event.data).type == "heart") {
          console.warn("心跳检测");
        } else if (
          JSON.parse(event.data).type == "message" ||
          JSON.parse(event.data).type == "img"
        ) {
          console.log(JSON.parse(event.data));
          this.infoList.push(JSON.parse(event.data));
        }
        setTimeout(() => {
          document.getElementById("message").scrollTop =
            document.getElementById("messui").scrollHeight + 34;
        });
      };
    },
    inputBlur() {
      window.scrollTo(0, 0);
    },
    loginout() {
      localStorage.clear();
      location.reload();
    },
    drawImg() {
      let options = {};
      let avatars = new Avatars(sprites(options));
      this.svg = avatars.create(this.id);
    },
    goimg(img) {
      this.dialogVisible2 = true;
      this.bigimg = img
    },
    postimg(result) {
      console.log(result);
      let url =
        "https://gitee.com/api/v5/repos/Wzhichao/img/contents/websoket/" +
        this.userName +
        new Date().getTime() +
        "." +
        result.split(";")[0].split("/")[1];
      let param = {
        access_token: "a75702ebbb1232dff93ec7317e42c3e9",
        content: result.split(",")[1],
        message: "提交图片",
      };
      service
        .postImg(url, param)
        .then((res) => {
          console.log(res);
          this.base64Url = res.content.download_url;
          let obj = {
            type: "img",
            userName: this.userName,
            src: this.base64Url,
            time: new Date().toLocaleString(),
            id: localStorage.getItem("userName"),
            svg: this.svg,
          };
          this.ws.send(JSON.stringify(obj));
          document.getElementById("image").value = "";
        })
        .catch(() => {
          let img = new Image();
          img.src = result;
          img.onload = () => {
            this.base64Url = this.compress(img);
            let obj = {
              type: "img",
              userName: this.userName,
              src: this.base64Url,
              time: new Date().toLocaleString(),
              id: localStorage.getItem("userName"),
              svg: this.svg,
            };
            this.ws.send(JSON.stringify(obj));
            document.getElementById("image").value = "";
          };
        });
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
.hello {
  width: 100%;
  height: 100%;
}
.el-container.is-vertical {
  width: 100%;
  height: 100%;
}

.keybord {
  display: flex;
}
.time {
  text-align: center;
  font-size: 12px;
}
.info {
  display: flex;
  align-items: center;
}
.message {
  margin-left: 50px;
  margin-right: 50px;
  background: #fff;
  padding: 5px 10px;
  border-radius: 5px;
  display: inline-block;
  word-break: break-all;
}
.message span {
  padding: 5px 10px;
  border-radius: 5px;
}
.logout {
  color: #da1c1c;
  font-size: 14px;
  padding-left: 50px;
}

.my {
  flex-direction: row-reverse;
}
.myinfo {
  float: right;
  background: #9fe759;
}
.header {
  display: inline-block;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  text-align: center;
  color: #fff;
  background: #c0c4cc;
  width: 40px;
  height: 40px;
  line-height: 40px;
  font-size: 14px;
  border-radius: 50%;
  overflow: hidden;
}
#imgbox{
      width: 100%;
    height: 100%;
    position: fixed;
    z-index: 9;
    top: 0;
    left: 0;
    background: rgba(144, 147, 153, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
   
}
 #imgbox img{
      width: 100%;
    }
</style>
