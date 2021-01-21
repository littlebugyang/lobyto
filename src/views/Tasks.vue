<template>
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-lg-12">

                <!-- View the remaining tasks -->
                <task-list
                        title="Remaining Tasks"
                        :tasks="undoneTasks"
                        :pagination="paginationUndone"
                        @pageChanged="handleUndoneTasksPageChanged"
                >
                </task-list>
                <hr/>

                <!-- View the completed tasks -->
                <task-list
                        title="Completed Tasks"
                        :tasks="doneTasks"
                        :pagination="paginationDone"
                        @pageChanged="handleDoneTasksPageChanged"
                >
                </task-list>
                <hr/>

                <!-- View the deleted tasks -->
                <task-list
                        title="Deleted Tasks"
                        :tasks="deletedTasks"
                        :pagination="paginationDeleted"
                        @pageChanged="handleDeletedTasksPageChanged"
                >
                </task-list>
                <hr/>

                <!-- View the abandoned tasks -->
                <task-list
                        title="Abandoned Tasks"
                        :tasks="abandonedTasks"
                        :pagination="paginationAbandoned"
                        @pageChanged="handleAbandonedTasksPageChanged"
                >
                </task-list>
            </div>
        </div>
    </div>
</template>

<script>
  import BaseButton from '@/components/BaseButton'
  import TaskList from '@/views/Task/TaskList'
  import Modal from '@/components/Modal'
  import { mapState, mapActions } from 'vuex'

  export default {
    name: 'Tasks',
    components: {
      BaseButton, TaskList, Modal,
    },
    mounted: function () {
      this.handleUndoneTasksPageChanged({ page: 1 })
      this.handleDoneTasksPageChanged({ page: 1 })
      this.handleDeletedTasksPageChanged({ page: 1 })
      this.handleAbandonedTasksPageChanged({ page: 1 })
    },
    data () {
      return {
        paginationUndone: {
          pageCount: 5,
          perPage: 10,
        },
        paginationDone: {
          pageCount: 5,
          perPage: 10,
        },
        paginationDeleted: {
          pageCount: 5,
          perPage: 10,
        },
        paginationAbandoned: {
          pageCount: 5,
          perPage: 10,
        },
      }
    },
    computed: {
      ...mapState('task', ['undoneTasks', 'doneTasks', 'deletedTasks', 'abandonedTasks']),
    },
    methods: {
      handleUndoneTasksPageChanged: function ({ page }) {
        this.getUndoneTasks({ params: { page, perPage: this.paginationUndone.perPage } })
      },
      handleDoneTasksPageChanged: function ({ page }) {
        this.getDoneTasks({ params: { page, perPage: this.paginationDone.perPage } })
      },
      handleDeletedTasksPageChanged: function ({ page }) {
        this.getDeletedTasks({ params: { page, perPage: this.paginationDeleted.perPage } })
      },
      handleAbandonedTasksPageChanged: function ({ page }) {
        this.getAbandonedTasks({ params: { page, perPage: this.paginationAbandoned.perPage } })
      },
      ...mapActions('task', ['getUndoneTasks', 'getDoneTasks', 'getDeletedTasks', 'getAbandonedTasks']),
    },
  }
</script>

<style scoped>
</style>