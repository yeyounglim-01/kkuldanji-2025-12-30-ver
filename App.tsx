
import React, { useState } from 'react';
import SourceSidebar from './components/SourceSidebar';
import ChatWindow from './components/ChatWindow';
import HandoverForm from './components/HandoverForm';
import LoginScreen from './components/LoginScreen';
import { SourceFile, ChatMessage, HandoverData, ViewMode, ChatSession } from './types';
import { analyzeFilesForHandover, chatWithGemini } from './services/geminiService';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [files, setFiles] = useState<SourceFile[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [savedSessions, setSavedSessions] = useState<ChatSession[]>([]);
  const [handoverData, setHandoverData] = useState<HandoverData | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.CHAT);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileUpload = (newFiles: SourceFile[]) => {
    setFiles(prev => [...prev, ...newFiles]);
  };

  const handleFileRemove = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const handleSendMessage = async (text: string) => {
    const userMsg: ChatMessage = { role: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    setIsProcessing(true);
    
    try {
      const responseText = await chatWithGemini(text, files, messages);
      const aiMsg: ChatMessage = { role: 'assistant', text: responseText };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'assistant', text: "AI 분석 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요." }]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleNewChat = () => {
    if (messages.length > 0) {
      const firstUserMsg = messages.find(m => m.role === 'user')?.text || "새 대화";
      const title = firstUserMsg.length > 20 ? firstUserMsg.substring(0, 20) + "..." : firstUserMsg;
      
      const newSession: ChatSession = {
        id: Math.random().toString(36).substr(2, 9),
        title: title,
        messages: [...messages],
        timestamp: new Date()
      };
      setSavedSessions(prev => [newSession, ...prev]);
    }
    setMessages([]);
    setViewMode(ViewMode.CHAT);
  };

  const handleLoadSession = (session: ChatSession) => {
    setMessages(session.messages);
    setViewMode(ViewMode.CHAT);
  };

  const handleGenerateHandover = async () => {
    setIsProcessing(true);
    try {
      const data = await analyzeFilesForHandover(files);
      setHandoverData(data);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        text: "자료 분석을 기반으로 인터랙티브 인수인계서 초안을 완성했습니다! 리포트 영역에서 내용을 확인하고 직접 수정할 수 있습니다." 
      }]);
    } catch (error) {
      console.error(error);
      alert("인수인계서 생성에 실패했습니다. 파일 내용을 다시 확인해 주세요.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isLoggedIn) {
    return <LoginScreen onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <div className="flex h-screen bg-[#FFFDF0] text-gray-900 overflow-hidden relative">
      <div className="honeycomb-bg"></div>
      
      <SourceSidebar 
        files={files} 
        onUpload={handleFileUpload} 
        onRemove={handleFileRemove} 
      />

      <main className="flex-1 flex gap-8 p-8 overflow-hidden relative z-10">
        <div className="w-[60%] flex flex-col h-full animate-in fade-in slide-in-from-left-8 duration-1000">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-2.5 h-10 bg-yellow-400 rounded-full"></div>
              <div>
                <h2 className="text-2xl font-black text-gray-800 tracking-tighter">인수인계 리포트 마스터</h2>
                <p className="text-[10px] font-black text-yellow-600 uppercase tracking-[0.2em] mt-0.5">INTERACTIVE HANDOVER MASTER</p>
              </div>
            </div>
            {!handoverData && (
              <button 
                onClick={handleGenerateHandover}
                disabled={isProcessing}
                className="bg-gray-900 text-white px-6 py-3 rounded-2xl text-xs font-black shadow-xl hover:bg-black hover:scale-105 disabled:opacity-50 transition-all active:scale-95 flex items-center gap-2 group"
              >
                {isProcessing ? "분석 중..." : "리포트 생성하기"}
                <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full group-hover:animate-ping"></div>
              </button>
            )}
          </div>
          <HandoverForm data={handoverData} onUpdate={setHandoverData} />
        </div>

        <div className="w-[40%] flex flex-col h-full animate-in fade-in slide-in-from-right-8 duration-1000 delay-200">
           <ChatWindow 
            messages={messages} 
            onSendMessage={handleSendMessage} 
            onGenerate={handleGenerateHandover}
            viewMode={viewMode}
            setViewMode={setViewMode} 
            isProcessing={isProcessing}
            files={files}
            onNewChat={handleNewChat}
            savedSessions={savedSessions}
            onLoadSession={handleLoadSession}
          />
        </div>
      </main>
    </div>
  );
};

export default App;
