<template>
  <article class="media">
    <figure class="media-left">
      <figure class="image is-96x96">
        <img :src="item.image">
      </figure>
    </figure>
    <div class="media-content">
      <div class="content">
        <p>
          <span class="is-size-4"><strong>{{ item.title }}</strong></span>
          <br>
          {{ item.description }}
          <br>
          <span style="color: gray;"><small>{{ item.site_name }}</small></span>
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
