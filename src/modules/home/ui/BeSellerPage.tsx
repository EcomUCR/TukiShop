import Footer from "../../../components/layout/Footer";
import NavBar from "../../../components/layout/NavBar";
import character from "../../../img/resources/caja.png";
import { useNavigate } from "react-router-dom";
import BannerComponent from "../../../components/data-display/BannerComponent";

export default function BeSellerPage() {
    const navigate = useNavigate();
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

                <section className="flex flex-col justify-center items-center text-center w-full sm:w-3/4 lg:w-2/4 mx-auto pb-10 px-3 font-quicksand text-gray-800 leading-relaxed">
                    <p className="text-sm sm:text-2xl">
                        ¿Qué esperas para tener tu propia tienda virtual y llegar a más de{" "}
                        <span className="font-semibold text-main">5.000.000 de ticos</span>?
                        Ofrece tus productos, expande tu alcance y comienza a vender en todo
                        el territorio costarricense. ¡Únete a <span className="text-contrast-secondary font-semibold">TukiShop</span> hoy mismo!
                    </p>
                </section>

                <section className="w-full max-w-4xl mx-auto px-6 py-14">
                    <h2 className="text-3xl font-semibold text-center mb-8 text-purple-main">
                        Requisitos para vender en TukiShop
                    </h2>

                    <div className="bg-gradient-to-br from-contrast-main via-contrast-secondary to-main p-[2px] rounded-2xl ">
                        <ul className="space-y-4 text-base sm:text-lg list-disc list-inside bg-white-main p-8 rounded-2xl">
                            <li>Tener cédula jurídica o física costarricense vigente.</li>
                            <li>Contar con una cuenta bancaria nacional para recibir pagos.</li>
                            <li>Proveer información verídica sobre tu negocio y productos.</li>
                            <li>Aceptar los términos y condiciones de venta en línea.</li>
                        </ul>
                    </div>
                </section>


                <section className="w-full py-16 bg-gradient-to-br from-contrast-main via-contrast-secondary to-main rounded-2xl text-white shadow-lg">
                    <h2 className="text-3xl font-semibold text-center mb-10 drop-shadow-lg">
                        ¿Cómo empezar a vender?
                    </h2>

                    <div className="grid sm:grid-cols-3 gap-8 max-w-6xl mx-auto px-6">

                        <div className="flex flex-col items-center text-center p-8 bg-white-main text-gray-main rounded-2xl  transition transform hover:-translate-y-1">
                            <div className="w-14 h-14 flex items-center justify-center bg-purple-main text-white text-lg font-bold rounded-full mb-4 shadow-md">
                                1
                            </div>
                            <h3 className="text-xl font-semibold text-purple-main mb-2">Regístrate</h3>
                            <p className="text-gray-600">Crea tu cuenta de vendedor.</p>
                        </div>


                        <div className="flex flex-col items-center text-center p-8 bg-white-main text-gray-main rounded-2xl shadow-md hover:shadow-2xl transition transform hover:-translate-y-1">
                            <div className="w-14 h-14 flex items-center justify-center bg-purple-main text-white text-lg font-bold rounded-full mb-4 shadow-md">
                                2
                            </div>
                            <h3 className="text-xl font-semibold text-purple-main mb-2">
                                Publica tus productos
                            </h3>
                            <p className="text-gray-600">
                                Agrega tus productos con descripciones, fotos, precios y stock.
                            </p>
                        </div>


                        <div className="flex flex-col items-center text-center p-8 bg-white-main text-gray-main rounded-2xl shadow-md hover:shadow-2xl transition transform hover:-translate-y-1">
                            <div className="w-14 h-14 flex items-center justify-center bg-purple-main text-white text-lg font-bold rounded-full mb-4 shadow-md">
                                3
                            </div>
                            <h3 className="text-xl font-semibold text-purple-main mb-2">
                                Comienza a vender
                            </h3>
                            <p className="text-gray-600">
                                Recibe pedidos y haz crecer tu negocio.
                            </p>
                        </div>
                    </div>
                </section>


                <section className="w-full py-16">
                    <h2 className="text-3xl font-semibold text-center text-purple-main mb-10">
                        Beneficios de vender con nosotros
                    </h2>

                    <div className="grid sm:grid-cols-3 gap-8 max-w-6xl mx-auto px-6">
                        <div className="p-[2px] rounded-2xl bg-gradient-to-br from-contrast-main via-contrast-secondary to-main">
                            <div className="p-8 bg-white-main rounded-2xl  text-center  transition">
                                <h3 className="font-semibold text-lg text-purple-main mb-2">
                                    Mayor visibilidad
                                </h3>
                                <p className="text-gray-600">
                                    Llega a miles de clientes en todo Costa Rica.
                                </p>
                            </div>
                        </div>

                        <div className="p-[2px] rounded-2xl bg-gradient-to-br from-contrast-main via-contrast-secondary to-main">
                            <div className="p-8 bg-white-main rounded-2xl  text-center  transition">
                                <h3 className="font-semibold text-lg text-purple-main mb-2">
                                    Personalización avanzada
                                </h3>
                                <p className="text-gray-600">
                                    Personaliza tu tienda con tus propios colores, imágenes y estilo.
                                </p>
                            </div>
                        </div>

                        <div className="p-[2px] rounded-2xl bg-gradient-to-br from-contrast-main via-contrast-secondary to-main">
                            <div className="p-8 bg-white-main rounded-2xl  text-center  transition">
                                <h3 className="font-semibold text-lg text-purple-main mb-2">
                                    Soporte dedicado
                                </h3>
                                <p className="text-gray-600">
                                    Nuestro equipo te acompaña en cada paso del proceso.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>


                <section className="py-16 bg-gradient-to-br from-contrast-main via-contrast-secondary to-main text-white text-center w-full rounded-2xl mb-10 ">
                    <h2 className="text-3xl sm:text-4xl font-semibold mb-4 drop-shadow-md">
                        ¿Listo para empezar?
                    </h2>
                    <p className="text-lg mb-8 max-w-xl mx-auto font-light">
                        Crea tu cuenta hoy mismo y empieza a vender con TukiShop.
                    </p>
                    <button
                        onClick={() => navigate("/registerSeller")}
                        className="cursor-pointer bg-white-main text-purple-main font-semibold py-3 px-8 rounded-full shadow-md  transition transform hover:scale-105"
                    >
                        Registrarse como vendedor
                    </button>
                </section>
            </main>

            <Footer />
        </div>
    );
}
