import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLightbulb, faBook, faGraduationCap, faCommentDots } from "@fortawesome/free-solid-svg-icons";

export default function Suggestion() {
    const [field, setField] = useState("");
    const [course, setCourse] = useState("");
    const [subject, setSubject] = useState("");
    const [customField, setCustomField] = useState("");
    const [customCourse, setCustomCourse] = useState("");
    const [customSubject, setCustomSubject] = useState("");
    const [suggestion, setSuggestion] = useState("");
    const [errors, setErrors] = useState({});

    const validateForm = () => {
        const newErrors = {};
        if (!field) newErrors.field = 'Field is required';
        if (!suggestion) newErrors.suggestion = 'Suggestion is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        const submissionData = {
            field: field === "custom" ? customField : field,
            course: course === "custom" ? customCourse : course,
            subject: subject === "custom" ? customSubject : subject,
            suggestion
        };
        console.log('Suggestion submitted:', submissionData);
        // Reset form
        setField("");
        setCourse("");
        setSubject("");
        setCustomField("");
        setCustomCourse("");
        setCustomSubject("");
        setSuggestion("");
        setErrors({});
    };

    return (
        <div className="bg-gray-100 min-h-screen flex flex-col items-center py-25 px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 text-center mb-6 sm:mb-8">
                Submit a Suggestion
            </h1>
            <p className="text-base sm:text-lg text-gray-600 text-center mb-8 sm:mb-12">Help us improve by sharing your thoughts!</p>
            <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-2xl">
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-gray-700 font-semibold">
                            <FontAwesomeIcon icon={faBook} className="text-blue-500 mr-2" />
                            Field
                        </label>
                        <select className={`w-full mt-2 p-3 border rounded min-h-[48px] touch-manipulation ${errors.field ? 'border-red-500' : ''}`} value={field} onChange={(e) => setField(e.target.value)}>
                            <option value="">Select a field</option>
                            <option value="Engineering and Technology">Engineering and Technology</option>
                            <option value="custom">Custom</option>
                        </select>
                        {errors.field && (
                            <p className="mt-1 text-red-500 text-sm">
                                {errors.field}
                            </p>
                        )}
                        {field === "custom" && <input type="text" placeholder="Enter custom field" className="w-full mt-2 p-3 border rounded min-h-[48px] touch-manipulation" value={customField} onChange={(e) => setCustomField(e.target.value)} />}
                    </div>

                    <div>
                        <label className="block text-gray-700 font-semibold">
                            <FontAwesomeIcon icon={faGraduationCap} className="text-green-500 mr-2" />
                            Course
                        </label>
                        <select className="w-full mt-2 p-3 border rounded min-h-[48px] touch-manipulation" value={course} onChange={(e) => setCourse(e.target.value)}>
                            <option value="">Select a course</option>
                            <option value="Full Stack Development">Full Stack Development</option>
                            <option value="custom">Custom</option>
                        </select>
                        {course === "custom" && <input type="text" placeholder="Enter custom course" className="w-full mt-2 p-3 border rounded min-h-[48px] touch-manipulation" value={customCourse} onChange={(e) => setCustomCourse(e.target.value)} />}
                    </div>

                    <div>
                        <label className="block text-gray-700 font-semibold">
                            <FontAwesomeIcon icon={faCommentDots} className="text-purple-500 mr-2" />
                            Subject
                        </label>
                        <select className="w-full mt-2 p-3 border rounded min-h-[48px] touch-manipulation" value={subject} onChange={(e) => setSubject(e.target.value)}>
                            <option value="">Select a subject</option>
                            <option value="custom">Custom</option>
                        </select>
                        {subject === "custom" && <input type="text" placeholder="Enter custom subject" className="w-full mt-2 p-3 border rounded min-h-[48px] touch-manipulation" value={customSubject} onChange={(e) => setCustomSubject(e.target.value)} />}
                    </div>

                    <div>
                        <label className="block text-gray-700 font-semibold">
                            <FontAwesomeIcon icon={faLightbulb} className="text-yellow-500 mr-2" />
                            Suggestion
                        </label>
                        <textarea 
                            className={`w-full mt-2 p-3 border rounded min-h-[48px] touch-manipulation ${errors.suggestion ? 'border-red-500' : ''}`} 
                            placeholder="Suggestions" 
                            value={suggestion} 
                            onChange={(e) => setSuggestion(e.target.value)}
                        ></textarea>
                        {errors.suggestion && (
                            <p className="mt-1 text-red-500 text-sm">
                                {errors.suggestion}
                            </p>
                        )}
                    </div>

                    <button 
                        type="submit" 
                        className="bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white font-semibold 
                        py-4 px-6 rounded-lg w-full transition min-h-[48px] touch-manipulation"
                    >
                        Submit
                    </button>
                </form>
            </div>
        </div>
    );
}
