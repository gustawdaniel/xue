import {defineStore} from 'pinia'
import {courses, sets} from "database";

export const useCourseStore = defineStore('course-store', {
    state: (): {defaultCourse: null | courses & {source_set: sets}, courses: courses[]} => {
        return {
            defaultCourse: null,
            courses: []
        }
    },
    persist: true,
})
