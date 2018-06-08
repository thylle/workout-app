export default function ({ store, redirect, route }) {
  
  if(store.state.user != null && route.name == "index"){
    console.log("redirect to workouts");
    redirect('/workouts')
  }

  if(store.state.user == null && route.name != "index"){
    console.log("redirect to home");
    redirect('/')
  }
}