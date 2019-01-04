<template>
  <div class="page-container">
    <header class="main-header">
      <div class="container">
        <h1 class="main-header__title">Workouts</h1>
        <p class="main-header__byline">A list of all your workouts</p>
        <button class="btn btn-secondary" v-on:click="addWorkoutActive = true">Create new workout</button>
      </div>
    </header>

    <main class="container  main-content" v-if="currentUser">
      <!-- Add workout dialog -->
      <el-dialog title="Your new workout" width="90%" v-bind:visible.sync="addWorkoutActive">
        <form v-on:submit.prevent="addWorkout()">
          <input ref='workoutName' class="form-control mb-3" placeholder="Name your new workout" v-model="newWorkoutName" />

          <div class="text-right  dialog-footer">
            <button class="btn mr-3" type="button" @click="addWorkoutActive = false">Cancel</button>
            <button class="btn btn-success">Create workout</button>
          </div>
        </form>
      </el-dialog>

      <!-- Workout list -->
      <nuxt-link :to="'/workouts/'+ item.key" class="card  card--link" v-for="item in workouts" v-bind:key="item.key" v-if="item.name">
        <div class="card__header">
          <h2 class="card__title">{{item.name}}</h2>
          <!-- <button class="link float-right" type="text" v-on:click="addExerciseForWorkout(item)">Add exercise</button> -->
        </div>
        <div class="card__body">
          <p class="mb-1" v-html="exerciseCountText(item.exercises)"></p>
          <p class="m-0  muted">Last updated: {{item.updated | fromNow}}</p>

          <!-- <img v-for="image in item.exercises[0].details.images" v-bind:src="image.src" v-bind:alt="item.name" v-bind:key="image.name"/> -->

          <!-- <div class="text item  exercise" v-for="child in item.exercises" v-bind:key="child.key">
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
          </div> -->
        </div>
      </nuxt-link>
    </main>
  </div>
</template>

<script>
import AddExerciseDialog from "~/components/AddExerciseDialog.vue";
import APIService from "~/services/api-service.js";
const API = new APIService();

export default {
  transition(to, from) {
    if (from && from.name === "workouts-id") return "slide-right";
    return "slide-left";
  },

  data() {
    return {
      newWorkoutName: null,
      addWorkoutActive: false,
      addExerciseValues: {
        active: false,
        workoutKey: null
      }
    };
  },

  components: {
    AddExerciseDialog
  },

  computed: {
    status() {
      return this.$store.getters.status;
    },
    currentUser() {
      return this.$store.getters.currentUser;
    },
    workouts() {
      return this.$store.getters.workoutsSorted;
    }
  },

  methods: {
    addWorkout() {
      this.status.loading = true;
      this.status.title = "Adding workout";

      API.addWorkout(this.currentUser, this.newWorkoutName)
        .then(result => {
          //Add the new item to the store and empty the input field
          this.$store.commit("ADD_WORKOUT", result);
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

    addExerciseForWorkout(workout) {
      this.$store.commit("OPEN_NEW_EXERCISE_DIALOG", workout.key);
    },

    exerciseCountText(exercises) {
      let text = "Exercises: ";
      let count = 0;

      if (exercises) {
        count = exercises.length;
      }

      return text + count;
    }
  }
};
</script>