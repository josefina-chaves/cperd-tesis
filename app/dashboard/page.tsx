"use client";
import React, { useState, useEffect } from "react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell 
} from "recharts";
import { useRouter } from "next/navigation";
import { jsPDF } from "jspdf";
import { motion } from "framer-motion";

const COLORES_PIE = ["#566bf6", "#f97316", "#14b8a6", "#a855f7", "#ec4899"];

const preguntas = [
  { id: "c1", seccion: "Sección 1 - Estado académico", titulo: "C1. ¿Cuál es tu situación académica actual?" },
  { id: "c2", seccion: "Sección 1 - Estado académico", titulo: "C2. Nivel educativo de la última experiencia" },
  { id: "c3", seccion: "Sección 1 - Estado académico", titulo: "C3. Año de cursada" },
  { id: "c4", seccion: "Sección 2 - Datos de contextualización", titulo: "C4. Institución donde cursaste." },
  { id: "c5", seccion: "Sección 2 - Datos de contextualización", titulo: "C5. País." },
  { id: "c6", seccion: "Sección 2 - Datos de contextualización", titulo: "C6. Área disciplinar" },
  { id: "c7", seccion: "Sección 2 - Datos de contextualización", titulo: "C7. Modalidad predominante de cursada." },
  { id: "c8", seccion: "Sección 2 - Datos de contextualización", titulo: "C8. ¿Los materiales se entregaban de forma digital?" },
  { id: "c9", seccion: "Sección 2 - Datos de contextualización", titulo: "C9. ¿Qué usaban para acceder a los materiales?" },
  { id: "c10", seccion: "Sección 3 - La experiencia", titulo: "C10. ¿A qué tipo de instancia corresponde?" },
  { id: "c11", seccion: "Sección 3 - La experiencia", titulo: "C11. ¿Cuánto tiempo pasó desde entonces?" },
  { id: "c12", seccion: "Sección 3 - La experiencia", titulo: "C12. ¿Cuánto sabías del tema antes de empezar?" },
  { id: "c13", seccion: "Sección 3 - La experiencia", titulo: "C13. ¿Cuánto tiempo le dedicaste en total?" },
  { id: "c14", seccion: "Sección 3 - Escala de valoración", descripcion: "Bloque 1: Comprensión de la tarea.", titulo: "Antes de empezar, entendí con claridad qué tenía que aprender o entregar." },
  { id: "c15", seccion: "Sección 3 - Escala de valoración", descripcion: "Bloque 1: Comprensión de la tarea.", titulo: "El material decía explícitamente qué se esperaba que aprendiera." },
  { id: "c16", seccion: "Sección 3 - Escala de valoración", descripcion: "Bloque 1: Comprensión de la tarea.", titulo: "Tuve que releer la consigna varias veces para entender qué se pedía." },
  { id: "c17", seccion: "Sección 3 - Escala de valoración", descripcion: "Bloque 1: Comprensión de la tarea.", titulo: "El material indicaba con qué criterios me iban a evaluar." },
  { id: "c18", seccion: "Sección 3 - Escala de valoración", descripcion: "Bloque 2: Organización del estudio.", titulo: "Pude estimar razonablemente cuánto tiempo me iba a llevar." },
  { id: "c19", seccion: "Sección 3 - Escala de valoración", descripcion: "Bloque 2: Organización del estudio.", titulo: "El material sugería un orden o una secuencia de trabajo." },
  { id: "c20", seccion: "Sección 3 - Escala de valoración", descripcion: "Bloque 2: Organización del estudio.", titulo: "La extensión real del trabajo fue bastante mayor que la anunciada." },
  { id: "c21", seccion: "Sección 3 - Escala de valoración", descripcion: "Bloque 2: Organización del estudio.", titulo: "Distribuí el estudio en varias sesiones planificadas." },
  { id: "c22", seccion: "Sección 3 - Escala de valoración", descripcion: "Bloque 3: Suficiencia del material.", titulo: "Con los materiales que dio el docente me alcanzaba." },
  { id: "c23", seccion: "Sección 3 - Escala de valoración", descripcion: "Bloque 3: Suficiencia del material.", titulo: "Para entender el tema necesité buscar información por fuera." },
  { id: "c24", seccion: "Sección 3 - Escala de valoración", descripcion: "Bloque 3: Suficiencia del material.", titulo: "Cuando tuve dudas, el material ofrecía vías claras para resolverlas." },
  { id: "c25", seccion: "Sección 3 - Escala de valoración", descripcion: "Bloque 3: Suficiencia del material.", titulo: "Consulté con mis compañeros porque el material no era suficientemente claro." },
  { id: "c26", seccion: "Sección 3 - Escala de valoración", descripcion: "Bloque 3: Suficiencia del material.", titulo: "Los ejemplos incluidos me ayudaron a aplicar los conceptos." },
  { id: "c27", seccion: "Sección 3 - Material Complementario", titulo: "¿Qué usaste además del material del docente para estudiar este tema?" },
  { id: "c28", seccion: "Sección 3 - Escala de valoración", descripcion: "Bloque 4: Verificación de la comprensión.", titulo: "Durante el estudio pude verificar por mí mismo si estaba entendiendo." },
  { id: "c29", seccion: "Sección 3 - Escala de valoración", descripcion: "Bloque 4: Verificación de la comprensión.", titulo: "El material incluía instancias de práctica con devolución." },
  { id: "c30", seccion: "Sección 3 - Escala de valoración", descripcion: "Bloque 4: Verificación de la comprensión.", titulo: "Me di cuenta de que no había entendido recién al momento de ser evaluado." },
  { id: "c31", seccion: "Sección 3 - Escala de valoración", descripcion: "Bloque 4: Verificación de la comprensión.", titulo: "Cuando terminé de estudiar, sabía qué me faltaba repasar." },
  { id: "c32", seccion: "Sección 3 - Escala de valoración", descripcion: "Bloque 5: Esfuerzo requerido.", titulo: "El tema en sí era difícil, más allá de cómo estuviera explicado." },
  { id: "c33", seccion: "Sección 3 - Escala de valoración", descripcion: "Bloque 5: Esfuerzo requerido.", titulo: "El contenido tenía muchos elementos que había que relacionar." },
  { id: "c34", seccion: "Sección 3 - Escala de valoración", descripcion: "Bloque 5: Esfuerzo requerido.", titulo: "El contenido requería conocimientos previos que todavía no dominaba." },
  { id: "c35", seccion: "Sección 3 - Escala de valoración", descripcion: "Bloque 5: Esfuerzo requerido.", titulo: "El material estava desordenado o mal organizado." },
  { id: "c36", seccion: "Sección 3 - Escala de valoración", descripcion: "Bloque 5: Esfuerzo requerido.", titulo: "Las explicaciones eran confusas o difíciles de seguir." },
  { id: "c37", seccion: "Sección 3 - Escala de valoración", descripcion: "Bloque 5: Esfuerzo requerido.", titulo: "Perdí tiempo tratando de entender cómo estaba armado el material." },
  { id: "c38", seccion: "Sección 3 - Escala de valoración", descripcion: "Bloque 5: Esfuerzo requerido.", titulo: "El estudio de ese material mejoró efectivamente mi comprensión." },
  { id: "c39", seccion: "Sección 3 - Escala de valoración", descripcion: "Bloque 5: Esfuerzo requerido.", titulo: "Las actividades propuestas ayudaron a consolidar los conceptos centrales." },
  { id: "c40", seccion: "Sección 3 - Escala de valoración", descripcion: "Bloque 5: Esfuerzo requerido.", titulo: "Al terminar sentí que podía aplicar lo aprendido a situaciones nuevas." },
  { id: "c41", seccion: "Sección 3 - Escala de valoración", descripcion: "Bloque 6: Correspondencia con la evaluación.", titulo: "¿Esa instancia incluyó alguna evaluación calificada?" },
  { id: "c42", seccion: "Sección 3 - Escala de valoración", descripcion: "Bloque 6: Correspondencia con la evaluación.", titulo: "La evaluación abordó los contenidos que efectivamente se trabajaron." },
  { id: "c43", seccion: "Sección 3 - Escala de valoración", descripcion: "Bloque 6: Correspondencia con la evaluación.", titulo: "La evaluación pidió más de lo que el material me preparaba para hacer." },
  { id: "c44", seccion: "Sección 3 - Escala de valoración", descripcion: "Bloque 6: Correspondencia con la evaluación.", titulo: "Hacer las actividades prácticas me sirvió para llegar mejor a la evaluación." },
  { id: "c45", seccion: "Sección 3 - Escala de valoración", descripcion: "Bloque 6: Correspondencia con la evaluación.", titulo: "Me sorprendió el tipo de preguntas que tenía la evaluación." },
  { id: "c46", seccion: "Sección 3 - Valoración final", descripcion: "Bloque 7: Conclusión general.", titulo: "En términos generales, considero que ese material estaba bien diseñado." },
  { id: "c47", seccion: "Sección 3 - Valoración final", descripcion: "Pregunta final de desarrollo.", titulo: "Si hubieras podido cambiar algo del material, ¿qué habrías cambiado y por qué?" }
];

export default function Dashboard() {
  const router = useRouter();
  const [cargando, setCargando] = useState(true);
  const [metricas, setMetricas] = useState<any>(null);
  const [listaRespuestas, setListaRespuestas] = useState<any[]>([]);
  const [vistaActiva, setVistaActiva] = useState<"dashboard" | "respuestas">("dashboard");

  useEffect(() => {
    const timestamp = new Date().getTime();
    
    Promise.all([
      fetch(`http://127.0.0.1:8000/api/dashboard-stats?t=${timestamp}`, { cache: "no-store" }).then(res => res.json()),
      fetch(`http://127.0.0.1:8000/api/respuestas/lista?t=${timestamp}`, { cache: "no-store" }).then(res => res.json())
    ])
    .then(([statsData, listaData]) => {
      setMetricas(statsData);
      setListaRespuestas(listaData);
      setCargando(false);
    })
    .catch(err => {
      console.error("Error al conectar con FastAPI:", err);
      setCargando(false);
    });
  }, []);

  const generarPDFIndividual = (encuesta: any) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margenIzq = 20;
    const anchoMax = pageWidth - 40;
    let y = 20;

    const verificarEspacio = (necesario: number) => {
      if (y + necesario > pageHeight - 20) {
        doc.addPage();
        y = 20;
      }
    };

    doc.setFillColor(86, 107, 246);
    doc.rect(0, 0, pageWidth, 16, "F");
    
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text("CPERD - Auditoría de Calidad Educativa (Proyecto de Tesis)", margenIzq, 11);

    y = 28;
    doc.setTextColor(30, 41, 59);
    doc.setFontSize(16);
    doc.text("Informe de Encuesta", margenIzq, y);
    
    y += 6;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    // SOLO FECHA DE EMISIÓN DEBAJO
    doc.text(`Fecha de emisión: ${encuesta.fecha}`, margenIzq, y);
    
    y += 8;
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.5);
    doc.line(margenIzq, y, pageWidth - margenIzq, y);
    y += 10;

    let seccionActual = "";
    let bloqueActual = "";

    preguntas.forEach((pregunta) => {
      const respuestaUsuario = encuesta.raw_data[pregunta.id];
      if (!respuestaUsuario) return;

      if (pregunta.seccion !== seccionActual) {
        seccionActual = pregunta.seccion;
        verificarEspacio(16);
        y += 4;
        
        doc.setFillColor(241, 245, 249);
        doc.roundedRect(margenIzq, y, anchoMax, 8, 1, 1, "F");
        
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9.5);
        doc.setTextColor(86, 107, 246);
        doc.text(seccionActual.toUpperCase(), margenIzq + 4, y + 5.5, { align: "left" });
        y += 13;
        bloqueActual = ""; 
      }

      if (pregunta.descripcion && pregunta.descripcion !== bloqueActual) {
        bloqueActual = pregunta.descripcion;
        verificarEspacio(12);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9);
        doc.setTextColor(71, 85, 105);
        
        const lineasBloque = doc.splitTextToSize(bloqueActual, anchoMax - 8);
        doc.setFillColor(248, 250, 252);
        doc.setDrawColor(226, 232, 240);
        doc.roundedRect(margenIzq, y - 3, anchoMax, (lineasBloque.length * 4) + 5, 1.5, 1.5, "FD");
        
        doc.text(lineasBloque, margenIzq + 4, y + 1);
        y += (lineasBloque.length * 4) + 7;
      }

      verificarEspacio(16);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9.5);
      doc.setTextColor(15, 23, 42);
      
      const lineasTitulo = doc.splitTextToSize(pregunta.titulo, anchoMax);
      doc.text(lineasTitulo, margenIzq, y);
      y += lineasTitulo.length * 4.5 + 1.5;

      doc.setFont("helvetica", "normal");
      doc.setTextColor(51, 65, 85);
      const lineasRespuesta = doc.splitTextToSize(`R: ${respuestaUsuario}`, anchoMax);
      doc.text(lineasRespuesta, margenIzq + 4, y);
      y += (lineasRespuesta.length * 4.5) + 5;
    });

    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);
      doc.text(
        `Página ${i} de ${totalPages}`,
        pageWidth - margenIzq,
        pageHeight - 10,
        { align: "right" }
      );
    }

    doc.save(`CPERD-${encuesta.id}.pdf`);
  };

  const exportarReporteGlobal = () => {
    if (!metricas || metricas.metricasCards[0].valor === "0") {
      alert("No hay datos suficientes para exportar un informe.");
      return;
    }

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let y = 20;

    const checkPageBreak = (spaceNeeded: number) => {
      if (y + spaceNeeded > pageHeight - 20) {
        doc.addPage();
        y = 20;
      }
    };

    doc.setFillColor(86, 107, 246);
    doc.rect(0, 0, pageWidth, 25, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("INFORME ESTADÍSTICO GLOBAL - PROYECTO CPERD", 20, 16);

    y = 40;
    doc.setTextColor(30, 41, 59);
    doc.setFontSize(18);
    doc.text("Auditoría de Calidad Educativa", 20, y);
    y += 8;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text(`Tesis: Josefina Chaves | Generado el: ${new Date().toLocaleString()}`, 20, y);
    y += 15;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(15, 23, 42);
    doc.text("1. MÉTRICAS GENERALES", 20, y);
    y += 8;
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Total de Encuestas: ${metricas.metricasCards[0].valor}`, 20, y);
    doc.text(`Promedio General: ${metricas.metricasCards[2].valor}`, 110, y);
    y += 8;
    doc.text(`Tasa de Completitud: ${metricas.metricasCards[1].valor}`, 20, y);
    
    const platTopText = `Plataforma Más Usada: ${metricas.metricasCards[3].valor}`;
    const platTopLines = doc.splitTextToSize(platTopText, 80);
    doc.text(platTopLines, 110, y);
    y += (platTopLines.length * 5) + 10;

    checkPageBreak(80);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("2. RESULTADOS POR BLOQUE (Escala 1 a 5)", 20, y);
    y += 15;

    const startX = 25;
    const chartHeight = 50;
    const barWidth = 14;
    const gap = 9;
    
    doc.setDrawColor(200, 200, 200);
    doc.line(startX, y, startX, y + chartHeight);
    doc.line(startX, y + chartHeight, pageWidth - 20, y + chartHeight);

    metricas.datosBloques.forEach((b: any, i: number) => {
       const barHeight = (b.Promedio / 5) * chartHeight;
       const currentX = startX + 5 + (barWidth + gap) * i;
       const currentY = y + chartHeight - barHeight;
       
       doc.setFillColor(86, 107, 246);
       doc.rect(currentX, currentY, barWidth, barHeight, "F");
       
       doc.setFontSize(8);
       doc.setTextColor(86, 107, 246);
       doc.text(b.Promedio.toString(), currentX + 3, currentY - 2);
       
       doc.setTextColor(100, 116, 139);
       const shortName = b.name.split(":")[0]; 
       doc.text(shortName, currentX + 3, y + chartHeight + 5);
    });
    y += chartHeight + 20;

    checkPageBreak(60);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(15, 23, 42);
    doc.text("3. DEMOGRAFÍA Y TECNOLOGÍA", 20, y);
    y += 10;
    
    let yPaises = y;
    let yModalidad = y;
    let yPlat = y;

    doc.setFontSize(10);
    doc.text("Top Países:", 20, yPaises);
    yPaises += 6;
    metricas.datosPaises?.forEach((p: any) => {
       doc.setFont("helvetica", "normal");
       const lineas = doc.splitTextToSize(`• ${p.nombre}: ${p.cantidad} encuestas`, 55);
       doc.text(lineas, 20, yPaises);
       yPaises += (lineas.length * 5) + 1;
    });

    doc.setFont("helvetica", "bold");
    doc.text("Modalidad:", 80, yModalidad);
    yModalidad += 6;
    metricas.datosModalidad?.forEach((m: any) => {
       doc.setFont("helvetica", "normal");
       const nombreMod = m.name.replace('con apoyo virtual.', '').replace('.', '');
       const lineas = doc.splitTextToSize(`• ${nombreMod}: ${m.value}`, 55);
       doc.text(lineas, 80, yModalidad);
       yModalidad += (lineas.length * 5) + 1;
    });

    doc.setFont("helvetica", "bold");
    doc.text("Plataformas:", 140, yPlat);
    yPlat += 6;
    metricas.datosPlataformas?.forEach((p: any) => {
       doc.setFont("helvetica", "normal");
       const lineas = doc.splitTextToSize(`• ${p.nombre}: ${p.porcentaje}`, 55);
       doc.text(lineas, 140, yPlat);
       yPlat += (lineas.length * 5) + 1;
    });
    
    y = Math.max(yPaises, yModalidad, yPlat) + 10;

    checkPageBreak(30);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(15, 23, 42);
    doc.text("4. REGISTRO DETALLADO DE RESPUESTAS", 20, y);
    y += 10;

    listaRespuestas.forEach((resp) => {
       checkPageBreak(40);
       doc.setFillColor(248, 250, 252);
       doc.roundedRect(20, y, pageWidth - 40, 30, 2, 2, "F");
       
       doc.setFont("helvetica", "bold");
       doc.setFontSize(9);
       doc.setTextColor(86, 107, 246);
       doc.text(`ID: ${resp.id}`, 25, y + 8);
       
       doc.setTextColor(15, 23, 42);
       doc.text(`Fecha: ${resp.fecha} | Promedio: ${resp.promedio}`, 80, y + 8);
       
       doc.setFont("helvetica", "normal");
       const instLines = doc.splitTextToSize(`Institución: ${resp.institucion}`, 110);
       doc.text(instLines, 25, y + 18);
       
       const modText = resp.modalidad.replace('con apoyo virtual.', '').replace('.', '');
       const modLines = doc.splitTextToSize(`Modalidad: ${modText}`, 50);
       doc.text(modLines, 140, y + 18);
       
       y += 35;
    });

    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);
      doc.text(`Página ${i} de ${totalPages} - Sistema de Auditoría CPERD`, pageWidth / 2, pageHeight - 10, { align: "center" });
    }

    doc.save("CPERD_Informe_Analitico.pdf");
  };

  if (cargando) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f4f7fe]">
        <div className="w-12 h-12 border-4 border-[#566bf6] border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600 font-medium">Sincronizando con la base de datos en tiempo real...</p>
      </div>
    );
  }

  if (!metricas) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f4f7fe]">
        <div className="bg-white p-8 rounded-xl shadow-sm text-center">
          <h2 className="text-xl font-bold text-gray-800 mb-2">Error de conexión</h2>
          <p className="text-gray-500">No se pudo conectar con el servidor FastAPI (127.0.0.1:8000).</p>
          <button onClick={() => router.push("/")} className="mt-4 px-6 py-2 bg-[#566bf6] text-white rounded-lg font-bold">Volver al inicio</button>
        </div>
      </div>
    );
  }

  const totalRespuestas = metricas.metricasCards?.[0]?.valor || "0";

  return (
    <div className="min-h-screen flex bg-[#f4f7fe] font-sans text-gray-800">
      
      {/* SIDEBAR LATERAL */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-gray-100 px-6 py-8">
        <div className="flex items-center gap-3 mb-12">
          <div className="w-8 h-8 bg-[#566bf6] rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
          </div>
          <span className="font-extrabold text-xl text-[#566bf6] tracking-wide">CPERD</span>
        </div>

        <nav className="flex-1 space-y-2">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 mt-8">Admin</p>
          <button 
            onClick={() => setVistaActiva("dashboard")} 
            className={`flex items-center gap-3 px-4 py-3 w-full text-left rounded-xl font-semibold transition-colors ${vistaActiva === "dashboard" ? "bg-[#f5f7ff] text-[#566bf6]" : "text-gray-500 hover:bg-gray-50"}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
            Dashboard
          </button>
          <button 
            onClick={() => setVistaActiva("respuestas")} 
            className={`flex items-center gap-3 px-4 py-3 w-full text-left rounded-xl font-semibold transition-colors ${vistaActiva === "respuestas" ? "bg-[#f5f7ff] text-[#566bf6]" : "text-gray-500 hover:bg-gray-50"}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            Respuestas
          </button>
          
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 mt-8">Sistema</p>
          <button 
            onClick={exportarReporteGlobal}
            className="flex items-center gap-3 px-4 py-3 w-full text-left text-gray-500 hover:bg-gray-50 rounded-xl font-medium transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            Exportar Datos
          </button>
        </nav>

        <button onClick={() => router.push("/")} className="mt-auto flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-red-50 hover:text-red-500 rounded-xl font-medium transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
          Salir al formulario
        </button>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* HEADER */}
        <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8 shrink-0">
          <div className="relative w-96 hidden md:block">
            <svg className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input type="text" placeholder="Buscar por institución, ID..." className="w-full bg-gray-50 rounded-full py-2.5 pl-10 pr-4 outline-none focus:ring-2 focus:ring-blue-100 transition-all text-sm" />
          </div>
          
          <div className="flex items-center gap-4 ml-auto">
            <div className="h-8 w-px bg-gray-200 mx-2"></div>
            <div className="flex items-center gap-3 cursor-pointer">
              <div className="w-10 h-10 bg-gradient-to-tr from-[#566bf6] to-[#818cf8] rounded-full flex items-center justify-center text-white font-bold shadow-md">
                JC
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-bold text-gray-800">Josefina Chaves</p>
                <p className="text-xs text-gray-500">Admin General</p>
              </div>
            </div>
          </div>
        </header>

        {/* ÁREA DE CONTENIDO SCROLLABLE */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          
          {vistaActiva === "dashboard" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
              <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
                <p className="text-sm text-gray-500 mt-1">Resumen en tiempo real de la base de datos SQLite.</p>
              </div>

              {totalRespuestas === "0" ? (
                <div className="bg-white p-10 rounded-2xl shadow-sm border border-gray-100 text-center mt-10">
                  <span className="text-4xl">📂</span>
                  <h3 className="text-xl font-bold text-gray-800 mt-4">La base de datos está vacía</h3>
                  <p className="text-gray-500 mt-2">Realizá al menos una encuesta completa en el frontend para ver los gráficos.</p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {metricas.metricasCards?.map((card: any, index: number) => (
                      <div key={index} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-500 mb-1">{card.titulo}</p>
                          <p className="text-2xl font-black text-gray-800">{card.valor}</p>
                        </div>
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl ${card.colorBg} ${card.colorTexto}`}>
                          {card.icono}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mb-8 w-full">
                    <div className="flex justify-between items-center mb-6">
                      <div>
                        <h3 className="text-lg font-bold text-gray-800">Resultados por Bloque de Evaluación</h3>
                        <p className="text-xs text-gray-500 mt-1">Promedio de escala 1 a 5</p>
                      </div>
                    </div>
                    <div className="h-72 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={metricas.datosBloques} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 11, fill: '#64748b'}} />
                          <YAxis domain={[0, 5]} axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                          <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                          <Bar dataKey="Promedio" fill="#566bf6" radius={[6, 6, 0, 0]} barSize={40} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 relative overflow-hidden">
                      <svg className="absolute -bottom-12 -right-12 w-56 h-56 text-blue-50 opacity-60" fill="currentColor" viewBox="0 0 24 24">
                         <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                      </svg>
                      <div className="flex justify-between items-center mb-6 relative z-10">
                        <h3 className="text-lg font-bold text-gray-800">Demografía Global</h3>
                        <span className="text-2xl">🌍</span>
                      </div>
                      <div className="space-y-4 relative z-10">
                        {metricas.datosPaises?.map((pais: any, index: number) => {
                          const porcentaje = Math.round((pais.cantidad / parseInt(totalRespuestas)) * 100);
                          return (
                            <div key={index} className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-xs">
                                {pais.nombre.substring(0, 2).toUpperCase()}
                              </div>
                              <div className="flex-1">
                                <div className="flex justify-between items-end mb-1">
                                  <span className="text-sm font-bold text-gray-700">{pais.nombre}</span>
                                  <span className="text-xs font-bold text-gray-500">{porcentaje}%</span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-1.5">
                                  <div className="bg-[#566bf6] h-1.5 rounded-full" style={{ width: `${porcentaje}%` }}></div>
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold text-gray-800">Plataformas Usadas</h3>
                      </div>
                      <div className="space-y-5">
                        {metricas.datosPlataformas?.map((plataforma: any, index: number) => (
                          <div key={index} className="flex items-center gap-4">
                            <div className="flex-1">
                              <div className="flex justify-between mb-1">
                                <span className="text-sm font-bold text-gray-700">{plataforma.nombre}</span>
                                <span className="text-xs font-bold text-gray-500">{plataforma.porcentaje}</span>
                              </div>
                              <div className="w-full bg-gray-100 rounded-full h-2">
                                <div className={`${plataforma.color} h-2 rounded-full`} style={{ width: plataforma.porcentaje }}></div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-lg font-bold text-gray-800">Modalidad Cursada</h3>
                      </div>
                      <div className="h-48 w-full relative flex flex-col items-center">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie data={metricas.datosModalidad} cx="50%" cy="50%" innerRadius={50} outerRadius={70} paddingAngle={4} dataKey="value" stroke="none">
                              {metricas.datosModalidad?.map((entry: any, index: number) => (
                                <Cell key={`cell-${index}`} fill={COLORES_PIE[index % COLORES_PIE.length]} />
                              ))}
                            </Pie>
                            <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                          </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center mt-[-5px]">
                          <p className="text-2xl font-black text-gray-800">{totalRespuestas}</p>
                        </div>
                      </div>
                      <div className="flex flex-wrap justify-center gap-3 mt-4">
                        {metricas.datosModalidad?.map((entry: any, index: number) => (
                          <div key={index} className="flex items-center gap-1.5 text-xs font-medium text-gray-600">
                            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORES_PIE[index % COLORES_PIE.length] }}></span>
                            {entry.name.replace('con apoyo virtual.', '').replace('.', '')}
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                </>
              )}
            </motion.div>
          )}

          {vistaActiva === "respuestas" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
              <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-800">Registro de Encuestas</h1>
                <p className="text-sm text-gray-500 mt-1">Historial detallado y descarga individual en PDF.</p>
              </div>

              {listaRespuestas.length === 0 ? (
                <div className="bg-white p-10 rounded-2xl shadow-sm border border-gray-100 text-center mt-10">
                  <span className="text-4xl">📂</span>
                  <h3 className="text-xl font-bold text-gray-800 mt-4">No hay respuestas aún</h3>
                  <p className="text-gray-500 mt-2">Realizá al menos una encuesta completa en el frontend.</p>
                </div>
              ) : (
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 overflow-hidden flex flex-col">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-gray-100">
                          <th className="pb-3 text-xs font-bold text-gray-400 uppercase tracking-wider pl-2">ID</th>
                          <th className="pb-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Fecha</th>
                          <th className="pb-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Institución</th>
                          <th className="pb-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Modalidad</th>
                          <th className="pb-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Promedio</th>
                          <th className="pb-3 text-xs font-bold text-gray-400 uppercase tracking-wider text-right pr-2">Acción</th>
                        </tr>
                      </thead>
                      <tbody>
                        {listaRespuestas.map((encuesta: any, index: number) => (
                          <tr key={index} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                            <td className="py-4 pl-2 text-sm font-bold text-[#566bf6]">{encuesta.id}</td>
                            <td className="py-4 text-sm font-medium text-gray-500">{encuesta.fecha}</td>
                            <td className="py-4">
                              <span className="font-semibold text-gray-800 text-sm truncate block max-w-[200px]" title={encuesta.institucion}>
                                {encuesta.institucion}
                              </span>
                            </td>
                            <td className="py-4">
                              <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-600">
                                {encuesta.modalidad.replace('con apoyo virtual.', '').replace('.', '')}
                              </span>
                            </td>
                            <td className="py-4 font-bold text-gray-800 text-sm">{encuesta.promedio}</td>
                            <td className="py-4 text-right pr-2">
                              <button
                                onClick={() => generarPDFIndividual(encuesta)}
                                className="p-2 text-gray-400 hover:text-[#566bf6] hover:bg-blue-50 rounded-lg transition-colors inline-flex items-center gap-2"
                                title="Descargar PDF"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                <span className="text-sm font-bold hidden xl:block">PDF</span>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </motion.div>
          )}

        </div>
      </main>
    </div>
  );
}