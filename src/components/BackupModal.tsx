import React, { useState } from 'react';
import { X, Download, Upload, Trash2, AlertTriangle } from 'lucide-react';
import type { RegistroProgresso } from '../types';
import type { Instrumento } from '../data/instrumentsData';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  instrumento: Instrumento;
  registros: Record<number, RegistroProgresso>;
  onImportData: (data: Record<number, RegistroProgresso>) => void;
  onResetData: () => void;
}

export const BackupModal: React.FC<Props> = ({
  isOpen,
  onClose,
  instrumento,
  registros,
  onImportData,
  onResetData,
}) => {
  const [jsonInput, setJsonInput] = useState('');
  const [confirmReset, setConfirmReset] = useState(false);

  if (!isOpen) return null;

  const handleExportJson = () => {
    const backupObj = {
      app: 'Portal CCB Música - Hinário 5, MSA e Métodos',
      instrumentoId: instrumento.id,
      instrumentoNome: instrumento.nome,
      exportadoEm: new Date().toISOString(),
      registros,
    };
    const jsonStr = JSON.stringify(backupObj, null, 2);
    
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `progresso-ccb-${instrumento.id}-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJson = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      const dataToImport = parsed.registros || parsed;
      if (typeof dataToImport === 'object') {
        onImportData(dataToImport);
        alert('Progresso importado com sucesso!');
        onClose();
      } else {
        alert('Formato de JSON inválido.');
      }
    } catch {
      alert('Erro ao interpretar JSON. Verifique o conteúdo colado.');
    }
  };

  const totalAprendidos = Object.values(registros).filter(r => r.inteiro === 'aprendido' || r.intro === 'aprendido').length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      {/* PrimeFaces Dialog */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden transition-colors duration-200">
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/90">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Download className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              Gerenciamento de Dados e Backup
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Seus dados ficam salvos localmente neste navegador. Faça backup para não perder o progresso.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 sm:p-6 space-y-5">
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-500 dark:text-slate-400 block">Instrumento Atual:</span>
              <span className="text-sm font-bold text-indigo-700 dark:text-indigo-300">{instrumento.nome}</span>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-500 dark:text-slate-400 block">Hinos Marcados:</span>
              <span className="text-sm font-bold text-slate-900 dark:text-white font-mono">{totalAprendidos} hinos</span>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Download className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              1. Exportar Backup
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Gera um arquivo <code className="text-indigo-600 dark:text-indigo-400 font-bold">.json</code> contendo todo o seu histórico de hinos aprendidos.
            </p>
            <button
              onClick={handleExportJson}
              className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-2xs"
            >
              <Download className="w-4 h-4" />
              Baixar Arquivo de Backup (.json)
            </button>
          </div>

          <div className="space-y-2 pt-4 border-t border-slate-200 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Upload className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              2. Restaurar / Importar Backup
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Cole abaixo o conteúdo do arquivo JSON de backup para restaurar seus hinos:
            </p>
            <textarea
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              placeholder="Cole o código JSON do backup aqui..."
              rows={3}
              className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-800 dark:text-slate-200 focus:outline-none focus:bg-white dark:focus:bg-slate-950 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            />
            <button
              onClick={handleImportJson}
              disabled={!jsonInput.trim()}
              className="w-full py-2 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 disabled:opacity-50 disabled:cursor-not-allowed font-bold text-xs flex items-center justify-center gap-2 transition-colors"
            >
              <Upload className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              Restaurar Dados Colados
            </button>
          </div>

          <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
            {!confirmReset ? (
              <button
                onClick={() => setConfirmReset(true)}
                className="text-xs text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 flex items-center gap-1.5 transition-colors font-medium"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Zerar todo o meu progresso neste navegador
              </button>
            ) : (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-500/40 space-y-2">
                <div className="flex items-center gap-2 text-rose-800 dark:text-rose-300 text-xs font-bold">
                  <AlertTriangle className="w-4 h-4" />
                  Tem certeza? Esta ação apagará todos os hinos marcados.
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      onResetData();
                      setConfirmReset(false);
                      onClose();
                    }}
                    className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs"
                  >
                    Sim, Zerar Tudo
                  </button>
                  <button
                    onClick={() => setConfirmReset(false)}
                    className="px-3 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
