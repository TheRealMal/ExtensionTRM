ECHO OFF&cls
xcopy source obfuscated\ /E /Y
javascript-obfuscator ./source --output ./obfuscated --compact true --options-preset default