@echo off
set /p com="Commit name: "
git add . & git commit -m %com% & git push -u origin master & git push heroku master
