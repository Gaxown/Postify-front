<template>
  <div class="calendar-container bg-white min-h-screen">
    <!-- Header -->
    <div
      class="header flex items-center justify-between p-4 border-b border-gray-200"
    >
      <div class="flex items-center space-x-4">
        <button @click="goPrev" class="p-2 hover:bg-gray-100 rounded">
          <ChevronLeft class="w-5 h-5" />
        </button>
        <button @click="goNext" class="p-2 hover:bg-gray-100 rounded">
          <ChevronRight class="w-5 h-5" />
        </button>

        <div class="relative">
          <button
            @click="showDatePicker = !showDatePicker"
            class="text-xl font-semibold hover:bg-gray-100 px-3 py-1 rounded"
          >
            {{ currentMonthYear }}
          </button>

          <!-- Date Picker Dropdown -->
          <div
            v-if="showDatePicker"
            class="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-4"
          >
            <div class="flex items-center justify-between mb-4">
              <button @click="prevMonth" class="p-1 hover:bg-gray-100 rounded">
                <ChevronLeft class="w-4 h-4" />
              </button>
              <span class="font-semibold">{{ pickerMonthYear }}</span>
              <button @click="nextMonth" class="p-1 hover:bg-gray-100 rounded">
                <ChevronRight class="w-4 h-4" />
              </button>
            </div>

            <div class="grid grid-cols-7 gap-1 text-sm">
              <div
                v-for="day in ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']"
                :key="day"
                class="text-center text-gray-500 p-2"
              >
                {{ day }}
              </div>
              <div
                v-for="date in pickerDates"
                :key="date.key"
                @click="selectDate(date)"
                :class="[
                  'text-center p-2 cursor-pointer rounded hover:bg-gray-100',
                  date.isToday ? 'bg-blue-500 text-white' : '',
                  date.isOtherMonth ? 'text-gray-300' : '',
                  date.isSelected ? 'bg-blue-100' : '',
                ]"
              >
                {{ date.day }}
              </div>
            </div>
          </div>
        </div>

        <button
          @click="resetToToday"
          class="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50"
        >
          Today
        </button>
      </div>

      <!-- View Toggle -->
      <div class="flex items-center space-x-2">
        <div class="relative">
          <button
            @click="showViewDropdown = !showViewDropdown"
            class="flex items-center space-x-1 px-3 py-1 border border-gray-300 rounded hover:bg-gray-50"
          >
            <span>{{
              viewMode.charAt(0).toUpperCase() + viewMode.slice(1)
            }}</span>
            <ChevronDown class="w-4 h-4" />
          </button>

          <div
            v-if="showViewDropdown"
            class="absolute top-full right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
          >
            <button
              v-for="view in ['week', 'month', 'list']"
              :key="view"
              @click="changeView(view)"
              :class="[
                'block w-full text-left px-4 py-2 hover:bg-gray-50',
                viewMode === view ? 'bg-blue-50 text-blue-600' : '',
              ]"
            >
              {{ view.charAt(0).toUpperCase() + view.slice(1) }}
            </button>
          </div>
        </div>

        <div class="flex items-center space-x-2 text-sm text-gray-600">
          <Calendar class="w-4 h-4" />
          <!-- when clicked the all posts drop down button should show a menu with the differnt platforms to filter the posts in the calendar -->
          <div>
            <button
              @click="showFilterDropdown = !showFilterDropdown"
              class="flex items-center space-x-1"
            >
              <span>{{ filterMode }}</span>
              <ChevronDown class="w-4 h-4" />
            </button>
            <div
              v-if="showFilterDropdown"
              class="absolute top-14 right-3 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
            >
              <button
                v-for="filter in [
                  'all',
                  'facebook',
                  'twitter',
                  'instagram',
                  'linkedin',
                  'pinterest',
                  'tiktok',
                ]"
                :key="filter"
                @click="changeFilter(filter)"
                :class="[
                  'block w-full text-left px-4 py-2 hover:bg-gray-50',
                  filterMode === filter ? 'bg-blue-50 text-blue-600' : '',
                ]"
              >
                {{ filter.charAt(0).toUpperCase() + filter.slice(1) }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Calendar Views -->
    <div class="calendar-content">
      <!-- Month View -->
      <div v-if="viewMode === 'month'" class="month-view">
        <div class="grid grid-cols-7 border-b border-gray-200">
          <div
            v-for="day in weekDays"
            :key="day"
            class="p-4 text-center text-sm font-medium text-gray-500 border-r border-gray-200 last:border-r-0"
          >
            {{ day }}
          </div>
        </div>

        <div class="grid grid-cols-7 auto-rows-fr min-h-[600px]">
          <div
            v-for="date in monthDates"
            :key="date.key"
            :class="[
              'border-r border-b border-gray-200 last:border-r-0 p-2 min-h-[120px]',
              date.isOtherMonth ? 'bg-gray-50' : '',
              date.isToday ? 'bg-blue-50' : '',
            ]"
            @drop="dropPost($event, date.date)"
            @dragover.prevent
            @dragenter.prevent
          >
            <div
              :class="[
                'text-sm font-medium mb-2',
                date.isToday
                  ? 'bg-blue-500 text-white w-6 h-6 rounded-full flex items-center justify-center'
                  : '',
                date.isOtherMonth ? 'text-gray-400' : '',
              ]"
            >
              {{ date.day }}
            </div>

            <div class="space-y-1 flex-col">
              <PostCard
                v-for="post in getPostsForDate(date.date)"
                :key="post.id"
                :post="post"
                :DragnDrop="{ dragStart }"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Week View -->
      <div v-if="viewMode === 'week'" class="week-view">
        <div class="grid grid-cols-8 border-b border-gray-200">
          <div class="p-4"></div>
          <div
            v-for="date in weekDates"
            :key="date.key"
            class="p-4 text-center border-r border-gray-200 last:border-r-0"
          >
            <div class="text-sm text-gray-500">{{ date.dayName }}</div>
            <div
              :class="[
                'text-lg font-semibold mt-1',
                date.isToday
                  ? 'bg-blue-500 text-white w-8 h-8 rounded-full flex items-center justify-center mx-auto'
                  : '',
              ]"
            >
              {{ date.day }}
            </div>
          </div>
        </div>

        <div class="grid grid-cols-8">
          <!-- Time column with flexible heights -->
          <!-- style="min-height: 95px" -->
          <div class="border-r border-gray-200">
            <div
              v-for="hour in timeSlots"
              :key="hour"
              :style="{ minHeight: getHourRowHeight(hour) + 'px' }"
              class="border-b border-gray-200 p-2 text-xs text-gray-500 flex items-start"
            >
              {{ hour }}
            </div>
          </div>

          <!-- Date columns with flexible heights -->
          <div
            v-for="date in weekDates"
            :key="date.key"
            class="border-r border-gray-200 last:border-r-0"
          >
            <!-- style="min-height: 95px" -->
            <div
              v-for="hour in timeSlots"
              :key="hour"
              :style="{ minHeight: getHourRowHeight(hour) + 'px' }"
              :class="[
                'border-b border-gray-200 relative p-1',
                isPastDateTime(date.date, hour) ? 'bg-gray-50 opacity-60' : '',
              ]"
              @drop="dropPost($event, date.date, hour)"
              @dragover.prevent
              @dragenter.prevent
            >
              <!-- Posts container with flexible layout -->
              <div class="space-y-1 h-full">
                <PostCard
                  v-for="post in getPostsForDateTimeOrdered(date.date, hour)"
                  :key="post.id"
                  :post="post"
                  :DragnDrop="{ dragStart }"
                  :compact="
                    getPostsForDateTimeOrdered(date.date, hour).length > 1
                  "
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- List View -->
      <div v-if="viewMode === 'list'" class="list-view p-4">
        <div v-for="group in groupedPosts" :key="group.date" class="mb-6">
          <h3 class="text-lg font-semibold mb-3 text-gray-800">
            {{ group.dateLabel }}
          </h3>
          <div class="space-y-2">
            <div
              v-for="post in group.posts"
              :key="post.id"
              :class="[
                'p-3 rounded-lg border cursor-move flex items-center space-x-3',
                post.platform === 'twitter'
                  ? 'border-blue-200 bg-blue-50'
                  : 'border-green-200 bg-green-50',
              ]"
              draggable="true"
              @dragstart="dragStart(post)"
            >
              <div
                class="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-white text-sm"
              >
                {{ post.platform === "twitter" ? "T" : "I" }}
              </div>
              <div class="flex-1">
                <div class="font-medium">{{ post.time }}</div>
                <div class="text-gray-600">{{ post.content }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Calendar,
} from "lucide-vue-next";
import PostCard from "~/components/calendar/PostCard.vue";

// Reactive state
const currentDate = ref(new Date());
const viewMode = ref("month");
const filterMode = ref("all"); // Filter for posts by platform
const showDatePicker = ref(false);
const showViewDropdown = ref(false);
const showFilterDropdown = ref(false);
const pickerDate = ref(new Date());
const draggedPost = ref(null);

// Sample posts data
const ex_posts = ref([
  {
    id: 1,
    content: "Sample Twitter post content",
    time: "12:05 AM",
    date: "2025-06-17",
    platform: "twitter",
  },
  {
    id: 2,
    content: "Instagram post with image",
    time: "10:40 AM",
    date: "2025-06-28",
    platform: "instagram",
  },
  {
    id: 3,
    content: "Another Instagram post",
    time: "11:06 AM",
    date: "2025-06-28",
    platform: "instagram",
  },
  {
    id: 4,
    content: "Sample content for Monday",
    time: "3:00 PM",
    date: "2025-06-30",
    platform: "instagram",
  },
  {
    id: 5,
    content: "Thursday post content",
    time: "1:00 PM",
    date: "2025-07-03",
    platform: "twitter",
  },
]);

const posts = ref([
  {
    id: "1",
    content:
      "Just launched our new product! Check it out and let us know what you think. #ProductLaunch #Innovation",
    platform: "tiktok",
    time: "12:05 AM",
    date: "2025-07-04",
    media: {
      type: "image",
      url: "https://images.unsplash.com/photo-1579353977828-2a4eab540b9a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c2FtcGxlfGVufDB8fDB8fHww",
    },

    status: "scheduled",
  },
  {
    id: "2",
    content:
      "Behind the scenes look at our team working hard! 💪 #TeamWork #Company",
    platform: "instagram",
    time: "12:35 AM",
    date: "2025-07-04",
    media: {
      type: "image",
      url: "https://images.unsplash.com/photo-1579353977828-2a4eab540b9a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c2FtcGxlfGVufDB8fDB8fHww",
    },

    status: "scheduled",
  },
  {
    id: "3",
    content:
      "Quick tip: Always backup your data before making major changes! #TechTips",
    platform: "facebook",
    time: "12:40 AM",
    date: "2025-07-04",
    media: {
      type: "image",
      url: "https://images.unsplash.com/photo-1579353977828-2a4eab540b9a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c2FtcGxlfGVufDB8fDB8fHww",
    },

    status: "scheduled",
  },

  {
    id: "4",
    content:
      "Excited for our upcoming webinar! Register now! #Webinar #Learning",
    platform: "linkedin",
    time: "8:05 PM",
    date: "2025-07-04",
    media: {
      type: "image",
      url: "https://images.unsplash.com/photo-1579353977828-2a4eab540b9a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c2FtcGxlfGVufDB8fDB8fHww",
    },

    status: "scheduled",
  },
  {
    id: "5",
    content: "Check out our latest blog post on productivity hacks! #BlogPost",
    platform: "pinterest",
    time: "10:05 PM",
    date: "2025-07-04",
    media: {
      type: "image",
      url: "https://images.unsplash.com/photo-1579353977828-2a4eab540b9a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c2FtcGxlfGVufDB8fDB8fHww",
    },

    status: "scheduled",
  },
  {
    id: "6",
    content: "Join us for a live Q&A session tomorrow! #LiveSession",
    platform: "twitter",
    time: "12:05 AM",
    date: "2025-07-02",
    media: {
      type: "image",
      url: "https://images.unsplash.com/photo-1579353977828-2a4eab540b9a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c2FtcGxlfGVufDB8fDB8fHww",
    },

    status: "scheduled",
  },
]);
// Computed properties
const currentMonthYear = computed(() => {
  return currentDate.value.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
});

const pickerMonthYear = computed(() => {
  return pickerDate.value.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
});

const weekDays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const timeSlots = [
  "12 AM",
  "1 AM",
  "2 AM",
  "3 AM",
  "4 AM",
  "5 AM",
  "6 AM",
  "7 AM",
  "8 AM",
  "9 AM",
  "10 AM",
  "11 AM",
  "12 PM",
  "1 PM",
  "2 PM",
  "3 PM",
  "4 PM",
  "5 PM",
  "6 PM",
  "7 PM",
  "8 PM",
  "9 PM",
  "10 PM",
  "11 PM",
];

const monthDates = computed(() => {
  const year = currentDate.value.getFullYear();
  const month = currentDate.value.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDate = new Date(firstDay);
  startDate.setDate(startDate.getDate() - firstDay.getDay());

  const dates = [];
  const today = new Date();

  for (let i = 0; i < 42; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);

    dates.push({
      date: new Date(date),
      day: date.getDate(),
      isOtherMonth: date.getMonth() !== month,
      isToday: date.toDateString() === today.toDateString(),
      key: date.toISOString().split("T")[0],
    });
  }

  return dates;
});

const weekDates = computed(() => {
  const startOfWeek = new Date(currentDate.value);
  const day = startOfWeek.getDay();
  startOfWeek.setDate(startOfWeek.getDate() - day);

  const dates = [];
  const today = new Date();

  for (let i = 0; i < 7; i++) {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);

    dates.push({
      date: new Date(date),
      day: date.getDate(),
      dayName: date.toLocaleDateString("en-US", { weekday: "short" }),
      isToday: date.toDateString() === today.toDateString(),
      key: date.toISOString().split("T")[0],
    });
  }

  return dates;
});

const pickerDates = computed(() => {
  const year = pickerDate.value.getFullYear();
  const month = pickerDate.value.getMonth();
  const firstDay = new Date(year, month, 1);
  const startDate = new Date(firstDay);
  startDate.setDate(startDate.getDate() - firstDay.getDay());

  const dates = [];
  const today = new Date();
  const selected = currentDate.value;

  for (let i = 0; i < 42; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);

    dates.push({
      date: new Date(date),
      day: date.getDate(),
      isOtherMonth: date.getMonth() !== month,
      isToday: date.toDateString() === today.toDateString(),
      isSelected: date.toDateString() === selected.toDateString(),
      key: date.toISOString().split("T")[0],
    });
  }

  return dates;
});

const groupedPosts = computed(() => {
  const groups = {};
  const today = new Date();

  posts.value.forEach((post) => {
    const postDate = new Date(post.date);
    const dateKey = post.date;

    if (!groups[dateKey]) {
      let dateLabel;
      if (postDate.toDateString() === today.toDateString()) {
        dateLabel = "Today";
      } else {
        dateLabel = postDate.toLocaleDateString("en-US", {
          weekday: "long",
          month: "long",
          day: "numeric",
        });
      }

      groups[dateKey] = {
        date: dateKey,
        dateLabel,
        posts: [],
      };
    }

    groups[dateKey].posts.push(post);
  });

  return Object.values(groups).sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );
});

const filteredPosts = computed(() => {
  if (filterMode.value === "all") return posts.value;

  return posts.value.filter(
    (post) => post.platform === filterMode.value.toLocaleLowerCase()
  );
});

// Methods
const goPrev = () => {
  const newDate = new Date(currentDate.value);
  if (viewMode.value === "week") {
    newDate.setDate(newDate.getDate() - 7);
  } else if (viewMode.value === "month") {
    newDate.setMonth(newDate.getMonth() - 1);
  }
  currentDate.value = newDate;
};

const goNext = () => {
  const newDate = new Date(currentDate.value);
  if (viewMode.value === "week") {
    newDate.setDate(newDate.getDate() + 7);
  } else if (viewMode.value === "month") {
    newDate.setMonth(newDate.getMonth() + 1);
  }
  currentDate.value = newDate;
};

const resetToToday = () => {
  currentDate.value = new Date();
};

const changeView = (view) => {
  viewMode.value = view;
  showViewDropdown.value = false;
};

const changeFilter = (filter) => {
  filterMode.value = filter;
  showFilterDropdown.value = false;
};

const prevMonth = () => {
  const newDate = new Date(pickerDate.value);
  newDate.setMonth(newDate.getMonth() - 1);
  pickerDate.value = newDate;
};

const nextMonth = () => {
  const newDate = new Date(pickerDate.value);
  newDate.setMonth(newDate.getMonth() + 1);
  pickerDate.value = newDate;
};

const selectDate = (date) => {
  if (!date.isOtherMonth) {
    currentDate.value = new Date(date.date);
    showDatePicker.value = false;
  }
};

const getPostsForDate = (date) => {
  const dateStr = date.toISOString().split("T")[0];
  return posts.value.filter((post) => post.date === dateStr);
};

const getPostsForDateTime = (date, hour) => {
  const dateStr = date.toISOString().split("T")[0];
  return posts.value.filter((post) => {
    if (post.date !== dateStr) return false;
    const postHour = convertTo24Hour(post.time);
    const slotHour = timeSlots.indexOf(hour);
    return Math.floor(postHour) === slotHour;
  });
};

const convertTo24Hour = (time12h) => {
  const [time, modifier] = time12h.split(" ");
  let [hours, minutes] = time.split(":");
  hours = parseInt(hours, 10);
  minutes = parseInt(minutes, 10) || 0;

  if (modifier === "AM") {
    if (hours === 12) hours = 0;
  } else {
    if (hours !== 12) hours += 12;
  }

  return hours + minutes / 60;
};

const getPostPosition = (time) => {
  const hour24 = convertTo24Hour(time);
  const minutes = (hour24 % 1) * 60;
  return (minutes / 60) * 64;
};

const dragStart = (post) => {
  draggedPost.value = post;
};

const dropPost = (event, date, hour = null) => {
  event.preventDefault();
  if (!draggedPost.value) return;

  if (viewMode.value === "week" && hour && isPastDateTime(date, hour)) {
    return;
  } else if (viewMode.value !== "week") {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dropDate = new Date(date);
    dropDate.setHours(0, 0, 0, 0);
    if (dropDate < today) {
      return;
    }
  }

  const dateStr = date.toISOString().split("T")[0];
  const postIndex = posts.value.findIndex((p) => p.id === draggedPost.value.id);

  if (postIndex !== -1) {
    const updatedPost = { ...posts.value[postIndex] };
    updatedPost.date = dateStr;

    if (hour && viewMode.value === "week") {
      const originalTime = updatedPost.time;
      const timeParts = originalTime.match(/:\s*(\d+)/);
      const minutes = timeParts ? timeParts[1] : "00";

      updatedPost.time = hour.replace(" ", `:${minutes} `);
    }

    posts.value[postIndex] = updatedPost;
  }

  draggedPost.value = null;
};

// order, posts by time
const getPostsForDateTimeOrdered = (date, hour) => {
  const dateStr = date.toISOString().split("T")[0];
  const hourPosts = posts.value.filter((post) => {
    if (post.date !== dateStr) return false;
    const postHour = convertTo24Hour(post.time);
    const slotHour = timeSlots.indexOf(hour);
    return Math.floor(postHour) === slotHour;
  });

  // Sort within the hour
  return hourPosts.sort((a, b) => {
    const timeA = convertTo24Hour(a.time);
    const timeB = convertTo24Hour(b.time);
    return timeA - timeB;
  });
};

// Calculate dynamic height for entire hour row based on maximum posts in any day for that hour
const getHourRowHeight = (hour) => {
  const maxPostsInHour = Math.max(
    1, // Minimum 1 to avoid issues with Math.max on empty array
    ...weekDates.value.map((date) => {
      return getPostsForDateTimeOrdered(date.date, hour).length;
    })
  );

  // Base height of 64px, plus 52px for each additional post
  const baseHeight = 64;
  const postHeight = 52;

  if (maxPostsInHour === 0) return baseHeight;

  return Math.max(baseHeight, baseHeight + (maxPostsInHour - 1) * postHeight);
};

// Check if a specific date and hour is in the past
const isPastDateTime = (date, hour) => {
  const now = new Date();
  const checkDate = new Date(date);
  const hourIndex = timeSlots.indexOf(hour);

  // Handle 12 AM as hour 0, 12 PM as hour 12
  let actualHour = hourIndex;
  if (hourIndex === 0)
    actualHour = 0; // 12 AM
  else if (hourIndex <= 11)
    actualHour = hourIndex; // 1 AM - 11 AM
  else if (hourIndex === 12)
    actualHour = 12; // 12 PM
  else actualHour = hourIndex; // 1 PM - 11 PM (13-23)

  checkDate.setHours(actualHour, 0, 0, 0);

  return checkDate < now;
};

// Initialize picker date
onMounted(() => {
  pickerDate.value = new Date(currentDate.value);
});
</script>

<style scoped>
.calendar-container {
  font-family:
    -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

.auto-rows-fr {
  grid-auto-rows: 1fr;
}

/* Drag and drop visual feedback */
.cursor-move:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* Smooth transitions */
* {
  transition: all 0.2s ease;
}
</style>
