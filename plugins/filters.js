import Vue from 'vue'

let filters = {}

Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})
