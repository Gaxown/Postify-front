<script setup lang="ts">
import Teams from "./Teams.vue";
import Profiles from "./Profiles.vue";
import Scheduler from "./Scheduler.vue";
import Calendar from "./Calendar.vue";
import Post from "./Post.vue";
import SocialIcon from "~/components/profile/SocialIcon.vue";
</script>

<template>
  <!-- <div class="p-10 bg-gray-100 min-h-screen">
    <h1 class="text-2xl font-bold mb-6">SocialIcon Component Test</h1>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div>
        <h2 class="text-xl font-semibold mb-4">Filled Mode</h2>
        <div class="space-y-4">
          <div>
            <h3 class="text-lg mb-2">Default (md, non-rounded)</h3>
            <div class="flex items-center space-x-4 p-4 bg-white rounded-lg">
              <SocialIcon platform="instagram" />
              <SocialIcon platform="tiktok" />
              <SocialIcon platform="facebook" />
              <SocialIcon platform="twitter" />
            </div>
          </div>
          <div>
            <h3 class="text-lg mb-2">Rounded (lg)</h3>
            <div class="flex items-center space-x-4 p-4 bg-white rounded-lg">
              <SocialIcon platform="instagram" size="lg" rounded />
              <SocialIcon platform="tiktok" size="lg" rounded />
              <SocialIcon platform="facebook" size="lg" rounded />
              <SocialIcon platform="twitter" size="lg" rounded />
            </div>
          </div>
        </div>
      </div>

      <div>
        <h2 class="text-xl font-semibold mb-4">Outline Mode</h2>
        <div class="space-y-4">
          <div>
            <h3 class="text-lg mb-2">Default (md, non-rounded)</h3>
            <div class="flex items-center space-x-4 p-4 bg-white rounded-lg">
              <SocialIcon platform="instagram" mode="outline" />
              <SocialIcon platform="tiktok" mode="outline" />
              <SocialIcon platform="facebook" mode="outline" />
              <SocialIcon platform="twitter" mode="outline" />
            </div>
          </div>
          <div>
            <h3 class="text-lg mb-2">Rounded (lg)</h3>
            <div class="flex items-center space-x-4 p-4 bg-white rounded-lg">
              <SocialIcon
                platform="instagram"
                mode="outline"
                size="lg"
                rounded
              />
              <SocialIcon platform="tiktok" mode="outline" size="lg" rounded />
              <SocialIcon
                platform="facebook"
                mode="outline"
                size="lg"
                rounded
              />
              <SocialIcon platform="twitter" mode="outline" size="lg" rounded />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div> -->
  <!-- <Profiles /> -->
  <!-- test a post with sample data -->
  <Post
    platform="tiktok"
    :post-data="{
      date: 'Yesterday',
      month: 'June 30',
      time: '3:00 PM',
      user: { username: 'X User', avatar: 'L', verified: true },
      content:
        'lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      image:
        'https://images.unsplash.com/photo-1579353977828-2a4eab540b9a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c2FtcGxlfGVufDB8fDB8fHww',
      createdText: 'You created this 19 hours ago',
    }"
  />
</template>
