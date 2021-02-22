<template>
  <transition name="modal" appear>
    <div class="modal-overlay" @click.self="$emit('close')">
      <div class="modal-window">
        <div class="modal-content">
          <slot />
        </div>
        <footer class="modal-footer">
          <slot name="footer"> </slot>
        </footer>
      </div>
    </div>
  </transition>
</template>

<style scoped>
.modal,
.modal-overlay {
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  z-index: 30;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  text-align: left;
}

.modal-window {
  background: #fff;
  border-radius: 10px;
  overflow: hidden;
}

.modal-content {
  padding: 10px 20px;
  border-color: #fff;
}

.modal-footer {
  background: #fff;
  padding: 10px;
  text-align: right;
  border-color: #fff;
}
</style>
