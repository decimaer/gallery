<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import Cookies from 'js-cookie'
import { useUserStore } from '@/stores/user'

const authStore = useAuthStore()
const userStore = useUserStore()

console.log('signedin', Cookies.get('signedin'))
if (Cookies.get('signedin')) {
  authStore.isLoggedIn = true
  userStore.getUser()
}
</script>

<template>
  <header>
    <div class="wrapper">
      <h1>Image Gallery</h1>
      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink v-if="authStore.isLoggedIn" to="/gallery">Gallery</RouterLink>
        <RouterLink v-if="authStore.isLoggedIn" to="/upload">Upload</RouterLink>
        <RouterLink v-if="!authStore.isLoggedIn" to="/login">Login</RouterLink>
        <RouterLink v-if="!authStore.isLoggedIn" to="/register">Register</RouterLink>
        <a href="#" v-if="authStore.isLoggedIn" @click="() => authStore.logout()">Log out</a>
      </nav>
    </div>
  </header>
  <main>
    <RouterView />
  </main>
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

main {
  min-width: 50vw;
  min-height: 50vh;
  padding: 2em;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  font-weight: bold;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  color: black;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
