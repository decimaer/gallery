<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { ref, type Ref } from 'vue'

const authStore = useAuthStore()
// const form$ = ref(null)

const email: Ref<string | null> = ref(null)
const password: Ref<string | null> = ref(null)
const isError: Ref<boolean> = ref(false)

const onSubmit = function () {
  console.log(email.value, password.value)
  if (!email.value || !password.value) return (isError.value = true)

  authStore.login({ email: email.value, password: password.value })
}
</script>

<template>
  <div class="login">
    <h2>Login</h2>
    <p v-if="isError" class="error">You must enter a username and password.</p>
    <p v-if="authStore.isLoginError" class="error">
      Login failed. Please try again or register a new account.
    </p>
    <form @submit.prevent="onSubmit" class="login-form" action="">
      <label class="login-label">
        Email
        <input type="text" v-model="email" />
      </label>
      <label class="login-label">
        Password
        <input type="password" v-model="password" />
      </label>
      <input type="submit" value="Login!" />
    </form>
  </div>
</template>

<style>
@media (min-width: 1024px) {
}

.error {
  color: red;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1em;
  margin-top: 2em;
  width: 15em;
}

.login-label {
  display: flex;
  flex-direction: column;
}
</style>
