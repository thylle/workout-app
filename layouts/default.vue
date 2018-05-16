<template>
  <div>
    <!-- TODO: Add font for design -->
    <!-- <link href="https://fonts.googleapis.com/css?family=Nunito:300,400,700" rel="stylesheet">     -->

    <!-- Views will render here -->
    <nuxt/>

    <!-- Add exercise dialog -->
    <add-exercise-dialog></add-exercise-dialog>

    <!-- Global nav bar -->
    <nav class="nav-bar">
      <nuxt-link class="nav-bar__item" to="/exercises">Exercises</nuxt-link>
      <nuxt-link class="nav-bar__item" to="/workouts">Workouts</nuxt-link>
      <button class="nav-bar__item  nav-bar__item--highlight" v-on:click="openNewExerciseDialog()">Add Exercise</button>
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

<script>
import AddExerciseDialog from "~/components/AddExerciseDialog.vue";
import APIService from "~/services/api-service.js";

const API = new APIService();

export default {

  components: {
    AddExerciseDialog
  },

  computed: {
    status(){
      return this.$store.getters.status;
    },
    currentUser() {
      return this.$store.getters.currentUser;
    },
  },

  mounted(){
    //Waiting for mounted beacuse localstorage is not defined at "created"
    //this.useOfflineData();
    API.getCurrentUserData(this.$store);
  },

  methods: {

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
    },

    openNewExerciseDialog(){
      this.$store.commit('OPEN_NEW_EXERCISE_DIALOG', null)
    },
  }
}
</script>