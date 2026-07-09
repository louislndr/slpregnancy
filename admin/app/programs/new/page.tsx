import Nav from '@/components/Nav';
import ProgramForm from '@/components/ProgramForm';

export default function NewProgramPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Nav />
      <main className="max-w-3xl mx-auto w-full px-6 py-8">
        <h1 className="text-2xl font-bold text-[#4F4580] mb-6">New Program</h1>
        <ProgramForm />
      </main>
    </div>
  );
}
