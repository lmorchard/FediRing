const PageTheme = {
  className: "dark-theme",
  storageName: "pageTheme",
  init() {
    this.set(this.fetch() == "dark");
  },
  classList() {
    return document.body.classList;
  },
  set(isDark = false) {
    this.classList()[!!isDark ? "add" : "remove"](this.className);
    this.store();
  },
  get() {
    return this.classList().contains(this.className);
  },
  toggle() {
    this.set(!this.get());
  },
  fetch() {
    return window.localStorage.getItem(this.storageName);
  },
  store() {
    window.localStorage.setItem(
      this.storageName,
      this.get() ? "dark" : "light"
    );
  },
};

export default PageTheme;
