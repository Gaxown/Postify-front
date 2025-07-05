<template>
  <div 
    class="rounded-full overflow-hidden bg-gray-100"
    :class="sizeClasses"
  >
    <img 
      v-if="avatar" 
      :src="avatar" 
      :alt="name"
      class="w-full h-full object-cover"
    />
    <div 
      v-else 
      class="w-full h-full flex items-center justify-center text-white font-bold"
      :style="{ backgroundColor: color }"
      :class="textSizeClass"
    >
      {{ initials }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  name: string
  avatar?: string
  color: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md'
})

const initials = computed(() => {
  return props.name ? props.name.charAt(0).toUpperCase() : '?'
})

const sizeClasses = computed(() => {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20'
  }
  return sizes[props.size]
})

const textSizeClass = computed(() => {
  const textSizes = {
    sm: 'text-xs',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl'
  }
  return textSizes[props.size]
})
</script> 