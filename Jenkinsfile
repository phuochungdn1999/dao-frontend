pipeline {
  options {
    disableConcurrentBuilds();
    buildDiscarder(logRotator(artifactDaysToKeepStr: '', artifactNumToKeepStr: '', daysToKeepStr: '1', numToKeepStr: '1'));
  }
  agent any
  environment {
    NODE_OPTIONS = '--max-old-space-size=16384'
  }
  stages {
    stage('Install') {
      steps {
        nodejs('nodejs-14') {
          sh 'yarn install --frozen-lockfile'
        }
      }
    }
    stage('BUILD') {
      steps {
        nodejs('nodejs-14') {
          sh 'npx browserslist@latest --update-db; yarn run build'
        }
      }
    }
    stage('Archive') {
      parallel {
        stage('archive web') {
          steps {
            archiveArtifacts(artifacts: 'build/', onlyIfSuccessful: true)
          }
        }
      }
    }
    stage('Deploy yf.b100pro.com') {
          when {
            branch 'main'
          }
          steps {
            //https://www.jenkins.io/doc/pipeline/steps/publish-over-ssh/
            sshPublisher(
              failOnError: true,
              publishers: [
                sshPublisherDesc(
                  configName: 'yearnAgnostic',
                  transfers: [
                    sshTransfer(
                        cleanRemote: false,
                        remoteDirectory: 'yf.b100pro.com/${BUILD_TAG}',
                        sourceFiles: '''
                        build/,
                        ''',
                        execCommand: '''
                        set -e
                        set -x
                        BUILD=${BUILD_TAG}
                        SRC=/home/jenkins-www/yf.b100pro.com
                        WWW=/var/www/yf.b100pro.com

                        DEST=${WWW}/web
                        rm -f ${DEST}
                        ln -s -f -d ${SRC}/${BUILD}/build ${DEST}

                        for i in `ls -d ${SRC}/* | grep -v "${BUILD}$"`;do rm -rf  "${i}"; done
                        ''',
                        execTimeout: 120000,
                        flatten: false,
                        makeEmptyDirs: false,
                        noDefaultExcludes: false,
                        patternSeparator: '[, ]+',
                        remoteDirectorySDF: false,
                        removePrefix: ''
                      )
                  ],
                  usePromotionTimestamp: false,
                  useWorkspaceInPromotion: false,
                  verbose: true
                )
              ]
            )
          }
       } 
    }
}
