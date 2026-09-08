import asyncio
from typing import Dict, Any, List
from backend.app.providers.base import BaseASRProvider
from backend.app.core.config import settings

NEWTONS_LAWS_MOCK_SEGMENTS = [
    {
        "segment_index": 1,
        "start_time": 0.0,
        "end_time": 14.5,
        "text": "Welcome to our Physics class on Classical Mechanics. Today we are exploring Sir Isaac Newton's three fundamental laws of motion.",
        "speaker": "Teacher",
        "confidence": 0.98
    },
    {
        "segment_index": 2,
        "start_time": 14.5,
        "end_time": 32.0,
        "text": "Newton's First Law, also known as the Law of Inertia, states that an object remains at rest or continues in uniform motion unless acted upon by an external net force.",
        "speaker": "Teacher",
        "confidence": 0.97
    },
    {
        "segment_index": 3,
        "start_time": 32.0,
        "end_time": 54.0,
        "text": "Newton's Second Law establishes the mathematical relationship between force, mass, and acceleration. Specifically, net force equals mass multiplied by acceleration, or F = m * a.",
        "speaker": "Teacher",
        "confidence": 0.99
    },
    {
        "segment_index": 4,
        "start_time": 54.0,
        "end_time": 78.0,
        "text": "Now consider Newton's Third Law: For every action, there is an equal and opposite reaction. Crucially, these paired forces act on two different interacting bodies, never cancelling each other out on a single object.",
        "speaker": "Teacher",
        "confidence": 0.96
    },
    {
        "segment_index": 5,
        "start_time": 78.0,
        "end_time": 105.0,
        "text": "When a rocket expels exhaust gases downward with force F, the escaping gases exert an equal upward thrust force -F on the rocket body, accelerating it toward space.",
        "speaker": "Teacher",
        "confidence": 0.97
    }
]

class WhisperMockProvider(BaseASRProvider):
    async def transcribe(self, audio_path: str, language: str = "en") -> Dict[str, Any]:
        await asyncio.sleep(0.5)  # Simulate fast deterministic ASR
        full_text = " ".join(seg["text"] for seg in NEWTONS_LAWS_MOCK_SEGMENTS)
        return {
            "provider": "Whisper Mock Provider (Offline)",
            "model": "whisper-base-en",
            "language": language,
            "duration_seconds": 105.0,
            "full_text": full_text,
            "segments": NEWTONS_LAWS_MOCK_SEGMENTS
        }

class WhisperLiveProvider(BaseASRProvider):
    async def transcribe(self, audio_path: str, language: str = "en") -> Dict[str, Any]:
        # Live Whisper integration fallback
        try:
            import whisper
            model = whisper.load_model(settings.WHISPER_MODEL)
            result = model.transcribe(audio_path)
            segments = []
            for i, seg in enumerate(result.get("segments", [])):
                segments.append({
                    "segment_index": i + 1,
                    "start_time": float(seg["start"]),
                    "end_time": float(seg["end"]),
                    "text": seg["text"].strip(),
                    "speaker": "Speaker",
                    "confidence": 0.92
                })
            return {
                "provider": "OpenAI Whisper (Local)",
                "model": settings.WHISPER_MODEL,
                "language": language,
                "duration_seconds": segments[-1]["end_time"] if segments else 0.0,
                "full_text": result.get("text", ""),
                "segments": segments
            }
        except Exception:
            # Fallback to mock on missing model or dependencies
            mock = WhisperMockProvider()
            return await mock.transcribe(audio_path, language)

def get_asr_provider() -> BaseASRProvider:
    if settings.MOCK_PROVIDERS:
        return WhisperMockProvider()
    return WhisperLiveProvider()
