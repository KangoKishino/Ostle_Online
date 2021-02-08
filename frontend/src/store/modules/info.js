export default {
    state() {
        return {
            room: []
        }
    },
    mutations: {
        fetchRoom(state, room) {
            state.room = room
        }
    },
    getters: {
        room(state) {
            return state.room
        }
    },
    actions: {
        fetchRoom({ commit }, { that }) {
            that.$axios.post('/fetchRoom')
                .then((response) => {
                    commit('fetchRoom', response.data.room);
                })
                .catch(() => {
                    console.log('error')
                });
        },
        makeRoom({ commit }, { roomName, roomPassword, that }) {
            const data = { name: roomName, password: roomPassword}
            return that.$axios.post('/makeRoom', data)
                .then((response) => {
                    that.socket.emit('UPDATE_ROOM',);
                    commit('fetchRoom', response.data.room);
                })
                .catch(() => {
                    return Promise.reject()
                });
        }
    }
}