import Vue from "vue";
import Router from "vue-router";
import AppHeader from "./layout/AppHeader";
import AppFooter from "./layout/AppFooter";
import Components from "./views/Components.vue";
import Landing from "./views/Landing.vue";
import Login from "./views/Login.vue";
import Register from "./views/Register.vue";
import Profile from "./views/Profile.vue";
import Overview from "./views/Overview";
import Countdowns from "./views/Countdowns";
import Tasks from "./views/Tasks"
import Settings from "@/views/Settings"
import Footer from "./layout/Footer";
import Header from "./layout/Header";

Vue.use(Router);

export default new Router({
    linkExactActiveClass: "active",
    routes: [
        {
            path: "/",
            name: "overview",
            components: {
                header: Header,
                default: Overview,
                footer: Footer
            }
        },
        {
            path: "/countdowns",
            name: "countdowns",
            components: {
                header: Header,
                default: Countdowns,
                footer: Footer
            }
        },
        {
            path: "/tasks",
            name: "tasks",
            components: {
                header: Header,
                default: Tasks,
                footer: Footer
            }
        },
        {
            path: "/settings",
            name: "settings",
            components: {
                header: Header,
                default: Settings,
                footer: Footer
            }
        },
        {
            path: "/argon",
            name: "components",
            components: {
                header: AppHeader,
                default: Components,
                footer: AppFooter
            }
        },
        {
            path: "/landing",
            name: "landing",
            components: {
                header: AppHeader,
                default: Landing,
                footer: AppFooter
            }
        },
        {
            path: "/login",
            name: "login",
            components: {
                header: AppHeader,
                default: Login,
                footer: AppFooter
            }
        },
        {
            path: "/register",
            name: "register",
            components: {
                header: AppHeader,
                default: Register,
                footer: AppFooter
            }
        },
        {
            path: "/profile",
            name: "profile",
            components: {
                header: AppHeader,
                default: Profile,
                footer: AppFooter
            }
        }
    ],
    scrollBehavior: to => {
        if (to.hash) {
            return {selector: to.hash};
        } else {
            return {x: 0, y: 0};
        }
    }
});
