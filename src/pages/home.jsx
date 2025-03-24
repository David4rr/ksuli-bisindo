import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import LayoutPage from "../components/layouts/layout";
import Button from "../../../learning-react2/src/Components/Elements/Button";

const HomePage = () => {
    const [loadCamera, setLoadCamera] = useState(false);
    const videoRef = useRef(null);

    const startWebcam = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,

            });

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }

            //   setLoadCamera(true);
        } catch (error) {
            console.error("Error accessing webcam:", error);
        }
    };


    useEffect(() => {
        startWebcam();
        setLoadCamera(true);
    }, []);

    const navigate = useNavigate();
    const handleKamus = () => {
        navigate('/kamus');
    };

    return (
        <LayoutPage>
            <div className="flex flex-col flex-1 py-4">
                <h1 className="text-black">Ini Halaman Home</h1>
                <Button classname="bg-blue-600 w-full mb-1" type="button" onClick={handleKamus} >Kamus</Button>
                {loadCamera ? (
                    <div className="rounded-md overflow-hidden relative">
                        <video
                            ref={videoRef}
                            className="w-full max-h-[80svh] object-cover"
                            autoPlay
                            playsInline
                            muted />
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center flex-1">
                        <div className="loader"></div>
                        <p className="mt-4 text-lg text-gray-700">Loading...</p>
                    </div>
                )}
            </div>
        </LayoutPage>
    );
};

export default HomePage;
