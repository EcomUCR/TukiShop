import { useEffect } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../../components/ui/accordion";
import NavBar from "../../../components/layout/NavBar";
import Footer from "../../../components/layout/Footer";

export default function HelpPage() {
  useEffect(() => {
    document.title = "Centro de Ayuda | TukiShop";
  }, []);

  const faqs = [
    {
      question: "¿Qué es TukiShop?",
      answer:
        "TukiShop es una plataforma creada para conectar a usuarios con tiendas locales y emprendedores. Ofrecemos un espacio moderno, seguro y fácil de usar para explorar, comprar y vender productos únicos.",
    },
    {
      question: "¿Cómo puedo registrarme como vendedor?",
      answer:
        "En la barra de navegación, selecciona la opción 'Vender' y completa el formulario con la información de tu tienda. Una vez verificada, podrás comenzar a subir tus productos.",
    },
    {
      question: "¿Cómo realizo una compra?",
      answer:
        "Simplemente navega por las categorías, selecciona un producto y agrégalo al carrito. Luego sigue los pasos del proceso de pago para completar tu compra de manera segura.",
    },
    {
      question: "¿Qué métodos de pago aceptan?",
      answer:
        "Actualmente aceptamos pagos con tarjetas de crédito y débito, transferencias bancarias y métodos digitales seleccionados por TukiShop.",
    },
    {
      question: "¿Cómo puedo contactar al soporte?",
      answer:
        "Puedes comunicarte con nuestro equipo a través del formulario de contacto o mediante nuestro correo de soporte: ecomucr2025@gmail.com. También atendemos consultas por WhatsApp durante horarios laborales.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col font-quicksand bg-gradient-to-b from-light-gray to-white overflow-visible">
      <NavBar />

      {/* Hero */}
      <section className="text-center py-20 bg-gradient-to-br from-contrast-main via-contrast-secondary to-main text-white">
        <h1 className="text-4xl md:text-5xl font-bold mb-3">
          Centro de Ayuda
        </h1>
        <p className="max-w-2xl mx-auto text-white/90">
          Encuentra respuestas a las preguntas más frecuentes sobre TukiShop.
        </p>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-6 md:px-16 max-w-4xl mx-auto w-full flex-grow">
        <h2 className="text-3xl font-bold text-center mb-10 text-gray-main">
          Preguntas Frecuentes
        </h2>

        <Accordion type="single" collapsible className="w-full space-y-3">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="border border-gray-200 rounded-xl px-4"
            >
              <AccordionTrigger className="text-left text-lg font-medium hover:text-main transition-all duration-200">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-gray-main text-base leading-relaxed pb-6">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      <Footer />
    </div>
  );
}
