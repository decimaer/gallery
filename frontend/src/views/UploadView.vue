<script setup lang="ts">
import { useUserStore } from '@/stores/user'
import { type Ref, ref } from 'vue'

const userStore = useUserStore()

const files: Ref<FileList | null> = ref(null)
const isError: Ref<boolean> = ref(false)
const isErrorMessage: Ref<string> = ref('An error occured. Please try again.')

const onFileSelect = function (e: Event) {
  console.log(e.target)

  files.value = (e.target as HTMLInputElement).files
}

const onSubmit = async function () {
  isError.value = false

  const file = files.value?.item(0)

  try {
    if (!file) throw new Error('Enter a valid file.')

    const formData = new FormData()
    formData.append('files', file)
    const userId = userStore.user?.id

    const response = await fetch(`http://localhost:8001/images/${userId}`, {
      method: 'POST',
      body: formData,
      credentials: 'include'
    })
    await response.json()

    if (!response.ok)
      throw new Error('An error occured while uploading the file. Please try again.')
  } catch (error) {
    console.error(error)
    isErrorMessage.value = (error as Error).message
    isError.value = true
  }
}
</script>

<template>
  <main>
    <div>
      <h2>Upload new images</h2>
      <p v-if="isError" class="error">{{ isErrorMessage }}</p>
      <form @submit.prevent="onSubmit" class="file-form">
        <label class="file-label">
          Select images and photos to upload
          <input type="file" @change="onFileSelect" accept="image/*" />
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
