<template>
  <div
    class="max-w-[300px] group relative flex-col bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-200 hover:scale-[1.02] cursor-pointer"
    @click="$emit('select', team)"
  >
    <!--  transform -translate-x-1/2 -translate-y-1/2 -->
    <div class="h-[35%] w-full bg-[#B2E1FF]"></div>
    <div
      class="absolute w-14 h-14 top-[35%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 rounded-full text-white text-xl font-bold flex items-center justify-center shadow-lg border-2 border-white"
      :style="{ backgroundColor: team.color }"
    >
      {{ team.name.charAt(0) }}
    </div>
    <!-- Team info -->
    <div class="p-4 pb-28">
      <!-- Name Description  -->
      <h3 class="text-lg font-semibold text-gray-900 mb-2">
        {{ team.name }}
      </h3>
      <p class="text-sm text-gray-500 mb-4">
        {{ team.description.substring(0, 150) }}...
      </p>

      <!-- Members Length -->
      <div
        class="flex-col items-center justify-between text-sm text-gray-500 mb-4"
      >
        <div>
          <span class="flex items-center">
            <svg
              class="w-4 h-4 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            {{ team.members.length }} members
          </span>
        </div>
        <!-- Team Members Avatars -->
        <div
          class="rounded-full border-2 border-white flex items-center justify-end text-xs font-medium text-gray-600 pl-4 mb-4 cursor-pointer transition-colors duration-200"
          :title="`+${team.members} more members`"
        >
          <Avatar
            v-for="(member, index) in team.members"
            :key="index"
            :name="member.name"
            :color="team.color"
            :class="`-ml-2 ${index > 0 ? 'hidden sm:block' : ''}`"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Avatar from "~/components/ui/Avatar.vue";

interface TeamMember {
  id: string;
  name: string;
  email: string;
}

interface Team {
  id: string;
  name: string;
  description: string;
  color: string;
  members: TeamMember[];
  projects?: number;
  createdAt: string;
}

interface Props {
  team: Team;
}

defineProps<Props>();

defineEmits<{
  select: [team: Team];
}>();
</script>
