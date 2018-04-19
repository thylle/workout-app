import Vuex from 'vuex'

const createStore = () => {
  return new Vuex.Store({
    state: {
      currentUser: {
        workouts: null
      },
    },

    getters: {
      currentUser: state => {
        return state.currentUser;
      },

      workoutsSorted: state => {
        let workouts = state.currentUser.workouts;

        if(workouts){
          let sortedItems = workouts.sort(function(a, b) {
            // Turn your strings into dates, and then subtract them
            // to get a value that is either negative, positive, or zero.
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

      ADD_WORKOUT(state, workout) {
        state.currentUser.workouts.push(workout);
      }
    }
  })
}

export default createStore
