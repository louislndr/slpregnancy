import Nav from '@/components/Nav';
import ProgramForm from '@/components/ProgramForm';

export default function NewProgramPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Nav />
      <main className="max-w-3xl mx-auto w-full px-6 py-8">
        <h1 style={{ fontFamily: 'Raleway, sans-serif', fontWeight: 700, fontSize: 26, color: '#4F4580', marginBottom: 24 }}>New Program</h1>
        <ProgramForm />
      </main>
    </div>
  );
}
