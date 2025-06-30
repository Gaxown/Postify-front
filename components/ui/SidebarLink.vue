<template>
  <NuxtLink
    :to="to"
    :class="[
      'group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200',
      isActive 
        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-105' 
        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white',
      collapsed ? 'justify-center' : ''
    ]"
    v-motion
    :initial="{ scale: 1 }"
    :whileHover="{ scale: 1.02 }"
    :whileTap="{ scale: 0.98 }"
  >
    <Icon :name="icon" class="flex-shrink-0 w-5 h-5" />
    
    <span 
      v-if="!collapsed" 
      class="ml-3 flex-1"
      :class="{ 'sr-only': collapsed }"
    >
      {{ name }}
    </span>
    
    <UBadge 
      v-if="badge && !collapsed" 
      :label="badge.toString()"
      size="xs"
      variant="solid"
      color="white"
      class="ml-auto"
    />
  </NuxtLink>
</template>

<script setup lang="ts">
interface Props {
  to: string
  icon: string
  name: string
  badge?: number
  collapsed?: boolean
}

const props = defineProps<Props>()
const route = useRoute()

const isActive = computed(() => {
  if (props.to === '/') {
    return route.path === '/'
  }
  return route.path.startsWith(props.to)
})
</script>
