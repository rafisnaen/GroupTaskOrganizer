package handlers

import (
	"encoding/json"
	"group-task-organizer/database"
	"group-task-organizer/models"
	"net/http"
	"strconv"
	"strings"
)

// Function buat ambil ID dari URL path (ex: /tasks/1 -> nanti return 1)
func getIDFromPath(path string, prefix string) (int, error) {
	// Potong prefixnya, misal "/tasks/"
	idStr := strings.TrimPrefix(path, prefix)
	return strconv.Atoi(idStr)
}

// GET /users/{id}/tasks
func GetUserTasks(w http.ResponseWriter, r *http.Request) {
	// Parse si URL pake manual: /users/{id}/tasks
	parts := strings.Split(r.URL.Path, "/")
	if len(parts) < 3 {
		http.Error(w, "Invalid URL", http.StatusBadRequest)
		return
	}
	userID, err := strconv.Atoi(parts[2]) // 2 karna idnya
	if err != nil {
		http.Error(w, "Invalid User ID", http.StatusBadRequest)
		return
	}

	rows, err := database.DB.Query("SELECT id, user_id, title, description, status, deadline FROM tasks WHERE user_id = $1", userID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var tasks []models.Task
	for rows.Next() {
		var t models.Task
		if err := rows.Scan(&t.ID, &t.UserID, &t.Title, &t.Description, &t.Status, &t.Deadline); err != nil {
			continue
		}
		tasks = append(tasks, t)
	}
	jsonResponse(w, http.StatusOK, tasks)
}

// POST /users/{id}/tasks
func CreateTask(w http.ResponseWriter, r *http.Request) {
	parts := strings.Split(r.URL.Path, "/")
	if len(parts) < 3 {
		http.Error(w, "Invalid URL", http.StatusBadRequest)
		return
	}
	userID, err := strconv.Atoi(parts[2])
	if err != nil {
		http.Error(w, "Invalid User ID", http.StatusBadRequest)
		return
	}

	var t models.Task
	if err := json.NewDecoder(r.Body).Decode(&t); err != nil {
		http.Error(w, "Invalid input", http.StatusBadRequest)
		return
	}

	// Validasi status
	if t.Status != "todo" && t.Status != "progress" && t.Status != "done" {
		http.Error(w, "Status must be todo, progress, or done", http.StatusBadRequest)
		return
	}

	sqlStatement := `INSERT INTO tasks (user_id, title, description, status, deadline) VALUES ($1, $2, $3, $4, $5) RETURNING id`
	err = database.DB.QueryRow(sqlStatement, userID, t.Title, t.Description, t.Status, t.Deadline).Scan(&t.ID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	t.UserID = userID
	jsonResponse(w, http.StatusCreated, t)
}

// PUT /tasks/{id}
func UpdateTask(w http.ResponseWriter, r *http.Request) {
	// Ambil ID dari URL path parameter
	idStr := r.PathValue("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		http.Error(w, "Invalid Task ID", http.StatusBadRequest)
		return
	}

	var t models.Task
	if err := json.NewDecoder(r.Body).Decode(&t); err != nil {
		http.Error(w, "Invalid input", http.StatusBadRequest)
		return
	}

	// Validasi input minimal
	if t.Status != "" && (t.Status != "todo" && t.Status != "progress" && t.Status != "done") {
		http.Error(w, "Status must be todo, progress, or done", http.StatusBadRequest)
		return
	}

	// Query utk update
	sqlStatement := `
		UPDATE tasks 
		SET title = $1, description = $2, status = $3, deadline = $4
		WHERE id = $5
		RETURNING id, user_id`

	err = database.DB.QueryRow(sqlStatement, t.Title, t.Description, t.Status, t.Deadline, id).Scan(&t.ID, &t.UserID)
	if err != nil {
		// Klo error karna task ngak ditemukan
		http.Error(w, "Task not found or update failed: "+err.Error(), http.StatusNotFound)
		return
	}

	jsonResponse(w, http.StatusOK, t)
}

// DELETE /tasks/{id}
func DeleteTask(w http.ResponseWriter, r *http.Request) {
	idStr := r.PathValue("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		http.Error(w, "Invalid Task ID", http.StatusBadRequest)
		return
	}

	result, err := database.DB.Exec("DELETE FROM tasks WHERE id = $1", id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	rowsAffected, _ := result.RowsAffected()
	if rowsAffected == 0 {
		http.Error(w, "Task not found", http.StatusNotFound)
		return
	}

	jsonResponse(w, http.StatusOK, map[string]string{"message": "Task deleted successfully"})
}
