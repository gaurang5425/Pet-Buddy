# Step 1: Use an OpenJDK base image to run Java (JDK 17 or JDK 21)
FROM openjdk:17-jdk-slim

# Step 2: Set the working directory inside the container
WORKDIR /app

# Step 3: Copy all files from your local machine to the /app directory inside the container
COPY . .

# Step 4: Install Maven (since it's not included in the base image)
RUN apt-get update && apt-get install -y maven

# Step 5: Run Maven to build the project and create the JAR file
RUN mvn clean package -DskipTests

# Step 6: Run the JAR file when the container starts
CMD ["java", "-jar", "target/pet-buddy-0.0.1-SNAPSHOT.jar"]
