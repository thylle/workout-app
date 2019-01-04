<template>
<div class="float-right">
  <button class="float-right link" type="button" tabindex="-1" v-on:click="addWorkoutIsActive = true">Create new workout</button>
  <form v-on:submit.prevent="addWorkout()" v-if="addWorkoutIsActive">
    <input ref='workoutName' class="form-control mb-3" placeholder="Name your new workout" v-model="newWorkoutName" />

    <div class="text-right">
        <button class="btn mr-3" type="button" @click="addWorkoutIsActive = false">Cancel</button>
        <button class="btn btn-success">Create workout</button>
    </div> 
  </form>
  </div>
</template>

<script>
import APIService from "~/services/api-service.js";
const API = new APIService();

export default {
  data() {
    return {
      newWorkoutName: null,
      addWorkoutIsActive: false,
      newExercise: {}
    };
  },

  computed: {
    addExerciseValues() {
      return this.$store.getters.addExerciseValues;
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
      this.$store.state.status.loading = true;
      this.$store.state.status.title = "Adding workout";

      API.addWorkout(this.currentUser, this.newWorkoutName)
        .then(result => {
          //Add the new item to the store and empty the input field
          this.$store.commit('ADD_WORKOUT', result);
          console.log("ADD_WORKOUT", result);
          this.$store.state.addExerciseValues.workoutKey = result.key;
          this.newWorkoutName = null;
          this.addWorkoutIsActive = false;

          setTimeout(() => {
            this.$store.state.status.loading = false;
          }, 300);
        })
        .catch(e => {
          console.error("error adding workout", e);
        });
    },
  }
};
</script>