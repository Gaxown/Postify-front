<template>
  <div
    class="max-w-2xl mx-auto bg-white border border-gray-200 rounded-lg p-4 font-sans"
  >
    <!-- Header with timestamp -->
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center gap-2">
        <span class="font-semibold text-gray-900">{{ postData.date }},</span>
        <span class="text-gray-600">{{ postData.month }}</span>
      </div>
      <button class="p-1 hover:bg-gray-100 rounded-full">
        <svg
          class="w-5 h-5 text-gray-500"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"
          />
        </svg>
      </button>
    </div>

    <!-- Time and Custom label -->
    <div class="flex items-center gap-2 mb-4">
      <span class="text-sm font-medium">{{ postData.time }}</span>
      <div class="flex items-center gap-1" v-if="postData.showCustom">
        <svg
          class="w-4 h-4 text-gray-400"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fill-rule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clip-rule="evenodd"
          />
        </svg>
        <span class="text-sm text-gray-600">Custom</span>
      </div>
    </div>

    <!-- User profile section -->
    <div class="flex items-start gap-3 mb-3">
      <div class="relative">
        <div
          class="w-14 h-14 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-lg"
        >
          {{ postData.user.avatar }}
        </div>
        <!-- display the platform icon -->
        <div
          class="absolute -bottom-1 -right-1 w-7 h-7 p-0.5 rounded-full shadow-sm bg-white shadow-gray-500"
        >
          <div v-if="platform === 'facebook'">
            <!-- Facebook icon SVG -->
            <svg
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
          </div>
          <div v-else-if="platform === 'instagram'">
            <!-- Instagram icon SVG -->
            <svg
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
                <circle
                  cx="512.001"
                  cy="512"
                  fill="url(#bg_1_)"
                  id="bg"
                  r="512"
                />
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
          </div>
          <div v-else-if="platform === 'twitter'">
            <!-- Twitter/X icon SVG -->
            <svg
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
          </div>
          <div v-else-if="platform === 'linkedin'">
            <!-- LinkedIn icon SVG -->
            <svg
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
          </div>
          <div v-else-if="platform === 'pinterest'">
            <!-- Pinterest icon SVG -->
            <svg
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
          </div>
          <div v-else-if="platform === 'tiktok'">
            <!-- TikTok icon SVG -->
            <!-- <div v-html="tikTokIcon" /> -->
            <svg
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
        </div>
      </div>
      <div class="flex-1">
        <div class="font-semibold text-gray-900">
          {{ postData.user.username }}
        </div>
        <div class="text-sm text-gray-500" v-if="postData.user.badge">
          {{ postData.user.badge }}
        </div>
      </div>
    </div>

    <!-- Post content -->
    <div class="mb-4">
      <p class="text-gray-900 mb-3" v-if="postData.content">
        {{ postData.content }}
      </p>

      <!-- Image attachment -->
      <div
        class="border border-gray-200 rounded-lg overflow-hidden"
        v-if="postData.image"
      >
        <img
          :src="postData.image"
          :alt="postData.imageAlt || 'Post image'"
          class="w-full h-auto"
        />
        <div class="text-xs text-gray-500 p-2" v-if="postData.imageCaption">
          {{ postData.imageCaption }}
        </div>
      </div>

      <!-- Share icon -->
      <div class="mt-2">
        <button class="p-1 hover:bg-gray-100 rounded">
          <svg
            class="w-4 h-4 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
            />
          </svg>
        </button>
      </div>
    </div>

    <!-- Platform-specific engagement metrics -->
    <div
      class="flex items-center justify-between py-3 border-t border-gray-100"
    >
      <div class="flex items-center gap-6 text-sm text-gray-600 flex-wrap">
        <!-- Twitter/X Metrics -->
        <template v-if="platform === 'twitter'">
          <div class="flex items-center gap-1">
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            <span>Likes</span>
            <span>-</span>
          </div>
          <div class="flex items-center gap-1">
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            <span>Retweets</span>
            <span>-</span>
          </div>
          <div class="flex items-center gap-1">
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
            <span>Impressions</span>
            <span>-</span>
          </div>
          <div class="flex items-center gap-1">
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
              />
            </svg>
            <span>Clicks</span>
            <span>-</span>
          </div>
          <div class="flex items-center gap-1">
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
              />
            </svg>
            <span>Eng. Rate</span>
            <span>-</span>
          </div>
        </template>

        <!-- Pinterest Metrics -->
        <template v-else-if="platform === 'pinterest'">
          <div class="flex items-center gap-1">
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
              />
            </svg>
            <span>Saves</span>
            <span>0</span>
          </div>
          <div class="flex items-center gap-1">
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            <span>Comments</span>
            <span>0</span>
          </div>
          <div class="flex items-center gap-1">
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
            <span>Impressions</span>
            <span>-</span>
          </div>
          <div class="flex items-center gap-1">
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>Reactions</span>
            <span>-</span>
          </div>
          <div class="flex items-center gap-1">
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
              />
            </svg>
            <span>Eng. Rate</span>
            <span>-</span>
          </div>
        </template>

        <!-- Facebook Metrics -->
        <template v-else-if="platform === 'facebook'">
          <div class="flex items-center gap-1">
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
              />
            </svg>
            <span>Likes</span>
            <span>1</span>
          </div>
          <div class="flex items-center gap-1">
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            <span>Comments</span>
            <span>0</span>
          </div>
          <div class="flex items-center gap-1">
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
            <span>Views</span>
            <span>100</span>
          </div>
          <div class="flex items-center gap-1">
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
              />
            </svg>
            <span>Shares</span>
            <span>-</span>
          </div>
          <div class="flex items-center gap-1">
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
              />
            </svg>
            <span>Reach</span>
            <span>-</span>
          </div>
        </template>

        <!-- TikTok Metrics -->
        <template v-else-if="platform === 'tiktok'">
          <div class="flex items-center gap-1">
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            <span>Likes</span>
            <span>-</span>
          </div>
          <div class="flex items-center gap-1">
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            <span>Comments</span>
            <span>-</span>
          </div>
          <div class="flex items-center gap-1">
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
            <span>Impressions</span>
            <span>-</span>
          </div>
          <div class="flex items-center gap-1">
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
              />
            </svg>
            <span>Shares</span>
            <span>-</span>
          </div>
          <div class="flex items-center gap-1">
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
              />
            </svg>
            <span>Clicks</span>
            <span>-</span>
          </div>
        </template>
      </div>

      <button
        class="p-2 hover:bg-gray-100 rounded border border-gray-200"
        v-if="platform !== 'pinterest'"
      >
        <svg
          class="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 00-2 2z"
          />
        </svg>
      </button>
    </div>

    <!-- Footer with creation time and actions -->
    <div
      class="flex items-center justify-between pt-3 border-t border-gray-100"
    >
      <div class="flex items-center gap-2">
        <span class="text-sm text-gray-600">{{ postData.createdText }}</span>
        <div v-if="platform === 'facebook'" class="text-sm text-gray-500">
          🐕
        </div>
      </div>
      <div class="flex items-center gap-2">
        <button
          class="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 flex items-center gap-1"
        >
          <svg
            class="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          </svg>
          View Post
        </button>
        <button class="p-1 hover:bg-gray-100 rounded">
          <svg
            class="w-4 h-4 text-gray-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"
            />
          </svg>
        </button>
      </div>
    </div>

    <!-- Platform-specific footer -->
    <div v-if="platform === 'pinterest'" class="pt-3 border-t border-gray-100">
      <span class="text-sm text-gray-600">Posted from 📌 Pinterest</span>
    </div>
  </div>
</template>

<script setup>
import {
  Plus,
  Filter,
  HelpCircle,
  Gift,
  User,
  X,
  ChevronDown,
  Tag,
  Settings,
  CheckCircle,
  Share2,
  List,
  Calendar,
  MapPin,
} from "lucide-vue-next";

const props = defineProps({
  platform: {
    type: String,
    required: true,
    validator: (value) =>
      ["twitter", "pinterest", "facebook", "tiktok"].includes(value),
  },
  postData: {
    type: Object,
    default: () => ({
      date: "Today",
      month: "July 1",
      time: "10:00 AM",
      showCustom: true,
      user: {
        username: "Postify",
        avatar: "P",
        verified: true,
        badge: null,
      },
      content: "Sample post content",
      image: null,
      imageAlt: "",
      imageCaption: "",
      createdText: "You created this 14 seconds ago",
    }),
  },
});

// Platform-specific metrics configuration with proper SVG path data
const metricsConfig = {
  twitter: [
    {
      name: "likes",
      label: "Likes",
      icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z",
      value: "-",
    },
    {
      name: "retweets",
      label: "Retweets",
      icon: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15",
      value: "-",
    },
    {
      name: "impressions",
      label: "Impressions",
      icon: "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z",
      value: "-",
    },
    {
      name: "clicks",
      label: "Clicks",
      icon: "M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122",
      value: "-",
    },
    {
      name: "engRate",
      label: "Eng. Rate",
      icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6",
      value: "-",
    },
  ],
  pinterest: [
    {
      name: "saves",
      label: "Saves",
      icon: "M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z",
      value: "0",
    },
    {
      name: "comments",
      label: "Comments",
      icon: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z",
      value: "0",
    },
    {
      name: "impressions",
      label: "Impressions",
      icon: "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z",
      value: "-",
    },
    {
      name: "reactions",
      label: "Reactions",
      icon: "M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
      value: "-",
    },
    {
      name: "engRate",
      label: "Eng. Rate",
      icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6",
      value: "-",
    },
  ],
  facebook: [
    {
      name: "likes",
      label: "Likes",
      icon: "M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5",
      value: "1",
    },
    {
      name: "comments",
      label: "Comments",
      icon: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z",
      value: "0",
    },
    {
      name: "views",
      label: "Views",
      icon: "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z",
      value: "100",
    },
    {
      name: "shares",
      label: "Shares",
      icon: "M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z",
      value: "-",
    },
    {
      name: "reach",
      label: "Reach",
      icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6",
      value: "-",
    },
  ],
  tiktok: [
    {
      name: "likes",
      label: "Likes",
      icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z",
      value: "-",
    },
    {
      name: "comments",
      label: "Comments",
      icon: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z",
      value: "-",
    },
    {
      name: "impressions",
      label: "Impressions",
      icon: "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z",
      value: "-",
    },
    {
      name: "shares",
      label: "Shares",
      icon: "M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z",
      value: "-",
    },
    {
      name: "clicks",
      label: "Clicks",
      icon: "M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122",
      value: "-",
    },
  ],
};

const platformMetrics = computed(() => {
  return metricsConfig[props.platform] || metricsConfig.twitter;
});

const tikTokIcon = `<svg id="Apple" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><rect height="427.97" rx="71.15" width="427.97" x="42.01" y="42.95"/><path fill="#00f6ef" class="cls-1" d="M389.39,221.92V164.85c-74.6-3.15-77-70.94-77-77.31v-.48H254.73V309.33h0a45.66,45.66,0,1,1-32.36-43.71V206.76a104.57,104.57,0,0,0-13.32-.85A103.42,103.42,0,1,0,312.47,309.33c0-1.45,0-2.89-.1-4.32V195.56C338.92,219.85,389.39,221.92,389.39,221.92Z"/><path fill="#fff" class="cls-2" d="M406.37,236V178.9c-74.61-3.15-77-70.94-77-77.31v-.48H271.71V323.38h0a45.66,45.66,0,1,1-32.36-43.7V220.81A104.57,104.57,0,0,0,226,220,103.42,103.42,0,1,0,329.45,323.38c0-1.45,0-2.89-.1-4.32V209.61C355.9,233.9,406.37,236,406.37,236Z"/><path fill="#ff004f" class="cls-3" d="M313.82,101.11c2.78,15.14,10.9,38.81,34.57,52.66-18.09-21.07-19-48.26-19-52.18v-.48Z"/><path fill="#ff004f" class="cls-3" d="M406.37,236V178.9a106.46,106.46,0,0,1-17-2v44.95s-50.47-2.07-77-26.36V304.91c.06,1.43.1,2.87.1,4.32a103.43,103.43,0,0,1-160.72,86.1,103.41,103.41,0,0,0,177.7-71.95c0-1.45,0-2.89-.1-4.32V209.61C355.9,233.9,406.37,236,406.37,236Z"/><path fill="#ff004f" class="cls-3" d="M222.37,265.53a45.69,45.69,0,0,0-33.19,84.85,45.69,45.69,0,0,1,50.17-70.7V220.81A104.57,104.57,0,0,0,226,220c-1.23,0-2.44,0-3.66.07Z"/></svg>`;
</script>

<style scoped>
.cls-1 {
  fill: #00f6ef;
}
.cls-2 {
  fill: #fff;
}
.cls-3 {
  fill: #ff004f;
}
</style>
