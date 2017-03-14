import * as types from './mutation-types';

export const createUser = ({ commit }, payload) => {
  return new Promise((resolve, reject) => {
    commit(types.CREATE_USER, payload);
    resolve();
  });
}
