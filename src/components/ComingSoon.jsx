import Image from "next/image";

export default function ComingSoon() {
    return (
        <div className="w-full h-screen bg-black">
            <div
                className="w-full h-screen  bg-cover bg-no-repeat flex items-center "
                style={{ backgroundImage: "url('/bgHome.svg')" }}
            >
                <div className="h-[95%] justify-between w-full flex items-center flex-col ">
                    <div className="w-full flex  justify-center h-[80px]">
                        <Image src="/eevalogo.svg" width={262} height={31} alt="logoEEva" />
                    </div>
                    <div className="h-[211px] w-[580px]  flex items-center">
                        <div className=" w-full h-[90%] flex flex-col text-[#F9F9F9] justify-around items-center">
                            <h3>COMING SOON</h3>
                            <p>07 | 03 | 25</p>
                            <p>BE THE FIRST TO KNOW WHEN WE GO LIVE</p>
                            <div className="w-full flex">
                                <input
                                    type="text"
                                    className="h-[48px] rounded-l-md w-[80%] bg-white bg-opacity-20 text-white placeholder-gray-300 
               backdrop-blur-md  px-4"
                                    placeholder="Enter your email address"
                                />
                                <button
                                    className="h-[48px] w-[15%] bg-[#DFDFDF] rounded-r-md text-black 
               "
                                >
                                    Notify me
                                </button>
                            </div>

                        </div>
                    </div>
                    <div className="h-[200px] w-full  flex justify-center">
                        <div className="flex w-[1342px] justify-between items-center text-[#F9F9F9]">
                            <div>
                                <Image src={"/e.svg"} width={143} height={89} alt="eevaLogo" /></div>
                            <div className="w-[573px] flex justify-around">
                                <p>INSTAGRAM</p>
                                <p>TIKTOK</p>
                                <p>FACEBOOK</p>
                            </div>
                            <div>
                                <p>© 2025 EEVA STUDIOS</p>
                            </div>
                        </div>
                    </div>
                </div>



            </div>
        </div>
    );
}

