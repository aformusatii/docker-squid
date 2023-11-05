#!/bin/sh

if [ -z "${SQUID_USERNAME}" ] || [ -z "${SQUID_PASSWORD}" ]
then
    echo "SQUID_USERNAME and SQUID_PASSWORD variables are not set, skip."
    
    echo "Use squid.without.auth.conf!"
    cp -f /etc/squid/squid.without.auth.conf /etc/squid/squid.conf
else
    echo "Generate /etc/squid/passwords!"
    htpasswd -b -c /etc/squid/passwords "${SQUID_USERNAME}" "${SQUID_PASSWORD}"
    
    echo "Use squid.with.auth.conf!"
    cp -f /etc/squid/squid.with.auth.conf /etc/squid/squid.conf
fi

if [ -z "${SHOW_ACCESS_LOGS}" ]
then
    echo "SHOW_ACCESS_LOGS variable is not set, skip."
else
    tail -F /var/log/squid/access.log &
fi

if [ -z "${CLOUDFLARE_API_KEY}" ] || [ -z "${CLOUDFLARE_DNS}" ]
then
    echo "CLOUDFLARE_API_KEY and CLOUDFLARE_DNS variables are not set, skip."
else
    curl -k -d "{\"apiKey\":\"${CLOUDFLARE_API_KEY}\", \"host\":\"${CLOUDFLARE_DNS}\"}" -H "Content-Type: application/json" -X POST https://new.htmlsketcher.com/update-ip
fi

/root/no-ip-updater.sh

squid -NYCd 5 -f /etc/squid/squid.conf