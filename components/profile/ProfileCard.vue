<template>
  <div
    class="group relative bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-200 hover:scale-[1.02] cursor-pointer"
  >
    <div class="p-6">
      <div class="flex items-center justify-between mb-4">
        <ProfileAvatar
          :name="profile.name"
          :avatar="profile.avatar"
          :color="profile.color"
          size="md"
        />

        <!-- Edit button can be uncommented if needed -->
        <!-- <div class="flex items-center space-x-2">
          <button
            @click.stop="$emit('edit', profile)"
            class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
            </svg>
          </button>
        </div> -->
      </div>

      <h3 class="text-lg font-semibold text-gray-900 mb-2">
        {{ profile.name }}
      </h3>
      <p class="text-sm text-gray-500 mb-4">{{ profile.description }}</p>

      <div class="flex items-center justify-between text-sm text-gray-500 mb-4">
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
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
          {{ profile.accounts.length }} accounts
        </span>
      </div>

      <!-- Platform Icons -->
      <PlatformIcons :accounts="profile.accounts" />
    </div>
  </div>

  <svg
    xmlns="http://www.w3.org/2000/svg"
    x="0px"
    y="0px"
    width="100"
    height="100"
    viewBox="0 0 48 48"
  >
    <path fill="#039be5" d="M24 5A19 19 0 1 0 24 43A19 19 0 1 0 24 5Z"></path>
    <path
      fill="#fff"
      d="M26.572,29.036h4.917l0.772-4.995h-5.69v-2.73c0-2.075,0.678-3.915,2.619-3.915h3.119v-4.359c-0.548-0.074-1.707-0.236-3.897-0.236c-4.573,0-7.254,2.415-7.254,7.917v3.323h-4.701v4.995h4.701v13.729C22.089,42.905,23.032,43,24,43c0.875,0,1.729-0.08,2.572-0.194V29.036z"
    ></path>
  </svg>
</template>

<script setup lang="ts">
import ProfileAvatar from "./ProfileAvatar.vue";
import PlatformIcons from "./PlatformIcons.vue";

export interface Profile {
  name: string;
  description: string;
  avatar?: string;
  color: string;
  accounts: { platform: string }[];
}

interface Props {
  profile: Profile;
}

defineProps<Props>();
</script>
