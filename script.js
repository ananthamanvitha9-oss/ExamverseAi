document.addEventListener('DOMContentLoaded', () => {
    
    // Auth Modal Logic
    const authBtn = document.getElementById('auth-btn');
    const authModal = document.getElementById('auth-modal');
    const authPanel = document.getElementById('auth-panel');
    const closeAuthBtn = document.getElementById('close-auth');
    const googleLoginBtn = document.getElementById('google-login-btn');

    function openAuth() {
        authModal.classList.remove('hidden');
        // Slight delay to allow display:block to apply before animating opacity
        setTimeout(() => {
            authModal.classList.remove('opacity-0');
            authPanel.classList.remove('scale-95');
            authPanel.classList.add('scale-100');
        }, 10);
    }

    function closeAuth() {
        authModal.classList.add('opacity-0');
        authPanel.classList.remove('scale-100');
        authPanel.classList.add('scale-95');
        setTimeout(() => {
            authModal.classList.add('hidden');
        }, 300);
    }

    // Auto-open auth on first load (simulating the Lovable popup behavior)
    setTimeout(openAuth, 500);

    authBtn.addEventListener('click', openAuth);
    closeAuthBtn.addEventListener('click', closeAuth);
    
    // Close on backdrop click
    authModal.addEventListener('click', (e) => {
        if(e.target === authModal) closeAuth();
    });

    // Google Login Popup
    googleLoginBtn.addEventListener('click', () => {
        const width = 500;
        const height = 600;
        const left = (window.innerWidth / 2) - (width / 2);
        const top = (window.innerHeight / 2) - (height / 2);
        
        window.open(
            "https://examverseai-mannu.onrender.com/api/auth/google/redirect", 
            "Examiverse Auth", 
            `width=${width},height=${height},top=${top},left=${left},toolbar=no,menubar=no,scrollbars=yes,resizable=yes`
        );
        
        setTimeout(closeAuth, 1500);
    });

    // Chart.js Setup for Performance Analytics
    const ctx = document.getElementById('performanceChart').getContext('2d');
    let performanceChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
                label: 'Study Hours',
                data: [3.5, 4.2, 3.8, 5.0, 4.5, 6.2, 5.8],
                borderColor: '#1E40AF',
                backgroundColor: 'rgba(30, 64, 175, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { borderDash: [4, 4] }
                },
                x: {
                    grid: { display: false }
                }
            }
        }
    });

    // Exam Selector Logic to swap data
    const examSelector = document.getElementById('exam-selector');
    const headerTitle = document.getElementById('header-title');
    const recommendedTopics = document.getElementById('recommended-topics');
    const mockTestTable = document.getElementById('mock-test-table');

    const examData = {
        upsc: {
            title: "UPSC CSE Preparation",
            topics: [
                { title: "Fundamental Rights (Art 12-35)", tag: "Indian Polity • High Weightage" },
                { title: "Modern History: 1857 Revolt", tag: "History • Revision Needed" }
            ],
            tests: [
                { name: "UPSC Prelims Full Mock 1", date: "Aug 20, 2026", score: "105 / 200", perc: "82nd" }
            ]
        },
        jee: {
            title: "JEE Advanced Preparation",
            topics: [
                { title: "Rotational Mechanics: Torque", tag: "Physics • High Weightage" },
                { title: "Definite Integration", tag: "Mathematics • Revision Needed" }
            ],
            tests: [
                { name: "JEE Adv Paper 1 Mock", date: "Aug 21, 2026", score: "112 / 180", perc: "89th" }
            ]
        },
        neet: {
            title: "NEET UG Preparation",
            topics: [
                { title: "Human Reproduction", tag: "Biology • High Weightage" },
                { title: "Electrostatics", tag: "Physics • Revision Needed" }
            ],
            tests: [
                { name: "NEET Full Syllabus Mock", date: "Aug 19, 2026", score: "620 / 720", perc: "94th" }
            ]
        },
        gate: {
            title: "GATE CS Preparation",
            topics: [
                { title: "B-Trees and Indexing", tag: "DBMS • High Weightage" },
                { title: "TCP Congestion Control", tag: "Computer Networks • Revision Needed" }
            ],
            tests: [
                { name: "GATE CS Full Mock 3", date: "Aug 22, 2026", score: "68 / 100", perc: "91st" }
            ]
        }
    };

    examSelector.addEventListener('change', (e) => {
        const selected = e.target.value;
        const data = examData[selected];
        
        // Update Header
        headerTitle.textContent = data.title;
        
        // Update Topics
        recommendedTopics.innerHTML = '';
        data.topics.forEach(topic => {
            recommendedTopics.innerHTML += `
                <div class="p-3 border border-gray-100 rounded-lg hover:border-gray-300 transition-colors cursor-pointer group">
                    <div class="flex justify-between items-start">
                        <div>
                            <h4 class="text-sm font-semibold text-gray-800 group-hover:text-primary transition-colors">${topic.title}</h4>
                            <p class="text-xs text-gray-500 mt-1">${topic.tag}</p>
                        </div>
                        <i data-lucide="chevron-right" class="w-4 h-4 text-gray-400"></i>
                    </div>
                </div>
            `;
        });
        
        // Update Tests Table
        mockTestTable.innerHTML = '';
        data.tests.forEach(test => {
            mockTestTable.innerHTML += `
                <tr class="hover:bg-gray-50 transition-colors">
                    <td class="px-6 py-4 font-medium text-gray-800">${test.name}</td>
                    <td class="px-6 py-4 text-gray-500">${test.date}</td>
                    <td class="px-6 py-4">
                        <span class="inline-flex items-center gap-1.5 py-1 px-2.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            ${test.score}
                        </span>
                    </td>
                    <td class="px-6 py-4 text-gray-600">${test.perc}</td>
                    <td class="px-6 py-4">
                        <button class="text-primary hover:text-blue-800 font-medium">View Analysis</button>
                    </td>
                </tr>
            `;
        });
        
        lucide.createIcons();
    });

});

    // --- PHASE 6: API INTEGRATION ---
    const API_BASE_URL = 'http://localhost:8000/api'; // Local FastAPI URL for testing

    // Helper function for authorized requests
    async function fetchWithAuth(endpoint, options = {}) {
        const token = localStorage.getItem('examverse_token');
        const headers = {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': Bearer  + token }),
            ...options.headers
        };
        
        try {
            const response = await fetch(API_BASE_URL + endpoint, { ...options, headers });
            if (!response.ok) throw new Error('API Error: ' + response.statusText);
            return await response.json();
        } catch (error) {
            console.error('Fetch error:', error);
            return null;
        }
    }

    // 1. Fetch Study Logs and Update Chart
    async function loadStudyLogs() {
        const logs = await fetchWithAuth('/study-logs/');
        if (logs && logs.length > 0) {
            // Very basic mapping for the chart (in a real app, map dates to days of week)
            const hours = logs.slice(-7).map(log => log.hours_logged);
            
            // Update chart data
            performanceChart.data.datasets[0].data = hours;
            performanceChart.update();
        }
    }

    // 2. Mark Topic as Completed
    async function markTopicCompleted(subtopicId) {
        const result = await fetchWithAuth('/syllabus-progress/', {
            method: 'POST',
            body: JSON.stringify({
                subtopic_id: subtopicId,
                status: 'completed'
            })
        });
        
        if (result) {
            alert('Topic marked as completed!');
            // Re-fetch syllabus progress to update UI here...
        }
    }

    // 3. Save Mock Test Result
    async function saveMockTest(examType, topic, score, accuracy) {
        const result = await fetchWithAuth('/mock-test-results/', {
            method: 'POST',
            body: JSON.stringify({
                exam_type: examType,
                topic: topic,
                score: score,
                accuracy: accuracy
            })
        });
        
        if (result) {
            console.log('Test saved successfully:', result);
        }
    }

    // Example event listeners for the new API logic
    // (Assuming we add a 'Log Hours' button in the HTML later)
    window.logStudyHours = async (hours) => {
        await fetchWithAuth('/study-logs/', {
            method: 'POST',
            body: JSON.stringify({ hours_logged: hours, notes: 'Manual entry from dashboard' })
        });
        loadStudyLogs(); // Refresh chart
    };

    // Load initial data if logged in
    if (localStorage.getItem('examverse_token')) {
        loadStudyLogs();
    }

    // --- PHASE 7: CHATBOT UI LOGIC ---
    const chatbotBtn = document.getElementById('open-chatbot-btn');
    const chatbotModal = document.getElementById('chatbot-modal');
    const closeChatbotBtn = document.getElementById('close-chatbot-btn');
    const chatInput = document.getElementById('chat-input');
    const sendChatBtn = document.getElementById('send-chat-btn');
    const chatMessages = document.getElementById('chat-messages');

    function toggleChatbot() {
        const isHidden = chatbotModal.classList.contains('opacity-0');
        if (isHidden) {
            chatbotModal.classList.remove('opacity-0', 'pointer-events-none', 'translate-y-4');
            chatInput.focus();
        } else {
            chatbotModal.classList.add('opacity-0', 'pointer-events-none', 'translate-y-4');
        }
    }

    chatbotBtn.addEventListener('click', toggleChatbot);
    closeChatbotBtn.addEventListener('click', toggleChatbot);

    function addMessageToChat(text, isUser = false) {
        const msgDiv = document.createElement('div');
        msgDiv.className = isUser ? 'flex gap-2 flex-row-reverse' : 'flex gap-2';
        
        const avatar = document.createElement('div');
        avatar.className = isUser 
            ? 'w-8 h-8 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center shrink-0'
            : 'w-8 h-8 rounded-full bg-blue-100 text-primary flex items-center justify-center shrink-0';
        avatar.innerHTML = isUser ? '<i data-lucide="user" class="w-4 h-4"></i>' : '<i data-lucide="sparkles" class="w-4 h-4"></i>';

        const bubble = document.createElement('div');
        bubble.className = isUser
            ? 'bg-primary text-white px-4 py-2 rounded-2xl rounded-tr-none shadow-sm max-w-[85%]'
            : 'bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-2xl rounded-tl-none shadow-sm max-w-[85%]';
        bubble.textContent = text;

        msgDiv.appendChild(avatar);
        msgDiv.appendChild(bubble);
        chatMessages.appendChild(msgDiv);
        lucide.createIcons();
        
        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    async function handleSendMessage() {
        const text = chatInput.value.trim();
        if (!text) return;

        // Add user message to UI
        addMessageToChat(text, true);
        chatInput.value = '';
        chatInput.style.height = 'auto'; // Reset height

        // Show loading state
        const loadingId = 'loading-' + Date.now();
        const loadingMsgDiv = document.createElement('div');
        loadingMsgDiv.id = loadingId;
        loadingMsgDiv.className = 'flex gap-2';
        loadingMsgDiv.innerHTML = `
            <div class="w-8 h-8 rounded-full bg-blue-100 text-primary flex items-center justify-center shrink-0">
                <i data-lucide="sparkles" class="w-4 h-4"></i>
            </div>
            <div class="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-2xl rounded-tl-none shadow-sm max-w-[85%] flex items-center gap-1">
                <span class="animate-bounce inline-block w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
                <span class="animate-bounce inline-block w-1.5 h-1.5 bg-gray-400 rounded-full" style="animation-delay: 0.2s"></span>
                <span class="animate-bounce inline-block w-1.5 h-1.5 bg-gray-400 rounded-full" style="animation-delay: 0.4s"></span>
            </div>
        `;
        chatMessages.appendChild(loadingMsgDiv);
        lucide.createIcons();
        chatMessages.scrollTop = chatMessages.scrollHeight;

        // Send to FastAPI Backend
        try {
            const currentExam = document.getElementById('exam-selector').value || "UPSC";
            
            // Note: Since this endpoint might not require auth yet in our backend, we can just use fetchWithAuth
            const response = await fetchWithAuth('/tutor/', {
                method: 'POST',
                body: JSON.stringify({
                    message: text,
                    exam: currentExam,
                    subject: "General",
                    language: "English"
                })
            });
            
            // Remove loading indicator
            document.getElementById(loadingId).remove();

            if (response && response.response) {
                addMessageToChat(response.response);
            } else {
                addMessageToChat("I'm sorry, I couldn't generate a response right now.");
            }
            
        } catch (e) {
            console.error(e);
            document.getElementById(loadingId).remove();
            addMessageToChat("Sorry, I encountered an error connecting to the server.");
        }
    }

    sendChatBtn.addEventListener('click', handleSendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    });

    // Auto-resize textarea
    chatInput.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
    });
