#!/bin/sh

# Check if the necessary environment variables are set
if [ -n "$NO_IP_USERNAME" ] && [ -n "$NO_IP_PASSWORD" ] && [ -n "$NO_IP_HOSTNAME" ]; then
    USERNAME="$NO_IP_USERNAME"
    PASSWORD="$NO_IP_PASSWORD"
    HOSTNAME="$NO_IP_HOSTNAME"

    # No-IP Update URL
    UPDATE_URL="https://dynupdate.no-ip.com/nic/update"

    # Function to update the IP address using No-IP service
    update_noip() {
        while true; do
            IP=$(curl -s https://ipv4.icanhazip.com)
            if [ -n "$IP" ]; then
                RESULT=$(curl -s -u "$USERNAME:$PASSWORD" -X GET "$UPDATE_URL?hostname=$HOSTNAME&myip=$IP")
                echo "$(date +'%Y-%m-%d %H:%M:%S') - Updated DNS: $RESULT"
            else
                echo "$(date +'%Y-%m-%d %H:%M:%S') - Failed to fetch local IP address"
            fi
            sleep 1800  # Run each 30 minutes
        done
    }

    # Call the update function in the background
    update_noip &
else
    echo "Warning: NO_IP_USERNAME, NO_IP_PASSWORD, and NO_IP_HOSTNAME environment variables are not set. Skipping update."
fi
