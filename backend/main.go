package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	_ "github.com/go-sql-driver/mysql"
)

var db *sql.DB

// --- Response types ---

type HealthResponse struct {
	Message   string    `json:"message"`
	Timestamp time.Time `json:"timestamp"`
}

type Athlete struct {
	ID                    int       `json:"id"`
	Name                  string    `json:"name"`
	Grade                 int       `json:"grade"`
	PersonalRecordSeconds int       `json:"personal_record_seconds"`
	CreatedAt             time.Time `json:"created_at"`
}

type Meet struct {
	ID        int       `json:"id"`
	Name      string    `json:"name"`
	MeetDate  string    `json:"meet_date"`
	Location  string    `json:"location"`
	CreatedAt time.Time `json:"created_at"`
}

type Result struct {
	ID           int       `json:"id"`
	AthleteID    int       `json:"athlete_id"`
	MeetID       int       `json:"meet_id"`
	TimeSeconds  int       `json:"time_seconds"`
	PlaceOverall int       `json:"place_overall"`
	CreatedAt    time.Time `json:"created_at"`
}

// --- Main ---

func main() {
	// Connect to MySQL
	if err := connectDB(); err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}
	defer db.Close()
	log.Println("Connected to MySQL database")

	// API routes
	http.HandleFunc("/api/health", healthHandler)
	http.HandleFunc("/api/hello", helloHandler)
	http.HandleFunc("/api/athletes", athletesHandler)
	http.HandleFunc("/api/meets", meetsHandler)
	http.HandleFunc("/api/results", resultsHandler)

	port := getEnv("PORT", "8080")
	fmt.Printf("Server starting on port %s...\n", port)
	fmt.Printf("Health check: http://localhost:%s/api/health\n", port)

	if err := http.ListenAndServe(":"+port, enableCORS(http.DefaultServeMux)); err != nil {
		log.Fatal(err)
	}
}

// --- Database ---

func connectDB() error {
	host := getEnv("DB_HOST", "localhost")
	port := getEnv("DB_PORT", "3306")
	user := getEnv("DB_USER", "root")
	password := getEnv("DB_PASSWORD", "")
	name := getEnv("DB_NAME", "jones_county_xc")

	dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?parseTime=true", user, password, host, port, name)

	var err error
	db, err = sql.Open("mysql", dsn)
	if err != nil {
		return err
	}

	db.SetMaxOpenConns(10)
	db.SetMaxIdleConns(5)
	db.SetConnMaxLifetime(5 * time.Minute)

	return db.Ping()
}

func getEnv(key, fallback string) string {
	if val := os.Getenv(key); val != "" {
		return val
	}
	return fallback
}

// --- Handlers ---

func healthHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(HealthResponse{
		Message:   "Server is running",
		Timestamp: time.Now(),
	})
}

func helloHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(HealthResponse{
		Message:   "Hello from Jones County XC backend!",
		Timestamp: time.Now(),
	})
}

func athletesHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	rows, err := db.Query("SELECT id, name, grade, personal_record_seconds, created_at FROM athletes")
	if err != nil {
		log.Printf("Error querying athletes: %v", err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	athletes := []Athlete{}
	for rows.Next() {
		var a Athlete
		if err := rows.Scan(&a.ID, &a.Name, &a.Grade, &a.PersonalRecordSeconds, &a.CreatedAt); err != nil {
			log.Printf("Error scanning athlete row: %v", err)
			http.Error(w, "Internal server error", http.StatusInternalServerError)
			return
		}
		athletes = append(athletes, a)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(athletes)
}

func meetsHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	rows, err := db.Query("SELECT id, name, meet_date, location, created_at FROM meets")
	if err != nil {
		log.Printf("Error querying meets: %v", err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	meets := []Meet{}
	for rows.Next() {
		var m Meet
		var meetDate time.Time
		if err := rows.Scan(&m.ID, &m.Name, &meetDate, &m.Location, &m.CreatedAt); err != nil {
			log.Printf("Error scanning meet row: %v", err)
			http.Error(w, "Internal server error", http.StatusInternalServerError)
			return
		}
		m.MeetDate = meetDate.Format("2006-01-02")
		meets = append(meets, m)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(meets)
}

func resultsHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	rows, err := db.Query("SELECT id, athlete_id, meet_id, time_seconds, place_overall, created_at FROM results")
	if err != nil {
		log.Printf("Error querying results: %v", err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	results := []Result{}
	for rows.Next() {
		var res Result
		if err := rows.Scan(&res.ID, &res.AthleteID, &res.MeetID, &res.TimeSeconds, &res.PlaceOverall, &res.CreatedAt); err != nil {
			log.Printf("Error scanning result row: %v", err)
			http.Error(w, "Internal server error", http.StatusInternalServerError)
			return
		}
		results = append(results, res)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(results)
}

// --- Middleware ---

func enableCORS(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		next.ServeHTTP(w, r)
	})
}
