// Dummy data
const coursesData = [
    {
        id: 1,
        title: "The Complete Node.js Course",
        author: "Andrew Mead, Rob Percival",
        description: "Learn Node.js by building real-world applications with Node, Express, MongoDB, Mocha, and more!",
        topic: "Node.js",
        url: "https://codingthesmartway.com/courses/nodejs/"
    },
    {
        id: 2,
        title: "Node.js, Express & MongoDB Dev to Deployment",
        author: "Brad Traversy",
        description: "Learn by example building & deploying real-world Node.js applications from absolute scratch",
        topic: "Node.js",
        url: "https://codingthesmartway.com/courses/nodejs-express-mongodb/"
    },
    {
        id: 3,
        title: "JavaScript: Understanding The Weird Parts",
        author: "Anthony Alicea",
        description: "An advanced JavaScript course for everyone! Scope, closures, prototypes, this, build your own framework, and more.",
        topic: "JavaScript",
        url: "https://codingthesmartway.com/courses/understand-javascript/"
    }
];

// Query Actions
type Args = {
    id: number;
    topic: string;
};

export const getCourse = function (args: Args) {
    const id = args.id;
    return coursesData.filter((course) => {
        return course.id === id;
    })[0];
};

export const getCourses = function (args: Args) {
    if (args.topic) {
        const topic = args.topic;
        return coursesData.filter((course) => course.topic === topic);
    }
 else {
        return coursesData;
    }
};

export const updateTopic = function (args: Args) {
    coursesData.map((course) => {
        if (course.id === args.id) {
            course.topic = args.topic;
            return course;
        }
    });
    return coursesData.filter((course) => course.id === args.id)[0];
};
