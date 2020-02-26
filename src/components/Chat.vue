<template>
  <div>
    <b-container>

      <b-row class="label">
        <b-col cols="8">You are {{nickname}}</b-col>
        <b-col>Online Users:</b-col>
      </b-row>

      <b-row class="test">
        <b-col cols="8" class="testcol overflow-auto">
          <ul>
            <li v-bind:key="msg.id" v-for="msg in chatLog">
              <span>{{msg.time}} </span>
              <span v-bind:style="{ color: '#' + msg.color}">{{msg.nickname}}: </span>
              <span>{{msg.message}}</span>
            </li>

            <li v-bind:key="msg.id" v-for="msg in messages">
              <span>{{msg.time}} </span>
              <span v-bind:style="{ color: '#' + msg.color}">{{msg.nickname}}: </span>
              <span>{{msg.message}}</span>
            </li>
          </ul>
        </b-col>

        <b-col class="testcol">
          users
          <ul>
            <li v-bind:key="user.id" v-for="user in users">{{user.nickname}}</li>
          </ul>
        </b-col>
      </b-row>

      <b-row>

        <b-col>
        <form @submit.prevent="sendMessage">
          <input v-model="message" type="text">
        </form>
        </b-col>

      </b-row>
    </b-container>
  </div>
</template>

<script>

import io from 'socket.io-client';

export default {
  name: 'Chat',
  data() {
    return {
      message: '',
      messages: [],
      users: [],
      nickname: '',
      socket: io('localhost:3000'),
      userNameColor: '#ffffff',
      chatLog: []
    }
  },
  methods: {
    sendMessage(e) {

      e.preventDefault();
      this.socket.emit('chat message', this.message);
      this.message = '';
    }
  },
  mounted() {
    this.socket.on('chat message', (data) => {
      console.log(data);
      this.messages.push(data);
    });

    this.socket.on('nickname', (un) => {
      this.nickname = un;
    });

    this.socket.on('set color', (color) => {
      this.userNameColor = color;
    });

    this.socket.on('set nickname', (newNick) => {
      this.nickname = newNick;
    });

    this.socket.on('nickname taken', (message) => {
      this.messages.push(message)
    });

    this.socket.on('updateUsers', (updatedList) => {
      this.users = updatedList;
    });

    this.socket.on('chat log', (log) => {
      this.chatLog = log;
    });

    this.socket.on('set cookie', (nickname, color) => {
      this.$cookies.set("nickname", nickname);
      this.$cookies.set("color", color);
    });

    this.socket.on('check cookie', () => {
      if (this.$cookies.get("nickname")) {
        this.socket.emit('set existing user', {'nickname': this.$cookies.get("nickname"), 'color': this.$cookies.get("color") });
      } else {
        this.socket.emit('new user');
      }
    });
  }
}
</script>

<style scoped>

.container {
  background-color: lightgray;
  padding: 30px 20px;
  border: 1px solid black;
}

.testcol {
  background-color: gray;
  margin: 10px 10px;
  height: 500px;
  border: 1px solid black;
  color: white;
}

.label {
  text-align: left;
}

input {
  width: 100%;
}

ul {
  list-style-type: none;
  text-align: left;
  vertical-align: bottom;
  /* bottom: 0;
  position: absolute; */
  padding: 0;
}
</style>
