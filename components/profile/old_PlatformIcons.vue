<template>
  <div class="flex space-x-0.5">
    <div
      v-for="account in displayedAccounts"
      :key="account.id"
      class="w-8 h-8 flex items-center justify-center"
      :title="`${account.platform}: ${
        account.username
      } (${account.followers.toLocaleString()} followers)`"
    >
      <!-- Facebook -->
      <!-- <Icon
        v-if="account.platform === 'facebook'"
        name="uil:facebook-f"
        class="w-4 h-4 text-blue-600 border border-red border-"
      /> -->
      <div
        v-if="account.platform === 'facebook'"
        class="i-ri-facebook-fill text-blue-600 text-2xl"
      />

      <!-- Instagram -->
      <!-- <Instagram
        v-else-if="account.platform === 'instagram'"
        class="w-4 h-4 text-pink-600"
      /> -->

      <!-- linear gradient  diagonally for the instagram icon  -->
      <Icon
        v-else-if="account.platform === 'pinterest'"
        name="uil:instagram"
        style="
          background: linear-gradient(
            45deg,
            #f58529,
            #dd2f43,
            #8134af,
            #515bd4,
            #00a7e1
          );
        "
      />

      <!-- X (Twitter) -->
      <Icon
        v-else-if="account.platform === 'twitter'"
        name="uil:x"
        class="w-4 h-4 text-blue-400"
      />

      <!-- LinkedIn -->
      <Icon
        v-else-if="account.platform === 'linkedin'"
        name="uil:linkedin"
        class="w-4 h-4 text-blue-700"
      />

      <!-- YouTube -->
      <!-- <Youtube
        v-else-if="account.platform === 'youtube'"
        class="w-4 h-4 text-red-600"
      /> -->
      <Icon
        key=""
        v-else-if="account.platform === 'youtube'"
        name="uil:youtube"
        class="w-4 h-4 text-red-600"
      />

      <!-- TikTok -->
      <svg
        v-else-if="account.platform === 'tiktok'"
        class="w-4 h-4"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path
          d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"
        />
      </svg>

      <!-- Pinterest -->
      <Icon
        key="pinterest"
        v-else-if="account.platform === 'instagram'"
        name="uil:pinterest"
        class="w-4 h-4 text-red-600"
      />
      <!-- Default for unknown platforms -->
      <div
        v-else
        class="w-4 h-4 bg-gray-500 rounded-sm flex items-center justify-center"
      >
        <span class="text-white text-xs font-bold">{{
          account.platform.substring(0, 1).toUpperCase()
        }}</span>
      </div>
    </div>

    <!-- Show count if more than maxDisplay accounts -->
    <div
      v-if="accounts.length > maxDisplay"
      class="w-8 h-8 rounded-lg border-2 border-gray-200 bg-gray-50 flex items-center justify-center text-xs font-medium text-gray-600"
    >
      +{{ accounts.length - maxDisplay }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { Facebook, Instagram, Linkedin, Youtube } from "lucide-vue-next";

interface SocialAccount {
  id: string;
  platform: string;
  username: string;
  followers: number;
}

interface Props {
  accounts: SocialAccount[];
  maxDisplay?: number;
}

const props = withDefaults(defineProps<Props>(), {
  maxDisplay: 5,
});

const displayedAccounts = computed(() => {
  return props.accounts.slice(0, props.maxDisplay);
});
</script>
