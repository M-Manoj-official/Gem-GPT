import React, { useState, useEffect } from 'react';
import './Chat.css';
import { assets } from '../../assets/assets';
import { GoogleGenerativeAI } from '@google/generative-ai';
import ReactMarkdown  from 'react-markdown';

export const Chat = () => {
    const [text, setText] = useState("");
    const [allChats, setAllChats] = useState([]);
    const [currentChat, setCurrentChat] = useState(null);
    const [showHistory, setShowHistory] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isLightTheme, setIsLightTheme] = useState(false);

    const ai = new GoogleGenerativeAI("AIzaSyC2Fc36wFrP1eLDa4Af3carhRyJaIXjz3Y");
    const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });

    useEffect(() => {
        try {
            const storedChats = localStorage.getItem('allChats');
            if (storedChats) {
                const parsedChats = JSON.parse(storedChats);
                setAllChats(parsedChats);
                if (parsedChats.length > 0) {
                    setCurrentChat(parsedChats[0]);
                } else {
                    setCurrentChat(null); 
                }
            } else {
                setCurrentChat(null);
            }
        } catch (error) {
            console.error("Failed to load all chats from local storage", error);
        }
    }, []);

    useEffect(() => {
        try {
            localStorage.setItem('allChats', JSON.stringify(allChats));
        } catch (error) {
            console.error("Failed to save all chats to local storage", error);
        }
    }, [allChats]);

    async function getChatbotResponse(userInput, history) {
        try {
            const apiHistory = history.map(message => ({
                role: message.sender === 'user' ? 'user' : 'model',
                parts: [{ text: message.text }],
            }));
            
            const chat = model.startChat({
                history: apiHistory,
            });

            const result = await chat.sendMessage(userInput);
            const response = await result.response;
            return response.text();
        } catch (error) {
            console.error("Error generating content:", error);
            return "Sorry, I couldn't get a response. Please try again.";
        }
    }

    const handleSend = async () => {
        if (text.trim() === "") return;

        const userMessage = { text: text, sender: 'user' };
        
        let updatedChatMessages = currentChat ? [...currentChat.messages, userMessage] : [userMessage];
        
        const currentChatId = currentChat ? currentChat.id : Date.now();
        const currentChatTitle = updatedChatMessages[0].text.substring(0, 20) + '...';
        setCurrentChat({ id: currentChatId, title: currentChatTitle, messages: updatedChatMessages });

        setLoading(true);
        setText("");

        const aiResponse = await getChatbotResponse(userMessage.text, updatedChatMessages);
        const aiMessage = { text: aiResponse, sender: 'ai' };

        updatedChatMessages = [...updatedChatMessages, aiMessage];
        
        const finalChat = { id: currentChatId, title: currentChatTitle, messages: updatedChatMessages };
        setCurrentChat(finalChat);

        setAllChats(prevChats => {
            const existingChatIndex = prevChats.findIndex(chat => chat.id === currentChatId);
            if (existingChatIndex !== -1) {
                const updatedChats = [...prevChats];
                updatedChats.splice(existingChatIndex, 1);
                return [finalChat, ...updatedChats];
            } else {
                return [finalChat, ...prevChats];
            }
        });
        
        setLoading(false);
    };

    const handleHistoryClick = () => {
        setShowHistory(!showHistory);
    };

    const handleLoadChat = (chatId) => {
        const chatToLoad = allChats.find(chat => chat.id === chatId);
        if (chatToLoad) {
            setCurrentChat(chatToLoad);
            
            const updatedChats = allChats.filter(chat => chat.id !== chatId);
            setAllChats([chatToLoad, ...updatedChats]);
        }
        setShowHistory(false);
    };

    const handleNewChat = () => {
        setCurrentChat(null);
        setShowHistory(false);
    };

    useEffect(() => {
    const body = document.body;
    if (isLightTheme) {
      body.classList.add('light-theme');
    } else {
      body.classList.remove('light-theme');
    }
  }, [isLightTheme]);
  const toggleTheme = () => {
    setIsLightTheme(prev => !prev);
  };

    return (
        <div className="main">
            <div className="nav">
                <p>Gem<span>GPT</span></p>
                <div className="nav-contents">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-brightness-low" viewBox="0 0 16 16" onClick={toggleTheme}>
                        {isLightTheme ? 'Switch to Dark' : 'Switch to Light'}
                        <path d="M8 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6m0 1a4 4 0 1 0 0-8 4 4 0 0 0 0 8m.5-9.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0m0 11a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0m5-5a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1m-11 0a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1m9.743-4.036a.5.5 0 1 1-.707-.707.5.5 0 0 1 .707.707m-7.779 7.779a.5.5 0 1 1-.707-.707.5.5 0 0 1 .707.707m7.072 0a.5.5 0 1 1 .707-.707.5.5 0 0 1-.707.707M3.757 4.464a.5.5 0 1 1 .707-.707.5.5 0 0 1-.707.707"/>
                    </svg>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-clock-history" viewBox="0 0 16 16" onClick={handleHistoryClick}>
                        <path d="M8.515 1.019A7 7 0 0 0 8 1V0a8 8 0 0 1 .589.022zm2.004.45a7 7 0 0 0-.985-.299l.219-.976q.576.129 1.126.342zm1.37.71a7 7 0 0 0-.439-.27l.493-.87a8 8 0 0 1 .979.654l-.615.789a7 7 0 0 0-.418-.302zm1.834 1.79a7 7 0 0 0-.653-.796l.724-.69q.406.429.747.91zm.744 1.352a7 7 0 0 0-.214-.468l.893-.45a8 8 0 0 1 .45 1.088l-.95.313a7 7 0 0 0-.179-.483m.53 2.507a7 7 0 0 0-.1-1.025l.985-.17q.1.58.116 1.17zm-.131 1.538q.05-.254.081-.51l.993.123a8 8 0 0 1-.23 1.155l-.964-.267q.069-.247.12-.501m-.952 2.379q.276-.436.486-.908l.914.405q-.24.54-.555 1.038zm-.964 1.205q.183-.183.35-.378l.758.653a8 8 0 0 1-.401.432z"/>
                        <path d="M8 1a7 7 0 1 0 4.95 11.95l.707.707A8.001 8.001 0 1 1 8 0z"/>
                        <path d="M7.5 3a.5.5 0 0 1 .5.5v5.21l3.248 1.856a.5.5 0 0 1-.496.868l-3.5-2A.5.5 0 0 1 7 9V3.5a.5.5 0 0 1 .5-.5"/>
                    </svg>
                    <img src={assets.user_icon} alt="User Icon" />
                </div>
            </div>

            {showHistory && (
                <div className="history-popup">
                    <div className="popup-header">
                        <h3>Chat History</h3>
                        <button onClick={handleNewChat}>New Chat</button>
                    </div>
                    <ul className="chat-list">
                        {allChats.map(chat => (
                            <li key={chat.id} onClick={() => handleLoadChat(chat.id)} className="chat-item">
                                <p>{chat.title}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <div className="main-container">
                {!currentChat ? (
                    <div className="greet">
                        <p><span>Hello, User</span></p>
                        <p>How can I help you?</p>
                    </div>
                ) : (
                    <div className="messages-container">
                        {currentChat.messages.map((message, index) => (
                            <div key={index} className={`message-box ${message.sender}`}>
                                <img
                                    src={message.sender === 'user' ? assets.user_icon : assets.logo_icon}
                                    alt={message.sender === 'user' ? "User Icon" : "GemGPT Icon"}
                                    className="message-icon"
                                />
                                <p className="message-text"><ReactMarkdown>{message.text}</ReactMarkdown></p>
                            </div>
                        ))}
                    </div>
                )}
                <div className="main-bottom">
                    <div className="search-box">
                        <input
                            type='text'
                            placeholder='Enter a prompt here'
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        />
                        <div>
                            {loading ? (
                                <div className="spinner"></div>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-send" viewBox="0 0 16 16" onClick={handleSend}>
                                    <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576zm6.787-8.201L1.591 6.602l4.339 2.76z"/>
                                </svg>
                            )}
                        </div>
                    </div>
                    <p className='bottom-info'>AI may sometimes provide inaccurate information, so double-check the results.</p>
                </div>
            </div>
        </div>
    );
};