<template>
    <div>
        <h4 class="mb-5 mt-4 d-flex justify-content-between">
            <span>{{title}}</span>
            <base-button type="primary" @click="exportTasks">export</base-button>
        </h4>
        <task-item
                v-for="task in tasks"
                :key="task.id" :id="task.id" :task="task"
                :done="task.status===1" :title="task.title">
        </task-item>
        <base-pagination align="center"
                         :page-count="pagination.pageCount"
                         :per-page="pagination.perPage"
                         v-model="currentPage"></base-pagination>
    </div>
</template>

<script>
  import TaskItem from '@/views/Task/TaskItem'
  import BasePagination from '@/components/BasePagination'

  export default {
    // misc
    name: 'TaskList',
    // assets
    components: { BasePagination, TaskItem },

    // data
    data () {
      return {
        currentPage: 1,
      }
    },
    props: {
      title: '',
      tasks: {
        type: Array,
        default: () => [],
      },
      pagination: {
        pageCount: 5,
        perPage: 10,
      },
    },
    computed: {},
    methods: {
      exportTasks () {
        console.log('Export button clicked. ')
      },
    },
    watch: {
      currentPage: function (page, oldPage) {
        this.$emit('pageChanged', { page, oldPage })
      },
    },

    // lifecycle hooks
    beforeCreated: function () {
    },
    created: function () {
    },
    beforeMount: function () {
    },
    mounted: function () {
    },
    beforeUpdate: function () {
    },
    updated: function () {
    },
    activated: function () {
    },
    deactivated: function () {
    },
    beforeDestroy: function () {
    },
    destroyed: function () {
    },
    errorCaptured: function () {
    },
  }
</script>

<style scoped>

</style>