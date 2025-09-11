-- 创建数据库（如果不存在）
CREATE DATABASE IF NOT EXISTS linguaforge CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE linguaforge;

-- 用户表
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    level INT DEFAULT 1,
    experience INT DEFAULT 0,
    coins INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_username (username),
    INDEX idx_email (email)
);

-- 单词表
CREATE TABLE IF NOT EXISTS words (
    id INT AUTO_INCREMENT PRIMARY KEY,
    english VARCHAR(100) NOT NULL,
    chinese VARCHAR(200) NOT NULL,
    pronunciation VARCHAR(200),
    audio_url VARCHAR(500),
    image_url VARCHAR(500),
    difficulty_level INT DEFAULT 1,
    category VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_english (english),
    INDEX idx_category (category),
    INDEX idx_difficulty (difficulty_level)
);

-- 用户学习进度表
CREATE TABLE IF NOT EXISTS user_progress (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    word_id INT NOT NULL,
    study_count INT DEFAULT 0,
    mastery_level DECIMAL(3,2) DEFAULT 0.00, -- 0.00-1.00 掌握程度
    last_studied TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (word_id) REFERENCES words(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_word (user_id, word_id),
    INDEX idx_user_id (user_id),
    INDEX idx_word_id (word_id)
);

-- 游戏记录表
CREATE TABLE IF NOT EXISTS game_records (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    game_type ENUM('adventure', 'defense', 'dubbing') NOT NULL,
    score INT DEFAULT 0,
    level_reached INT DEFAULT 1,
    time_spent INT DEFAULT 0, -- 秒
    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_game_type (game_type),
    INDEX idx_completed_at (completed_at)
);

-- 用户成就表
CREATE TABLE IF NOT EXISTS user_achievements (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    achievement_type VARCHAR(50) NOT NULL,
    achievement_name VARCHAR(100) NOT NULL,
    description TEXT,
    earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_achievement_type (achievement_type)
);

-- 每日任务表
CREATE TABLE IF NOT EXISTS daily_tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    task_type VARCHAR(50) NOT NULL,
    task_description VARCHAR(200) NOT NULL,
    target_value INT NOT NULL,
    current_value INT DEFAULT 0,
    is_completed BOOLEAN DEFAULT FALSE,
    task_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_task_date (task_date),
    UNIQUE KEY unique_user_task_date (user_id, task_type, task_date)
);

-- 插入一些示例单词数据
INSERT INTO words (english, chinese, pronunciation, difficulty_level, category) VALUES
('hello', '你好', '/həˈloʊ/', 1, 'greeting'),
('world', '世界', '/wɜːrld/', 1, 'noun'),
('beautiful', '美丽的', '/ˈbjuːtɪfl/', 2, 'adjective'),
('adventure', '冒险', '/ədˈventʃər/', 3, 'noun'),
('pronunciation', '发音', '/prəˌnʌnsiˈeɪʃn/', 3, 'noun'),
('vocabulary', '词汇', '/vəˈkæbjələri/', 2, 'noun'),
('grammar', '语法', '/ˈɡræmər/', 2, 'noun'),
('conversation', '对话', '/ˌkɑːnvərˈseɪʃn/', 3, 'noun'),
('practice', '练习', '/ˈpræktɪs/', 2, 'verb'),
('learning', '学习', '/ˈlɜːrnɪŋ/', 1, 'noun');
