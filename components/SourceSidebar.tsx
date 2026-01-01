
import React, { useRef, useState } from 'react';
import { Plus, Search, File, Trash2, Image as ImageIcon, Archive, Database, ChevronDown } from 'lucide-react';
import { SourceFile } from '../types';

interface Props {
  files: SourceFile[];
  onUpload: (newFiles: SourceFile[]) => void;
  onRemove: (id: string) => void;
}

const SourceSidebar: React.FC<Props> = ({ files, onUpload, onRemove }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedKB, setSelectedKB] = useState<string>('필버디 - 벡엔드용'); 

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles: SourceFile[] = [];
      for (let i = 0; i < e.target.files.length; i++) {
        const file = e.target.files[i];
        const reader = new FileReader();
        const base64 = await new Promise<string>((resolve) => {
          reader.onload = () => {
            const result = reader.result as string;
            resolve(result.split(',')[1]);
          };
          reader.readAsDataURL(file);
        });
        
        newFiles.push({
          id: Math.random().toString(36).substr(2, 9),
          name: file.name,
          type: file.type,
          content: base64,
          mimeType: file.type
        });
      }
      onUpload(newFiles);
    }
  };

  const isImage = (mimeType: string) => mimeType.startsWith('image/');

  const knowledgeBases = [
    '필버디 - 벡엔드용',
    'json-test3',
    '기획 자료실',
    '프론트엔드 기술 스택',
    '데이터/모델링 아카이브',
    '공통 가이드라인'
  ];

  return (
    <div className="w-80 h-full bg-white border-r flex flex-col p-5 shadow-sm relative overflow-hidden">
      <div className="mb-8 flex items-center gap-3 relative z-10">
        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg rotate-3 border border-yellow-50 overflow-hidden group hover:rotate-0 transition-all duration-300">
           <img 
             src="https://i.ibb.co/PvGzg7cK/Gemini-Generated-Image-ip7k7xip7k7xip7k.png" 
             alt="꿀단지" 
             className="w-full h-full object-contain p-0.5 rounded-xl"
             onError={(e) => {
               e.currentTarget.src = "https://api.iconify.design/noto:honey-pot.svg";
             }}
           />
        </div>
        <div>
          <h1 className="text-xl font-extrabold text-gray-800 tracking-tight">꿀단지</h1>
          <p className="text-[10px] text-yellow-600 font-bold uppercase tracking-widest">Sweet Handover AI</p>
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-5 relative z-10 min-h-0">
        <div className="bg-yellow-400 rounded-2xl p-5 text-white shadow-md border-b-4 border-yellow-500">
          <h2 className="text-sm font-bold mb-4 flex items-center gap-2">
            <Archive className="w-4 h-4" /> 자료 보관함
          </h2>
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="w-full bg-white text-yellow-600 hover:bg-yellow-50 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-sm active:scale-95"
          >
            <Plus className="w-5 h-5" />
            자료 추가하기
          </button>
          <input 
            type="file" 
            multiple 
            ref={fileInputRef} 
            className="hidden" 
            onChange={handleFileChange}
            accept=".pdf,.doc,.docx,.txt,image/jpeg,image/png,image/webp"
          />
        </div>

        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-yellow-400 w-4 h-4" />
          <input 
            type="text" 
            placeholder="자료 검색..." 
            className="w-full pl-11 pr-4 py-3 bg-yellow-50 border border-yellow-100 rounded-2xl text-sm focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none transition-all placeholder:text-yellow-300"
          />
        </div>

        {/* 웹 검색 / 심층 분석 필터 */}
        <div className="flex items-center gap-4 text-[11px] font-bold text-gray-400 px-2">
          <div className="flex items-center gap-1.5 cursor-pointer hover:text-yellow-500 transition-colors">
            <span className="w-2 h-2 rounded-full bg-yellow-400"></span>
            <span>웹 검색</span>
          </div>
          <div className="flex items-center gap-1.5 cursor-pointer hover:text-yellow-500 transition-colors">
            <span className="w-2 h-2 rounded-full bg-gray-200"></span>
            <span>심층 분석</span>
          </div>
        </div>

        {/* 지식보관소 선택 (이미지와 동일한 UI) */}
        <div className="bg-white rounded-3xl p-5 border border-yellow-50 shadow-sm">
          <h3 className="text-[11px] font-bold text-gray-400 mb-4 flex items-center gap-2">
            <Database className="w-3.5 h-3.5 text-yellow-500" /> 지식보관소 선택
          </h3>
          <div className="relative mb-3 group/select">
            <select 
              value={selectedKB}
              onChange={(e) => setSelectedKB(e.target.value)}
              className="w-full pl-5 pr-10 py-3.5 bg-white border border-gray-100 rounded-2xl text-[13px] font-bold text-gray-700 appearance-none focus:ring-2 focus:ring-yellow-400 outline-none transition-all shadow-sm cursor-pointer"
            >
              {knowledgeBases.map((kb) => (
                <option key={kb} value={kb}>
                  {kb}
                </option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
              <ChevronDown className="w-4 h-4" />
            </div>
          </div>
          
          <div className="bg-[#FFFDF0] px-4 py-2.5 rounded-xl border border-yellow-100/50">
            <p className="text-[10px] font-bold text-yellow-600">
              현재 인덱스: <span className="text-yellow-700 font-black">{selectedKB}</span>
            </p>
          </div>
        </div>

        <div className="mt-2 space-y-2 overflow-y-auto pr-1 flex-1 no-scrollbar">
          {files.length === 0 ? (
            <div className="text-center py-12 px-6">
              <div className="text-4xl mb-4 grayscale opacity-30">🐝</div>
              <p className="text-gray-400 text-sm font-medium">아직 저장된 자료가 없어요.</p>
              <p className="text-gray-300 text-xs mt-1">업무 매뉴얼이나 보고서를<br/>추가해 보세요!</p>
            </div>
          ) : (
            files.map(file => (
              <div key={file.id} className="group flex items-center gap-3 p-3 bg-gray-50 hover:bg-yellow-50 rounded-2xl transition-all cursor-pointer border border-transparent hover:border-yellow-100 shadow-sm hover:shadow-md">
                <div className="p-2.5 bg-white rounded-xl shadow-sm border border-gray-100">
                  {isImage(file.mimeType) ? (
                    <ImageIcon className="w-4 h-4 text-yellow-500" />
                  ) : (
                    <File className="w-4 h-4 text-yellow-500" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-700 truncate">{file.name}</p>
                  <p className="text-[10px] text-yellow-500 font-bold uppercase">{file.type.split('/')[1] || 'FILE'}</p>
                </div>
                <button 
                  onClick={(e) => { e.stopPropagation(); onRemove(file.id); }}
                  className="opacity-0 group-hover:opacity-100 p-2 text-gray-300 hover:text-red-500 transition-all rounded-lg hover:bg-white"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default SourceSidebar;
