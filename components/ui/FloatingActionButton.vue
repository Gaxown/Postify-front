<template>
  <button 
    @click="navigateTo('/compose')"
    class="floating-action"
    v-motion
    :whileHover="{ scale: 1.1 }"
    :whileTap="{ scale: 0.9 }"
  >
    <Icon name="heroicons:plus" class="w-6 h-6" />
  </button>
</template>
