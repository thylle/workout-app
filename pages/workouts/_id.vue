<template>
  <div class="page-container">
    

    <div v-if="currentWorkout">
      <header class="main-header">
        <div class="container">
          <h1 class="main-header__title">{{currentWorkout.name}}</h1>
          <p class="main-header__byline">Last updated: {{currentWorkout.updated}}</p>
        </div>
      </header>

      <main class="container">
        <ul class="exercises" v-for="item in currentWorkout.exercises" v-bind:key="item.key">
          <li>{{item.details.name}}</li>
        </ul>
      </main>
    </div>

    <div v-else>
      <h1>This workout was too powerfull for the system OR it has been deleted. Either way - try looking for it somewhere else</h1>
    </div>
  </div>
</template>

<script>
  export default {
    transition: 'slide-left',
    data() {
      return {
      };
    },
    computed: {
      status(){
        return this.$store.getters.status;
      },
      currentUser() {
        return this.$store.getters.currentUser;
      },
      workouts() {
        return this.$store.getters.workoutsSorted;
      },
      currentWorkout(){
        let workoutKey = this.$route.params.id;

        if(this.workouts){
          this.$store.commit('SET_CURRENT_WORKOUT', workoutKey)
          return this.$store.getters.currentWorkout;
        }
      }
    }
  }
</script>
