<template>
  <div v-if="productsbyname">
    <ul id="example-1">
      <li v-for="p of productsbyname" :key="p.id">
        {{ p.name }} ({{ p.count }})
      </li>
    </ul>
    <button @click="filter">filter</button>
    <button @click="unfilter">unfilter</button>
  </div>
</template>

<script>
module.exports = {
  mounted() {
    this.$store.dispatch('analytics/products_load')
    // or await...
  },
  data() {
    return { }
  },
  methods: {
    async filter() {
      await this.$store.dispatch('analytics/products_count_greaterthan', 5)
    },
    async unfilter() {
      await this.$store.dispatch('analytics/products_count_clear')
    }
  },
  computed: {
    productsbyname() {
      return Array.from(
        this.$store.state.analytics.products.by_name.filtered(Infinity),
        x => x[1])
    }
  }
};
</script>