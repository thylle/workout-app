<template>
  <div class="page-container">
    <div v-if="currentWorkout">
      <header class="main-header">
        <div class="container">
          <h1 class="main-header__title">{{currentWorkout.name}}</h1>
          <p class="main-header__byline">Last updated: {{currentWorkout.updated | fromNow}}</p>
          <button class="btn btn-secondary" v-on:click="openNewExerciseDialog">Create new exercise</button>
        </div>
      </header>

      <main class="container  main-content">
        <div >
          <div class="card  mb-3  exercises" v-for="item in currentWorkout.exercises" v-bind:key="item.key">
            <div class="card__header">
              <h2 class="card__title">{{item.details.name}}</h2>
              <div class="card__title  exercise__detail  float-right">
                <span>{{item.details.weight}}</span>
                <span>KG</span>
              </div>
            </div>

            <div class="row  card__body">
              <div class="col  exercise__detail" v-if="item.details.sets">
                <span v-html="item.details.sets"></span>
                <span>sets</span>
              </div>

              <div class="col  exercise__detail" v-if="item.details.reps">
                <span v-html="item.details.reps"></span>
                <span>sets</span>
              </div>

              <div class="col  exercise__detail" v-if="item.details.rest">
                <span v-html="item.details.rest"></span>
                <span>rest</span>
              </div>

              <div class="col  exercise__detail">
                <span class="icon icon-chevron-down"></span>
                <span>more</span>
              </div>
              <!-- <p class="m-0  muted">Last updated: {{item.details.updated}}</p> -->
            </div>
          </div>
        </div>
      </main>
    </div>
    
    <div v-else>
      <header class="main-header">
        <div class="container">
          <h1 class="main-header__title">Sorry Arnold</h1>
          <p class="main-header__byline">This workout was too powerfull for the system to find it. <br> Try looking for it somewhere else</p>
          <button class="btn btn-secondary" v-on:click="routeBack">Get me out of here</button>
        </div>
      </header>
    </div>
  </div>
</template>

<script>
export default {
  transition: "slide-left",
  data() {
    return {
      workoutKey: this.$route.params.id
    };
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
    },
    currentWorkout() {
      if (this.workouts) {
        this.$store.commit("SET_CURRENT_WORKOUT", this.workoutKey);
        return this.$store.getters.currentWorkout;
      }
    },
    
  },
  methods:{
    routeBack(){
      history.back();
    },
    openNewExerciseDialog(){
      this.$store.commit('OPEN_NEW_EXERCISE_DIALOG', this.workoutKey)
    }
  }
};
</script>
