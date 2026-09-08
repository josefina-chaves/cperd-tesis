import localFont from 'next/font/local';
import './globals.css';

// Cargamos la fuente sin variables, usando su clase nativa
const fuenteSecundaria = localFont({
  src: './fonts/fuente-secundaria.ttf',
  display: 'swap',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      {/* Inyectamos la fuente directo en el cuerpo de la página */}
      <body className={fuenteSecundaria.className}>
        {children}
      </body>
    </html>
  );
}
export const metadata = {
  title: "CPERD | Investigación de tesis", 
  description: "Sistema de Auditoría de Calidad Educativa",
  // Esta es la línea clave que tenés que agregar:
  icons: {
    icon: '/favicon.png',
  },
};