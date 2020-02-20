<template>
  <div>
    <b-container>

      <b-row class="label">
        <b-col>user name</b-col>
        <b-col>Online Users:</b-col>
      </b-row>

      <b-row class="test">
        <b-col cols="8" class="testcol">
          <ul>
            <li v-bind:key="msg.id" v-for="msg in messages">{{msg}}</li>
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
      socket: io('localhost:3000')
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
    })
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
  height: 500px;
  overflow: auto;
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
  height: 500px;
}
</style>
