const state = {
  user: null,
  token: null
}

const getters = {
  getUser: state => {
    return state.user
  },
  getToken: state => {
    return state.token
  }
}

const mutations = {
  SET_USER (state, user) {
    state.user = user
  },
  CLEAR_USER (state) {
    state.user = null
  },
  SET_TOKEN (state, token) {
    state.token = token
  },
  CLEAR_TOKEN (state) {
    state.token = null
  }
}

const actions = {
  setUser: ({commit}, user) => {
    commit('SET_USER', user)
  },
  clearUser: ({commit}) => {
    commit('CLEAR_USER')
  },
  setToken: ({commit}, token) => {
    commit('SET_TOKEN', token)
  },
  clearToken: ({commit}) => {
    commit('CLEAR_TOKEN')
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
