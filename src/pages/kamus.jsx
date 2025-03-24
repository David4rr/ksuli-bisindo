import Button from "../../../learning-react2/src/Components/Elements/Button";
import LayoutPage from "../components/layouts/layout";
import { useNavigate } from "react-router-dom";

const KamusPage = () => {

    const navigate = useNavigate();
    const handleButton = () => {
        navigate('/');
    };
    return (
        <LayoutPage>
            <div className="flex flex-col py-4">
                <h1 className="text-black">Ini Halaman Kamus</h1>
                <Button classname="bg-blue-600 w-full mb-1" type="button" onClick={handleButton} >Home</Button>
            </div>
            <div className="flex flex-col items-center justify-center">
                <img src="/assets/images/maintenance.svg" alt="image" width={400} height={400} />
                <h1 className="text-black">Halaman masih dalam perbaikan</h1>
            </div>

        </LayoutPage>
    )
}

export default KamusPage;