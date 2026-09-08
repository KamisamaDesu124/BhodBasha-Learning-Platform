from abc import ABC, abstractmethod
from typing import List, Dict, Any, Optional

class BaseASRProvider(ABC):
    @abstractmethod
    async def transcribe(self, audio_path: str, language: str = "en") -> Dict[str, Any]:
        """Transcribe audio to timestamped segments."""
        pass

class BaseTranslationProvider(ABC):
    @abstractmethod
    async def translate_text(
        self,
        text: str,
        source_lang: str,
        target_lang: str,
        locked_terms: Optional[List[str]] = None
    ) -> Dict[str, Any]:
        """Translate text while preserving locked STEM terms."""
        pass

    @abstractmethod
    async def translate_segments(
        self,
        segments: List[Dict[str, Any]],
        source_lang: str,
        target_lang: str
    ) -> List[Dict[str, Any]]:
        """Translate a series of transcript segments."""
        pass

class BaseTTSProvider(ABC):
    @abstractmethod
    async def generate_speech(
        self,
        text: str,
        language: str,
        output_path: str,
        gender: str = "female"
    ) -> str:
        """Synthesize speech audio from translated text."""
        pass

class BaseRAGProvider(ABC):
    @abstractmethod
    async def extract_concepts_and_competencies(self, transcript_text: str) -> Dict[str, Any]:
        """Extract structured STEM concepts, formulas, competencies from content."""
        pass

    @abstractmethod
    async def generate_assessment_questions(
        self,
        concepts: List[Dict[str, Any]],
        source_segments: List[Dict[str, Any]]
    ) -> List[Dict[str, Any]]:
        """Generate source-grounded assessment questions with explanations."""
        pass
