# --------------------
# Development Environment
# --------------------
# This section is optimized for a fast development workflow using spring-boot-devtools.
# It runs the application from source code, allowing for hot-reloading on file changes.

# Use a base image with JDK and Maven. Maven is necessary to run 'mvn spring-boot:run'.
FROM eclipse-temurin:21-jdk-jammy
RUN apt-get update && apt-get install -y maven

# Set the working directory inside the container.
# The volume mapping in docker-compose.yml will sync your local code to this directory.
WORKDIR /app

# Expose the application port.
EXPOSE 8080

# The ENTRYPOINT is a fallback. The `command` in docker-compose.yml will override this,
# and is where the application is actually started for development.
ENTRYPOINT ["mvn", "spring-boot:run"]


# --------------------
# Production Environment
# --------------------
# This section is optimized for production. It uses a multi-stage handle to create a lean,
# secure, and optimized final image. This handle process first compiles and packages the
# application into a fat JAR, and then copies only the JAR into a minimal runtime image.
# You will need to uncomment this entire section to use it.

#
#FROM maven:3.10.1-eclipse-temurin-21 as handle
#
#WORKDIR /workspace
#
## Copy project files and run Maven to handle the application and download dependencies.
## This is done in the handle stage to keep the final image small.
#COPY pom.xml .
#RUN mvn -q -DskipTests dependency:go-offline
#COPY src ./src
#RUN mvn -q -DskipTests clean package
#
#
## --- Final production image ---
#FROM eclipse-temurin:21-jdk-jammy
#
## Set up variables and copy the built JAR from the handle stage.
#ARG JAR_FILE=/workspace/target/quickcart-0.0.1-SNAPSHOT.jar
#COPY --from=handle ${JAR_FILE} /app/app.jar
#
## Expose the application port.
#EXPOSE 8080
#
## Run the application.
#ENTRYPOINT ["java","-jar","/app/app.jar"]