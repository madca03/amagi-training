install-service:
	@mkdir -p /var/log/amagi-training-ex1
	@chmod +x ./scripts/*.sh
	@cp scripts/*.sh /usr/local/bin
	@cp scripts/*.service /etc/systemd/system
	@systemctl daemon-reload
	@systemctl enable amagi.training.ex1.service
	@systemctl start amagi.training.ex1.service
	@echo "Displaying status of service in 10 secs..."
	@sleep 10
	systemctl status amagi.training.ex1.service