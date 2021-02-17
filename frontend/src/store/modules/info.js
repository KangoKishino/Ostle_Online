import axios from 'axios'
import io from 'socket.io-client';

const socket = io('http://localhost:3000')

export default {
  state() {
    return {
      rooms: [],
      errorMessage: ''
    }
  },
  mutations: {
    setRooms(state, rooms) {
      state.rooms = rooms.concat()
    },
    setErrorMessage(state, error) {
      state.errorMessage = error
    }
  },
  getters: {
    rooms(state) {
      return state.rooms
    },
    errorMessage(state) {
      return state.errorMessage
    },
  },
  actions: {
    fetchRoom({ commit }) {
      axios.post('/fetchRoom')
        .then((res) => {
          commit('setRooms', res.data.rooms);
        })
        .catch(() => {
          return Promise.reject()
        });
    },
    makeRoom({ commit }, { roomName, roomPassword }) {
      const data = { name: roomName, password: roomPassword }
      return axios.post('/makeRoom', data)
        .then((res) => {
          if(res.data.error) {
            commit('setErrorMessage', res.data.error)
          }
          socket.emit('UPDATE_ROOM');
          commit('setRooms', res.data.rooms);
        })
        .catch(() => {
          return Promise.reject()
        });
    }
  }
}