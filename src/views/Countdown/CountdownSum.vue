<template>
    <div class="countdown-sum">
        <h4 class="mb-5">
            <span>Today's Countdowns</span>
        </h4>
        <span
        >The time you have been concentrated today is:
      <span style="color: #fb6340; font-size: 300%">
        {{ parseInt(sumCountdown / 60) }} h {{ sumCountdown % 60 }} m
      </span>
    </span>
    </div>
</template>

<script>
  import { mapState, mapActions } from 'vuex'

  export default {
    // misc
    name: 'CountdownSum',
    // assets
    components: {},

    // data
    data () {
      return {}
    },
    props: {},
    computed: {
      sumCountdown: function () {
        let sum = 0

        let now = new Date()
        let todayYear = now.getFullYear()
        let todayMonth = now.getMonth()
        let todayDate = now.getDate()

        for (let i = 0; i < this.countdowns.length; ++i) {
          let startTime = new Date(this.countdowns[i].startTime)
          // This is today's countdown.
          if (
            startTime.getFullYear() === todayYear &&
            startTime.getMonth() === todayMonth &&
            startTime.getDate() === todayDate
          ) {
            sum += parseInt(this.countdowns[i].length)
          }
        }
        return sum
      },
      ...mapState('countdown', ['countdowns']),
    },
    methods: {
      ...mapActions('countdown', ['getCountdowns']),
    },
    watch: {},

    // lifecycle hooks
    beforeCreated: function () {},
    created: function () {},
    beforeMount: function () {},
    mounted: function () {
      this.getCountdowns({
        params: {
          page: 1,
          perPage: 200,
        },
      })
    },
    beforeUpdate: function () {},
    updated: function () {},
    activated: function () {},
    deactivated: function () {},
    beforeDestroy: function () {},
    destroyed: function () {},
    errorCaptured: function () {},
  }
</script>

<style scoped>
</style>