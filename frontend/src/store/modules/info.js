import axios from 'axios'
import io from 'socket.io-client';

const socket = io('http://localhost:3000')

export default {
  state() {
    return {
      rooms: []
    }
  },
  mutations: {
    setRooms(state, rooms) {
      state.rooms = rooms.concat()
    }
  },
  getters: {
    rooms(state) {
      return state.rooms
    }
  },
  actions: {
    fetchRoom({ commit }) {
      axios.post('/fetchRoom')
        .then((response) => {
          commit('setRooms', response.data.rooms);
        })
        .catch(() => {
          return Promise.reject()
        });
    },
    makeRoom({ commit }, { roomName, roomPassword }) {
      const data = { name: roomName, password: roomPassword }
      axios.post('/makeRoom', data)
        .then((response) => {
          socket.emit('UPDATE_ROOM');
          commit('setRooms', response.data.rooms);
        })
        .catch(() => {
          return Promise.reject()
        });
    }
  }
}