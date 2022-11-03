SHELL=/bin/bash

.PHONY: help
help:
	@echo	start			:	Initialize containers
	@echo 	stop			:	Stops server

.PHONY: start
start:
	docker-compose up --remove-orphans --force-recreate -d
	@echo ...............................................
	@echo .
	@echo .	DJango API is running in http://localhost:8080
	@echo . React Frontend is running in http://localhost:3000
	@echo .
	@echo ...............................................

.PHONY: stop
stop:
	docker-compose stop

