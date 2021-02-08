<template>
  <div class="dashboard">
    <div class="container">
      <div class="group">
        <h6 v-if="roomList.length === 0" class="my-0">部屋を作成してみましょう</h6>
        <div class="card my-2" v-for="(room, key) in roomList" :key="key">
          <div class="card-body">
            <div class="d-flex justify-content-between">
              <p>{{ room.name }}</p>
              <button type="button" @click="openEnterRoom(room.name)"  class="btn btn-outline-dark">入室</button>
            </div>
          </div>
        </div>
      </div>
      <button type="button" @click="openMakeRoom" class="btn btn-dark ml-2 mt-3 right"><Plus />部屋作成</button>
    </div>
      <ModalWindow @close="closeMakeRoom()" v-show="showMakeRoom">
        <h6 class="py-2">部屋を作成</h6>
        <table>
          <tr class="py-3">
            <td class="width200 py-3">部屋名</td>
            <td><div><input type="text" v-model="roomName"></div></td>
          </tr>
          <tr>
            <td class="py-3">パスワード</td>
            <td><div><input type="password" v-model="roomPassword"></div></td>
          </tr>
        </table>
        <p v-if="isRoomError" class="error">この部屋名は既に利用されています</p>
        <template slot="footer">
          <button class="btn btn-dark" @click="makeRoom()">作成</button>
          <button class="btn btn-outline-dark" @click="closeMakeRoom()">閉じる</button>
        </template>
      </ModalWindow>
      <ModalWindow @close="closeEnterRoom()" v-show="showEnterRoom">
        <h6 class="py-2">{{ enterName }}のパスワードを入力してください</h6>
        <table>
          <tr>
            <td class="py-3">パスワード</td>
            <td><div><input type="password" v-model="roomPassword"></div></td>
          </tr>
        </table>
        <template slot="footer">
          <button class="btn btn-dark">入室</button>
          <button class="btn btn-outline-dark" @click="closeEnterRoom()">閉じる</button>
        </template>
      </ModalWindow>
  </div>
</template>

<script>
import Plus from 'vue-material-design-icons/Plus.vue'
import ModalWindow from '../components/ModalWindow'
import io from 'socket.io-client';

export default {
  components: {
    ModalWindow,
    Plus
  },
  data() {
    return {
      roomList: [],
      showMakeRoom: false,
      showEnterRoom: false,
      roomName: '',
      roomPassword: '',
      enterName: '',
      isRoom: false,
      isRoomError: false,
      socket: io('http://localhost:3000')
    }
  },
  created() {
    this.roomList = this.$store.getters.room
    const that = this
    this.$store.dispatch('fetchRoom', { that: that })
  },
  computed: {
    boardName() {
      return this.$store.getters.room
    }
  },
  methods: {
    openMakeRoom() {
      this.showMakeRoom = true
    },
    openEnterRoom(name) {
      this.showEnterRoom = true
      this.enterName = name
    },
    closeMakeRoom() {
      this.showMakeRoom = false
    },
    closeEnterRoom() {
      this.showEnterRoom = false
      this.enterName = ''
    },
    makeRoom() {
      const that = this
      this.$store.dispatch('makeRoom', {
        roomName: this.roomName,
        roomPassword: this.roomPassword,
        that: that
      })
        .then(() => {
          this.roomName = ''
          this.roomPassword = ''
          this.closeMakeRoom()
        })
        .catch(() => {
          this.isRoomError = true
        })
    }
  },
  mounted() {
    const that = this
    this.$store.subscribe(mutation => {
      if(mutation.type === 'fetchRoom') {
        this.roomList = this.$store.getters.room
      }
    })
    this.socket.on('UPDATE_ROOM',function(){
      that.$store.dispatch('fetchRoom', { that: that })
    })
  },
}
</script>

<style scoped>
.group {
    border: 1px solid #333;
    border-radius: 5px;
    padding: 30px;
    position: relative;
}

p {
  margin: auto 0; 
}

.right {
    margin-left: 80%;
}

.width200 {
  width: 150px;
}
</style>