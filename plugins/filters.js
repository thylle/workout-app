import Vue from 'vue'
import moment from 'moment'

export default () => {
  Vue.filter('fromNow', val => moment(val).fromNow())
}
