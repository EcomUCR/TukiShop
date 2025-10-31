import { useState, useEffect } from "react";
import AdminSupportCard from "./components/AdminSupportCard";

export default function AdminSupportList() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 🔹 Simulación de datos
    setTimeout(() => {
      setReports([
        {
          id: 1,
          name: "Carlos Jiménez",
          email: "carlos.j@example.com",
          order_number: "#ORD-2025",
          subject: "Problema con mi pedido",
          description: "El pedido llegó incompleto, faltan dos productos.",
          images: [
            "https://via.placeholder.com/150",
            "https://via.placeholder.com/150",
          ],
          created_at: "2025-10-31T10:00:00Z",
          status: "PENDING",
        },
        {
          id: 2,
          name: "Ana Torres",
          email: "ana.t@example.com",
          order_number: "",
          subject: "Error en el pago",
          description:
            "Mi tarjeta fue cobrada dos veces al realizar la compra. Necesito ayuda urgente.",
          images: [],
          created_at: "2025-10-30T12:30:00Z",
          status: "PENDING",
        },
      ]);
      setLoading(false);
    }, 800);
  }, []);

  return (
    <section className="pl-2 sm:pl-4 font-quicksand">
      <div className="pl-0 sm:pl-5">
        <div className="pb-6 sm:pb-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
          <h1 className="text-lg sm:text-2xl border-b-3 border-main w-fit">
            Centro de soporte
          </h1>
          <p className="text-sm text-gray-600 sm:ml-3">
            {reports.filter((r) => r.status === "PENDING").length} pendientes
          </p>
        </div>
      </div>

      {loading ? (
        <p className="text-gray-400 text-sm text-center py-6">Cargando...</p>
      ) : reports.length === 0 ? (
        <p className="text-gray-500 text-sm text-center py-6">
          No hay reportes por el momento.
        </p>
      ) : (
        <div className="flex flex-col gap-4 sm:gap-6">
          {[...reports]
            .sort((a) => (a.status === "PENDING" ? -1 : 1)) // 🔹 Limpio: sin variable b
            .map((report) => (
              <AdminSupportCard
                key={report.id}
                {...report}
                onMarkResolved={() => {
                  setReports((prev) =>
                    prev.map((r) =>
                      r.id === report.id ? { ...r, status: "RESOLVED" } : r
                    )
                  );
                }}
              />
            ))}
        </div>
      )}
    </section>
  );
}
