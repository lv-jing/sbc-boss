// 定义参数label，K8S启动的pod名称通过这个来制定
def label = "JenkinsPOD-${UUID.randomUUID().toString()}"

// 定义jenkins的工作目录
def jenworkspace="/home/jenkins/workspace/${APP_NAME}"

//kubectl和docker执行文件，这个可以打到镜像里面，这边直接共享的方式提供
def sharefile="/home/jenkins/sharefile"

// deployment等K8S的yaml文件目录
def k8srepo='/home/jenkins/k8s_repos'


// cloud为我们前面提供的云名称，nodeSelector是K8S运行pod的节点选择
podTemplate(label: label, cloud: 'kubernetes',
    containers: [
        containerTemplate(
            name: 'jnlp',
            image: 'k8sregistrysit.azurecr.io/repository:393',
            ttyEnabled: true,
            alwaysPullImage: true,
            resourceRequestCpu: '500m',
            resourceRequestMemory: '8000Mi'
            )
    ],
    //volumes: [
    //    hostPathVolume(hostPath: '/var/run/docker.sock', mountPath:'/var/run/docker.sock')
    //        ],
    envVars: [ 
          envVar(key: 'DOCKER_HOST',value: 'tcp://172.16.0.4:2375')
    ],
    imagePullSecrets: [ 'sit-docker' ]
)
{
    node (label) {
        
        stage('Git Pull'){
              dir("$jenworkspace"){
                 git branch: "${GIT_BRANCH}", changelog: false, credentialsId: "${GIT_CREADENTIAL}", poll: false, url: "${GIT_URL}"
            }
        }

        stage('npm package'){
                dir("$jenworkspace"){
                    sh "node --version"
                    sh "npm --version"
                    sh "npm install"
                    sh "npm run build"
                }
        }

        stage('Docker build'){
            dir("$jenworkspace"){
                // 创建 Dockerfile 文件，但只能在方法块内使用
                docker1 = readFile encoding: "UTF-8", file: "./Dockerfile"
                //dockerfile = docker1.replaceAll("#APP_OPTS","${APP_OPTS}")
                //                        .replaceAll("#APP_NAME","${APP_NAME}")
                dockerfile = docker1.replaceAll("#APP_NAME","${APP_NAME}")
                writeFile encoding: 'UTF-8', file: './Dockerfile', text: "${dockerfile}"


                // 设置 Docker 镜像名称
                dockerImageName = "${REGISTRY_URL}/${DOCKER_HUB_GROUP}/${APP_NAME}:${APP_VERSION}"
                sh "cat Dockerfile"
                if ("${DOCKER_HUB_GROUP}" == '') {
                    dockerImageName = "${REGISTRY_URL}/${APP_NAME}-${TARGET_ENV}:${APP_VERSION}"
                }

                // 提供 Docker 环境，使用 Docker 工具来进行 Docker 镜像构建与推送
                docker.withRegistry("http://${REGISTRY_URL}", "${REGISTRY_CREADENTIAL}") {
                    def customImage = docker.build("${dockerImageName}")
                    customImage.push()
                }
            }
        }

        stage('K8S Deploy'){
                    // 使用 Kubectl Cli 插件的方法，提供 Kubernetes 环境，在其方法块内部能够执行 kubectl 命令
                    withKubeConfig([credentialsId: "${KUBERNETES_CREADENTIAL}",serverUrl: "${KUBERNETES_URL}"]) {
                      // 使用 configFile 插件，创建 Kubernetes 部署文件 deployment.yaml
                       //configFileProvider([configFile(fileId: "${KUBERNETES_DEPLOYMENT_ID}", targetLocation: "deployment.yaml")]){
                      // writeFile encoding: 'UTF-8', file: './front-deployment.yaml', text: "${dockerfile}"

                    // 读取 Kubernetes 部署文件
                      // deploy = readFile encoding: "UTF-8", file: "./deployment.yaml"
                    // 替换部署文件中的变量，并将替换后的文本赋予 deployfile 变量
                    //deployfile = deploy.replaceAll("#APP_NAME","${TARGET_ENV}-${APP_NAME}")
                    //                              .replaceAll("#APP_REPLICAS","${KUBERNETES_APP_REPLICAS}")
                    //                              .replaceAll("#APP_IMAGE_NAME","${dockerImageName}")
                    //                              .replaceAll("#APP_PORT","${APP_PORT}")
                    //                              .replaceAll("#APP_UUID",(new Random().nextInt(100000)).toString())
                    //                              .replaceAll("#SECRET","${SECRET}")
                    // 生成新的 Kubernetes 部署文件，内容为 deployfile 变量中的文本，文件名称为 "deploy.yaml"
                    //writeFile encoding: 'UTF-8', file: './deploy.yaml', text: "${deployfile}"
                    // 输出新创建的部署 yaml 文件内容
                    //sh "cat deploy.yaml"
                    // 执行 Kuberctl 命令进行部署操作
                    //sh "kubectl replace --force -n ${PROJECT_ENV} -f deploy.yaml"
                    sh "kubectl set image deployment ${APP_NAME} *=${dockerImageName} -n ${PROJECT_ENV}"
                    
                }
        }
        
    }
}