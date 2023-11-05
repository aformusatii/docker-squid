#!/bin/sh

# Check if the necessary environment variables are set
if [ -n "$USERNAME" ] && [ -n "$PASSWORD" ] && [ -n "$HOSTNAME" ]; then
    # No-IP Update URL
    UPDATE_URL="https://dynupdate.no-ip.com/nic/update"

    # Log file for recording updates
    LOG_FILE="/var/log/noip_update.log"

    # Function to update the IP address using No-IP service
    update_noip() {
        while true; do
            IP=$(curl -s https://ipv4.icanhazip.com)
            if [ -n "$IP" ]; then
                RESULT=$(curl -s -u "$USERNAME:$PASSWORD" -X GET "$UPDATE_URL?hostname=$HOSTNAME&myip=$IP")
                echo "$(date +'%Y-%m-%d %H:%M:%S') - $RESULT" >> "$LOG_FILE"
            else
                echo "$(date +'%Y-%m-%d %H:%M:%S') - Failed to fetch local IP address" >> "$LOG_FILE"
            fi
            sleep 3600  # Sleep for 1 hour (adjust as needed)
        done
    }

    # Call the update function in the background
    update_noip &
else
    echo "Warning: USERNAME, PASSWORD, and HOSTNAME environment variables are not set. Skipping NO_IP update."
fi
