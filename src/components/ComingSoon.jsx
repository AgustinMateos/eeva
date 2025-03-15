import Image from "next/image";

export default function ComingSoon() {
    return (
        <div className="w-full min-h-screen">
            <div
                className="w-full h-[100vh] bg-cover bg-no-repeat flex items-center bg-center md:bg-top"
                style={{ backgroundImage: "url('/bgHome.svg')" }}
            >
                <div className="flex flex-col items-center justify-between w-full h-full py-6 md:py-12">
                    {/* Logo superior */}
                    <div className="w-full flex justify-center h-16 md:h-20">
                        <Image
                            src="/LogoFullEEVA.svg"
                            width={262}
                            height={31}
                            alt="logoEEva"
                            className="w-64 h-auto"
                        />
                    </div>

                    {/* Sección central (Coming Soon) */}
                    <div className="flex items-center w-full max-w-md px-4 sm:max-w-lg md:max-w-xl lg:max-w-2xl">
                        <div className="w-full flex flex-col text-[#F9F9F9] justify-around items-center space-y-6 md:space-y-8">
                            <h3 className="text-xl md:text-3xl font-bold">COMING SOON</h3>
                            <p className="text-lg md:text-2xl">07 | 03 | 25</p>
                            <p className="text-sm md:text-base text-center">
                                BE THE FIRST TO KNOW WHEN WE GO LIVE
                            </p>
                            <div className="w-full flex flex-col sm:flex-row gap-2 sm:gap-0">
                                <input
                                    type="text"
                                    className="h-12 rounded-l-md rounded-r-md sm:rounded-r-none w-full sm:w-4/5 bg-white bg-opacity-20 text-white placeholder-gray-300 backdrop-blur-md px-4 text-sm md:text-base focus:outline-none border border-[#DFDFDF]"
                                    placeholder="Enter your email address"
                                />
                                <button className="h-12 w-full sm:w-1/5 bg-[#DFDFDF] rounded-r-md rounded-l-md sm:rounded-l-none text-black text-sm md:text-base">
                                    Notify me
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="w-full flex flex-col items-center justify-center px-4 space-y-6 md:space-y-8">
                        {/* Sección de logos y redes sociales (desktop y móvil) */}
                        <div className="w-full max-w-5xl flex flex-col md:flex-row justify-between items-center text-[#F9F9F9] space-y-4 md:space-y-0">
                            {/* Logos (e2.svg) */}
                            <div className="justify-center order-2 md:order-1 md:block hidden">
                                <Image
                                    src="/e2.svg"
                                    width={143}
                                    height={89}
                                    alt="eevaLogo"
                                    className="w-auto h-12 md:h-16"
                                />
                            </div>

                            {/* Redes sociales */}
                            <div className="flex flex-wrap justify-center md:justify-around w-full md:w-auto gap-4 md:gap-8 text-sm md:text-base order-1 md:order-2">
                                {/* Instagram */}
                                <div className="flex items-center">
                                    <p className="pr-[40px] block md:hidden">IG</p>
                                    <p className="pr-[40px] hidden md:block">INSTAGRAM</p>
                                    <Image src="/x.svg" width={11} height={18} alt="cross" />
                                </div>
                                {/* TikTok */}
                                <div className="flex items-center">
                                    <p className="pr-[40px] block md:hidden">TK</p>
                                    <p className="pr-[40px] hidden md:block">TIKTOK</p>
                                    <Image src="/x.svg" width={11} height={18} alt="cross" />
                                </div>
                                {/* Facebook */}
                                <div className="flex items-center">
                                    <p className="block md:hidden">FB</p>
                                    <p className="hidden md:block">FACEBOOK</p>
                                </div>
                            </div>

                            {/* Copyright */}
                            <div className="text-center md:text-right order-3 md:order-3 md:block hidden">
                                <p className="text-sm md:text-base">© 2025 EEVA STUDIOS</p>
                            </div>
                        </div>

                        {/* Políticas y términos */}
                        <div className="w-full flex justify-center">
                            <div className="flex flex-col md:flex-row justify-center w-full max-w-md md:max-w-lg lg:max-w-2xl gap-4 md:gap-8 text-[#F9F9F9] text-sm md:text-base">
                                <p>Políticas de Privacidad</p>
                                <p>Términos de Servicio</p>
                                <p>Cookie Settings</p>
                            </div>
                        </div>

                        {/* Sección adicional solo para móvil: e2.svg y © 2025 EEVA STUDIOS debajo de políticas */}
                        <div className="block md:hidden w-full justify-center">
                            <div className="flex flex-row items-center justify-between w-full max-w-md gap-4 text-[#F9F9F9] text-sm">
                                <p>© 2025 EEVA STUDIOS</p>
                                <Image
                                    src="/e2.svg"
                                    width={143}
                                    height={89}
                                    alt="eevaLogo"
                                    className="w-auto h-12"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}