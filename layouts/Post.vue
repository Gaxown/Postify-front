<template>
  <div
    class="max-w-2xl mx-auto bg-white border border-gray-200 rounded-lg p-4 font-sans"
  >
    <!-- Header with timestamp -->
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center gap-2">
        <span class="font-semibold text-gray-900">{{ postData.date }},</span>
        <span class="text-gray-600">{{ postData.month }}</span>
      </div>
      <button class="p-1 hover:bg-gray-100 rounded-full">
        <svg
          class="w-5 h-5 text-gray-500"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"
          />
        </svg>
      </button>
    </div>

    <!-- Time and Custom label -->
    <div class="flex items-center gap-2 mb-4">
      <span class="text-sm font-medium">{{ postData.time }}</span>
      <div class="flex items-center gap-1" v-if="postData.showCustom">
        <svg
          class="w-4 h-4 text-gray-400"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fill-rule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clip-rule="evenodd"
          />
        </svg>
        <span class="text-sm text-gray-600">Custom</span>
      </div>
    </div>

    <!-- User profile section -->
    <div class="flex items-start gap-3 mb-3">
      <div class="relative">
        <div
          class="w-14 h-14 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-lg"
        >
          {{ postData.user.avatar }}
        </div>
        <!-- display the platform icon -->
        <div
          class="absolute -bottom-1 -right-1 w-7 h-7 p-0.5 rounded-full shadow-sm bg-white shadow-gray-500"
        >
          <PlatformIcon :platform="platform" />
        </div>
      </div>
      <div class="flex-1">
        <div class="font-semibold text-gray-900">
          {{ postData.user.username }}
        </div>
        <div class="text-sm text-gray-500" v-if="postData.user.badge">
          {{ postData.user.badge }}
        </div>
      </div>
    </div>

    <!-- Post content -->
    <div class="mb-4">
      <p class="text-gray-900 mb-3" v-if="postData.content">
        {{ postData.content }}
      </p>

      <!-- Image attachment -->
      <div
        class="border border-gray-200 rounded-lg overflow-hidden"
        v-if="postData.image"
      >
        <img
          :src="postData.image"
          :alt="postData.imageAlt || 'Post image'"
          class="w-full h-auto"
        />
        <div class="text-xs text-gray-500 p-2" v-if="postData.imageCaption">
          {{ postData.imageCaption }}
        </div>
      </div>

      <!-- Share icon -->
      <div class="mt-2">
        <button class="p-1 hover:bg-gray-100 rounded">
          <svg
            class="w-4 h-4 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
            />
          </svg>
        </button>
      </div>
    </div>

    <!-- Platform-specific engagement metrics -->
    <div
      class="flex items-center justify-between py-3 border-t border-gray-100"
    >
      <div class="flex items-center gap-6 text-sm text-gray-600 flex-wrap">
        <!-- Metrics -->
        <template class="flex w-full justify-between gap-4">
          <div
            v-for="metric in getPlatformMetrics(platform)"
            :key="metric.name"
            class="flex items-center gap-1 justify-between"
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
                :d="metric.icon"
              />
            </svg>
            <span>{{ metric.label }}</span>
            <span>{{ metric.value }}</span>
          </div>
          <!-- <div class="flex items-center gap-1">
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
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            <span>Retweets</span>
            <span>-</span>
          </div>
          <div class="flex items-center gap-1">
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
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
            <span>Impressions</span>
            <span>-</span>
          </div>
          <div class="flex items-center gap-1">
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
                d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
              />
            </svg>
            <span>Clicks</span>
            <span>-</span>
          </div>
          <div class="flex items-center gap-1">
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
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
              />
            </svg>
            <span>Eng. Rate</span>
            <span>-</span>
          </div> -->
        </template>
      </div>

      <button
        class="p-2 hover:bg-gray-100 rounded border border-gray-200"
        v-if="platform !== 'pinterest'"
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
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 00-2 2z"
          />
        </svg>
      </button>
    </div>

    <!-- Footer with creation time and actions -->
    <div
      class="flex items-center justify-between pt-3 border-t border-gray-100"
    >
      <div class="flex items-center gap-2">
        <span class="text-sm text-gray-600">{{ postData.createdText }}</span>
        <div v-if="platform === 'facebook'" class="text-sm text-gray-500">
          🐕
        </div>
      </div>
      <div class="flex items-center gap-2">
        <button
          class="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 flex items-center gap-1"
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
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          </svg>
          View Post
        </button>
        <button class="p-1 hover:bg-gray-100 rounded">
          <svg
            class="w-4 h-4 text-gray-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"
            />
          </svg>
        </button>
      </div>
    </div>

    <!-- Platform-specific footer -->
    <div v-if="platform === 'pinterest'" class="pt-3 border-t border-gray-100">
      <span class="text-sm text-gray-600">Posted from 📌 Pinterest</span>
    </div>
  </div>
</template>

<script setup>
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

const props = defineProps({
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
    }),
  },
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
