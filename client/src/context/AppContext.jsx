import { createContext, useEffect, useState } from "react";
import { dummyCourses, dummyTestimonial } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import humanizeDuration from "humanize-duration";

export const AppContext = createContext();

export const AppContextProvider = (props) => {
    const currency = import.meta.env.VITE_CURRENCY;
    const navigate = useNavigate();
    const [allCourses, setAllCourses] = useState([]);
    const [allTestimonials, setAllTestimonials] = useState([]);
    const [isEducator, setIsEducator] = useState(true);

    // fell all courses
    const fetchAllCourses = async () => {
        setAllCourses(dummyCourses);
    };

    // fell all testimonials
    const fetchAllTestimonials = async () => {
        setAllTestimonials(dummyTestimonial);
    };

    // function to calculation average rating of course
    const calculationRating = (course) => {
        if (course.courseRatings.length === 0) {
            return 0;
        }

        let totalRating = 0;
        course.courseRatings.forEach(rating => {
            totalRating += rating.rating;
        });

        return totalRating / course.courseRatings.length;
    };

    // function to calculate course chapter time
    const calculateChapterTime = (chapter) => {
        let time = 0;
        chapter.chapterContent.map((lecture) => time += lecture.lectureDuration);

        return humanizeDuration(time * 60 * 1000, { units: ["h", "m"] });
    };

    // function to calculate course duration
    const calculateCourseDuration = (course) => {
        let time = 0;
        course.courseContent.map((chapter) => chapter.chapterContent.map((lecture) => time += lecture.lectureDuration));
        return humanizeDuration(time * 60 * 1000, { units: ["h", "m"] });
    }

    // function calculate to no of lecture in the course
    const calculateNoOfLectures = (course) => {
        let totalLecture = 0;

        course.courseContent.forEach(chapter => {
            if (Array.isArray(chapter.chapterContent)) {
                totalLecture += chapter.chapterContent.length;
            }
        });

        return totalLecture;
    }

    useEffect(() => {
        fetchAllCourses();
        fetchAllTestimonials();
    }, []);

    const value = {
        currency, allCourses, navigate, calculationRating,
        isEducator, setIsEducator, allTestimonials, calculateChapterTime,
        calculateCourseDuration, calculateNoOfLectures
    };

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
};