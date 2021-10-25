import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    genOptions: {
      numCount: 2,
      hasDecimal: false,
      operator: 1 + 2,
      hasNegative: false,
      opCount: 1,
    },
    pageOptions: {
      perPage: 12, // Line Count
      perRow: 3, // Expression Count in Line
      pageCount: 2, // Page Count
    },
  },
  mutations: {
    setGenOptions (state, options) {
      state.genOptions = options;
      localStorage.genOptions = JSON.stringify(options);
    },
    setPageOptions (state, options) {
      state.pageOptions = options;
      localStorage.pageOptions = JSON.stringify(options);
    }
  },
  getters: {
    getGenOptions: state => {
      if(localStorage.genOptions != null) {
        state.genOptions = JSON.parse(localStorage.genOptions);
      }
      return state.genOptions;
    },
    getPageOptions: state => {
      if(localStorage.pageOptions != null) {
        state.pageOptions = JSON.parse(localStorage.pageOptions);
      }
      return state.pageOptions;
    },
  },
  modules: {
  }
})
