@echo off
mkdir "e:\TravelLoop\public\images" 2>nul

set SRC=C:\Users\ridam\.gemini\antigravity\brain\7c0fc5c4-efb7-465c-a995-2a1a55acb0c3
set DST=e:\TravelLoop\public\images

for %%f in ("%SRC%\hero_japan_*.png") do copy "%%f" "%DST%\hero-japan.png" >nul
for %%f in ("%SRC%\hero_bali_*.png") do copy "%%f" "%DST%\hero-bali.png" >nul
for %%f in ("%SRC%\hero_paris_*.png") do copy "%%f" "%DST%\hero-paris.png" >nul
for %%f in ("%SRC%\hero_santorini_*.png") do copy "%%f" "%DST%\hero-santorini.png" >nul
for %%f in ("%SRC%\hero_iceland_*.png") do copy "%%f" "%DST%\hero-iceland.png" >nul
for %%f in ("%SRC%\city_tokyo_*.png") do copy "%%f" "%DST%\city-tokyo.png" >nul
for %%f in ("%SRC%\city_kyoto_*.png") do copy "%%f" "%DST%\city-kyoto.png" >nul
for %%f in ("%SRC%\activity_hiking_*.png") do copy "%%f" "%DST%\activity-hiking.png" >nul
for %%f in ("%SRC%\activity_dining_*.png") do copy "%%f" "%DST%\activity-dining.png" >nul
for %%f in ("%SRC%\hero_india_*.png") do copy "%%f" "%DST%\hero-india.png" >nul
for %%f in ("%SRC%\city_jaipur_*.png") do copy "%%f" "%DST%\city-jaipur.png" >nul
for %%f in ("%SRC%\city_kerala_*.png") do copy "%%f" "%DST%\city-kerala.png" >nul
for %%f in ("%SRC%\hero_dehradun_*.png") do copy "%%f" "%DST%\hero-dehradun.png" >nul
for %%f in ("%SRC%\city_andaman_*.png") do copy "%%f" "%DST%\city-andaman.png" >nul
for %%f in ("%SRC%\city_temple_*.png") do copy "%%f" "%DST%\city-temple.png" >nul

echo Images copied successfully!

cd /d e:\TravelLoop
call npm install
echo.
echo Dependencies installed! Run 'npm run dev' to start the dev server.
