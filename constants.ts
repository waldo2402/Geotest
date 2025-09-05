
import type { Obra, Cobranza } from './types';

export const OBRAS_DATA: Obra[] = [
    {
        id: '1',
        nombre: 'Centro Comunitario Norte',
        status: 'activa',
        presupuesto: 450000,
        avance: 75,
        fechaLimite: '15/Oct/2025',
        responsable: 'Ing. Ana Torres',
        contratista: 'Construcciones Modernas S.A.',
        proximoHito: 'Instalación de sistema eléctrico.',
        observaciones: 'Pendiente la entrega de materiales de acabado por parte del proveedor.',
        cliente: 'Municipio de Guadalajara',
        timeline: [
            { id: 't1_1', fecha: '10/Mar/2025', titulo: 'Inicio de Obra', descripcion: 'Movimiento de tierras y cimentación.', status: 'completed' },
            { id: 't1_2', fecha: '20/Jun/2025', titulo: 'Estructura Principal', descripcion: 'Levantamiento de muros y estructura de acero.', status: 'completed' },
            { id: 't1_3', fecha: '05/Sep/2025', titulo: 'Acabados Interiores', descripcion: 'Instalación de pisos y pintura.', status: 'current' },
            { id: 't1_4', fecha: '15/Oct/2025', titulo: 'Entrega Final', descripcion: 'Inspección final y entrega al cliente.', status: 'pending' },
        ]
    },
    {
        id: '2',
        nombre: 'Parque Infantil Sur',
        status: 'pendiente',
        presupuesto: 280000,
        avance: 25,
        fechaLimite: '30/Nov/2025',
        responsable: 'Arq. Luis Vega',
        contratista: 'Diseños Urbanos Ltda.',
        proximoHito: 'Aprobación de planos finales.',
        observaciones: 'En espera de permisos municipales para el inicio de la construcción mayor.',
        cliente: 'Fundación Privada',
        timeline: [
            { id: 't2_1', fecha: '01/Ago/2025', titulo: 'Diseño y Planos', descripcion: 'Entrega de propuesta de diseño.', status: 'completed' },
            { id: 't2_2', fecha: '15/Sep/2025', titulo: 'Permisos Municipales', descripcion: 'Solicitud de permisos de construcción.', status: 'current' },
            { id: 't2_3', fecha: '10/Oct/2025', titulo: 'Inicio de Construcción', descripcion: 'Fase inicial de preparación del terreno.', status: 'pending' },
        ]
    },
    {
        id: '3',
        nombre: 'Biblioteca Municipal',
        status: 'completada',
        presupuesto: 620000,
        avance: 100,
        fechaLimite: '20/Ago/2025',
        fechaCompletada: '20/Ago/2025',
        responsable: 'Ing. Sofia Reyes',
        contratista: 'Edificaciones del Futuro',
        proximoHito: 'N/A',
        observaciones: 'Obra entregada satisfactoriamente en tiempo y forma. Cliente satisfecho.',
        cliente: 'Gobierno del Estado',
        timeline: [
            { id: 't3_1', fecha: '05/Ene/2025', titulo: 'Inicio de Obra', descripcion: 'Cimentación y estructura base.', status: 'completed' },
            { id: 't3_2', fecha: '15/Abr/2025', titulo: 'Instalaciones Especiales', descripcion: 'Red eléctrica, datos y climatización.', status: 'completed' },
            { id: 't3_3', fecha: '20/Ago/2025', titulo: 'Entrega y Finiquito', descripcion: 'Obra completada y entregada.', status: 'completed' },
        ]
    },
    {
        id: '4',
        nombre: 'Centro de Salud Este',
        status: 'activa',
        presupuesto: 890000,
        avance: 60,
        fechaLimite: '05/Dic/2025',
        responsable: 'Ing. Carlos Ponce',
        contratista: 'Construcciones Modernas S.A.',
        proximoHito: 'Techado y cerramientos exteriores.',
        observaciones: 'Se requiere una junta para revisar el presupuesto de equipamiento médico.',
        cliente: 'Secretaría de Salud',
        timeline: [
            { id: 't4_1', fecha: '20/Feb/2025', titulo: 'Inicio de Obra', descripcion: 'Preparación del sitio y cimentación.', status: 'completed' },
            { id: 't4_2', fecha: '10/Jul/2025', titulo: 'Estructura Principal', descripcion: 'Construcción de los 3 niveles del edificio.', status: 'completed' },
            { id: 't4_3', fecha: '25/Sep/2025', titulo: 'Instalaciones y Acabados', descripcion: 'Comienzo de trabajos interiores.', status: 'current' },
        ]
    },
];

export const COBRANZA_DATA: Cobranza[] = [
    {
        id: 'c1',
        cliente: 'Municipio de Guadalajara',
        monto: 450000,
        concepto: 'Centro Comunitario Norte - Pago 3/4',
        vencimiento: '15 de Septiembre, 2025',
        estado: 'Próximo Vencimiento',
    },
    {
        id: 'c2',
        cliente: 'Gobierno del Estado',
        monto: 620000,
        concepto: 'Biblioteca Municipal - Pago Final',
        vencimiento: '10 de Septiembre, 2025',
        estado: 'Listo para Cobro',
    },
    {
        id: 'c3',
        cliente: 'Fundación Privada',
        monto: 280000,
        concepto: 'Parque Infantil Sur - Anticipo',
        vencimiento: '25 de Septiembre, 2025',
        estado: 'Pendiente Aprobación',
    },
];

export const PIE_CHART_COLORS = ['#f39c12', '#3498db', '#2ecc71', '#e74c3c'];
