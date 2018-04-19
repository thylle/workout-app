<template>
  <div class="app-container">
    <!-- TODO: Add font for design -->
    <!-- <link href="https://fonts.googleapis.com/css?family=Nunito:300,400,700" rel="stylesheet">     -->

    <header class="main-header">
      <div class="container">
        <h1 class="main-header__title">Workouts</h1>
        <p class="main-header__byline">A list of all your workouts</p>
        <button class="link" v-on:click="addWorkoutActive = true">Create new workout</button>
      </div>
    </header>

    <main v-if="currentUser">
      <div class="container">

        <!-- Add workout dialog -->
        <el-dialog title="Your new workout" width="90%" v-bind:visible.sync="addWorkoutActive">
          <form v-on:submit.prevent="addWorkout()">
            <input class="form-control mb-3" placeholder="Name your new workout" v-model="newWorkoutName" />

            <div class="text-right  dialog-footer">
                <button class="btn mr-3" type="button" @click="addWorkoutActive = false">Cancel</button>
                <button class="btn btn-success">Create workout</button>
              </div>
          </form>
        </el-dialog>


        <!-- Add exercise dialog -->
        <el-dialog title="Your new exercise" width="90%" v-bind:visible.sync="addExerciseActive">
          <form v-on:submit.prevent="addExercise()">
            <input class="form-control  mb-2" placeholder="Name your exercise" v-model="newExercise.name" />
            <textarea class="form-control  mb-3" placeholder="Make a note to the exercise" v-model="newExercise.notes" />
            
            <!-- Option list of workouts -->
            <div>
              <label>Choose workout </label>
              <button class="float-right link" type="button" tabindex="-1" v-on:click="addWorkoutActive = true">Create new workout</button>
            </div>
            
            <select class="form-control  mb-3" v-model="newExercise.workoutKey">
              <option
                v-for="item in workouts"
                v-if="item.name"
                :key="item.key"
                :label="item.name"
                :value="item.key">
              </option>
            </select>

            <label>Weight in kg</label>
            <input class="form-control  mb-3" placeholder="How much weight" type="number" v-model="newExercise.weight" v-bind:min="0" />
              
            <label>Sets</label>
            <input class="form-control  mb-3" placeholder="How many sets" type="number" v-model="newExercise.sets" v-bind:min="0" />

            <label>Reps</label>
            <input class="form-control  mb-3" placeholder="Number of reps" type="number" v-model="newExercise.reps" v-bind:min="0" />

            <label>Rest in sec</label>
            <input class="form-control  mb-3" placeholder="Rest in seconds" type="number" v-model="newExercise.rest" v-bind:min="0" />

            <div class="text-right  dialog-footer">
              <button class="btn mr-3" type="button" @click="addExerciseActive = false">Cancel</button>
              <button class="btn btn-success">Create exercise</button>
            </div>
          </form>
        </el-dialog>


        <!-- Workout list -->
        <div class="card mb-3" v-for="item in workouts" v-bind:key="item.key" v-if="item.name">
          <div class="card-header">
            <h2 class="h5 float-left m-0">{{item.name}}</h2>
            <button class="link float-right" type="text" v-on:click="addExerciseForWorkout(item)">Add exercise</button>
          </div>
          <div class="card-body  ">
            <div class="text item  exercise" v-for="child in item.exercises" v-bind:key="child.key">
              <p class="exercise__title"><strong>{{child.details.name}}</strong></p>

              <div class="row">
                <div class="col  exercise__detail">
                  <span class="exercise__detail-value">{{child.details.weight}}</span>
                  <span class="exercise__detail-label">kg</span>
                </div>
                <div class="col  exercise__detail">
                  <span class="exercise__detail-value">{{child.details.sets}}</span>
                  <span class="exercise__detail-label">sets</span>
                </div>
                <div class="col  exercise__detail">
                  <span class="exercise__detail-value">{{child.details.reps}}</span>
                  <span class="exercise__detail-label">reps</span>
                </div>
                <div class="col  exercise__detail">
                  <span class="exercise__detail-value">{{child.details.rest}}</span>
                  <span class="exercise__detail-label">rest in sec</span>
                </div>    
              </div>
            </div>
          </div>
        </div>

      </div>
    </main>

    <nav class="nav-bar">
      <button class="nav-bar__item">Exercises</button>
      <button class="nav-bar__item">Workouts</button>
      <button class="nav-bar__item  nav-bar__item--highlight" v-on:click="addExerciseActive = !addExerciseActive">Add Exercise</button>
    </nav>


    <!-- Status container for loading and errors -->
    <div class="status__container" v-if="status.loading || status.error">
      <div class="status__content">
        <strong>{{status.title}}</strong>
      </div>
    </div>
  </div>
</template>


<script src="https://www.gstatic.com/firebasejs/4.11.0/firebase.js"></script>
<script>
import AppLogo from "~/components/AppLogo.vue";
import firebase from "firebase";
import APIService from "~/services/api-service.js";

const API = new APIService();

export default {
  data() {
    return {
      status: {
        loading: true,
        error: false,
        title: "Loading..."
      },
      newWorkoutName: null,
      addWorkoutActive: false,
      addExerciseActive: false,
      newExercise: {}
    };
  },

  components: {
    AppLogo
  },

  created() {
    // Initialize Firebase if the firebase app does not exist
    if (!firebase.apps.length) {
      this.initFirebase();
    }
  },

  mounted(){
    //TODO add LS name to config
    let localStorageName = "LS-current-user";
    let localStorageCurrentUser = JSON.parse(localStorage.getItem(localStorageName)) || null;

    // if(localStorageCurrentUser == null){
    //   console.log("localStorageCurrentUser", localStorageCurrentUser);
      
    //   //Add the current user to the store
    //   this.$store.commit('SET_CURRENTUSER', localStorageCurrentUser)

    //   this.status.loading = false;
    // }
    // else{
    //   this.getCurrentUser();
    // }

    this.getCurrentUser();
  },

  computed: {
    currentUser() {
      return this.$store.getters.currentUser;
    },

    workouts() {
      return this.$store.getters.workoutsSorted;
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

    getCurrentUser() {
      console.log("get current user...");
      let ref = firebase.database().ref("users/1337");

      ref.once("value", data => {
        if (data.val() != null) {
          let currentUser = data.val();
          let workoutsAsArray = [];

          //Change workouts list to an array
          for(let item in currentUser.workouts){
            workoutsAsArray.push(currentUser.workouts[item]);
          }
          currentUser.workouts = workoutsAsArray;

          //Add the current user to the store
          console.log("SET_CURRENTUSER", currentUser);
          this.$store.commit('SET_CURRENTUSER', currentUser)

          this.status.loading = false;
        } 
        else {
          this.status.loading = false;
          this.status.error = true;
          this.status.title = "No user found";
        }
      });
    },

    addWorkout() {
      this.status.loading = true;
      this.status.title = "Adding workout";

      API.addWorkout(this.currentUser, this.newWorkoutName)
        .then(result => {
          //Add the new item to the store and empty the input field
          this.$store.commit('ADD_WORKOUT', result);
          this.newWorkoutName = null;
          this.addWorkoutActive = false;

          setTimeout(() => {
            this.status.loading = false;
          }, 300);
        })
        .catch(e => {
          console.error("error adding workout", e);
        });
    },

    addExercise() {
      API.addExercise(this.currentUser, this.newExercise).then(() => {
        this.newExercise = {};
        this.addExerciseActive = false;
      });
    },

    addExerciseForWorkout(workout){
      this.addExerciseActive = true;
      this.newExercise.workoutKey = workout.key;
    }
  }
};
</script>
