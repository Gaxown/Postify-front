<template>
  <div>
    <!-- This page uses the Scheduler layout -->
  </div>
</template>

<script setup lang="ts">
// Use the Scheduler layout
definePageMeta({
  layout: 'scheduler'
})

// Get the profile ID from the route
const route = useRoute()
const profileId = route.params.id

// You can fetch profile-specific data here using the profileId
</script> 