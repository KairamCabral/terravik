import { AcademiaProvider } from '@/contexts/AcademiaContext';

export default function AcademiaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AcademiaProvider>{children}</AcademiaProvider>;
}
