import { createContext, useEffect, useState } from "react";
import { dummyCourses, dummyTestimonial } from "../assets/assets";
import { useNavigate } from "react-router-dom";

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
    }

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
    }

    // fell all testimonials
    const fetchAllTestimonials = async () => {
        setAllTestimonials(dummyTestimonial);
    }

    useEffect(() => {
        fetchAllCourses();
        fetchAllTestimonials();
    }, []);

    const value = {
        currency, allCourses, navigate, calculationRating,
        isEducator, setIsEducator, allTestimonials
    };

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
};