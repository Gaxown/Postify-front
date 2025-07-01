<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Top Navigation -->
    <header class="bg-white border-b border-gray-200">
      <div class="flex items-center justify-between px-4 py-3">
        <div class="flex items-center space-x-8">
          <div class="flex items-center space-x-2">
            <div class="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
              <span class="text-white font-bold text-sm">P</span>
            </div>
            <span class="font-semibold text-gray-900">Postify</span>
          </div>
          <nav class="flex space-x-6">
            <a href="#" class="text-gray-600 hover:text-gray-900 font-medium">Create</a>
            <a href="#" class="text-blue-600 font-medium border-b-2 border-blue-600 pb-3">Publish</a>
            <a href="#" class="text-gray-600 hover:text-gray-900 font-medium">Engage</a>
            <a href="#" class="text-gray-600 hover:text-gray-900 font-medium">Analyze</a>
            <a href="#" class="text-gray-600 hover:text-gray-900 font-medium">Start Page</a>
          </nav>
        </div>
        <div class="flex items-center space-x-3">
          <button class="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2">
            <Plus class="w-4 h-4" />
            <span>New</span>
          </button>
          <button class="p-2 text-gray-600 hover:text-gray-900">
            <Filter class="w-5 h-5" />
          </button>
          <button class="p-2 text-gray-600 hover:text-gray-900">
            <HelpCircle class="w-5 h-5" />
          </button>
          <button class="p-2 text-gray-600 hover:text-gray-900">
            <Gift class="w-5 h-5" />
          </button>
          <div class="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
            <User class="w-4 h-4 text-white" />
          </div>
        </div>
      </div>
    </header>

    <!-- Two-factor authentication banner -->
    <div class="bg-blue-50 border-b border-blue-200 px-4 py-3">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-2">
          <span class="text-blue-800 text-sm">
            <strong>Set up two-factor authentication:</strong> For added security and easier logins, we recommend setting up a two-factor authentication.
            <a href="#" class="text-blue-600 underline ml-1">Learn more</a>
          </span>
        </div>
        <div class="flex items-center space-x-3">
          <button class="bg-blue-600 text-white px-3 py-1 rounded text-sm font-medium">
            Set up now
          </button>
          <button class="text-blue-600 hover:text-blue-800">
            <X class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>

    <div class="flex">
      <!-- Sidebar -->
      <aside class="w-64 bg-white border-r border-gray-200 min-h-screen">
        <div class="p-4">
          <div class="flex items-center justify-between mb-4">
            <h2 class="font-semibold text-gray-900">Channels</h2>
            <button class="p-1 text-gray-400 hover:text-gray-600">
              <Plus class="w-4 h-4" />
            </button>
          </div>

          <div class="space-y-2">
            <div class="flex items-center justify-between text-sm text-gray-600 mb-3">
              <span>All Channels</span>
              <span class="bg-gray-100 px-2 py-1 rounded text-xs">0</span>
            </div>

            <!-- Channel Items -->
            <div class="space-y-1">
              <div class="flex items-center space-x-3 p-2 rounded-lg bg-blue-50 border border-blue-200">
                <div class="relative">
                  <div class="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center">
                    <span class="text-white text-xs font-medium">G</span>
                  </div>
                  <div class="absolute -bottom-1 -right-1 w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center">
                    <span class="text-white text-xs">T</span>
                  </div>
                </div>
                <div class="flex-1">
                  <div class="text-sm font-medium text-gray-900">gaxown07</div>
                </div>
                <span class="bg-gray-100 px-2 py-1 rounded text-xs">0</span>
              </div>

              <div class="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50">
                <div class="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                  <span class="text-white text-xs font-medium">B</span>
                </div>
                <div class="flex-1">
                  <div class="text-sm font-medium text-gray-900">BassamLahc97858</div>
                </div>
                <span class="bg-gray-100 px-2 py-1 rounded text-xs">0</span>
              </div>
            </div>

            <!-- Social Media Connections -->
            <div class="pt-4 space-y-2">
              <button class="flex items-center space-x-3 p-2 w-full text-left hover:bg-gray-50 rounded-lg">
                <Facebook class="w-5 h-5 text-blue-600" />
                <span class="text-sm text-gray-700">Connect Facebook</span>
              </button>
              <button class="flex items-center space-x-3 p-2 w-full text-left hover:bg-gray-50 rounded-lg">
                <Instagram class="w-5 h-5 text-pink-600" />
                <span class="text-sm text-gray-700">Connect Instagram</span>
              </button>
              <button class="flex items-center space-x-3 p-2 w-full text-left hover:bg-gray-50 rounded-lg">
                <Linkedin class="w-5 h-5 text-blue-700" />
                <span class="text-sm text-gray-700">Connect LinkedIn</span>
              </button>
            </div>

            <button class="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900 pt-4">
              <ChevronDown class="w-4 h-4" />
              <span>Show more channels</span>
            </button>
          </div>
        </div>

        <!-- Bottom sidebar items -->
        <div class="absolute bottom-4 left-4 space-y-2">
          <button class="flex items-center space-x-3 p-2 w-full text-left hover:bg-gray-50 rounded-lg">
            <Tag class="w-4 h-4 text-gray-600" />
            <span class="text-sm text-gray-700">Manage Tags</span>
          </button>
          <button class="flex items-center space-x-3 p-2 w-full text-left hover:bg-gray-50 rounded-lg">
            <Settings class="w-4 h-4 text-gray-600" />
            <span class="text-sm text-gray-700">Manage Channels</span>
          </button>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="flex-1 p-6">
        <!-- Profile Header -->
        <div class="flex items-center justify-between mb-6">
          <div class="flex items-center space-x-3">
            <div class="relative">
              <div class="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center">
                <span class="text-white font-medium">G</span>
              </div>
              <div class="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                <span class="text-white text-xs">T</span>
              </div>
            </div>
            <div>
              <div class="flex items-center space-x-2">
                <h1 class="text-xl font-semibold text-gray-900">gaxown07</h1>
                <CheckCircle class="w-4 h-4 text-gray-400" />
              </div>
              <p class="text-sm text-gray-600">0/30 posts sent this week</p>
            </div>
          </div>
          <div class="flex items-center space-x-3">
            <button class="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900">
              <Share2 class="w-4 h-4" />
              <span>Share Feedback</span>
            </button>
            <div class="flex items-center bg-gray-100 rounded-lg">
              <button class="px-3 py-2 text-sm font-medium bg-white rounded-lg shadow-sm">
                <List class="w-4 h-4 inline mr-1" />
                List
              </button>
              <button class="px-3 py-2 text-sm font-medium text-gray-600">
                <Calendar class="w-4 h-4 inline mr-1" />
                Calendar
              </button>
            </div>
            <button class="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2">
              <Plus class="w-4 h-4" />
              <span>New Post</span>
            </button>
          </div>
        </div>

        <!-- Tabs -->
        <div class="flex items-center justify-between mb-6">
          <div class="flex space-x-8">
            <button class="text-blue-600 font-medium border-b-2 border-blue-600 pb-2">
              Queue <span class="ml-1 text-gray-500">0</span>
            </button>
            <button class="text-gray-600 hover:text-gray-900 font-medium pb-2">
              Drafts <span class="ml-1 text-gray-500">0</span>
            </button>
            <button class="text-gray-600 hover:text-gray-900 font-medium pb-2 flex items-center">
              Approvals <span class="ml-1 w-2 h-2 bg-purple-500 rounded-full"></span>
            </button>
            <button class="text-gray-600 hover:text-gray-900 font-medium pb-2">
              Sent <span class="ml-1 text-gray-500">21</span>
            </button>
          </div>
          <div class="flex items-center space-x-3">
            <button class="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900">
              <Tag class="w-4 h-4" />
              <span>Tags</span>
              <ChevronDown class="w-4 h-4" />
            </button>
            <button class="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900">
              <MapPin class="w-4 h-4" />
              <span>Casablanca</span>
            </button>
            <button class="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900">
              <span>More</span>
              <ChevronDown class="w-4 h-4" />
            </button>
          </div>
        </div>

        <!-- Schedule Content -->
        <div class="space-y-6">
          <!-- Today Section -->
          <div>
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Today, June 30</h3>
            <div class="space-y-3">
              <div v-for="time in todayTimes" :key="time" class="flex items-center space-x-4 p-4 bg-white rounded-lg border border-gray-200">
                <div class="text-sm font-medium text-gray-900 w-16">{{ time }}</div>
                <button class="flex items-center space-x-2 text-blue-600 hover:text-blue-700">
                  <Plus class="w-4 h-4" />
                  <span class="text-sm font-medium">New</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Tomorrow Section -->
          <div>
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Tomorrow, July 1</h3>
            <div class="space-y-3">
              <div v-for="time in tomorrowTimes" :key="time" class="flex items-center space-x-4 p-4 bg-white rounded-lg border border-gray-200">
                <div class="text-sm font-medium text-gray-900 w-16">{{ time }}</div>
                <button class="flex items-center space-x-2 text-blue-600 hover:text-blue-700">
                  <Plus class="w-4 h-4" />
                  <span class="text-sm font-medium">New</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { 
  Plus, Filter, HelpCircle, Gift, User, X, Facebook, Instagram, 
  Linkedin, ChevronDown, Tag, Settings, CheckCircle, Share2, 
  List, Calendar, MapPin
} from 'lucide-vue-next'

const todayTimes = ['11:06 AM', '11:08 AM', '11:27 AM', '11:28 AM', '2:56 PM', '3:51 PM', '4:00 PM']
const tomorrowTimes = ['11:06 AM', '11:08 AM', '11:27 AM']
</script>

<style scoped>
/* Additional custom styles if needed */
</style>