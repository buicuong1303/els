def determineRepoUrl() {
  return scm.userRemoteConfigs[0].url
}

def determineRepoName() {
  return scm.getUserRemoteConfigs()[0].getUrl().tokenize('/').last().split("\\.")[0]
}

def determineBranchName() {
  def branchName = scm.branches[0].name
  if (branchName.contains("*/")) {
    branchName = branchName.split("\\*/")[1]
  }

  return branchName
}

def getImageTag() {
  return sh(returnStdout: true, script: "git tag --sort version:refname | tail -1").trim()
}

def getCommitHash() {
  return sh(returnStdout: true, script: "git rev-parse --short=10 HEAD").trim()
}

def getLastCommitAuthor() {
  return sh(returnStdout: true, script: "git log -1 --pretty=format:'%an'").trim()
}

def getLastCommitAuthorEmail() {
  return sh(returnStdout: true, script: "git log -1 --pretty=format:'%ae'").trim()
}

def getLastCommitMessage() {
  return sh(returnStdout: true, script: "git log -1 --pretty=%B").trim()
}

node {
  def GITLAB_CREDENTIAL = 'gitlab-password'
  def TAG_NAME = '0.0.0'
  def APP_NAME = ''
  def IMAGE_BASE_NAME = 'registry.gitlab.com/php-software-team/els/english-learning-system'
  def IMAGE_REGISTRY = 'https://registry.gitlab.com/php-software-team/els/english-learning-system'
  def REPO_URL = ''
  def BRANCH_NAME=''

  def DEVOPS_REPO_URL = 'https://gitlab.com/php-software-team/els/devops.git'
  def DEVOPS_REPO_BRANCH = 'develop'

  def enhancedChangeAppNames = []
  def build_ok = true
  def lastCommitAuthor = ''
  def lastCommitAuthorEmail=''
  def rebuildBaseImage = false
  def kOverlay = ''
  // def GITLAB_REGISTRY_CREDENTIAL = credentials('gitlab-password');

  try {
    // CONTINUOUS INTEGRATION
    dir('source-code') {
      stage('Clone code') {
        echo 'Clone code...'

        BRANCH_NAME = env.BRANCH_NAME
        REPO_URL = determineRepoUrl()
        git credentialsId: GITLAB_CREDENTIAL, url: REPO_URL

        if(env.TAG_NAME == BRANCH_NAME && env.TAG_NAME.substring(0,1) == 'v') {
          kOverlay = 'prod'
          TAG_NAME = env.TAG_NAME

          checkout scm: [$class: 'GitSCM', userRemoteConfigs: [[url: REPO_URL, credentialsId: GITLAB_CREDENTIAL]], branches: [[name: TAG_NAME]]],poll: false
        } else if(BRANCH_NAME == 'staging') {
          git url: REPO_URL,
              credentialsId: GITLAB_CREDENTIAL, // cannot using environment variable at here
              branch: BRANCH_NAME

          kOverlay = 'staging'
          TAG_NAME = "sta_${getCommitHash()}";
        } else {
          git url: REPO_URL,
              credentialsId: GITLAB_CREDENTIAL, // cannot using environment variable at here
              branch: BRANCH_NAME

          kOverlay = 'demo'
          TAG_NAME = "dev_${getCommitHash()}";
        }

        // prepare infomation for commit message at devops repo
        lastCommitAuthor = getLastCommitAuthor()
        lastCommitAuthorEmail = getLastCommitAuthorEmail()
        rebuildBaseImage = getLastCommitMessage().substring(0, 6).contains('@deps@')
      }

      stage('SonarQube analysis') {
        def scannerHome = tool 'sonarqube-scanner' // Name of sonarqube runner tools in jenins plugin

        withSonarQubeEnv('sonarqube-server') { // If you have configured more than one global server connection, you can specify its name
          nodejs(nodeJSInstallationName: 'node14') {
            sh "${scannerHome}/bin/sonar-scanner -Dsonar.projectKey=els -Dsonar.ws.timeout=120000"
          }
        }
      }

      stage("Quality gate") {
        timeout(time: 1, unit: 'HOURS') { // Just in case something goes wrong, pipeline will be killed after a timeout
          def qg = waitForQualityGate() // Reuse taskId previously collected by withSonarQubeEnv
          if (qg.status != 'OK') {
            error "Pipeline aborted due to quality gate failure: ${qg.status}"
          }
        }
      }

      // stage('Install dependencies') {
      //   echo 'Install dependencies...'

      //   nodejs(nodeJSInstallationName: 'node14') {
      //     sh 'npx yarn install --ignore-egines'
      //   }
      // }

      stage('Detect app change') {
        echo 'Detect app change...'

        nodejs(nodeJSInstallationName: 'node14') {
          cmd='''#!/bin/bash
            change_app_name_raw=`npx nx affected:apps --base=HEAD~1 --head=HEAD`

            app_names=''

            # filter app name
            while read -r line; do
              if [[ "${line:0:1}" == "-" ]]
              then
                line_length=${#line}

                # echo "${line:2:${line_length}}"
                app_names+=" ${line:2:${line_length}}"
              fi

            done <<< "${change_app_name_raw}"

            echo ${app_names}
          '''

          def changeAppNamesRaw = sh(returnStdout: true, script: cmd)

          def changeAppNames = changeAppNamesRaw.split(" ")

          for(changeAppName in changeAppNames) {
            def enhancedAppName = [:]
            enhancedAppName = [
              appLayer: changeAppName.substring(0, changeAppName.indexOf('-')).trim(),
              appName: changeAppName.substring(changeAppName.indexOf('-') + 1, changeAppName.length()).trim(),
              isBuildCompleted: true
            ]
            enhancedChangeAppNames.push(enhancedAppName)
          }

          echo 'List change app'
          for(enhancedAppName in enhancedChangeAppNames) {
            echo "${enhancedAppName.appLayer}-${enhancedAppName.appName}"
          }
        }
      }

      stage('Pull lastest image') {
        echo 'Pull lastest image...'

        withDockerRegistry(credentialsId: GITLAB_CREDENTIAL, url: IMAGE_REGISTRY) {
          // Prealocate dict/map of branchstages
          def branchedStages = [:]

          for(enhancedAppName in enhancedChangeAppNames) {
            def appLayer = "${enhancedAppName.appLayer}"
            def appName = "${enhancedAppName.appName}"
            echo "Parallel pull: ${appLayer}-${appName}"

            branchedStages["${appLayer}-${appName}"] = {
              try {
                stage("Parallel pull stage: ${appLayer}-${appName}") {
                  sh "docker pull ${IMAGE_BASE_NAME}/${appLayer}-${appName}:latest"
                }
              } catch(e) {
                echo e.toString()
              }
            }
          }

          // Execute the stages in parallel
          parallel branchedStages
        }
      }

      stage('Prepare "deps" image') {
        echo 'Prepare "deps" image...'
        withDockerRegistry(credentialsId: GITLAB_CREDENTIAL, url: IMAGE_REGISTRY) {
          sh "docker pull ${IMAGE_BASE_NAME}/deps:latest"

          if(rebuildBaseImage) {
            sh "DOCKER_BUILDKIT=1 docker build -f .deploy/prod/Dockerfile --tag ${IMAGE_BASE_NAME}/deps:latest --target deps ."
            sh "docker push ${IMAGE_BASE_NAME}/deps:latest"
          } else {
            sh "docker pull ${IMAGE_BASE_NAME}/deps:latest"
          }
        }
      }

      stage('Build image') {
        echo 'Build image...'

        // Prealocate dict/map of branchstages
        def branchedStages = [:]

        for(enhancedAppName in enhancedChangeAppNames) {
          def appLayer = "${enhancedAppName.appLayer}"
          def appName = "${enhancedAppName.appName}"

          echo "Parallel build: ${appLayer}-${appName}"

          branchedStages["${appLayer}-${appName}"] = {
            stage("Parallel build stage: ${appLayer}-${appName}") {
              try {
                if(appLayer == 'client') {
                  sh "cp apps/client/${appName}" + "/env apps/client/${appName}/.env"
                }

                sh "DOCKER_BUILDKIT=1 docker build -f .deploy/prod/Dockerfile --tag ${IMAGE_BASE_NAME}/${appLayer}-${appName}:${TAG_NAME} --tag ${IMAGE_BASE_NAME}/${appLayer}-${appName}:latest --target runner-${appLayer} --build-arg APP_LAYER=${appLayer} --build-arg APP_NAME=${appName} --cache-from ${IMAGE_BASE_NAME}/${appLayer}-${appName}:latest ."
              } catch(e) {
                build_ok = false
                enhancedAppName.isBuildCompleted = false
                echo e.toString()
              }
            }
          }
        }

        // Execute the stages in parallel
        parallel branchedStages
      }

      stage('Publish image') {
        echo 'Publish image...'

        withDockerRegistry(credentialsId: GITLAB_CREDENTIAL, url: IMAGE_REGISTRY) {
          // Prealocate dict/map of branchstages
          def branchedStages = [:]

          for(enhancedAppName in enhancedChangeAppNames) {
            def appLayer = "${enhancedAppName.appLayer}"
            def appName = "${enhancedAppName.appName}"
            echo "Sequence push: ${appLayer}-${appName}"

            if(enhancedAppName.isBuildCompleted == true) {
              // branchedStages["${appLayer}-${appName}"] = {
              stage("Sequence push stage: ${appLayer}-${appName}") {
                try {
                  // sh 'echo $GITLAB_REGISTRY_CREDENTIAL | docker login -u $GITLAB_REGISTRY_CREDENTIAL --password-stdin'
                  sh "docker push ${IMAGE_BASE_NAME}/${appLayer}-${appName}:${TAG_NAME}"
                  sh "docker push ${IMAGE_BASE_NAME}/${appLayer}-${appName}:latest"
                } catch(e) {
                  enhancedAppName.isBuildCompleted = false
                  echo e.toString()
                }
              }
              // }
            }
          }

          // Execute the stages in parallel
          // parallel branchedStages
        }
      }

      stage('Clean image to save disk') {
        echo 'Clean image to save disk...'

        // remove deps image
        try{
          sh "docker rmi ${IMAGE_BASE_NAME}/deps:latest"
        } catch(e) {
          build_ok = false
          echo e.toString()
        }

        // Prealocate dict/map of branchstages
        def branchedStages = [:]

        for(enhancedAppName in enhancedChangeAppNames) {
          def appLayer = "${enhancedAppName.appLayer}"
          def appName = "${enhancedAppName.appName}"
          echo "Parallel clean: ${appLayer}-${appName}"

          if(enhancedAppName.isBuildCompleted == true) {
            branchedStages["${appLayer}-${appName}"] = {
              stage("Parallel clean stage: ${appLayer}-${appName}") {
                try {
                  sh "docker rmi ${IMAGE_BASE_NAME}/${appLayer}-${appName}:${TAG_NAME}"
                  sh "docker rmi ${IMAGE_BASE_NAME}/${appLayer}-${appName}:latest"
                } catch(e) {
                  echo e.toString()
                }
              }
            }
          }
        }

        // Execute the stages in parallel
        parallel branchedStages
      }
    }

    // CONTINUOUS DEPLOYMENT
    dir('devops') {
      stage('Replace image in ArgoCD') {
        echo 'Replace image in ArgoCD...'

        git credentialsId: GITLAB_CREDENTIAL, url: DEVOPS_REPO_URL

        git url: DEVOPS_REPO_URL,
              credentialsId: GITLAB_CREDENTIAL, // cannot using environment variable at here
              branch: DEVOPS_REPO_BRANCH

        dir("./src/kustomize/overlays/${kOverlay}") {
          for(enhancedAppName in enhancedChangeAppNames) {
            println(enhancedAppName.isBuildCompleted)

            if(enhancedAppName.isBuildCompleted == true) {
              sh """
                kustomize edit set image "${IMAGE_BASE_NAME}/${enhancedAppName.appLayer}-${enhancedAppName.appName}:${TAG_NAME}"
              """
            }
          }
        }

        withCredentials([
            gitUsernamePassword(credentialsId: GITLAB_CREDENTIAL, gitToolName: 'Default')
          ]) {
            sh 'git config --global user.email "phpswteam@gmail.com"'
            sh 'git config --global user.name "Jenkins - PHP Software Team"'

            def commitMessage = '"' + "Deploy commit ${TAG_NAME} by ${lastCommitAuthor}(${lastCommitAuthorEmail})" + '"'
            echo commitMessage
            // sh "git commit --amend -am ${commitMessage}"
            sh "git commit -am ${commitMessage}"

            // sh "git push ${DEVOPS_REPO_URL} ${DEVOPS_REPO_BRANCH} -f"
            sh "git push ${DEVOPS_REPO_URL} ${DEVOPS_REPO_BRANCH}"
          }
      }
    }

    if(build_ok) {
      currentBuild.result = "SUCCESS"
    } else {
      currentBuild.result = "FAILURE"
    }

  } catch(e) {
    throw e
  } finally {
    echo 'Finish...'
  }
}
