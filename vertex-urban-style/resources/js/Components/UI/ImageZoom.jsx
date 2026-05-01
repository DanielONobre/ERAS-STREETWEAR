import { useState, useRef, useCallback } from 'react';
import { cn } from '@lib/utils';

/**
 * Zoom de imagem ao hover (desktop) via transformação CSS.
 * Em mobile mantém comportamento padrão.
 *
 * @param {object}  props
 * @param {string}  props.src         - URL da imagem ampliada
 * @param {string}  props.alt
 * @param {number}  [props.zoomScale] - Fator de zoom (default 2.5)
 * @param {string}  [props.className]
 */
export default function ImageZoom({ src, alt, zoomScale = 2.5, className }) {
    const containerRef = useRef(null);
    const [isZoomed, setIsZoomed]   = useState(false);
    const [origin, setOrigin]       = useState({ x: 50, y: 50 });

    const handleMouseMove = useCallback((e) => {
        const rect = containerRef.current?.getBoundingClientRect();
        if (!rect) return;
        const x = ((e.clientX - rect.left) / rect.width)  * 100;
        const y = ((e.clientY - rect.top)  / rect.height) * 100;
        setOrigin({ x, y });
    }, []);

    return (
        <div
            ref={containerRef}
            className={cn('overflow-hidden relative cursor-zoom-in select-none', className)}
            onMouseEnter={() => setIsZoomed(true)}
            onMouseLeave={() => setIsZoomed(false)}
            onMouseMove={handleMouseMove}
            aria-label={`Imagem ampliável: ${alt}`}
        >
            <img
                src={src}
                alt={alt}
                draggable={false}
                className="w-full h-full object-cover transition-transform duration-150 ease-out will-change-transform"
                style={{
                    transform:       isZoomed ? `scale(${zoomScale})` : 'scale(1)',
                    transformOrigin: `${origin.x}% ${origin.y}%`,
                }}
            />

            {/* Hint de zoom */}
            {!isZoomed && (
                <span className="absolute bottom-3 right-3 text-[10px] text-white/40
                                 bg-dark/60 backdrop-blur-sm rounded-full px-2 py-0.5
                                 hidden sm:block pointer-events-none select-none">
                    Passe o mouse para ampliar
                </span>
            )}
        </div>
    );
}
