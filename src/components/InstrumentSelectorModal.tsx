import React, { useState } from 'react';
import { X, Check, Info, Music } from 'lucide-react';
import { INSTRUMENTOS } from '../data/instrumentsData';
import type { Instrumento } from '../data/instrumentsData';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  selectedInstrumento: Instrumento;
  onSelectInstrumento: (instrumento: Instrumento) => void;
}

export const InstrumentSelectorModal: React.FC<Props> = ({
  isOpen,
  onClose,
  selectedInstrumento,
  onSelectInstrumento,
}) => {
  const [categoriaAtiva, setCategoriaAtiva] = useState<string>('Todas');

  if (!isOpen) return null;

  const categorias = ['Todas', 'Cordas', 'Madeiras', 'Metais'];

  const instrumentosFiltrados = INSTRUMENTOS.filter((inst) => {
    if (categoriaAtiva === 'Todas') return true;
    if (categoriaAtiva === 'Cordas') return inst.categoria === 'Cordas' || inst.categoria === 'Cordas e Teclados';
    return inst.categoria === categoriaAtiva;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      {/* PrimeFaces Dialog */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden transition-colors duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/90">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Music className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              Selecione seu Instrumento
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              A ordem de acidentes e as escalas serão ajustadas para a transposição do seu instrumento na orquestra.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Categories (Prime SelectButton) */}
        <div className="px-5 sm:px-6 py-2.5 border-b border-slate-200 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-950/40 flex items-center gap-1.5 overflow-x-auto">
          {categorias.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoriaAtiva(cat)}
              className={`px-3 py-1 rounded-md text-xs font-semibold whitespace-nowrap transition-all ${
                categoriaAtiva === cat
                  ? 'bg-white dark:bg-slate-800 text-indigo-700 dark:text-indigo-300 shadow-2xs font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Instrument Grid */}
        <div className="p-4 sm:p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-3 flex-1">
          {instrumentosFiltrados.map((inst) => {
            const isSelected = selectedInstrumento.id === inst.id;
            return (
              <div
                key={inst.id}
                onClick={() => {
                  onSelectInstrumento(inst);
                  onClose();
                }}
                className={`p-3.5 sm:p-4 rounded-xl border text-left cursor-pointer transition-all duration-150 relative group flex flex-col justify-between ${
                  isSelected
                    ? 'bg-indigo-50/80 dark:bg-indigo-950/40 border-indigo-400 dark:border-indigo-500 shadow-xs'
                    : 'bg-white dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800/70'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className={`font-bold text-sm sm:text-base ${isSelected ? 'text-indigo-700 dark:text-indigo-300' : 'text-slate-900 dark:text-slate-100 group-hover:text-indigo-600'}`}>
                        {inst.nome}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{inst.voz} &bull; {inst.categoria}</p>
                    </div>
                    {isSelected && (
                      <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 line-clamp-2 leading-relaxed">
                    {inst.descricao}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-1.5 mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80">
                  <span className="text-[11px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-900 text-indigo-700 dark:text-indigo-300 border border-slate-200 dark:border-slate-700 font-mono font-semibold">
                    Afinação: {inst.afinacao}
                  </span>
                  <span className="text-[11px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                    {inst.clave}
                  </span>
                  <span className="text-[11px] px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 font-medium">
                    {inst.hinario}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Note */}
        <div className="px-5 sm:px-6 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/60 flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
          <Info className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
          <span>
            <strong>Observação CCB:</strong> O Contrabaixo Acústico não é utilizado nas congregações comuns. O Órgão Eletrônico é executado exclusivamente pelas irmãs organistas.
          </span>
        </div>

      </div>
    </div>
  );
};
