<template>
  <article class="media">
    <figure class="media-left">
      <figure class="image is-128x128">
        <img :src="item.image">
      </figure>
    </figure>
    <div class="media-content">
      <div class="content">
        <p>
          <a
            class="is-size-5"
            :href="item.url"
          >
            <strong>{{ item.title }} </strong>
          </a>
          <br>
          {{ item.description }}
          <br>
          <span style="color: gray;"><small>from: {{ item.host }}</small></span>
        </p>
      </div>
    </div>
  </article>
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

<style scoped>
a {
  color: black;
}

a:hover {
  text-decoration: underline;
}
</style>