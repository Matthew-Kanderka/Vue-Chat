<template>
  <div>
    <b-container>

      <b-row class="label">
        <b-col>You are {{username}}</b-col>
        <b-col>Online Users:</b-col>
      </b-row>

      <b-row class="test">
        <b-col cols="8" class="testcol">
          <ul>
            <li v-bind:key="msg.id" v-for="msg in messages">
              <span>{{msg.time}} </span>
              <span v-bind:style="{ color: '#' + userNameColor}">{{msg.nickname}}: </span>
              <span><b>{{msg.message}}</b></span>
            </li>
          </ul>
        </b-col>

        <b-col class="testcol">
          users
          <ul>
            <li v-bind:key="user.id" v-for="user in users">{{user}}</li>
          </ul>
        </b-col>
      </b-row>

      <b-row>

        <b-col>
        <form @submit.prevent="sendMessage">
          <input v-model="message" type="text">
          <!-- <button type="submit">Send</button> -->
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
      username: '',
      socket: io('localhost:3000'),
      userNameColor: '#ffffff'
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
      this.messages.push(data);
    });

    this.socket.on('username', (un) => {
      this.username = un;
    });

    this.socket.on('set color', (color) => {
      this.userNameColor = color;
      console.log(this.userNameColor);
    });

    this.socket.on('set nickname', (newNick) => {
      this.username = newNick;
    });

    this.socket.on('updateUsers', (updatedList) => {
      this.users = updatedList;
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
  overflow-y: auto;
  bottom: 0;
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
  position: absolute;
  bottom: 0;
  padding: 0;
  overflow: auto;
  /* height: 500px; */
}
</style>
