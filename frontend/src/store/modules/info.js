import Vue from 'vue'
import axios from 'axios'
Vue.$axios = axios;
import io from 'socket.io-client';

const socket = io('http://localhost:3000')

export default {
	state() {
		return {
			rooms: []
		}
	},
	mutations: {
		setRoom(state, rooms) {
			const newRooms = rooms.concat();
			state.rooms = newRooms
		}
	},
	getters: {
		rooms(state) {
			return state.rooms
		}
	},
	actions: {
		fetchRoom({ commit }) {
			Vue.$axios.post('/fetchRoom')
				.then((response) => {
					commit('setRoom', response.data.rooms);
				})
				.catch(() => {
					return Promise.reject()
				});
		},
		makeRoom({ commit }, { roomName, roomPassword }) {
			const data = { name: roomName, password: roomPassword }
			Vue.$axios.post('/makeRoom', data)
				.then((response) => {
					socket.emit('UPDATE_ROOM');
					commit('setRoom', response.data.rooms);
				})
				.catch(() => {
					return Promise.reject()
				});
		}
  }
}