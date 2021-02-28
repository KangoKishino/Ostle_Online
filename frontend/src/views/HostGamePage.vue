<template>
  <div class="host-game d-flex justify-content-around align-items-end">
    <div class="game-time">
      <table class="time-table">
        <tr>
          <td class="width150">
            <p v-show="myRoom.play_first === 'guest'">相手の手番</p>
          </td>
          <td class="width100">
            <p>{{ time[myRoom.time] }}</p>
          </td>
        </tr>
        <tr>
          <td class="width150">
            <p v-show="myRoom.play_first === 'host'">あなたの手番</p>
          </td>
          <td class="width100">
            <p>{{ time[myRoom.time] }}</p>
          </td>
        </tr>
      </table>
    </div>
    <div class="game-board">
      <table class="board-table selected-piece">
        <tr v-for="(list, index) in 5" :key="index">
          <td>
            <div
              :class="{
                host: judgeHost(index, 0),
                guest: judgeGuest(index, 0),
                hole: judgeHole(index, 0),
              }"
            ></div>
          </td>
          <td>
            <div
              :class="{
                host: judgeHost(index, 1),
                guest: judgeGuest(index, 1),
                hole: judgeHole(index, 1),
              }"
            ></div>
          </td>
          <td>
            <div
              :class="{
                host: judgeHost(index, 2),
                guest: judgeGuest(index, 2),
                hole: judgeHole(index, 2),
              }"
            ></div>
          </td>
          <td>
            <div
              :class="{
                host: judgeHost(index, 3),
                guest: judgeGuest(index, 3),
                hole: judgeHole(index, 3),
              }"
            ></div>
          </td>
          <td>
            <div
              :class="{
                host: judgeHost(index, 4),
                guest: judgeGuest(index, 4),
                hole: judgeHole(index, 4),
              }"
            ></div>
          </td>
        </tr>
      </table>
    </div>
    <div class="game-setting d-flex flex-column bd-highlight">
      <div class="card d-flex flex-column bd-highlight setting-table">
        <div class="card-body d-flex justify-content-around py-2 px-0">
          <div class="dropdown">
            <a
              class="btn btn-secondary dropdown-toggle width130"
              href="#"
              role="button"
              id="playFirst"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              {{ myTurn }}
            </a>
            <div class="dropdown-menu" aria-labelledby="playFirst">
              <a class="dropdown-item" @click="changeTurn('host')">先攻</a>
              <a class="dropdown-item" @click="changeTurn('guest')">後攻</a>
            </div>
          </div>
          <div class="dropdown">
            <a
              class="btn btn-secondary dropdown-toggle width130"
              href="#"
              role="button"
              id="playTime"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              {{ time[myRoom.time] }}
            </a>
            <div class="dropdown-menu" aria-labelledby="playTime">
              <a class="dropdown-item" @click="changeTime(0)">3:00</a>
              <a class="dropdown-item" @click="changeTime(1)">5:00</a>
              <a class="dropdown-item" @click="changeTime(2)">7:00</a>
              <a class="dropdown-item" @click="changeTime(3)">無制限</a>
            </div>
          </div>
        </div>
        <button v-if="myRoom.status === 'before'" class="not-button btn btn-outline-dark m-2">
          ゲスト入室待ち
        </button>
        <button v-else-if="myRoom.status === 'entered'" class="btn btn-dark m-2">
          開始
        </button>
        <button v-else-if="myRoom.status === 'running'" class="not-button btn btn-outline-dark m-2">
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
      <p v-if="this.$store.getters.errorMessage" class="error">
        {{ this.$store.getters.errorMessage }}
      </p>
    </div>
  </div>
</template>

<script>
import io from 'socket.io-client';
import config from '../const/const';

export default {
  data() {
    return {
      inputMessage: '',
      socket: io('http://localhost:3000'),
      myRoom: [],
      board: [],
      time: ['3:00', '5:00', '7:00', '無制限'],
      myTurn: '先攻',
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
        this.myRoom.play_first === 'host' ? (this.myTurn = '先攻') : (this.myTurn = '後攻');
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
    changeTurn(playFirst) {
      this.$store.dispatch('changeTurn', {
        playFirst: playFirst,
      });
    },
    changeTime(time) {
      this.$store.dispatch('changeTime', {
        time: time,
      });
    },
    sendMessage() {
      if (this.inputMessage.length >= 160) {
        this.$store.dispatch('setErrorMessage', {
          errorMessage: '最大文字数は160文字です',
        });
      } else {
        this.$store
          .dispatch('sendMessage', {
            user: 'ホスト',
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
      // 設定変更時の処理
      if (mutation.type === 'setRooms') {
        this.myRoom = this.$store.getters.rooms.find(
          room => room.id === this.$store.getters.myInfo.id
        );
        this.myRoom.play_first === 'host' ? (this.myTurn = '先攻') : (this.myTurn = '後攻');
      }
    });
    this.socket.on('ENTER_ROOM', () => {
      this.$store
        .dispatch('receiveMessages', {
          id: this.$store.getters.myInfo.id,
        })
        .then(() => {
          this.myRoom.play_first === 'host' ? (this.myTurn = '先攻') : (this.myTurn = '後攻');
        });
    });
    this.socket.on('SEND_MESSAGE', () => {
      this.$store
        .dispatch('receiveMessages', {
          id: this.$store.getters.myInfo.id,
        })
        .then(() => {
          this.$store.dispatch('getRooms');
        });
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
  background: rgba(1, 1, 1, 0);
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
