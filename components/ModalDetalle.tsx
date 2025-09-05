import React, { useEffect, useState } from 'react';
import type { Obra, TimelineEvent, TimelineEventStatus } from '../types';

// Define jspdf for TypeScript
declare global {
    interface Window {
        jspdf: any;
    }
}

interface ModalDetalleProps {
    obra: Obra;
    onClose: () => void;
}

const timelineStatusClasses: Record<TimelineEventStatus, { dot: string; text: string }> = {
    completed: {
        dot: 'bg-blue-500 ring-blue-200',
        text: 'text-gray-500'
    },
    current: {
        dot: 'bg-geotest-orange ring-geotest-orange/50 animate-pulse',
        text: 'text-geotest-dark'
    },
    pending: {
        dot: 'bg-gray-300 ring-gray-200',
        text: 'text-gray-400'
    }
};

const DetailItem: React.FC<{ label: string; value: string | number | undefined; className?: string }> = ({ label, value, className = '' }) => (
    <div className={className}>
        <p className="text-sm font-bold text-geotest-dark mb-1">{label}</p>
        <p className="text-base text-geotest-gray-light">{value || '-'}</p>
    </div>
);

const TimelineItem: React.FC<{ event: TimelineEvent; isLast: boolean }> = ({ event, isLast }) => {
    const lineClass = event.status === 'completed' ? 'bg-blue-500' : 'bg-gray-300';
    return (
        <li className="relative pl-10 pb-8">
            {!isLast && <div className={`absolute left-[11px] top-5 w-0.5 h-full ${lineClass}`}></div>}
            <div className="flex items-start">
                <div className={`absolute left-0 top-1 w-6 h-6 rounded-full ring-4 ${timelineStatusClasses[event.status].dot}`}></div>
                <div className="ml-4">
                     <p className={`font-bold text-sm ${timelineStatusClasses[event.status].text}`}>{event.fecha}</p>
                     <h4 className="font-extrabold text-geotest-dark mt-1 text-base">{event.titulo}</h4>
                     <p className="text-sm mt-1 text-geotest-gray-light">{event.descripcion}</p>
                </div>
            </div>
        </li>
    );
};


const ModalDetalle: React.FC<ModalDetalleProps> = ({ obra, onClose }) => {
    const [isAnimating, setIsAnimating] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setIsAnimating(true), 10);
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            clearTimeout(timer);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [onClose]);

    const downloadReportPDF = () => {
        if (!window.jspdf) {
            alert("Error: La librería para generar PDF no se ha cargado correctamente. Intente de nuevo.");
            return;
        }
        setIsDownloading(true);
    
        try {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();
            
            let y = 15;
            const pageHeight = doc.internal.pageSize.height;
            const margin = 15;
            
            const checkPageBreak = (spaceNeeded: number) => {
                if (y + spaceNeeded > pageHeight - margin) {
                    doc.addPage();
                    y = margin;
                }
            };
    
            // Title
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(18);
            doc.text(`Informe de Obra: ${obra.nombre}`, margin, y);
            y += 15;
    
            // General Info
            doc.setFontSize(14);
            doc.text('Información General', margin, y);
            doc.setLineWidth(0.5);
            doc.line(margin, y + 1, 80, y + 1);
            y += 8;
            
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(10);
            
            const info = [
                { label: 'Cliente:', value: obra.cliente },
                { label: 'Responsable:', value: obra.responsable },
                { label: 'Contratista:', value: obra.contratista },
                { label: 'Presupuesto Total:', value: `$${obra.presupuesto.toLocaleString('es-MX')}` },
                { label: 'Avance Actual:', value: `${obra.avance}%` },
                { label: 'Estado:', value: obra.status.charAt(0).toUpperCase() + obra.status.slice(1) },
                { label: 'Fecha Límite:', value: obra.fechaLimite },
            ];
            
            info.forEach(item => {
                checkPageBreak(7);
                doc.setFont('helvetica', 'bold');
                doc.text(item.label, margin, y);
                doc.setFont('helvetica', 'normal');
                doc.text(item.value || '-', margin + 40, y);
                y += 7;
            });
            y += 5;
            
            // Observations
            checkPageBreak(20);
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(14);
            doc.text('Observaciones', margin, y);
            doc.line(margin, y + 1, 60, y + 1);
            y += 8;
            
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(10);
            const obsLines = doc.splitTextToSize(obra.observaciones, 180);
            checkPageBreak(obsLines.length * 5);
            doc.text(obsLines, margin, y);
            y += obsLines.length * 5 + 5;
            
            // Timeline
            checkPageBreak(20);
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(14);
            doc.text('Hitos del Proyecto', margin, y);
            doc.line(margin, y + 1, 70, y + 1);
            y += 8;
            
            obra.timeline.forEach(event => {
                const status = `[${event.status.toUpperCase()}]`;
                const title = `${status} ${event.fecha} - ${event.titulo}`;
                const descLines = doc.splitTextToSize(event.descripcion, 170);
                
                const spaceNeeded = 7 + (descLines.length * 5);
                checkPageBreak(spaceNeeded);
                
                doc.setFont('helvetica', 'bold');
                doc.setFontSize(10);
                doc.text(title, margin, y);
                y += 6;
                
                doc.setFont('helvetica', 'normal');
                doc.setFontSize(10);
                doc.text(descLines, margin + 5, y);
                y += descLines.length * 5 + 4;
            });
    
            doc.save(`informe-${obra.nombre.replace(/\s+/g, '_')}.pdf`);
        } catch (error) {
            console.error("Error generating PDF:", error);
            alert("Ocurrió un error al generar el informe en PDF.");
        } finally {
            setIsDownloading(false);
        }
    };
    
    const handleContact = () => {
        const responsableEmail = `${obra.responsable.toLowerCase().replace(/\s/g, '.')}@example.com`;
        window.location.href = `mailto:${responsableEmail}?subject=Consulta sobre obra: ${obra.nombre}`;
    };

    const handleApprove = () => {
        alert(`Avance de la obra "${obra.nombre}" ha sido aprobado.`);
    };

    return (
        <div 
            className={`fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4 transition-opacity duration-300 ${isAnimating ? 'opacity-100' : 'opacity-0'}`}
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
        >
            <div 
                className={`bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col transform transition-all duration-300 ease-out ${isAnimating ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
                onClick={e => e.stopPropagation()}
            >
                <header className="flex justify-between items-center p-6 border-b-2 border-gray-100 flex-shrink-0">
                    <h2 id="modal-title" className="text-3xl font-black text-geotest-orange">{obra.nombre}</h2>
                    <button 
                        onClick={onClose}
                        className="text-gray-400 hover:text-geotest-orange text-4xl font-bold transition-colors leading-none"
                        aria-label="Cerrar modal"
                    >
                        &times;
                    </button>
                </header>
                
                <main className="p-8 overflow-y-auto">
                    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6 mb-8">
                        <DetailItem label="Cliente" value={obra.cliente} />
                        <DetailItem label="Responsable" value={obra.responsable} />
                        <DetailItem label="Contratista" value={obra.contratista} />
                        <DetailItem label="Presupuesto" value={`$${obra.presupuesto.toLocaleString('es-MX')}`} />
                        <DetailItem label={obra.status === 'completada' ? 'Fecha Completada' : 'Fecha Límite'} value={obra.status === 'completada' ? obra.fechaCompletada : obra.fechaLimite} />
                        <div>
                             <p className="text-sm font-bold text-geotest-dark mb-2">Avance</p>
                             <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden shadow-inner">
                                <div 
                                    className="h-full bg-gradient-to-r from-geotest-orange to-geotest-yellow rounded-l-full transition-all duration-500 flex items-center justify-center text-white text-xs font-bold" 
                                    style={{ width: `${obra.avance}%` }}
                                >
                                    {obra.avance > 10 && `${obra.avance}%`}
                                </div>
                            </div>
                        </div>
                    </section>
                    
                    <section className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mb-10">
                         <DetailItem label="Próximo Hito" value={obra.proximoHito} />
                         <DetailItem label="Observaciones" value={obra.observaciones} className="whitespace-pre-wrap" />
                    </section>

                    <section>
                        <h3 className="text-2xl font-black text-geotest-dark border-b-4 border-geotest-orange pb-2 mb-8">Línea de Tiempo</h3>
                        <ul>
                            {obra.timeline.map((event, index) => (
                                <TimelineItem key={event.id} event={event} isLast={index === obra.timeline.length - 1} />
                            ))}
                        </ul>
                    </section>
                </main>
                
                <footer className="flex flex-wrap justify-end items-center p-6 border-t-2 border-gray-100 flex-shrink-0 gap-4">
                    <button
                        onClick={handleContact}
                        className="py-2 px-5 rounded-lg font-bold text-sm text-geotest-gray-light bg-gray-200 hover:bg-gray-300 transition-colors"
                    >
                        Contactar Responsable
                    </button>
                    <button
                        onClick={handleApprove}
                        className="py-2 px-5 rounded-lg font-bold text-sm text-white bg-blue-500 hover:bg-blue-600 transition-colors"
                    >
                        Aprobar Avance
                    </button>
                    <button
                        onClick={downloadReportPDF}
                        disabled={isDownloading}
                        className="py-2 px-5 rounded-lg font-bold text-sm text-white bg-gradient-to-br from-geotest-orange to-geotest-yellow shadow-orange-btn hover:shadow-orange-btn-hover hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-wait"
                    >
                        {isDownloading ? 'Generando...' : 'Descargar Informe'}
                    </button>
                </footer>
            </div>
        </div>
    );
};

export default ModalDetalle;