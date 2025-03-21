FROM openjdk:21-jdk-slim

WORKDIR /app

COPY build/libs/k8s-*.jar /app/k8s.jar

ENTRYPOINT ["java", "-jar", "k8s.jar"]
