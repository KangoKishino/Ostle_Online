<template>
  <div class="d-flex justify-content-between mx-2 mt-3">
    <h3>Ostle Online</h3>
    <button
      v-show="this.$store.getters.myInfo.id !== null"
      class="head btn btn-dark pull-right"
      @click="openLeaveRoom()"
    >
      退室
    </button>
    <ModalWindow @close="closeLeaveRoom()" v-show="showLeaveRoom">
      <h6 v-if="this.$store.getters.myInfo.user === 'guest'" class="py-2 width300">
        退室しますか？
      </h6>
      <h6 v-else class="py-2 width300">退室すると、部屋は削除されます。</h6>
      <template slot="footer">
        <button class="btn btn-dark" @click="leaveRoom()">退室</button>
        <button class="btn btn-outline-dark" @click="closeLeaveRoom()">閉じる</button>
      </template>
    </ModalWindow>
  </div>
</template>

<script>
import ModalWindow from '../components/ModalWindow';

export default {
  components: {
    ModalWindow,
  },
  data() {
    return {
      showLeaveRoom: false,
    };
  },
  methods: {
    openLeaveRoom() {
      this.showLeaveRoom = true;
    },
    closeLeaveRoom() {
      this.showLeaveRoom = false;
    },
    leaveRoom() {
      this.showLeaveRoom = false;
      this.$store.dispatch('leaveRoom').then(() => {
        this.$router.push({ name: 'Home' });
      });
    },
  },
};
</script>

<style scoped>
.width300 {
  width: 300px;
}
</style>
