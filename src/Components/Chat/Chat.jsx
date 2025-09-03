import React, { useState } from 'react';
import './Chat.css';
import { assets } from '../../assets/assets';
import { GoogleGenerativeAI } from '@google/generative-ai';

export const Chat = () => {
    const [text, setText] = useState("");
    const [chatHistory, setChatHistory] = useState([]);
    const [loading, setLoading] = useState(false);

    // Replace with your actual API key
    const ai = new GoogleGenerativeAI("AIzaSyC2Fc36wFrP1eLDa4Af3carhRyJaIXjz3Y");

    async function getChatbotResponse(userInput) {
        try {
            const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });
            const result = await model.generateContent(userInput);
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
        setChatHistory(prevChat => [...prevChat, userMessage]);
        setLoading(true);
        setText("");

        const aiResponse = await getChatbotResponse(userMessage.text);
        const aiMessage = { text: aiResponse, sender: 'ai' };
        setChatHistory(prevChat => [...prevChat, aiMessage]);
        setLoading(false);
    };

    return (
        <div className="main">
            <div className="nav">
                <p>Gem<span>GPT</span></p>
                <img src={assets.user_icon} alt="User Icon" />
            </div>
            <div className="main-container">
                {chatHistory.length === 0 ? (
                    <div className="greet">
                        <p><span>Hello, User</span></p>
                        <p>How can I help you?</p>
                    </div>
                ) : (
                    <div className="messages-container">
                        {chatHistory.map((message, index) => (
                            <div key={index} className={`message-box ${message.sender}`}>
                                <img
                                    src={message.sender === 'user' ? assets.user_icon : assets.gemini_icon}
                                    alt={message.sender === 'user' ? "User Icon" : "Gemini Icon"}
                                    className="message-icon"
                                />
                                <p className="message-text">{message.text}</p>
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
                            <img src={assets.gallery_icon} alt="Gallery Icon" />
                            {loading ? (
                                <div className="spinner"></div> 
                            ) : (
                                <img
                                    src={assets.send_icon}
                                    alt="Send Icon"
                                    onClick={handleSend}
                                />
                            )}
                        </div>
                    </div>
                    <p className='bottom-info'>AI may sometimes provide inaccurate information, so double-check the results.</p>
                </div>
            </div>
        </div>
    );
};