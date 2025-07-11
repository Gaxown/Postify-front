<template>
  <CreateCard 
    title="Create New Profile"
    description="Add a new business profile"
    @create="$emit('create')"
  />
</template>

<script setup lang="ts">
import CreateCard from '~/components/ui/CreateCard.vue'

defineEmits<{
  create: []
}>()
</script>
