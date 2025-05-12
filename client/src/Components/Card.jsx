import React, {useState} from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Card = ({ title, description, icon, to, opacity }) => {
    const [isFollowed, setIsFollowed] = useState(false);
    const handleFollow = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsFollowed(!isFollowed);
    };
    return (
        <div className="relative w-full">
            <Link to={to} className="w-full">
                <div
                    className="bg-white shadow-md border-t-4 border-blue-400 rounded-lg p-6 flex flex-col items-center transform transition-transform duration-300 hover:scale-105 cursor-pointer"
                >
                    <FontAwesomeIcon icon={icon} className="text-4xl text-blue-500 mb-4" />
                    <h3 className="mt-4 text-xl font-bold text-center">{title}</h3>
                    <p className="text-gray-600 text-center mt-2 mb-4">{description}</p>
                    <button
                        onClick={handleFollow}
                        className={`w-full mt-4 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 opacity-${opacity}
                            ${isFollowed
                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                            : 'bg-blue-500 text-white hover:bg-blue-600'}`}
                    >
                        {isFollowed ? 'Followed' : 'Follow'}
                    </button>
                </div>
            </Link>
        </div>
    );
};

export default Card;

