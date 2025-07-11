<template>
  <div
    class="relative flex items-center justify-center transition-all"
    :class="containerClass"
    :style="containerStyle"
  >
    <div :class="iconClass" :style="iconStyle" />
  </div>
</template>

<script setup lang="ts">
type Platform =
  | "facebook"
  | "instagram"
  | "linkedin"
  | "pinterest"
  | "reddit"
  | "snapchat"
  | "telegram"
  | "threads"
  | "tiktok"
  | "twitter"
  | "x"
  | "youtube";

type Size = "xs" | "sm" | "md" | "lg" | "xl";
type Mode = "filled" | "outline";

const props = withDefaults(
  defineProps<{
    platform: Platform;
    size?: Size;
    mode?: Mode;
    showBorder?: boolean;
    rounded?: boolean;
  }>(),
  {
    size: "md",
    mode: "filled",
    rounded: false,
  }
);

const platforms: Record<
  Platform,
  { icon: string; color: string; gradient?: string }
> = {
  facebook: {
    icon: "ri:facebook-fill",
    color: "#1877F2",
  },
  instagram: {
    icon: "ri:instagram-line",
    color: "#E4405F",
    gradient:
      "linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)",
  },
  linkedin: {
    icon: "ri:linkedin-fill",
    color: "#0A66C2",
  },
  pinterest: {
    icon: "ri:pinterest-fill",
    color: "#E60023",
  },
  reddit: {
    icon: "ri:reddit-fill",
    color: "#FF4500",
  },
  snapchat: {
    icon: "ri:snapchat-fill",
    color: "#FFFC00",
  },
  telegram: {
    icon: "ri:telegram-fill",
    color: "#24A1DE",
  },
  twitter: {
    icon: "ri:twitter-x-line",
    color: "#000",
  },
  x: {
    icon: "ri:twitter-x-line",
    color: "#000",
  },
  tiktok: {
    icon: "ri:tiktok-line",
    color: "#000000",
    gradient:
      "linear-gradient(125deg, #25F4EE 0%, #25F4EE 35%, #000000 50%, #000000 55%, #FF0050 65%, #FF0050 100%)",
  },
  threads: {
    icon: "ri:at-line",
    color: "#000000",
  },
  youtube: {
    icon: "ri:youtube-fill",
    color: "#FF0000",
  },
};

const sizeMap: Record<Size, string> = {
  xs: "h-7 w-7",
  sm: "h-8 w-8",
  md: "h-10 w-10",
  lg: "h-12 w-12",
  xl: "h-16 w-16",
};

const containerClass = computed(() => [
  sizeMap[props.size],
  {
    "rounded-full": props.rounded,
    "rounded-lg": !props.rounded,
    "bg-transparent": props.mode === "outline",
  },
]);

const containerStyle = computed(() => {
  const platform = platforms[props.platform];
  const style: Record<string, string> = {};

  if (props.mode === "filled") {
    style.background = platform.gradient || platform.color;
  } else {
    if (props.showBorder) {
      style.padding = "2px";
      if (!platform.gradient) {
        style.background = "transparent";
        style.border = `2px solid ${platform.color}`;
      } else {
        // rounded border with gradient
        style.borderRadius = "50%";
        style.border = "2px solid transparent";
        style.background = `linear-gradient(white, white) padding-box, ${platform.gradient} border-box`;
        // style.background =
        //   "linear-gradient(white, white) padding-box, linear-gradient(to right, red, blue) border-box";
      }
    }
  }
  return style;
});

const iconStyle = computed(() => {
  const style: Record<string, string> = {};
  const platform = platforms[props.platform];
  const iconUrl = `url('https://api.iconify.design/${
    platform.icon.split(":")[0]
  }/${platform.icon.split(":")[1]}.svg')`;

  style["-webkit-mask-image"] = iconUrl;
  style["mask-image"] = iconUrl;
  style["-webkit-mask-size"] = "contain";
  style["mask-size"] = "contain";
  style["-webkit-mask-repeat"] = "no-repeat";
  style["mask-repeat"] = "no-repeat";
  style["-webkit-mask-position"] = "center";
  style["mask-position"] = "center";

  if (props.mode === "outline") {
    style.background = platform.gradient || platform.color;
  } else {
    style.background = "white";
  }
  return style;
});

const iconClass = computed(() => [
  "w-5/6",
  "h-5/6",
  "transition-all",
  "duration-300",
  "group-hover:opacity-80",
  "p-3",
]);
</script>
