<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
    @click.self="closeModal"
  >
    <div
      class="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white"
    >
      <div class="mt-3 text-center">
        <h3 class="text-lg leading-6 font-medium text-gray-900">
          Select a Facebook Page
        </h3>
        <div class="mt-2 px-7 py-3">
          <p class="text-sm text-gray-500">
            Choose a page to connect to your profile.
          </p>
        </div>
        <div class="my-4 space-y-2 max-h-60 overflow-y-auto">
          <div v-if="loading" class="flex justify-center items-center">
            <div
              class="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"
            ></div>
          </div>
          <div v-else-if="error" class="text-red-500">{{ error }}</div>
          <div v-else>
            <div
              v-for="page in pages"
              :key="page.id"
              @click="selectPage(page)"
              class="flex items-center p-2 rounded-lg hover:bg-gray-100 cursor-pointer"
            >
              <div class="flex">
                <!-- show a rounded div with the first character of the page name and a random bg color -->
                <div
                  class="flex items-center justify-center h-10 w-10 rounded-full bg-blue-500 text-white font-bold mr-3"
                >
                  {{ page.name.charAt(0).toUpperCase() }}
                </div>
                <div class="text-start">
                  <p class="text-sm font-medium text-gray-900">
                    {{ page.name }}
                  </p>
                  <p class="text-sm text-gray-500">{{ page.category }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="items-center px-4 py-3">
          <button
            @click="closeModal"
            class="px-4 py-2 bg-gray-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";

interface Page {
  id: string;
  name: string;
  access_token: string;
  category: string;
  fan_count: number;
}

interface Props {
  show: boolean;
  pages: Page[];
  loading: boolean;
  error: string | null;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: "close"): void;
  (e: "select-page", page: Page): void;
}>();

const closeModal = () => {
  emit("close");
};

const selectPage = (page: Page) => {
  emit("select-page", page);
};
</script>
