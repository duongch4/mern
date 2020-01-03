import { getCourse, getCourses, updateTopic } from "./action"

export const root = {
    course: getCourse,
    courses: getCourses,
    updateCourseTopic: updateTopic
};
