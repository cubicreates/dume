import React, { useState, useEffect } from "react";
import { FaTimes, FaLinkedin } from "react-icons/fa";
import Slider from "react-slick";
import SubhrajeetImg from '../../assets/images/Subhrajeet.jpg';
import HarshImg from '../../assets/images/Harsh.jpg';
import "../css/Index.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const people = {
    developers: [
        { name: "Adit Ghosh", designation: "Team Lead, React Integrator and Backend Developer", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSKdftMTz2woyGr0rwkw95l13jojCjgmCztYg&s", description: "A passionate developer leading the integration and backend architecture of the project.", linkedin: "https://www.linkedin.com/in/adit-ghosh-9b4723326/" },
        { name: "Subhrajeet Dash", designation: "Senior Frontend Developer", img: SubhrajeetImg, description: "Ensuring seamless frontend experience and implementing UI enhancements.", linkedin: "https://www.linkedin.com/in/subhrajeet-dash-9a449831b/" },
        { name: "Manju", designation: "Frontend Developer", img: "https://agropack-expo.com/source/wp-content/uploads/2015/04/speaker-1-v2.jpg", description: "Working on optimizing UI components and responsiveness.", linkedin: "https://www.linkedin.com/in/manju/" },
        { name: "Harsh Panchal", designation: "UI Designer", img: HarshImg, description: "Creating modern and user-friendly designs for the platform.", linkedin: "https://www.linkedin.com/in/harsh-panchal/" }
    ],
    specialMentions: [
        { name: "Dr. Surabhi Shanker", designation: "Assistant Professor, K.R. Mangalam University, Internal Mentor for the Project", img: "https://shorturl.at/0usU1", description: "Guiding the project with valuable academic insights.", linkedin: "https://www.linkedin.com/in/dr-surabhi-shanker-22b53011/" },
        { name: "Ms. Shayani Sharma", designation: "Xebia, External Mentor for the project", img: "https://agropack-expo.com/source/wp-content/uploads/2015/04/speaker-1-v2.jpg", description: "Providing industry-level mentorship and technical expertise.", linkedin: "https://www.linkedin.com/in/shayani-sharma/" }
    ]
};

const PersonCard = React.memo(({ person, onClick }) => (
    <div
        className="bg-white shadow-md rounded-lg p-4 sm:p-6 flex flex-col items-center cursor-pointer 
                   transform transition-transform duration-300 hover:scale-105 mx-2"
        onClick={onClick}
    >
        <img 
            src={person.img} 
            alt={person.name} 
            loading="lazy"
            className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-full border-4 border-blue-500"
        />
        <h3 className="mt-3 sm:mt-4 text-lg sm:text-xl font-bold truncate w-full text-center">
            {person.name}
        </h3>
        <p className="text-blue-500 font-semibold text-sm sm:text-base text-center">
            {person.designation}
        </p>
        <p className="text-gray-600 text-center mt-2 text-sm sm:text-base line-clamp-3">
            {person.description}
        </p>
        <a 
            href={person.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 text-blue-700 flex items-center gap-2 text-sm sm:text-base hover:text-blue-900"
            onClick={e => e.stopPropagation()}
        >
            <FaLinkedin /> LinkedIn
        </a>
    </div>
));

const Modal = React.memo(({ person, onClose }) => (
    <div 
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4 z-50"
        onClick={onClose}
    >
        <div 
            className="bg-white rounded-lg p-6 shadow-lg text-center relative w-full max-w-md"
            onClick={e => e.stopPropagation()}
        >
            <button 
                className="absolute top-2 right-2 text-gray-700 text-2xl hover:text-gray-900" 
                onClick={onClose}
                aria-label="Close modal"
            >
                <FaTimes />
            </button>
            <img 
                src={person.img} 
                alt={person.name} 
                loading="lazy"
                className="w-32 h-32 sm:w-40 sm:h-40 object-cover rounded-lg mx-auto mb-4"
            />
            <h3 className="text-xl sm:text-2xl font-bold">{person.name}</h3>
            <p className="text-blue-500 font-semibold mb-2">{person.designation}</p>
            <p className="text-gray-600 text-sm sm:text-base">{person.description}</p>
            <a 
                href={person.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 text-blue-700 flex items-center justify-center gap-2 hover:text-blue-900"
            >
                <FaLinkedin /> LinkedIn
            </a>
        </div>
    </div>
));

export default function AboutUs() {
    const [selectedPerson, setSelectedPerson] = useState(null);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const sliderSettings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: false,
        responsive: [
            {
                breakpoint: 768,
                settings: {
                    arrows: false,
                    centerMode: true,
                    centerPadding: '20px',
                    slidesToShow: 1
                }
            }
        ]
    };

    const renderContent = (section) => (
        isMobile ? (
            <Slider {...sliderSettings}>
                {people[section].map((person, index) => (
                    <PersonCard 
                        key={index} 
                        person={person} 
                        onClick={() => setSelectedPerson(person)} 
                    />
                ))}
            </Slider>
        ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                {people[section].map((person, index) => (
                    <PersonCard 
                        key={index} 
                        person={person} 
                        onClick={() => setSelectedPerson(person)} 
                    />
                ))}
            </div>
        )
    );

    return (
        <div className="bg-gray-100 min-h-screen py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 text-center mb-12">
                    About Us
                </h1>

                <section className="max-w-4xl text-center mb-16">
                    <h2 className="text-3xl font-semibold text-gray-800 mb-4">About the Website</h2>
                    <p className="text-lg text-gray-600">UniGUIDE is an educational platform aimed at helping students navigate their academic journey with structured guidance and curated resources.</p>
                </section>

                {["developers", "specialMentions"].map((section, idx) => (
                    <section key={idx} className="max-w-6xl w-full text-center mb-16">
                        <h2 className="text-3xl font-semibold text-gray-800 mb-8">
                            {section === "developers" ? "The Developers" : "Special Mentions"}
                        </h2>
                        <div className="w-full">
                            {renderContent(section)}
                        </div>
                    </section>
                ))}

                {selectedPerson && (
                    <Modal 
                        person={selectedPerson} 
                        onClose={() => setSelectedPerson(null)} 
                    />
                )}
            </div>
        </div>
    );
}
