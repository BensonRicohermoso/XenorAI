-- XenorAI Database Setup
-- This script creates the database and tables for the chatbot

CREATE DATABASE IF NOT EXISTS xenorai_db;
USE xenorai_db;

-- Table for storing conversation responses
CREATE TABLE IF NOT EXISTS responses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    question_pattern VARCHAR(500) NOT NULL,
    answer TEXT NOT NULL,
    category VARCHAR(100) DEFAULT 'general',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_category (category)
);

-- Insert predefined casual conversation responses
INSERT INTO responses (question_pattern, answer, category) VALUES
-- Greetings
('hi|hello|hey|greetings|howdy', 'Hello! How can I help you today?', 'greeting'),
('good morning', 'Good morning! I hope you\'re having a wonderful day!', 'greeting'),
('good afternoon', 'Good afternoon! How\'s your day going?', 'greeting'),
('good evening', 'Good evening! What can I do for you?', 'greeting'),
('good night', 'Good night! Sleep well and take care!', 'greeting'),

-- How are you
('how are you|how are you doing|how do you do|whats up|what\'s up', 'I\'m doing great, thank you for asking! I\'m here and ready to chat with you. How are you doing?', 'wellbeing'),
('are you ok|are you okay', 'I\'m perfectly fine, thank you! How about you?', 'wellbeing'),

-- Thank you
('thank you|thanks|thank u|thx|ty', 'You\'re very welcome! Is there anything else I can help you with?', 'gratitude'),
('appreciate it|appreciate that', 'I\'m glad I could help! Feel free to ask me anything else.', 'gratitude'),

-- Goodbye
('bye|goodbye|see you|see ya|take care|gotta go', 'Goodbye! Have a great day ahead! Feel free to come back anytime!', 'farewell'),
('talk to you later|ttyl', 'Sure thing! Talk to you later!', 'farewell'),

-- Personal questions
('what is your name|who are you|what are you', 'I\'m XenorAI, your friendly AI assistant! I\'m here to have casual conversations with you.', 'identity'),
('what can you do|what do you do', 'I can chat with you about various topics! Feel free to ask me questions or just have a friendly conversation.', 'capabilities'),
('where are you from|where do you live', 'I exist in the digital realm! I\'m here to assist you whenever you need me.', 'identity'),

-- Feelings and emotions
('i am happy|i am glad|i am excited', 'That\'s wonderful to hear! I\'m happy for you! What\'s making you feel so good?', 'emotion'),
('i am sad|i am unhappy|i am depressed|feeling down', 'I\'m sorry to hear that. Remember, it\'s okay to feel this way sometimes. Is there anything I can do to cheer you up?', 'emotion'),
('i am tired|i am exhausted', 'It sounds like you need some rest! Make sure to take care of yourself and get some good sleep.', 'emotion'),
('i am bored|so bored', 'Boredom can be tough! How about we have an interesting conversation? What topics interest you?', 'emotion'),

-- Compliments
('you are great|you are awesome|you are amazing|you are good', 'Thank you so much! That\'s very kind of you to say! You\'re pretty awesome yourself!', 'compliment'),
('i like you|you are nice', 'Aw, thank you! I like chatting with you too!', 'compliment'),

-- Questions about the bot
('are you human|are you real|are you a bot|are you ai', 'I\'m an AI chatbot called XenorAI! While I\'m not human, I\'m here to have genuine conversations with you.', 'identity'),
('how old are you|what is your age', 'I was just created! You could say I\'m brand new and always learning.', 'identity'),

-- Help and assistance
('help|can you help|need help', 'Of course! I\'m here to help. What do you need assistance with?', 'help'),
('what should i do|any suggestions', 'That depends on what you\'re looking for! Can you tell me more about your situation?', 'help'),

-- Weather (casual)
('how is the weather|what\'s the weather', 'I don\'t have access to real-time weather data, but I hope it\'s nice where you are! How\'s the weather on your end?', 'weather'),

-- Time
('what time is it|what is the time', 'I don\'t have access to real-time clock, but you can check your device\'s clock! Is there something time-related I can help you with?', 'time'),

-- Fun and humor
('tell me a joke|make me laugh|something funny', 'Why did the AI go to school? To improve its learning algorithms! 😄', 'humor'),
('are you funny', 'I try my best! Humor is all about timing and delivery, even for an AI like me!', 'humor'),

-- General conversation
('tell me about yourself', 'I\'m XenorAI, a friendly chatbot designed for casual conversations. I love chatting with people and learning from our interactions!', 'general'),
('what do you think', 'That\'s an interesting question! I think friendly conversations make the world a better place. What do you think?', 'general'),
('really|seriously|indeed', 'Yes, absolutely! What else would you like to know?', 'general'),
('cool|nice|great|awesome', 'I\'m glad you think so! Anything else on your mind?', 'general'),

-- Default fallback
('.*', 'That\'s interesting! Tell me more about that. I\'m here to chat!', 'general');
