<script setup lang="ts">
import { useUserStore } from '@/stores/user'
import { type Ref, ref } from 'vue'

const userStore = useUserStore()

const files: Ref<FileList | null> = ref(null)
// const password: Ref<string | null> = ref(null)
const isError: Ref<boolean> = ref(false)

const onFileSelect = function (e: Event) {
  console.log(e.target)

  files.value = (e.target as HTMLInputElement).files
}

const onSubmit = async function () {
  console.log('SUBMITTING FILES')

  if (!files.value) return (isError.value = true)

  const formData = new FormData()

  for (let i = 0; i < files.value.length; i++) {
    const file = files.value.item(i)
    formData.append('files', file)
    console.log(file)
  }

  const userId = userStore.user?.id

  console.log(userStore.user)

  const message = await fetch(`http://localhost:8001/images/${userId}`, {
    method: 'POST',
    /*  headers: {
      'Content-Type': 'multipart/form-data',
      boundary: 'hampus-test-boundary'
    }, */
    body: formData,
    mode: 'no-cors',
    credentials: 'include'
  })
}
</script>

<template>
  <main>
    <div>
      <h2>Upload new images</h2>
      <form @submit.prevent="onSubmit" class="file-form">
        <label class="file-label">
          Select images and photos to upload
          <input type="file" @change="onFileSelect" accept="image/*" multiple />
        </label>
        <input type="submit" value="Upload to gallery!" />
      </form>
    </div>
  </main>
</template>

<style>
.error {
  color: red;
}

.file-form {
  display: flex;
  flex-direction: column;
  gap: 1em;
  margin-top: 2em;
  width: 100%;
}

.file-label {
  display: flex;
  flex-direction: column;
}

input[type='submit'] {
  width: max-content;
}
</style>
