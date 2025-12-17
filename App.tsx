import React, { useState, useRef } from 'react';
import { 
  Zap, 
  Search, 
  FileText, 
  CheckCircle, 
  MessageSquare, 
  Trash2, 
  AlertTriangle,
  Lightbulb,
  Settings,
  ChevronDown
} from 'lucide-react';
import { analyzeRejection } from './services/geminiService';
import { AnalysisResult, AnalysisTone } from './types';
import { Button } from './components/Button';
import { ResultCard } from './components/ResultCard';

const App: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [tone, setTone] = useState<AnalysisTone>(AnalysisTone.FORMAL);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Focus reference for accessibility
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleAnalyze = async () => {
    if (!inputText.trim()) return;
    
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await analyzeRejection(inputText, tone);
      setResult(data);
      // Scroll to results on mobile
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } catch (err: any) {
      setError(err.message || "Ocurrió un error al analizar el rechazo.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setInputText('');
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-12">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
              <Zap size={20} fill="currentColor" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent">
                GoSocket Smart Analyzer
              </h1>
              <p className="text-xs text-slate-500 hidden sm:block">Asistente de Gestión de Rechazos O2C</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
             <div className="hidden md:flex items-center px-3 py-1 bg-slate-100 rounded-full text-xs font-medium text-slate-600">
                <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                Gemini 2.5 Flash Connected
             </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-12 gap-8">
          
          {/* Left Column: Input Panel */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full">
              <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                <h2 className="font-semibold text-slate-700 flex items-center gap-2">
                  <Settings size={18} />
                  Entrada de Datos
                </h2>
                <div className="flex gap-2">
                   <select 
                    value={tone}
                    onChange={(e) => setTone(e.target.value as AnalysisTone)}
                    className="text-xs border-slate-300 rounded-md py-1 pl-2 pr-6 bg-white focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                  >
                    {Object.values(AnalysisTone).map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="p-4 flex-grow flex flex-col">
                <label className="block text-sm font-medium text-slate-600 mb-2">
                  Pegue el log de error, XML o mensaje de GoSocket:
                </label>
                <textarea
                  className="w-full flex-grow min-h-[250px] p-4 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none font-mono text-sm bg-slate-50 placeholder:text-slate-400 transition-shadow"
                  placeholder={`Ejemplo:\nError 302: El campo 'TaxCode' es obligatorio para facturas tipo '01'.\nXML Line: 450 <TaxAmount>0.00</TaxAmount>...`}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                />
              </div>

              <div className="p-4 bg-slate-50 border-t border-slate-100 grid grid-cols-2 gap-3">
                <Button 
                  onClick={handleClear} 
                  variant="secondary" 
                  icon={<Trash2 size={16} />}
                  disabled={!inputText}
                >
                  Limpiar
                </Button>
                <Button 
                  onClick={handleAnalyze} 
                  variant="primary" 
                  isLoading={isLoading}
                  disabled={!inputText.trim()}
                  icon={<Search size={16} />}
                >
                  Analizar Rechazo
                </Button>
              </div>
            </div>
          </div>

          {/* Right Column: Results Display */}
          <div className="lg:col-span-7" ref={resultsRef}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-3 mb-6 animate-fade-in">
                <AlertTriangle size={20} className="flex-shrink-0" />
                <p>{error}</p>
              </div>
            )}

            {!result && !isLoading && !error && (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 rounded-xl p-12 bg-slate-50/50">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                  <Lightbulb size={32} className="text-blue-200" />
                </div>
                <p className="text-lg font-medium text-slate-500">Esperando análisis...</p>
                <p className="text-sm mt-2 text-center max-w-xs">
                  Ingrese el mensaje de error de GoSocket para obtener un diagnóstico instantáneo con Gemini AI.
                </p>
              </div>
            )}

            {isLoading && !result && (
              <div className="h-full flex flex-col items-center justify-center p-12">
                 <div className="relative w-20 h-20 mb-6">
                    <div className="absolute inset-0 border-4 border-slate-100 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Zap size={24} className="text-blue-500 animate-pulse" />
                    </div>
                 </div>
                 <h3 className="text-lg font-semibold text-slate-700">Analizando con Gemini...</h3>
                 <p className="text-slate-500 mt-2">Interpretando códigos de error y estructura XML</p>
              </div>
            )}

            {result && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-slide-up">
                
                {/* 1. Summary */}
                <ResultCard 
                  title="Resumen del Rechazo"
                  icon={<FileText size={20} />}
                  color="blue"
                  content={result.summary}
                />

                {/* 2. Root Cause */}
                <ResultCard 
                  title="Causa Raíz Probable"
                  icon={<AlertTriangle size={20} />}
                  color="amber"
                  content={result.rootCause}
                />

                {/* 3. Actions */}
                <ResultCard 
                  title="Acciones Recomendadas"
                  icon={<CheckCircle size={20} />}
                  color="emerald"
                  content={result.actions}
                />

                {/* 4. Professional Comment */}
                <div className="md:col-span-2">
                  <ResultCard 
                    title={`Comentario Sugerido (${tone})`}
                    icon={<MessageSquare size={20} />}
                    color="purple"
                    content={result.professionalComment}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;