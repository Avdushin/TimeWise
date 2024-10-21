package main

import (
	"fmt"
	"time"
)

func main() {
	// Устанавливаем часовой пояс Москвы
	location, err := time.LoadLocation("Europe/Moscow")
	if err != nil {
		fmt.Println("Failed to load location:", err)
		return
	}

	// Получаем текущее время в Москве
	currentTime := time.Now().In(location)

	// Прибавляем 10 секунд
	newTime := currentTime.Add(1 * time.Minute)

	// Форматируем новое время в нужный формат
	formattedTime := newTime.Format("2006-01-02T15:04:05.999999-07:00")

	fmt.Println(formattedTime)
}
