<template>
  <div class="relative flex">
    <!-- Date & time with draft icon - outside the post wrapper -->
    <div class="mb-3">
      <div class="flex items-center">
        <span class="text-sm font-medium text-gray-700">{{
          postData.time
        }}</span>
        <div class="flex items-center gap-1">
          <svg
            class="w-4 h-4 text-blue-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fill-rule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clip-rule="evenodd"
            />
          </svg>
          <span class="text-sm text-blue-600">Draft</span>
        </div>
      </div>
      <div class="flex items-center gap-1 mt-1">
        <span class="text-sm font-semibold text-gray-900"
          >{{ postData.date }},</span
        >
        <span class="text-sm text-gray-600">{{ postData.month }}</span>
      </div>
    </div>

    <div class="relative bg-white border border-gray-200 rounded-lg font-sans">
      <!-- Content area with horizontal layout -->
      <div class="p-4">
        <div class="flex gap-4">
          <!-- Left side - User profile and content -->
          <div class="flex-1">
            <div class="flex items-start gap-3 mb-3">
              <div class="relative">
                <div
                  class="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-sm"
                >
                  {{ postData.user.avatar }}
                </div>
                <!-- display the platform icon -->
                <div
                  class="absolute -bottom-2.5 -right-4 w-auto h-auto bg-white rounded-full shadow-sm border border-gray-200 flex items-center justify-center"
                >
                  <SocialIcon
                    :platform="platform"
                    mode="filled"
                    showBorder="true"
                    size="sm"
                    rounded
                  />
                </div>
              </div>
              <div class="flex-1">
                <div class="font-semibold text-gray-900 text-sm">
                  {{ postData.user.username }}
                </div>
                <div class="text-xs text-gray-500" v-if="postData.user.badge">
                  {{ postData.user.badge }}
                </div>
              </div>
            </div>

            <!-- Post content -->
            <div class="mb-3">
              <p
                class="text-gray-900 text-sm leading-relaxed"
                v-if="postData.content"
              >
                {{ postData.content }}
              </p>
            </div>
          </div>

          <!-- Right side - Image -->
          <div class="flex-shrink-0" v-if="postData.image">
            <div
              class="w-32 h-24 border border-gray-200 rounded-lg overflow-hidden bg-gray-50"
            >
              <img
                :src="postData.image"
                :alt="postData.imageAlt || 'Post image'"
                class="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Action buttons footer -->
      <div class="relative px-4 py-3 border-t border-gray-100">
        <div class="flex items-center justify-between">
          <span class="text-xs text-gray-500">{{ postData.createdText }}</span>
          <div class="flex items-center gap-2">
            <!-- Dynamic primary button -->
            <button
              @click="handlePrimaryAction"
              class="px-3 py-1.5 text-xs text-gray-900 border border-gray-500 rounded hover:bg-gray-50 flex items-center gap-1"
            >
              <svg
                class="w-3 h-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  :d="primaryButton.icon"
                />
              </svg>
              {{ primaryButton.text }}
            </button>

            <!-- Edit button (always present) -->
            <button
              class="p-1.5 hover:bg-gray-100 rounded text-gray-500 border border-gray-500"
            >
              <svg
                class="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </button>

            <!-- Three dots dropdown -->
            <div class="relative">
              <button
                ref="dropdownButton"
                @click="showDropdown = !showDropdown"
                class="p-1.5 hover:bg-gray-100 rounded text-gray-500 border border-gray-900"
              >
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"
                  />
                </svg>
              </button>

              <!-- Dynamic dropdown menu -->
              <div
                v-if="showDropdown"
                ref="dropdownMenu"
                class="absolute right-0 top-full mt-1 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
              >
                <button
                  v-for="(option, index) in dropdownOptions"
                  :key="option.action"
                  @click="handleDropdownAction(option.action)"
                  :class="[
                    'w-full px-3 py-2 text-left text-sm flex items-center gap-2',
                    option.style,
                    index < dropdownOptions.length - 1
                      ? 'border-b border-gray-100'
                      : '',
                  ]"
                >
                  <svg
                    class="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      :d="option.icon"
                    />
                  </svg>
                  {{ option.text }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Platform-specific footer -->
      <div
        v-if="platform === 'pinterest'"
        class="px-4 py-2 border-t border-gray-100"
      >
        <span class="text-xs text-gray-600">Posted from 📌 Pinterest</span>
      </div>
    </div>

    <!-- Dropdown menu - positioned outside main container to avoid clipping -->
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { get } from "@vueuse/core";
import {
  Plus,
  Filter,
  HelpCircle,
  Gift,
  User,
  X,
  ChevronDown,
  Tag,
  Settings,
  CheckCircle,
  Share2,
  List,
  Calendar,
  MapPin,
  Linkedin,
} from "lucide-vue-next";
import PlatformIcon from "~/components/ui/PlatformIcon.vue";
import SocialIcon from "~/components/profile/SocialIcon.vue";

const showDropdown = ref(false);
const dropdownButton = ref(null);
const dropdownMenu = ref(null);

const props = defineProps({
  tab: {
    type: String,
    default: "Queue",
    validator: (value) => ["Queue", "drafts", "sent"].includes(value),
  },

  platform: {
    type: String,
    required: true,
    validator: (value) =>
      [
        "twitter",
        "pinterest",
        "facebook",
        "tiktok",
        "instagram",
        "youtube",
        "linkedin",
        "threads",
      ].includes(value),
  },
  postData: {
    type: Object,
    default: () => ({
      date: "Today",
      month: "July 1",
      time: "10:00 AM",
      showCustom: true,
      user: {
        username: "Postify",
        avatar: "P",
        verified: true,
        badge: null,
      },
      content: "Sample post content",
      image: null,
      imageAlt: "",
      imageCaption: "",
      createdText: "You created this 14 seconds ago",
      link: "https://example.com",
    }),
  },
});

// tab drop down menu options
const primaryButton = computed(() => {
  const configs = {
    Queue: {
      text: "Publish Now",
      icon: "M13 10V3L4 14h7v7l9-11h-7z",
    },
    drafts: {
      text: "Add to Queue",
      icon: "M12 6v6m0 0v6m0-6h6m-6 0H6",
      action: "addToQueue",
    },
    sent: {
      text: "View Post",
      icon: "M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-1M14 1l5 5m0 0l-5 5m5-5H9",
      action: "viewPost",
    },
  };

  return configs[props.tab] || configs.Queue;
});

const dropdownOptions = computed(() => {
  const configs = {
    Queue: [
      {
        text: "Move to Drafts",
        icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
        action: "moveToDrafts",
        style: "text-gray-700 hover:bg-gray-50",
      },
      {
        text: "Duplicate",
        icon: "M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z",
        action: "duplicate",
        style: "text-gray-700 hover:bg-gray-50",
      },
      {
        text: "Delete",
        icon: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16",
        action: "delete",
        style: "text-red-600 hover:bg-red-50",
      },
    ],
    drafts: [
      {
        text: "Publish Now",
        icon: "M13 10V3L4 14h7v7l9-11h-7z",
        action: "publishNow",
        style: "text-gray-700 hover:bg-gray-50",
      },
      {
        text: "Duplicate",
        icon: "M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z",
        action: "duplicate",
        style: "text-gray-700 hover:bg-gray-50",
      },
      {
        text: "Delete",
        icon: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16",
        action: "delete",
        style: "text-red-600 hover:bg-red-50",
      },
    ],
    sent: [
      {
        text: "Share Link in Post",
        icon: "M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z",
        action: "shareLink",
        style: "text-gray-700 hover:bg-gray-50",
      },
      {
        text: "Copy Link",
        icon: "M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z",
        action: "copyLink",
        style: "text-gray-700 hover:bg-gray-50",
      },
    ],
  };

  return configs[props.tab] || configs.Queue;
});

// Event handlers
const handlePrimaryAction = () => {
  console.log(`Primary action for ${props.tab}: ${primaryButton.value.text}`);
};

async function copyTextToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    console.log("Text copied to clipboard successfully!");
  } catch (err) {
    console.error("Failed to copy text: ", err);
  }
}

// Example usage:
const handleDropdownAction = (action) => {
  console.log(`Dropdown action: ${action}`);

  if (action === "Copy Link") {
    copyTextToClipboard("This text will be copied.");
  }
};

// outside click close
const handleClickOutside = (event) => {
  if (
    showDropdown.value &&
    dropdownButton.value &&
    dropdownMenu.value &&
    !dropdownButton.value.contains(event.target) &&
    !dropdownMenu.value.contains(event.target)
  ) {
    showDropdown.value = false;
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});

// Platform-specific metrics configuration with proper SVG path data
const metricsConfig = {
  twitter: [
    {
      name: "likes",
      label: "Likes",
      icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z",
      value: "-",
    },
    {
      name: "retweets",
      label: "Retweets",
      icon: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15",
      value: "-",
    },
    {
      name: "impressions",
      label: "Impressions",
      icon: "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z",
      value: "-",
    },
    {
      name: "clicks",
      label: "Clicks",
      icon: "M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122",
      value: "-",
    },
    {
      name: "engRate",
      label: "Eng. Rate",
      icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6",
      value: "-",
    },
  ],
  pinterest: [
    {
      name: "saves",
      label: "Saves",
      icon: "M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z",
      value: "0",
    },
    {
      name: "comments",
      label: "Comments",
      icon: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z",
      value: "0",
    },
    {
      name: "impressions",
      label: "Impressions",
      icon: "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z",
      value: "-",
    },
    {
      name: "reactions",
      label: "Reactions",
      icon: "M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
      value: "-",
    },
    {
      name: "engRate",
      label: "Eng. Rate",
      icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6",
      value: "-",
    },
  ],
  facebook: [
    {
      name: "likes",
      label: "Likes",
      icon: "M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5",
      value: "1",
    },
    {
      name: "comments",
      label: "Comments",
      icon: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z",
      value: "0",
    },
    {
      name: "views",
      label: "Views",
      icon: "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z",
      value: "100",
    },
    {
      name: "shares",
      label: "Shares",
      icon: "M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z",
      value: "-",
    },
    {
      name: "reach",
      label: "Reach",
      icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6",
      value: "-",
    },
  ],
  tiktok: [
    {
      name: "likes",
      label: "Likes",
      icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z",
      value: "-",
    },
    {
      name: "comments",
      label: "Comments",
      icon: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z",
      value: "-",
    },
    {
      name: "impressions",
      label: "Impressions",
      icon: "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z",
      value: "-",
    },
    {
      name: "shares",
      label: "Shares",
      icon: "M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z",
      value: "-",
    },
    {
      name: "clicks",
      label: "Clicks",
      icon: "M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122",
      value: "-",
    },
  ],
  instagram: [
    {
      name: "likes",
      label: "Likes",
      icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z",
      value: "-",
    },
    {
      name: "comments",
      label: "Comments",
      icon: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z",
      value: "-",
    },
    {
      name: "impressions",
      label: "Impressions",
      icon: "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z",
      value: "-",
    },
    {
      name: "shares",
      label: "Shares",
      icon: "M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z",
      value: "-",
    },
    {
      name: "engRate",
      label: "Eng. Rate",
      icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6",
      value: "-",
    },
  ],
  youtube: [
    {
      name: "likes",
      label: "Likes",
      icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z",
      value: "-",
    },
    {
      name: "comments",
      label: "Comments",
      icon: "M8 12h.01M12 12h.01M 16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z",
      value: "-",
    },
    {
      name: "views",
      label: "Views",
      icon: "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z",
      value: "100",
    },
    {
      name: "shares",
      label: "Shares",
      icon: "M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z",
      value: "-",
    },
    {
      name: "engRate",
      label: "Eng. Rate",
      icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6",
      value: "-",
    },
  ],
  linkedin: [
    {
      name: "likes",
      label: "Likes",
      icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z",
      value: "-",
    },
    {
      name: "comments",
      label: "Comments",
      icon: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z",
      value: "-",
    },
    {
      name: "views",
      label: "Views",
      icon: "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z",
      value: "-",
    },
    {
      name: "shares",
      label: "Shares",
      icon: "M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z",
      value: "-",
    },
    {
      name: "engRate",
      label: "Eng. Rate",
      icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6",
      value: "-",
    },
  ],
};

const getPlatformMetrics = (platform) => {
  return metricsConfig[platform];
};
</script>

<style scoped></style>
