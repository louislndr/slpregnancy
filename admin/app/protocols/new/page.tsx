import Nav from '@/components/Nav';
import ProtocolForm from '@/components/ProtocolForm';

export default function NewProtocolPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Nav />
      <main className="max-w-3xl mx-auto w-full px-6 py-8">
        <h1 className="text-2xl font-bold text-[#4F4580] mb-6">New Session</h1>
        <ProtocolForm />
      </main>
    </div>
  );
}
