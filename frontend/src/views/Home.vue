<template>
  <div class="dashboard">
    <div class="container">
      <div class="group">
        <h6 v-if="roomList.length === 0" class="my-0">
          部屋を作成してみましょう
        </h6>
        <div class="card my-2" v-for="(room, key) in roomList" :key="key">
          <div class="card-body">
            <div class="d-flex justify-content-between">
              <p>{{ room.name }}</p>
              <button type="button" @click="openEnterRoom(room)" class="btn btn-outline-dark">
                入室
              </button>
            </div>
          </div>
        </div>
      </div>
      <p v-if="isUpdateError" class="error">ページの更新に失敗しました</p>
      <button type="button" @click="openCreateRoom" class="btn btn-dark ml-2 mt-3 right">
        <Plus />部屋作成
      </button>
    </div>
    <ModalWindow @close="closeCreateRoom()" v-show="showCreateRoom">
      <h6 class="py-2">部屋を作成</h6>
      <table>
        <tr class="py-3">
          <td class="width150 py-3">部屋名</td>
          <td class="width250">
            <ValidationProvider rules="max:128" v-slot="{ errors }">
              <input type="text" v-model="roomName" name="name" />
              <p class="error">{{ errors[0] }}</p>
            </ValidationProvider>
          </td>
        </tr>
        <tr>
          <td class="py-3">パスワード</td>
          <td>
            <ValidationProvider rules="min:7|max:128" v-slot="{ errors }">
              <input type="password" v-model="roomPassword" name="password" />
              <p class="error">{{ errors[0] }}</p>
            </ValidationProvider>
          </td>
        </tr>
      </table>

      <p v-if="this.$store.getters.errorMessage" class="error">
        {{ this.$store.getters.errorMessage }}
      </p>
      <template slot="footer">
        <button class="btn btn-dark" @click="createRoom()">作成</button>
        <button class="btn btn-outline-dark" @click="closeCreateRoom()">
          閉じる
        </button>
      </template>
    </ModalWindow>
    <ModalWindow @close="closeEnterRoom()" v-show="showEnterRoom">
      <h6 class="py-2">{{ choiceRoom.name }}のパスワードを入力してください</h6>
      <table>
        <tr>
          <td class="py-3">パスワード</td>
          <td>
            <div><input type="password" v-model="roomPassword" /></div>
          </td>
        </tr>
      </table>

      <p v-if="isEnterError" class="error">パスワードが違います</p>
      <template slot="footer">
        <button class="btn btn-dark" @click="enterRoom()">入室</button>
        <button class="btn btn-outline-dark" @click="closeEnterRoom()">
          閉じる
        </button>
      </template>
    </ModalWindow>
  </div>
</template>

<script>
import Plus from 'vue-material-design-icons/Plus.vue';
import ModalWindow from '../components/ModalWindow';
import io from 'socket.io-client';
import { ValidationProvider, extend } from 'vee-validate';
import { min, max } from 'vee-validate/dist/rules';

extend('min', {
  ...min,
  message: '7文字以以上入力してください',
});
extend('max', {
  ...max,
  message: '128文字以内で入力してください',
});

export default {
  components: {
    ModalWindow,
    Plus,
    ValidationProvider,
  },
  data() {
    return {
      roomList: [],
      choiceRoom: '',
      showCreateRoom: false,
      showEnterRoom: false,
      roomName: '',
      roomPassword: '',
      isEnterError: false,
      isUpdateError: false,
      socket: io('http://localhost:3000'),
    };
  },
  created() {
    this.$store
      .dispatch('getRooms')
      .then(() => {
        this.roomList = [];
        this.isUpdateError = false;
        this.$store.getters.rooms.forEach(room => {
          if (room.status === 'before') {
            this.roomList.push(room);
          }
        });
      })
      .catch(() => {
        this.isUpdateError = true;
      });
    this.$store.dispatch('resetMyInfo');
  },
  methods: {
    openCreateRoom() {
      this.showCreateRoom = true;
    },
    openEnterRoom(room) {
      this.showEnterRoom = true;
      this.choiceRoom = room;
    },
    closeCreateRoom() {
      this.showCreateRoom = false;
    },
    closeEnterRoom() {
      this.showEnterRoom = false;
      this.enterName = '';
    },
    createRoom() {
      this.$store
        .dispatch('createRoom', {
          roomName: this.roomName,
          roomPassword: this.roomPassword,
        })
        .then(() => {
          this.$router.push({ name: 'Hostgame', params: { id: this.$store.getters.myInfo.id } });
        });
    },
    enterRoom() {
      this.$store
        .dispatch('enterRoom', {
          room: this.choiceRoom,
          password: this.roomPassword,
        })
        .then(() => {
          this.roomPassword = '';
          this.$router.push({ name: 'Guestgame', params: { id: this.$store.getters.myInfo.id } });
        })
        .catch(() => {
          this.isEnterError = true;
        });
    },
  },
  mounted() {
    // 部屋一覧更新処理
    this.$store.subscribe(mutation => {
      if (mutation.type === 'setRooms') {
        this.roomList = [];
        this.$store.getters.rooms.forEach(room => {
          if (room.status === 'before') {
            this.roomList.push(room);
          }
        });
      }
    });
    this.socket.on('UPDATE_ROOM', () => {
      this.$store.dispatch('getRooms').catch(() => {
        this.isUpdateError = true;
      });
    });
    this.socket.on('ENTER_ROOM', () => {
      this.$store.dispatch('getRooms').catch(() => {
        this.isUpdateError = true;
      });
    });
    this.socket.on('DELETE_ROOM', () => {
      this.$store.dispatch('getRooms');
    });
  },
};
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

.width150 {
  width: 150px;
}

.width250 {
  width: 250px;
}
</style>
