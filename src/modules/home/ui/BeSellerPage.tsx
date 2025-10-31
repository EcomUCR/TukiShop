import Footer from "../../../components/layout/Footer";
import NavBar from "../../../components/layout/NavBar";
import character from "../../../img/resources/caja.png";
import BannerComponent from "../../../components/data-display/BannerComponent";

export default function BeSellerPage() {
    return (
        <div className="min-h-screen flex flex-col bg-white">
            <NavBar />
            <main className="mx-auto w-full max-w-[80rem] flex flex-col items-center justify-center px-4 sm:px-8">
               <BannerComponent
                    type="LARGE"
                    image="https://res.cloudinary.com/dpbghs8ep/image/upload/v1761936416/fondoNegro_pxlaji.png"
                    title="Crea una cuenta de vendedor en TukiShop"
                    btn_color="GRADIENTE"
                    btn_text="Registrarse"
                    character={character}
                    link="sdasda"
                />
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
