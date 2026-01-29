import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Mic, Square, Play, Pause, Trash2, AlertCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface AudioChannelProps {
  audioBlob: Blob | null;
  onAudioChange: (blob: Blob | null) => void;
  error?: string;
}

const MAX_DURATION_SECONDS = 300; // 5 minutes

export function AudioChannel({ audioBlob, onAudioChange, error }: AudioChannelProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackTime, setPlaybackTime] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const [permissionError, setPermissionError] = useState<string | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioUrlRef = useRef<string | null>(null);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const startRecording = async () => {
    try {
      setPermissionError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported("audio/webm") ? "audio/webm" : "audio/ogg",
      });
      
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        onAudioChange(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorder.start(1000);
      setIsRecording(true);
      setRecordingTime(0);
      
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => {
          if (prev >= MAX_DURATION_SECONDS - 1) {
            stopRecording();
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
      
    } catch (err) {
      console.error("Error accessing microphone:", err);
      setPermissionError("Não foi possível acessar o microfone. Verifique as permissões do navegador.");
    }
  };

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  }, [isRecording]);

  const pauseRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      if (isPaused) {
        mediaRecorderRef.current.resume();
        timerRef.current = setInterval(() => {
          setRecordingTime((prev) => {
            if (prev >= MAX_DURATION_SECONDS - 1) {
              stopRecording();
              return prev;
            }
            return prev + 1;
          });
        }, 1000);
      } else {
        mediaRecorderRef.current.pause();
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      }
      setIsPaused(!isPaused);
    }
  };

  const deleteRecording = () => {
    onAudioChange(null);
    setRecordingTime(0);
    setPlaybackTime(0);
    setAudioDuration(0);
    if (audioUrlRef.current) {
      URL.revokeObjectURL(audioUrlRef.current);
      audioUrlRef.current = null;
    }
  };

  const togglePlayback = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    if (audioBlob) {
      if (audioUrlRef.current) {
        URL.revokeObjectURL(audioUrlRef.current);
      }
      audioUrlRef.current = URL.createObjectURL(audioBlob);
      
      const audio = new Audio(audioUrlRef.current);
      audio.onloadedmetadata = () => {
        setAudioDuration(Math.floor(audio.duration));
      };
      audio.ontimeupdate = () => {
        setPlaybackTime(Math.floor(audio.currentTime));
      };
      audio.onended = () => {
        setIsPlaying(false);
        setPlaybackTime(0);
      };
      audioRef.current = audio;
    }
    
    return () => {
      if (audioUrlRef.current) {
        URL.revokeObjectURL(audioUrlRef.current);
      }
    };
  }, [audioBlob]);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const progressPercent = isRecording 
    ? (recordingTime / MAX_DURATION_SECONDS) * 100 
    : audioDuration > 0 
      ? (playbackTime / audioDuration) * 100 
      : 0;

  return (
    <div className="space-y-4">
      <div className="text-center space-y-2">
        <p className="text-muted-foreground">
          Grave sua manifestação em áudio (máximo 5 minutos)
        </p>
      </div>

      {permissionError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{permissionError}</AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex flex-col items-center gap-4 p-6 bg-muted/30 rounded-lg">
        {!audioBlob && !isRecording && (
          <Button
            type="button"
            size="lg"
            onClick={startRecording}
            className="w-20 h-20 rounded-full bg-destructive hover:bg-destructive/90"
            aria-label="Iniciar gravação"
          >
            <Mic className="h-8 w-8" />
          </Button>
        )}

        {isRecording && (
          <>
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-destructive animate-pulse-ring flex items-center justify-center">
                <Mic className="h-8 w-8 text-destructive-foreground" />
              </div>
            </div>
            
            <div className="text-2xl font-bold tabular-nums" aria-live="polite">
              {formatTime(recordingTime)} / {formatTime(MAX_DURATION_SECONDS)}
            </div>
            
            <Progress value={progressPercent} className="w-full max-w-xs h-2" />
            
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={pauseRecording}
                aria-label={isPaused ? "Continuar gravação" : "Pausar gravação"}
              >
                {isPaused ? <Play className="h-4 w-4 mr-2" /> : <Pause className="h-4 w-4 mr-2" />}
                {isPaused ? "Continuar" : "Pausar"}
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={stopRecording}
                aria-label="Parar gravação"
              >
                <Square className="h-4 w-4 mr-2" />
                Parar
              </Button>
            </div>
          </>
        )}

        {audioBlob && !isRecording && (
          <>
            <div className="text-2xl font-bold tabular-nums">
              {formatTime(playbackTime)} / {formatTime(audioDuration || recordingTime)}
            </div>
            
            <Progress value={progressPercent} className="w-full max-w-xs h-2" />
            
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={togglePlayback}
                aria-label={isPlaying ? "Pausar reprodução" : "Reproduzir áudio"}
              >
                {isPlaying ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                {isPlaying ? "Pausar" : "Ouvir"}
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={deleteRecording}
                aria-label="Excluir gravação"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Excluir
              </Button>
            </div>
            
            <p className="text-sm text-secondary font-medium" role="status">
              ✓ Áudio gravado com sucesso
            </p>
          </>
        )}
      </div>

      <p className="text-xs text-muted-foreground text-center">
        Formato: WebM/Ogg • Duração máxima: 5 minutos
      </p>
    </div>
  );
}
