<template>
  <div
    class="max-w-[250px] min-h-[300px] group relative flex-col bg-white shadow-sm border rounded-xl border-gray-200 hover:shadow-lg transition-all duration-200 hover:scale-[1.02] cursor-pointer"
  >
    <!--  transform -translate-x-1/2 -translate-y-1/2 -->
    <div
      class="h-[30%] w-full rounded-t-xl"
      :style="{ background: data.color }"
    ></div>
    <div
      class="absolute w-14 h-14 top-[30%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 rounded-full text-white text-xl font-bold flex items-center justify-center border-4 border-white"
      :style="{ backgroundColor: data.color }"
    >
      {{ data.name.charAt(0) }}
    </div>
    <!-- Team info -->
    <div class="flex flex-col items-start justify-between h-[70%] rounded-b-xl">
      <!-- Name Description  -->
      <h3 class="text-lg font-semibold text-gray-900 mt-6 text-center w-full">
        {{ data.name }}
      </h3>
      <p class="text-sm text-gray-500 px-3">
        {{ data.description.substring(0, 150) }}...
      </p>

      <!-- Members Length -->
      <div
        class="relative w-full flex-col items-center justify-between text-sm text-gray-500 p-1.5"
      >
        <div>
          <span class="flex items-center mb-2">
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
            <span>
              {{
                "members" in data
                  ? data.members.length + " members"
                  : data.accounts.length + " social accounts"
              }}
            </span>
          </span>
        </div>
        <!-- Team Members Avatars / Profile Accounts icons  -->
        <div
          class="relative w-full flex items-center justify-end text-xs font-medium text-gray-600 cursor-pointer transition-colors duration-200"
          v-if="'members' in data"
        >
          <Avatar
            v-for="(member, index) in data.members"
            :key="index"
            :name="member.name"
            :color="data.color"
            :class="`-ml-2 ${index > 0 ? 'sm:block' : ''}`"
          />
        </div>
        <PlatformIcons v-else :accounts="data.accounts" />
        <!-- <div v-else class="w-full">
          <div></div>
          <div
            class="flex items-center justify-end gap-2 bg-gray-200 p-2 rounded-lg"
          >
            <PlatformIcon
              class="border-2 border-white rounded-full"
              v-for="(account, index) in data.accounts"
              :key="index"
              :platform="account.platform"
            />
          </div>
        </div> -->
      </div>
    </div>
  </div>
  <!-- <Card v-for="team in teams":data="team"/>
  <Card v-for="profile in profiles":data="team"/> -->
</template>

<script setup lang="ts">
import Avatar from "~/components/ui/Avatar.vue";
import PlatformIcons from "../profile/PlatformIcons.vue";
import PlatformIcon from "./PlatformIcon.vue";

interface TeamMember {
  id: string;
  name: string;
  email: string;
}

interface SocialAccount {
  id: string;
  platform: string;
  username: string;
  followers: number;
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

interface Profile {
  id: string;
  name: string;
  description: string;
  avatar?: string;
  color: string;
  teamId: string;
  teamName: string;
  teamColor: string;
  accounts: SocialAccount[];
  platforms: string[];
  createdAt: string;
}

interface Props {
  // team?: Team;
  // profile?: Profile;
  data: Team | Profile;
}

defineProps<Props>();
</script>
