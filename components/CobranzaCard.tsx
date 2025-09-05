
import React from 'react';
import type { Cobranza } from '../types';

const statusClasses = {
    'Próximo Vencimiento': 'text-geotest-orange',
    'Listo para Cobro': 'text-green-500',
    'Pendiente Aprobación': 'text-blue-500',
};

const CobranzaCard: React.FC<{ data: Cobranza }> = ({ data }) => {
    
    const getButtonText = () => {
        switch (data.estado) {
            case 'Listo para Cobro': return 'Generar Factura';
            case 'Pendiente Aprobación': return 'Seguimiento';
            default: return 'Gestionar Cobranza';
        }
    }
    
    return (
        <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 border-l-8 border-green-500 shadow-green-md hover:shadow-green-lg flex flex-col justify-between transition-shadow duration-300">
            <div>
                <div className="flex justify-between items-center mb-4">
                    <div className="font-black text-lg text-geotest-dark">{data.cliente}</div>
                    <div className="text-2xl font-black text-green-600">${data.monto.toLocaleString('es-MX')}</div>
                </div>
                <div className="text-sm mb-4 text-geotest-dark-light">
                    <p className="mb-1"><strong>Concepto:</strong> {data.concepto}</p>
                    <p className="mb-1"><strong>Vencimiento:</strong> {data.vencimiento}</p>
                    <p><strong>Estado:</strong> <span className={`font-bold ${statusClasses[data.estado]}`}>{data.estado}</span></p>
                </div>
            </div>
            <button className="w-full bg-gradient-to-br from-geotest-orange to-geotest-yellow text-white border-none py-3 rounded-lg cursor-pointer text-base font-black mt-2 transition-all duration-300 shadow-orange-btn hover:-translate-y-1 hover:shadow-orange-btn-hover">
                {getButtonText()}
            </button>
        </div>
    );
};

export default CobranzaCard;
