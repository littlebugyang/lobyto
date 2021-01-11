<template>
    <div id="recentChart"></div>
</template>

<script>
    import {mapState} from "vuex"

    export default {
        name: "RecentChart",
        computed: {
            ...mapState("countdown", ["countdowns"])
        },
        data() {
            return {
                recentChart: null
            }
        },
        watch: {
            countdowns(val, oldVal) {
                this.updateRecentChart()
            }
        },
        methods: {
            updateRecentChart: function () {
                // calculate the statistics the chart needs
                let recentDates = []
                let recentLengths = []
                let dateCount = 0
                let maxDates = 8
                for (let i = this.countdowns.length - 1; i > 0 && dateCount < maxDates; --i) {
                    let startTime = new Date(Date.parse(this.countdowns[i].startTime))
                    let recentMonth = startTime.getMonth() + 1
                    let recentDate = startTime.getDate()

                    if (recentDates.length === 0 || `${recentMonth}.${recentDate}` !== recentDates[recentDates.length - 1]) {
                        // being able to push a new date
                        ++dateCount

                        // push a new date and new minutes
                        recentDates.push(`${recentMonth}.${recentDate}`)
                        recentLengths.push(parseInt(this.countdowns[i].length))
                    } else {
                        recentLengths[recentLengths.length - 1] += parseInt(this.countdowns[i].length)
                    }
                }

                this.recentChart.setOption({
                    xAxis: {
                        name: "date",
                        data: recentDates.reverse()
                    },
                    series: [{
                        type: "bar",
                        data: recentLengths.reverse().map(minutes => new Number(minutes / 60.0).toFixed(2))
                    }]
                })
            }
        },
        mounted: function () {
            this.recentChart = this.$echarts.init(document.getElementById("recentChart"))
            // let recentChart = this.$echarts.init(document.getElementById("recentChart"))

            this.recentChart.setOption({
                // recentChart.setOption({
                color: "#5e72e4",
                title: {
                    text: "Countdown sums in recent days",
                    left: "center"
                },
                xAxis: {
                    name: "date",
                    data: []
                },
                yAxis: {
                    name: "hours"
                },
                series: [{
                    type: "bar",
                    data: []
                }]
            })
        }
    }
</script>

<style scoped>
    #recentChart {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 400px;
    }
</style>