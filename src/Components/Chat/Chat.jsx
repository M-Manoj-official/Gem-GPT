import React from 'react'
import './Chat.css'
import {assets} from '../../assets/assets'
import { GoogleGenAI } from '@google/genai';

export const Chat = () => {

  const ai = new GoogleGenAI({ apiKey: "AIzaSyC2Fc36wFrP1eLDa4Af3carhRyJaIXjz3Y" });
async function getChatbotResponse(userInput) {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: userInput,
  });
  return response.text;
}
// Example usage
getChatbotResponse("What is react js").then(console.log);

  return (
    <div className="main">
        <div className="nav">
            <p>Gem<span>GPT</span></p>
            <img src={assets.user_icon} alt="" />
        </div>
        <div className="main-container">
          <div className="greet">
            <p><span>Hello, User</span></p>
            <p>How can I help you ?</p>
          </div>
        <div className="main-bottom">
          <div className="search-box">
            <input type='text'placeholder='Enter a prompt here'/>
            <div>
              <img src={assets.gallery_icon} alt="" />
              <img src={assets.send_icon} alt="" />
            </div>
          </div>
          <p className='bottom-info'>AI may sometimes provide miserable information, So double check the result.</p>
        </div>
        </div>
    </div>
  )
}
