import Vue from "vue";
import Vuex from "vuex";
import db from "../database/firebase.js";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    isLoggedIn: false,
    userData: {
      username: "",
    },
    products: [],
  },
  mutations: {
    setCategories(state, val) {
      state.products = val;
    },
    toggleLogin(state) {
      state.isLoggedIn = !state.isLoggedIn;
    },
    login(state, payload) {
      state.isLoggedIn = true;
      state.userData = payload;
    },
  },
  actions: {
    fetchCategories({ commit }) {
      db.collection("items")
        .get()
        .then((querySnapshot) => {
          if (querySnapshot.empty) {
            console.log("cannot find");
            this.$router.push("/HelloWorld");
          } else {
            let product = {};
            this.loading = false;
            var products = [];
            querySnapshot.forEach((doc) => {
              product = [doc.id, doc.data()];
              products.push(product);
            });

            commit("setCategories", products);
          }
        });
    },
  },
  getters: {
    categories: function (state) {
      return state.products;
    },
    product: function (state) {
      return (id) => {
        return state.products.filter((p) => p[0] === id);
      };
    },
    isLoggedIn: function (state) {
      return state.isLoggedIn;
    },
    getUsername: function (state) {
      return state.userData.username;
    },
  },
  modules: {},
});

store.dispatch("fetchCategories");
export default store;
