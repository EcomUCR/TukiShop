import { Link } from "react-router-dom";
import Footer from "../../../components/layout/Footer";
import NavBar from "../../../components/layout/NavBar";
import logo from "../../../img/resources/Banner2.png";
import ButtonComponent from "../../../components/ui/ButtonComponent";

export default function BeSellerPage() {
    return (
        <div className="min-h-screen flex flex-col bg-white">
            <NavBar />
            <main className="mx-auto w-full max-w-[80rem] flex flex-col items-center justify-center px-4 sm:px-8">
                <section className="relative w-full flex justify-center items-center my-10">
                    <img
                        className="w-full h-36 sm:h-auto rounded-2xl object-cover shadow-lg"
                        src={logo} alt="Banner TucaShop" />
                    <Link to="/registerSeller">
                        <ButtonComponent
                            text="Registrarse"
                            style="bg-contrast-secondary left-4 bottom-4 py-1 text-xs sm:text-lg px-2 w-[30%] cursor-pointer text-white rounded-full sm:py-4 sm:px-4 sm:w-[30%] sm:left-25 sm:bottom-15 font-quicksand absolute hover:bg-gradient-to-br from-contrast-main via-contrast-secondary to-main transition-all duration-400"
                        />
                    </Link>
                </section>
                {/* 🔹 Descripción */}
                <section className="flex flex-col justify-center items-center text-center w-full sm:w-3/4 lg:w-2/4 mx-auto pb-10 px-3 font-quicksand text-gray-800 leading-relaxed">
                    <p className="text-sm sm:text-2xl">
                        ¿Qué esperas para tener tu propia tienda virtual y llegar a más de{" "}
                        <span className="font-semibold text-main">5.000.000 de ticos</span>?
                        Ofrece tus productos, expande tu alcance y comienza a vender en todo
                        el territorio costarricense. ¡Únete a <span className="text-contrast-secondary font-semibold">TukiShop</span> hoy mismo!
                    </p>
                </section>
            </main>

            <Footer />
        </div>
    );
}
