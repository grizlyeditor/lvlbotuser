class LevelUpDashboard {
    constructor() {
        this.jobs = JSON.parse(localStorage.getItem('levelup_jobs')) || [];
        this.currentJob = null;
        this.xpInterval = null;
        this.xpGainSpeed = 'medium';
        this.currentRegion = 'BD';
        this.stats = JSON.parse(localStorage.getItem('levelup_stats')) || {
            activeJobs: 0,
            totalXP: 0,
            levelsGained: 0,
            daysRunning: 0
        };
        
        this.xpRequirements = this.calculateXPRequirements();
        this.initializeApp();
    }

    initializeApp() {
        this.showLoading();
        this.initializeEventListeners();
        this.loadJobs();
        this.updateStats();
        this.startDaysCounter();
        
        setTimeout(() => {
            this.hideLoading();
            this.showNotification('LevelUp Dashboard initialized successfully!', 'success');
        }, 2000);
    }

    calculateXPRequirements() {
        const requirements = {};
        
        // Complete XP Requirements from Level 1 to Level 100
        requirements[1] = 600;     // Level 1 to Level 2
        requirements[2] = 1200;    // Level 2 to Level 3
        requirements[3] = 1800;    // Level 3 to Level 4
        requirements[4] = 2400;    // Level 4 to Level 5
        requirements[5] = 3000;    // Level 5 to Level 6
        requirements[6] = 3600;    // Level 6 to Level 7
        requirements[7] = 4200;    // Level 7 to Level 8
        requirements[8] = 4800;    // Level 8 to Level 9
        requirements[9] = 5400;    // Level 9 to Level 10
        requirements[10] = 6000;   // Level 10 to Level 11
        requirements[11] = 6600;   // Level 11 to Level 12
        requirements[12] = 7200;   // Level 12 to Level 13
        requirements[13] = 7800;   // Level 13 to Level 14
        requirements[14] = 8400;   // Level 14 to Level 15
        requirements[15] = 9000;   // Level 15 to Level 16
        requirements[16] = 9600;   // Level 16 to Level 17
        requirements[17] = 10200;  // Level 17 to Level 18
        requirements[18] = 10800;  // Level 18 to Level 19
        requirements[19] = 11400;  // Level 19 to Level 20
        requirements[20] = 12000;  // Level 20 to Level 21
        requirements[21] = 12600;  // Level 21 to Level 22
        requirements[22] = 13200;  // Level 22 to Level 23
        requirements[23] = 13800;  // Level 23 to Level 24
        requirements[24] = 14400;  // Level 24 to Level 25
        requirements[25] = 15000;  // Level 25 to Level 26
        requirements[26] = 15600;  // Level 26 to Level 27
        requirements[27] = 16200;  // Level 27 to Level 28
        requirements[28] = 16800;  // Level 28 to Level 29
        requirements[29] = 17400;  // Level 29 to Level 30
        requirements[30] = 18000;  // Level 30 to Level 31
        requirements[31] = 18600;  // Level 31 to Level 32
        requirements[32] = 19200;  // Level 32 to Level 33
        requirements[33] = 19800;  // Level 33 to Level 34
        requirements[34] = 20400;  // Level 34 to Level 35
        requirements[35] = 21000;  // Level 35 to Level 36
        requirements[36] = 21600;  // Level 36 to Level 37
        requirements[37] = 22200;  // Level 37 to Level 38
        requirements[38] = 22800;  // Level 38 to Level 39
        requirements[39] = 23400;  // Level 39 to Level 40
        requirements[40] = 24000;  // Level 40 to Level 41
        requirements[41] = 24600;  // Level 41 to Level 42
        requirements[42] = 25200;  // Level 42 to Level 43
        requirements[43] = 25800;  // Level 43 to Level 44
        requirements[44] = 26400;  // Level 44 to Level 45
        requirements[45] = 27000;  // Level 45 to Level 46
        requirements[46] = 27600;  // Level 46 to Level 47
        requirements[47] = 28200;  // Level 47 to Level 48
        requirements[48] = 28800;  // Level 48 to Level 49
        requirements[49] = 29400;  // Level 49 to Level 50
        requirements[50] = 30000;  // Level 50 to Level 51
        requirements[51] = 30600;  // Level 51 to Level 52
        requirements[52] = 31200;  // Level 52 to Level 53
        requirements[53] = 31800;  // Level 53 to Level 54
        requirements[54] = 32400;  // Level 54 to Level 55
        requirements[55] = 33000;  // Level 55 to Level 56
        requirements[56] = 33600;  // Level 56 to Level 57
        requirements[57] = 34200;  // Level 57 to Level 58
        requirements[58] = 34800;  // Level 58 to Level 59
        requirements[59] = 35400;  // Level 59 to Level 60
        requirements[60] = 36000;  // Level 60 to Level 61
        requirements[61] = 36600;  // Level 61 to Level 62
        requirements[62] = 37200;  // Level 62 to Level 63
        requirements[63] = 37800;  // Level 63 to Level 64
        requirements[64] = 38400;  // Level 64 to Level 65
        requirements[65] = 39000;  // Level 65 to Level 66
        requirements[66] = 39600;  // Level 66 to Level 67
        requirements[67] = 40200;  // Level 67 to Level 68
        requirements[68] = 40800;  // Level 68 to Level 69
        requirements[69] = 41400;  // Level 69 to Level 70
        requirements[70] = 42000;  // Level 70 to Level 71
        requirements[71] = 42600;  // Level 71 to Level 72
        requirements[72] = 43200;  // Level 72 to Level 73
        requirements[73] = 43800;  // Level 73 to Level 74
        requirements[74] = 44400;  // Level 74 to Level 75
        requirements[75] = 45000;  // Level 75 to Level 76
        requirements[76] = 45600;  // Level 76 to Level 77
        requirements[77] = 46200;  // Level 77 to Level 78
        requirements[78] = 46800;  // Level 78 to Level 79
        requirements[79] = 47400;  // Level 79 to Level 80
        requirements[80] = 48000;  // Level 80 to Level 81
        requirements[81] = 48600;  // Level 81 to Level 82
        requirements[82] = 49200;  // Level 82 to Level 83
        requirements[83] = 49800;  // Level 83 to Level 84
        requirements[84] = 50400;  // Level 84 to Level 85
        requirements[85] = 51000;  // Level 85 to Level 86
        requirements[86] = 51600;  // Level 86 to Level 87
        requirements[87] = 52200;  // Level 87 to Level 88
        requirements[88] = 52800;  // Level 88 to Level 89
        requirements[89] = 53400;  // Level 89 to Level 90
        requirements[90] = 54000;  // Level 90 to Level 91
        requirements[91] = 54600;  // Level 91 to Level 92
        requirements[92] = 55200;  // Level 92 to Level 93
        requirements[93] = 55800;  // Level 93 to Level 94
        requirements[94] = 56400;  // Level 94 to Level 95
        requirements[95] = 57000;  // Level 95 to Level 96
        requirements[96] = 57600;  // Level 96 to Level 97
        requirements[97] = 58200;  // Level 97 to Level 98
        requirements[98] = 58800;  // Level 98 to Level 99
        requirements[99] = 59400;  // Level 99 to Level 100
        
        return requirements;
    }

    getTotalXPForLevel(level) {
        let totalXP = 0;
        for (let i = 1; i < level; i++) {
            totalXP += this.xpRequirements[i];
        }
        return totalXP;
    }

    calculateLevelProgress(currentLevel, currentXP) {
        const xpForCurrentLevel = this.getTotalXPForLevel(currentLevel);
        const xpForNextLevel = xpForCurrentLevel + this.xpRequirements[currentLevel];
        const currentLevelXP = currentXP - xpForCurrentLevel;
        const xpNeeded = this.xpRequirements[currentLevel];
        const progressPercentage = (currentLevelXP / xpNeeded) * 100;

        return {
            currentLevelXP,
            xpNeeded,
            progressPercentage,
            nextLevel: currentLevel + 1
        };
    }

    initializeEventListeners() {
        // New Job Button
        document.getElementById('newJobBtn').addEventListener('click', () => {
            this.openNewJobModal();
        });

        // Modal Buttons
        document.getElementById('closeNewJobModal').addEventListener('click', () => {
            this.closeNewJobModal();
        });

        document.getElementById('cancelJob').addEventListener('click', () => {
            this.closeNewJobModal();
        });

        document.getElementById('createJob').addEventListener('click', () => {
            this.createJob();
        });

        document.getElementById('closeJobDetails').addEventListener('click', () => {
            this.closeJobDetailsModal();
        });

        document.getElementById('startDeploy').addEventListener('click', () => {
            this.startDeployment();
        });

        document.getElementById('stopDeploy').addEventListener('click', () => {
            this.stopDeployment();
        });

        // Verify UID Button
        document.getElementById('verifyUid').addEventListener('click', () => {
            this.verifyUID();
        });

        // Region Buttons
        document.querySelectorAll('.region-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.region-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentRegion = e.target.dataset.region;
            });
        });

        // Speed Controls
        document.querySelectorAll('.speed-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.speed-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.xpGainSpeed = e.target.dataset.speed;
                if (this.xpInterval) {
                    this.stopDeployment();
                    this.startDeployment();
                }
            });
        });

        // Input Enter Key Support
        document.getElementById('deploymentName').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.createJob();
        });

        document.getElementById('uid').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.verifyUID();
        });

        // Theme Toggle
        document.getElementById('themeToggle').addEventListener('click', () => {
            this.toggleTheme();
        });

        // Close modals on backdrop click
        document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
            backdrop.addEventListener('click', (e) => {
                if (e.target === backdrop) {
                    this.closeAllModals();
                }
            });
        });
    }

    showLoading() {
        document.getElementById('loadingOverlay').style.display = 'flex';
    }

    hideLoading() {
        document.getElementById('loadingOverlay').style.display = 'none';
    }

    showNotification(message, type = 'info') {
        const container = document.getElementById('notificationContainer');
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${this.getNotificationIcon(type)}"></i>
                ${message}
            </div>
        `;
        
        container.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideInRight 0.3s ease reverse';
            setTimeout(() => {
                container.removeChild(notification);
            }, 300);
        }, 5000);
    }

    getNotificationIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };
        return icons[type] || 'info-circle';
    }

    openNewJobModal() {
        document.getElementById('newJobModal').style.display = 'block';
        document.getElementById('deploymentName').focus();
    }

    closeNewJobModal() {
        document.getElementById('newJobModal').style.display = 'none';
        this.clearForm();
    }

    closeJobDetailsModal() {
        document.getElementById('jobDetailsModal').style.display = 'none';
        this.stopDeployment();
    }

    closeAllModals() {
        this.closeNewJobModal();
        this.closeJobDetailsModal();
    }

    clearForm() {
        document.getElementById('deploymentName').value = '';
        document.getElementById('uid').value = '';
        document.getElementById('accessToken').value = '';
        document.getElementById('verifyUid').classList.remove('verified');
        document.getElementById('verifyUid').style.backgroundColor = '';
    }

    async verifyUID() {
        const uid = document.getElementById('uid').value.trim();
        
        if (!uid) {
            this.showNotification('Please enter UID', 'error');
            return;
        }

        const verifyBtn = document.getElementById('verifyUid');
        verifyBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        verifyBtn.disabled = true;

        try {
            const response = await fetch(`https://infoalinwnwn.vercel.app/get?uid=${uid}&region=${this.currentRegion}`);
            
            if (!response.ok) {
                throw new Error('API request failed');
            }

            const data = await response.json();
            
            if (data && data.AccountInfo) {
                this.displayAccountInfo(data);
                verifyBtn.innerHTML = '<i class="fas fa-check"></i>';
                verifyBtn.classList.add('verified');
                verifyBtn.style.backgroundColor = 'var(--success-color)';
                this.showNotification('UID verified successfully!', 'success');
            } else {
                throw new Error('Invalid UID or account not found');
            }
        } catch (error) {
            console.error('UID Verification Error:', error);
            verifyBtn.innerHTML = '<i class="fas fa-times"></i>';
            verifyBtn.style.backgroundColor = 'var(--danger-color)';
            this.showNotification('Error verifying UID: ' + error.message, 'error');
        } finally {
            verifyBtn.disabled = false;
        }
    }

    displayAccountInfo(data) {
        const accountInfo = data.AccountInfo;
        const guildInfo = data.GuildInfo;
        
        const infoHTML = `
            <div class="info-item">
                <span class="label"><i class="fas fa-user"></i> Name:</span>
                <span class="value">${accountInfo.AccountName || 'N/A'}</span>
            </div>
            <div class="info-item">
                <span class="label"><i class="fas fa-chart-line"></i> Level:</span>
                <span class="value">${accountInfo.AccountLevel || 'N/A'}</span>
            </div>
            <div class="info-item">
                <span class="label"><i class="fas fa-heart"></i> Likes:</span>
                <span class="value">${accountInfo.AccountLikes || '0'}</span>
            </div>
            <div class="info-item">
                <span class="label"><i class="fas fa-star"></i> XP:</span>
                <span class="value">${accountInfo.AccountEXP ? accountInfo.AccountEXP.toLocaleString() : '0'}</span>
            </div>
            <div class="info-item">
                <span class="label"><i class="fas fa-trophy"></i> Battle Rank:</span>
                <span class="value">${accountInfo.BrMaxRank || 'N/A'}</span>
            </div>
            <div class="info-item">
                <span class="label"><i class="fas fa-users"></i> Guild:</span>
                <span class="value">${guildInfo?.GuildName || 'No Guild'}</span>
            </div>
        `;
        
        document.getElementById('accountInfo').innerHTML = infoHTML;
    }

    createJob() {
        const deploymentName = document.getElementById('deploymentName').value.trim();
        const uid = document.getElementById('uid').value.trim();
        const accessToken = document.getElementById('accessToken').value.trim();

        if (!deploymentName) {
            this.showNotification('Please enter deployment name', 'error');
            return;
        }

        if (!uid) {
            this.showNotification('Please enter UID', 'error');
            return;
        }

        const job = {
            id: this.generateId(),
            deploymentName,
            uid,
            accessToken,
            region: this.currentRegion,
            createdAt: new Date().toISOString(),
            isActive: false,
            totalXPGained: 0,
            levelsGained: 0
        };

        this.jobs.push(job);
        this.saveJobs();
        this.loadJobs();
        this.closeNewJobModal();
        
        this.showNotification(`Deployment "${deploymentName}" created successfully!`, 'success');
    }

    generateId() {
        return 'job_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    loadJobs() {
        const jobsList = document.getElementById('jobsList');
        jobsList.innerHTML = '';

        if (this.jobs.length === 0) {
            jobsList.innerHTML = `
                <div class="no-jobs">
                    <i class="fas fa-inbox"></i>
                    <p>No deployments yet. Create your first one!</p>
                </div>
            `;
            return;
        }

        this.jobs.forEach(job => {
            const jobElement = document.createElement('div');
            jobElement.className = `job-item ${job.isActive ? 'active' : ''}`;
            jobElement.innerHTML = `
                <div class="job-name">
                    <i class="fas fa-server"></i>
                    ${job.deploymentName}
                </div>
                <div class="job-status ${job.isActive ? 'active' : 'inactive'}">
                    ${job.isActive ? 'Active' : 'Inactive'}
                </div>
            `;
            
            jobElement.addEventListener('click', () => {
                this.showJobDetails(job);
            });
            
            jobsList.appendChild(jobElement);
        });

        this.updateStats();
    }

    async showJobDetails(job) {
        this.currentJob = job;
        
        try {
            const response = await fetch(`https://infoalinwnwn.vercel.app/get?uid=${job.uid}&region=${job.region}`);
            const data = await response.json();
            
            if (!data.AccountInfo) {
                throw new Error('Invalid account data');
            }

            document.getElementById('jobDeploymentName').innerHTML = `
                <i class="fas fa-server"></i>
                ${job.deploymentName}
            `;
            
            this.displayJobAccountDetails(data);
            this.calculateXPProgress(data.AccountInfo.AccountLevel, data.AccountInfo.AccountEXP);
            
            document.getElementById('jobDetailsModal').style.display = 'block';
            
        } catch (error) {
            this.showNotification('Error loading job details: ' + error.message, 'error');
        }
    }

    displayJobAccountDetails(data) {
        const accountInfo = data.AccountInfo;
        const guildInfo = data.GuildInfo;
        const socialInfo = data.socialinfo;
        
        const detailsHTML = `
            <div class="account-detail-item">
                <div class="detail-label">Account Name</div>
                <div class="detail-value">${accountInfo.AccountName}</div>
            </div>
            <div class="account-detail-item">
                <div class="detail-label">Level</div>
                <div class="detail-value">${accountInfo.AccountLevel}</div>
            </div>
            <div class="account-detail-item">
                <div class="detail-label">Likes</div>
                <div class="detail-value">${accountInfo.AccountLikes}</div>
            </div>
            <div class="account-detail-item">
                <div class="detail-label">Total XP</div>
                <div class="detail-value">${accountInfo.AccountEXP.toLocaleString()}</div>
            </div>
            <div class="account-detail-item">
                <div class="detail-label">Battle Rank</div>
                <div class="detail-value">${accountInfo.BrMaxRank || 'N/A'}</div>
            </div>
            <div class="account-detail-item">
                <div class="detail-label">Guild</div>
                <div class="detail-value">${guildInfo?.GuildName || 'No Guild'}</div>
            </div>
            <div class="account-detail-item">
                <div class="detail-label">Region</div>
                <div class="detail-value">${accountInfo.AccountRegion}</div>
            </div>
            <div class="account-detail-item">
                <div class="detail-label">Signature</div>
                <div class="detail-value">${socialInfo?.signature || 'No signature'}</div>
            </div>
        `;
        
        document.getElementById('jobAccountDetails').innerHTML = detailsHTML;
    }

    calculateXPProgress(level, currentXP) {
        const progress = this.calculateLevelProgress(level, currentXP);
        
        document.getElementById('progressFill').style.width = `${progress.progressPercentage}%`;
        document.getElementById('currentXPValue').textContent = progress.currentLevelXP.toLocaleString();
        document.getElementById('nextLevelXPValue').textContent = progress.xpNeeded.toLocaleString();
        document.getElementById('currentLevel').textContent = level;
        document.getElementById('nextLevel').textContent = progress.nextLevel;
    }

    startDeployment() {
        if (!this.currentJob) return;

        this.currentJob.isActive = true;
        this.currentJob.startTime = Date.now();
        this.saveJobs();
        this.loadJobs();
        
        this.startXPAnimation();
        
        document.getElementById('startDeploy').disabled = true;
        document.getElementById('stopDeploy').disabled = false;
        
        this.showNotification(`Deployment "${this.currentJob.deploymentName}" started!`, 'success');
    }

    stopDeployment() {
        if (!this.currentJob) return;

        this.currentJob.isActive = false;
        this.saveJobs();
        this.loadJobs();
        
        if (this.xpInterval) {
            clearInterval(this.xpInterval);
            this.xpInterval = null;
        }
        
        document.getElementById('startDeploy').disabled = false;
        document.getElementById('stopDeploy').disabled = true;
        
        this.showNotification(`Deployment "${this.currentJob.deploymentName}" stopped!`, 'warning');
    }

    startXPAnimation() {
        if (this.xpInterval) {
            clearInterval(this.xpInterval);
        }

        const speedMultipliers = {
            slow: 8000,
            medium: 5000,
            fast: 2000
        };

        const interval = speedMultipliers[this.xpGainSpeed] || 5000;

        this.xpInterval = setInterval(() => {
            if (!this.currentJob || !this.currentJob.isActive) {
                clearInterval(this.xpInterval);
                return;
            }

            const progressFill = document.getElementById('progressFill');
            const currentWidth = parseFloat(progressFill.style.width) || 0;
            
            // Random XP gain based on speed
            const baseGain = { slow: 25, medium: 50, fast: 100 };
            const randomIncrement = Math.random() * 20 + baseGain[this.xpGainSpeed];
            const newWidth = Math.min(currentWidth + (randomIncrement / 6), 100);

            progressFill.style.width = `${newWidth}%`;
            
            // Update current XP display
            const currentXP = parseInt(document.getElementById('currentXPValue').textContent.replace(/,/g, ''));
            const newXP = currentXP + Math.round(randomIncrement);
            document.getElementById('currentXPValue').textContent = newXP.toLocaleString();
            
            // Update stats
            this.stats.totalXP += Math.round(randomIncrement);
            this.currentJob.totalXPGained += Math.round(randomIncrement);
            
            // Check for level up
            if (newWidth >= 100) {
                this.handleLevelUp();
            }
            
            this.saveJobs();
            this.updateStats();
            
        }, interval);
    }

    handleLevelUp() {
        const currentLevel = parseInt(document.getElementById('currentLevel').textContent);
        const nextLevel = currentLevel + 1;
        
        // Reset progress bar
        document.getElementById('progressFill').style.width = '0%';
        document.getElementById('currentXPValue').textContent = '0';
        document.getElementById('currentLevel').textContent = nextLevel;
        document.getElementById('nextLevel').textContent = nextLevel + 1;
        document.getElementById('nextLevelXPValue').textContent = this.xpRequirements[nextLevel].toLocaleString();
        
        // Update stats
        this.stats.levelsGained++;
        this.currentJob.levelsGained++;
        
        this.showNotification(`🎉 Level Up! Reached Level ${nextLevel}`, 'success');
        this.saveJobs();
        this.updateStats();
    }

    startDaysCounter() {
        const savedStartTime = localStorage.getItem('levelup_start_time');
        if (!savedStartTime) {
            localStorage.setItem('levelup_start_time', Date.now().toString());
        }
        
        const startTime = parseInt(savedStartTime || Date.now().toString());
        const updateDays = () => {
            const days = Math.floor((Date.now() - startTime) / (1000 * 60 * 60 * 24));
            document.getElementById('daysCount').textContent = days;
            this.stats.daysRunning = days;
            this.saveStats();
        };
        
        updateDays();
        setInterval(updateDays, 60000);
    }

    updateStats() {
        const activeJobs = this.jobs.filter(job => job.isActive).length;
        document.getElementById('activeJobs').textContent = activeJobs;
        document.getElementById('totalXP').textContent = this.stats.totalXP.toLocaleString();
        document.getElementById('levelsGained').textContent = this.stats.levelsGained;
        
        this.stats.activeJobs = activeJobs;
        this.saveStats();
    }

    saveJobs() {
        localStorage.setItem('levelup_jobs', JSON.stringify(this.jobs));
    }

    saveStats() {
        localStorage.setItem('levelup_stats', JSON.stringify(this.stats));
    }

    toggleTheme() {
        const themeToggle = document.getElementById('themeToggle');
        const icon = themeToggle.querySelector('i');
        
        if (icon.classList.contains('fa-moon')) {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
            this.applyLightTheme();
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
            this.applyDarkTheme();
        }
    }

    applyLightTheme() {
        document.documentElement.style.setProperty('--primary-bg', '#ffffff');
        document.documentElement.style.setProperty('--secondary-bg', '#f5f5f5');
        document.documentElement.style.setProperty('--text-primary', '#333333');
        document.documentElement.style.setProperty('--text-secondary', '#666666');
        document.documentElement.style.setProperty('--border-color', '#dddddd');
        document.documentElement.style.setProperty('--header-bg', '#e9ecef');
        document.documentElement.style.setProperty('--modal-bg', 'rgba(255, 255, 255, 0.95)');
    }

    applyDarkTheme() {
        document.documentElement.style.setProperty('--primary-bg', '#0a0a0a');
        document.documentElement.style.setProperty('--secondary-bg', '#1a1a1a');
        document.documentElement.style.setProperty('--text-primary', '#ffffff');
        document.documentElement.style.setProperty('--text-secondary', '#b0b0b0');
        document.documentElement.style.setProperty('--border-color', '#333333');
        document.documentElement.style.setProperty('--header-bg', '#2a2a2a');
        document.documentElement.style.setProperty('--modal-bg', 'rgba(0, 0, 0, 0.95)');
    }
}

// Initialize the dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new LevelUpDashboard();
});

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        console.log('Page is hidden');
    } else {
        console.log('Page is visible');
    }
});

// Error handling
window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
});

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LevelUpDashboard;
}