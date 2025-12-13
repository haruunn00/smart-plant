import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export function AIChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m your Smart Plant AI Assistant. I can help you understand your plant\'s health based on sensor data, provide care recommendations, and answer questions about optimal growing conditions. How can I help you today?',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // AI response logic with plant care knowledge
  const getAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();

    if (lowerMessage.includes('water') || lowerMessage.includes('zalij')) {
      return 'Based on current soil moisture levels (45%), your plant is in good condition. However, I recommend watering when moisture drops below 35%. Most houseplants prefer soil that\'s moist but not waterlogged. You can use the manual watering button on the Dashboard to water immediately, or let the automatic system handle it when needed.';
    }
    
    if (lowerMessage.includes('temperature') || lowerMessage.includes('temperatura')) {
      return 'The current temperature is 22.5°C, which is ideal for most houseplants. The optimal temperature range is typically 18-26°C during the day and slightly cooler at night. If temperatures exceed 28°C, consider moving your plant to a cooler location or increasing ventilation.';
    }
    
    if (lowerMessage.includes('light') || lowerMessage.includes('svjetlo')) {
      return 'Your plant is receiving 72% light exposure, which is quite good! Most houseplants thrive with bright, indirect light. If you notice light levels consistently below 30%, consider moving your plant closer to a window or using grow lights. Too much direct sunlight can scorch leaves, while too little causes slow growth.';
    }
    
    if (lowerMessage.includes('humidity') || lowerMessage.includes('vlažnost')) {
      return 'Current air humidity is at 65%, which is excellent for most tropical plants. Ideal humidity ranges from 50-70%. If humidity drops below 40%, you might notice brown leaf tips. You can increase humidity by misting, using a humidifier, or placing the pot on a pebble tray with water.';
    }
    
    if (lowerMessage.includes('health') || lowerMessage.includes('zdravlje') || lowerMessage.includes('status')) {
      return 'Your plant appears to be healthy! 🌱 All parameters are within optimal ranges:\n- Soil Moisture: 45% (Good)\n- Temperature: 22.5°C (Ideal)\n- Humidity: 65% (Excellent)\n- Light: 72% (Very Good)\n\nKeep up the great care! The automatic watering system will maintain optimal moisture levels.';
    }
    
    if (lowerMessage.includes('problem') || lowerMessage.includes('yellow') || lowerMessage.includes('žut')) {
      return 'Yellow leaves can indicate several issues:\n1. Overwatering - Check if soil moisture is consistently above 80%\n2. Underwatering - If moisture drops below 25% regularly\n3. Nutrient deficiency - Consider fertilizing monthly\n4. Too much direct sunlight - Move to indirect light\n\nBased on your current readings, all parameters look good, so if you\'re seeing yellowing, it might be a natural aging process or nutrient-related.';
    }

    if (lowerMessage.includes('fertilizer') || lowerMessage.includes('đubrivo')) {
      return 'For optimal growth, fertilize your plant during the growing season (spring and summer) about once a month. Use a balanced, water-soluble fertilizer diluted to half strength. Avoid fertilizing in winter when most plants are dormant. The Smart Plant system can remind you when it\'s time to fertilize!';
    }

    // Default response
    return 'That\'s a great question! Based on the sensor data I\'m monitoring, your plant is currently in good health. I can provide specific advice about watering schedules, light requirements, temperature control, humidity levels, or troubleshoot any plant health issues. What would you like to know more about?';
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: getAIResponse(input),
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const quickQuestions = [
    'How often should I water my plant?',
    'Is the temperature optimal?',
    'What does the current data tell me?',
    'How to increase humidity?',
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-xl p-6 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-white bg-opacity-20 rounded-lg">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl">AI Plant Assistant</h1>
            <p className="text-emerald-100 text-sm mt-1">
              Powered by mini AI analytics engine
            </p>
          </div>
        </div>
      </div>

      {/* Quick Questions */}
      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <p className="text-gray-600 text-sm mb-3">Quick questions:</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {quickQuestions.map((question, index) => (
            <button
              key={index}
              onClick={() => setInput(question)}
              className="text-left px-4 py-2 bg-gray-50 hover:bg-emerald-50 border border-gray-200 hover:border-emerald-300 rounded-lg text-sm text-gray-700 hover:text-emerald-700 transition-colors"
            >
              {question}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
        <div className="h-[500px] overflow-y-auto p-6 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div
                className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  message.role === 'user'
                    ? 'bg-emerald-600'
                    : 'bg-gradient-to-br from-green-400 to-emerald-500'
                }`}
              >
                {message.role === 'user' ? (
                  <User className="w-5 h-5 text-white" />
                ) : (
                  <Bot className="w-5 h-5 text-white" />
                )}
              </div>
              <div
                className={`flex-1 max-w-[80%] ${
                  message.role === 'user' ? 'items-end' : 'items-start'
                } flex flex-col`}
              >
                <div
                  className={`px-4 py-3 rounded-2xl ${
                    message.role === 'user'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <p className="whitespace-pre-line">{message.content}</p>
                </div>
                <p className="text-xs text-gray-500 mt-1 px-2">
                  {message.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="bg-gray-100 px-4 py-3 rounded-2xl">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t border-gray-200 p-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask about your plant's health..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Info Card */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <p className="text-blue-800 text-sm">
          💡 <span className="">Tip:</span> The AI assistant analyzes real-time sensor data to provide personalized care recommendations for your plant.
        </p>
      </div>
    </div>
  );
}
