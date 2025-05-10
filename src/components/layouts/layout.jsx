import FooterPage from "../fragments/Footer";
import NavbarLinks from "../fragments/Navbar";

const LayoutPage = ({ children }) => {
    return (
        <div className="flex flex-col min-h-svh bg-white font-poppins">
            <NavbarLinks />
            <main className="flex flex-col flex-1 container max-w-[960px]">
                {children}
            </main>
            <FooterPage />
        </div>
    )
}

export default LayoutPage;