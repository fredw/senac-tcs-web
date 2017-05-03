<template>
  <div class="teste">
    teste
    <p>Counter: {{ $store.state.count }}, counter is {{ evenOrOdd }}</p>
    <button @click="increment">Increment</button>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'teste',
  computed: mapGetters([
    'evenOrOdd'
  ]),
  methods: mapActions([
    'increment',
    'decrement',
    'incrementIfOdd',
    'incrementAscyn'
  ])
}
</script>
