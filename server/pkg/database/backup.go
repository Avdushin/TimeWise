package database

import (
	"TimeWise/pkg/vars"
	"archive/zip"
	"context"
	"fmt"
	"io"
	"log"
	"os"
	"os/exec"
	"path/filepath"
	"runtime"
	"time"
)

// CreateBackup creates a backup of the database by pg_dump util
func CreateBackup() error {
	now := time.Now().Local()
	backupFileName := fmt.Sprintf("%s/%s.sql", vars.BACKUP_DIR, now.Format("2006-01-02_15-04-05"))

	cmdArgs := []string{
		"-h", os.Getenv("host"),
		"-U", os.Getenv("user"),
		"--file", backupFileName,
		os.Getenv("DB"),
	}

	var cmd *exec.Cmd
	switch runtime.GOOS {
	case "windows":
		// Windows
		cmd = exec.Command("C:\\Program Files\\PostgreSQL\\14\\bin\\pg_dump.exe", cmdArgs...)
	default:
		// Unix
		cmd = exec.Command("pg_dump", cmdArgs...)
	}

	output, err := cmd.CombinedOutput()
	if err != nil {
		return fmt.Errorf("[DB|BACKUP]: Error creating database backup: %v\n%s", err, output)
	}

	log.Printf("[DB|BACKUP]: Database backup created and saved in %s\n", backupFileName)
	return nil
}

// MakeDBDump creates a dump of the database periodically.
func MakeDBDump(ctx context.Context) {
	if _, err := os.Stat(vars.BACKUP_DIR); os.IsNotExist(err) {
		os.Mkdir(vars.BACKUP_DIR, os.ModePerm)
	}

	if _, err := os.Stat(vars.BACKUP_DIR); os.IsNotExist(err) {
		os.Mkdir(vars.BACKUP_DIR, os.ModePerm)
	}

	// @Backup interval
	intervalStr := os.Getenv("BACKUP_INTERVAL")
	backupInterval, err := time.ParseDuration(intervalStr)
	if err != nil {
		log.Fatalf("Failed to parse BACKUP_INTERVAL: %v", err)
	}

	ticker := time.NewTicker(backupInterval)
	defer ticker.Stop()

	for {
		select {
		case <-ticker.C:
			err := CreateBackup()
			if err != nil {
				log.Printf("[DB|BACKUP]: Error creating database dump: %v", err)
			}

			err = ZipDumps(vars.BACKUP_DIR)
			if err != nil {
				log.Printf("[DB|BACKUP]: Error archiving database dumps: %v", err)
			}

		case <-ctx.Done():
			// Shutdown gracefully
			return
		}
	}
}

// ZipDumps zips the database dumps in the specified directory.
func ZipDumps(dumpDirectory string) error {
	// Список всех дампов в указанной директории
	dumps, err := filepath.Glob(filepath.Join(dumpDirectory, "*.dump"))
	if err != nil {
		return fmt.Errorf("failed to list database dumps: %v", err)
	}

	// Если количество дампов больше 5, создаем zip-архив
	if len(dumps) >= 5 {
		zipFileName := fmt.Sprintf("%s.zip", time.Now().Format("02-01-2006-15-04-05"))
		zipFilePath := filepath.Join(dumpDirectory, zipFileName)

		zipFile, err := os.Create(zipFilePath)
		if err != nil {
			return fmt.Errorf("failed to create zip file: %v", err)
		}
		defer zipFile.Close()

		zipWriter := zip.NewWriter(zipFile)
		defer zipWriter.Close()

		// Добавляем каждый дамп в архив
		for _, dump := range dumps {
			dumpFile, err := os.Open(dump)
			if err != nil {
				return fmt.Errorf("failed to open dump file: %v", err)
			}
			defer dumpFile.Close()

			// Имя файла в архиве будет тем же, что и у дампа
			zipFile, err := zipWriter.Create(filepath.Base(dump))
			if err != nil {
				return fmt.Errorf("failed to create zip entry: %v", err)
			}

			// Копируем содержимое дампа в архив
			_, err = io.Copy(zipFile, dumpFile)
			if err != nil {
				return fmt.Errorf("failed to copy dump to zip: %v", err)
			}
		}

		// Удаляем оригинальные дампы после упаковки в архив
		for _, dump := range dumps {
			err := os.Remove(dump)
			if err != nil {
				return fmt.Errorf("failed to remove dump file: %v", err)
			}
		}
	}

	return nil
}
