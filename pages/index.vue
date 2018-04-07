<template>
  <el-container>
    <header class="el-header">
      <h1 class="h1 pt2">Workouts</h1>
    </header>

    <main class="el-main">

      <!-- Add workout -->
      <el-row class="mb3">
        <form v-on:submit.prevent="addWorkout()">
          <el-input placeholder="Name your new workout" v-model="newWorkoutName">
            <el-button slot="append" icon="el-icon-plus" v-on:click="addWorkout(newWorkoutName)">Create workout</el-button>
          </el-input>
        </form>
      </el-row>

      <!-- Add exercise container -->
      <el-row class="add-exercise__container  mb3" v-if="addExerciseActive">
        <p class="h2">Your new exercise</p>

        <form v-on:submit.prevent="addExercise()">
          <el-input class="mb2" placeholder="Name your exercise" v-model="newExercise.name"></el-input>
          <el-input class="mb2" type="textarea" placeholder="Make a note to the exercise" v-model="newExercise.notes"></el-input>
          
          <!-- Option list of workouts -->
          <el-select class="mb2" v-model="newExercise.workoutKey" placeholder="Select workout">
            <el-option
              v-for="item in workouts"
              v-if="item.name"
              :key="item.key"
              :label="item.name"
              :value="item.key">
            </el-option>
          </el-select>

          <el-input class="mb2" type="number" v-model="newExercise.weight" v-bind:min="0">
            <template slot="prepend">Weight in kg</template>
          </el-input>
          <el-input class="mb2" type="number" v-model="newExercise.sets" v-bind:min="0">
            <template slot="prepend" style="width: 300px">Sets</template>
          </el-input>
          <el-input class="mb2" type="number" v-model="newExercise.reps" v-bind:min="0">
            <template slot="prepend">Reps</template>
          </el-input>
          <el-input class="mb2" type="number" v-model="newExercise.rest" v-bind:min="0">
            <template slot="prepend">Rest in sec</template>
          </el-input>

          <el-button icon="el-icon-add" v-on:click="addExercise()">Create exercise</el-button>
        </form>
      </el-row>


      <!-- Workout list -->
      <div class="el-card box-card mb3" v-for="item in sortedWorkouts" v-bind:key="item.key" v-if="item.name">
        <div class="el-card__header flex items-center justify-between">
          <h2 class="m0">{{item.name}}</h2>
          <!-- <el-button type="text" v-on:click="addExercise('Curls', item.key)">+ Tilføj øvelse</el-button> -->
        </div>
        <div class="el-card__body">
          <ul>
            <li v-for="child in item.exercises" v-bind:key="child.key" class="text item">
              {{child.details.name}}
            </li>
          </ul>
        </div>
      </div>
    </main>

    <el-footer>
      <!-- <p>{{currentUser}}</p> -->
    </el-footer>

    <!-- Button to toggle "add exercise" container -->
    <el-button class="add-exercise__trigger" type="success" icon="el-icon-plus" v-on:click="addExerciseActive = !addExerciseActive"></el-button>
    
    <!-- Status container for loading and errors -->
    <div class="status__container" v-if="status.loading || status.error">
      <div class="status__content">
        <strong>{{status.title}}</strong>
      </div>
    </div>

  </el-container>
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
      currentUser: null,
      workouts: [],
      newWorkoutName: null,
      addExerciseActive: false,
      newExercise: {},
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

    this.getCurrentUser();
  },

  computed: {
    sortedWorkouts() {
      let sortedItems = this.workouts.sort(function(a, b) {
        // Turn your strings into dates, and then subtract them
        // to get a value that is either negative, positive, or zero.
        return new Date(b.created) - new Date(a.created);
      });

      return sortedItems;
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
          console.log(data.val());

          this.currentUser = data.val();
          this.status.loading = false;

          //Get workout data for the current user
          this.getWorkoutData();

        } else {
          this.status.loading = false;
          this.status.error = true;
          this.status.title = "No user found";
        }
      });
    },

    getWorkoutData() {
      console.log("get workout data...");

      let ref = firebase
        .database()
        .ref("users/" + this.currentUser.key + "/workouts/");

      ref.once("value", data => {
        if (data.val() != null) {
          data.forEach(item => {
            //let array = this.workouts;
            let newItem = item.val();
            //array.indexOf(newItem) === -1 ? array.push(newItem) : console.log("This item already exists");
            this.workouts.push(newItem);
          });
        } else {
          //TODO: No data
        }
      });
    },

    addWorkout() {
      this.status.loading = true;
      this.status.title = "Adding workout";

      API.addWorkout(this.currentUser, this.newWorkoutName)
        .then(result => {
          //Add the new item to the store and empty the input field
          this.workouts.push(result);
          this.newWorkoutName = null;

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
    }
  }
};
</script>
