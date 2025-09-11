package content

import (
	"database/sql"
	"fmt"
)

type Service struct {
	db *sql.DB
}

func NewService(db *sql.DB) *Service {
	return &Service{
		db: db,
	}
}

// GetWords 获取单词列表
func (s *Service) GetWords(req *GetWordsRequest, userID int) ([]WordWithProgress, error) {
	query := `
		SELECT w.id, w.english, w.chinese, w.pronunciation, w.audio_url, w.image_url,
		       w.difficulty_level, w.category, w.created_at, w.updated_at,
		       up.id, up.user_id, up.word_id, up.study_count, up.mastery_level,
		       up.last_studied, up.created_at as up_created_at, up.updated_at as up_updated_at
		FROM words w
		LEFT JOIN user_progress up ON w.id = up.word_id AND up.user_id = ?
		WHERE 1=1
	`
	args := []interface{}{userID}

	// 添加筛选条件
	if req.Category != "" {
		query += " AND w.category = ?"
		args = append(args, req.Category)
	}

	if req.Difficulty > 0 {
		query += " AND w.difficulty_level = ?"
		args = append(args, req.Difficulty)
	}

	if req.Search != "" {
		query += " AND (w.english LIKE ? OR w.chinese LIKE ?)"
		searchTerm := "%" + req.Search + "%"
		args = append(args, searchTerm, searchTerm)
	}

	// 添加排序和分页
	query += " ORDER BY w.id"
	if req.Limit > 0 {
		query += " LIMIT ?"
		args = append(args, req.Limit)
		if req.Offset > 0 {
			query += " OFFSET ?"
			args = append(args, req.Offset)
		}
	}

	rows, err := s.db.Query(query, args...)
	if err != nil {
		return nil, fmt.Errorf("failed to query words: %w", err)
	}
	defer rows.Close()

	var words []WordWithProgress
	for rows.Next() {
		var word WordWithProgress
		var progressID sql.NullInt64
		var progressUserID sql.NullInt64
		var progressWordID sql.NullInt64
		var studyCount sql.NullInt64
		var masteryLevel sql.NullFloat64
		var lastStudied sql.NullTime
		var progressCreatedAt sql.NullTime
		var progressUpdatedAt sql.NullTime

		var pronunciation, audioURL, imageURL sql.NullString
		err := rows.Scan(
			&word.ID, &word.English, &word.Chinese, &pronunciation,
			&audioURL, &imageURL, &word.DifficultyLevel, &word.Category,
			&word.CreatedAt, &word.UpdatedAt,
			&progressID, &progressUserID, &progressWordID, &studyCount,
			&masteryLevel, &lastStudied, &progressCreatedAt, &progressUpdatedAt,
		)
		if err != nil {
			return nil, fmt.Errorf("failed to scan word: %w", err)
		}

		// 处理NULL值
		if pronunciation.Valid {
			word.Pronunciation = pronunciation.String
		}
		if audioURL.Valid {
			word.AudioURL = audioURL.String
		}
		if imageURL.Valid {
			word.ImageURL = imageURL.String
		}

		// 如果有进度数据，则填充
		if progressID.Valid {
			word.UserProgress = &UserProgress{
				ID:           int(progressID.Int64),
				UserID:       int(progressUserID.Int64),
				WordID:       int(progressWordID.Int64),
				StudyCount:   int(studyCount.Int64),
				MasteryLevel: masteryLevel.Float64,
				LastStudied:  lastStudied.Time,
				CreatedAt:    progressCreatedAt.Time,
				UpdatedAt:    progressUpdatedAt.Time,
			}
		}

		words = append(words, word)
	}

	return words, nil
}

// GetWordByID 根据ID获取单词
func (s *Service) GetWordByID(id int) (*Word, error) {
	word := &Word{}
	var pronunciation, audioURL, imageURL sql.NullString

	err := s.db.QueryRow(`
		SELECT id, english, chinese, pronunciation, audio_url, image_url,
		       difficulty_level, category, created_at, updated_at
		FROM words WHERE id = ?
	`, id).Scan(
		&word.ID, &word.English, &word.Chinese, &pronunciation,
		&audioURL, &imageURL, &word.DifficultyLevel, &word.Category,
		&word.CreatedAt, &word.UpdatedAt,
	)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, fmt.Errorf("word not found")
		}
		return nil, fmt.Errorf("failed to get word: %w", err)
	}

	// 处理NULL值
	if pronunciation.Valid {
		word.Pronunciation = pronunciation.String
	}
	if audioURL.Valid {
		word.AudioURL = audioURL.String
	}
	if imageURL.Valid {
		word.ImageURL = imageURL.String
	}

	return word, nil
}

// UpdateUserProgress 更新用户学习进度
func (s *Service) UpdateUserProgress(userID int, req *UpdateProgressRequest) error {
	// 检查是否已存在进度记录
	var count int
	err := s.db.QueryRow(`
		SELECT COUNT(*) FROM user_progress 
		WHERE user_id = ? AND word_id = ?
	`, userID, req.WordID).Scan(&count)
	if err != nil {
		return fmt.Errorf("failed to check progress: %w", err)
	}

	if count > 0 {
		// 更新现有记录
		_, err = s.db.Exec(`
			UPDATE user_progress 
			SET study_count = study_count + ?, mastery_level = ?, 
			    last_studied = NOW(), updated_at = NOW()
			WHERE user_id = ? AND word_id = ?
		`, req.StudyCount, req.MasteryLevel, userID, req.WordID)
	} else {
		// 创建新记录
		_, err = s.db.Exec(`
			INSERT INTO user_progress (user_id, word_id, study_count, mastery_level, last_studied)
			VALUES (?, ?, ?, ?, NOW())
		`, userID, req.WordID, req.StudyCount, req.MasteryLevel)
	}

	if err != nil {
		return fmt.Errorf("failed to update progress: %w", err)
	}

	return nil
}

// GetUserProgress 获取用户学习进度
func (s *Service) GetUserProgress(userID int) ([]UserProgress, error) {
	rows, err := s.db.Query(`
		SELECT up.id, up.user_id, up.word_id, up.study_count, up.mastery_level,
		       up.last_studied, up.created_at, up.updated_at,
		       w.english, w.chinese
		FROM user_progress up
		JOIN words w ON up.word_id = w.id
		WHERE up.user_id = ?
		ORDER BY up.last_studied DESC
	`, userID)
	if err != nil {
		return nil, fmt.Errorf("failed to query user progress: %w", err)
	}
	defer rows.Close()

	var progress []UserProgress
	for rows.Next() {
		var p UserProgress
		var english, chinese string
		err := rows.Scan(
			&p.ID, &p.UserID, &p.WordID, &p.StudyCount, &p.MasteryLevel,
			&p.LastStudied, &p.CreatedAt, &p.UpdatedAt,
			&english, &chinese,
		)
		if err != nil {
			return nil, fmt.Errorf("failed to scan progress: %w", err)
		}
		progress = append(progress, p)
	}

	return progress, nil
}

// GetCategories 获取所有分类
func (s *Service) GetCategories() ([]string, error) {
	rows, err := s.db.Query("SELECT DISTINCT category FROM words WHERE category IS NOT NULL ORDER BY category")
	if err != nil {
		return nil, fmt.Errorf("failed to query categories: %w", err)
	}
	defer rows.Close()

	var categories []string
	for rows.Next() {
		var category string
		if err := rows.Scan(&category); err != nil {
			return nil, fmt.Errorf("failed to scan category: %w", err)
		}
		categories = append(categories, category)
	}

	return categories, nil
}
