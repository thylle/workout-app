import Vue from 'vue';
import Vuex from 'vuex'

let createStore = () => {
  return new Vuex.Store({
    state: {
      status: {
        loading: true,
        error: false,
        title: "Loading..."
      },
      currentUser: {
        workouts: null
      },
    },

    getters: {
      status: state => {
        return state.status;
      },

      currentUser: state => {
        return state.currentUser;
      },

      workoutsSorted: state => {
        let workouts = state.currentUser.workouts;

        if(workouts){
          let sortedItems = workouts.sort(function(a, b) {
            return new Date(b.created) - new Date(a.created);
          });

          return sortedItems;
        }
          
        return null;
      },
    },

    mutations: {
      SET_CURRENTUSER(state, user) {
        let localStorageName = "LS-current-user";

        state.currentUser = user

        //Add the current user to local storage as well as the store state
        localStorage.setItem(localStorageName, JSON.stringify(user));
      },

      ADD_WORKOUT(state, item) {
        state.currentUser.workouts.push(item);
      },
    }
  })
}

export default createStore
