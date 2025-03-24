const LayoutPage = ({ children }) => {
    return (
        <div className="flex flex-col min-h-svh bg-white font-poppins">
            <main className="flex flex-col flex-1 container max-w-[960px]">
                {children}
            </main>
        </div>
    )
}

export default LayoutPage;