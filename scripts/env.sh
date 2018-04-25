CONTAINER_URL=docker.io/iphands/insightsproxy
case "`uname -s`" in
    Linux*)
        LINUX=true
        PLATFORM=linux;;
    Darwin*)
        DARWIN=true
        PLATFORM=darwin;;
    *)
        echo 'This only works on Linux or Darwin!'
        exit 1;;
esac
