import CameraErrorMessage from "../fragments/Message";

const CameraErrorOverlay = ({ errorType, onRetry, loading }) => {
    return (
        <div className="absolute inset-0 bg-gray-200 flex items-center justify-center z-20">
            {loading && !errorType ? (
                <div className="text-center px-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-2"></div>
                    <p className="text-black font-medium">Memuat sistem...</p>
                </div>
            ) : (
                <CameraErrorMessage errorType={errorType} onRetry={onRetry} />
            )}
        </div>
    );
};

export default CameraErrorOverlay;