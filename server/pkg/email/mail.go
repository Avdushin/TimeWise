package email

import (
	"TimeWise/pkg/vars"
	"fmt"
	"net/smtp"
)

// @ SendEmail sends an email with the given subject and body to the specified recipient
func SendEmail(to, subject, body string) error {
	auth := smtp.PlainAuth(
		"",
		vars.POST_NAME,
		vars.POST_PASS,
		vars.POST_SERVER,
	)

	msg := fmt.Sprintf("Subject: %s\r\nContent-Type: text/html; charset=UTF-8\r\n\r\n%s", subject, body)

	err := smtp.SendMail(
		fmt.Sprintf("%s:%s", vars.POST_SERVER, vars.POST_PORT),
		auth,
		vars.POST_NAME,
		[]string{to},
		[]byte(msg),
	)

	if err != nil {
		return fmt.Errorf("Неудалось отправить email: %s", err)
	}

	return nil
}
