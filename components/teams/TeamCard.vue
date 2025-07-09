<template>
  <div
    class="group relative bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-200 hover:scale-[1.02] cursor-pointer"
    @click="selectTeam"
  >
    <div class="p-6">
      <div class="flex items-center justify-between mb-4">
        <div class="w-12 h-12 rounded-lg flex items-center justify-center text-white text-xl font-bold" :style="{ backgroundColor: team.color }">
          {{ team.name.charAt(0) }}
        </div>
        <!-- <div class="flex items-center space-x-2">
          <button
            @click.stop="$emit('edit', team)"
            class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
            </svg>
          </button>
        </div> -->
      </div>

      <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ team.name }}</h3>
      <p class="text-sm text-gray-500 mb-4">{{ team.description }}</p>

      <div class="flex items-center justify-between text-sm text-gray-500 mb-4">
        <span class="flex items-center">
          <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
          </svg>
          {{ team.members.length }} members
        </span>

      </div>

      <!-- Team Members Avatars -->
      <TeamMembers :members="team.members" :color="team.color" />
    </div>
  </div>
</template>

<script setup lang="ts">
import TeamMembers from './TeamMembers.vue'

interface TeamMember {
  id: string
  name: string
  email: string
}

interface Team {
  id: string
  name: string
  description: string
  color: string
  members: TeamMember[]
  projects?: number
  createdAt: string
}

interface Props {
  team: Team
}

const props = defineProps<Props>()

const selectTeam = () => {
  // Navigate to team profiles page using nested route
  navigateTo(`/teams/${props.team.id}/profile`)
}
</script> 