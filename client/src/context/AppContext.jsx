import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import humanizeDuration from "humanize-duration";
import { useAuth, useUser } from '@clerk/clerk-react';
import { toast } from 'react-toastify';
import axios from "axios";

export const AppContext = createContext();

export const AppContextProvider = (props) => {

    const domain = import.meta.env.VITE_BACKEND_URL;
    const currency = import.meta.env.VITE_CURRENCY;

    const navigate = useNavigate();

    const { getToken } = useAuth();
    const { user } = useUser();

    const [userData, setUserData] = useState(null);
    const [allCourses, setAllCourses] = useState([]);
    const [isEducator, setIsEducator] = useState(false);
    const [enrolledCourses, setEnrolledCourses] = useState([]);

    // fell all courses
    const fetchAllCourses = async () => {
        try {
            const { data } = await axios.get(`${domain}/api/course/all`);

            if (data.success) {
                setAllCourses(data.courses);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    // fetch user data
    const fetchUserData = async () => {
        if (user.publicMetadata.role === 'educator') {
            setIsEducator(true);
        }

        try {
            const token = await getToken();

            const response = await axios.get(`${domain}/api/user/data`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.success) {
                setUserData(response.user);
            } else {
                toast.error(response.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
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

        return Math.floor(totalRating / course.courseRatings.length);
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

    // fetch user enrolled courses
    const fetchUserEnrolledCourses = async () => {
        try {
            const token = await getToken();
            const { data } = await axios.get(
                `${domain}/api/user/enrolled-courses`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (data.success) {
                setEnrolledCourses(data.enrolledCourses.reverse());
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    // public
    useEffect(() => {
        fetchAllCourses();
    }, []);

    // protected
    useEffect(() => {
        if (user) {
            fetchUserData();
            fetchUserEnrolledCourses();
        }
    }, [user]);

    const value = {
        currency, allCourses, navigate, calculationRating,
        isEducator, setIsEducator, calculateChapterTime, calculateCourseDuration,
        calculateNoOfLectures, enrolledCourses, fetchUserEnrolledCourses,
        domain, userData, setUserData, getToken, fetchAllCourses,
    };

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
};