import { useEffect, useState } from "react";
import CardList from "../components/fragments/Card";
import LayoutPage from "../components/layouts/layout";
import cards from "../data/cards.json";

const KosaKatapage = () => {
    const [selectedCard, setSelectedCard] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleClick = async (card) => {
        setIsLoading(true);

        await new Promise(resolve => setTimeout(resolve, 500));

        setSelectedCard(card);
        setIsLoading(false);
    }

    useEffect(() => {
        if (selectedCard) {
            const element = document.getElementById("selectedCard");
            if (element) {
                element.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
            }
        }

        const handleData = () => {
            if (document.visibilityState === "visible" && selectedCard) {
                const videoElement = document.querySelector(`video[key="${selectedCard.id}"]`);
                if (videoElement) {
                    videoElement.load();
                }
            }
        };
        document.addEventListener('visibilitychange', handleData);
        return () => {
            document.removeEventListener('visibilitychange', handleData);
        };

    }, [selectedCard]);

    return (
        <LayoutPage>
            <div className="flex flex-col py-4">
                <h1
                    id="selectedCard"
                    className="text-lg font-bold text-black">Kosa Kata</h1>
                <p className="text-black">
                    Halaman ini berisi kosa kata yang digunakan untuk deteksi
                </p>
            </div>
            {selectedCard && (
                <div
                    className="mb-8 p-4 border rounded shadow relative"
                >
                    <button
                        className="absolute top-2 right-2 bg-gray-300 hover:bg-gray-400 text-black rounded-full w-6 h-6 flex items-center justify-center"
                        onClick={() => setSelectedCard(null)}
                    >
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                            <g
                                id="SVGRepo_tracerCarrier"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            ></g>
                            <g id="SVGRepo_iconCarrier">
                                {" "}
                                <g id="Menu / Close_SM">
                                    {" "}
                                    <path
                                        id="Vector"
                                        d="M16 16L12 12M12 12L8 8M12 12L16 8M12 12L8 16"
                                        stroke="#000000"
                                        stroke-width="2"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                    ></path>{" "}
                                </g>{" "}
                            </g>
                        </svg>
                    </button>
                    {isLoading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                        </div>
                    ) : (
                        <>
                            <h1 className="text-xl font-bold text-primary">
                                {selectedCard.title}
                            </h1>
                            <div className="flex flex-col md:flex-row lg:flex-row gap-4 lg:items-start mt-4">
                                {selectedCard.video ? (
                                    <video
                                        key={selectedCard.id}
                                        className="w-[60svh] h-auto object-cover rounded-lg"
                                        autoPlay
                                        loop
                                        muted
                                        poster={selectedCard.poster}
                                    >
                                        <source src={selectedCard.video} type="video/mp4" />
                                        Your browser does not support the video tag.
                                    </video>

                                ) : (
                                    <img
                                        key={selectedCard.id}
                                        className="w-[60svh] h-auto object-cover rounded-lg"
                                        src={selectedCard.poster}
                                        alt={selectedCard.title}
                                    />
                                )}
                                <div className="flex flex-col">
                                    <h3 className="text-xl font-bold text-accent">Keterangan :</h3>
                                    <p className=" text-gray-700">{selectedCard.description}</p>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            )}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 items-center justify-center text-center mb-3">
                {cards
                    .filter((card) => card.id !== (selectedCard?.id || null))
                    .map((card) => (
                        <CardList 
                            key={card.id}
                            title={card.title}
                            image={card.poster}
                            onClick={() => handleClick(card)}
                        />
                    ))}
            </div>
        </LayoutPage>
    );
};

export default KosaKatapage;
