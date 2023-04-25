<script lang="ts" setup>
import relativeTime from "dayjs/plugin/relativeTime";
import dayjs from "dayjs";
import {definePageMeta, useToken} from "#imports";
import {t} from "#imports";

dayjs.extend(relativeTime);

definePageMeta({
    layout: "app",
});

import {users} from 'database';

const token = useToken();

console.log("token", token.value);

const me = ref<users | null>(null);

interface StatCard {
    label: string,
    active: boolean,
    value: string,
    suffix: string,
    fallback: string,
}

const stats = ref<Map<string, StatCard>>(new Map([]));

onMounted(async () => {
    t.me.query().then((value => {
        me.value = value;
        stats.value.set('register', {
            label: "Account registered",
            active: Boolean(me.value.created_at),
            value: me.value.created_at ? dayjs(me.value.created_at).fromNow(true) : "No registered",
            suffix: "ago",
            fallback: "No registered"
        });
        stats.value.set('login', {
            label: "Last login",
            active: Boolean(me.value.last_login_at),
            value: me.value.last_login_at ? dayjs(me.value.last_login_at).fromNow(true) : "No logged in yet",
            suffix: "ago",
            fallback: "No logged in yet"
        });
    }));
    t.myLimit.query().then((value => {
        const limitPercent = Math.round(100 * (1 - (value / (1440 * 60))));

        stats.value.set('limit', {
            label: "Used limit",
            active: limitPercent > 0,
            value: limitPercent.toFixed() + '%',
            suffix: "",
            fallback: "Limit passed. Wait to next day."
        });
    }))
});

</script>

<style scoped></style>

<template>
    <div v-if="me" class="rounded-lg bg-white overflow-hidden shadow">
        <h2 id="profile-overview-title" class="sr-only">Profile Overview</h2>
        <div class="bg-white p-6">
            <div class="sm:flex sm:items-center sm:justify-between">
                <div class="sm:flex sm:space-x-5 sm:items-center">
                    <div class="flex-shrink-0">
                        <img
                                :src="me.avatar"
                                alt=""
                                class="mx-auto h-20 w-20 rounded-full border"
                        />
                    </div>
                    <div class="mt-4 text-center sm:mt-0 sm:pt-1 sm:text-left">
                        <!--              <p class="text-sm font-medium text-gray-600">Welcome back,</p>-->
                        <p class="text-xl font-bold text-gray-900 sm:text-2xl">
                            {{ me.name }}
                        </p>
                        <p class="text-sm font-medium text-gray-600">{{ me?.email }}</p>
                    </div>
                </div>
                <!--          <div class="mt-5 flex justify-center sm:mt-0">-->
                <!--            <a href="#" class="flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"> View profile </a>-->
                <!--          </div>-->
            </div>
        </div>
        <div
                class="border-t border-gray-200 bg-gray-50 grid grid-cols-1 divide-y divide-gray-200 sm:grid-cols-3 sm:divide-y-0 sm:divide-x"
        >
            <div
                    v-for="stat in stats.values()"
                    :key="stat.label"
                    class="px-6 py-5 text-sm font-medium text-center"
            >
                <div v-if="stat.value">
                    <span class="text-gray-600">{{ stat.label }}</span>
                    {{ " " }}
                    <span class="text-gray-900">{{ stat.value }}</span>
                    {{ " " }}
                    <span class="text-gray-600">{{ stat.suffix }}</span>
                </div>
                <div v-else>
                    <span class="text-gray-600">{{ stat.fallback }}</span>
                </div>
            </div>
        </div>

        <Courses/>
        <!--    <AnswersChart />-->
    </div>
</template>
