import Vue from 'vue'
import { Database } from '@/services/firebase-service.js'


export default class APIService {
  
  getCurrentUserData(store, user) {
    let ref = Database.ref("users/1337");

    ref.once("value", data => {

      if (data.val() != null) {
        let currentUser = data.val();
        let workoutsAsArray = [];

        console.log("getCurrentUserData", currentUser);

        //Change workouts and exercises lists to arrays - so that we can work with arrays instead of objects
        if(currentUser.workouts){
          workoutsAsArray = Object.entries(currentUser.workouts).map(e => Object.assign(e[1], { key: e[0] }));
        
          workoutsAsArray.forEach(item => {
            if(item.exercises){
              let exercisesAsArray = Object.entries(item.exercises).map(e => Object.assign(e[1], { key: e[0] }));
              item.exercises = exercisesAsArray;
            }
          });
        }
        
        currentUser.workouts = workoutsAsArray;
        
        //Add the current user to the store
        store.commit('SET_CURRENTUSER', currentUser)
        store.state.status.loading = false;
      } 
      else {
        store.state.status.loading = false;
        store.state.status.error = true;
        store.state.status.title = "No user found";
      }
    });
  }

  addWorkout(user, name) {
    return new Promise((resolve, reject) => {
      let refName = "users/" + user.key + "/workouts";
      let ref = Database.ref(refName).push();
      let newItem = {
        key: ref.key,
        name: name,
        created: new Date().toString(),
        updated: new Date().toString(),
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
    let ref = Database.ref(refName).push();
    let images = newExercise.images;

    let newItem = {
      key: ref.key,
      created: new Date().toString(),
      workoutKey: workoutKey,
      details: newExercise
    }

    return new Promise((resolve, reject) => {

      if(images){
        console.log("Start uploading images....");
        let image = images[0];
        let storageRef = firebase.storage().ref();
        let name = image.name;
        let file = image.file;
        
        //Upload file
        storageRef.child(name).put(file).then((snapshot) => {
          console.log("uploaded image src: ", snapshot.downloadURL);
          newItem.details.images[0].src = snapshot.downloadURL;

          this.addToDB(ref, newItem).then((result) => {
            resolve(result);
          }).catch((e) => {
            reject(e);
          });
        });
      }
      else{
        this.addToDB(ref, newItem).then((result) => {
          resolve(result);
        }).catch((e) => {
          reject(e);
        });
      }
    });
  }

  //Add data to firebase database
  addToDB(ref, newItem) {
    return new Promise((resolve, reject) => {
      ref.set(newItem).then(() => {
        ref.once('value').then((snapshot) => {
          let newItem = snapshot.val();

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
