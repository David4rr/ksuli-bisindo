import { useEffect, useState } from "react";
import CardList from "../components/fragments/Card";
import LayoutPage from "../components/layouts/layout";
import cards from "../data/cards.json";

const KosaKatapage = () => {
    const [selectedCard, setSelectedCard] = useState(null);

    useEffect(() => {
        if (selectedCard) {
            const element = document.getElementById("selectedCard");
            if (element) {
                element.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        }
    }, [selectedCard]);


    return (
        <LayoutPage>
            <div className="flex flex-col py-4">
                <h1
                    id="selectedCard"
                    className="text-lg font-bold text-black pt-2 lg:pt-10">Kosa Kata</h1>
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
                    <h1 className="text-xl font-bold text-primary">
                        {selectedCard.title}
                    </h1>
                    <div className="flex flex-col md:flex-row lg:flex-row gap-4 lg:items-start mt-4">
                        <img
                            className="w-auto h-auto object-cover rounded-lg"
                            src={selectedCard.image}
                            alt={selectedCard.title}
                        />
                        <div className="flex flex-col">
                            <h3 className="text-xl font-bold text-accent">Keterangan :</h3>
                            <p className="mt-4 text-gray-700">{selectedCard.description}</p>
                        </div>
                    </div>
                </div>
            )}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 items-center justify-center text-center">
                {cards
                    .filter((card) => card.id !== (selectedCard?.id || null))
                    .map((card) => (
                        <CardList
                            key={card.id}
                            title={card.title}
                            image={card.image}
                            onClick={() => setSelectedCard(card)}
                        />
                    ))}
            </div>
        </LayoutPage>
    );
};

export default KosaKatapage;
