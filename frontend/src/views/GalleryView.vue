<script setup lang="ts">
// TODO: fetch all images in galleryStore
// TODO: render images
import { useImageStore } from '@/stores/image'
import { useUserStore } from '@/stores/user'
import { onMounted } from 'vue'
const imageStore = useImageStore()
const userStore = useUserStore()
const userId = userStore.user?.id

onMounted(async () => {
  await imageStore.getImages()
})
</script>

<template>
  <main>
    <div>
      <h2>View all images</h2>
    </div>
    <div>
      <div>
        <img
          v-for="(image, i) in imageStore.images"
          :key="i"
          :src="`http://localhost:8001/images/${userId}/${image.path}`"
          alt=""
        />
      </div>
    </div>
  </main>
</template>

<style></style>
