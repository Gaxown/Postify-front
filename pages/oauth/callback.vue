<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-50">
    <FacebookPageSelectModal
      :show="showModal"
      :pages="pages"
      :loading="modalLoading"
      :error="modalError"
      @close="closeModalAndRedirect"
      @select-page="handlePageSelected"
    />
    <div v-if="!showModal || pageLoading" class="text-center">
      <div
        class="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"
      ></div>
      <p class="mt-4 text-gray-600">Finalizing connection, please wait...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import FacebookPageSelectModal from "../../components/profile/FacebookPageSelectModal.vue";
import { useAuth } from "~/composables/useAuth";

definePageMeta({
  auth: false, // Allow unauthenticated access to this page
  layout: false, // Do not use any layout
});

interface Page {
  id: string;
  name: string;
  access_token: string;
  category: string;
  fan_count: number;
}

const route = useRoute();
const router = useRouter();
const config = useRuntimeConfig();
const { getAuthHeaders, isAuthenticated } = useAuth();

const apiBase = config.public.apiBase;

const showModal = ref(false);
const pages = ref<Page[]>([]);
const modalLoading = ref(false);
const pageLoading = ref(true);
const modalError = ref<string | null>(null);

let userToken = "";
let platform = "";
let profileId = "";

const fetchCallbackData = async (sessionKey: string) => {
  console.log("Fetching callback data with session key:", sessionKey);
  modalLoading.value = true;
  showModal.value = true;
  try {
    const response = (await $fetch(
      `${apiBase}/oauth/callback-data?session_key=${sessionKey}`,
      {
        method: "GET",
        headers: {
          ...getAuthHeaders(),
          Accept: "application/json",
        },
      }
    )) as any;

    console.log("Received data from backend:", response);

    if (response.status === "success") {
      pages.value = response.data.pages;
      userToken = response.data.user_token;
      platform = response.data.platform;
      profileId = response.data.profile_id;
    } else {
      modalError.value = response.message || "Failed to fetch pages.";
    }
  } catch (err) {
    console.error("Error fetching callback data:", err);
    modalError.value = "Error fetching pages from the server.";
    console.error(err);
  } finally {
    modalLoading.value = false;
    pageLoading.value = false;
  }
};

const handlePageSelected = async (selectedPage: Page) => {
  modalLoading.value = true;
  modalError.value = null;
  try {
    const postData = {
      platform: platform,
      page_id: selectedPage.id,
      page_name: selectedPage.name,
      page_access_token: selectedPage.access_token,
      user_token: userToken,
    };

    await $fetch(`${apiBase}/profiles/${profileId}/connect-page`, {
      method: "POST",
      headers: {
        ...getAuthHeaders(),
        "Content-Type": "application/json",
      },
      body: postData,
    });
    closeModalAndRedirect();
  } catch (error) {
    console.error("Error connecting page:", error);
    modalError.value = "Failed to connect page.";
  } finally {
    modalLoading.value = false;
  }
};

const closeModalAndRedirect = () => {
  showModal.value = false;
  if (profileId) {
    router.push(`/profiles/${profileId}/social-accounts`);
  } else {
    // Fallback redirect if profileId is not available
    router.push("/");
  }
};

const initialize = async () => {
  console.log("OAuth callback component mounted, initializing...");

  // First, check for an error status from the backend redirect.
  if (route.query.status === "error") {
    console.error("Backend returned an error status in the URL.");
    const errorMessage =
      typeof route.query.message === "string"
        ? decodeURIComponent(route.query.message)
        : "An unknown error occurred during the authentication process.";
    modalError.value = errorMessage;
    showModal.value = true;
    pageLoading.value = false;
    return; // Stop further processing
  }

  const sessionKey = route.query.session_key;
  if (sessionKey && typeof sessionKey === "string") {
    fetchCallbackData(sessionKey);
  } else {
    modalError.value = "Invalid or missing session key.";
    showModal.value = true;
    pageLoading.value = false;
  }
};

onMounted(() => {
  initialize();
});
</script>
