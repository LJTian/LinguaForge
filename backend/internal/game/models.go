package game

import (
	"time"
)

// GameType 游戏类型
type GameType string

const (
	GameTypeAdventure GameType = "adventure"
	GameTypeDefense   GameType = "defense"
	GameTypeDubbing   GameType = "dubbing"
)

// GameRecord 游戏记录
type GameRecord struct {
	ID           int       `json:"id" db:"id"`
	UserID       int       `json:"user_id" db:"user_id"`
	GameType     GameType  `json:"game_type" db:"game_type"`
	Score        int       `json:"score" db:"score"`
	LevelReached int       `json:"level_reached" db:"level_reached"`
	TimeSpent    int       `json:"time_spent" db:"time_spent"`
	CompletedAt  time.Time `json:"completed_at" db:"completed_at"`
}

// AdventureGame 冒险游戏
type AdventureGame struct {
	ID           int               `json:"id"`
	UserID       int               `json:"user_id"`
	CurrentLevel int               `json:"current_level"`
	Score        int               `json:"score"`
	Story        string            `json:"story"`
	Options      []AdventureOption `json:"options"`
	Words        []AdventureWord   `json:"words"`
	Completed    bool              `json:"completed"`
}

type AdventureOption struct {
	ID       int    `json:"id"`
	Text     string `json:"text"`
	Correct  bool   `json:"correct"`
	Feedback string `json:"feedback"`
}

type AdventureWord struct {
	ID       int    `json:"id"`
	English  string `json:"english"`
	Chinese  string `json:"chinese"`
	Required bool   `json:"required"`
}

// DefenseGame 塔防游戏
type DefenseGame struct {
	ID          int            `json:"id"`
	UserID      int            `json:"user_id"`
	CurrentWave int            `json:"current_wave"`
	Score       int            `json:"score"`
	Health      int            `json:"health"`
	Coins       int            `json:"coins"`
	Enemies     []DefenseEnemy `json:"enemies"`
	Towers      []DefenseTower `json:"towers"`
	Words       []DefenseWord  `json:"words"`
	Completed   bool           `json:"completed"`
}

type DefenseEnemy struct {
	ID       int    `json:"id"`
	Type     string `json:"type"`
	Health   int    `json:"health"`
	Speed    int    `json:"speed"`
	Position int    `json:"position"`
	WordID   int    `json:"word_id"`
}

type DefenseTower struct {
	ID       int    `json:"id"`
	Type     string `json:"type"`
	Level    int    `json:"level"`
	Damage   int    `json:"damage"`
	Range    int    `json:"range"`
	Position int    `json:"position"`
	WordID   int    `json:"word_id"`
}

type DefenseWord struct {
	ID       int    `json:"id"`
	English  string `json:"english"`
	Chinese  string `json:"chinese"`
	Correct  bool   `json:"correct"`
	Answered bool   `json:"answered"`
}

// DubbingGame 配音游戏
type DubbingGame struct {
	ID        int             `json:"id"`
	UserID    int             `json:"user_id"`
	SceneID   int             `json:"scene_id"`
	Score     int             `json:"score"`
	Scripts   []DubbingScript `json:"scripts"`
	Completed bool            `json:"completed"`
}

type DubbingScript struct {
	ID           int    `json:"id"`
	Character    string `json:"character"`
	Text         string `json:"text"`
	AudioURL     string `json:"audio_url"`
	UserAudioURL string `json:"user_audio_url,omitempty"`
	Score        int    `json:"score,omitempty"`
	Completed    bool   `json:"completed"`
}

// GameRequest 游戏请求
type GameRequest struct {
	GameType GameType `json:"game_type" binding:"required"`
	Level    int      `json:"level,omitempty"`
}

// GameResponse 游戏响应
type GameResponse struct {
	Game interface{} `json:"game"`
}

// SubmitScoreRequest 提交分数请求
type SubmitScoreRequest struct {
	GameType     GameType `json:"game_type" binding:"required"`
	Score        int      `json:"score"`
	LevelReached int      `json:"level_reached"`
	TimeSpent    int      `json:"time_spent"`
	GameData     string   `json:"game_data,omitempty"`
}

// SubmitDubbingRequest 提交配音请求
type SubmitDubbingRequest struct {
	SceneID   int    `json:"scene_id" binding:"required"`
	ScriptID  int    `json:"script_id" binding:"required"`
	AudioData string `json:"audio_data" binding:"required"`
	TimeSpent int    `json:"time_spent"`
}
