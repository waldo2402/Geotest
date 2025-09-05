{/* FIX: Replaced placeholder content with a complete, functional component to resolve module and reference errors. */}
import React, { useState } from 'react';
import type { Page } from './types';
import DashboardVisual from './components/DashboardVisual';
import GestionCompleta from './components/GestionCompleta';
import { OBRAS_DATA, COBRANZA_DATA } from './constants';

const App: React.FC = () => {
    const [currentPage, setCurrentPage] = useState<Page>('dashboard');

    const navigateTo = (page: Page) => {
        setCurrentPage(page);
    };

    return (
        <div className="bg-geotest-bg min-h-screen font-sans text-gray-800">
            <header className="bg-white shadow-md">
                <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="text-2xl font-bold text-geotest-dark">
                        Geo<span className="text-geotest-orange">Test</span> Dashboard
                    </div>
                    <div>
                        <button 
                            onClick={() => navigateTo('dashboard')}
                            className={`px-4 py-2 rounded-md font-semibold transition-colors ${currentPage === 'dashboard' ? 'bg-geotest-orange text-white' : 'text-geotest-gray hover:bg-gray-200'}`}
                        >
                            Dashboard Visual
                        </button>
                        <button 
                            onClick={() => navigateTo('gestion')}
                            className={`ml-4 px-4 py-2 rounded-md font-semibold transition-colors ${currentPage === 'gestion' ? 'bg-geotest-orange text-white' : 'text-geotest-gray hover:bg-gray-200'}`}
                        >
                            Gestión Completa
                        </button>
                    </div>
                </nav>
            </header>
            <main className="container mx-auto p-6">
                {currentPage === 'dashboard' ? (
                    <DashboardVisual 
                        obras={OBRAS_DATA} 
                        cobranzas={COBRANZA_DATA} 
                        onNavigate={() => navigateTo('gestion')} 
                    />
                ) : (
                    <GestionCompleta 
                        obras={OBRAS_DATA} 
                    />
                )}
            </main>
        </div>
    );
};

export default App;
