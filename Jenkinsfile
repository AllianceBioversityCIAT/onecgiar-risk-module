pipeline {
  agent any
  stages {
    stage("verify tooling") {
      steps {
        sh '''
          docker version
          docker info
          docker compose version 
          curl --version
          jq --version
        '''
      }
    }  
    stage('Start container') {
      steps {
        sh 'docker compose up -d --no-color --build --wait'
        sh 'docker compose ps'
      }
    }
    stage('Run tests against the container') {
      steps {
        sh 'curl http://localhost:4220/api/under-maintenance/status | jq'
      }
      steps {
        sh 'curl http://localhost:4220/ | jq'
      }
    }
  }
}