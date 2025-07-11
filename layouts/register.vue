<template>
  <div class="min-h-screen flex">
    <!-- Left Side - Registration Form -->
    <div class="flex-1 bg-white flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24">
      <div class="mx-auto w-full max-w-sm lg:w-96">
        <!-- Logo -->
        <div class="mb-8">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 4v4l3-3 3 3V4h4v16h-4v-4l-3 3-3-3v4H4V4h4z"/>
              </svg>
            </div>
            <span class="text-3xl font-bold text-gray-900">Postify</span>
          </div>
        </div>

        <!-- Registration Form -->
        <div>
          <h2 class="text-3xl font-bold text-gray-900 mb-2">Create account</h2>
          <p class="text-gray-600 mb-8">Join Postify and start managing your social media content efficiently.</p>

          <form class="space-y-6" @submit.prevent="handleRegister">
            <!-- Full Name -->
            <div>
              <label for="fullName" class="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                autocomplete="name"
                required
                v-model="registerForm.fullName"
                class="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent sm:text-sm transition-all"
                :class="{ 'border-red-300 focus:ring-red-500': errors.fullName }"
                placeholder="Enter your full name"
              />
              <p v-if="errors.fullName" class="mt-1 text-sm text-red-600">{{ errors.fullName }}</p>
            </div>

            <!-- Email -->
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autocomplete="email"
                required
                v-model="registerForm.email"
                class="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent sm:text-sm transition-all"
                :class="{ 'border-red-300 focus:ring-red-500': errors.email }"
                placeholder="Enter your email"
              />
              <p v-if="errors.email" class="mt-1 text-sm text-red-600">{{ errors.email }}</p>
            </div>

            <!-- Password -->
            <div>
              <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autocomplete="new-password"
                required
                v-model="registerForm.password"
                class="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent sm:text-sm transition-all"
                :class="{ 'border-red-300 focus:ring-red-500': errors.password }"
                placeholder="Create a password"
              />
              <p v-if="errors.password" class="mt-1 text-sm text-red-600">{{ errors.password }}</p>
            </div>

            <!-- Confirm Password -->
            <div>
              <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autocomplete="new-password"
                required
                v-model="registerForm.confirmPassword"
                class="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent sm:text-sm transition-all"
                :class="{ 'border-red-300 focus:ring-red-500': errors.confirmPassword }"
                placeholder="Confirm your password"
              />
              <p v-if="errors.confirmPassword" class="mt-1 text-sm text-red-600">{{ errors.confirmPassword }}</p>
            </div>

            <!-- Terms and Privacy -->
            <div class="flex items-start">
              <div class="flex items-center h-5">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  v-model="registerForm.acceptTerms"
                  class="focus:ring-purple-500 h-4 w-4 text-purple-600 border-gray-300 rounded"
                  :class="{ 'border-red-300': errors.acceptTerms }"
                />
              </div>
              <div class="ml-3 text-sm">
                <label for="terms" class="text-gray-600">
                  I agree to the 
                  <a href="#" class="text-purple-600 hover:text-purple-500 transition-colors font-medium">Terms of Service</a>
                  and 
                  <a href="#" class="text-purple-600 hover:text-purple-500 transition-colors font-medium">Privacy Policy</a>
                </label>
                <p v-if="errors.acceptTerms" class="mt-1 text-sm text-red-600">{{ errors.acceptTerms }}</p>
              </div>
            </div>

            <!-- Submit Button -->
            <div>
              <button
                type="submit"
                :disabled="isLoading"
                class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02]"
              >
                <span v-if="isLoading" class="absolute left-0 inset-y-0 flex items-center pl-3">
                  <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </span>
                {{ isLoading ? 'Creating account...' : 'Create Account' }}
              </button>
            </div>

            <!-- Login Link -->
            <div class="text-center">
              <p class="text-sm text-gray-600">
                Already have an account?
                <NuxtLink to="/login" class="text-purple-600 hover:text-purple-500 transition-colors font-medium ml-1">
                  Sign in
                </NuxtLink>
              </p>
            </div>
          </form>

          <!-- Error message -->
          <div v-if="registerError" class="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div class="flex">
              <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                </svg>
              </div>
              <div class="ml-3">
                <p class="text-sm text-red-800">{{ registerError }}</p>
              </div>
            </div>
          </div>

          <!-- Success message -->
          <div v-if="successMessage" class="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <div class="flex">
              <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
              </div>
              <div class="ml-3">
                <p class="text-sm text-green-800">{{ successMessage }}</p>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="mt-8">
            <div class="text-center">
              <div class="flex justify-center space-x-6 text-sm text-gray-500">
                <a href="#" class="hover:text-gray-700 transition-colors">Terms of Service</a>
                <span>•</span>
                <a href="#" class="hover:text-gray-700 transition-colors">Privacy Policy</a>
                <span>•</span>
                <a href="#" class="hover:text-gray-700 transition-colors">Security</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Right Side - Promotional Content -->
    <div class="hidden lg:block relative w-0 flex-1">
      <div class="absolute inset-0 bg-gradient-to-br from-green-600 via-green-700 to-emerald-800">
        <!-- Background decorations -->
        <div class="absolute top-4 right-4 space-y-4">
          <div class="w-4 h-4 bg-white bg-opacity-20 rounded-full animate-pulse"></div>
          <div class="w-6 h-6 bg-white bg-opacity-10 rounded-full animate-pulse" style="animation-delay: 0.5s"></div>
          <div class="w-3 h-3 bg-white bg-opacity-30 rounded-full animate-pulse" style="animation-delay: 1s"></div>
        </div>

        <div class="absolute bottom-4 left-4 space-x-4 flex">
          <div class="w-8 h-8 bg-white bg-opacity-10 rounded-full animate-pulse"></div>
          <div class="w-5 h-5 bg-white bg-opacity-20 rounded-full animate-pulse" style="animation-delay: 0.3s"></div>
          <div class="w-6 h-6 bg-white bg-opacity-15 rounded-full animate-pulse" style="animation-delay: 0.8s"></div>
        </div>

        <!-- Main content -->
        <div class="h-full flex flex-col justify-center px-12">
          <!-- Welcome Badge -->
          <div class="mb-6">
            <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
              Welcome!
            </span>
          </div>

          <!-- Main heading -->
          <h1 class="text-4xl font-bold text-white mb-6 leading-tight">
            Join Thousands of<br>
            Content Creators Using<br>
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">Postify</span>
          </h1>

          <!-- Description -->
          <p class="text-xl text-green-100 mb-8 leading-relaxed max-w-md">
            Manage and organize your social media content efficiently with our free internal platform. Join our team today!
          </p>

          <!-- Features List -->
          <div class="space-y-4 max-w-md">
            <div class="flex items-center space-x-3">
              <div class="flex-shrink-0 w-6 h-6 bg-green-400 rounded-full flex items-center justify-center">
                <svg class="w-4 h-4 text-green-800" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                </svg>
              </div>
              <span class="text-green-100">Easy content creation tools</span>
            </div>
            
            <div class="flex items-center space-x-3">
              <div class="flex-shrink-0 w-6 h-6 bg-green-400 rounded-full flex items-center justify-center">
                <svg class="w-4 h-4 text-green-800" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                </svg>
              </div>
              <span class="text-green-100">Multi-platform scheduling</span>
            </div>
            
            <div class="flex items-center space-x-3">
              <div class="flex-shrink-0 w-6 h-6 bg-green-400 rounded-full flex items-center justify-center">
                <svg class="w-4 h-4 text-green-800" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                </svg>
              </div>
              <span class="text-green-100">Analytics and insights</span>
            </div>
            
            <div class="flex items-center space-x-3">
              <div class="flex-shrink-0 w-6 h-6 bg-green-400 rounded-full flex items-center justify-center">
                <svg class="w-4 h-4 text-green-800" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                </svg>
              </div>
              <span class="text-green-100">Team collaboration tools</span>
            </div>
          </div>

          <!-- CTA -->
          <div class="mt-8">
            <div class="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-4">
              <p class="text-sm text-green-100 mb-2">🆓 Internal Platform</p>
              <p class="text-white font-semibold">Completely free for all team members - no subscription required!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface RegisterForm {
  fullName: string
  email: string
  password: string
  confirmPassword: string
  acceptTerms: boolean
}

interface Errors {
  fullName?: string
  email?: string
  password?: string
  confirmPassword?: string
  acceptTerms?: string
}

interface ApiResponse {
  message: string
  user: {
    id: number
    name: string
    email: string
  }
  token: string
}

interface ApiError {
  data?: {
    message?: string
    errors?: {
      name?: string[]
      email?: string[]
      password?: string[]
    }
  }
  statusCode?: number
}

const registerForm = ref<RegisterForm>({
  fullName: '',
  email: '',
  password: '',
  confirmPassword: '',
  acceptTerms: false
})

const errors = ref<Errors>({})
const isLoading = ref(false)
const registerError = ref('')
const successMessage = ref('')

const validateForm = (): boolean => {
  errors.value = {}
  
  // Full name validation
  if (!registerForm.value.fullName.trim()) {
    errors.value.fullName = 'Full name is required'
  } else if (registerForm.value.fullName.trim().length < 2) {
    errors.value.fullName = 'Full name must be at least 2 characters'
  }
  
  // Email validation
  if (!registerForm.value.email) {
    errors.value.email = 'Email is required'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(registerForm.value.email)) {
    errors.value.email = 'Please enter a valid email address'
  }
  
  // Password validation
  if (!registerForm.value.password) {
    errors.value.password = 'Password is required'
  } else if (registerForm.value.password.length < 8) {
    errors.value.password = 'Password must be at least 8 characters'
  } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(registerForm.value.password)) {
    errors.value.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number'
  }
  
  // Confirm password validation
  if (!registerForm.value.confirmPassword) {
    errors.value.confirmPassword = 'Please confirm your password'
  } else if (registerForm.value.password !== registerForm.value.confirmPassword) {
    errors.value.confirmPassword = 'Passwords do not match'
  }
  
  // Terms acceptance validation
  if (!registerForm.value.acceptTerms) {
    errors.value.acceptTerms = 'You must accept the terms and conditions'
  }
  
  return Object.keys(errors.value).length === 0
}

const handleRegister = async () => {
  registerError.value = ''
  successMessage.value = ''
  
  if (!validateForm()) {
    return
  }
  
  isLoading.value = true
  
  try {
    const config = useRuntimeConfig()
    const { setAuth } = useAuth()
    
    // Call the backend register API
    const response = await $fetch<ApiResponse>(`${config.public.apiBase}/register`, {
      method: 'POST',
      body: {
        name: registerForm.value.fullName,
        email: registerForm.value.email,
        password: registerForm.value.password,
        password_confirmation: registerForm.value.confirmPassword
      }
    })
    
    // Store the auth token and user data
    if (response.token && response.user) {
      setAuth(response.token, response.user)
    }
    
    // Show success message
    successMessage.value = response.message || 'Account created successfully! Redirecting to dashboard...'
    
    // Reset form
    registerForm.value = {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      acceptTerms: false
    }
    
    // Redirect to teams page after successful registration
    setTimeout(() => {
      navigateTo('/teams')
    }, 2000)
    
  } catch (error: any) {
    console.error('Registration error:', error)
    
    // Handle different types of errors
    if (error.data) {
      // Backend validation errors
      if (error.data.errors) {
        const backendErrors = error.data.errors
        errors.value = {}
        
        if (backendErrors.name) {
          errors.value.fullName = backendErrors.name[0]
        }
        if (backendErrors.email) {
          errors.value.email = backendErrors.email[0]
        }
        if (backendErrors.password) {
          errors.value.password = backendErrors.password[0]
        }
        
        registerError.value = 'Please fix the errors below and try again.'
      } else if (error.data.message) {
        registerError.value = error.data.message
      }
    } else if (error.statusCode === 422) {
      registerError.value = 'Validation failed. Please check your input and try again.'
    } else if (error.statusCode === 500) {
      registerError.value = 'Server error. Please try again later.'
    } else {
      registerError.value = 'Registration failed. Please check your connection and try again.'
    }
  } finally {
    isLoading.value = false
  }
}

// Auto-focus full name field on mount
onMounted(() => {
  const fullNameInput = document.getElementById('fullName')
  if (fullNameInput) {
    fullNameInput.focus()
  }
})
</script> 