<template>
  <div 
    :class="[
      'flex items-center justify-center rounded',
      sizeClasses[size],
      platformStyles[platform]?.background || 'bg-gray-200 dark:bg-gray-700'
    ]"
  >
    <Icon 
      :name="platformIcons[platform] || 'heroicons:globe-alt'"
      :class="[
        platformStyles[platform]?.color || 'text-gray-600 dark:text-gray-400',
        iconSizeClasses[size]
      ]"
    />
  </div>
</template>

<script setup lang="ts">
interface Props {
  platform: 'twitter' | 'facebook' | 'instagram' | 'linkedin' | 'tiktok' | string
  size?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md'
})

const platformIcons = {
  twitter: 'fa6-brands:x-twitter',
  facebook: 'fa6-brands:facebook',
  instagram: 'fa6-brands:instagram', 
  linkedin: 'fa6-brands:linkedin',
  tiktok: 'fa6-brands:tiktok'
}

const platformStyles = {
  twitter: {
    background: 'bg-black dark:bg-white',
    color: 'text-white dark:text-black'
  },
  facebook: {
    background: 'bg-blue-600',
    color: 'text-white'
  },
  instagram: {
    background: 'bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500',
    color: 'text-white'
  },
  linkedin: {
    background: 'bg-blue-700',
    color: 'text-white'
  },
  tiktok: {
    background: 'bg-black',
    color: 'text-white'
  }
}

const sizeClasses = {
  sm: 'w-6 h-6',
  md: 'w-8 h-8', 
  lg: 'w-12 h-12'
}

const iconSizeClasses = {
  sm: 'w-3 h-3',
  md: 'w-4 h-4',
  lg: 'w-6 h-6'
}
</script>
