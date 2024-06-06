import React, { useState } from 'react';
import '../css/Banner.css';
import imageUrl from "../images/Groepsfoto.jpg";

const Banner = () => {
    const [showModal, setShowModal] = useState(false);

    const handleClick = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    return (
        <div className='Header'>
            <img className="image" src={imageUrl} alt="Banner" onClick={handleClick} />

            {showModal && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={handleCloseModal}>
                            &times;
                        </span>
                        <img src={imageUrl} alt="Modal" />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Banner;