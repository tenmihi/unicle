<template>
  <div class="container has-text-centered">
    <div class="columns is-vcentered">
      <div class="column is-5">
        <figure class="image">
          <img :src="item.image" alt="Description">
        </figure>
      </div>
      <div class="column is-6 is-offset-1">
        <h1 class="title is-3">
          {{ item.title }}
        </h1>
        <h2 class="subtitle is-5" color="gray">
          from: {{ item.host }}
        </h2>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      required: true,
    }
  },
}
</script>

<style>

</style>
