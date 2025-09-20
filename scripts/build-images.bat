@echo off
REM Build script for YouTube Clone Docker images

setlocal enabledelayedexpansion

REM Configuration
if "%REGISTRY%"=="" set REGISTRY=your-registry.com
if "%TAG%"=="" set TAG=latest
if "%PUSH%"=="" set PUSH=false

echo 🐳 Building YouTube Clone Docker Images
echo Registry: %REGISTRY%
echo Tag: %TAG%
echo Push: %PUSH%
echo.

REM Function to build image
:build_image
set context=%~1
set dockerfile=%~2
set image_name=%~3
set target=%~4

echo Building %image_name%...

if "%target%"=="" (
    docker build -f "%dockerfile%" -t "%REGISTRY%/%image_name%:%TAG%" "%context%"
) else (
    docker build -f "%dockerfile%" -t "%REGISTRY%/%image_name%:%TAG%" --target "%target%" "%context%"
)

if "%PUSH%"=="true" (
    echo Pushing %image_name%...
    docker push "%REGISTRY%/%image_name%:%TAG%"
)

echo ✅ %image_name% built successfully
echo.
goto :eof

REM Build backend image
call :build_image "./backend" "Dockerfile" "yt-clone-backend" "final"

REM Build frontend image
call :build_image "./frontend" "Dockerfile" "yt-clone-frontend" "final"

REM Build development images
echo Building development images...
call :build_image "./backend" "Dockerfile" "yt-clone-backend-dev" "development"
call :build_image "./frontend" "Dockerfile" "yt-clone-frontend-dev" "development"

echo 🎉 All images built successfully!

REM List built images
echo 📋 Built images:
docker images | findstr yt-clone

REM Usage instructions
echo.
echo 📖 Usage:
echo   # Run locally with docker-compose
echo   docker-compose up -d
echo.
echo   # Deploy to Kubernetes
echo   kubectl apply -f k8s/
echo.
echo   # Deploy with Helm
echo   helm install yt-clone ./helm/yt-clone
echo.
echo   # Push images to registry
echo   set PUSH=true ^&^& scripts\build-images.bat
