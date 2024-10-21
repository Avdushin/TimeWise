package utils

import "time"

func ParseBirthday(birthDate string) (string, error) {
	// Проверка наличия даты рождения
	if birthDate == "" {
		return "Данные отсутствуют", nil
	}

	// Пробуем разобрать дату в формате "RFC3339"
	birthdayTime, err := time.Parse(time.RFC3339, birthDate)
	if err != nil {
		// Если не удалось разобрать в формате RFC3339, пробуем разобрать в формате "02.01.2006"
		birthdayTime, err = time.Parse("02.01.2006", birthDate)
		if err != nil {
			return "", err
		}
	}

	// Форматирование даты в требуемый формат
	formattedBirthday := birthdayTime.Format("02.01.2006")
	return formattedBirthday, nil
}

// func ParseBirthday(birthDate string) (string, error) {
// 	// Проверка наличия даты рождения
// 	if birthDate == "" {
// 		return "Данные отсутствуют", nil
// 	}

// 	// Пробуем разобрать дату в формате "RFC3339"
// 	birthdayTime, err := time.Parse(time.RFC3339, birthDate)
// 	if err != nil {
// 		// Если не удалось разобрать в формате RFC3339, пробуем разобрать в формате "02.01.2006"
// 		birthdayTime, err = time.Parse("02.01.2006", birthDate)
// 		if err != nil {
// 			// Если не удалось разобрать в формате "02.01.2006", пробуем разобрать в формате "10.03.2002"
// 			birthdayTime, err = time.Parse("02.01.2006", birthDate)
// 			if err != nil {
// 				return "", err
// 			}
// 		}
// 	}

// 	// Форматирование даты в требуемый формат
// 	formattedBirthday := birthdayTime.Format("02.01.2006")

// 	return formattedBirthday, nil
// }
