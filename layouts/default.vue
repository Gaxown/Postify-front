<script setup lang="ts">
import Post from "./Post.vue";
import Scheduler from "./scheduler.vue";
</script>

<template>
  <!-- <Calendar /> -->
  <!-- <Kanban /> -->
  <!-- <Scheduler /> -->
  <!-- <PostCreationModal /> -->
  <!-- Posts -->
  <!-- Twitter/X Post -->
  <Post
    platform="pinterest"
    :post-data="{
      date: 'Yesterday',
      month: 'June 30',
      time: '3:00 PM',
      user: { username: 'X User', avatar: 'L', verified: true },
      content: 'lsfjoqg',
      image:
        'https://images.unsplash.com/photo-1579353977828-2a4eab540b9a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c2FtcGxlfGVufDB8fDB8fHww',
      createdText: 'You created this 19 hours ago',
    }"
  />
  <Post
    platform="twitter"
    :post-data="{
      date: 'Yesterday',
      month: 'June 30',
      time: '3:00 PM',
      user: { username: 'X User', avatar: 'L', verified: true },
      content: 'lsfjoqg',
      image:
        'https://images.unsplash.com/photo-1579353977828-2a4eab540b9a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c2FtcGxlfGVufDB8fDB8fHww',
      createdText: 'You created this 19 hours ago',
    }"
  />

  <!-- Pinterest Post -->
  <Post
    platform="pinterest"
    :post-data="{
      date: 'Thursday',
      month: 'June 26',
      time: '10:31 AM',
      user: {
        username: 'Pin User',
        avatar: 'L',
        verified: true,
        badge: 'API-Test-Board',
      },
      content: 'Testiiiiiiiiing...',
      image:
        'https://images.unsplash.com/photo-1579353977828-2a4eab540b9a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c2FtcGxlfGVufDB8fDB8fHww',
      imageCaption: 'Refreshed 4 minutes ago',
      createdText: 'Posted from Pinterest',
    }"
  />

  <!-- Facebook Post -->
  <Post
    platform="facebook"
    :post-data="{
      date: 'Saturday',
      month: 'June 28',
      time: '11:06 AM',
      showCustom: false,
      user: { username: 'gaxowh07', avatar: 'G', verified: true },
      content: 'dsfjdsfjdsfjdsfjdsfjj...',
      image:
        'https://images.unsplash.com/photo-1579353977828-2a4eab540b9a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c2FtcGxlfGVufDB8fDB8fHww',
      createdText: 'You created this 3 days ago',
    }"
  />

  <!-- TikTok Post -->
  <Post
    platform="tiktok"
    :post-data="{
      date: 'Today',
      month: 'July 1',
      time: '10:00 AM',
      user: { username: 'Postify', avatar: 'P', verified: true },
      content: '',
      image:
        'https://images.unsplash.com/photo-1579353977828-2a4eab540b9a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c2FtcGxlfGVufDB8fDB8fHww',
    }"
  />
</template>
