import { defineStore } from 'pinia'

const initialState = {
  loadingData: {
    show: false,
    message: '',
    width: '300',
    color: "primary",
  },
};

export const useAppStore = defineStore('AppStore', {
  state: () => (initialState),
  actions: {
    openLoader(payload) {
      this.loadingData = { ...this.loadingData, ...payload, show: true }
    },
    closeLoader() {
      this.loadingData = { ...this.loadingData, show: false, message: "" }
    },
  },
})
