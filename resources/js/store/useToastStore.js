import { defineStore } from 'pinia'

const initialState = {
  toastData: {
    show: false,
    timeout: 5000,
    message: '',
    location: 'top end',
    variant: 'flat',
    color: "success",
  },
};

export const useToastStore = defineStore('ToastStore', {
  state: () => (initialState),
  actions: {
    openToast(payload) {
      this.toastData = { ...this.toastData, ...payload, show: true }

      const timeout = payload.timeout || 5000;

      setTimeout(() => {
        this.toastData = initialState.toastData
      }, timeout)
    },
  },
})
