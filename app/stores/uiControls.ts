export const useUiControls = defineStore('uiControls', {
  state: () => ({
    showEpaHeader: true,
    showHeaderMsg: false,
  }),
  actions: {
    toggleEpaNav() {
      this.showEpaHeader = !this.showEpaHeader;
    },
    toggleEpaNavMsg() {
      this.showHeaderMsg = !this.showHeaderMsg;
    },
  },
  getters: {
    getPageTitle(state) {
      return state.pages;
    },
  },
});

// console.log(import.meta.hot)
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUiControls, import.meta.hot));
}
