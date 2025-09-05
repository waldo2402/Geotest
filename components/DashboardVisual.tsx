// FIX: Implemented a complete, functional DashboardVisual component to resolve module and reference errors.
// ADDITION: Included KPI calculations and simple SVG charts for data visualization.
import React, { useMemo } from 'react';
import type { Obra, Cobranza } from '../types';
import KpiCard from './KpiCard';
import CobranzaCard from './CobranzaCard';
import { PIE_CHART_COLORS } from '../constants';

interface DashboardVisualProps {
    obras: Obra[];
    cobranzas: Cobranza[];
    onNavigate: () => void;
}

// A simple pie chart component for visualization inside KpiCard
const SimplePieChart: React.FC<{ data: { value: number, color: string }[] }> = ({ data }) => {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    if (total === 0) return <div className="flex items-center justify-center h-full text-gray-400">Sin datos</div>;

    let cumulative = 0;
    const segments = data.map(item => {
        const percentage = (item.value / total) * 100;
        const startAngle = (cumulative / total) * 360;
        cumulative += item.value;
        const endAngle = (cumulative / total) * 360;
        
        const largeArcFlag = percentage > 50 ? 1 : 0;
        
        const startX = 50 + 40 * Math.cos(Math.PI * startAngle / 180);
        const startY = 50 + 40 * Math.sin(Math.PI * startAngle / 180);
        const endX = 50 + 40 * Math.cos(Math.PI * endAngle / 180);
        const endY = 50 + 40 * Math.sin(Math.PI * endAngle / 180);

        return `M 50 50 L ${startX} ${startY} A 40 40 0 ${largeArcFlag} 1 ${endX} ${endY} Z`;
    });

    return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
            {segments.map((d, index) => (
                <path key={index} d={d} fill={data[index].color} />
            ))}
        </svg>
    );
};


const DashboardVisual: React.FC<DashboardVisualProps> = ({ obras, cobranzas, onNavigate }) => {
    const kpiData = useMemo(() => {
        const obrasActivas = obras.filter(o => o.status === 'activa');
        const obrasPendientes = obras.filter(o => o.status === 'pendiente');
        const obrasCompletadas = obras.filter(o => o.status === 'completada');

        const presupuestoTotal = obras.reduce((sum, o) => sum + o.presupuesto, 0);
        
        const avanceTotalActivas = obrasActivas.reduce((sum, o) => sum + o.avance, 0);
        const avancePromedio = obrasActivas.length > 0 ? avanceTotalActivas / obrasActivas.length : 0;

        const totalCobranzaPendiente = cobranzas.reduce((sum, c) => sum + c.monto, 0);

        return {
            obrasActivasCount: obrasActivas.length,
            presupuestoTotal,
            avancePromedio,
            totalCobranzaPendiente,
            statusCounts: {
                activa: obrasActivas.length,
                pendiente: obrasPendientes.length,
                completada: obrasCompletadas.length
            }
        };
    }, [obras, cobranzas]);
    
    const pieChartData = [
        { value: kpiData.statusCounts.activa, color: PIE_CHART_COLORS[0] }, // orange for active
        { value: kpiData.statusCounts.pendiente, color: PIE_CHART_COLORS[1] }, // blue for pending
        { value: kpiData.statusCounts.completada, color: PIE_CHART_COLORS[2] }, // green for completed
    ];

    return (
        <div>
            <h1 className="text-3xl font-black text-geotest-dark mb-8">Dashboard Visual</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                <KpiCard
                    icon="🏗️"
                    value={kpiData.obrasActivasCount.toString()}
                    label="OBRAS EN CURSO"
                    onNavigate={onNavigate}
                >
                   <SimplePieChart data={pieChartData} />
                </KpiCard>
                <KpiCard
                    icon="💰"
                    value={`$${(kpiData.presupuestoTotal / 1_000_000).toFixed(1)}M`}
                    label="PRESUPUESTO TOTAL"
                    onNavigate={onNavigate}
                >
                     <div className="w-full h-full flex items-center justify-center">
                        <div className="w-3/4 bg-gray-200 rounded-full h-4 shadow-inner">
                            <div 
                                className="bg-gradient-to-r from-geotest-orange to-geotest-yellow h-4 rounded-full" 
                                style={{ width: `${kpiData.avancePromedio}%` }}>
                            </div>
                        </div>
                    </div>
                </KpiCard>
                <KpiCard
                    icon="📊"
                    value={`${Math.round(kpiData.avancePromedio)}%`}
                    label="AVANCE PROMEDIO"
                    onNavigate={onNavigate}
                >
                    <div className="w-full h-full flex items-center justify-center">
                       <svg viewBox="0 0 100 55" className="w-full h-auto">
                            <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="#e5e7eb" strokeWidth="10" />
                            <path 
                                d="M 10 50 A 40 40 0 0 1 90 50" 
                                fill="none" 
                                stroke="url(#progressGradient)" 
                                strokeWidth="10" 
                                strokeDasharray="125.6" 
                                strokeDashoffset={125.6 * (1 - kpiData.avancePromedio / 100)}
                            />
                            <defs>
                                <linearGradient id="progressGradient">
                                    <stop offset="0%" stopColor="#f39c12" />
                                    <stop offset="100%" stopColor="#f1c40f" />
                                </linearGradient>
                            </defs>
                            <text x="50" y="45" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#374151">{`${Math.round(kpiData.avancePromedio)}%`}</text>
                       </svg>
                    </div>
                </KpiCard>
                 <KpiCard
                    icon="💵"
                    value={`$${(kpiData.totalCobranzaPendiente / 1000).toFixed(0)}k`}
                    label="COBRANZA PENDIENTE"
                    onNavigate={onNavigate}
                >
                    <div className="flex flex-col justify-center items-center h-full text-sm">
                        {cobranzas.slice(0, 3).map(c => (
                            <div key={c.id} className="w-full text-left p-1 border-b border-gray-200 truncate">
                                <span className="font-bold">{c.cliente}:</span> ${c.monto.toLocaleString('es-MX')}
                            </div>
                        ))}
                    </div>
                </KpiCard>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-geotest-dark-light">Gestión de Cobranza</h2>
                    <button 
                        onClick={onNavigate}
                        className="text-geotest-orange font-semibold hover:underline"
                    >
                        Ver todas las obras
                    </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {cobranzas.map(cobranza => (
                        <CobranzaCard key={cobranza.id} data={cobranza} />
                    ))}
                </div>
            </div>

        </div>
    );
};

export default DashboardVisual;
