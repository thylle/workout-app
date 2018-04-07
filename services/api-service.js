import Vue from 'vue'
import firebase from "firebase";

export default class APIService {

  addWorkout(user, name) {
    return new Promise((resolve, reject) => {
      let refName = "users/" + user.key + "/workouts";
      let ref = firebase.database().ref(refName).push();
      let newItem = {
        key: ref.key,
        name: name,
        created: new Date().toString()
      }

      this.addToDB(ref, newItem).then((result) => {
        resolve(result);
      }).catch((e) => {
        reject(e);
      });
    });
  }


  addExercise(user, newExercise) {
    let workoutKey = newExercise.workoutKey ? newExercise.workoutKey : "no-workout";
    let refName = "users/" + user.key + "/workouts/" + workoutKey + "/exercises";
    let ref = firebase.database().ref(refName).push();

    let newItem = {
      key: ref.key,
      created: new Date().toString(),
      workoutKey: workoutKey,
      details: newExercise      
    }

    return new Promise((resolve, reject) => {
      this.addToDB(ref, newItem).then((result) => {
        resolve(result);
      }).catch((e) => {
        reject(e);
      });
    });
  }


  addToDB(ref, newItem) {
    return new Promise((resolve, reject) => {
      ref.set(newItem).then(() => {
        ref.once('value').then((snap) => {
          let newItem = snap.val();

          console.log("new item added...", newItem);

          resolve(newItem);
        });
      })
      .catch((error) => {
        reject(error);
      });
    });
  }
}
