<script setup lang="ts">
import { defineProps } from "vue";
import PlatformIcon from "~/components/ui/PlatformIcon.vue";
const props: any = defineProps<{
  post: {
    id: string;
    platform: string;
    content: string;
    time: string;
    date: string;
    media?: {
      type: string;
      url: string;
    };
  };
  //should pass the drag and drop function from the parent component
  DragnDrop: {
    dragStart: (post: any) => void;
    dragEnd?: (post: any) => void;
    dragOver?: (event: DragEvent) => void;
    dragLeave?: (event: DragEvent) => void;
    drop?: (event: DragEvent) => void;
    dragEnter?: (event: DragEvent) => void;
  };
  compact?: boolean;
}>();
</script>
<template>
  <div
    :class="[
      'cursor-move items-center space-x-1 rounded',
      compact ? 'text-xs p-2 h-10 flex' : 'text-xs p-1 flex-col ',
      props.post.platform === 'instagram'
        ? 'bg-pink-200 text-pink-800'
        : props.post.platform === 'linkedin'
        ? 'bg-blue-100 text-blue-800 border border-blue-400'
        : props.post.platform === 'pinterest'
        ? 'bg-[#FFE5E6] text-red-800 border-red-300 border'
        : props.post.platform === 'twitter'
        ? 'bg-[#F6F6F6] text-blue-800 border border-gray-400'
        : props.post.platform === 'facebook'
        ? 'bg-blue-300 text-blue-900'
        : props.post.platform === 'tiktok'
        ? 'bg-gray-200 text-gray-900 border border-[#00F6EF]'
        : '',
    ]"
    draggable="true"
    @dragstart="DragnDrop.dragStart(post)"
  >
    <div
      :class="
        compact ? 'flex items-center space-x-1' : 'flex items-center space-x-1'
      "
    >
      <div
        :class="
          compact
            ? 'w-4 h-4 rounded-full flex items-center justify-center text-white text-[34px]'
            : 'w-5 h-5 rounded-full flex items-center justify-center text-white text-[24px]'
        "
      >
        <PlatformIcon key="platformIcon" :platform="props.post.platform" />
      </div>
      <span
        :class="compact ? 'text-[11px] text-center' : 'text-[13px]  ml-5'"
        >{{ props.post.time }}</span
      >
    </div>
    <div
      :class="
        compact ? 'flex text-black ml-1 overflow-hidden' : 'flex text-black'
      "
    >
      <span
        :class="
          compact
            ? 'text-[11px] ml-1 mr-1 line-clamp-2 leading-normal'
            : 'line-clamp-2 leading-normal'
        "
      >
        {{ props.post.content.substring(0, compact ? 45 : 50) + "..." }}
        <!-- {{ props.post.content }} -->
      </span>
      <img
        v-if="props.post.media && props.post.media.type === 'image'"
        :src="props.post.media.url"
        alt="Post Image"
        :class="['object-cover rounded', compact ? 'w-8 h-8' : 'w-10 h-10']"
      />
    </div>
  </div>
</template>

<style scoped>
.line-clamp-1 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  line-clamp: 1;
}

.line-clamp-2 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-clamp: 2;
}
</style>
