// FIX: Implemented a complete, functional ModalDetalle component to resolve module and reference errors.
// ADDITION: Added action buttons in a footer, including a text-based PDF download feature.
import React, { useState } from 'react';
import type { Obra, TimelineEvent, TimelineEventStatus } from '../types';

// Extend window type for jspdf, which is loaded via script tag in index.html
declare global {
    interface Window {
        jspdf: any;
    }
}

interface ModalDetalleProps {
    obra: Obra;
    onClose: () => void;
}

const statusClasses: { [key in TimelineEventStatus]: string } = {
    completed: 'bg-green-500',
    current: 'bg-geotest-orange',
    pending: 'bg-gray-400'
};

const statusIcons: { [key in TimelineEventStatus]: React.ReactNode } = {
    completed: <>&#10003;</>, // Check mark
    current: <div className="w-2.5 h-2.5 bg-white rounded-full"></div>,
    pending: null
};

const TimelineItem: React.FC<{ event: TimelineEvent, isLast: boolean }> = ({ event, isLast }) => (
    <div className="flex">
        <div className="flex flex-col items-center mr-6">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white font-bold ${statusClasses[event.status]}`}>
                {statusIcons[event.status]}
            </div>
            {!isLast && <div className="w-0.5 grow bg-gray-300"></div>}
        </div>
        <div className={`flex-1 ${!isLast ? 'pb-8 border-b border-gray-200' : ''}`}>
            <p className="font-bold text-geotest-dark mb-1">{event.titulo} - <span className="font-normal text-sm text-geotest-gray">{event.fecha}</span></p>
            <p className="text-sm text-geotest-dark-light">{event.descripcion}</p>
        </div>
    </div>
);


const ModalDetalle: React.FC<ModalDetalleProps> = ({ obra, onClose }) => {
    const [isDownloading, setIsDownloading] = useState(false);

    // Prevent clicks inside the modal from closing it
    const handleModalContentClick = (e: React.MouseEvent) => {
        e.stopPropagation();
    };

    const downloadReportPDF = async () => {
        if (!window.jspdf) {
            alert('La librería para generar PDF no se ha cargado. Por favor, recarga la página.');
            return;
        }
        setIsDownloading(true);
        try {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });

            const pageHeight = doc.internal.pageSize.getHeight();
            const pageWidth = doc.internal.pageSize.getWidth();
            const margin = 15;
            let cursorY = margin;
            const lineHeight = 7;
            const titleSize = 16;
            const headerSize = 12;
            const normalSize = 10;
            const lineBreak = 5;

            const checkPageBreak = (neededHeight = lineHeight) => {
                if (cursorY + neededHeight > pageHeight - margin) {
                    doc.addPage();
                    cursorY = margin;
                }
            };

            // Title
            doc.setFontSize(titleSize);
            doc.setFont('helvetica', 'bold');
            doc.text(`Informe de Obra: ${obra.nombre}`, margin, cursorY);
            cursorY += lineHeight * 2;

            // General Info
            doc.setFontSize(headerSize);
            doc.setFont('helvetica', 'bold');
            doc.text('Información General', margin, cursorY);
            cursorY += lineHeight / 2;
            doc.setLineWidth(0.5);
            doc.line(margin, cursorY, pageWidth - margin, cursorY);
            cursorY += lineBreak;
            
            doc.setFontSize(normalSize);
            const info = [
                { label: 'Cliente:', value: obra.cliente }, { label: 'Responsable:', value: obra.responsable },
                { label: 'Contratista:', value: obra.contratista }, { label: 'Presupuesto Total:', value: `$${obra.presupuesto.toLocaleString('es-MX')}` },
                { label: 'Avance Actual:', value: `${obra.avance}%` }, { label: 'Estado:', value: obra.status.charAt(0).toUpperCase() + obra.status.slice(1) },
                { label: 'Fecha Límite:', value: obra.fechaLimite },
            ];
            info.forEach(item => {
                checkPageBreak();
                doc.setFont('helvetica', 'bold');
                doc.text(item.label, margin, cursorY);
                doc.setFont('helvetica', 'normal');
                doc.text(item.value, margin + 40, cursorY);
                cursorY += lineHeight;
            });
            cursorY += lineBreak;

            // Observations
            checkPageBreak();
            doc.setFontSize(headerSize);
            doc.setFont('helvetica', 'bold');
            doc.text('Observaciones', margin, cursorY);
            cursorY += lineHeight / 2;
            doc.line(margin, cursorY, pageWidth - margin, cursorY);
            cursorY += lineBreak;
            
            doc.setFontSize(normalSize);
            doc.setFont('helvetica', 'italic');
            const obsLines = doc.splitTextToSize(obra.observaciones || 'Sin observaciones.', pageWidth - margin * 2);
            obsLines.forEach((line: string) => {
                checkPageBreak();
                doc.text(line, margin, cursorY);
                cursorY += lineHeight;
            });
            cursorY += lineBreak;
            
            // Timeline
            checkPageBreak(lineHeight * 3);
            doc.setFontSize(headerSize);
            doc.setFont('helvetica', 'bold');
            doc.text('Hitos del Proyecto', margin, cursorY);
            cursorY += lineHeight / 2;
            doc.line(margin, cursorY, pageWidth - margin, cursorY);
            cursorY += lineBreak;

            doc.setFontSize(normalSize);
            obra.timeline.forEach(event => {
                checkPageBreak(lineHeight * 2);
                doc.setFont('helvetica', 'bold');
                const statusText = `[${event.status.toUpperCase()}]`;
                doc.text(`${statusText} ${event.fecha} - ${event.titulo}`, margin, cursorY);
                cursorY += lineHeight;

                checkPageBreak();
                doc.setFont('helvetica', 'normal');
                const descLines = doc.splitTextToSize(event.descripcion, pageWidth - margin * 2 - 5);
                 descLines.forEach((line: string) => {
                    checkPageBreak();
                    doc.text(line, margin + 5, cursorY);
                    cursorY += lineHeight;
                });
                cursorY += lineBreak / 2;
            });

            doc.save(`informe-${obra.nombre.replace(/\s/g, '_')}.pdf`);

        } catch (error) {
            console.error("Error generating PDF:", error);
            alert("Hubo un error al generar el informe PDF.");
        } finally {
            setIsDownloading(false);
        }
    };
    
    const generateEmail = (name: string) => {
        return name.toLowerCase().replace('ing. ', '').replace('arq. ', '').replace(/\s+/g, '.') + '@geotest.com';
    }

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4 transition-opacity duration-300"
            onClick={onClose}
        >
            <div 
                className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden"
                onClick={handleModalContentClick}
            >
                {/* Header */}
                <header className="bg-gray-50 p-6 flex justify-between items-center border-b border-gray-200">
                    <div>
                        <h2 className="text-2xl sm:text-3xl font-black text-geotest-dark">{obra.nombre}</h2>
                        <p className="text-geotest-gray">{obra.cliente}</p>
                    </div>
                    <button 
                        onClick={onClose} 
                        className="text-gray-400 hover:text-geotest-orange text-4xl font-light transition-colors"
                        aria-label="Cerrar modal"
                    >
                        &times;
                    </button>
                </header>

                {/* Body */}
                <div className="p-4 sm:p-8 overflow-y-auto bg-gray-50">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
                        {/* Left Column - Details */}
                        <div className="md:col-span-3 space-y-6">
                           <div className="bg-white p-6 rounded-xl shadow-md">
                                <h3 className="text-xl font-bold text-geotest-dark-light mb-4 border-b pb-2">Detalles del Proyecto</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                                    <p><strong>Responsable:</strong><br/>{obra.responsable}</p>
                                    <p><strong>Contratista:</strong><br/>{obra.contratista}</p>
                                    <p><strong>Presupuesto:</strong><br/>${obra.presupuesto.toLocaleString('es-MX')}</p>
                                    <p><strong>Fecha Límite:</strong><br/>{obra.fechaLimite}</p>
                                    {obra.fechaCompletada && <p><strong>Fecha Completada:</strong><br/>{obra.fechaCompletada}</p>}
                                    <p className="sm:col-span-2"><strong>Próximo Hito:</strong><br/>{obra.proximoHito}</p>
                                </div>
                           </div>

                           <div className="bg-white p-6 rounded-xl shadow-md">
                                <h3 className="text-xl font-bold text-geotest-dark-light mb-4 border-b pb-2">Progreso ({obra.avance}%)</h3>
                                <div className="w-full bg-gray-200 rounded-full h-5 shadow-inner overflow-hidden">
                                    <div
                                        className="bg-gradient-to-r from-geotest-orange to-geotest-yellow h-full flex items-center justify-center"
                                        style={{ width: `${obra.avance}%` }}
                                    >
                                    <span className="text-white text-sm font-bold">{obra.avance}%</span>
                                    </div>
                                </div>
                           </div>

                           <div className="bg-white p-6 rounded-xl shadow-md">
                             <h3 className="text-xl font-bold text-geotest-dark-light mb-4 border-b pb-2">Observaciones</h3>
                             <p className="text-sm text-geotest-gray-light italic">{obra.observaciones || 'Sin observaciones.'}</p>
                           </div>
                        </div>

                        {/* Right Column - Timeline */}
                        <div className="md:col-span-2 bg-white p-6 rounded-xl shadow-md">
                            <h3 className="text-xl font-bold text-geotest-dark-light mb-4 border-b pb-2">Línea de Tiempo</h3>
                            <div className="relative">
                                {obra.timeline.map((event, index) => (
                                    <TimelineItem key={event.id} event={event} isLast={index === obra.timeline.length - 1} />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer with Actions */}
                <footer className="bg-gray-100 p-4 sm:p-6 border-t border-gray-200 flex flex-col sm:flex-row justify-end items-center gap-4">
                    <button
                        onClick={() => alert(`El avance del proyecto "${obra.nombre}" ha sido aprobado.`)}
                        className="w-full sm:w-auto px-6 py-3 rounded-lg font-semibold text-white bg-green-500 hover:bg-green-600 transition-colors shadow-md"
                    >
                        Aprobar Avance
                    </button>
                    <button
                        onClick={() => window.location.href = `mailto:${generateEmail(obra.responsable)}?subject=Consulta sobre obra: ${obra.nombre}`}
                        className="w-full sm:w-auto px-6 py-3 rounded-lg font-semibold text-geotest-dark-light bg-gray-200 hover:bg-gray-300 transition-colors"
                    >
                        Contactar Responsable
                    </button>
                    <button
                        onClick={downloadReportPDF}
                        disabled={isDownloading}
                        className="w-full sm:w-auto px-6 py-3 rounded-lg font-semibold text-white bg-geotest-orange hover:bg-geotest-orange-dark transition-colors shadow-orange-btn disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isDownloading ? 'Generando...' : 'Descargar Informe'}
                    </button>
                </footer>
            </div>
        </div>
    );
};

export default ModalDetalle;
