import {t} from '#imports';
import {useCourseStore} from "~/stores/courseStore";

export const useDefaultCourse = () => {
  const courseStore = useCourseStore()
  return courseStore.defaultCourse
}

export const setDefaultCourse = async () => {
  const courseStore = useCourseStore()
  const course = await t.defaultCourse.query();

  courseStore.$patch({
    defaultCourse: course
  })
}
