<template>
  <div class="min-h-screen flex">
    <!-- Left Side - Login Form -->
    <div
      class="flex-1 bg-white flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24"
    >
      <div class="mx-auto w-full max-w-sm lg:w-96">
        <!-- Logo -->
        <div class="mb-8">
          <div class="flex items-center space-x-3">
            <div
              class="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center"
            >
              <svg
                class="w-6 h-6 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M8 4v4l3-3 3 3V4h4v16h-4v-4l-3 3-3-3v4H4V4h4z" />
              </svg>
            </div>
            <span class="text-3xl font-bold text-gray-900">Postify</span>
          </div>
        </div>

        <!-- Login Form -->
        <div>
          <h2 class="text-3xl font-bold text-gray-900 mb-2">Log in</h2>
          <p class="text-gray-600 mb-8">
            Welcome back! Please sign in to your account.
          </p>

          <form class="space-y-6" @submit.prevent="handleLogin">
            <div>
              <label
                for="email"
                class="block text-sm font-medium text-gray-700 mb-2"
              >
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autocomplete="email"
                required
                v-model="loginForm.email"
                class="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent sm:text-sm transition-all"
                :class="{ 'border-red-300 focus:ring-red-500': errors.email }"
                placeholder="Enter your email"
              />
              <p v-if="errors.email" class="mt-1 text-sm text-red-600">
                {{ errors.email }}
              </p>
            </div>

            <div>
              <label
                for="password"
                class="block text-sm font-medium text-gray-700 mb-2"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autocomplete="current-password"
                required
                v-model="loginForm.password"
                class="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent sm:text-sm transition-all"
                :class="{
                  'border-red-300 focus:ring-red-500': errors.password,
                }"
                placeholder="Enter your password"
              />
              <p v-if="errors.password" class="mt-1 text-sm text-red-600">
                {{ errors.password }}
              </p>
            </div>

            <div>
              <button
                type="submit"
                :disabled="isLoading"
                class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02]"
              >
                <span
                  v-if="isLoading"
                  class="absolute left-0 inset-y-0 flex items-center pl-3"
                >
                  <svg
                    class="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      class="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      stroke-width="4"
                    ></circle>
                    <path
                      class="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                </span>
                {{ isLoading ? "Logging in..." : "Log In" }}
              </button>
            </div>

            <div class="flex items-center justify-between text-sm">
              <NuxtLink
                to="/register"
                class="text-purple-600 hover:text-purple-500 transition-colors font-medium"
              >
                Create an account
              </NuxtLink>
              <NuxtLink
                to="/forgot-password"
                class="text-purple-600 hover:text-purple-500 transition-colors"
              >
                Forgot your password?
              </NuxtLink>
            </div>
          </form>

          <!-- Error message -->
          <div
            v-if="loginError"
            class="mt-6 bg-red-50 border border-red-200 rounded-lg p-4"
          >
            <div class="flex">
              <div class="flex-shrink-0">
                <svg
                  class="h-5 w-5 text-red-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
              <div class="ml-3">
                <p class="text-sm text-red-800">{{ loginError }}</p>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="mt-8">
            <div class="text-center">
              <div class="flex justify-center space-x-6 text-sm text-gray-500">
                <a href="#" class="hover:text-gray-700 transition-colors"
                  >Terms of Service</a
                >
                <span>•</span>
                <a href="#" class="hover:text-gray-700 transition-colors"
                  >Privacy Policy</a
                >
                <span>•</span>
                <a href="#" class="hover:text-gray-700 transition-colors"
                  >Security</a
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Right Side - Promotional Content -->
    <div class="hidden lg:block relative w-0 flex-1">
      <div
        class="absolute inset-0 bg-gradient-to-br from-purple-600 via-purple-700 to-blue-800"
      >
        <!-- Background decorations -->
        <div class="absolute top-4 right-4 space-y-4">
          <div
            class="w-4 h-4 bg-white bg-opacity-20 rounded-full animate-pulse"
          ></div>
          <div
            class="w-6 h-6 bg-white bg-opacity-10 rounded-full animate-pulse"
            style="animation-delay: 0.5s"
          ></div>
          <div
            class="w-3 h-3 bg-white bg-opacity-30 rounded-full animate-pulse"
            style="animation-delay: 1s"
          ></div>
        </div>

        <div class="absolute bottom-4 left-4 space-x-4 flex">
          <div
            class="w-8 h-8 bg-white bg-opacity-10 rounded-full animate-pulse"
          ></div>
          <div
            class="w-5 h-5 bg-white bg-opacity-20 rounded-full animate-pulse"
            style="animation-delay: 0.3s"
          ></div>
          <div
            class="w-6 h-6 bg-white bg-opacity-15 rounded-full animate-pulse"
            style="animation-delay: 0.8s"
          ></div>
        </div>

        <!-- Main content -->
        <div class="h-full flex flex-col justify-center px-12">
          <!-- New Badge -->
          <div class="mb-6">
            <span
              class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800"
            >
              New!
            </span>
          </div>

          <!-- Main heading -->
          <h1 class="text-4xl font-bold text-white mb-6 leading-tight">
            Postify's Content<br />
            Management Becomes<br />
            <span
              class="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400"
              >Simple</span
            >
          </h1>

          <!-- Description -->
          <p class="text-xl text-purple-100 mb-8 leading-relaxed max-w-md">
            Organize and manage your social media content efficiently with our
            internal platform.
          </p>

          <!-- Mock UI Preview -->
          <div class="relative max-w-md">
            <!-- Content Manager Card -->
            <div
              class="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg p-4 shadow-xl mb-4"
            >
              <div class="flex items-center space-x-3 mb-3">
                <div
                  class="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center"
                >
                  <svg
                    class="w-5 h-5 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z"
                    />
                  </svg>
                </div>
                <div class="flex-1">
                  <div class="flex items-center space-x-2">
                    <h3 class="font-semibold text-purple-600">
                      📝 Content Manager
                    </h3>
                    <div
                      class="w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center"
                    >
                      <svg
                        class="w-4 h-4 text-white"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          d="M7.8,2H16.2C19.4,2 22,4.6 22,7.8V16.2A5.8,5.8 0 0,1 16.2,22H7.8C4.6,22 2,19.4 2,16.2V7.8A5.8,5.8 0 0,1 7.8,2M7.6,4A3.6,3.6 0 0,0 4,7.6V16.4C4,18.39 5.61,20 7.6,20H16.4A3.6,3.6 0 0,0 20,16.4V7.6C20,5.61 18.39,4 16.4,4H7.6M12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9Z"
                        />
                      </svg>
                    </div>
                    <span class="text-red-500 text-xl">×</span>
                  </div>
                </div>
              </div>

              <div class="mb-3">
                <p class="text-sm text-gray-600 mb-2">
                  What content do you want to manage?
                </p>
                <div class="bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <p class="text-sm text-gray-800">
                    Schedule Instagram post about our new...
                  </p>
                  <span class="text-red-500 text-lg">×</span>
                </div>
              </div>

              <div class="bg-gray-50 rounded-lg p-3 border border-gray-200">
                <p class="text-sm text-gray-800 leading-relaxed">
                  Ready to promote our latest product? Let's schedule posts
                  across all platforms!
                </p>
              </div>
            </div>

            <!-- Create Post Card -->
            <div
              class="absolute right-0 top-16 w-48 bg-white bg-opacity-95 backdrop-blur-sm rounded-lg p-4 shadow-xl"
            >
              <div class="text-center mb-3">
                <div
                  class="w-12 h-12 bg-black rounded-lg mx-auto mb-2 flex items-center justify-center"
                >
                  <svg
                    class="w-8 h-8 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M7.8,2H16.2C19.4,2 22,4.6 22,7.8V16.2A5.8,5.8 0 0,1 16.2,22H7.8C4.6,22 2,19.4 2,16.2V7.8A5.8,5.8 0 0,1 7.8,2M7.6,4A3.6,3.6 0 0,0 4,7.6V16.4C4,18.39 5.61,20 7.6,20H16.4A3.6,3.6 0 0,0 20,16.4V7.6C20,5.61 18.39,4 16.4,4H7.6M12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9Z"
                    />
                  </svg>
                </div>
                <h4 class="font-semibold text-gray-800">Create Post</h4>
              </div>

              <div class="flex space-x-2 mb-3">
                <div
                  v-for="i in 5"
                  :key="i"
                  class="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center"
                >
                  <span v-if="i === 1" class="text-pink-500 text-sm">+</span>
                  <span v-else class="text-gray-400 text-xs">{{
                    i === 2 ? "G" : i === 3 ? "F" : i === 4 ? "L" : "T"
                  }}</span>
                </div>
              </div>

              <p class="text-xs text-gray-600">
                Manage your social media content...
                <span class="text-purple-600"
                  >schedule across multiple platforms effortlessly</span
                >
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface LoginForm {
  email: string;
  password: string;
}

interface Errors {
  email?: string;
  password?: string;
}

const loginForm = ref<LoginForm>({
  email: "",
  password: "",
});

const errors = ref<Errors>({});
const isLoading = ref(false);
const loginError = ref("");

const validateForm = (): boolean => {
  errors.value = {};

  if (!loginForm.value.email) {
    errors.value.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginForm.value.email)) {
    errors.value.email = "Please enter a valid email address";
  }

  if (!loginForm.value.password) {
    errors.value.password = "Password is required";
  } else if (loginForm.value.password.length < 6) {
    errors.value.password = "Password must be at least 6 characters";
  }

  return Object.keys(errors.value).length === 0;
};

const handleLogin = async () => {
  loginError.value = "";

  if (!validateForm()) {
    return;
  }

  isLoading.value = true;

  try {
    const config = useRuntimeConfig();
    const { setAuth } = useAuth();

    // Call the backend login API
    const response = await $fetch<{
      message: string;
      user: { id: number; name: string; email: string };
      token: string;
    }>(`${config.public.apiBase}/login`, {
      method: "POST",
      body: {
        email: loginForm.value.email,
        password: loginForm.value.password,
      },
    });
    console.log("Login response:", response);
    // Store the auth token and user data
    if (response.token && response.user) {
      setAuth(response.token, response.user);
    }

    // On success, redirect to teams page
    await navigateTo("/teams");
  } catch (error: any) {
    console.error("Login error:", error);

    // Handle different types of errors
    if (error.data) {
      // Backend validation errors
      if (error.data.errors) {
        const backendErrors = error.data.errors;
        errors.value = {};

        if (backendErrors.email) {
          errors.value.email = backendErrors.email[0];
        }
        if (backendErrors.password) {
          errors.value.password = backendErrors.password[0];
        }

        loginError.value = "Please fix the errors below and try again.";
      } else if (error.data.message) {
        loginError.value = error.data.message;
      }
    } else if (error.statusCode === 401) {
      loginError.value = "Invalid email or password. Please try again.";
    } else if (error.statusCode === 422) {
      loginError.value = "Invalid input. Please check your credentials.";
    } else if (error.statusCode === 500) {
      loginError.value = "Server error. Please try again later.";
    } else {
      loginError.value =
        "Login failed. Please check your connection and try again.";
    }
  } finally {
    isLoading.value = false;
  }
};

// Auto-focus email field on mount
onMounted(() => {
  const emailInput = document.getElementById("email");
  if (emailInput) {
    emailInput.focus();
  }
});
</script>
