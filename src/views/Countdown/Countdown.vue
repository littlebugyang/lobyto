<template>
    <div></div>
</template>

<script>
  import { mapState, mapMutations, mapActions } from 'vuex'
  import requests from '@/plugins/request'

  export default {
    // miscellaneous
    name: 'Countdown',

    // data
    data () {
      return {
        intervalId: 0,
      }
    },
    computed: {
      ...mapState('countdown', ['currentCountdown']),
    },
    methods: {
      startCountdown: function () {
        this.intervalId = setInterval(() => {
          const { startTime, length } = this.currentCountdown
          if (length * 60000 <= (Date.now() - startTime)) {
            this.finishCountdown()

            // show notification
            if (window.Notification && Notification.permission !== 'denied') {
              Notification.requestPermission(function (status) {
                new Notification('Lobyto Countdown', {
                  body: 'Time is up!!!!',
                  icon: 'img/brand/blue.png',
                })
              })
            }
          }
        }, 1000)
        console.log('Start an interval for notification with id: ', this.intervalId)
      },
      finishCountdown: function () {
        // clearInterval MUST BE the NO.1 step for finishCountdown()
        // In a not that good network, avoid duplicate notifications
        console.log('Clear the interval for notification with id: ', this.intervalId)
        clearInterval(this.intervalId)
        this.intervalId = 0
        if (parseInt(this.currentCountdown.length) < 1) {
          return
        }

        this.addCountdown({
          body: {
            countdown: this.currentCountdown,
          },
        })
        this.restoreCountdown()
      },
      restoreCountdown: function () {
        const defaultCurrentCountdown = {
          taskId: -1,
          startTime: 0,
          length: '15',
          stop: false,
        }
        this.mutateCurrentCountdown(defaultCurrentCountdown)
        localStorage.setItem('countdown', JSON.stringify(defaultCurrentCountdown))
      },
      ...mapMutations('countdown', ['mutateCurrentCountdown']),
      ...mapActions('countdown', ['addCountdown']),
    },
    watch: {
      currentCountdown: {
        handler: function (val, oldVal) {
          if (oldVal.taskId === -1 && val.taskId != -1) {
            if (this.intervalId === 0) {
              // This new countdown has not been started by this mounted()
              this.startCountdown()
            }
          } else if (val.stop) {
            this.finishCountdown()
            this.restoreCountdown()
          }
        },
        deep: true,
      },
    },

    // lifecycle hooks
    mounted () {
      // localStorage may contain the last unsaved countdown
      if (typeof (Storage) === 'undefined') {
        // Check localStorage's availability
        console.log('Local Storage not available. ')
        return
      }

      if (!localStorage.getItem('countdown')) {
        // Check if the countdown has never been used
        return
      }

      this.mutateCurrentCountdown(JSON.parse(localStorage.getItem('countdown')))

      // Determine whether there is unsaved countdown
      const { startTime, length } = this.currentCountdown
      if (startTime != 0) {
        // determine whether the last unsaved countdown has expired
        const expired = length * 60000 <= (Date.now() - startTime)
        if (expired) {
          this.finishCountdown()
        } else {
          this.startCountdown()
        }
      }
    },
    beforeDestroy () {
      console.log('Clear the interval with id: ', this.intervalId)
      clearInterval(this.intervalId)
    },
  }
</script>