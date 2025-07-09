<template>
  <div class="w-full flex justify-end">
    <div class="flex items-center p-1 bg-[#E9EFFC] rounded-full">
      <!-- Social Media Icons -->
      <SocialIcon
        v-for="account in displayedAccounts"
        :key="account.id"
        :title="`${account.platform}: ${account.username}`"
        :platform="account.platform"
        mode="outline"
        :style="{ margin: '0px 2px' }"
        show-border="false"
        size="xs"
        rounded
        @click="openSocialAccount(account)"
        class="cursor-pointer hover:scale-110 transition-transform duration-200"
      />

      <!-- Show count if more than maxDisplay accounts -->
      <div
        v-if="accounts.length > maxDisplay"
        class="relative w-8 h-8 rounded-full flex items-center justify-center bg-white shadow-lg text-gray-500 text-xs font-semibold cursor-pointer hover:bg-gray-50 transition-colors"
        @mouseenter="showTooltip = true"
        @mouseleave="showTooltip = false"
      >
        +{{ accounts.length - maxDisplay }}

        <!-- Tooltip showing remaining accounts -->
        <div
          v-if="showTooltip"
          class="absolute bottom-full mb-2 right-0 bg-[#E6ECF9] shadow-lg text-white text-sm rounded-lg px-3 py-2 whitespace-nowrap shadow-lg z-10"
        >
          <div class="flex items-center space-x-1">
            <SocialIcon
              v-for="account in hiddenAccounts"
              :key="account.id"
              :platform="account.platform"
              mode="outline"
              showBorder="true"
              size="xs"
              rounded
              @click="openSocialAccount(account)"
              class="cursor-pointer hover:scale-110 transition-transform duration-200"
            />
          </div>
          <!-- Tooltip arrow -->
          <div
            class="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import SocialIcon from "./SocialIcon.vue";

interface SocialAccount {
  id: string;
  platform: string;
  username: string;
  followers: number;
}

interface Props {
  accounts: SocialAccount[];
  maxDisplay?: number;
  variant?: "filled" | "outline";
  showBorder?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  maxDisplay: 5,
  variant: "outline",
  showBorder: false,
});

const showTooltip = ref(false);

const displayedAccounts = computed(() => {
  return props.accounts.slice(0, props.maxDisplay);
});

const hiddenAccounts = computed(() => {
  return props.accounts.slice(props.maxDisplay);
});

// Social media URL builders
const getSocialMediaUrl = (platform: string, username: string): string => {
  const urls: Record<string, string> = {
    facebook: `https://facebook.com/${username}`,
    instagram: `https://instagram.com/${username}`,
    twitter: `https://twitter.com/${username}`,
    x: `https://x.com/${username}`,
    linkedin: `https://linkedin.com/in/${username}`,
    youtube: `https://youtube.com/@${username}`,
    tiktok: `https://tiktok.com/@${username}`,
    threads: `https://threads.net/@${username}`,
    pinterest: `https://pinterest.com/${username}`,
    snapchat: `https://snapchat.com/add/${username}`,
  };

  return (
    urls[platform.toLowerCase()] ||
    `https://google.com/search?q=${platform} ${username}`
  );
};

const openSocialAccount = (account: SocialAccount) => {
  const url = getSocialMediaUrl(account.platform, account.username);
  window.open(url, "_blank", "noopener,noreferrer");
};
</script>
