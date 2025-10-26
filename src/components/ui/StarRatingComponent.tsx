/*
Componente creado con GPT, PROMPT:
Crea un componente llamado Rating.tsx en React + TypeScript usando Tailwind CSS y Tabler Icons (@tabler/icons-react) que muestre calificaciones en estrellas.
Requisitos:
-Recibe un value numérico (ej. 3.5) que representa la calificación.
-Permite configurar el número máximo de estrellas (max, default 5).
-Permite configurar el tamaño de las estrellas (size, default 20).
-Debe mostrar estrellas completas, medias y vacías según el value.
-Estrellas vacías: IconStar con clase text-gray-300.
-Estrellas llenas: IconStarFilled con clase text-yellow-400.
-Para las medias estrellas, usa overflow-hidden recortando la estrella llena.
-El componente es solo visualización, no interactivo.
*/
import { IconStar, IconStarFilled } from "@tabler/icons-react";

interface RatingProps {
    value: number;    
    max?: number;      
    size?: number;     
}

export default function StarRatingComponent({ value, max = 5, size = 20 }: RatingProps) {
    return (
        <div className="flex items-center">
            {Array.from({ length: max }).map((_, i) => {
                const full = i + 1 <= Math.floor(value);        // Estrella llena
                const half = value - i > 0 && value - i < 1;    // Media estrella

                return (
                    <div key={i} className="relative" style={{ width: size, height: size }}>
                        {/* Estrella vacía */}
                        <IconStar size={size} className="text-contrast-secondary" />

                        {/* Estrella llena */}
                        {full && (
                            <IconStarFilled
                                size={size}
                                className="text-contrast-secondary absolute left-0 top-0"
                            />
                        )}

                        {/* Media estrella */}
                        {half && (
                            <div
                                className="absolute left-0 top-0 overflow-hidden"
                                style={{ width: `${(value - i) * 100}%`, height: size }}
                            >
                                <IconStarFilled
                                    size={size}
                                    className="text-contrast-secondary"
                                />
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
