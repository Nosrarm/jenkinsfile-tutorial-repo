pipeline {
    agent any
    stages {
        stage('Build') {
            steps {
                sh 'docker build -t salem-moderator .'   
            }
        }
        stage('Deploy') {
            steps {
                sh 'docker run -d -p 28080:80 --name salem-app salem-moderator'
            }
        }
    }
}