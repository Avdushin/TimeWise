# variables
appname = app

# run the application
.PHONY: all

# building docs and run the app
all: docs run

# run the app
run:
	go run ./cmd/$(appname)/main.go
# build go app
build:
	go build -o $(appname) ./cmd/$(appname)/main.go

# start binary app
start:
	./$(appname)

# Swagger Documentation
docs:
	swag init -g ./cmd/$(appname)/main.go -o docs --parseDependency --parseInternal