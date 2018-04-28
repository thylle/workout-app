<template>
  <div>
    <!-- TODO: Add font for design -->
    <!-- <link href="https://fonts.googleapis.com/css?family=Nunito:300,400,700" rel="stylesheet">     -->

    <!-- Views will render here -->
    <nuxt/>

    <!-- Add exercise dialog -->
    <add-exercise-dialog v-bind:addExerciseValues.sync="addExerciseValues"></add-exercise-dialog>

    <!-- Global nav bar -->
    <nav class="nav-bar">
      <button class="nav-bar__item">Exercises</button>
      <button class="nav-bar__item">Workouts</button>
      <button class="nav-bar__item  nav-bar__item--highlight" v-on:click="addExerciseValues.active = !addExerciseValues.active">Add Exercise</button>
    </nav>

    <!-- Status container for loading and errors -->
    <transition name="fade">
      <div class="status__container" v-if="status.loading || status.error">
        <div class="status__content">
          <strong>{{status.title}}</strong>
        </div>
      </div>
    </transition>
  </div>
</template>

<script src="https://www.gstatic.com/firebasejs/4.11.0/firebase.js"></script>

<script>
import AddExerciseDialog from "~/components/AddExerciseDialog.vue";
import firebase from "firebase";
import APIService from "~/services/api-service.js";
const API = new APIService();

export default {
  data() {
    return {
      addExerciseValues: {
        active: false,
        workoutKey: null
      }
    };
  },

  computed: {
    status(){
      return this.$store.getters.status;
    },
    currentUser() {
      return this.$store.getters.currentUser;
    },
  },

  created() {
    // Initialize Firebase if the firebase app does not exist
    if (!firebase.apps.length) {
      this.initFirebase();
    }
  },

  mounted(){
    //Waiting for mounted beacuse localstorage is not defined at "created"
    this.useOfflineData();
    //API.getCurrentUserData(this.$store);
  },

  components: {
    AddExerciseDialog
  },
  
  computed: {
    status(){
      return this.$store.getters.status;
    }
  },

  methods: {
    initFirebase() {
      const config = {
        apiKey: "AIzaSyCxUwMWfGsYMufqOiF4LaRTmDXYYxM6EwE",
        authDomain: "workout-app-1337.firebaseapp.com",
        databaseURL: "https://workout-app-1337.firebaseio.com",
        projectId: "workout-app-1337",
        storageBucket: "workout-app-1337.appspot.com",
        messagingSenderId: "995650046193"
      };

      firebase.initializeApp(config);

      // firebase.auth().onAuthStateChanged(function(user) {
      //   if (user) {
      //     // User is signed in and currentUser will no longer return null.
      //   } else {
      //     // No user is signed in.
      //   }
      // });
    },

    useOfflineData(){
      //TODO add LS name to config
      let localStorageName = "LS-current-user";
      let localStorageCurrentUser = JSON.parse(localStorage.getItem(localStorageName)) || null;

      if(localStorageCurrentUser != null){
        console.log("localStorageCurrentUser", localStorageCurrentUser);
        
        //Add the current user to the store
        this.$store.commit('SET_CURRENTUSER', localStorageCurrentUser)

        this.status.loading = false;
      }
      else{
        API.getCurrentUserData(this.$store);
      }
    }
  }
}
</script>