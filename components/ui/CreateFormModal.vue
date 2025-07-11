<template>
  <div
    v-if="isVisible"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    @click="closeModal"
  >
    <div class="bg-white rounded-xl p-6 w-full max-w-md mx-4" @click.stop>
      <h3 class="text-xl font-semibold text-gray-900 mb-4">
        {{ type === "profile" ? "Create New Profile" : "Create New Team" }}
      </h3>

      <form @submit.prevent="handleSubmit()">
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            {{ type === "profile" ? "Company Name" : "Team Name" }}
          </label>
          <input
            v-model="formData.name"
            type="text"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            :placeholder="
              type === 'profile' ? 'Enter company name' : 'Enter team name'
            "
          />
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2"
            >Description</label
          >
          <textarea
            v-model="formData.description"
            rows="3"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            :placeholder="
              type === 'profile'
                ? 'Brief description of the company'
                : 'Describe your team\'s purpose'
            "
          ></textarea>
        </div>

        <!-- Avatar Upload - Only for profiles -->
        <div v-if="type === 'profile'" class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2"
            >Avatar</label
          >
          <div class="flex items-center space-x-4">
            <!-- Avatar Preview -->
            <div class="border-2 border-gray-200 rounded-full">
              <ProfileAvatar
                :name="formData.name || 'New Profile'"
                :avatar="formData.avatar"
                :color="formData.color"
                size="lg"
              />
            </div>

            <!-- Upload Button -->
            <div class="flex-1">
              <input
                ref="avatarInput"
                type="file"
                accept="image/*"
                @change="handleAvatarUpload"
                class="hidden"
              />
              <button
                type="button"
                @click="triggerFileInput"
                class="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                Choose Image
              </button>
              <p class="text-xs text-gray-500 mt-1">PNG, JPG, JPEG up to 2MB</p>
            </div>
          </div>
        </div>

        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            {{ type === "profile" ? "Color" : "Team Color" }}
          </label>
          <div class="flex space-x-2">
            <div
              v-for="color in colors"
              :key="color"
              @click="formData.color = color"
              :class="[
                'w-8 h-8 rounded-lg cursor-pointer border-2 transition-all',
                formData.color === color
                  ? 'border-gray-400 scale-110'
                  : 'border-gray-200',
              ]"
              :style="{ backgroundColor: color }"
            ></div>
          </div>
        </div>

        <div class="flex space-x-3">
          <button
            type="button"
            @click="closeModal"
            class="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            :disabled="internalLoading"
            class="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span
              v-if="internalLoading"
              class="flex items-center justify-center"
            >
              <div
                class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"
              ></div>
              {{ type === "profile" ? "Creating..." : "Creating..." }}
            </span>
            <span v-else>{{
              type === "profile" ? "Create Profile" : "Create Team"
            }}</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import ProfileAvatar from "@/components/profile/ProfileAvatar.vue";

// Get API config and auth
const config = useRuntimeConfig();
const apiBase = config.public.apiBase;
const { getAuthHeaders, isAuthenticated } = useAuth();
const route = useRoute();

// Props - ce que le composant reçoit de l'extérieur
const props = defineProps({
  type: {
    type: String, // 'profile' ou 'team'
    required: true,
  },
});

// État interne du modal
const isVisible = ref(false);
const internalLoading = ref(false);

// Pas d'emits - gestion interne

// Stocker le fichier réel pour l'upload
const avatarFile = ref(null);

// Référence pour l'input file
const avatarInput = ref(null);

// Couleurs disponibles
const colors = [
  "#8B5CF6",
  "#3B82F6",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#EC4899",
];

// Form data
const formData = ref({
  name: "",
  description: "",
  color: "#8B5CF6",
  avatar: avatarFile.value,
});

// Fonctions
const openModal = () => {
  isVisible.value = true;
};

const closeModal = () => {
  // Reset et fermer le modal
  resetForm();
  isVisible.value = false;
};

const resetForm = () => {
  formData.value = {
    name: "",
    description: "",
    color: "#8B5CF6",
    avatar: "",
  };
  avatarFile.value = null;
};

// API Functions
const createTeam = async (formData) => {
  internalLoading.value = true;

  try {
    const headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
    };
    Object.assign(headers, getAuthHeaders());

    const response = await $fetch(`${apiBase}/teams`, {
      method: "POST",
      headers,
      body: {
        name: formData.name,
        description: formData.description,
        color: formData.color,
      },
    });

    console.log(response);

    // Success - close and refresh
    resetForm();
    isVisible.value = false;
    window.location.reload();
  } catch (err) {
    console.error("Create team error:", err);
  } finally {
    internalLoading.value = false;
  }
};

const createProfile = async (profileData) => {
  const teamId = route.params.id;
  internalLoading.value = true;

  try {
    const headers = {
      Accept: "application/json",
      // "Content-Type" is intentionally omitted.
      // The browser will automatically set it to "multipart/form-data"
      // with the correct boundary when the body is a FormData object.
    };
    Object.assign(headers, getAuthHeaders());

    await $fetch(`${apiBase}/teams/${teamId}/profiles`, {
      method: "POST",
      headers,
      body: profileData,
    });

    // Success - close and refresh
    resetForm();
    isVisible.value = false;
    window.location.reload();
  } catch (err) {
    console.error("Create profile error:", err);
  } finally {
    internalLoading.value = false;
  }
};

const handleSubmit = async () => {
  if (!formData.value.name) return;

  if (props.type === "team") {
    // createTeam already expects a plain object
    await createTeam({
      name: formData.value.name,
      description: formData.value.description,
      color: formData.value.color,
    });
  } else if (props.type === "profile") {
    let submitData;

    if (avatarFile.value) {
      // If an avatar file is present, use FormData
      submitData = new FormData();
      submitData.append("name", formData.value.name);
      submitData.append("description", formData.value.description);
      submitData.append("color", formData.value.color);
      submitData.append("avatar", avatarFile.value); // Append the file object
    } else {
      // Otherwise, send as a plain JSON object
      submitData = {
        name: formData.value.name,
        description: formData.value.description,
        color: formData.value.color,
      };
    }
    await createProfile(submitData);
  }
};

const triggerFileInput = () => {
  avatarInput.value?.click();
};

const handleAvatarUpload = (event) => {
  const file = event.target.files?.[0];

  if (file) {
    if (file.size > 2 * 1024 * 1024) {
      // TODO: Show an error to the user that the file is too large
      return;
    }

    if (!file.type.startsWith("image/")) {
      // TODO: Show an error to the user about invalid file type
      return;
    }

    // Store the actual file object for upload
    avatarFile.value = file;

    // Create a base64 string for the preview
    const reader = new FileReader();
    reader.onload = (e) => {
      formData.value.avatar = e.target?.result;
    };
    reader.readAsDataURL(file);
  }
};

// Exposer la méthode pour ouvrir le modal depuis l'extérieur
defineExpose({
  openModal,
});
</script>
