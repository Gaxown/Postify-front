<template>
  <div class="flex -space-x-2">
    <div
      v-for="(member, index) in displayedMembers"
      :key="index"
      class="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-xs font-medium text-white"
      :style="{ backgroundColor: color || getAvatarColor(member.name) }"
      :title="member.name"
    >
      {{ member.name.charAt(0) }}
    </div>
    <div
      v-if="members.length > maxDisplay"
      class="w-8 h-8 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-xs font-medium text-gray-600"
      :title="`+${members.length - maxDisplay} more members`"
    >
      +{{ members.length - maxDisplay }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface TeamMember {
  name: string
}

interface Props {
  members: TeamMember[]
  maxDisplay?: number
  color?: string
}

const props = withDefaults(defineProps<Props>(), {
  maxDisplay: 4,
  color: undefined
})

const displayedMembers = computed(() => {
  return props.members.slice(0, props.maxDisplay)
})

const getAvatarColor = (name: string) => {
  const colors = ['#8B5CF6', '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#EC4899']
  return colors[name.charCodeAt(0) % colors.length]
}
</script> 