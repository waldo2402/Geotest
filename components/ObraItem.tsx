
import React from 'react';
import type { Obra } from '../types';

interface ObraItemProps {
    obra: Obra;
    onSelect: (obra: Obra) => void;
    isSelected: boolean;
}

const statusClasses = {
    activa: {
        badge: 'bg-status-active-bg text-status-active-text border-status-active-border',
        border: 'border-l-green-500'
    },
    pendiente: {
        badge: 'bg-status-pending-bg text-status-pending-text border-status-pending-border',
        border: 'border-l-yellow-500'
    },
    completada: {
        badge: 'bg-status-completed-bg text-status-completed-text border-status-completed-border',
        border: 'border-l-blue-500'
    }
};

const ObraItem: React.FC<ObraItemProps> = ({ obra, onSelect, isSelected }) => {
    return (
        <div
            onClick={() => onSelect(obra)}
            className={`bg-gray-50 rounded-xl p-5 mb-3.5 cursor-pointer border-l-8 shadow-md transition-all duration-300 ease-in-out flex flex-col
                ${isSelected ? 'bg-status-pending-bg border-l-geotest-orange shadow-orange-lg' : `hover:bg-gray-200 hover:border-l-geotest-orange hover:shadow-orange-md ${statusClasses[obra.status].border}`}`}
        >
            <div className="flex justify-between items-center mb-3">
                <div className="font-black text-lg text-geotest-dark">{obra.nombre}</div>
                <div className={`py-1.5 px-4 rounded-full text-xs font-bold uppercase border-2 whitespace-nowrap ${statusClasses[obra.status].badge}`}>
                    {obra.status}
                </div>
            </div>
            <div className="w-full h-3 bg-gray-300 rounded-full overflow-hidden mb-3 shadow-inner">
                <div 
                    className="h-full bg-gradient-to-r from-geotest-orange to-geotest-yellow rounded-l-full transition-all duration-500" 
                    style={{ width: `${obra.avance}%` }}
                ></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-geotest-gray-light">
                <div className="flex flex-col">
                    <div className="font-bold mb-0.5 text-geotest-dark-light">Presupuesto</div>
                    <div>${obra.presupuesto.toLocaleString('es-MX')}</div>
                </div>
                <div className="flex flex-col">
                    <div className="font-bold mb-0.5 text-geotest-dark-light">Avance</div>
                    <div>{obra.avance}%</div>
                </div>
                <div className="flex flex-col">
                    <div className="font-bold mb-0.5 text-geotest-dark-light">{obra.status === 'completada' ? 'Completada' : 'Fecha Límite'}</div>
                    <div>{obra.status === 'completada' ? obra.fechaCompletada : obra.fechaLimite}</div>
                </div>
            </div>
        </div>
    );
};

export default ObraItem;
