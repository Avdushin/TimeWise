package version

import (
	"TimeWise/pkg/vars"

	"github.com/Avdushin/gogger/logger"
)

// @ A simple function to beuty print application name and version
func Version() {
	logger.Info("🚀 %s@%s has been started!", vars.APP_NAME, vars.APP_VERSION)
}
