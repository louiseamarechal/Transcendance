# Load debien buster image.
FROM debian:bullseye-slim

# Update package manager.
RUN apt-get update
RUN apt-get upgrade -y

# Install MariaDB.
# RUN apt-get install -y mariadb-server

# # Copy conf file.
# COPY conf/50-server.cnf /etc/mysql/mariadb.conf.d/50-server.cnf

# # Run init script.
# COPY tools/init.sh /

# ENTRYPOINT [ "./init.sh" ]
# CMD [ "mysqld_safe" ]