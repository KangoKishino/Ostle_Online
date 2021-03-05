import axios from 'axios';
import io from 'socket.io-client';
import Cookies from 'vue-cookies';
import config from '../../const/const';

const socket = io('http://localhost:3000');

export default {
  state() {
    return {
      rooms: [],
      board: [],
      messages: [],
      myInfo: {
        id: null,
        user: null,
      },
      gameInfo: {
        myTurn: 'host',
        timeOut: '',
      },
      movedPiece: ['', ''],
      dropedPiece: {
        host: 0,
        guest: 0,
      },
      errorMessage: '',
    };
  },
  mutations: {
    setRooms(state, rooms) {
      state.rooms = rooms.concat();
    },
    setErrorMessage(state, error) {
      state.errorMessage = error;
    },
    setBoard(state, board) {
      // hostコマを1~5、guestコマを6~10,穴を11で表示
      let list = [
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
      ];
      Object.keys(board).forEach((key, index) => {
        if (board[key] < config.TOTAL_BOARD_NUM) {
          list[parseInt(board[key] / 5)][board[key] % 5] = index + 1;
        }
      });
      state.board = list.concat();
    },
    setMessages(state, messages) {
      state.messages = messages.concat();
    },
    setMyInfo(state, { id, user }) {
      state.myInfo.id = id;
      state.myInfo.user = user;
    },
    setGameInfo(state, { myTurn, timeOut }) {
      state.gameInfo.myTurn = myTurn;
      state.gameInfo.timeOut = timeOut;
    },
    setMovedPiece(state, { oldCoordinates, newCoordinates }) {
      state.movedPiece[0] = oldCoordinates;
      state.movedPiece[1] = newCoordinates;
    },
    setDropedPiece(state, board) {
      let hostPiece = 0;
      let guestPiece = 0;
      Object.keys(board).forEach(key => {
        if (board[key] === config.DROPED_HOST_PIECE) {
          hostPiece++;
        } else if (board[key] === config.DROPED_GUEST_PIECE) {
          guestPiece++;
        }
      });
      state.dropedPiece.host = hostPiece;
      state.dropedPiece.guest = guestPiece;
    },
    clearErrorMessage(state) {
      state.errorMessage = '';
    },
  },
  getters: {
    rooms(state) {
      return state.rooms;
    },
    board(state) {
      return state.board;
    },
    messages(state) {
      return state.messages;
    },
    dropedPiece(state) {
      return state.dropedPiece;
    },
    gameInfo(state) {
      return state.gameInfo;
    },
    movedPiece(state) {
      return state.movedPiece;
    },
    myInfo(state) {
      return state.myInfo;
    },
    errorMessage(state) {
      return state.errorMessage;
    },
  },
  actions: {
    // 部屋一覧ページ取得
    getRooms({ commit }) {
      axios
        .post('/getRooms')
        .then(res => {
          commit('setRooms', res.data.rooms);
        })
        .catch(() => {
          return Promise.reject();
        });
    },
    // 自分の情報初期化
    resetMyInfo({ commit }) {
      commit('setMyInfo', { id: null, user: null });
      commit('clearErrorMessage');
    },
    // 対戦画面初期化
    getGamePage({ commit }) {
      const data = { token: Cookies.get('token') };
      return axios.post('/getGameInfo', data).then(res => {
        commit('setBoard', res.data.coordinates);
        commit('setDropedPiece', res.data.coordinates);
        commit('setMessages', res.data.messages);
        commit('clearErrorMessage');
        commit('setMyInfo', {
          id: res.data.user.id,
          user: res.data.user.user,
        });
      });
    },
    // 部屋作成
    createRoom({ commit }, { roomName, roomPassword }) {
      const data = { name: roomName, password: roomPassword, user: 'host' };
      return axios
        .post('/createRoom', data)
        .then(res => {
          if (res.data.error) {
            commit('setErrorMessage', res.data.error);
            return Promise.reject();
          }
          Cookies.config(60 * 60 * 24, '');
          Cookies.set('token', res.data.token);
          socket.emit('UPDATE_ROOM');
          commit('setMyInfo', { id: res.data.id, user: 'host' });
        })
        .catch(() => {
          return Promise.reject();
        });
    },
    // ゲスト入室
    enterRoom({ commit, dispatch }, { room, password }) {
      const data = { room, password, user: 'guest' };
      return axios
        .post('/enterRoom', data)
        .then(res => {
          socket.emit('ENTER_ROOM');
          Cookies.config(60 * 60 * 24, '');
          Cookies.set('token', res.data.token);
          commit('setMyInfo', { id: res.data.id, user: 'guest' });
          dispatch('getRooms');
        })
        .catch(() => {
          return Promise.reject();
        });
    },
    // メッセージ送信
    sendMessage({ commit }, { user, message }) {
      const data = { user, message, token: Cookies.get('token') };
      return axios
        .post('/sendMessage', data)
        .then(res => {
          if (res.data.error) {
            commit('setErrorMessage', res.data.error);
          } else {
            socket.emit('SEND_MESSAGE');
            commit('setMessages', res.data.messages);
            commit('clearErrorMessage');
          }
        })
        .catch(() => {
          return Promise.reject();
        });
    },
    // メッセージ受信時の更新
    receiveMessages({ commit }, { id }) {
      const data = { id, token: Cookies.get('token') };
      return axios
        .post('/receiveMessages', data)
        .then(res => {
          commit('setMessages', res.data.messages);
        })
        .catch(() => {
          return Promise.reject();
        });
    },
    // エラーメッセージ出力
    setErrorMessage({ commit }, { errorMessage }) {
      commit('setErrorMessage', errorMessage);
    },
    // 対戦情報取得
    getBoard({ commit }) {
      const data = { token: Cookies.get('token') };
      return axios.post('/getBoard', data).then(res => {
        commit('setBoard', res.data.coordinates);
        commit('setGameInfo', {
          myTurn: res.data.gameInfo.my_turn,
          timeOut: res.data.gameInfo.time_out,
        });
        commit('setDropedPiece', res.data.coordinates);
        commit('setMovedPiece', {
          oldCoordinates: res.data.gameInfo.old_coordinates,
          newCoordinates: res.data.gameInfo.new_coordinates,
        });
      });
    },
    // 先攻後攻変更
    changeTurn({ getters }, { playFirst }) {
      const data = { playFirst, token: Cookies.get('token') };
      return axios
        .post('/changeTurn', data)
        .then(() => {
          socket.emit('UPDATE_ROOM', getters.myInfo.id);
          socket.emit('UPDATE_BOARD', getters.myInfo.id);
        })
        .catch(() => {
          return Promise.reject();
        });
    },
    // 持ち時間設定変更
    changeTime({ getters }, { time }) {
      const data = { time, token: Cookies.get('token') };
      return axios
        .post('/changeTime', data)
        .then(() => {
          socket.emit('UPDATE_ROOM', getters.myInfo.id);
          socket.emit('UPDATE_BOARD', getters.myInfo.id);
        })
        .catch(() => {
          return Promise.reject();
        });
    },
    // 対戦開始
    startGame({ getters }) {
      const data = { token: Cookies.get('token') };
      return axios
        .post('/startGame', data)
        .then(() => {
          socket.emit('START_GAME', getters.myInfo.id);
        })
        .catch(() => {
          return Promise.reject();
        });
    },
    // コマの移動
    movePiece({ getters }, { oldCoordinates, newCoordinates }) {
      const data = {
        oldCoordinates: oldCoordinates,
        newCoordinates: newCoordinates,
        token: Cookies.get('token'),
      };
      return axios
        .post('/movePiece', data)
        .then(() => {
          socket.emit('UPDATE_BOARD', getters.myInfo.id);
        })
        .catch(() => {
          return Promise.reject();
        });
    },
    // 穴の移動
    moveHole({ getters }, { oldCoordinates, newCoordinates }) {
      const data = {
        oldCoordinates: oldCoordinates,
        newCoordinates: newCoordinates,
        token: Cookies.get('token'),
      };
      return axios
        .post('/moveHole', data)
        .then(() => {
          socket.emit('UPDATE_BOARD', getters.myInfo.id);
        })
        .catch(() => {
          return Promise.reject();
        });
    },
    // 時間切れ
    timeOut({ getters }) {
      const data = { user: getters.myInfo.user, token: Cookies.get('token') };
      return axios
        .post('/timeOut', data)
        .then(() => {
          socket.emit('UPDATE_BOARD', getters.myInfo.id);
        })
        .catch(() => {
          return Promise.reject();
        });
    },
    // ステータス変更
    afterStatus({ getters }) {
      const data = { token: Cookies.get('token') };
      return axios
        .post('/afterStatus', data)
        .then(() => {
          socket.emit('UPDATE_ROOM', getters.myInfo.id);
        })
        .catch(() => {
          return Promise.reject();
        });
    },
    // 再戦
    restartGame({ dispatch }, { playFirst }) {
      const data = { playFirst, token: Cookies.get('token') };
      return axios
        .post('/resetGame', data)
        .then(() => {
          dispatch('startGame');
        })
        .catch(() => {
          return Promise.reject();
        });
    },
    // 退室処理
    leaveRoom({ getters }) {
      const data = { myInfo: getters.myInfo };
      if (getters.myInfo.user === 'guest') {
        return axios
          .post('/leaveRoom', data)
          .then(() => {
            Cookies.remove('token', '');
            socket.emit('SEND_MESSAGE');
            socket.emit('UPDATE_ROOM');
          })
          .catch(() => {
            return Promise.reject();
          });
      } else {
        return axios
          .post('/deleteRoom', data)
          .then(() => {
            Cookies.remove('token', '');
            socket.emit('DELETE_ROOM', getters.myInfo.id);
          })
          .catch(() => {
            return Promise.reject();
          });
      }
    },
  },
};
