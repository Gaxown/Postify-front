<template>
  <div
    v-for="post in getPostsForDate(date.date)"
    :key="post.id"
    :class="[
      'text-xs p-1 rounded cursor-move flex-col items-center space-x-1',
      post.platform === 'instagram'
        ? 'bg-pink-300 text-pink-800'
        : post.platform === 'linkedin'
          ? 'bg-blue-100 text-blue-800 border border-blue-400'
          : post.platform === 'pinterest'
            ? 'bg-[#FFE5E6] text-red-800 border-red-300 border'
            : post.platform === 'twitter'
              ? 'bg-gray-200 text-blue-800 border border-gray-400'
              : post.platform === 'facebook'
                ? 'bg-blue-200 text-blue-900'
                : post.platform === 'tiktok'
                  ? 'bg-gray-400 text-gray-900 border border-[#00F6EF]'
                  : '',
    ]"
    draggable="true"
    @dragstart="dragStart(post)"
  >
    <div class="flex items-center space-x-1 mb-1">
      <div
        class="w-5 h-5 rounded-full flex items-center justify-center text-white text-[8px]"
      >
        <!-- Facebook icon SVG -->
        <svg
          v-if="post.platform === 'facebook'"
          class=""
          height="100%"
          style="
            fill-rule: evenodd;
            clip-rule: evenodd;
            stroke-linejoin: round;
            stroke-miterlimit: 2;
          "
          version="1.1"
          viewBox="0 0 512 512"
          xml:space="preserve"
          xmlns="http://www.w3.org/2000/svg"
          xmlns:serif="http://www.serif.com/"
          xmlns:xlink="http://www.w3.org/1999/xlink"
        >
          <g>
            <path
              d="M512,256c0,-141.385 -114.615,-256 -256,-256c-141.385,0 -256,114.615 -256,256c0,127.777 93.616,233.685 216,252.89l0,-178.89l-65,0l0,-74l65,0l0,-56.4c0,-64.16 38.219,-99.6 96.695,-99.6c28.009,0 57.305,5 57.305,5l0,63l-32.281,0c-31.801,0 -41.719,19.733 -41.719,39.978l0,48.022l71,0l-11.35,74l-59.65,0l0,178.89c122.385,-19.205 216,-125.113 216,-252.89Z"
              style="fill: #1877f2; fill-rule: nonzero"
            />
            <path
              d="M355.65,330l11.35,-74l-71,0l0,-48.022c0,-20.245 9.917,-39.978 41.719,-39.978l32.281,0l0,-63c0,0 -29.297,-5 -57.305,-5c-58.476,0 -96.695,35.44 -96.695,99.6l0,56.4l-65,0l0,74l65,0l0,178.89c13.033,2.045 26.392,3.11 40,3.11c13.608,0 26.966,-1.065 40,-3.11l0,-178.89l59.65,0Z"
              style="fill: #fff; fill-rule: nonzero"
            />
          </g>
        </svg>
        <!-- Instagram icon SVG -->
        <svg
          v-else-if="post.platform === 'instagram'"
          enable-background="new 0 0 1024 1024"
          height="100%"
          id="Instagram_2_"
          version="1.1"
          viewBox="0 0 1024 1024"
          width="100%"
          xml:space="preserve"
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
        >
          <g id="Background">
            <linearGradient
              gradientTransform="matrix(0.9397 0.3421 0.3421 -0.9397 276.2042 765.8284)"
              gradientUnits="userSpaceOnUse"
              id="bg_1_"
              x1="463.9526"
              x2="-194.4829"
              y1="-73.1143"
              y2="711.4479"
            >
              <stop offset="0" style="stop-color: #20254c" />
              <stop offset="0.0571" style="stop-color: #29254d" />
              <stop offset="0.1502" style="stop-color: #41234f" />
              <stop offset="0.2679" style="stop-color: #692152" />
              <stop offset="0.4039" style="stop-color: #a01f57" />
              <stop offset="0.5333" style="stop-color: #da1c5c" />
              <stop offset="0.5924" style="stop-color: #dc255a" />
              <stop offset="0.6889" style="stop-color: #e13d56" />
              <stop offset="0.8106" style="stop-color: #ea654e" />
              <stop offset="0.9515" style="stop-color: #f69c44" />
              <stop offset="1" style="stop-color: #fbb040" />
            </linearGradient>
            <circle cx="512.001" cy="512" fill="url(#bg_1_)" id="bg" r="512" />
          </g>
          <g id="Instagram_3_">
            <circle cx="658.765" cy="364.563" fill="#FFFFFF" r="33.136" />
            <circle
              cx="512.001"
              cy="512"
              fill="none"
              r="121.412"
              stroke="#FFFFFF"
              stroke-miterlimit="10"
              stroke-width="45"
            />
            <path
              d="M255.358,612.506c0,91.127,73.874,165,165,165   h183.283c91.127,0,165-73.873,165-165V411.495c0-91.127-73.873-165-165-165H420.358c-91.127,0-165,73.873-165,165V612.506z"
              fill="none"
              stroke="#FFFFFF"
              stroke-miterlimit="10"
              stroke-width="45"
            />
          </g>
        </svg>
        <!-- Twitter/X icon SVG -->
        <svg
          v-else-if="post.platform === 'twitter'"
          xmlns="http://www.w3.org/2000/svg"
          width="100%"
          height="100%"
          viewBox="0 0 50 50"
        >
          <circle cx="25" cy="25" r="23" fill="#000" />
          <path
            fill="#FFFFFF"
            d="M13.086 13L21.023 13L26.66 21.01L33.5 13L36 13L27.789 22.613L37.914 37L29.978 37L23.438 27.707L15.5 37L13 37L22.309 26.104L13.086 13zM16.914 15L31.021 35L34.086 35L19.979 15L16.914 15z"
          />
        </svg>
        <!-- LinkedIn icon SVG -->
        <svg
          v-else-if="post.platform === 'linkedin'"
          height="100%"
          width="100%"
          viewBox="0 0 500 500"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="250" cy="250" r="245" fill="#0077b5" />

          <path
            d="M 128.76,142.36 C 107.35,142.36 90,159.75 90,181.2 c 0,21.45 17.35,38.84 38.76,38.84 21.41,0 38.76,-17.39 38.76,-38.84 0,-21.45 -17.35,-38.84 -38.76,-38.84 z m 203.03,101.13 -0.03,0 c -4.38,-0.02 -8.63,0.16 -14.18,0.45 -12.19,0.63 -40.66,13.84 -51.08,34.92 0,-9.15 0.11,-17.56 0.11,-30.11 -12.49,0 -28.82,0.08 -62.95,0.08 0,38.31 -0.42,173.97 -0.42,213.5 l 66.08,0 c 0,-23.45 0.32,-82.35 0.32,-119.34 0,-12.42 7.51,-41.11 38.32,-41.11 27.97,0 35.82,23.58 35.82,41.11 0,38.52 -0.29,92.98 -0.29,119.34 l 66.47,0 c 0,-25.77 0.24,-95.78 -0.55,-139.95 -0.96,-53.63 -33.53,-76.51 -62.76,-78.32 -6.02,-0.37 -10.49,-0.59 -14.87,-0.61 z m -236.21,6.21 0,212.55 66.26,0 0,-212.55 -66.26,0 z"
            fill="#ffffff"
            transform="translate(50,50) scale(0.8)"
          />
        </svg>
        <!-- Pinterest icon SVG -->
        <svg
          v-else-if="post.platform === 'pinterest'"
          enable-background="new 0 0 32 32"
          height="100%"
          id="Layer_1"
          version="1.0"
          viewBox="0 0 32 32"
          width="100%"
          xml:space="preserve"
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
        >
          <path
            d="M15.996,0.007C7.162,0.007,0,7.168,0,16.004c0,6.551,3.938,12.177,9.575,14.65  c-0.045-1.118-0.008-2.459,0.278-3.672c0.308-1.301,2.058-8.719,2.058-8.719s-0.512-1.021-0.512-2.529  c0-2.369,1.376-4.14,3.087-4.14c1.454,0,2.157,1.091,2.157,2.4c0,1.462-0.934,3.65-1.412,5.676c-0.401,1.696,0.852,3.08,2.522,3.08  c3.031,0,5.072-3.891,5.072-8.504c0-3.505-2.361-6.128-6.655-6.128c-4.852,0-7.874,3.617-7.874,7.659  c0,1.394,0.411,2.377,1.054,3.138c0.297,0.35,0.338,0.489,0.229,0.891c-0.074,0.296-0.25,1.003-0.324,1.283  c-0.107,0.407-0.434,0.551-0.801,0.4c-2.235-0.91-3.275-3.358-3.275-6.11c0-4.543,3.831-9.993,11.433-9.993  c6.106,0,10.128,4.42,10.128,9.164c0,6.275-3.491,10.963-8.633,10.963c-1.728,0-3.353-0.934-3.907-1.992c0,0-0.93,3.686-1.125,4.396  c-0.34,1.231-1.004,2.466-1.61,3.427C12.901,31.769,14.421,32,15.996,32c8.834,0,15.995-7.16,15.995-15.996  S24.83,0.007,15.996,0.007z"
            fill="#CA2028"
          />
        </svg>
        <!-- TikTok icon SVG -->
        <svg
          v-else-if="post.platform === 'tiktok'"
          class=""
          viewBox="0 0 512 512"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="256" cy="256" r="256" fill="black" />
          <path
            fill="#00f6ef"
            d="M389.39,221.92V164.85c-74.6-3.15-77-70.94-77-77.31v-.48H254.73V309.33h0a45.66,45.66,0,1,1-32.36-43.71V206.76a104.57,104.57,0,0,0-13.32-.85A103.42,103.42,0,1,0,312.47,309.33c0-1.45,0-2.89-.1-4.32V195.56C338.92,219.85,389.39,221.92,389.39,221.92Z"
          />
          <path
            fill="#fff"
            d="M406.37,236V178.9c-74.61-3.15-77-70.94-77-77.31v-.48H271.71V323.38h0a45.66,45.66,0,1,1-32.36-43.7V220.81A104.57,104.57,0,0,0,226,220,103.42,103.42,0,1,0,329.45,323.38c0-1.45,0-2.89-.1-4.32V209.61C355.9,233.9,406.37,236,406.37,236Z"
          />
          <path
            fill="#ff004f"
            d="M313.82,101.11c2.78,15.14,10.9,38.81,34.57,52.66-18.09-21.07-19-48.26-19-52.18v-.48Z"
          />
          <path
            fill="#ff004f"
            d="M406.37,236V178.9a106.46,106.46,0,0,1-17-2v44.95s-50.47-2.07-77-26.36V304.91c.06,1.43.1,2.87.1,4.32a103.43,103.43,0,0,1-160.72,86.1a103.41,103.41,0,0,0,177.7-71.95c0-1.45,0-2.89-.1-4.32V209.61C355.9,233.9,406.37,236,406.37,236Z"
          />
          <path
            fill="#ff004f"
            d="M222.37,265.53a45.69,45.69,0,0,0-33.19,84.85a45.69,45.69,0,0,1,50.17-70.7V220.81A104.57,104.57,0,0,0,226,220c-1.23,0-2.44,0-3.66.07Z"
          />
        </svg>
      </div>
      <span>{{ post.time }}</span>
    </div>
    <div class="flex text-black">
      {{ post.content.substring(0, 45) }} ...
      <img
        v-if="post.media && post.media.type === 'image'"
        :src="post.media.url"
        alt="Post Image"
        class="w-10 h-10 object-cover rounded mt-1"
      />
    </div>
  </div>
</template>
