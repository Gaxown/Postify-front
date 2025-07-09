<template>
  <div class="relative" data-invitations-dropdown>
    <!-- Invitations Button -->
    <button
      @click="showDropdown = !showDropdown"
      class="relative inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all"
    >
      <svg
        class="w-5 h-5 mr-2"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
        />
      </svg>
      Invitations
      <span
        v-if="invitations.length > 0"
        class="absolute -top-2 -right-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-500 rounded-full"
      >
        {{ invitations.length }}
      </span>
    </button>

    <!-- Dropdown Menu -->
    <div
      v-if="showDropdown"
      class="absolute right-0 top-full mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 max-h-80 overflow-y-auto"
    >
      <div class="px-4 py-2 border-b border-gray-100">
        <h3 class="text-sm font-semibold text-gray-900">Team Invitations</h3>
      </div>

      <div v-if="invitations.length === 0" class="px-4 py-6 text-center">
        <svg
          class="mx-auto h-8 w-8 text-gray-400 mb-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
        <p class="text-sm text-gray-500">No pending invitations</p>
      </div>

      <div v-else class="max-h-64 overflow-y-auto">
        <div
          v-for="invitation in invitations"
          :key="invitation.id"
          class="px-4 py-3 hover:bg-gray-50 border-b border-gray-50 last:border-0"
        >
          <div class="flex items-start space-x-3">
            <div
              class="w-8 h-8 rounded-md flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
              :style="{ backgroundColor: invitation.teamColor }"
            >
              {{ invitation.teamName.charAt(0) }}
            </div>
            <div class="flex-1 min-w-0">
              <h4 class="text-sm font-semibold text-gray-900 truncate">
                {{ invitation.teamName }}
              </h4>
              <p class="text-xs text-gray-500">
                By <span class="font-medium">{{ invitation.invitedBy }}</span>
              </p>
              <p class="text-xs text-gray-400 mt-1">
                {{ formatDate(invitation.invitedAt) }}
              </p>

              <div class="flex items-center space-x-2 mt-2">
                <button
                  class="inline-flex items-center px-2 py-1 text-xs font-medium rounded text-white bg-green-600 hover:bg-green-700 transition-colors"
                >
                  <svg
                    class="w-3 h-3 mr-1"
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
                  Accept
                </button>
                <button
                  class="inline-flex items-center px-2 py-1 text-xs font-medium rounded text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  <svg
                    class="w-3 h-3 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                  Refuse
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";

interface TeamInvitation {
  id: string;
  teamName: string;
  teamColor: string;
  invitedBy: string;
  invitedAt: string;
}

interface Props {
  invitations: TeamInvitation[];
}

defineProps<Props>();

const showDropdown = ref(false);

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

// Close dropdown when clicking outside or pressing Escape
onMounted(() => {
  const handleClickOutside = (event: Event) => {
    const target = event.target as HTMLElement;
    const invitationsButton = document.querySelector(
      "[data-invitations-dropdown]"
    );

    if (invitationsButton && !invitationsButton.contains(target)) {
      showDropdown.value = false;
    }
  };

  const handleEscapeKey = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      showDropdown.value = false;
    }
  };

  document.addEventListener("click", handleClickOutside);
  document.addEventListener("keydown", handleEscapeKey);

  onUnmounted(() => {
    document.removeEventListener("click", handleClickOutside);
    document.removeEventListener("keydown", handleEscapeKey);
  });
});
</script>
