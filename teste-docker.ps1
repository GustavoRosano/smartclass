# SmartClass - Script de Teste Automatizado
# Tech Challenge Fase 03 - FIAP

Write-Host "================================" -ForegroundColor Cyan
Write-Host "  SmartClass - Teste Docker" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

$projectPath = "C:\Users\janainaps\Documents\FIAP\Fase 2 - SmartClass\smartclass"

# Navegar para pasta do projeto
Set-Location $projectPath

# Menu
Write-Host "Escolha uma opcao:" -ForegroundColor Yellow
Write-Host "1. Build Docker (primeira vez)" -ForegroundColor White
Write-Host "2. Start containers (up -d)" -ForegroundColor White
Write-Host "3. Ver logs (logs -f)" -ForegroundColor White
Write-Host "4. Ver status (ps)" -ForegroundColor White
Write-Host "5. Parar containers (down)" -ForegroundColor White
Write-Host "6. Rebuild completo (down + build + up)" -ForegroundColor White
Write-Host "7. Limpar tudo (down -v + prune)" -ForegroundColor White
Write-Host "8. Testar API (curl)" -ForegroundColor White
Write-Host "9. Abrir browser (localhost:3000)" -ForegroundColor White
Write-Host "0. Sair" -ForegroundColor White
Write-Host ""

$opcao = Read-Host "Opcao"

switch ($opcao) {
    "1" {
        Write-Host "`nFazendo build das imagens..." -ForegroundColor Green
        docker-compose build
    }
    "2" {
        Write-Host "`nIniciando containers..." -ForegroundColor Green
        docker-compose up -d
        Write-Host "`nContainers iniciados!" -ForegroundColor Green
        Write-Host "Frontend: http://localhost:3000" -ForegroundColor Cyan
        Write-Host "API: http://localhost:3002" -ForegroundColor Cyan
    }
    "3" {
        Write-Host "`nExibindo logs (Ctrl+C para sair)..." -ForegroundColor Green
        docker-compose logs -f
    }
    "4" {
        Write-Host "`nStatus dos containers:" -ForegroundColor Green
        docker-compose ps
    }
    "5" {
        Write-Host "`nParando containers..." -ForegroundColor Green
        docker-compose down
        Write-Host "Containers parados!" -ForegroundColor Green
    }
    "6" {
        Write-Host "`nRebuild completo..." -ForegroundColor Green
        docker-compose down
        docker-compose build --no-cache
        docker-compose up -d
        Write-Host "`nRebuild concluido!" -ForegroundColor Green
        Write-Host "Frontend: http://localhost:3000" -ForegroundColor Cyan
    }
    "7" {
        Write-Host "`nLimpando tudo..." -ForegroundColor Red
        docker-compose down -v
        docker system prune -f
        Write-Host "Limpeza concluida!" -ForegroundColor Green
    }
    "8" {
        Write-Host "`nTestando API..." -ForegroundColor Green
        Write-Host "`nGET /api/users:" -ForegroundColor Yellow
        try {
            $response = Invoke-WebRequest -Uri "http://localhost:3002/api/users" -UseBasicParsing
            Write-Host $response.Content -ForegroundColor White
        } catch {
            Write-Host "Erro: $_" -ForegroundColor Red
        }
        
        Write-Host "`nGET /api/posts:" -ForegroundColor Yellow
        try {
            $response = Invoke-WebRequest -Uri "http://localhost:3002/api/posts" -UseBasicParsing
            Write-Host $response.Content -ForegroundColor White
        } catch {
            Write-Host "Erro: $_" -ForegroundColor Red
        }
    }
    "9" {
        Write-Host "`nAbrindo browser..." -ForegroundColor Green
        Start-Process "http://localhost:3000"
    }
    "0" {
        Write-Host "`nSaindo..." -ForegroundColor Green
        exit
    }
    default {
        Write-Host "`nOpcao invalida!" -ForegroundColor Red
    }
}

Write-Host ""
Read-Host "Pressione Enter para continuar"
