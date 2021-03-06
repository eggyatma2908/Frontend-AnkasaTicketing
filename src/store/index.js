import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import createPersistedState from 'vuex-persistedstate'
import Swal from 'sweetalert2'
import router from '../router/index'

Vue.use(Vuex)

export default new Vuex.Store({
  plugins: [createPersistedState()],
  state: {
    password: '',
    users: [],
    id: null || localStorage.getItem('id'),
    token: null || localStorage.getItem('token'),
    role: null,
    schedule: [],
    userProfile: {},
    schedules: [],
    scheduleById: [],
    ticket: {},
    detailTicket: {},
    pagination: {},
    history: {}
  },
  mutations: {
    togglePassword (state) {
      state.password = document.getElementById('password')
      if (state.password.type === 'password') {
        state.password.type = 'text'
      } else {
        state.password.type = 'password'
      }
    },
    togglePassword1 (state) {
      state.password = document.getElementById('repassword')
      if (state.password.type === 'password') {
        state.password.type = 'text'
      } else {
        state.password.type = 'password'
      }
    },
    set_user (state, payload) {
      state.users = payload
      state.id = payload.id
      state.token = payload.token
    },
    set_schedule (state, payload) {
      state.schedule = payload
    },
    set_schedules (state, payload) {
      state.schedules = payload
    },
    set_role (state, payload) {
      state.role = payload
    },
    set_ticket (state, payload) {
      state.ticket = payload
    },
    set_pagination (state, payload) {
      state.pagination = payload
    },
    set_detail_ticket (state, payload) {
      state.detailTicket = payload
    },
    remove (state) {
      state.users = []
      state.id = null
      state.token = null
      state.ticket = {}
      state.schedule = []
      state.role = null
      state.userProfile = {}
      state.history = {}
      state.scheduleById = []
    },
    SET_USER_BY_ID (state, payload) {
      state.userProfile = payload
      state.schedule = []
      state.role = null
    },
    SET_SCHEDULES (state, payload) {
      state.schedules = payload
    },
    SET_SCHEDULE_BY_ID (state, payload) {
      state.scheduleById = payload
    },
    SET_HISTORY (state, payload) {
      state.history = payload
    },
    REMOVE_HISTORY (state, payload) {
      state.history = {}
      state.ticket = {}
    }
  },
  actions: {
    register (context, payload) {
      return new Promise((resolve, reject) => {
        axios.post(`${process.env.VUE_APP_URL_BACKEND}/users/register`, payload)
          .then(res => {
            context.commit('set_user', res.data.message)
            resolve(res)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    login (context, payload) {
      return new Promise((resolve, reject) => {
        axios.post(`${process.env.VUE_APP_URL_BACKEND}/users/login`, payload)
          .then(res => {
            const result = res.data.data
            localStorage.setItem('id', result.id)
            localStorage.setItem('token', result.token)
            localStorage.setItem('role', result.role)
            context.commit('set_user', result)
            context.commit('set_role', result.role)
            resolve(result)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    updateProfile (context, payload) {
      return new Promise((resolve, reject) => {
        axios.patch(`${process.env.VUE_APP_URL_BACKEND}/users/${payload.id}`, payload)
          .then(res => {
            Swal.fire({
              icon: 'success',
              title: 'Profile has been updated',
              showConfirmButton: false,
              timer: 1500
            })
          })
          .catch(err => {
            Swal.fire({
              icon: 'error',
              title: 'Failed to update profile',
              showConfirmButton: false,
              timer: 1500
            })
            reject(err)
          })
      })
    },
    updateAvatar ({ dispatch }, payload) {
      return new Promise((resolve, reject) => {
        axios.patch(`${process.env.VUE_APP_URL_BACKEND}/users/${payload.get('id')}`, payload)
          .then(res => {
            Swal.fire({
              icon: 'success',
              title: 'Your picture has been updated',
              showConfirmButton: false,
              timer: 1500
            })
            dispatch('getUserById')
          })
          .catch(err => {
            Swal.fire({
              icon: 'error',
              title: 'Failed to update picture',
              showConfirmButton: false,
              timer: 1500
            })
            reject(err)
          })
      })
    },
    logout (context) {
      context.commit('remove')
      localStorage.removeItem('id')
      localStorage.removeItem('token')
      localStorage.removeItem('role')
    },
    addSchedule (context, payload) {
      return new Promise((resolve, reject) => {
        axios.post(`${process.env.VUE_APP_URL_BACKEND}/schedules/create`, payload)
          .then(res => {
            const result = res.data.message
            context.commit('set_schedule', result)
            resolve(result)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    getUserById (context) {
      return new Promise((resolve, reject) => {
        axios.get(`${process.env.VUE_APP_URL_BACKEND}/users/${localStorage.id}`)
          .then(res => {
            const result = res.data.data
            context.commit('SET_USER_BY_ID', result)
            resolve(res)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    createTicket (context, payload) {
      return new Promise((resolve, reject) => {
        axios.post(`${process.env.VUE_APP_URL_BACKEND}/tickets`, payload)
          .then(res => {
            const result = res.data
            Swal.fire({
              icon: 'success',
              title: 'Success',
              showConfirmButton: false,
              timer: 1500
            })
            resolve(result)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    getTicket (context, payload) {
      return new Promise((resolve, reject) => {
        axios.get(`${process.env.VUE_APP_URL_BACKEND}/tickets/my-booking/${payload}`)
          .then(res => {
            const result = res.data.myBookings.tickets
            context.commit('set_ticket', result)
            resolve(result)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    getHistory (context, payload) {
      return new Promise((resolve, reject) => {
        axios.get(`${process.env.VUE_APP_URL_BACKEND}/tickets/history/${localStorage.getItem('id')}`)
          .then(res => {
            const result = res.data.history.tickets
            context.commit('SET_HISTORY', result)
            resolve(result)
          })
          .catch(err => {
            reject(err.response.data)
          })
      })
    },
    deleteHistory (context, payload) {
      return new Promise((resolve, reject) => {
        axios.delete(`${process.env.VUE_APP_URL_BACKEND}/tickets/history/${payload}`)
          .then(res => {
            resolve(res)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    getSchedulesById (context, payload) {
      return new Promise((resolve, reject) => {
        axios.get(`${process.env.VUE_APP_URL_BACKEND}/schedules/${payload.id}`)
          .then(res => {
            const result = res.data.schedule
            context.commit('SET_SCHEDULE_BY_ID', result)
            resolve(res)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    getDetailTicket (context, payload) {
      return new Promise((resolve, reject) => {
        axios.get(`${process.env.VUE_APP_URL_BACKEND}/tickets/booking-detail/${payload}`)
          .then(res => {
            const result = res.data.booking
            context.commit('set_detail_ticket', result)
            resolve(result)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    getSchedules (context, payload) {
      return new Promise((resolve, reject) => {
        axios.get(`${process.env.VUE_APP_URL_BACKEND}/schedules?transit=${payload.transit || ''}&facility=${payload.facility || ''}&airline=${payload.airline || ''}&keyword=${payload.keyword || ''}&page=${payload.page || 1}`)
          .then(res => {
            const result = res.data.schedules
            const pagination = res.data.pagination
            context.commit('set_schedules', result)
            context.commit('set_pagination', pagination)
            resolve(res)
          })
          .catch(err => {
            reject(err.response.data)
          })
      })
    },
    forgotPassword (context, payload) {
      return new Promise((resolve, reject) => {
        axios.post(`${process.env.VUE_APP_URL_BACKEND}/users/forgotpassword`, payload)
          .then(res => {
            Swal.fire({
              icon: 'success',
              title: 'Send mail success, please check your mail !!!',
              showConfirmButton: false,
              timer: 1500
            })
            router.push('/auth/login')
            resolve(res)
          })
          .catch(err => {
            Swal.fire({
              icon: 'error',
              title: 'Email not found',
              showConfirmButton: false,
              timer: 1500
            })
            reject(err)
          })
      })
    },
    changePassword (context, payload) {
      return new Promise((resolve, reject) => {
        axios.patch(`${process.env.VUE_APP_URL_BACKEND}/users/changepassword/${payload.id}`, payload)
          .then(res => {
            Swal.fire({
              icon: 'success',
              title: 'Update password success',
              showConfirmButton: false,
              timer: 1500
            })
            resolve(res)
          })
          .catch(err => {
            reject(err.response.data)
          })
      })
    },
    interceptorRequest () {
      axios.interceptors.request.use(function (config) {
        config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`
        return config
      }, function (error) {
        return Promise.reject(error)
      })
    },
    interceptorResponse () {
      axios.interceptors.response.use(function (response) {
        if (response.data.status === 'Success') {
          if (response.data.message === 'Register success') {
            Swal.fire({
              icon: 'success',
              title: 'Success register',
              showConfirmButton: false,
              timer: 2000
            })
            router.push('/auth/login')
          } else if (response.data.message === 'Create schedule success!') {
            Swal.fire({
              icon: 'success',
              title: 'Create schedule success!',
              showConfirmButton: false,
              timer: 2000
            })
          }
        } else {
          if (response.data.message === 'Email not found') {
            Swal.fire({
              icon: 'error',
              title: 'Email not found',
              showConfirmButton: false,
              timer: 2000
            })
          }
        }
        return response
      }, function (error) {
        if (error.response.data.status === 'Failed') {
          if (error.response.data.message === 'email already exists') {
            Swal.fire({
              icon: 'error',
              title: 'Email already exists',
              showConfirmButton: false,
              timer: 2000
            })
          } else if (error.response.data.message === 'Internal server error!') {
            Swal.fire({
              icon: 'error',
              title: 'Internal server error!',
              showConfirmButton: false,
              timer: 2000
            })
          } else if (error.response.data.message === 'Password Wrong') {
            Swal.fire({
              icon: 'error',
              title: 'Password Wrong',
              showConfirmButton: false,
              timer: 2000
            })
          } else if (error.response.data.message === 'Invalid token') {
            Swal.fire({
              icon: 'error',
              title: 'Invalid token',
              showConfirmButton: false,
              timer: 2000
            })
          } else if (error.response.data.message === 'Bookings not found!') {
            Swal.fire({
              icon: 'error',
              title: 'Data not found',
              showConfirmButton: false,
              timer: 2000
            })
          }
        }
        return Promise.reject(error)
      })
    }
  },
  getters: {
    isLogin (state) {
      return state.token !== null
    },
    userProfile (state) {
      return state.userProfile
    },
    isAdmin (state) {
      if (state.role === 'admin') {
        return 'admin'
      } else {
        return 'admin'
      }
    },
    schedules (state) {
      return state.schedules
    },
    scheduleById (state) {
      return state.scheduleById
    },
    ticket (state) {
      return state.ticket
    },
    detailTicket (state) {
      return state.detailTicket
    },
    pagination (state) {
      return state.pagination
    },
    history (state) {
      return state.history
    }
  },
  modules: {
  }
})
