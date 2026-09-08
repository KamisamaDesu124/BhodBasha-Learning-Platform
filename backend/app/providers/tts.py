import os
import asyncio
from backend.app.providers.base import BaseTTSProvider
from backend.app.core.config import settings

class LocalTTSMockProvider(BaseTTSProvider):
    async def generate_speech(
        self,
        text: str,
        language: str,
        output_path: str,
        gender: str = "female"
    ) -> str:
        await asyncio.sleep(0.2)
        os.makedirs(os.path.dirname(output_path), exist_ok=True)
        # Create a lightweight valid audio file or placeholder if not present
        if not os.path.exists(output_path):
            with open(output_path, "wb") as f:
                # 44-byte minimal WAV header for valid audio playback
                f.write(b'RIFF\x24\x00\x00\x00WAVEfmt \x10\x00\x00\x00\x01\x00\x01\x00D\xac\x00\x00\x88X\x01\x00\x02\x00\x10\x00data\x00\x00\x00\x00')
        return output_path

class BhashiniTTSProvider(BaseTTSProvider):
    async def generate_speech(self, text: str, language: str, output_path: str, gender: str = "female") -> str:
        mock = LocalTTSMockProvider()
        return await mock.generate_speech(text, language, output_path, gender)

def get_tts_provider() -> BaseTTSProvider:
    if settings.MOCK_PROVIDERS:
        return LocalTTSMockProvider()
    return BhashiniTTSProvider()
