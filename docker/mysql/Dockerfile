FROM mysql:8.0

COPY docker/mysql/my.cnf /etc/mysql/conf.d/z-edupangan.cnf
COPY docker/mysql/init/01-init.sql /docker-entrypoint-initdb.d/01-init.sql
