FROM alpine
#
RUN set -xe \
    && apk add --no-cache --purge -uU apache2-utils squid curl \
    #&& ln -sf python3 /usr/bin/python \
    #&& python3 -m ensurepip \
    #&& pip3 install --no-cache --upgrade pip setuptools \
    && rm -rf /var/cache/apk/* /tmp/* 
#
COPY squid/squid.with.auth.conf /etc/squid/squid.with.auth.conf
COPY squid/squid.without.auth.conf /etc/squid/squid.without.auth.conf

ADD squid/run.sh /root/run.sh
ADD squid/no-ip-updater.sh /root/no-ip-updater.sh

EXPOSE 3128
#
#ENTRYPOINT ["squid", "-NYCd", "5", "-f", "/etc/squid/squid.conf"]
ENTRYPOINT ["sh", "/root/run.sh"]