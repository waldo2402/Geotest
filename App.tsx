import React, { useState } from "react";
import React, { useState, useEffect } from "react";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Legend,
} from "recharts";

import {
  ESTIMACIONES,
  PAGOS,
  PRESUPUESTO,
  FECHAS_INICIALES,
  COLORS,
} from "./constants";

import { FechasProyecto, Presupuesto } from "./types";

const App: React.FC = () => {
  const [fechas, setFechas] = useState<FechasProyecto>(FECHAS_INICIALES);
  const [presupuesto] = useState<Presupuesto>(PRESUPUESTO);
const [contratoUrl, setContratoUrl] = useState<string | null>(null);

// Al montar, cargar contrato desde localStorage si existe
useEffect(() => {
  const savedContrato = localStorage.getItem("contratoUrl");
  if (savedContrato) {
    setContratoUrl(savedContrato);
  } else {
    setContratoUrl("/contrato.pdf"); // valor por defecto
  }
}, []);

// Guardar en localStorage cada vez que se cambie el contrato
useEffect(() => {
  if (contratoUrl) {
    localStorage.setItem("contratoUrl", contratoUrl);
  }
}, [contratoUrl]);
  const handleFechaChange = (campo: "inicial" | "reprogramacion", valor: string) => {
    setFechas({ ...fechas, [campo]: valor });
  };

  return (
    <div className="p-6 grid gap-6 md:grid-cols-2">
      {/* Timeline */}
      <Card className="col-span-2">
        <CardContent>
          <h2 className="text-xl font-bold mb-2">📅 Línea de tiempo</h2>
          <ul className="list-disc pl-5">
            {ESTIMACIONES.map((e, i) => (
              <li key={i}>
                {e.fecha} – {e.evento}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Pagos */}
      <Card>
        <CardContent>
          <h2 className="text-xl font-bold mb-2">💰 Avance de Pagos</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={PAGOS}
                dataKey="valor"
                nameKey="nombre"
                outerRadius={80}
                label
              >
                {PAGOS.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Fechas */}
      <Card>
        <CardContent>
          <h2 className="text-xl font-bold mb-2">🗓 Fechas del Proyecto</h2>
          <div className="space-y-2">
            <div>
              <label>Fecha Inicial:</label>
              <Input
                type="date"
                value={fechas.inicial}
                onChange={(e) => handleFechaChange("inicial", e.target.value)}
              />
            </div>
            <div>
              <label>Fecha Reprogramación:</label>
              <Input
                type="date"
                value={fechas.reprogramacion}
                onChange={(e) =>
                  handleFechaChange("reprogramacion", e.target.value)
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

         {/* Contratos */}
<Card className="col-span-2">
  <CardContent>
    <h2 className="text-xl font-bold mb-2">📑 Contratos</h2>

    <div className="flex gap-4 mb-4">
      {/* Ver contrato */}
      <Button
        onClick={() => {
          if (contratoUrl) {
            const link = document.createElement("a");
            link.href = contratoUrl;
            link.target = "_blank";
            link.click();
          }
        }}
      >
        Ver Contrato
      </Button>

      {/* Cambiar contrato */}
      <label className="cursor-pointer">
        <span className="px-4 py-2 bg-blue-500 text-white rounded-md">
          Cambiar Contrato
        </span>
        <input
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              const file = e.target.files[0];
              const reader = new FileReader();
              reader.onload = (ev) => {
                if (ev.target?.result) {
                  setContratoUrl(ev.target.result as string);
                }
              };
              reader.readAsDataURL(file); // Guardar como base64
            }
          }}
        />
      </label>

      {/* Eliminar contrato */}
      <Button
        className="bg-red-500 hover:bg-red-600 text-white"
        onClick={() => {
          localStorage.removeItem("contratoUrl");
          setContratoUrl("/contrato.pdf");
        }}
      >
        Eliminar Contrato
      </Button>
    </div>

    {contratoUrl ? (
      <iframe
        src={contratoUrl}
        title="Contrato"
        width="100%"
        height="400px"
        className="border rounded"
      />
    ) : (
      <p>No hay contrato cargado.</p>
    )}
  </CardContent>
</Card>

      {/* Presupuesto */}
      <Card className="col-span-2">
        <CardContent>
          <h2 className="text-xl font-bold mb-2">📊 Presupuesto</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart
              data={[
                { name: "Usado", valor: presupuesto.usado },
                { name: "Límite", valor: presupuesto.limite },
              ]}
            >
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="valor" fill="#2196F3" />
            </BarChart>
          </ResponsiveContainer>
          {presupuesto.usado / presupuesto.limite >= 0.8 && (
            <p className="text-red-600 font-bold mt-2">
              ⚠️ Atención: el presupuesto está por agotarse
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default App;
