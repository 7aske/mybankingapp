@echo off
set /p com="Commit name: "
echo %com%
git add . & git commit -m %com%