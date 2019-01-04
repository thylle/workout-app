<template>
  <el-dialog title="Your new exercise" width="90%" v-bind:visible.sync="addExerciseValues.active">
    <div class="AddExerciseDialog">
      <form v-on:submit.prevent="addExercise()">
          <input class="form-control  mb-2" placeholder="Name your exercise" v-model="newExercise.name" />
          <textarea class="form-control  mb-3" placeholder="Make a note to the exercise" v-model="newExercise.notes" />
          
          <!-- Option list of workouts -->
          <div>
            <label>Choose workout </label>
            <add-workout></add-workout>
          </div>
          
          <select class="form-control  mb-3" v-model="addExerciseValues.workoutKey">
              <option
              v-for="item in workouts"
              v-if="item.name"
              :key="item.key"
              :label="item.name"
              :value="item.key">
              </option>
          </select>

          <label>Image</label>
          <!-- <input type="file"  :name="uploadFieldName" :disabled="isSaving" @change="filesChange($event.target.name, $event.target.files); fileCount = $event.target.files.length" accept="image/*" class="input-file"> -->
          <!-- <input class="form-control  mb-3" placeholder="Upload a image of the exercise" type="file" multiple  v-bind:name="newExerciseImage" @change="filesChange($event.target.name, $event.target.files); fileCount = $event.target.files.length" accept="image/*"/> -->
          <input class="form-control  mb-3" placeholder="Upload a image of the exercise" type="file" multiple @change="fileChange($event);" accept="image/*"/>
          
          <label>Weight in kg</label>
          <input class="form-control  mb-3" placeholder="How much weight" type="number" v-model="newExercise.weight" step=".5" v-bind:min="0" />
              
          <label>Sets</label>
          <input class="form-control  mb-3" placeholder="How many sets" type="number" v-model="newExercise.sets" v-bind:min="0" />

          <label>Reps</label>
          <input class="form-control  mb-3" placeholder="Number of reps" type="number" v-model="newExercise.reps" v-bind:min="0" />

          <label>Rest in sec</label>
          <input class="form-control  mb-3" placeholder="Rest in seconds" type="number" v-model="newExercise.rest" v-bind:min="0" />

          <div class="text-right  dialog-footer">
            <button class="btn mr-3" type="button" @click="closeDialog()">Cancel</button>
            <button type="submit" class="btn btn-success">Create exercise</button>
          </div>
      </form>
    </div>
  </el-dialog>
</template>

<script>
import AddWorkout from "~/components/AddWorkout.vue";
import APIService from "~/services/api-service.js";
const API = new APIService();

export default {
  data() {
    return {
      newWorkoutName: null,
      addWorkoutActive: false,
      newExercise: {}
    };
  },

  components: {
    AddWorkout
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
    closeDialog() {
      this.$store.commit('CLOSE_NEW_EXERCISE_DIALOG')
    },

    fileChange(event) {
      const files = event.target.files;
      this.newExercise.images = [];

      // if (!fileList.length) return;

      // append the files to the images array
      Array.from(Array(files.length).keys()).map(x => {
        let newName = (+new Date()) + '-' + files[x].name;
        this.newExercise.images.push({name: newName, file: files[x]});
      });

      console.log("this.newExercise.images", this.newExercise.images);
    },

    addExercise() {
      this.newExercise.workoutKey = this.addExerciseValues.workoutKey;

      API.addExercise(this.currentUser, this.newExercise).then(newItem => {
        this.newExercise = {};
        this.closeDialog();

        //TODO: add new item to store or get data from firebase again...
        API.getCurrentUserData(this.$store);
      });
    }
  }
};
</script>