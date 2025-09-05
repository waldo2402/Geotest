{/* FIX: Replaced placeholder content with a complete, functional component to resolve reference errors. */}
import React, { useState, useMemo } from 'react';
import type { Obra } from '../types';
import ObraItem from './ObraItem';
import ModalDetalle from './ModalDetalle';

interface GestionCompletaProps {
    obras: Obra[];
}

const GestionCompleta: React.FC<GestionCompletaProps> = ({ obras }) => {
    const [selectedObra, setSelectedObra] = useState<Obra | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<'todos' | 'activa' | 'pendiente' | 'completada'>('todos');

    const filteredObras = useMemo(() => {
        return obras.filter(obra => {
            const matchesSearch = obra.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                  obra.responsable.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                  obra.cliente.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = statusFilter === 'todos' || obra.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [obras, searchTerm, statusFilter]);

    const handleSelectObra = (obra: Obra) => {
        setSelectedObra(obra);
    };

    const handleCloseModal = () => {
        setSelectedObra(null);
    };

    const filterButtons: { label: string; value: typeof statusFilter }[] = [
        { label: 'Todos', value: 'todos' },
        { label: 'Activas', value: 'activa' },
        { label: 'Pendientes', value: 'pendiente' },
        { label: 'Completadas', value: 'completada' },
    ];

    return (
        <div>
            <h1 className="text-3xl font-black text-geotest-dark mb-8">Gestión Completa de Obras</h1>

            <div className="bg-white rounded-xl shadow-lg p-6 mb-8 flex flex-col sm:flex-row justify-between items-center gap-4">
                <input
                    type="text"
                    placeholder="Buscar por nombre, responsable o cliente..."
                    className="w-full sm:w-1/2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-geotest-orange"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="flex items-center gap-2 flex-wrap justify-center">
                    {filterButtons.map(button => (
                        <button
                            key={button.value}
                            onClick={() => setStatusFilter(button.value)}
                            className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${statusFilter === button.value ? 'bg-geotest-orange text-white' : 'bg-gray-200 text-geotest-gray hover:bg-gray-300'}`}
                        >
                            {button.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {filteredObras.length > 0 ? (
                     filteredObras.map(obra => (
                        <ObraItem
                            key={obra.id}
                            obra={obra}
                            onSelect={handleSelectObra}
                            isSelected={selectedObra?.id === obra.id}
                        />
                    ))
                ) : (
                    <div className="text-center py-10 bg-white rounded-xl shadow-md">
                        <p className="text-geotest-gray text-lg">No se encontraron obras con los criterios de búsqueda.</p>
                    </div>
                )}
            </div>

            {selectedObra && (
                <ModalDetalle
                    obra={selectedObra}
                    onClose={handleCloseModal}
                />
            )}
        </div>
    );
};

export default GestionCompleta;
