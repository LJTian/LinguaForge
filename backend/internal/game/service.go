package game

import (
	"database/sql"
	"fmt"
	"math/rand"
)

type Service struct {
	db *sql.DB
}

func NewService(db *sql.DB) *Service {
	return &Service{
		db: db,
	}
}

// StartAdventureGame 开始冒险游戏
func (s *Service) StartAdventureGame(userID int, level int) (*AdventureGame, error) {
	// 获取随机单词（根据用户偏好分类筛选）
	preferred, _ := s.getUserPreferredCategory(userID)
	words, err := s.getRandomWords(5, level, preferred)
	if err != nil {
		return nil, fmt.Errorf("failed to get words: %w", err)
	}

	// 创建故事和选项
	story := s.generateStory(level)
	options := s.generateOptions(words)

	game := &AdventureGame{
		ID:           rand.Intn(10000),
		UserID:       userID,
		CurrentLevel: level,
		Score:        0,
		Story:        story,
		Options:      options,
		Words:        words,
		Completed:    false,
	}

	return game, nil
}

// StartDefenseGame 开始塔防游戏
func (s *Service) StartDefenseGame(userID int, level int) (*DefenseGame, error) {
	// 获取随机单词（根据用户偏好分类筛选）
	preferred, _ := s.getUserPreferredCategory(userID)
	adventureWords, err := s.getRandomWords(10, level, preferred)
	if err != nil {
		return nil, fmt.Errorf("failed to get words: %w", err)
	}

	// 转换为DefenseWord类型
	var words []DefenseWord
	for _, word := range adventureWords {
		words = append(words, DefenseWord{
			ID:       word.ID,
			English:  word.English,
			Chinese:  word.Chinese,
			Correct:  word.Required,
			Answered: false,
		})
	}

	// 创建敌人和防御塔
	enemies := s.generateEnemies(level)
	towers := s.generateTowers(level)

	game := &DefenseGame{
		ID:          rand.Intn(10000),
		UserID:      userID,
		CurrentWave: 1,
		Score:       0,
		Health:      100,
		Coins:       50,
		Enemies:     enemies,
		Towers:      towers,
		Words:       words,
		Completed:   false,
	}

	return game, nil
}

// StartDubbingGame 开始配音游戏
func (s *Service) StartDubbingGame(userID int, sceneID int) (*DubbingGame, error) {
	// 获取场景脚本
	scripts, err := s.getSceneScripts(sceneID)
	if err != nil {
		return nil, fmt.Errorf("failed to get scripts: %w", err)
	}

	game := &DubbingGame{
		ID:        rand.Intn(10000),
		UserID:    userID,
		SceneID:   sceneID,
		Score:     0,
		Scripts:   scripts,
		Completed: false,
	}

	return game, nil
}

// SubmitScore 提交游戏分数
func (s *Service) SubmitScore(userID int, req *SubmitScoreRequest) error {
	_, err := s.db.Exec(`
		INSERT INTO game_records (user_id, game_type, score, level_reached, time_spent)
		VALUES (?, ?, ?, ?, ?)
	`, userID, req.GameType, req.Score, req.LevelReached, req.TimeSpent)
	if err != nil {
		return fmt.Errorf("failed to save game record: %w", err)
	}

	// 根据分数给予经验和金币奖励
	expReward := req.Score / 10
	coinReward := req.Score / 20

	// 更新用户经验和金币
	_, err = s.db.Exec(`
		UPDATE users 
		SET experience = experience + ?, coins = coins + ?, updated_at = NOW()
		WHERE id = ?
	`, expReward, coinReward, userID)
	if err != nil {
		return fmt.Errorf("failed to update user rewards: %w", err)
	}

	return nil
}

// SubmitDubbing 提交配音
func (s *Service) SubmitDubbing(userID int, req *SubmitDubbingRequest) error {
	// 这里只保存配音记录，不进行AI评分
	// 未来可以扩展为异步处理
	_, err := s.db.Exec(`
		INSERT INTO game_records (user_id, game_type, score, level_reached, time_spent)
		VALUES (?, 'dubbing', 0, ?, ?)
	`, userID, req.ScriptID, req.TimeSpent)
	if err != nil {
		return fmt.Errorf("failed to save dubbing record: %w", err)
	}

	return nil
}

// GetGameHistory 获取游戏历史
func (s *Service) GetGameHistory(userID int, gameType GameType, limit int) ([]GameRecord, error) {
	query := `
		SELECT id, user_id, game_type, score, level_reached, time_spent, completed_at
		FROM game_records
		WHERE user_id = ?
	`
	args := []interface{}{userID}

	if gameType != "" {
		query += " AND game_type = ?"
		args = append(args, gameType)
	}

	query += " ORDER BY completed_at DESC LIMIT ?"
	args = append(args, limit)

	rows, err := s.db.Query(query, args...)
	if err != nil {
		return nil, fmt.Errorf("failed to query game history: %w", err)
	}
	defer rows.Close()

	var records []GameRecord
	for rows.Next() {
		var record GameRecord
		err := rows.Scan(
			&record.ID, &record.UserID, &record.GameType,
			&record.Score, &record.LevelReached, &record.TimeSpent,
			&record.CompletedAt,
		)
		if err != nil {
			return nil, fmt.Errorf("failed to scan game record: %w", err)
		}
		records = append(records, record)
	}

	return records, nil
}

// 辅助方法

func (s *Service) getRandomWords(count int, difficulty int, category string) ([]AdventureWord, error) {
	base := `SELECT id, english, chinese FROM words WHERE difficulty_level = ?`
	args := []interface{}{difficulty}
	if category != "" {
		base += " AND category = ?"
		args = append(args, category)
	}
	base += " ORDER BY RAND() LIMIT ?"
	args = append(args, count)
	rows, err := s.db.Query(base, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var words []AdventureWord
	for rows.Next() {
		var word AdventureWord
		err := rows.Scan(&word.ID, &word.English, &word.Chinese)
		if err != nil {
			return nil, err
		}
		word.Required = rand.Float32() < 0.7 // 70%的单词是必需的
		words = append(words, word)
	}

	return words, nil
}

func (s *Service) generateStory(level int) string {
	stories := []string{
		"你是一个勇敢的探险家，正在探索神秘的英语森林。突然，你遇到了一个需要帮助的精灵...",
		"在一个遥远的英语王国里，你被选中去拯救被诅咒的公主。你需要用正确的英语咒语来解除诅咒...",
		"你是一名星际旅行者，来到了一个说英语的外星文明。你需要学会他们的语言来建立友谊...",
	}

	if level >= len(stories) {
		level = len(stories) - 1
	}
	return stories[level]
}

func (s *Service) generateOptions(words []AdventureWord) []AdventureOption {
	var options []AdventureOption

	for i, word := range words {
		if word.Required {
			options = append(options, AdventureOption{
				ID:       i + 1,
				Text:     word.English,
				Correct:  true,
				Feedback: "正确！你选择了正确的单词。",
			})
		}
	}

	// 添加一些错误选项
	wrongOptions := []string{"wrong", "incorrect", "mistake", "error"}
	for i, wrong := range wrongOptions {
		options = append(options, AdventureOption{
			ID:       len(words) + i + 1,
			Text:     wrong,
			Correct:  false,
			Feedback: "这个选项不正确，请再试一次。",
		})
	}

	// 随机打乱选项
	rand.Shuffle(len(options), func(i, j int) {
		options[i], options[j] = options[j], options[i]
	})

	return options
}

func (s *Service) generateEnemies(level int) []DefenseEnemy {
	var enemies []DefenseEnemy
	enemyCount := 5 + level*2

	for i := 0; i < enemyCount; i++ {
		enemies = append(enemies, DefenseEnemy{
			ID:       i + 1,
			Type:     "spelling_error",
			Health:   10 + level*5,
			Speed:    1 + level,
			Position: i * 10,
			WordID:   i + 1,
		})
	}

	return enemies
}

func (s *Service) generateTowers(level int) []DefenseTower {
	var towers []DefenseTower
	towerCount := 3 + level

	for i := 0; i < towerCount; i++ {
		towers = append(towers, DefenseTower{
			ID:       i + 1,
			Type:     "grammar_tower",
			Level:    1,
			Damage:   5 + level*2,
			Range:    50,
			Position: i * 100,
			WordID:   i + 1,
		})
	}

	return towers
}

func (s *Service) getSceneScripts(sceneID int) ([]DubbingScript, error) {
	// 这里应该从数据库获取场景脚本
	// 暂时返回示例数据
	scripts := []DubbingScript{
		{
			ID:        1,
			Character: "Hero",
			Text:      "Hello, my name is Alex. I'm here to help you learn English!",
			AudioURL:  "/audio/hero_hello.mp3",
			Completed: false,
		},
		{
			ID:        2,
			Character: "Hero",
			Text:      "Let's practice some vocabulary together.",
			AudioURL:  "/audio/hero_vocab.mp3",
			Completed: false,
		},
	}

	return scripts, nil
}

func (s *Service) getUserPreferredCategory(userID int) (string, error) {
	var preferred sql.NullString
	err := s.db.QueryRow("SELECT preferred_category FROM users WHERE id = ?", userID).Scan(&preferred)
	if err != nil {
		return "", err
	}
	if preferred.Valid {
		return preferred.String, nil
	}
	return "", nil
}
