<template>
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-lg-12">
                <!-- The current state of the countdown -->
                <h4 class="mb-5 mt-4">
                    <span>Current Countdown</span>
                </h4>

                <countdown-progress v-if="currentCountdown.taskId !== -1"></countdown-progress>
                <h6 v-else class="mb-3">
                    <span>No countdown for any task right now. </span>
                </h6>

                <hr/>

                <!-- Quick start to write down a task -->
                <h4 class="mb-5">
                    <span>Quick Start</span>
                </h4>

                <div class="container">
                    <div class="row">
                        <div class="col-10">
                            <base-input :value="newTitle" @input="handleNewTaskInput"
                                        placeholder="What you are to do ..."></base-input>
                        </div>
                        <div class="col-2">
                            <base-button type="primary" @click="confirmAdd" :disabled="newTitle === ''">Add
                            </base-button>
                        </div>
                    </div>
                </div>

                <hr/>

                <!-- View the remaining tasks -->
                <task-list
                        title="Remaining Tasks"
                        :tasks="undoneTasks"
                        :pagination="paginationUndone"
                        @pageChanged="handleUndoneTasksPageChanged"
                >
                </task-list>

                <hr/>

                <!-- View the Today's countdown -->
                <countdown-sum></countdown-sum>

                <hr/>

                <!-- View the overview of countdowns -->
                <h4 class="mb-5">
                    <span>Overview of Countdowns</span>
                    <recent-chart></recent-chart>
                </h4>

            </div>
        </div>
        <countdown-modal></countdown-modal>
        <edit-task-modal></edit-task-modal>
        <confirm-modal></confirm-modal>
    </div>
</template>

<script>
  import BaseInput from '@/components/BaseInput'
  import BaseButton from '@/components/BaseButton'
  import BasePagination from '@/components/BasePagination'
  import TaskList from '@/views/Task/TaskList'
  import CountdownProgress from '@/views/Countdown/CountdownProgress'
  import RecentChart from '@/views/Chart/RecentChart'
  import CountdownModal from '@/views/Modal/CountdownModal'
  import CountdownSum from '@/views/Countdown/CountdownSum'
  import EditTaskModal from '@/views/Modal/EditTaskModal'
  import ConfirmModal from '@/views/Modal/ConfirmModal'
  import { mapState, mapActions } from 'vuex'

  export default {
    name: 'Overview',
    components: {
      EditTaskModal, CountdownModal, ConfirmModal, BasePagination,
      RecentChart, CountdownProgress, CountdownSum, BaseButton, BaseInput, TaskList,
    },
    mounted: function () {
      // get tasks and countdowns
      this.handleUndoneTasksPageChanged({ page: 1 })
    },
    data () {
      return {
        newTitle: '',
        paginationUndone: {
          pageCount: 5,
          perPage: 10,
        },
      }
    },
    computed: {
      undoneTasksForPagination: function () {
        const undoneTasks = this.undoneTasks
        return undoneTasks.slice((this.pagination.currentPage - 1) * this.pagination.perPage,
          this.pagination.currentPage * this.pagination.perPage)
      },
      ...mapState('task', ['undoneTasks']),
      ...mapState('countdown', ['currentCountdown']),
      ...mapState('overview', ['counting', 'countdownModal', 'editTaskModal', 'confirmModal']),
    },
    methods: {
      confirmAdd: function () {
        this.addTask({
          body: {
            task: {
              title: this.newTitle,
            },
          },
        })

        // clear the input
        this.newTitle = ''
      },
      handleNewTaskInput: function (val) {
        this.newTitle = val
      },
      handleUndoneTasksPageChanged: function ({ page }) {
        this.getUndoneTasks({ params: { page, perPage: this.paginationUndone.perPage } })
      },
      ...mapActions('task', ['getUndoneTasks', 'addTask']),
      ...mapActions('countdown', ['getCountdowns']),
      ...mapActions(['request']),
    },
  }
</script>

<style scoped>

</style>