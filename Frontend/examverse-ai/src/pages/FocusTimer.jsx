import React, { useState, useEffect, useRef } from 'react';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import styles from './FocusTimer.module.css';
import api from '../services/api';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Award } from 'lucide-react';
import { toast } from 'react-toastify';

const FocusTimer = () => {
    const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
    const [isActive, setIsActive] = useState(false);
    const [mode, setMode] = useState('focus'); // 'focus' or 'break'
    const [ambientSound, setAmbientSound] = useState('none');
    const [isMuted, setIsMuted] = useState(false);
    
    const audioRef = useRef(null);

    const sounds = {
        none: null,
        rain: 'https://cdn.pixabay.com/download/audio/2021/08/09/audio_8844837586.mp3?filename=rain-and-thunder-16705.mp3',
        cafe: 'https://cdn.pixabay.com/download/audio/2022/02/07/audio_c3b6f0076a.mp3?filename=cafe-background-1-45479.mp3',
        lofi: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3'
    };

    useEffect(() => {
        let interval = null;

        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft(time => time - 1);
            }, 1000);
        } else if (isActive && timeLeft === 0) {
            handleTimerComplete();
            clearInterval(interval);
        }

        return () => clearInterval(interval);
    }, [isActive, timeLeft]);

    // Handle Ambient Sound
    useEffect(() => {
        if (ambientSound === 'none') {
            if (audioRef.current) audioRef.current.pause();
            return;
        }

        if (audioRef.current) {
            audioRef.current.src = sounds[ambientSound];
            audioRef.current.loop = true;
            if (isActive && !isMuted) {
                audioRef.current.play().catch(e => console.log("Audio play blocked", e));
            } else {
                audioRef.current.pause();
            }
        }
    }, [ambientSound, isActive, isMuted]);

    const handleTimerComplete = async () => {
        setIsActive(false);
        
        if (mode === 'focus') {
            toast.success("Focus session complete! +5 Gamification Points earned 🏆");
            
            // Log study session to backend for points
            try {
                const token = localStorage.getItem('token');
                await api.post('/gamification/log-study', {}, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } catch (error) {
                console.error("Failed to log points", error);
            }

            // Automatically switch to Break
            setMode('break');
            setTimeLeft(5 * 60);
        } else {
            toast.info("Break is over! Ready to focus again? 🧠");
            setMode('focus');
            setTimeLeft(25 * 60);
        }
    };

    const toggleTimer = () => {
        setIsActive(!isActive);
    };

    const resetTimer = () => {
        setIsActive(false);
        setTimeLeft(mode === 'focus' ? 25 * 60 : 5 * 60);
    };

    const switchMode = (newMode) => {
        setIsActive(false);
        setMode(newMode);
        setTimeLeft(newMode === 'focus' ? 25 * 60 : 5 * 60);
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <DashboardLayout>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1>Gamified Focus Room 🍅</h1>
                    <p>Use the Pomodoro technique to study effectively. Earn <strong>5 points</strong> for every 25-minute focus session!</p>
                </div>

                <div className={styles.mainCard}>
                    
                    <div className={styles.modeTabs}>
                        <button 
                            className={`${styles.tab} ${mode === 'focus' ? styles.activeTab : ''}`}
                            onClick={() => switchMode('focus')}
                        >
                            🧠 Focus (25m)
                        </button>
                        <button 
                            className={`${styles.tab} ${mode === 'break' ? styles.activeTabBreak : ''}`}
                            onClick={() => switchMode('break')}
                        >
                            ☕ Break (5m)
                        </button>
                    </div>

                    <div className={styles.timerCircle}>
                        <div className={`${styles.timeDisplay} ${mode === 'break' ? styles.breakText : ''}`}>
                            {formatTime(timeLeft)}
                        </div>
                        <p className={styles.statusText}>
                            {isActive ? (mode === 'focus' ? 'Deep Work in Progress...' : 'Relaxing...') : 'Paused'}
                        </p>
                    </div>

                    <div className={styles.controls}>
                        <button onClick={toggleTimer} className={`${styles.btn} ${isActive ? styles.pauseBtn : styles.playBtn}`}>
                            {isActive ? <><Pause size={24}/> Pause</> : <><Play size={24}/> Start</>}
                        </button>
                        <button onClick={resetTimer} className={`${styles.btn} ${styles.resetBtn}`}>
                            <RotateCcw size={24} /> Reset
                        </button>
                    </div>

                    <div className={styles.rewardsBox}>
                        <Award className={styles.rewardIcon} size={20} />
                        <span>Complete this session to earn <strong>+5 Points</strong> for the Global Leaderboard!</span>
                    </div>

                    <div className={styles.ambientSection}>
                        <h3>Ambient Sounds</h3>
                        <div className={styles.soundControls}>
                            <select 
                                value={ambientSound} 
                                onChange={(e) => setAmbientSound(e.target.value)}
                                className={styles.soundSelect}
                            >
                                <option value="none">🔇 No Sound</option>
                                <option value="rain">🌧️ Rain & Thunder</option>
                                <option value="cafe">☕ Busy Cafe</option>
                                <option value="lofi">🎧 Lo-Fi Beats</option>
                            </select>

                            <button 
                                onClick={() => setIsMuted(!isMuted)} 
                                className={styles.muteBtn}
                                disabled={ambientSound === 'none'}
                                title={isMuted ? "Unmute" : "Mute"}
                            >
                                {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Hidden Audio Element */}
                <audio ref={audioRef} />
            </div>
        </DashboardLayout>
    );
};

export default FocusTimer;
