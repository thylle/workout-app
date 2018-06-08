<template>
  <div class="page-container">

    <header class="main-header">
      <div class="container">
        <h1 class="main-header__title">Login</h1>
        <p class="main-header__byline">Login to see your workouts</p>
      </div>
    </header>

    <main>
      <div class="container">
        <button class="btn btn-primary" @click="googleSignUp">Sign in with Google</button>
      </div>
    </main>
  </div>
</template>

<script>
export default {
  transition: 'slide-right',
  methods: {
    googleSignUp () {
      this.$store.dispatch('signInWithGoogle').then(() => {
        console.log('inside then statement on login');
      }).catch((e) => {
        console.log(e.message);
      })
    }
  }
}
</script>
