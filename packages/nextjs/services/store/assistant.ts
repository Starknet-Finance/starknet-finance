import { create } from "zustand";
import { persist } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";
import { Message, ChatHistory, ChatState } from "~~/types/assistant";

type AIAssistantState = {
  messages: Message[];
  setMessages: (
    newMessages: Message[] | ((prev: Message[]) => Message[]),
  ) => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  // New chat history related states
  chatState: ChatState;
  createNewChat: () => void;
  switchChat: (chatId: string) => void;
  updateChatHistory: () => void;
};

export const useAIAssistantState = create<AIAssistantState>()(
  persist(
    (set, get) => ({
      // get local storage address book

      messages: [],
      setMessages: (newMessages) =>
        set((state) => {
          const updatedMessages =
            typeof newMessages === "function"
              ? newMessages(state.messages)
              : newMessages;

          // Automatically update chat history when messages change
          const { chatState } = state;
          if (chatState.currentChatId) {
            const updatedHistories = chatState.chatHistories.map((history) =>
              history.id === chatState.currentChatId
                ? {
                    ...history,
                    messages: updatedMessages,
                    updatedAt: Date.now(),
                    title: updatedMessages[0]?.content || "New Chat", // Use first message as title
                  }
                : history,
            );

            set((state) => ({
              ...state,
              chatState: {
                ...state.chatState,
                chatHistories: updatedHistories,
              },
            }));
          }

          return { messages: updatedMessages };
        }),
      isLoading: false,
      setIsLoading: (isLoading: boolean) => set({ isLoading }),
      chatState: {
        currentChatId: null,
        chatHistories: [],
      },
      createNewChat: () => {
        const newChat: ChatHistory = {
          id: uuidv4(),
          title: "New Chat",
          messages: [],
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };

        set((state) => ({
          messages: [],
          chatState: {
            currentChatId: newChat.id,
            chatHistories: [newChat, ...state.chatState.chatHistories],
          },
        }));
      },
      switchChat: (chatId: string) => {
        const { chatState } = get();
        const chat = chatState.chatHistories.find((h) => h.id === chatId);
        if (chat) {
          set({
            messages: chat.messages,
            chatState: {
              ...chatState,
              currentChatId: chatId,
            },
          });
        }
      },
      updateChatHistory: () => {
        const { messages, chatState } = get();
        if (!chatState.currentChatId) return;

        const updatedHistories = chatState.chatHistories.map((history) =>
          history.id === chatState.currentChatId
            ? {
                ...history,
                messages,
                updatedAt: Date.now(),
                title: messages[0]?.content || "New Chat",
              }
            : history,
        );

        set((state) => ({
          chatState: {
            ...state.chatState,
            chatHistories: updatedHistories,
          },
        }));
      },
    }),
    {
      name: "ai-assistant-storage",
      partialize: (state) => ({ chatState: state.chatState }),
    },
  ),
);
