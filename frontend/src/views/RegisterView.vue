<script setup lang="ts">
import { useUserStore } from '@/stores/user'
// import { gql } from '@apollo/client/core'
// import { useQuery } from '@vue/apollo-composable'
import { ref, type Ref } from 'vue'

const userStore = useUserStore()

const username: Ref<string> = ref('')
const email: Ref<string> = ref('')
const password: Ref<string> = ref('')
const passwordConfirm: Ref<string> = ref('')

const onSubmit = function () {
  console.log('register')

  userStore.registerUser({
    username: username.value,
    email: email.value,
    password: password.value,
    passwordConfirm: passwordConfirm.value
  })
}
</script>

<template>
  <div class="register">
    <h2>Register a new user</h2>
    <form @submit.prevent="onSubmit" class="register-form" action="">
      <label class="register-label">
        Username
        <input type="text" v-model="username" />
      </label>
      <label class="register-label">
        Email
        <input type="email" v-model="email" />
      </label>
      <label class="register-label">
        Password
        <input type="password" v-model="password" />
      </label>
      <label class="register-label">
        Confirm Password
        <input type="password" v-model="passwordConfirm" />
      </label>
      <input type="submit" value="Register" />
    </form>
  </div>
</template>

<style>
@media (min-width: 1024px) {
}
.register-form {
  display: flex;
  flex-direction: column;
  gap: 1em;
  margin-top: 2em;
}

.register-label {
  display: flex;
  flex-direction: column;
}
</style>
