import { motion } from "framer-motion";
import { IconHeart, IconTarget, IconUsers } from "@tabler/icons-react";
import NavBar from "../../../components/layout/NavBar";
import Footer from "../../../components/layout/Footer";

export default function AboutUs() {
  const teamMember = [
    { name: "Raul", role: "Designer & FullStack Developer" },
    { name: "John", role: "FullStack Developer" },
    { name: "Alejandro", role: "CEO" },
    { name: "Kristen", role: "Designer & FrontEnd Developer" },
    { name: "Andres", role: "QA & Backend Developer" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-light-gray to-white ">
      <NavBar />

      {/* Hero Section */}
      <section className="text-center py-20 bg-gradient-to-br from-contrast-main via-contrast-secondary to-main text-white font-quicksand ">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-bold mb-4"
        >
          Conoce a <span className="font-fugaz">TukiShop </span>
        </motion.h1>
        <p className="max-w-2xl mx-auto text-lg text-white/90">
          Somos un equipo apasionado por la tecnología, el diseño y la
          experiencia del usuario. Creamos TukiShop para conectar a las
          personas con productos únicos de tiendas locales y emprendedores.
        </p>
      </section>

      <section className="py-16 px-6 md:px-16 grid md:grid-cols-3 gap-10 text-center font-quicksand mx-auto max-w-[80rem]">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white shadow-md rounded-2xl p-8 border border-gray-100"
        >
          <IconTarget className="w-10 h-10 text-main mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2 text-gray-800">
            Nuestra Misión
          </h3>
          <p className="text-gray-600">
            Simplificar el comercio digital y ayudar a las pequeñas tiendas a
            crecer en el mundo online con herramientas accesibles y efectivas.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white shadow-md rounded-2xl p-8 border border-gray-100"
        >
          <IconHeart className="w-10 h-10 text-contrast-main mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2 text-gray-800">
            Nuestra Visión
          </h3>
          <p className="text-gray-600">
            Convertirnos en la plataforma favorita de venta en línea para
            emprendedores, destacando por confianza, diseño y cercanía.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="bg-white shadow-md rounded-2xl p-8 border border-gray-100"
        >
          <IconUsers className="w-10 h-10 text-contrast-secondary mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2 text-gray-800">
            Lo que Nos Mueve
          </h3>
          <p className="text-gray-600">
            La innovación, la colaboración y la pasión por ofrecer experiencias
            digitales memorables tanto para tiendas como para compradores.
          </p>
        </motion.div>
      </section>

      {/* Team Section */}
      <section className="bg-light-gray py-20 px-6 md:px-16 font-quicksand">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold text-center mb-10 text-gray-800"
        >
          Nuestro Equipo
        </motion.h2>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 max-w-6xl mx-auto">
          {teamMember.map((teamMember, i) => (
            <motion.div
              key={teamMember.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white shadow-md rounded-xl p-6 flex flex-col items-center border border-gray-100 hover:shadow-lg transition-all duration-300"
            >
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-contrast-main to-contrast-secondary flex items-center justify-center text-3xl font-bold text-white mb-4">
                {teamMember.name[0]}
              </div>
              <h4 className="text-lg font-semibold text-gray-800">
                {teamMember.name}
              </h4>
              <p className="text-gray-500 text-sm text-center">{teamMember.role}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
