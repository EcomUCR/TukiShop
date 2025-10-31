import { useState, useEffect, useMemo } from "react";
import AdminSupportCard from "./components/AdminSupportCard";
import { IconSearch, IconFilter } from "@tabler/icons-react";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "../../../components/ui/pagination";

export default function AdminSupportList() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  useEffect(() => {
    // 🔹 Simulación de datos
    setTimeout(() => {
      setReports([
        {
          id: 1,
          report_number: "REP-2025",
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
          admin_notes:
            "Cliente frecuente, revisar stock del pedido antes de responder.",
          read: false,
        },
        {
          id: 2,
          report_number: "REP-2024",
          name: "Ana Torres",
          email: "ana.t@example.com",
          order_number: "",
          subject: "Error en el pago",
          description:
            "Mi tarjeta fue cobrada dos veces al realizar la compra. Necesito ayuda urgente.",
          images: [],
          created_at: "2025-10-30T12:30:00Z",
          status: "IN_REVIEW",
          admin_notes: "",
          read: false,
        },
        {
          id: 3,
          report_number: "REP-2023",
          name: "Luis Herrera",
          email: "luis.h@example.com",
          subject: "Pedido duplicado",
          description:
            "Recibí dos pedidos iguales, pero solo ordené uno. Quiero devolver el extra.",
          created_at: "2025-10-29T15:00:00Z",
          status: "RESOLVED",
          admin_notes: "Caso cerrado con reembolso parcial.",
          read: true,
        },
        {
          id: 4,
          report_number: "REP-2022",
          name: "Daniela Gómez",
          email: "daniela.g@example.com",
          subject: "Producto defectuoso",
          description:
            "El artículo que recibí no funciona correctamente. Solicito reemplazo.",
          created_at: "2025-10-28T11:00:00Z",
          status: "PENDING",
          admin_notes: "",
          read: false,
        },
        {
          id: 5,
          report_number: "REP-2021",
          name: "Andrés Salazar",
          email: "andres.s@example.com",
          subject: "No recibí mi pedido",
          description: "El pedido no llegó a tiempo, lleva 10 días de retraso.",
          created_at: "2025-10-27T09:30:00Z",
          status: "REJECTED",
          admin_notes: "Cliente informado, pedido entregado después.",
          read: true,
        },
      ]);
      setLoading(false);
    }, 800);
  }, []);

  // 🔹 Actualización desde los hijos
  const handleUpdateReport = (update: {
    id: number;
    status?: string;
    admin_notes?: string;
    read?: boolean;
  }) => {
    setReports((prev) =>
      prev.map((report) =>
        report.id === update.id ? { ...report, ...update } : report
      )
    );
  };

  // 🔹 Filtrado combinado
  const filteredReports = useMemo(() => {
    return reports.filter((r) => {
      const matchesSearch =
        r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.report_number.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "ALL" ? true : r.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [reports, searchTerm, statusFilter]);

  // 🔹 Paginación
  const totalPages = Math.ceil(filteredReports.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedReports = filteredReports.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <section className="pl-2 sm:pl-4 font-quicksand">
      <div className="pl-0 sm:pl-5">
        {/* 🔹 Header */}
        <div className="pb-6 sm:pb-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
          <h1 className="text-lg sm:text-2xl border-b-3 border-main w-fit">
            Centro de soporte
          </h1>
          <p className="text-sm text-gray-600 sm:ml-3">
            {reports.filter((r) => r.status === "PENDING").length} pendientes
          </p>
        </div>

        {/* 🔹 Barra de búsqueda y filtro */}
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between mb-6">
          <div className="relative w-full sm:w-1/2">
            <IconSearch
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Buscar por nombre, correo, reporte o asunto..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // Reinicia la página al buscar
              }}
              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-main/40 bg-white"
            />
          </div>

          <div className="flex items-center gap-2">
            <IconFilter size={18} className="text-gray-500" />
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1); // Reinicia la página al cambiar filtro
              }}
              className="border border-gray-300 rounded-full text-sm px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-main/40"
            >
              <option value="ALL">Todos</option>
              <option value="PENDING">Pendientes</option>
              <option value="IN_REVIEW">En revisión</option>
              <option value="RESOLVED">Resueltos</option>
              <option value="REJECTED">Rechazados</option>
            </select>
          </div>
        </div>
      </div>

      {/* 🔹 Contenido dinámico */}
      {loading ? (
        <p className="text-gray-400 text-sm text-center py-6">Cargando...</p>
      ) : paginatedReports.length === 0 ? (
        <p className="text-gray-500 text-sm text-center py-6">
          No se encontraron reportes que coincidan.
        </p>
      ) : (
        <div className="flex flex-col gap-4 sm:gap-6">
          {[...paginatedReports]
            .sort((a, b) =>
              a.status === "PENDING"
                ? -1
                : b.status === "PENDING"
                ? 1
                : a.created_at > b.created_at
                ? -1
                : 1
            )
            .map((report) => (
              <AdminSupportCard
                key={report.id}
                {...report}
                onUpdateReport={handleUpdateReport}
              />
            ))}
        </div>
      )}

      {/* 📄 Paginación */}
      {totalPages > 1 && (
        <Pagination className="mt-8 sm:mt-10">
          <PaginationContent className="flex items-center justify-center gap-1 font-quicksand">
            <PaginationItem>
              <PaginationPrevious
                onClick={() => handlePageChange(currentPage - 1)}
                className={`${
                  currentPage === 1
                    ? "opacity-50 pointer-events-none bg-gray-200 text-gray-500"
                    : "hover:bg-main-dark/10 hover:text-main-dark"
                } rounded-full px-3 py-2 transition-all duration-300`}
              />
            </PaginationItem>

            {Array.from({ length: totalPages }).map((_, index) => {
              const page = index + 1;
              const isActive = page === currentPage;
              return (
                <PaginationItem key={page}>
                  <PaginationLink
                    onClick={() => handlePageChange(page)}
                    isActive={isActive}
                    className={`rounded-full w-9 h-9 flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                      isActive
                        ? "bg-contrast-secondary text-white shadow-md scale-105"
                        : "bg-main-dark/10 text-main-dark hover:bg-main-dark/20"
                    }`}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              );
            })}

            <PaginationItem>
              <PaginationNext
                onClick={() => handlePageChange(currentPage + 1)}
                className={`${
                  currentPage === totalPages
                    ? "opacity-50 pointer-events-none bg-gray-200 text-gray-500"
                    : "hover:bg-main-dark/10 hover:text-main-dark"
                } rounded-full px-3 py-2 transition-all duration-300`}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </section>
  );
}
