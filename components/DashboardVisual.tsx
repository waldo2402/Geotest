import React, { useState, useEffect } from 'react';
// FIX: Rename imported Recharts types to avoid circular reference errors when casting the global Recharts object.
import type { PieChart as PieChartType, Pie as PieType, Cell as CellType, Tooltip as TooltipType } from 'recharts';
import KpiCard from './KpiCard';
import type { Page } from '../types';
import { OBRAS_DATA, PIE_CHART_COLORS } from '../constants';

// Define the type for the Recharts global object
interface RechartsAPI {
    PieChart: typeof PieChartType;
    Pie: typeof PieType;
    Cell: typeof CellType;
    Tooltip: typeof TooltipType;
    ResponsiveContainer: any;
}

interface DashboardVisualProps {
    onNavigate: (page: Page) => void;
}

const DashboardVisual: React.FC<DashboardVisualProps> = ({ onNavigate }) => {
    const [Recharts, setRecharts] = useState<RechartsAPI | null>(null);

    useEffect(() => {
        // Poll for the Recharts library to be available on the window object
        const intervalId = setInterval(() => {
            if ((window as any).Recharts) {
                setRecharts((window as any).Recharts);
                clearInterval(intervalId);
            }
        }, 100);

        return () => clearInterval(intervalId); // Cleanup interval on component unmount
    }, []);

    const obrasActivas = OBRAS_DATA.filter(o => o.status === 'activa').length;
    const obrasPendientes = OBRAS_DATA.filter(o => o.status === 'pendiente').length;
    const obrasCompletadas = OBRAS_DATA.filter(o => o.status === 'completada').length;

    const chartObrasData = [
        { name: 'Activas', value: obrasActivas },
        { name: 'Pendientes', value: obrasPendientes },
        { name: 'Completadas', value: obrasCompletadas },
    ];
    
    const chartCobranzaData = [
        { name: 'Próximo Vencimiento', value: 450000 },
        { name: 'Listo para Cobro', value: 620000 },
        { name: 'Pendiente', value: 280000 },
    ];

    const chartIngresosData = [
        { name: 'Programado Q3', value: 1100000 },
        { name: 'Programado Q4', value: 700000 },
    ];
    
    const chartPendientesData = [
        { name: 'Alta Prioridad', value: 2 },
        { name: 'Media Prioridad', value: 3 },
    ];
    
    const ChartLoader = () => (
        <div className="flex justify-center items-center h-[140px]">
            <div className="text-geotest-gray animate-pulse">Loading Chart...</div>
        </div>
    );

    return (
        <div className="container max-w-7xl mx-auto my-8 bg-white rounded-2xl shadow-2xl p-10">
            <h1 className="text-5xl font-black mb-10 text-center text-geotest-orange [text-shadow:0_0_10px_#f39c124d]">Geotest</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                <KpiCard icon="🏗️" value={obrasActivas.toString()} label="Obras Activas" onNavigate={() => onNavigate('gestion')}>
                    {Recharts ? (
                        <Recharts.ResponsiveContainer width="100%" height={140}>
                            <Recharts.PieChart>
                                <Recharts.Pie data={chartObrasData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={60} fill="#8884d8">
                                    {chartObrasData.map((entry, index) => <Recharts.Cell key={`cell-${index}`} fill={PIE_CHART_COLORS[index % PIE_CHART_COLORS.length]} />)}
                                </Recharts.Pie>
                                <Recharts.Tooltip />
                            </Recharts.PieChart>
                        </Recharts.ResponsiveContainer>
                    ) : <ChartLoader />}
                </KpiCard>
                 <KpiCard icon="💰" value="$2.4M" label="Por Cobrar" onNavigate={() => onNavigate('gestion')}>
                    {Recharts ? (
                        <Recharts.ResponsiveContainer width="100%" height={140}>
                             <Recharts.PieChart>
                                <Recharts.Pie data={chartCobranzaData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={40} outerRadius={60} fill="#82ca9d" paddingAngle={5}>
                                    {chartCobranzaData.map((entry, index) => <Recharts.Cell key={`cell-${index}`} fill={PIE_CHART_COLORS[index % PIE_CHART_COLORS.length]} />)}
                                </Recharts.Pie>
                                <Recharts.Tooltip formatter={(value: number) => `$${(value / 1000000).toFixed(1)}M`} />
                            </Recharts.PieChart>
                        </Recharts.ResponsiveContainer>
                    ) : <ChartLoader />}
                </KpiCard>
                <KpiCard icon="📅" value="$1.8M" label="Ingresos Programados" onNavigate={() => onNavigate('gestion')}>
                     {Recharts ? (
                         <Recharts.ResponsiveContainer width="100%" height={140}>
                            <Recharts.PieChart>
                                <Recharts.Pie data={chartIngresosData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={60} fill="#ffc658">
                                    {chartIngresosData.map((entry, index) => <Recharts.Cell key={`cell-${index}`} fill={PIE_CHART_COLORS[index % PIE_CHART_COLORS.length]} />)}
                                </Recharts.Pie>
                                <Recharts.Tooltip formatter={(value: number) => `$${(value / 1000000).toFixed(1)}M`} />
                            </Recharts.PieChart>
                        </Recharts.ResponsiveContainer>
                    ) : <ChartLoader />}
                </KpiCard>
                <KpiCard icon="⏳" value="5" label="Tareas Pendientes" onNavigate={() => onNavigate('gestion')}>
                     {Recharts ? (
                        <Recharts.ResponsiveContainer width="100%" height={140}>
                            <Recharts.PieChart>
                                 <Recharts.Pie data={chartPendientesData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={40} outerRadius={60} fill="#ff8042" paddingAngle={5}>
                                    {chartPendientesData.map((entry, index) => <Recharts.Cell key={`cell-${index}`} fill={PIE_CHART_COLORS[index % PIE_CHART_COLORS.length]} />)}
                                </Recharts.Pie>
                                <Recharts.Tooltip />
                            </Recharts.PieChart>
                        </Recharts.ResponsiveContainer>
                    ) : <ChartLoader />}
                </KpiCard>
            </div>
        </div>
    );
};

export default DashboardVisual;