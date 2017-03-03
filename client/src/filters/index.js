import Vue from 'vue'

export default {
  capitalize: Vue.filter('capitalize', value => {
    if (!value) return '';
    value = value.toString();
    return value.charAt(0).toUpperCase() + value.slice(1);
  }),
  uppercase: Vue.filter('uppercase', value => {
    if (!value) return '';
    return value.toString().toUpperCase();
  })
}
