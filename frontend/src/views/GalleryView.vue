<script setup lang="ts">
import { useImageStore } from '@/stores/image'
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'

const { userId } = storeToRefs(useUserStore())
const selectedImage = ref<string | null>(null)
const { getImages } = storeToRefs(useImageStore())
const { fetchImages } = useImageStore()

fetchImages()

const openImageModal = (imageUrl: string) => {
  selectedImage.value = imageUrl
}

const closeImageModal = () => {
  selectedImage.value = null
}
</script>

<template>
  <main>
    <div v-if="!userId || !getImages.length">Loading...</div>
    <div v-if="userId" class="image-gallery">
      <p v-if="userId && !getImages.length">Go to upload to upload new images.</p>
      <div v-for="(image, i) in getImages" :key="i" class="image-container">
        <img
          :src="`http://localhost:8001/images/${userId}/${image.path}`"
          @click="openImageModal(`http://localhost:8001/images/${userId}/${image.path}`)"
        />
      </div>
    </div>

    <div v-if="selectedImage" class="image-modal" @click="closeImageModal">
      <img :src="selectedImage" alt="Full Size Image" />
    </div>
  </main>
</template>

<style scoped>
.image-gallery {
  display: flex;
  flex-wrap: wrap;
}

.image-container {
  width: 200px;
  height: 200px;
  margin: 10px;
  overflow: hidden;
  position: relative;
  cursor: pointer;
  transition: transform 0.3s ease-in-out;
}

.image-container:hover {
  transform: scale(1.1);
}

.image-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
}

.image-modal img {
  max-width: 90%;
  max-height: 90%;
}
</style>
