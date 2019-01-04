<template>
  <div class="page-container">
    <header class="main-header">
      <div class="container">
        <h1 class="main-header__title">Join us</h1>
        <p class="main-header__byline">Join thousands of iron lifting souls and reach your goals with a easy workout tracker</p>
        <button class="btn btn-secondary" @click="googleSignUp">Sign in with Google</button>
      </div>
    </header>

    <main class="container  main-content">
      
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
