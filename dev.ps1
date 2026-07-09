# ============================================
# Docker Dev Helper — PowerShell
# ============================================

function Start-Dev {
    docker compose up -d
}

function Stop-Dev {
    docker compose down
}

function Artisan {
    param([Parameter(ValueFromRemainingArguments)]$Args)
    docker compose exec php php artisan @Args
}

function Composer {
    param([Parameter(ValueFromRemainingArguments)]$Args)
    docker compose exec php composer @Args
}

function Npm {
    param([Parameter(ValueFromRemainingArguments)]$Args)
    docker compose exec node npm @Args
}

function Npm-Run {
    param([Parameter(ValueFromRemainingArguments)]$Args)
    docker compose exec node npm run @Args
}

function Test {
    param([Parameter(ValueFromRemainingArguments)]$Args)
    docker compose exec php php artisan test @Args
}

function Mysql {
    docker compose exec mysql mysql -u laravel -proot laravel_ecommerce
}

function Logs {
    param([Parameter(Mandatory, Position=0)][string]$Service)
    docker compose logs -f $Service
}

# Dot-source this file or import-module to use the functions.
Write-Host "Dev helpers loaded! Available functions:" -ForegroundColor Cyan
Write-Host "  Start-Dev, Stop-Dev, Artisan, Composer, Npm, Npm-Run, Test, Mysql, Logs" -ForegroundColor Green
