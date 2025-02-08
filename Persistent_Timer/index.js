document.addEventListener("DOMContentLoaded", () => {
    const timers = JSON.parse(localStorage.getItem("timers")) || [];
    const completedTimers = JSON.parse(localStorage.getItem("completedTimers")) || [];
    
    function saveTimers() {
        localStorage.setItem("timers", JSON.stringify(timers));
        localStorage.setItem("completedTimers", JSON.stringify(completedTimers));
    }
    
    function createTimer(name, duration) {
        const startTime = Date.now();
        const endTime = startTime + duration * 60000;
        timers.push({ name, duration, startTime, endTime, paused: false, elapsed: 0 });
        saveTimers();
        renderTimers();
    }
    
    function renderTimers() {
        const runningTimersContainer = document.getElementById("running-timers");
        const completedTimersContainer = document.getElementById("completed-timers");
        const searchQuery = document.getElementById("search-timer").value.toLowerCase();
        runningTimersContainer.innerHTML = "";
        completedTimersContainer.innerHTML = "";
        
        timers.forEach((timer, index) => {
            if (searchQuery && !timer.name.toLowerCase().includes(searchQuery)) {
                return;
            }
            const elapsed = timer.paused ? timer.elapsed : Math.floor((Date.now() - timer.startTime) / 1000);
            const minutes = Math.floor(elapsed / 60);
            const seconds = elapsed % 60;
            
            if (elapsed >= timer.duration * 60) {
                completedTimers.push({ name: timer.name, time: `${minutes}m ${seconds}s`, class: "completed-red" });
                timers.splice(index, 1);
                saveTimers();
                renderTimers();
                return;
            }
            
            const timerElement = document.createElement("div");
            timerElement.innerHTML = `${timer.name}: ${minutes}m ${seconds}s`;
            
            const pauseButton = document.createElement("button");
            pauseButton.textContent = timer.paused ? "Resume" : "Pause";
            pauseButton.onclick = () => {
                if (timer.paused) {
                    timer.startTime = Date.now() - timer.elapsed * 1000;
                } else {
                    timer.elapsed = Math.floor((Date.now() - timer.startTime) / 1000);
                }
                timer.paused = !timer.paused;
                saveTimers();
                renderTimers();
            };
            
            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Delete";
            deleteButton.onclick = () => {
                timer.elapsed = Math.floor((Date.now() - timer.startTime) / 1000);
                const minutes = Math.floor(timer.elapsed / 60);
                const seconds = timer.elapsed % 60;
                completedTimers.push({ name: timer.name, time: `${minutes}m ${seconds}s`, class: "completed-green" });
                timers.splice(index, 1);
                saveTimers();
                renderTimers();
            };
            
            timerElement.appendChild(pauseButton);
            timerElement.appendChild(deleteButton);
            runningTimersContainer.appendChild(timerElement);
        });
        
        completedTimers.forEach((timer, index) => {
            const completedElement = document.createElement("div");
            completedElement.textContent = `${timer.name}: ${timer.time}`;
            completedElement.classList.add(timer.class);
            
            const deleteCompletedButton = document.createElement("button");
            deleteCompletedButton.textContent = "Delete";
            deleteCompletedButton.onclick = () => {
                completedTimers.splice(index, 1);
                saveTimers();
                renderTimers();
            };
            
            completedElement.appendChild(deleteCompletedButton);
            completedTimersContainer.appendChild(completedElement);
        });
    }
    
    document.getElementById("add-timer").addEventListener("click", () => {
        const name = document.getElementById("timer-name").value;
        const duration = parseInt(document.getElementById("timer-duration").value, 10);
        if (name && duration > 0) {
            createTimer(name, duration);
        }
    });
    
    setInterval(renderTimers, 1000);
    renderTimers();
});