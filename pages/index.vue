<template>
  <div>
    <!-- Page Header -->
    <div class="mb-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-semibold text-gray-900">All Channels</h1>
        </div>
        <div class="flex items-center space-x-3">
          <button
            class="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <svg
              class="w-4 h-4 mr-2"
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
            Share Feedback
          </button>

          <div class="flex rounded-lg border border-gray-300">
            <button
              class="px-3 py-2 text-sm font-medium text-gray-700 bg-gray-50 border-r border-gray-300"
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
                  d="M4 6h16M4 10h16M4 14h16M4 18h16"
                />
              </svg>
            </button>
            <button
              class="px-3 py-2 text-sm font-medium text-gray-500 bg-white"
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
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </button>
          </div>

          <button
            @click="openNewPostModal"
            class="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
          >
            <svg
              class="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
            New Post
          </button>
        </div>
      </div>
    </div>

    <!-- Post Status Tabs -->
    <div class="border-b border-gray-200 mb-6">
      <nav class="-mb-px flex space-x-8">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          @click="activeTab = tab.key"
          :class="[
            'py-2 px-1 border-b-2 font-medium text-sm',
            activeTab === tab.key
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
          ]"
        >
          {{ tab.name }}
          <span
            v-if="tab.count > 0"
            class="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs"
            >{{ tab.count }}</span
          >
        </button>
      </nav>
    </div>

    <!-- Posts Content -->
    <div class="space-y-6">
      <!-- Today's Posts -->
      <div v-if="todaysPosts.length > 0">
        <h2 class="text-lg font-medium text-gray-900 mb-4">
          Today, {{ formatDate(new Date()) }}
        </h2>

        <div class="space-y-4">
          <div
            v-for="post in todaysPosts"
            :key="post.id"
            class="bg-white border border-gray-200 rounded-lg p-6"
          >
            <div class="flex items-start space-x-4">
              <!-- Time -->
              <div class="text-sm text-gray-500 min-w-0 flex-shrink-0">
                {{ formatTime(post.scheduledTime || post.createdAt) }}
              </div>

              <!-- Avatar & Content -->
              <div class="flex-1 min-w-0">
                <div class="flex items-center space-x-3 mb-3">
                  <div
                    class="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center"
                  >
                    <svg
                      class="w-4 h-4 text-white"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"
                      />
                    </svg>
                  </div>
                  <span class="text-sm font-medium text-gray-900"
                    >@username</span
                  >
                </div>

                <!-- Post Content -->
                <div class="prose prose-sm max-w-none">
                  <p class="text-gray-900">{{ post.content }}</p>
                </div>

                <!-- Post Preview -->
                <div
                  v-if="post.hasMedia"
                  class="mt-4 bg-purple-600 rounded-lg p-6 text-white"
                >
                  <div class="flex items-center justify-center">
                    <div class="text-center">
                      <svg
                        class="w-12 h-12 mx-auto mb-2"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                        />
                      </svg>
                      <h3 class="text-lg font-medium">Postify</h3>
                      <p class="text-sm opacity-90">Social Media Scheduler</p>
                    </div>
                  </div>
                </div>

                <!-- Action Bar -->
                <div class="mt-4 flex items-center justify-between">
                  <div class="text-sm text-gray-500">
                    You created this {{ getRelativeTime(post.createdAt) }}
                  </div>

                  <div class="flex items-center space-x-2">
                    <button
                      @click="publishPost(post.id)"
                      class="inline-flex items-center px-3 py-1 border border-gray-300 rounded text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                    >
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
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Publish Now
                    </button>

                    <button
                      @click="editPost(post.id)"
                      class="inline-flex items-center px-3 py-1 border border-gray-300 rounded text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                    >
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
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </button>

                    <button
                      @click="showPostOptions(post.id)"
                      class="inline-flex items-center px-3 py-1 border border-gray-300 rounded text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
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
                          d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-12">
        <svg
          class="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">
          No posts scheduled
        </h3>
        <p class="mt-1 text-sm text-gray-500">
          Get started by creating a new post.
        </p>
        <div class="mt-6">
          <button
            @click="openNewPostModal"
            class="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
          >
            <svg
              class="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
            New Post
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// definePageMeta({
//   layout: "app",
//   // middleware: "auth",
// });
// Reactive data
const activeTab = ref("queue");
const showNewPostModal = ref(false);

// Sample data
const tabs = [
  { key: "queue", name: "Queue", count: 2 },
  { key: "drafts", name: "Drafts", count: 2 },
  { key: "approvals", name: "Approvals", count: 0 },
  { key: "sent", name: "Sent", count: 27 },
];

const todaysPosts = ref([
  {
    id: 1,
    content:
      "Just shipped a new feature for our social media scheduler! 🚀 Excited to see how our users will leverage this to streamline their content workflow.",
    scheduledTime: new Date(2025, 5, 28, 10, 40),
    createdAt: new Date(2025, 5, 28, 9, 30),
    hasMedia: true,
    status: "scheduled",
  },
  {
    id: 2,
    content:
      "Behind the scenes at Postify: Building tools that help creators focus on what they do best - creating amazing content! 💡",
    scheduledTime: new Date(2025, 5, 28, 11, 6),
    createdAt: new Date(2025, 5, 28, 10, 0),
    hasMedia: true,
    status: "scheduled",
  },
]);

// Methods
const formatDate = (date) => {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(date);
};

const formatTime = (date) => {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);
};

const getRelativeTime = (date) => {
  const now = new Date();
  const diffInMinutes = Math.floor((now - date) / (1000 * 60));

  if (diffInMinutes < 1) return "just now";
  if (diffInMinutes < 60)
    return `${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""} ago`;

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24)
    return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;

  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
};

const openNewPostModal = () => {
  showNewPostModal.value = true;
};

const publishPost = (postId) => {
  const post = todaysPosts.value.find((p) => p.id === postId);
  if (post) {
    post.status = "published";
    // Remove from scheduled posts
    const index = todaysPosts.value.findIndex((p) => p.id === postId);
    if (index !== -1) {
      todaysPosts.value.splice(index, 1);
    }
  }
};

const editPost = (postId) => {
  alert(`Edit post ${postId} - Modal would open here!`);
};

const showPostOptions = (postId) => {
  // TODO: Implement post options functionality
};

// Meta
useHead({
  title: "Publish - Postify",
  meta: [
    { name: "description", content: "Your social media publishing dashboard" },
  ],
});
</script>
