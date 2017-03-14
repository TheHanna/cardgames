import Vue from 'vue';
import * as types from './mutation-types';

export default {
  [types.CREATE_USER] (state, { socket, name }) {
    createUser(state, socket, name);
  }
}

function createUser(state, socket, name) {
  Vue.set(state.user, 'socket', socket);
  Vue.set(state.user, 'name', name);
}
