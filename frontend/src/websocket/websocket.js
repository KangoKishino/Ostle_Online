import VueNativeSock from 'vue-native-websocket';

export default async ({ Vue }) => {
  Vue.use(VueNativeSock, 'wss://echo.websocket.org', {
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 3000
  });
};