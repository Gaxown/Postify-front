<template>
  <div
    @click="onClick"
    class="group relative bg-white rounded-xl border-2 border-dashed border-gray-300 hover:border-purple-400 p-8 flex flex-col items-center justify-center min-h-[280px] cursor-pointer transition-all duration-200 hover:shadow-md"
  >
    <div
      class="w-16 h-16 bg-gray-100 group-hover:bg-purple-100 rounded-full flex items-center justify-center mb-4 transition-colors"
    >
      <svg
        class="w-8 h-8 text-gray-400 group-hover:text-purple-600"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
        />
      </svg>
    </div>
    <h3
      class="text-lg font-semibold text-gray-900 group-hover:text-purple-600 transition-colors"
    >
      {{ title }}
    </h3>
    <p class="text-sm text-gray-500 text-center mt-2">
      {{ description }}
    </p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string
  description: string
  onCreate?: () => void
}

const props = defineProps<Props>()

const onClick = () => {
  if (props.onCreate) {
    props.onCreate()
  }
}
</script> 