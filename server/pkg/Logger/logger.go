package logger

import (
	"github.com/Avdushin/gogger/lib"
	"github.com/Avdushin/gogger/logger"
)

func Logger() *lib.Logger {
	log := logger.InitLogger()

	return log
}
