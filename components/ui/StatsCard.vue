<template>
  <UCard
    class="relative overflow-hidden"
    v-motion
    :initial="{ opacity: 0, y: 20 }"
    :visible="{ opacity: 1, y: 0 }"
  >
    <div class="flex items-center">
      <div class="flex-shrink-0">
        <div 
          :class="[
            'w-12 h-12 rounded-lg flex items-center justify-center',
            colorClasses[color]
          ]"
        >
          <Icon :name="icon" class="w-6 h-6 text-white" />
        </div>
      </div>
      
      <div class="ml-4 flex-1">
        <div class="flex items-center justify-between">
          <p class="text-sm font-medium text-gray-600 dark:text-gray-400">
            {{ title }}
          </p>
          <div 
            v-if="change !== undefined"
            :class="[
              'flex items-center text-xs',
              change >= 0 ? 'text-green-600' : 'text-red-600'
            ]"
          >
            <Icon 
              :name="change >= 0 ? 'heroicons:arrow-trending-up' : 'heroicons:arrow-trending-down'" 
              class="w-3 h-3 mr-1" 
            />
            {{ Math.abs(change) }}%
          </div>
        </div>
        
        <p class="text-2xl font-semibold text-gray-900 dark:text-white mt-1">
          {{ formattedValue }}
        </p>
      </div>
    </div>
  </UCard>
</template>

<script setup lang="ts">
interface Props {
  title: string
  value: number
  change?: number
  icon: string
  color: 'blue' | 'green' | 'orange' | 'purple' | 'red'
  format?: 'number' | 'percentage' | 'currency'
}

const props = withDefaults(defineProps<Props>(), {
  format: 'number'
})

const colorClasses = {
  blue: 'bg-blue-500',
  green: 'bg-green-500',
  orange: 'bg-orange-500',
  purple: 'bg-purple-500',
  red: 'bg-red-500'
}

const formattedValue = computed(() => {
  switch (props.format) {
    case 'percentage':
      return `${props.value}%`
    case 'currency':
      return new Intl.NumberFormat('en-US', { 
        style: 'currency', 
        currency: 'USD' 
      }).format(props.value)
    case 'number':
    default:
      return new Intl.NumberFormat('en-US').format(props.value)
  }
})
</script>
