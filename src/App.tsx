import { MusicPlayer } from './components/MusicPlayer';
import { SnakeGame } from './components/SnakeGame';
import { useEffect, useState } from 'react';

export default function App() {
  const [bootSequence, setBootSequence] = useState(true);
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    const bootLogs = [
      "INIT_SEQUENCE_START",
      "LOADING_KERNEL_MODULES...",
      "MOUNTING // NEUDURAL_LINK",
      "WARNING: CORRUPTION DETECTED IN SECTOR 7G",
      "BYPASSING SECURITY PROTOCOLS...",
      "ESTABLISHING AUDIO LINK...",
      "SNAKE_ENTITY: AWAKE",
      "SYSTEM_READY"
    ];

    let i = 0;
    const interval = setInterval(() => {
      if (i < bootLogs.length) {
        setLogs(prev => [...prev, bootLogs[i]]);
        i++;
      } else {
        clearInterval(interval);
        setTimeout(() => setBootSequence(false), 500);
      }
    }, 150);

    return () => clearInterval(interval);
  }, []);

  if (bootSequence) {
    return (
      <div className="min-h-screen bg-black text-[#0f0] p-8 font-mono flex flex-col justify-end text-2xl">
        <div className="noise-overlay" />
        <div className="scanlines absolute inset-0 pointer-events-none" />
        <div className="max-w-2xl relative z-10">
          {logs.map((log, index) => (
            <div key={index} className="mb-1">{`> ${log}`}</div>
          ))}
          <div className="animate-pulse mt-4">_</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white p-4 md:p-8 flex flex-col relative overflow-hidden">
      <div className="noise-overlay" />
      <div className="scanlines absolute inset-0" />
      
      <div className="relative z-10 max-w-6xl mx-auto w-full flex-1 flex flex-col gap-8 screen-tear">
        <header className="border-b-4 border-magenta-600 pb-4 flex justify-between items-end">
          <div>
            <div className="text-cyan-400 font-mono text-lg tracking-[0.5em] mb-2 uppercase">Entity Designation:</div>
            <h1 className="text-5xl md:text-8xl font-black text-white glitch-text uppercase tracking-tighter" data-text="Ouroboros.exe">Ouroboros.exe</h1>
          </div>
          <div className="text-right hidden sm:block">
            <div className="text-magenta-500 animate-pulse uppercase text-2xl font-bold">System: Compromised</div>
            <div className="text-cyan-400 text-lg mt-1">V. 0.0.9-FATAL</div>
          </div>
        </header>

        <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mt-4">
          <aside className="lg:col-span-4 flex flex-col gap-10 border-r-2 border-cyan-900/30 pr-0 lg:pr-8">
             <div className="border-2 border-cyan-500 bg-cyan-900/20 p-6 glitch-border">
               <h2 className="text-magenta-400 text-3xl font-bold border-b-2 border-magenta-500/50 pb-2 mb-4 uppercase glitch-text" data-text="Directives">Directives</h2>
               <ul className="text-cyan-100 space-y-4 text-xl">
                 <li className="flex items-center gap-2"><span className="text-magenta-500">{`>>`}</span> <span className="bg-cyan-900/50 px-2 py-1">[W][A][S][D]</span> TO ALTER TRAJECTORY</li>
                 <li className="flex items-center gap-2"><span className="text-magenta-500">{`>>`}</span> CONSUME DATA PACKETS</li>
                 <li className="flex items-center gap-2"><span className="text-magenta-500">{`>>`}</span> AVOID SELF-TERMINATION</li>
               </ul>
             </div>
             <MusicPlayer />
          </aside>

          <section className="lg:col-span-8 flex justify-center w-full">
            <SnakeGame />
          </section>
        </main>
      </div>
    </div>
  );
}
