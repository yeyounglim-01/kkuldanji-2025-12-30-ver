
import React, { useState, useRef, useEffect } from 'react';
import { Send, MessageSquare, Wand2, Sparkles, Loader2, Info, PlusCircle, History } from 'lucide-react';
import { ChatMessage, ViewMode, SourceFile, ChatSession } from '../types';

interface Props {
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  onGenerate: () => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  isProcessing: boolean;
  files: SourceFile[];
  onNewChat: () => void;
  savedSessions: ChatSession[];
  onLoadSession: (session: ChatSession) => void;
}

const ChatWindow: React.FC<Props> = ({ 
  messages, 
  onSendMessage, 
  onGenerate, 
  viewMode, 
  setViewMode, 
  isProcessing, 
  files,
  onNewChat,
  savedSessions,
  onLoadSession
}) => {
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, viewMode]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isProcessing) {
      onSendMessage(input);
      setInput('');
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl overflow-hidden border border-yellow-100 relative">
      
      {/* 시스템 상태바 */}
      <div className="bg-gradient-to-r from-yellow-50 to-white px-5 py-2.5 border-b border-yellow-100 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-[9px] font-black text-gray-400 uppercase tracking-tighter">시스템 가동 중</span>
          </div>
        </div>
        <div className="flex items-center gap-3 text-[10px] font-black">
          <div className="flex items-center gap-1.5">
            <span className="text-gray-400">최근 업로드</span>
            <span className="text-yellow-600 bg-yellow-100 px-1.5 py-0.5 rounded-md min-w-[24px] text-center">{files.length}건</span>
          </div>
          <div className="w-px h-3 bg-gray-100"></div>
          <div className="flex items-center gap-1.5">
            <span className="text-gray-400">인덱스 문서</span>
            <span className="text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded-md min-w-[24px] text-center">132개</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between p-4 border-b border-yellow-50 bg-white/80 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <h2 className="font-extrabold text-gray-800 flex items-center gap-2">
            {viewMode === ViewMode.CHAT ? (
              <><div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center"><MessageSquare className="w-4 h-4 text-yellow-600" /></div> 인수인계 챗봇</>
            ) : (
              <><div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center"><History className="w-4 h-4 text-orange-600" /></div> 인수인계 채팅방</>
            )}
          </h2>
          {viewMode === ViewMode.CHAT && messages.length > 0 && (
            <button 
              onClick={onNewChat}
              className="ml-2 p-1.5 text-yellow-500 hover:bg-yellow-50 rounded-lg transition-colors group relative"
              title="새 채팅 시작 (현재 채팅 저장)"
            >
              <PlusCircle className="w-5 h-5" />
              <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[9px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">새 채팅 시작</span>
            </button>
          )}
        </div>
        <div className="flex bg-gray-100 p-1 rounded-xl">
           <button 
            onClick={() => setViewMode(ViewMode.CHAT)}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${viewMode === ViewMode.CHAT ? 'bg-white text-yellow-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
          >
            채팅
          </button>
          <button 
            onClick={() => setViewMode(ViewMode.ROOMS)}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${viewMode === ViewMode.ROOMS ? 'bg-white text-yellow-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
          >
            채팅방
          </button>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#FFFEFA]">
        {viewMode === ViewMode.CHAT ? (
          <>
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center max-w-sm mx-auto">
                <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mb-8 shadow-inner">
                  <Sparkles className="w-12 h-12 text-yellow-400 animate-pulse" />
                </div>
                <h3 className="text-2xl font-black text-gray-800 mb-3">달콤한 인수인계 가이드</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-10 font-medium">
                  업로드하신 파일을 분석하여<br/>완벽한 인수인계서를 만들어 드릴게요.<br/>
                  <span className="text-yellow-600">왼쪽 보관함에 자료를 먼저 넣어주세요!</span>
                </p>
                <button 
                  onClick={onGenerate}
                  disabled={isProcessing}
                  className="w-full bg-yellow-400 text-white py-4 rounded-2xl font-black shadow-xl shadow-yellow-100 hover:bg-yellow-500 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
                >
                  {isProcessing ? <Loader2 className="w-6 h-6 animate-spin" /> : <Wand2 className="w-6 h-6" />}
                  인수인계서 생성하기
                </button>
              </div>
            ) : (
              messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-3xl px-5 py-3.5 shadow-sm border ${
                    msg.role === 'user' 
                      ? 'bg-yellow-400 border-yellow-500 text-white font-bold rounded-tr-none' 
                      : 'bg-white border-yellow-100 text-gray-700 font-medium rounded-tl-none'
                  }`}>
                    <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                  </div>
                </div>
              ))
            )}
            {isProcessing && (
               <div className="flex justify-start">
                <div className="bg-white border border-yellow-100 rounded-2xl rounded-tl-none px-5 py-4 flex items-center gap-3 shadow-sm">
                  <div className="flex gap-1.5">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                  <span className="text-xs text-yellow-600 font-bold italic">자료를 달콤하게 분석 중...</span>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="space-y-4">
            {savedSessions.length === 0 ? (
              <div className="text-center py-20 text-gray-400">
                <History className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p className="text-sm font-bold">아직 저장된 채팅방이 없습니다.</p>
              </div>
            ) : (
              savedSessions.map(session => (
                <div 
                  key={session.id} 
                  onClick={() => onLoadSession(session)}
                  className="p-4 bg-white border border-yellow-100 rounded-2xl hover:bg-yellow-50 transition-all cursor-pointer shadow-sm group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-black text-yellow-600 bg-yellow-100 px-2 py-0.5 rounded-full">대화 세션</span>
                    <span className="text-[9px] text-gray-400 font-bold">{new Date(session.timestamp).toLocaleString()}</span>
                  </div>
                  <h4 className="text-sm font-black text-gray-800 truncate group-hover:text-yellow-700 transition-colors">
                    {session.title}
                  </h4>
                  <p className="text-[11px] text-gray-400 mt-1">대화 {session.messages.length}건</p>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      <div className="p-5 bg-white border-t border-yellow-50">
        <form onSubmit={handleSubmit} className="relative mb-4">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isProcessing || viewMode === ViewMode.ROOMS}
            placeholder={viewMode === ViewMode.ROOMS ? "채팅방 내역을 선택해주세요." : "자료에 대해 궁금한 점을 물어보세요..."}
            className="w-full pl-5 pr-14 py-4 bg-yellow-50 border border-yellow-100 rounded-2xl text-sm font-medium focus:ring-4 focus:ring-yellow-400/20 focus:border-yellow-300 outline-none transition-all placeholder:text-yellow-300 disabled:opacity-50"
          />
          <button 
            type="submit"
            disabled={isProcessing || !input.trim() || viewMode === ViewMode.ROOMS}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 p-2.5 bg-yellow-400 text-white rounded-xl hover:bg-yellow-500 transition-all shadow-md disabled:opacity-50 active:scale-90"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
        <div className="flex items-center justify-center gap-2 text-[10px] text-gray-400 font-bold">
          <Info className="w-3 h-3" />
          꿀단지는 AI 기술을 사용하여 인수인계 업무를 지원합니다.
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
