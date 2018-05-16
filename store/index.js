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
      currentWorkout: null,
      addExerciseValues:{
        active: false,
        workoutKey: null
      }
    },

    getters: {
      status: state => {
        return state.status;
      },

      addExerciseValues: state => {
        return state.addExerciseValues;
      },

      currentUser: state => {
        return state.currentUser;
      },

      currentWorkout: state => {
        return state.currentWorkout;
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

      SET_CURRENT_WORKOUT(state, workoutKey){
        let currentWorkout = state.currentUser.workouts.find(x => x.key === workoutKey);
        state.currentWorkout = currentWorkout;
      },

      ADD_WORKOUT(state, item) {
        state.currentUser.workouts.push(item);
      },

      OPEN_NEW_EXERCISE_DIALOG(state, workoutKey) {
        state.addExerciseValues.active = true;
        state.addExerciseValues.workoutKey = workoutKey;
      },

      CLOSE_NEW_EXERCISE_DIALOG(state) {
        state.addExerciseValues.active = false;
        state.addExerciseValues.workoutKey = null;
      },
    }
  })
}

export default createStore
