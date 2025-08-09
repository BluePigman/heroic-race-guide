document.addEventListener('DOMContentLoaded', () => {
    const lapTitle = document.getElementById('current-lap-num');
    const lapDisplay = document.getElementById('lap-display');
    const lapSelect = document.getElementById('lap-select');
    const prevLapBtn = document.getElementById('prev-lap');
    const nextLapBtn = document.getElementById('next-lap');

    let allLapsData = [];
    let currentLapIndex = 0;

    const LAST_LAP_KEY = 'lastVisitedLap';

    async function fetchLapData() {
        try {
            const response = await fetch('lapInfo.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            allLapsData = await response.json();
            initializeApp();
        } catch (error) {
            console.error("Could not fetch lap data:", error);
            lapDisplay.innerHTML = `<p style="color: red;">Failed to load lap data. Please ensure 'lapInfo.json' is present and valid.</p>`;
        }
    }

    function renderLap() {
        if (allLapsData.length === 0) return;

        const currentLap = allLapsData[currentLapIndex];
        lapTitle.textContent = currentLap.lapNum;
        lapDisplay.innerHTML = ''; 
        lapSelect.value = currentLap.lapNum;

        currentLap.nodes.forEach(node => {
            const nodeRow = document.createElement('div');
            nodeRow.classList.add('node-row');

            const nodeNumBox = document.createElement('div');
            nodeNumBox.classList.add('node-number-box');
            nodeNumBox.textContent = node.node;
            nodeRow.appendChild(nodeNumBox);

            const missionsContainer = document.createElement('div');
            missionsContainer.classList.add('missions-container');
            nodeRow.appendChild(missionsContainer);

            node.missions.forEach(mission => {
                const missionBox = document.createElement('div');
                missionBox.classList.add('mission-box');

                const missionImg = document.createElement('img');
                missionImg.classList.add('mission-image');
                missionImg.src = `assets/${mission.type}.png`;
                missionImg.alt = mission.type.charAt(0).toUpperCase() + mission.type.slice(1) + " icon";
                missionImg.onerror = function() {
                    this.onerror=null;
                };
                missionBox.appendChild(missionImg);

                const detailsDiv = document.createElement('div');
                detailsDiv.classList.add('mission-details');

                const poolDiv = document.createElement('div');
                poolDiv.classList.add('pool');
                poolDiv.textContent = mission.pool;
                detailsDiv.appendChild(poolDiv);

                const waitDiv = document.createElement('div');
                waitDiv.classList.add('wait-time');
                waitDiv.textContent = `WAIT 1: ${mission.wait_1}`;
                detailsDiv.appendChild(waitDiv);

                const totalTimeDiv = document.createElement('div');
                totalTimeDiv.classList.add('total-time');
                totalTimeDiv.textContent = `TOTAL: ${mission.total_time}`;
                detailsDiv.appendChild(totalTimeDiv);


                missionBox.appendChild(detailsDiv);
                missionsContainer.appendChild(missionBox);
            });
            lapDisplay.appendChild(nodeRow);
        });

        updateNavigationButtons();
        saveLapState();
    }

    function updateNavigationButtons() {
        prevLapBtn.disabled = currentLapIndex === 0;
        nextLapBtn.disabled = currentLapIndex === allLapsData.length - 1;
    }

    function populateLapDropdown() {
        lapSelect.innerHTML = ''; 
        allLapsData.forEach(lap => {
            const option = document.createElement('option');
            option.value = lap.lapNum;
            option.textContent = `LAP ${lap.lapNum}`;
            lapSelect.appendChild(option);
        });
    }

    function goToPrevLap() {
        if (currentLapIndex > 0) {
            currentLapIndex--;
            renderLap();
        }
    }

    function goToNextLap() {
        if (currentLapIndex < allLapsData.length - 1) {
            currentLapIndex++;
            renderLap();
        }
    }

    function goToSelectedLap(event) {
        const selectedLapNum = parseInt(event.target.value);
        currentLapIndex = allLapsData.findIndex(lap => lap.lapNum === selectedLapNum);
        renderLap();
    }

    function saveLapState() {
        localStorage.setItem(LAST_LAP_KEY, currentLapIndex);
    }

    function loadLapState() {
        const savedIndex = localStorage.getItem(LAST_LAP_KEY);
        if (savedIndex !== null) {
            currentLapIndex = parseInt(savedIndex);
        }
    }

    function initializeApp() {
        populateLapDropdown();
        loadLapState();
        renderLap();

        prevLapBtn.addEventListener('click', goToPrevLap);
        nextLapBtn.addEventListener('click', goToNextLap);
        lapSelect.addEventListener('change', goToSelectedLap);
    }

    fetchLapData();
});