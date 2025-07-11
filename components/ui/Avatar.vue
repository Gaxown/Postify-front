<template>
  <div :class="`flex ${props.class}`">
    <img
      v-if="getAvatarImage"
      :src="getAvatarImage"
      class="w-8 h-8 rounded-full border-2 border-white object-cover"
      :alt="name"
    />
    <div
      v-else
      class="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-xs font-medium text-white"
      :style="{ backgroundColor: getAvatarColor(name) }"
    >
      <span>
        {{ name.charAt(0).toUpperCase() }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

interface Props {
  name: string;
  color?: string;
  image?: string;
  class?: string;
}

const props = withDefaults(defineProps<Props>(), {
  color: "#DAC8FF",
});

const getAvatarColor = (name: string) => {
  const colors = [
    "#8B5CF6",
    "#3B82F6",
    "#10B981",
    "#F59E0B",
    "#EF4444",
    "#EC4899",
  ];
  return colors[name.charCodeAt(0) % colors.length];
};

const getAvatarImage = computed(() => {
  if (props.image) {
    return props.image;
  }
  return null;
});
</script>
