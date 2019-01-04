<template>
  <div class="wrapper">
    <nav class="header-nav" v-if="user">
      <button class="header-nav__button" @click="routeBack"><span class="icon icon-chevron-left"></span></button>
    </nav>

    <!-- Views will render here -->
    <nuxt/>

    <!-- Add exercise dialog -->
    <add-exercise-dialog></add-exercise-dialog>

    <!-- Global nav bar -->
    <nav class="nav-bar" v-if="user">
      <button class="nav-bar__item" @click="logout">
        <span class="icon icon-equalizer"></span>
        <!-- <span>logout</span> -->
      </button>
      <nuxt-link class="nav-bar__item" to="/exercises">
        <span class="icon icon-dumbbell"></span>
        <!-- <span>Exercises</span> -->
      </nuxt-link>

      <nuxt-link class="nav-bar__item" to="/workouts">
        <span class="icon icon-list4"></span>
        <!-- <span>Workouts</span> -->
      </nuxt-link>
      
      <button class="nav-bar__item  nav-bar__item--highlight" v-on:click="openNewExerciseDialog()">
        <span class="icon icon-plus"></span>
        <!-- <span>Add workout</span> -->
      </button>
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
    user () {
      return this.$store.getters.activeUser
    },
    currentUser() {
      return this.$store.getters.currentUser;
    }
  },

  mounted(){
    //Waiting for mounted beacuse localstorage is not defined at "created"
    //this.useOfflineData();

    if(this.user){
      //App is ready and the user is authenticated so we get some data for that user
      API.getCurrentUserData(this.$store, this.user)
    }
    else{
      //App is ready and no user found - so we just hide the loading and show the frontpage for the user to login...
      this.$store.state.status.loading = false
    }
    
  },

  methods: {
    logout () {
      this.$store.dispatch('signOut')
    },

    routeBack(){
      history.back();
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
    },

    openNewExerciseDialog(){
      this.$store.commit('OPEN_NEW_EXERCISE_DIALOG', null)
    },
  }
}
</script>