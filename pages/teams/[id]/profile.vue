<template>
  <div>
    <!-- Content will be handled by the profiles layout -->
  </div>
</template>

<script setup lang="ts">
// Use the profiles layout
definePageMeta({
  layout: 'profiles'
})

// Set page title with team context
useHead({
  title: 'Team Profiles - Postify'
})
</script> 