
import { GoogleGenAI, Type } from "@google/genai";
import { HandoverData, SourceFile } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * [분석] 인수인계서 생성 (Gemini 3 Pro)
 */
export const analyzeFilesForHandover = async (files: SourceFile[]): Promise<HandoverData> => {
  const fileContext = files.map(f => `[파일명: ${f.name}]\n내용: ${f.content.substring(0, 3000)}`).join("\n\n");

  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: `제공된 자료를 분석하여 전문적인 인수인계서 데이터를 생성해줘. 
    중요: 모든 텍스트 데이터(이름, 직급, 과제명, 설명 등)는 반드시 '한국어'로 작성해야 해. 
    데이터가 부족하다면 파일 내용을 바탕으로 논리적으로 유추하여 풍부하게 채워넣어줘.\n\n분석 대상 자료:\n${fileContext}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          overview: {
            type: Type.OBJECT,
            properties: {
              transferor: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, position: { type: Type.STRING }, contact: { type: Type.STRING } } },
              transferee: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, position: { type: Type.STRING }, contact: { type: Type.STRING }, startDate: { type: Type.STRING } } },
              reason: { type: Type.STRING },
              background: { type: Type.STRING },
              period: { type: Type.STRING },
              schedule: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { date: { type: Type.STRING }, activity: { type: Type.STRING } } } }
            }
          },
          jobStatus: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              responsibilities: { type: Type.ARRAY, items: { type: Type.STRING } },
              authority: { type: Type.STRING },
              reportingLine: { type: Type.STRING },
              teamMission: { type: Type.STRING },
              teamGoals: { type: Type.ARRAY, items: { type: Type.STRING } }
            }
          },
          priorities: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: { rank: { type: Type.NUMBER }, title: { type: Type.STRING }, status: { type: Type.STRING }, solution: { type: Type.STRING }, deadline: { type: Type.STRING } }
            }
          },
          stakeholders: {
            type: Type.OBJECT,
            properties: {
              manager: { type: Type.STRING },
              internal: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, role: { type: Type.STRING } } } },
              external: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, role: { type: Type.STRING } } } }
            }
          },
          teamMembers: {
            type: Type.ARRAY,
            items: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, position: { type: Type.STRING }, role: { type: Type.STRING }, notes: { type: Type.STRING } } }
          },
          ongoingProjects: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: { name: { type: Type.STRING }, owner: { type: Type.STRING }, status: { type: Type.STRING }, progress: { type: Type.NUMBER }, deadline: { type: Type.STRING }, description: { type: Type.STRING } }
            }
          },
          risks: { type: Type.OBJECT, properties: { issues: { type: Type.STRING }, risks: { type: Type.STRING } } },
          roadmap: { type: Type.OBJECT, properties: { shortTerm: { type: Type.STRING }, longTerm: { type: Type.STRING } } },
          resources: {
            type: Type.OBJECT,
            properties: {
              docs: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { category: { type: Type.STRING }, name: { type: Type.STRING }, location: { type: Type.STRING } } } },
              systems: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, usage: { type: Type.STRING }, contact: { type: Type.STRING } } } },
              contacts: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { category: { type: Type.STRING }, name: { type: Type.STRING }, position: { type: Type.STRING }, contact: { type: Type.STRING } } } }
            }
          },
          checklist: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { text: { type: Type.STRING }, completed: { type: Type.BOOLEAN } } } }
        }
      },
      systemInstruction: "당신은 한국 최고의 인수인계서 작성 전문가입니다. 모든 응답과 데이터는 반드시 정중하고 명확한 한국어로 작성하세요. 전문 용어 사용이 필요한 경우 한국어 표현을 우선시하세요."
    }
  });

  return JSON.parse(response.text);
};

/**
 * [채팅] 지능형 상담 (Gemini 3 Flash)
 */
export const chatWithGemini = async (
  message: string, 
  files: SourceFile[], 
  history: { role: string; text: string }[]
): Promise<string> => {
  const fileContext = files.length > 0 
    ? "분석 가능한 파일 컨텍스트:\n" + files.map(f => `[${f.name}]: ${f.content.substring(0, 1000)}`).join("\n")
    : "현재 참조할 수 있는 파일이 없습니다.";

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [
      { role: "user", parts: [{ text: `${fileContext}\n\n사용자 질문: ${message}` }] }
    ],
    config: {
      systemInstruction: "당신은 인수인계 도우미 '꿀단지'입니다. 무조건 한국어로만 답변하세요. 사용자가 질문하면 업로드된 파일의 내용을 바탕으로 친절하고 달콤하게 한국어로 답변하세요. 사내 보안 가이드를 준수하세요."
    }
  });

  return response.text || "죄송합니다. 답변을 생성하지 못했습니다.";
};
