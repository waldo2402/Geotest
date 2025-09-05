
import React, { useState, useCallback } from 'react';
import DashboardVisual from './components/DashboardVisual';
import GestionCompleta from './components/GestionCompleta';
import type { Page } from './types';

const App: React.FC = () => {
    const [currentPage, setCurrentPage] = useState<Page>('dashboard');

    const navigateTo = useCallback((page: Page) => {
        setCurrentPage(page);
    }, []);

    return (
        <div>
            <nav className="max-w-7xl mx-auto my-5 flex justify-center gap-5 px-4">
                <button
                    onClick={() => navigateTo('dashboard')}
                    className="bg-geotest-orange border-none text-white font-bold text-base py-3 px-6 rounded-full cursor-pointer shadow-orange-btn transition-all duration-300 ease-in-out hover:bg-geotest-orange-dark focus:outline-none focus:ring-2 focus:ring-geotest-yellow"
                >
                    Dashboard Visual
                </button>
                <button
                    onClick={() => navigateTo('gestion')}
                    className="bg-geotest-orange border-none text-white font-bold text-base py-3 px-6 rounded-full cursor-pointer shadow-orange-btn transition-all duration-300 ease-in-out hover:bg-geotest-orange-dark focus:outline-none focus:ring-2 focus:ring-geotest-yellow"
                >
                    Gestión Completa
                </button>
            </nav>

            <main>
                {currentPage === 'dashboard' && <DashboardVisual onNavigate={navigateTo} />}
                {currentPage === 'gestion' && <GestionCompleta />}
            </main>
        </div>
    );
};

export default App;
