import CameraErrorIcon from "../elements/cameraErrorIcon/indeks";

const CameraErrorMessage = ({ errorType, onRetry }) => {
    const getMessage = () => {
        switch (errorType) {
            case "permission":
                return {
                    title: "Akses Kamera Dibutuhkan",
                    description: (
                        <>
                            <p className="mb-2">Untuk menggunakan aplikasi ini:</p>
                            <ol className="list-decimal list-inside space-y-1 text-left">
                                <li>Klik ikon kamera di address bar browser Anda</li>
                                <li>Pilih "Izinkan" atau "Allow" untuk akses kamera</li>
                                <li>Setelah mengizinkan, klik tombol di bawah</li>
                            </ol>
                        </>
                    ),
                    buttonText: "Izinkan Kamera",
                    buttonClass: "btn-warning",
                };
            case "holistic":
                return {
                    title: "Gagal menginisialisasi sistem pengenalan gerakan",
                    buttonText: "Coba Lagi",
                    buttonClass: "btn-error",
                };
            case "model":
                return {
                    title: "Gagal memuat model AI. Periksa koneksi internet Anda",
                    buttonText: "Muat Ulang",
                    buttonClass: "btn-error",
                };
            case "generic":
                return {
                    title: "Terjadi kesalahan saat mengakses kamera",
                    buttonText: "Coba Lagi",
                    buttonClass: "btn-error",
                };
            default:
                return {
                    title: "Memuat sistem...",
                };
        }
    };

    const message = getMessage();

    return (
        <div className="text-center px-4">
            <CameraErrorIcon type={errorType} />

            {message.title && (
                <h3 className={`text-lg font-bold mb-2 ${errorType === "permission" ? "text-warning" : "text-black"}`}>
                    {message.title}
                </h3>
            )}

            {message.description && (
                <div className="text-sm text-gray-600 mb-4">
                    {message.description}
                </div>
            )}

            {(errorType && message.buttonText) && (
                <button
                    onClick={onRetry}
                    className={`btn ${message.buttonClass} gap-2`}
                >
                    {errorType === "permission" && (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                        </svg>
                    )}
                    {message.buttonText}
                </button>
            )}
        </div>
    );
};

export default CameraErrorMessage;