"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { jsPDF } from "jspdf"; 
import { useRouter } from "next/navigation"; 

// URL FIJA DE RENDER PARA EVITAR PROBLEMAS EN VERCEL
const API_URL = "https://cperd-backend.onrender.com";

const universidadesArgentina = [
  "Universidad Adventista del Plata (UAP)",
  "Universidad de Buenos Aires (UBA)",
  "Universidad Tecnológica Nacional (UTN)",
  "Universidad Nacional de Córdoba (UNC)",
  "Universidad Nacional de La Plata (UNLP)",
  "Universidad Nacional de Rosario (UNR)",
  "Universidad Nacional de Cuyo (UNCuyo)",
  "Universidad Nacional de Tucumán (UNT)",
  "Universidad Nacional del Litoral (UNL)",
  "Universidad Nacional del Sur (UNS)",
  "Universidad Nacional de Mar del Plata (UNMDP)",
  "Universidad Nacional de Quilmes (UNQ)",
  "Universidad Nacional de San Martín (UNSAM)",
  "Universidad Nacional de General Sarmiento (UNGS)",
  "Pontificia Universidad Católica Argentina (UCA)",
  "Universidad Argentina de la Empresa (UADE)",
  "Universidad de Palermo (UP)",
  "Universidad Siglo 21 (UES21)",
  "Universidad de San Andrés (UdeSA)",
  "Universidad Torcuato Di Tella (UTDT)",
  "Universidad del Salvador (USAL)",
  "Universidad Austral",
  "Universidad Nacional del Centro de la Pcia. de Bs. As. (UNICEN)"
];

const paises = [
  "Argentina", "Bolivia", "Brasil", "Chile", "Colombia", "Costa Rica", 
  "Cuba", "Ecuador", "El Salvador", "España", "Estados Unidos", "Guatemala", 
  "Honduras", "México", "Nicaragua", "Panamá", "Paraguay", "Perú", 
  "Puerto Rico", "República Dominicana", "Uruguay", "Venezuela"
];

const escalaValoracion = [
  "Totalmente en desacuerdo",
  "En desacuerdo",
  "Ni de acuerdo ni en desacuerdo",
  "De acuerdo",
  "Totalmente de acuerdo"
];

const preguntas = [
  { id: "c1", seccion: "Sección 1 - Estado académico", titulo: "C1. ¿Cuál es tu situación académica actual?", tipo: "radio", opciones: ["Estoy cursando.", "Terminé mis estudios.", "Están en pausa o los abandoné."] },
  { id: "c2", seccion: "Sección 1 - Estado académico", titulo: "C2. Nivel educativo de la última experiencia", tipo: "radio", opciones: ["Carrera de grado.", "Carrera de pregrado (terciaria, tecnicatura, superior, etc).", "Posgrado.", "Curso o capacitación de extensión."] },
  { id: "c3", seccion: "Sección 1 - Estado académico", titulo: "C3. Año de cursada (si ya terminaste, indicá el último que cursaste).", tipo: "radio", opciones: ["1°", "2°", "3°", "4°", "5° o superior."] },
  
  { id: "c4", seccion: "Sección 2 - Datos de contextualización", descripcion: "Ninguno de estos datos permitirá identificarte. No menciones tu nombre ni el de los docentes.", titulo: "C4. Institución donde cursaste.", tipo: "autocomplete", opciones: universidadesArgentina },
  { id: "c5", seccion: "Sección 2 - Datos de contextualización", descripcion: "Ninguno de estos datos permitirá identificarte. No menciones tu nombre ni el de los docentes.", titulo: "C5. País.", tipo: "autocomplete", opciones: paises },
  { id: "c6", seccion: "Sección 2 - Datos de contextualización", titulo: "C6. Área disciplinar", tipo: "radio", opciones: ["Ciencias exactas e ingenierías.", "Ciencias de la salud.", "Ciencias sociales y humanidades.", "Ciencias económicas.", "Arte y diseño."], permiteOtra: true },
  { id: "c7", seccion: "Sección 2 - Datos de contextualización", titulo: "C7. Modalidad predominante de cursada.", tipo: "radio", opciones: ["Presencial con apoyo virtual.", "Híbrida.", "Totalmente a distancia."] },
  { id: "c8", seccion: "Sección 2 - Datos de contextualización", titulo: "C8. ¿Los materiales, consignas o actividades se entregaban de forma digital?", descripcion: "Por ejemplo, a través de Moodle, Google Classroom, el campus o aula virtual de tu institución, Canvas, o incluso por Drive, correo o grupos de WhatsApp.", tipo: "radio", opciones: ["Sí, siempre o casi siempre.", "Sí, en algunas.", "No, todo era papel o presencial."] },
  { id: "c9", seccion: "Sección 2 - Datos de contextualización", titulo: "C9. ¿Qué usaban para acceder a los materiales? (podés marcar más de una).", tipo: "checkbox", opciones: ["Moodle", "Google Classroom", "El campus o aula virtual propia de la institución.", "Google Drive, correo o grupos de WhatsApp.", "Canvas.", "No me acuerdo."], permiteOtra: true },

  { id: "c10", seccion: "Sección 3 - La experiencia que vas a valorar", descripcion: "Pensá en una experiencia de estudio específica. Puede ser un tema que preparaste para un parcial/final, un trabajo práctico, o una materia en general. Elegí la más reciente que recuerdes con claridad, no la que más te costó ni la que más te gustó.", titulo: "C10. ¿A qué tipo de instancia corresponde?", tipo: "radio", opciones: ["Un examen o parcial.", "Un trabajo práctico.", "Unidad de una materia.", "Materia completa."], permiteOtra: true },
  { id: "c11", seccion: "Sección 3 - La experiencia que vas a valorar", titulo: "C11. ¿Cuánto tiempo pasó desde entonces?", tipo: "radio", opciones: ["Menos de un mes.", "Entre uno y seis meses.", "Entre seis meses y dos años.", "Más de dos años."] },
  { id: "c12", seccion: "Sección 3 - La experiencia que vas a valorar", titulo: "C12. ¿Cuánto sabías del tema antes de empezar?", tipo: "escala", opciones: ["Nada", "Poco", "Algo", "Bastante"] },
  { id: "c13", seccion: "Sección 3 - La experiencia que vas a valorar", titulo: "C13. ¿Cuánto tiempo le dedicaste en total?", tipo: "radio", opciones: ["Menos de 2 horas.", "Entre 2 y 5 horas.", "Entre 5 y 10 horas.", "Más de 10 horas."] },

  { id: "c14", seccion: "Sección 3 - Escala de valoración", descripcion: "Bloque 1: Comprensión de la tarea. Respondé en base al material de estudio con el que trabajaste, no en tu propio desempeño.", titulo: "Antes de empezar, entendí con claridad qué tenía que aprender o entregar.", tipo: "escala", opciones: escalaValoracion },
  { id: "c15", seccion: "Sección 3 - Escala de valoración", descripcion: "Bloque 1: Comprensión de la tarea.", titulo: "El material decía explícitamente qué se esperaba que aprendiera.", tipo: "escala", opciones: escalaValoracion },
  { id: "c16", seccion: "Sección 3 - Escala de valoración", descripcion: "Bloque 1: Comprensión de la tarea.", titulo: "Tuve que releer la consigna varias veces para entender qué se pedía.", tipo: "escala", opciones: escalaValoracion },
  { id: "c17", seccion: "Sección 3 - Escala de valoración", descripcion: "Bloque 1: Comprensión de la tarea.", titulo: "El material indicaba con qué criterios me iban a evaluar.", tipo: "escala", opciones: escalaValoracion },

  { id: "c18", seccion: "Sección 3 - Escala de valoración", descripcion: "Bloque 2: Organización del estudio.", titulo: "Pude estimar razonablemente cuánto tiempo me iba a llevar antes de empezar.", tipo: "escala", opciones: escalaValoracion },
  { id: "c19", seccion: "Sección 3 - Escala de valoración", descripcion: "Bloque 2: Organización del estudio.", titulo: "El material sugería un orden o una secuencia de trabajo.", tipo: "escala", opciones: escalaValoracion },
  { id: "c20", seccion: "Sección 3 - Escala de valoración", descripcion: "Bloque 2: Organización del estudio.", titulo: "La extensión real del trabajo fue bastante mayor que la anunciada.", tipo: "escala", opciones: escalaValoracion },
  { id: "c21", seccion: "Sección 3 - Escala de valoración", descripcion: "Bloque 2: Organización del estudio.", titulo: "Distribuí el estudio en varias sesiones planificadas.", tipo: "escala", opciones: escalaValoracion },

  { id: "c22", seccion: "Sección 3 - Escala de valoración", descripcion: "Bloque 3: Suficiencia del material.", titulo: "Con los materiales que dio el docente me alcanzaba para entender el tema.", tipo: "escala", opciones: escalaValoracion },
  { id: "c23", seccion: "Sección 3 - Escala de valoración", descripcion: "Bloque 3: Suficiencia del material.", titulo: "Para entender el tema necesité buscar información por fuera del material.", tipo: "escala", opciones: escalaValoracion },
  { id: "c24", seccion: "Sección 3 - Escala de valoración", descripcion: "Bloque 3: Suficiencia del material.", titulo: "Cuando tuve dudas, el material ofrecía vías claras para resolverlas.", tipo: "escala", opciones: escalaValoracion },
  { id: "c25", seccion: "Sección 3 - Escala de valoración", descripcion: "Bloque 3: Suficiencia del material.", titulo: "Consulté con mis compañeros porque el material no era suficientemente claro.", tipo: "escala", opciones: escalaValoracion },
  { id: "c26", seccion: "Sección 3 - Escala de valoración", descripcion: "Bloque 3: Suficiencia del material.", titulo: "Los ejemplos incluidos me ayudaron a aplicar los conceptos.", tipo: "escala", opciones: escalaValoracion },
  
  { id: "c27", seccion: "Sección 3 - Material Complementario", titulo: "¿Qué usaste además del material del docente para estudiar este tema? (Podés marcar más de una)", tipo: "checkbox", opciones: ["Videos de YouTube u otras plataformas.", "Apuntes o resúmenes de otros estudiantes.", "ChatGPT u otra herramienta de IA.", "Otras páginas webs o libros.", "Nada, solo el material del docente."], permiteOtra: true },

  { id: "c28", seccion: "Sección 3 - Escala de valoración", descripcion: "Bloque 4: Verificación de la comprensión.", titulo: "Durante el estudio pude verificar por mí mismo si estaba entendiendo.", tipo: "escala", opciones: escalaValoracion },
  { id: "c29", seccion: "Sección 3 - Escala de valoración", descripcion: "Bloque 4: Verificación de la comprensión.", titulo: "El material incluía instancias de práctica con devolución.", tipo: "escala", opciones: escalaValoracion },
  { id: "c30", seccion: "Sección 3 - Escala de valoración", descripcion: "Bloque 4: Verificación de la comprensión.", titulo: "Me di cuenta de que no había entendido el contenido recién al momento de ser evaluado.", tipo: "escala", opciones: escalaValoracion },
  { id: "c31", seccion: "Sección 3 - Escala de valoración", descripcion: "Bloque 4: Verificación de la comprensión.", titulo: "Cuando terminé de estudiar, sabía qué me faltaba repasar.", tipo: "escala", opciones: escalaValoracion },

  { id: "c32", seccion: "Sección 3 - Escala de valoración", descripcion: "Bloque 5: Esfuerzo requerido.", titulo: "El tema en sí era difícil, más allá de cómo estuviera explicado.", tipo: "escala", opciones: escalaValoracion },
  { id: "c33", seccion: "Sección 3 - Escala de valoración", descripcion: "Bloque 5: Esfuerzo requerido.", titulo: "El contenido tenía muchos elementos que había que relacionar al mismo tiempo.", tipo: "escala", opciones: escalaValoracion },
  { id: "c34", seccion: "Sección 3 - Escala de valoración", descripcion: "Bloque 5: Esfuerzo requerido.", titulo: "El contenido requería conocimientos previos que todavía no dominaba.", tipo: "escala", opciones: escalaValoracion },
  { id: "c35", seccion: "Sección 3 - Escala de valoración", descripcion: "Bloque 5: Esfuerzo requerido.", titulo: "El material estaba desordenado o mal organizado.", tipo: "escala", opciones: escalaValoracion },
  { id: "c36", seccion: "Sección 3 - Escala de valoración", descripcion: "Bloque 5: Esfuerzo requerido.", titulo: "Las explicaciones eran confusas o difíciles de seguir.", tipo: "escala", opciones: escalaValoracion },
  { id: "c37", seccion: "Sección 3 - Escala de valoración", descripcion: "Bloque 5: Esfuerzo requerido.", titulo: "Perdí tiempo tratando de entender cómo estaba armado el material, más que el tema en sí.", tipo: "escala", opciones: escalaValoracion },
  { id: "c38", seccion: "Sección 3 - Escala de valoración", descripcion: "Bloque 5: Esfuerzo requerido.", titulo: "El estudio de ese material mejoró efectivamente mi comprensión del tema.", tipo: "escala", opciones: escalaValoracion },
  { id: "c39", seccion: "Sección 3 - Escala de valoración", descripcion: "Bloque 5: Esfuerzo requerido.", titulo: "Las actividades propuestas ayudaron a consolidar los conceptos centrales.", tipo: "escala", opciones: escalaValoracion },
  { id: "c40", seccion: "Sección 3 - Escala de valoración", descripcion: "Bloque 5: Esfuerzo requerido.", titulo: "Al terminar sentí que podía aplicar lo aprendido a situaciones nuevas.", tipo: "escala", opciones: escalaValoracion },

  { id: "c41", seccion: "Sección 3 - Escala de valoración", descripcion: "Bloque 6: Correspondencia con la evaluación.", titulo: "¿Esa instancia incluyó alguna evaluación calificada (examen, trabajo práctico con nota u otra)?", tipo: "radio", opciones: ["Sí", "No"] },
  { id: "c42", seccion: "Sección 3 - Escala de valoración", descripcion: "Bloque 6: Correspondencia con la evaluación.", titulo: "La evaluación abordó los contenidos que efectivamente se trabajaron en el material.", tipo: "escala", opciones: escalaValoracion },
  { id: "c43", seccion: "Sección 3 - Escala de valoración", descripcion: "Bloque 6: Correspondencia con la evaluación.", titulo: "La evaluación pidió más de lo que el material me preparaba para hacer.", tipo: "escala", opciones: escalaValoracion },
  { id: "c44", seccion: "Sección 3 - Escala de valoración", descripcion: "Bloque 6: Correspondencia con la evaluación.", titulo: "Hacer las actividades prácticas me sirvió para llegar mejor a la evaluación.", tipo: "escala", opciones: escalaValoracion },
  { id: "c45", seccion: "Sección 3 - Escala de valoración", descripcion: "Bloque 6: Correspondencia con la evaluación.", titulo: "Me sorprendió el tipo de preguntas que tenía la evaluación.", tipo: "escala", opciones: escalaValoracion },

  { id: "c46", seccion: "Sección 3 - Valoración final", descripcion: "Bloque 7: Conclusión general.", titulo: "En términos generales, considero que ese material estaba bien diseñado.", tipo: "escala", opciones: escalaValoracion },
  { id: "c47", seccion: "Sección 3 - Valoración final", descripcion: "Pregunta final de desarrollo.", titulo: "Si hubieras podido cambiar algo del material, ¿qué habrías cambiado y por qué?", tipo: "textarea" }
];

export default function Home() {
  const router = useRouter(); 
  
  const [pasoActual, setPasoActual] = useState(0);
  const [direccion, setDireccion] = useState(1);
  const [aceptado, setAceptado] = useState(false);
  const [respuestas, setRespuestas] = useState<Record<string, any>>({});
  const [valoresOtra, setValoresOtra] = useState<Record<string, string>>({});
  
  const [estadoFinal, setEstadoFinal] = useState<"pendiente" | "temprano" | "completo">("pendiente");
  const [focoAutocomplete, setFocoAutocomplete] = useState<string | null>(null);
  const [indiceResaltado, setIndiceResaltado] = useState<number>(-1);
  const [linkCopiado, setLinkCopiado] = useState(false);

  // Estados para el Modal de Contraseña
  const [mostrarModalAdmin, setMostrarModalAdmin] = useState(false);
  const [inputPassword, setInputPassword] = useState("");
  const [errorPassword, setErrorPassword] = useState(false);

  useEffect(() => {
    if (indiceResaltado >= 0) {
      const elemento = document.getElementById(`opcion-autocomplete-${indiceResaltado}`);
      if (elemento) {
        elemento.scrollIntoView({ block: "nearest" });
      }
    }
  }, [indiceResaltado]);

  const avanzarPaso = async () => {
    const preguntaActual = preguntas[pasoActual - 1];
    
    if (pasoActual === preguntas.length) {
      try {
        const dataFinal = { ...respuestas };
        Object.keys(dataFinal).forEach(key => {
          if (dataFinal[key] === "Otra") {
            dataFinal[key] = `Otra: ${valoresOtra[key] || ""}`;
          } else if (Array.isArray(dataFinal[key]) && dataFinal[key].includes("Otra")) {
            const arr = [...dataFinal[key]];
            const index = arr.indexOf("Otra");
            arr[index] = `Otra: ${valoresOtra[key] || ""}`;
            dataFinal[key] = arr;
          }
        });

        await fetch(`${API_URL}/api/respuestas`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            fecha: new Date().toISOString(),
            data: dataFinal 
          }),
        });
        setEstadoFinal("completo");
      } catch (error) {
        console.error("Error al guardar la respuesta en el backend:", error);
        setEstadoFinal("completo"); 
      }
      return;
    }

    if (preguntaActual?.id === "c8" && respuestas["c8"] === "No, todo era papel o presencial.") {
      setEstadoFinal("temprano");
      return;
    }

    if (preguntaActual?.id === "c41" && respuestas["c41"] === "No") {
      const indexDestino = preguntas.findIndex(p => p.id === "c46");
      setDireccion(1);
      setPasoActual(indexDestino + 1);
      return;
    }

    setDireccion(1);
    setPasoActual((prev) => prev + 1);
  };

  const retrocederPaso = () => {
    const preguntaActual = preguntas[pasoActual - 1];
    setDireccion(-1);

    if (preguntaActual?.id === "c46" && respuestas["c41"] === "No") {
      const indexDestino = preguntas.findIndex(p => p.id === "c41");
      setPasoActual(indexDestino + 1);
      return;
    }

    setPasoActual((prev) => prev - 1);
  };

  const seleccionarOpcion = (id: string, valor: string) => {
    setRespuestas({ ...respuestas, [id]: valor });
  };

  const toggleCheckbox = (id: string, valor: string) => {
    let seleccionActual = respuestas[id] || [];

    if (valor === "Nada, solo el material del docente.") {
      if (!seleccionActual.includes(valor)) {
        setRespuestas({ ...respuestas, [id]: [valor] }); 
      } else {
        setRespuestas({ ...respuestas, [id]: [] });
      }
      return;
    }

    seleccionActual = seleccionActual.filter((v: string) => v !== "Nada, solo el material del docente.");

    if (seleccionActual.includes(valor)) {
      setRespuestas({ ...respuestas, [id]: seleccionActual.filter((v: string) => v !== valor) });
    } else {
      setRespuestas({ ...respuestas, [id]: [...seleccionActual, valor] });
    }
  };

  const manejarTextoOtra = (id: string, texto: string) => {
    setValoresOtra({ ...valoresOtra, [id]: texto });
  };

  const copiarEnlace = () => {
    navigator.clipboard.writeText("https://cperd-tesis.vercel.app/");
    setLinkCopiado(true);
    setTimeout(() => setLinkCopiado(false), 2000);
  };

  const descargarPDF = () => {
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
    doc.text("Informe de Encuesta CPERD", margenIzq, y);
    
    y += 6;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    doc.text(`Fecha de emisión: ${new Date().toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" })}`, margenIzq, y);
    
    y += 8;
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.5);
    doc.line(margenIzq, y, pageWidth - margenIzq, y);
    y += 10;

    let seccionActual = "";
    let bloqueActual = "";

    preguntas.forEach((pregunta) => {
      const respuestaUsuario = respuestas[pregunta.id];
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
        
        const tituloSeccionLimpio = seccionActual.replace(/→/g, "-").toUpperCase();
        doc.text(tituloSeccionLimpio, margenIzq + 4, y + 5.5, { align: "left" });
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

      let respuestaFinal = respuestaUsuario;
      if (Array.isArray(respuestaFinal)) {
        respuestaFinal = respuestaFinal.join(", ");
      }
      if (respuestaFinal === "Otra" || (Array.isArray(respuestaUsuario) && respuestaUsuario.includes("Otra"))) {
        respuestaFinal = `Otra: ${valoresOtra[pregunta.id] || ""}`;
      }

      doc.setFont("helvetica", "normal");
      doc.setTextColor(51, 65, 85);
      const lineasRespuesta = doc.splitTextToSize(`R: ${respuestaFinal}`, anchoMax);
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

    doc.save("mis-respuestas-cperd.pdf");
  };

  const puedeAvanzar = () => {
    if (pasoActual === 0) return aceptado;
    const p = preguntas[pasoActual - 1];
    if (!p) return false;
    const res = respuestas[p.id];

    if (p.tipo === "text" || p.tipo === "autocomplete" || p.tipo === "textarea") return res?.trim().length > 0;
    if (p.tipo === "radio" || p.tipo === "escala") {
      if (res === "Otra") return valoresOtra[p.id]?.trim().length > 0;
      return !!res;
    }
    if (p.tipo === "checkbox") {
      const checked = res || [];
      if (checked.includes("Otra")) return checked.length > 0 && valoresOtra[p.id]?.trim().length > 0;
      return checked.length > 0;
    }
    return false;
  };

  const variants = {
    entrar: (dir: number) => ({ x: dir > 0 ? 50 : -50, opacity: 0 }),
    centro: { x: 0, opacity: 1 },
    salir: (dir: number) => ({ x: dir > 0 ? -50 : 50, opacity: 0 })
  };

  const pActual = (pasoActual > 0 && pasoActual <= preguntas.length) ? preguntas[pasoActual - 1] : null;

  // VISTA FINAL
  if (estadoFinal !== "pendiente") {
    return (
      <main className="min-h-[100dvh] bg-[#eef1f6] flex items-center justify-center p-4 md:p-8 font-sans relative">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white p-6 sm:p-10 md:p-12 rounded-[2rem] md:rounded-[2.5rem] shadow-2xl shadow-blue-900/10 w-full max-w-2xl text-center border border-gray-100"
        >
          <div className="w-20 h-20 md:w-24 md:h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 md:mb-8 shadow-inner">
            {estadoFinal === "completo" ? (
              <span className="text-4xl md:text-5xl drop-shadow-sm">🎉</span>
            ) : (
              <svg className="w-8 h-8 md:w-10 md:h-10 text-[#566bf6]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
            )}
          </div>
          
          {estadoFinal === "completo" ? (
            <>
              <h2 className="text-2xl md:text-3xl font-extrabold text-gray-800 mb-3 md:mb-4 leading-tight">
                ¡Muchas gracias por tomarte el tiempo de responder! 😊
              </h2>
              <p className="text-gray-600 text-base md:text-lg leading-relaxed mb-6 md:mb-8">
                Si conocés a alguien más que haya cursado con plataformas virtuales, compartile la encuesta, me ayuda un montón para mi tesis.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4 mt-6 md:mt-8">
                <button 
                  onClick={copiarEnlace}
                  className={`px-6 py-3.5 md:px-8 md:py-4 rounded-full font-bold shadow-lg transition-all flex items-center justify-center gap-2 md:gap-3 w-full sm:w-auto text-sm md:text-base ${
                    linkCopiado 
                      ? "bg-green-500 text-white shadow-green-500/30 scale-105" 
                      : "bg-[#566bf6] hover:bg-[#4255d6] text-white shadow-blue-500/30 hover:-translate-y-0.5"
                  }`}
                >
                  {linkCopiado ? (
                    <>
                      <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                      ¡Enlace copiado!
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                      Compartir encuesta
                    </>
                  )}
                </button>

                <button 
                  onClick={descargarPDF}
                  className="px-6 py-3.5 md:px-8 md:py-4 rounded-full font-bold shadow-sm border-2 border-[#566bf6] text-[#566bf6] bg-white hover:bg-blue-50 transition-all flex items-center justify-center gap-2 md:gap-3 w-full sm:w-auto text-sm md:text-base hover:-translate-y-0.5"
                >
                  <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                  Descargar respuestas
                </button>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-3 md:mb-4 leading-tight">Muchas gracias por tu tiempo</h2>
              <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                Al no haber utilizado plataformas o materiales digitales, tu perfil no requiere contestar el resto del cuestionario. ¡Valoramos mucho tu disposición!
              </p>
            </>
          )}
        </motion.div>
      </main>
    );
  }

  // VISTA PRINCIPAL (ENCUESTA)
  return (
    <main className="min-h-[100dvh] bg-[#eef1f6] flex items-center justify-center p-0 sm:p-4 md:p-8 font-sans relative">
      <div className="w-full max-w-5xl bg-white sm:rounded-[2rem] shadow-2xl shadow-blue-900/10 overflow-hidden flex flex-col md:flex-row min-h-[100dvh] sm:min-h-[600px]">

        {/* BARRA LATERAL AZUL - Adaptable para Mobile */}
        <div className="w-full md:w-1/3 bg-gradient-to-b from-[#566bf6] to-[#4255d6] text-white p-6 md:p-10 flex flex-col justify-between rounded-b-[1.5rem] md:rounded-b-none md:rounded-r-[2.5rem] shadow-[0_4px_20px_rgba(0,0,0,0.1)] md:shadow-[10px_0_20px_-5px_rgba(0,0,0,0.1)] z-10 relative shrink-0">
          <div>
            <div className="flex items-center gap-3 mb-4 md:mb-10">
               <div className="w-8 h-8 md:w-10 md:h-10 bg-white/20 rounded-lg md:rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <svg className="w-5 h-5 md:w-6 md:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
               </div>
               <span className="font-bold text-lg md:text-xl tracking-wide">CPERD</span>
            </div>
            
            <h2 className="text-xl md:text-3xl font-bold mb-2 md:mb-5 leading-tight">Cuestionario de Percepción Estudiantil sobre Recursos Didácticos.</h2>
            
            <div className="hidden sm:block w-10 h-1 bg-white/30 rounded-full mb-5"></div>
            
            <p className="hidden sm:block text-blue-100 text-xs leading-relaxed">
              <span className="font-bold text-white">Proyecto de Tesis:</span> Diseño y desarrollo de un panel de control de Analítica y Aprendizaje para la auditoría y mejora continua del diseño pedagógico en entornos virtuales.
            </p>
          </div>

          <div className="mt-4 md:mt-8 flex flex-row md:flex-col gap-2 md:gap-3">
             <div className={`flex-1 md:flex-none flex items-center gap-2 md:gap-4 p-2.5 md:p-4 rounded-xl md:rounded-2xl transition-all justify-center md:justify-start ${pasoActual === 0 ? "bg-white text-[#566bf6] shadow-sm" : "opacity-60 text-white"}`}>
                <div className={`w-5 h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center font-bold text-[10px] md:text-xs ${pasoActual === 0 ? "bg-[#566bf6] text-white" : "border-2 border-white"}`}>
                  {pasoActual > 0 ? "✓" : "1"}
                </div>
                <span className={`text-xs md:text-sm ${pasoActual === 0 ? "font-bold" : "font-medium"}`}>Consentimiento</span>
             </div>
             
             <div className={`flex-1 md:flex-none flex items-center gap-2 md:gap-4 p-2.5 md:p-4 rounded-xl md:rounded-2xl transition-all justify-center md:justify-start ${pasoActual > 0 ? "bg-white text-[#566bf6] shadow-sm" : "opacity-60 text-white"}`}>
                <div className={`w-5 h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center font-bold text-[10px] md:text-xs ${pasoActual > 0 ? "bg-[#566bf6] text-white" : "border-2 border-white"}`}>2</div>
                <span className={`text-xs md:text-sm ${pasoActual > 0 ? "font-bold" : "font-medium"}`}>Cuestionario</span>
             </div>
          </div>
        </div>

        {/* CONTENEDOR PRINCIPAL DERECHO */}
        <div className="w-full md:w-2/3 flex-1 flex flex-col bg-white relative overflow-hidden min-h-[60vh] md:min-h-0">
          <AnimatePresence mode="wait" custom={direccion}>
            
            {pasoActual === 0 && (
              <motion.div key="intro" custom={direccion} initial="entrar" animate="centro" exit="salir" variants={variants} transition={{ duration: 0.3 }} className="p-6 sm:p-8 md:p-12 flex flex-col h-full justify-center absolute inset-0">
                <h1 className="text-2xl md:text-3xl font-extrabold text-gray-800 mb-4 md:mb-6">¡Hola! 😊</h1>
                <div className="text-gray-600 space-y-3 md:space-y-4 leading-relaxed text-sm md:text-[15px] overflow-y-auto pr-2 custom-scrollbar">
                  <p>Mi nombre es <span className="font-semibold text-gray-800">Josefina</span>, soy estudiante de la Licenciatura en Sistemas y me encuentro en la etapa final de mi carrera.</p>
                  <p>Te invito a colaborar en la investigación de mi proyecto de tesis, enfocado en el desarrollo de un sistema que evalúe la calidad pedagógica de las plataformas universitarias. La propuesta consiste en implementar un panel de control impulsado por la automatización de procesos para auditar la calidad de los entornos virtuales.</p>
                  <p><strong className="text-gray-800">No hace falta que estés cursando ahora:</strong> podés participar si estás estudiando, si ya terminaste o si dejaste tus estudios en pausa.</p>
                  <div className="bg-[#f5f7ff] p-4 rounded-xl border border-[#e0e7ff] text-xs md:text-sm mt-2">
                    <p className="font-semibold text-[#4255d6] mb-1">Tus respuestas son anónimas y no serán utilizadas para evaluar tu desempeño, sino exclusivamente con fines académicos.</p>
                    <p className="text-gray-600"><strong>Tiempo estimado: 8 a 10 min.</strong></p>
                  </div>
                </div>

                <label className="flex items-start gap-3 mt-6 md:mt-8 cursor-pointer group shrink-0">
                  <div className="relative flex items-center justify-center mt-0.5">
                    <input type="checkbox" className="peer sr-only" checked={aceptado} onChange={(e) => setAceptado(e.target.checked)} />
                    <div className="w-5 h-5 border-2 border-gray-300 rounded transition-colors peer-checked:bg-[#566bf6] peer-checked:border-[#566bf6] group-hover:border-[#566bf6]"></div>
                    <svg className="absolute w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <span className="text-sm md:text-[15px] font-medium text-gray-700 select-none group-hover:text-gray-900 transition-colors">Leí lo anterior, tengo 18 años o más y acepto participar.</span>
                </label>

                <div className="mt-6 md:mt-8 flex justify-end shrink-0">
                  <button disabled={!aceptado} onClick={avanzarPaso} className={`w-full md:w-auto px-8 py-3 rounded-full font-bold shadow-lg transition-all transform text-sm md:text-base ${aceptado ? "bg-[#566bf6] hover:bg-[#4255d6] text-white shadow-blue-500/30 hover:-translate-y-0.5 cursor-pointer" : "bg-gray-200 text-gray-400 shadow-none cursor-not-allowed"}`}>
                    Comenzar Encuesta
                  </button>
                </div>
              </motion.div>
            )}

            {pActual && (
              <motion.div key={`pregunta-${pasoActual}`} custom={direccion} initial="entrar" animate="centro" exit="salir" variants={variants} transition={{ duration: 0.3 }} className="p-6 sm:p-8 md:p-12 flex flex-col h-full absolute inset-0">
                
                <div className="mb-4 md:mb-6 shrink-0">
                  <span className="text-[#566bf6] font-bold text-xs md:text-sm tracking-wider uppercase block mb-2 md:mb-3">
                    {pActual.seccion}
                  </span>
                  
                  {pActual.descripcion ? (
                    <>
                      <h2 className="text-xl md:text-2xl font-bold text-gray-800 leading-snug mb-3 md:mb-4">
                        {pActual.descripcion}
                      </h2>
                      <div className="bg-[#f5f7ff] p-3 md:p-4 rounded-xl border border-[#e0e7ff]">
                        <p className="text-[#4255d6] text-sm md:text-[16px] font-semibold leading-relaxed">
                          {pActual.titulo}
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <h2 className="text-xl md:text-2xl font-bold text-gray-800 leading-snug">
                        {pActual.titulo}
                      </h2>
                    </>
                  )}
                </div>

                <div className="flex-1 space-y-3 overflow-y-auto pr-2 custom-scrollbar">
                  
                  {pActual.tipo === "autocomplete" && (() => {
                    const id = pActual.id;
                    const valorActual = respuestas[id] || "";
                    const opcionesFiltradas = pActual.opciones?.filter((opcion) => 
                      opcion.toLowerCase().includes(valorActual.toLowerCase())
                    ) || [];
                    
                    const coincidenciaExacta = opcionesFiltradas.length === 1 && opcionesFiltradas[0] === valorActual;
                    const mostrarDropdown = valorActual.length >= 3 && !coincidenciaExacta && focoAutocomplete === id;

                    return (
                      <div className="relative">
                        <input 
                          type="text" 
                          placeholder="Escribí al menos 3 letras..."
                          value={valorActual}
                          onFocus={() => {
                            setFocoAutocomplete(id);
                            setIndiceResaltado(-1);
                          }}
                          onBlur={() => setTimeout(() => {
                            setFocoAutocomplete(null);
                            setIndiceResaltado(-1);
                          }, 200)}
                          onChange={(e) => {
                            seleccionarOpcion(id, e.target.value);
                            setIndiceResaltado(-1);
                          }}
                          onKeyDown={(e) => {
                            if (!mostrarDropdown) return;
                            if (e.key === "ArrowDown") {
                              e.preventDefault();
                              setIndiceResaltado((prev) => Math.min(prev + 1, opcionesFiltradas.length));
                            } else if (e.key === "ArrowUp") {
                              e.preventDefault();
                              setIndiceResaltado((prev) => Math.max(prev - 1, -1));
                            } else if (e.key === "Enter") {
                              e.preventDefault();
                              if (indiceResaltado >= 0 && indiceResaltado < opcionesFiltradas.length) {
                                seleccionarOpcion(id, opcionesFiltradas[indiceResaltado]);
                              } else {
                                seleccionarOpcion(id, valorActual);
                              }
                              setFocoAutocomplete(null);
                            }
                          }}
                          className="w-full p-3 md:p-4 rounded-xl border-2 border-gray-200 focus:border-[#566bf6] focus:ring-0 outline-none transition-all text-gray-700 font-medium text-sm md:text-base"
                        />
                        
                        {mostrarDropdown && (
                          <div className="absolute z-50 w-full mt-2 bg-white border-2 border-gray-100 rounded-xl shadow-lg max-h-48 md:max-h-60 overflow-y-auto text-sm md:text-base">
                            {opcionesFiltradas.map((opcion, index) => (
                              <div 
                                key={index} 
                                id={`opcion-autocomplete-${index}`}
                                onClick={() => seleccionarOpcion(id, opcion)} 
                                className={`px-4 py-3 cursor-pointer font-medium border-b border-gray-50 transition-colors ${indiceResaltado === index ? "bg-[#f5f7ff] text-[#4255d6] border-l-4 border-l-[#566bf6]" : "text-gray-700 hover:bg-[#f5f7ff]"}`}
                              >
                                {opcion}
                              </div>
                            ))}
                            <div 
                              id={`opcion-autocomplete-${opcionesFiltradas.length}`}
                              onClick={() => seleccionarOpcion(id, valorActual)} 
                              className={`px-4 py-3 cursor-pointer font-bold border-t border-blue-100 transition-colors flex items-center justify-between ${indiceResaltado === opcionesFiltradas.length ? "bg-blue-100 text-[#4255d6] border-l-4 border-l-[#566bf6]" : "bg-blue-50 text-[#566bf6] hover:bg-blue-100"}`}
                            >
                              <span>+ Usar "{valorActual}"</span>
                              <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })()}

                  {/* DISEÑO RESPONSIVO DE ESCALA */}
                  {pActual.tipo === "escala" && (() => {
                    const id = pActual.id;
                    const opciones = pActual.opciones || [];
                    const valorActual = respuestas[id];
                    const indiceSeleccionado = valorActual ? opciones.indexOf(valorActual) : -1;
                    
                    const porcentajeLlenado = indiceSeleccionado !== -1 
                      ? (indiceSeleccionado / (opciones.length - 1)) * 100 
                      : 0;

                    return (
                      <div className="pb-14 pt-6 md:pb-16 md:pt-8 px-1 sm:px-2 md:px-6 mt-2 md:mt-4">
                        <div className="relative flex justify-between items-center w-full">
                          <div className="absolute top-1/2 left-0 w-full h-1.5 bg-gray-200 -translate-y-1/2 z-0 rounded-full"></div>
                          
                          <div 
                            className="absolute top-1/2 left-0 h-1.5 bg-[#566bf6] -translate-y-1/2 z-0 rounded-full transition-all duration-300"
                            style={{ width: `${porcentajeLlenado}%` }}
                          ></div>
                          
                          {opciones.map((opcion, index) => {
                            const estaSeleccionada = valorActual === opcion;
                            const estaActiva = indiceSeleccionado >= index;

                            return (
                              <div key={index} className="relative z-10 flex flex-col items-center gap-2 md:gap-3" onClick={() => seleccionarOpcion(id, opcion)}>
                                <div className={`w-6 h-6 md:w-8 md:h-8 rounded-full border-[3px] md:border-4 cursor-pointer transition-all duration-300 flex items-center justify-center ${estaSeleccionada ? "border-[#566bf6] bg-white scale-125 shadow-md" : (estaActiva ? "border-[#566bf6] bg-white hover:border-[#4255d6]" : "border-gray-300 bg-white hover:border-[#a0aef8]")}`}>
                                  {estaSeleccionada && <div className="w-2 h-2 md:w-2.5 md:h-2.5 bg-[#566bf6] rounded-full"></div>}
                                </div>
                                <span className={`text-[9px] sm:text-[10px] md:text-xs font-bold absolute top-8 md:top-10 text-center w-14 sm:w-16 md:w-20 leading-tight transition-colors duration-300 ${estaSeleccionada ? "text-[#566bf6]" : "text-gray-400"}`}>
                                  {opcion}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })()}

                  {pActual.tipo === "text" && (
                    <input 
                      type="text" 
                      placeholder="Escribí tu respuesta aquí..."
                      value={respuestas[pActual.id] || ""}
                      onChange={(e) => seleccionarOpcion(pActual.id, e.target.value)}
                      className="w-full p-3 md:p-4 rounded-xl border-2 border-gray-200 focus:border-[#566bf6] focus:ring-0 outline-none transition-all text-gray-700 font-medium text-sm md:text-base"
                    />
                  )}

                  {pActual.tipo === "textarea" && (
                    <textarea 
                      placeholder="Escribí tu respuesta aquí..."
                      value={respuestas[pActual.id] || ""}
                      onChange={(e) => seleccionarOpcion(pActual.id, e.target.value)}
                      className="w-full p-3 md:p-4 rounded-xl border-2 border-gray-200 focus:border-[#566bf6] focus:ring-0 outline-none transition-all text-gray-700 font-medium resize-none h-24 md:h-32 custom-scrollbar text-sm md:text-base"
                    />
                  )}

                  {pActual.tipo === "radio" && pActual.opciones?.map((opcion, index) => {
                    const id = pActual.id;
                    const estaSeleccionada = respuestas[id] === opcion;
                    return (
                      <div key={index} onClick={() => seleccionarOpcion(id, opcion)} className={`p-3 md:p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center gap-3 md:gap-4 ${estaSeleccionada ? "border-[#566bf6] bg-[#f5f7ff]" : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"}`}>
                        <div className={`w-4 h-4 md:w-5 md:h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${estaSeleccionada ? "border-[#566bf6]" : "border-gray-300"}`}>
                          {estaSeleccionada && <div className="w-2 h-2 md:w-2.5 md:h-2.5 bg-[#566bf6] rounded-full"></div>}
                        </div>
                        <span className={`font-medium text-sm md:text-base ${estaSeleccionada ? "text-[#4255d6]" : "text-gray-700"}`}>{opcion}</span>
                      </div>
                    );
                  })}

                  {pActual.tipo === "checkbox" && pActual.opciones?.map((opcion, index) => {
                    const id = pActual.id;
                    const seleccionados = respuestas[id] || [];
                    const estaSeleccionada = seleccionados.includes(opcion);
                    return (
                      <div key={index} onClick={() => toggleCheckbox(id, opcion)} className={`p-3 md:p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center gap-3 md:gap-4 ${estaSeleccionada ? "border-[#566bf6] bg-[#f5f7ff]" : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"}`}>
                        <div className={`w-4 h-4 md:w-5 md:h-5 rounded-[4px] border-2 flex items-center justify-center shrink-0 ${estaSeleccionada ? "bg-[#566bf6] border-[#566bf6]" : "border-gray-300"}`}>
                          {estaSeleccionada && <svg className="w-3 h-3 md:w-3.5 md:h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                        </div>
                        <span className={`font-medium text-sm md:text-base ${estaSeleccionada ? "text-[#4255d6]" : "text-gray-700"}`}>{opcion}</span>
                      </div>
                    );
                  })}

                  {pActual.permiteOtra && (
                    <div className="flex flex-col gap-2 mt-2">
                      <div onClick={() => pActual.tipo === "radio" ? seleccionarOpcion(pActual.id, "Otra") : toggleCheckbox(pActual.id, "Otra")} className={`p-3 md:p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center gap-3 md:gap-4 ${(pActual.tipo === "radio" ? respuestas[pActual.id] === "Otra" : (respuestas[pActual.id] || []).includes("Otra")) ? "border-[#566bf6] bg-[#f5f7ff]" : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"}`}>
                        <div className={`w-4 h-4 md:w-5 md:h-5 flex items-center justify-center border-2 shrink-0 ${pActual.tipo === "radio" ? "rounded-full" : "rounded-[4px]"} ${(pActual.tipo === "radio" ? respuestas[pActual.id] === "Otra" : (respuestas[pActual.id] || []).includes("Otra")) ? (pActual.tipo === "radio" ? "border-[#566bf6]" : "bg-[#566bf6] border-[#566bf6]") : "border-gray-300"}`}>
                          {pActual.tipo === "radio" && respuestas[pActual.id] === "Otra" && <div className="w-2 h-2 md:w-2.5 md:h-2.5 bg-[#566bf6] rounded-full"></div>}
                          {pActual.tipo === "checkbox" && (respuestas[pActual.id] || []).includes("Otra") && <svg className="w-3 h-3 md:w-3.5 md:h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                        </div>
                        <span className={`font-medium text-sm md:text-base ${(pActual.tipo === "radio" ? respuestas[pActual.id] === "Otra" : (respuestas[pActual.id] || []).includes("Otra")) ? "text-[#4255d6]" : "text-gray-700"}`}>Otra</span>
                      </div>
                      
                      {((pActual.tipo === "radio" && respuestas[pActual.id] === "Otra") || 
                        (pActual.tipo === "checkbox" && (respuestas[pActual.id] || []).includes("Otra"))) && (
                        <input 
                          type="text" 
                          placeholder="Por favor, especificá..."
                          value={valoresOtra[pActual.id] || ""}
                          onChange={(e) => manejarTextoOtra(pActual.id, e.target.value)}
                          className="w-full p-3 ml-2 rounded-lg border-2 border-[#566bf6]/30 focus:border-[#566bf6] outline-none text-sm transition-all"
                          autoFocus
                        />
                      )}
                    </div>
                  )}
                </div>

                <div className="mt-4 md:mt-8 flex items-center justify-between border-t border-gray-100 pt-4 md:pt-6 shrink-0">
                  <button 
                    onClick={retrocederPaso}
                    className="flex items-center gap-1.5 md:gap-2 text-gray-500 hover:text-[#566bf6] font-semibold transition-colors px-3 py-2 md:px-4 md:py-2 rounded-lg hover:bg-blue-50 text-sm md:text-base"
                  >
                    <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                    Volver
                  </button>

                  <button 
                    disabled={!puedeAvanzar()} onClick={avanzarPaso}
                    className={`px-6 py-2.5 md:px-8 md:py-3 rounded-full font-bold shadow-lg transition-all transform text-sm md:text-base ${puedeAvanzar() ? "bg-[#566bf6] hover:bg-[#4255d6] text-white shadow-blue-500/30 hover:-translate-y-0.5 cursor-pointer" : "bg-gray-200 text-gray-400 shadow-none cursor-not-allowed"}`}
                  >
                    {pasoActual === preguntas.length ? "Finalizar" : "Siguiente"}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* BOTÓN Y MODAL RESTAURADOS EN LA VISTA PRINCIPAL */}
      <button
        onClick={() => {
          setInputPassword("");
          setErrorPassword(false);
          setMostrarModalAdmin(true);
        }}
        className="fixed bottom-4 right-4 md:bottom-6 md:right-6 w-10 h-10 md:w-12 md:h-12 bg-gray-900 text-white rounded-full flex items-center justify-center shadow-2xl hover:bg-gray-800 transition-all z-50 opacity-30 hover:opacity-100 focus:outline-none"
        title="Panel de Control (Solo Admin)"
      >
        <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </button>

      {mostrarModalAdmin && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[2rem] p-6 md:p-8 max-w-[90%] md:max-w-sm w-full shadow-2xl border border-gray-100">
            <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-1 md:mb-2">Acceso Restringido</h3>
            <p className="text-xs md:text-sm text-gray-500 mb-4 md:mb-6">Ingrese la contraseña de administrador:</p>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              if (inputPassword === "44321969") {
                setMostrarModalAdmin(false);
                router.push("/dashboard");
              } else {
                setErrorPassword(true);
              }
            }}>
              <input 
                type="password"
                autoFocus
                placeholder="••••••••"
                value={inputPassword}
                onChange={(e) => {
                  setInputPassword(e.target.value);
                  setErrorPassword(false);
                }}
                className={`w-full p-3 md:p-4 rounded-xl border-2 outline-none text-center text-base md:text-lg tracking-widest font-bold mb-2 transition-all ${errorPassword ? "border-red-500 bg-red-50" : "border-gray-200 focus:border-[#566bf6]"}`}
              />
              
              {errorPassword && (
                <p className="text-red-500 text-xs font-semibold mb-4 text-center">Contraseña incorrecta.</p>
              )}

              <div className="flex gap-2 md:gap-3 mt-4">
                <button 
                  type="button"
                  onClick={() => setMostrarModalAdmin(false)}
                  className="flex-1 py-2.5 md:py-3 rounded-xl font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors text-sm md:text-base"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-2.5 md:py-3 rounded-xl font-bold bg-[#566bf6] hover:bg-[#4255d6] text-white shadow-lg shadow-blue-500/30 transition-all text-sm md:text-base"
                >
                  Ingresar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}