# for dev env -- uses local jar
FROM eclipse-temurin:21-jdk-jammy
ARG JAR_FILE=target/quickcart-0.0.1-SNAPSHOT.jar
COPY ${JAR_FILE} /app/app.jar
ENTRYPOINT ["java","-jar","/app/app.jar"]

# to run first run -> mvn -DskipTests clean package
# then -> docker compose up --build

# for Production

# Build stage
#FROM maven:3.10.1-eclipse-temurin-21 as build
#WORKDIR /workspace
#COPY pom.xml .
#RUN mvn -q -DskipTests dependency:go-offline
#COPY src ./src
#RUN mvn -q -DskipTests clean package
#
## Run stage
#FROM eclipse-temurin:21-jdk-jammy
#ARG JAR_FILE=/workspace/target/quickcart-0.0.1-SNAPSHOT.jar
#COPY --from=build ${JAR_FILE} /app/app.jar
#ENTRYPOINT ["java","-jar","/app/app.jar"]
