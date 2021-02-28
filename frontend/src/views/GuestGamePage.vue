<template>
  <div>
    <div class="host-game d-flex justify-content-around align-items-end">
      <div class="game-time">
        <table class="time-table">
          <tr>
            <td class="width150">
              <p v-show="myRoom.play_first === 'host'">相手の手番</p>
            </td>
            <td class="width100">
              <p>{{ time[myRoom.time] }}</p>
            </td>
          </tr>
          <tr>
            <td class="width150">
              <p v-show="myRoom.play_first === 'guest'">あなたの手番</p>
            </td>
            <td class="width100">
              <p>{{ time[myRoom.time] }}</p>
            </td>
          </tr>
        </table>
      </div>
      <div class="game-board">
        <table class="board-table">
          <tr v-for="(list, index) in reverseBoard" :key="index">
            <td>
              <div
                :class="{
                  host: judgeHost(list, 4),
                  guest: judgeGuest(list, 4),
                  hole: judgeHole(list, 4),
                }"
              ></div>
            </td>
            <td>
              <div
                :class="{
                  host: judgeHost(list, 3),
                  guest: judgeGuest(list, 3),
                  hole: judgeHole(list, 3),
                }"
              ></div>
            </td>
            <td>
              <div
                :class="{
                  host: judgeHost(list, 2),
                  guest: judgeGuest(list, 2),
                  hole: judgeHole(list, 2),
                }"
              ></div>
            </td>
            <td>
              <div
                :class="{
                  host: judgeHost(list, 1),
                  guest: judgeGuest(list, 1),
                  hole: judgeHole(list, 1),
                }"
              ></div>
            </td>
            <td>
              <div
                :class="{
                  host: judgeHost(list, 0),
                  guest: judgeGuest(list, 0),
                  hole: judgeHole(list, 0),
                }"
              ></div>
            </td>
          </tr>
        </table>
      </div>
      <div class="game-setting d-flex flex-column bd-highlight">
        <div class="card d-flex flex-column bd-highlight setting-table">
          <div class="card-body d-flex justify-content-around py-2 px-0">
            <button class="not-button btn btn-outline-dark m-2 width130">{{ myTurn }}</button>
            <button class="not-button btn btn-outline-dark m-2 width130">
              {{ time[myRoom.time] }}
            </button>
          </div>
          <button v-if="myRoom.status === 'entered'" class="not-button btn btn-outline-dark m-2">
            開始待ち
          </button>
          <button v-else-if="myRoom.status === 'running'" class="not-button btn btn-dark m-2">
            プレイ中
          </button>
        </div>
        <div class="card mt-3 chat-table">
          <div class="card-body">
            <div v-for="(message, key) in this.$store.getters.messages" :key="key">
              {{ message.user }} : {{ message.message }}
            </div>
          </div>
          <div class="card-footer p-1">
            <div>
              <input type="text" class="mx-1" v-model="inputMessage" />
              <button
                type="button"
                class="btn btn-outline-dark btn-sm"
                :disabled="inputMessage === ''"
                @click="sendMessage()"
              >
                送信
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import io from 'socket.io-client';
import Cookies from 'vue-cookies';
import config from '../const/const';

export default {
  data() {
    return {
      inputMessage: '',
      reverseBoard: [4, 3, 2, 1, 0],
      socket: io('http://localhost:3000'),
      myRoom: [],
      board: [],
      time: ['3:00', '5:00', '7:00', '無制限'],
      myTurn: '後攻',
    };
  },
  created() {
    // 対戦画面情報取得
    this.$store
      .dispatch('getGamePage')
      .then(() => {
        this.myRoom = this.$store.getters.rooms.find(
          room => room.id === this.$store.getters.myInfo.id
        );
        this.myRoom.play_first === 'host' ? (this.myTurn = '後攻') : (this.myTurn = '先攻');
        this.board = this.$store.getters.board;
      })
      .catch(() => {
        this.$router.push({ name: 'Home' });
      });
  },
  methods: {
    judgeHost(index, row) {
      if (
        config.MIN_HOST_PIECE <= this.board[index][row] &&
        this.board[index][row] <= config.MAX_HOST_PIECE
      ) {
        return true;
      }
    },
    judgeGuest(index, row) {
      if (
        config.MIN_GUEST_PIECE <= this.board[index][row] &&
        this.board[index][row] <= config.MAX_GUEST_PIECE
      ) {
        return true;
      }
    },
    judgeHole(index, row) {
      if (this.board[index][row] === config.HOLE_NUM) {
        return true;
      }
    },
    sendMessage() {
      if (this.inputMessage.length >= 160) {
        this.$store.dispatch('setErrorMessage', {
          errorMessage: '最大文字数は160文字です',
        });
      } else {
        this.$store
          .dispatch('sendMessage', {
            user: 'ゲスト',
            message: this.inputMessage,
          })
          .then(() => {
            this.inputMessage = '';
          })
          .catch(() => {
            this.$router.push({ name: 'Home' });
          });
      }
    },
  },
  mounted() {
    this.$store.subscribe(mutation => {
      if (mutation.type === 'setRooms') {
        this.myRoom = this.$store.getters.rooms.find(
          room => room.id === this.$store.getters.myInfo.id
        );
        this.myRoom.play_first === 'host' ? (this.myTurn = '後攻') : (this.myTurn = '先攻');
      }
    });
    this.socket.on('UPDATE_ROOM', id => {
      if (id === this.$store.getters.myInfo.id) {
        this.$store.dispatch('getRooms');
      }
    }),
      this.socket.on('SEND_MESSAGE', () => {
        this.$store.dispatch('receiveMessages', {
          id: this.$store.getters.myInfo.id,
        });
      }),
      this.socket.on('DELETE_ROOM', id => {
        if (id === this.$store.getters.myInfo.id) {
          Cookies.remove('token', '');
          this.$router.push({ name: 'Home' });
        }
      });
  },
};
</script>

<style scoped>
.time-table {
  border: 1px solid #000;
  border-collapse: separate;
  border-spacing: 0;
  border-radius: 10px;
  overflow: hidden;
}

.time-table tr,
.time-table td {
  padding: 6px 20px;
}

.board-table table,
.board-table tr,
.board-table td {
  border: solid 4px #000000;
  border-collapse: collapse;
}

.board-table td {
  height: 70px;
  width: 70px;
}

.width150 {
  height: 50px;
  width: 150px;
}

.width100 {
  width: 100px;
}

.card {
  border: solid 1px #000000;
  width: 200px;
}

.card-body {
  text-align: left;
}

.btn-secondary {
  color: #2c3e50;
  background-color: #fff;
  font-weight: bold;
}

.btn-secondary:hover {
  color: #fff;
  background-color: #000;
}

.host {
  margin: auto;
  width: 55px;
  height: 55px;
  background: #000;
}

.guest {
  margin: auto;
  width: 55px;
  height: 55px;
  border: 6px solid #000;
  background: #fff;
}

.hole {
  margin: auto;
  width: 55px;
  height: 55px;
  border-radius: 50%;
  background: #000;
}

.chat-table,
.setting-table {
  width: 300px;
}

input {
  width: 230px;
}

.chat-table .card-body {
  height: 200px;
  overflow: auto;
}

.width130 {
  width: 130px;
}

.not-button {
  cursor: default;
}

.not-button:hover {
  color: #000;
  background-color: #fff;
}

td p {
  margin: auto;
}
</style>
