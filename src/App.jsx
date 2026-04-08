import { useState, useEffect, useRef } from 'react';

const PHASES = [
  "밤이 되었습니다. 모두 눈을 감고, 소리질러어어어어",
  "마녀는 죽일사람을 선택해주세요",
  "경찰은 살릴사람을 선택해주세요",
  "아침이 되었습니다",
  "자수하고싶은사람은 자수하세요"
];

function App() {
  // Array of delays corresponding to the pause AFTER each phase
  // Initialize with 5 seconds for each phase, except the last one which doesn't need a delay
  const [delays, setDelays] = useState(Array(PHASES.length - 1).fill(5));
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(-1);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  const timerRef = useRef(null);
  const countdownRef = useRef(null);

  const stopGame = () => {
    setIsPlaying(false);
    setCurrentPhaseIndex(-1);
    setIsSpeaking(false);
    setTimeLeft(0);
    window.speechSynthesis.cancel();
    if (timerRef.current) clearTimeout(timerRef.current);
    if (countdownRef.current) clearInterval(countdownRef.current);
  };

  const updateDelay = (index, value) => {
    const newDelays = [...delays];
    newDelays[index] = value;
    setDelays(newDelays);
  };

  const speakPhase = (index) => {
    if (index >= PHASES.length) {
      stopGame();
      return;
    }

    setCurrentPhaseIndex(index);
    setIsSpeaking(true);

    const utterance = new SpeechSynthesisUtterance(PHASES[index]);
    utterance.lang = 'ko-KR';
    utterance.rate = 0.9;
    
    // Find Korean voice if available
    const voices = window.speechSynthesis.getVoices();
    const koreanVoice = voices.find(v => v.lang === 'ko-KR' || v.lang.includes('ko'));
    if (koreanVoice) utterance.voice = koreanVoice;

    utterance.onend = () => {
      setIsSpeaking(false);
      
      // Setup delay timer before next phase
      if (index < PHASES.length - 1) {
        const currentDelay = delays[index];
        setTimeLeft(currentDelay);

        // Countdown interval for progress bar updates
        countdownRef.current = setInterval(() => {
          setTimeLeft((prev) => {
            if (prev <= 0.1) {
              clearInterval(countdownRef.current);
              return 0;
            }
            return prev - 0.1;
          });
        }, 100);

        timerRef.current = setTimeout(() => {
          clearInterval(countdownRef.current);
          speakPhase(index + 1);
        }, currentDelay * 1000);
      } else {
        setTimeout(stopGame, 2000); // end of game
      }
    };

    window.speechSynthesis.speak(utterance);
  };

  const startGame = () => {
    if (isPlaying) return;
    setIsPlaying(true);
    // Ensure voices are loaded to prevent silent first speech
    window.speechSynthesis.getVoices();
    speakPhase(0);
  };

  useEffect(() => {
    // Attempt pre-load voices
    window.speechSynthesis.getVoices();
    return () => stopGame();
  }, []);

  return (
    <div className="card">
      <h1>Salem Moderator</h1>
      <h2>세일럼 보드게임 자동 사회자</h2>

      {!isPlaying ? (
        <div className="controls">
          <div className="delay-configurations">
            {PHASES.map((phase, index) => (
              <div key={index} className="phase-config">
                <p className="phase-text-preview">"{phase}"</p>
                {index < PHASES.length - 1 && (
                  <div className="control-group">
                    <label>
                      <span>다음 음성까지 대기</span>
                      <span>{delays[index]}초</span>
                    </label>
                    <input 
                      type="range" 
                      min="1" 
                      max="30" 
                      value={delays[index]} 
                      onChange={(e) => updateDelay(index, Number(e.target.value))} 
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
          <button onClick={startGame}>게임 시작</button>
        </div>
      ) : (
        <div className="active-game">
          <div className="phase-display active">
            {isSpeaking ? (
              <p className="phase-text">"{PHASES[currentPhaseIndex]}"</p>
            ) : (
              <div style={{ width: '100%' }}>
                <p className="phase-waiting">다음 단계 대기 중...</p>
                <div className="progress-bar-container">
                  <div 
                    className="progress-bar" 
                    style={{ width: `${(1 - (timeLeft / delays[currentPhaseIndex])) * 100}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
          <button className="stop" onClick={stopGame}>게임 중지</button>
        </div>
      )}
    </div>
  );
}

export default App;
