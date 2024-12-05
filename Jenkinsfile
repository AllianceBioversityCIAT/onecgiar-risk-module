pipeline {
  agent any
  stages {
    stage('verify tooling') {
      steps {
        slackSend color: 'black', message: 'Barq build process is started'
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
  }
  post {
    always {
      slackSend color: 'black', message: 'Barq build process is finished'
    }
    success {
      slackSend color: 'good', message: 'Barq build process is done successfully!'
    }
    failure {
      slackSend color: 'bad', message: 'Barq build process is done with failure'
      writeFile file: 'jenkins_console_output.txt', text: currentBuild.rawBuild.logFile.text
      sh 'sed -ri "s/\\x1b\\[8m.*?\\x1b\\[0m//g" jenkins_console_output.txt'
      slackUploadFile filePath: 'jenkins_console_output.txt', initialComment: 'here is the log file '
    }
  }
}
