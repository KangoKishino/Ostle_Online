<template>
  <div class="host-game d-flex justify-content-around align-items-end">
    <div class="game-time">
      <table class="pushed-piece m-3">
        <tr>
          <td v-show="this.$store.getters.dropedPiece.host >= 1"><div class="host"></div></td>
          <td v-show="this.$store.getters.dropedPiece.host === 2"><div class="host"></div></td>
        </tr>
        <tr>
          <td v-show="this.$store.getters.dropedPiece.guest >= 1"><div class="guest"></div></td>
          <td v-show="this.$store.getters.dropedPiece.guest === 2"><div class="guest"></div></td>
        </tr>
      </table>

      <table class="time-table">
        <tr>
          <td class="width170">
            <p v-show="gameInfo.myTurn === 'guest'">相手のターン</p>
          </td>
          <td class="width100">
            <p>{{ gameInfo.guestTime }}</p>
          </td>
        </tr>
        <tr>
          <td class="width170">
            <p v-show="gameInfo.myTurn === 'host'">あなたのターン</p>
          </td>
          <td class="width100">
            <p>{{ gameInfo.hostTime }}</p>
          </td>
        </tr>
      </table>
    </div>
    <div :class="{ 'game-board': selectedPiece || selectedHole }">
      <table :class="{ 'board-table': true, 'selected-piece': selectedPiece }">
        <tr v-for="(list, index) in 5" :key="index">
          <td
            :class="{ available: canMoveSquare(index, 0), moved: movedPiece(index, 0) }"
            @click="moveCoordinates(index, 0)"
          >
            <div
              :class="{
                host: judgeHost(index, 0),
                guest: judgeGuest(index, 0),
                hole: judgeHole(index, 0),
              }"
            ></div>
          </td>
          <td
            :class="{ available: canMoveSquare(index, 1), moved: movedPiece(index, 1) }"
            @click="moveCoordinates(index, 1)"
          >
            <div
              :class="{
                host: judgeHost(index, 1),
                guest: judgeGuest(index, 1),
                hole: judgeHole(index, 1),
              }"
            ></div>
          </td>
          <td
            :class="{ available: canMoveSquare(index, 2), moved: movedPiece(index, 2) }"
            @click="moveCoordinates(index, 2)"
          >
            <div
              :class="{
                host: judgeHost(index, 2),
                guest: judgeGuest(index, 2),
                hole: judgeHole(index, 2),
              }"
            ></div>
          </td>
          <td
            :class="{ available: canMoveSquare(index, 3), moved: movedPiece(index, 3) }"
            @click="moveCoordinates(index, 3)"
          >
            <div
              :class="{
                host: judgeHost(index, 3),
                guest: judgeGuest(index, 3),
                hole: judgeHole(index, 3),
              }"
            ></div>
          </td>
          <td
            :class="{ available: canMoveSquare(index, 4), moved: movedPiece(index, 4) }"
            @click="moveCoordinates(index, 4)"
          >
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
        <button
          v-else-if="myRoom.status === 'entered'"
          class="btn btn-dark m-2"
          @click="startGame()"
        >
          開始
        </button>
        <button v-else-if="myRoom.status === 'running'" class="not-button btn btn-outline-dark m-2">
          プレイ中
        </button>
        <button
          v-else-if="myRoom.status === 'after'"
          class="btn btn-outline-dark m-2"
          @click="restartGame()"
        >
          再戦
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
    <ModalWindow
      @close="closeResult()"
      v-show="
        (this.$store.getters.dropedPiece.guest === 2 ||
          this.$store.getters.dropedPiece.host === 2) &&
          showResult
      "
    >
      <div class="width300 height150 d-flex align-items-center justify-content-center">
        <h1 v-show="this.$store.getters.dropedPiece.guest === 2" class="mt-3">勝利</h1>
        <h1 v-show="this.$store.getters.dropedPiece.host === 2" class="mt-3">敗北</h1>
      </div>
    </ModalWindow>
  </div>
</template>

<script>
import io from 'socket.io-client';
import config from '../const/const';
import ModalWindow from '../components/ModalWindow';

export default {
  components: {
    ModalWindow,
  },
  data() {
    return {
      inputMessage: '',
      socket: io('http://localhost:3000'),
      myRoom: [],
      board: [],
      time: ['3:00', '5:00', '7:00', '無制限'],
      myTurn: '先攻',
      gameInfo: [],
      selectedPiece: false,
      selectedHole: false,
      oldCoordinates: [],
      nextCoordinates: [],
      showResult: true,
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
        this.gameInfo = this.$store.getters.gameInfo;
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
    startGame() {
      this.$store.dispatch('startGame');
      this.showResult = true;
    },
    // 移動したマスの判定
    movedPiece(index, row) {
      if (
        index * 5 + row === this.$store.getters.movedPiece[0] ||
        index * 5 + row === this.$store.getters.movedPiece[1]
      ) {
        return true;
      }
    },
    // 移動可能なマスの判定
    canMoveSquare(index, row) {
      for (const coordinate of this.nextCoordinates) {
        if (this.isNextCoordinates(index, row, coordinate[0], coordinate[1])) {
          return true;
        }
      }
    },
    // コマの移動
    moveCoordinates(index, row) {
      if (this.isMyTurn()) {
        // コマの移動可能なマスの追加
        if (this.isMovablePiece(index, row)) {
          this.selectedPiece = true;
          this.nextCoordinates = [];
          this.oldCoordinates = [index, row];
          this.addNextCoordinates(index, row);
          // 穴の移動可能なマスの追加
        } else if (this.isMovableHole(index, row)) {
          this.selectedHole = true;
          this.nextCoordinates = [];
          this.oldCoordinates = [index, row];
          this.addNextCoordinates(index, row);
          // 移動先のマスを選択
        } else if (this.isSelectedNextCoordinates()) {
          for (const coordinate of this.nextCoordinates) {
            // コマの移動
            if (this.isNextCoordinatesAndPiece(index, row, coordinate[0], coordinate[1])) {
              this.$store.dispatch('movePiece', {
                oldCoordinates: this.oldCoordinates,
                newCoordinates: [index, row],
              });
              // 穴の移動
            } else if (this.isNextCoordinatesAndHole(index, row, coordinate[0], coordinate[1])) {
              this.$store.dispatch('moveHole', {
                oldCoordinates: this.oldCoordinates,
                newCoordinates: [index, row],
              });
            }
          }
          this.selectedPiece = false;
          this.selectedHole = false;
        }
      }
    },
    closeResult() {
      this.showResult = false;
      this.$store.dispatch('afterStatus');
    },
    restartGame() {
      this.$store.dispatch('restartGame', { playFirst: this.myRoom.play_first });
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
    isNextCoordinates(index, row, nextIndex, nextRow) {
      if (nextIndex === index && nextRow === row) {
        return true;
      }
      return false;
    },
    isMyTurn() {
      if (this.myRoom.status === 'running' && this.gameInfo.myTurn === 'host') {
        return true;
      }
      return false;
    },
    isMovablePiece(index, row) {
      if (
        this.selectedPiece === false &&
        this.selectedHole === false &&
        config.MIN_HOST_PIECE <= this.board[index][row] &&
        this.board[index][row] <= config.MAX_HOST_PIECE
      ) {
        return true;
      }
      return false;
    },
    isMovableHole(index, row) {
      if (
        this.selectedPiece === false &&
        this.selectedHole === false &&
        this.board[index][row] === config.HOLE_NUM
      ) {
        return true;
      }
      return false;
    },
    // 移動可能な座標を追加
    addNextCoordinates(index, row) {
      if (this.selectedPiece) {
        if (index !== 0) {
          this.nextCoordinates.push([index - 1, row]);
        }
        if (index !== 4) {
          this.nextCoordinates.push([index + 1, row]);
        }
        if (row !== 0) {
          this.nextCoordinates.push([index, row - 1]);
        }
        if (row !== 4) {
          this.nextCoordinates.push([index, row + 1]);
        }
      } else {
        if (index !== 0 && this.board[index - 1][row] === 0) {
          this.nextCoordinates.push([index - 1, row]);
        }
        if (index !== 4 && this.board[index + 1][row] === 0) {
          this.nextCoordinates.push([index + 1, row]);
        }
        if (row !== 0 && this.board[index][row - 1] === 0) {
          this.nextCoordinates.push([index, row - 1]);
        }
        if (row !== 4 && this.board[index][row + 1] === 0) {
          this.nextCoordinates.push([index, row + 1]);
        }
      }
    },
    isSelectedNextCoordinates() {
      if (this.selectedPiece || this.selectedHole) {
        return true;
      }
      return false;
    },
    isNextCoordinatesAndPiece(index, row, nextIndex, nextRow) {
      if (nextIndex === index && nextRow === row && this.selectedPiece) {
        return true;
      }
      return false;
    },
    isNextCoordinatesAndHole(index, row, nextIndex, nextRow) {
      if (nextIndex === index && nextRow === row && this.selectedHole) {
        return true;
      }
      return false;
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
      if (mutation.type === 'setBoard') {
        this.board = this.$store.getters.board;
      }
      if (mutation.type === 'setGameInfo') {
        this.gameInfo = this.$store.getters.gameInfo;
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
    this.socket.on('UPDATE_BOARD', id => {
      if (id === this.$store.getters.myInfo.id) {
        this.$store.dispatch('getBoard');
      }
    });
  },
};
</script>

<style scoped>
h1 {
  font-weight: bold;
}

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

.width170 {
  height: 50px;
  width: 170px;
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

.width300 {
  width: 300px;
}

.height150 {
  height: 150px;
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

.game-board {
  background-color: rgba(0, 0, 0, 0.4);
}

.moved {
  background-color: rgba(0, 0, 0, 0.2);
}

.available {
  background-color: #fff;
}
</style>
