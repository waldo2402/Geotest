import React, { useState, useMemo, useEffect } from 'react';
import type { Obra, ObraStatus } from '../types';
import { OBRAS_DATA, COBRANZA_DATA } from '../constants';
import ObraItem from './ObraItem';
import CobranzaCard from './CobranzaCard';
import ModalDetalle from './ModalDetalle';

const GestionCompleta: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilter, setActiveFilter] = useState<ObraStatus | 'todas'>('todas');
    const [selectedObra, setSelectedObra] = useState<Obra | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showPendingNotification, setShowPendingNotification] = useState(false);
    
    const filteredObras = useMemo(() => {
        return OBRAS_DATA
            .filter(obra => activeFilter === 'todas' || obra.status === activeFilter)
            .filter(obra => 
                obra.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                obra.responsable.toLowerCase().includes(searchTerm.toLowerCase())
            );
    }, [searchTerm, activeFilter]);

    useEffect(() => {
        const hasPendingTasks = OBRAS_DATA.some(obra => obra.status === 'pendiente');
        setShowPendingNotification(hasPendingTasks);
    }, []);

    const handleSelectObra = (obra: Obra) => {
        setSelectedObra(obra);
    };
    
    const handleOpenModal = () => {
        if (selectedObra) {
            setIsModalOpen(true);
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };
    
    const exportToCSV = () => {
        const headers = "ID,Nombre,Status,Presupuesto,Avance,Fecha Límite,Responsable\n";
        const rows = filteredObras.map(o => 
            `${o.id},"${o.nombre}","${o.status}",${o.presupuesto},${o.avance},"${o.fechaLimite}","${o.responsable}"`
        ).join("\n");
        const csvContent = "data:text/csv;charset=utf-8," + headers + rows;
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "obras_geotest.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    
    return (
        <>
            <div className="container max-w-7xl mx-auto my-8 bg-white rounded-2xl shadow-2xl p-10">
                <h1 className="text-5xl font-black mb-10 text-center text-geotest-orange [text-shadow:0_0_10px_#f39c124d]">Geotest - Gestión Completa</h1>
                <div className="grid grid-cols-1 lg:grid-cols-[2.5fr,1.5fr] gap-8 py-8">
                    {/* Obras Section */}
                    <div className="bg-white rounded-xl p-7 shadow-lg flex flex-col">
                        <h2 className="text-2xl font-black mb-5 text-geotest-dark border-b-4 border-geotest-orange pb-2">Gestión de Obras</h2>
                        <input
                            type="text"
                            placeholder="Buscar obra por nombre o responsable..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full p-3 rounded-lg border-2 border-gray-300 text-base mb-5 shadow-inner transition-colors duration-300 focus:outline-none focus:border-geotest-orange focus:ring-2 focus:ring-geotest-orange/50"
                        />
                        <div className="flex gap-3 mb-5 flex-wrap">
                            {(['todas', 'activa', 'pendiente', 'completada'] as const).map(filter => (
                                <button 
                                    key={filter}
                                    onClick={() => setActiveFilter(filter)}
                                    className={`py-2 px-6 border-2 rounded-full cursor-pointer text-sm font-bold transition-all duration-300 ${activeFilter === filter ? 'bg-geotest-orange text-white border-geotest-orange shadow-orange-btn' : 'border-gray-300 bg-white text-geotest-dark-light hover:bg-geotest-yellow hover:border-geotest-yellow'}`}
                                >
                                    {filter.charAt(0).toUpperCase() + filter.slice(1)}
                                </button>
                            ))}
                        </div>
                        {showPendingNotification && (
                            <div className="bg-red-500 text-white p-3 rounded-lg font-bold mb-5 shadow-lg">
                                ¡Hay tareas pendientes en algunas obras!
                            </div>
                        )}
                        <div className="flex gap-4 mb-5">
                            <button onClick={exportToCSV} className="bg-gradient-to-br from-green-500 to-green-600 text-white border-none py-2 px-5 rounded-md cursor-pointer text-sm font-bold transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
                                Exportar a CSV
                            </button>
                        </div>
                        <div className="overflow-y-auto max-h-[480px] pr-2">
                            {filteredObras.map(obra => (
                                <ObraItem key={obra.id} obra={obra} onSelect={handleSelectObra} isSelected={selectedObra?.id === obra.id} />
                            ))}
                        </div>
                    </div>
                    {/* Info Panel */}
                    <div className="bg-white rounded-xl p-7 shadow-lg flex flex-col">
                        <h2 className="text-2xl font-black mb-5 text-geotest-dark border-b-4 border-geotest-orange pb-2">Información Detallada</h2>
                        <div>
                            <div className="mb-4">
                                <div className="font-bold text-geotest-dark mb-1.5">Obra Seleccionada</div>
                                <div className="text-geotest-gray-light p-3 bg-gray-100 rounded-lg text-sm min-h-[40px]">{selectedObra?.nombre || 'Selecciona una obra para ver detalles'}</div>
                            </div>
                            <div className="mb-4">
                                <div className="font-bold text-geotest-dark mb-1.5">Responsable</div>
                                <div className="text-geotest-gray-light p-3 bg-gray-100 rounded-lg text-sm min-h-[40px]">{selectedObra?.responsable || '-'}</div>
                            </div>
                            <div className="mb-4">
                                <div className="font-bold text-geotest-dark mb-1.5">Contratista</div>
                                <div className="text-geotest-gray-light p-3 bg-gray-100 rounded-lg text-sm min-h-[40px]">{selectedObra?.contratista || '-'}</div>
                            </div>
                             <div className="mb-4">
                                <div className="font-bold text-geotest-dark mb-1.5">Próximo Hito</div>
                                <div className="text-geotest-gray-light p-3 bg-gray-100 rounded-lg text-sm min-h-[40px]">{selectedObra?.proximoHito || '-'}</div>
                            </div>
                            <div className="mb-4">
                                <div className="font-bold text-geotest-dark mb-1.5">Observaciones</div>
                                <div className="text-geotest-gray-light p-3 bg-gray-100 rounded-lg text-sm min-h-[40px] whitespace-pre-wrap">{selectedObra?.observaciones || '-'}</div>
                            </div>
                            <button
                                onClick={handleOpenModal}
                                disabled={!selectedObra}
                                className="w-full bg-gradient-to-br from-geotest-orange to-geotest-yellow text-white border-none py-3 rounded-lg cursor-pointer text-base font-black mt-5 transition-all duration-300 shadow-orange-btn hover:-translate-y-1 hover:shadow-orange-btn-hover disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
                            >
                                Ver Detalles Completos
                            </button>
                        </div>
                    </div>
                </div>

                {/* Cobranza Section */}
                <div className="col-span-1 lg:col-span-2 bg-white rounded-xl p-8 shadow-lg mt-8">
                    <h2 className="text-2xl font-black mb-6 text-geotest-dark border-b-4 border-geotest-orange pb-2">Área de Cobranza - Ingresos a Programar</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                       {COBRANZA_DATA.map(item => <CobranzaCard key={item.id} data={item} />)}
                    </div>
                </div>
            </div>
            {isModalOpen && selectedObra && <ModalDetalle obra={selectedObra} onClose={handleCloseModal} />}
        </>
    );
};

export default GestionCompleta;