
import React from 'react';

interface KpiCardProps {
    icon: string;
    value: string;
    label: string;
    children: React.ReactNode;
    onNavigate: () => void;
}

const KpiCard: React.FC<KpiCardProps> = ({ icon, value, label, children, onNavigate }) => {
    return (
        <div 
            onClick={onNavigate}
            className="bg-geotest-bg-card rounded-3xl shadow-orange-md hover:shadow-orange-lg p-6 text-center relative overflow-hidden transition-transform duration-300 ease-in-out hover:-translate-y-2.5 cursor-pointer"
        >
            <div className="text-6xl mb-5 drop-shadow-[0_0_5px_#f39c12aa]">{icon}</div>
            <div className="w-full h-36 mx-auto mb-5">{children}</div>
            <div className="text-5xl font-black text-geotest-dark-light mb-2.5">{value}</div>
            <div className="text-lg font-bold text-geotest-gray tracking-widest">{label}</div>
        </div>
    );
};

export default KpiCard;
