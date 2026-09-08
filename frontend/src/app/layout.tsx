import type { Metadata } from 'next';
import '@/styles/globals.css';
import { Header } from '@/components/common/Header';
import { SmoothScrollProvider } from '@/components/common/SmoothScrollProvider';
import { BhodaAssistant } from '@/components/common/BhodaAssistant';

export const metadata: Metadata = {
  title: 'BhodBasha — AI Skill Intelligence for Official Statistics',
  description: 'AI-enabled multilingual skill intelligence and offline-first learning platform for India\'s Official Statistical System (MoSPI & NSSTA).',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: "try{document.documentElement.classList.remove('dark');localStorage.removeItem('theme');}catch(e){}",
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-[#FBFBFC] text-[#0F172A] antialiased selection:bg-orange-100 selection:text-[#9F3E07]">
        <SmoothScrollProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <BhodaAssistant />
          <footer className="border-t border-slate-200/80 bg-white py-8 text-center text-xs text-slate-500">
            <div className="heritage-container flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="font-serif font-bold text-sm text-[#9F3E07]">BhodBasha</span>
                <span className="text-slate-300">|</span>
                <span>Ministry of Statistics & Programme Implementation (MoSPI)</span>
              </div>
              <div className="flex items-center gap-4 text-[11px] font-mono">
                <span className="text-emerald-700 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  PWA Active
                </span>
                <span>•</span>
                <span>NSSTA TPAC Integrated</span>
                <span>•</span>
                <span>SIH 2026</span>
              </div>
            </div>
          </footer>
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
