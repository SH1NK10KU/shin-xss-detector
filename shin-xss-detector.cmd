@echo off
:begin
echo Begin Shin XSS Detector
set /p url=Please input the url:
echo %url%
if not exist shin-xss-detector.js echo shin-xss-detector.js does not exist
for /f "tokens=1 delims=" %%i in (payload.txt) do (phantomjs shin-xss-detector.js %url% %%i)