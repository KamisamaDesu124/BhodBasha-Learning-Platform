import asyncio
from typing import List, Dict, Any, Optional
from backend.app.providers.base import BaseTranslationProvider
from backend.app.core.config import settings

MOCK_TRANSLATIONS = {
    "te": [
        {
            "segment_index": 1,
            "text": "క్లాసికల్ మెకానిక్స్ (Classical Mechanics) పై మన ఫిజిక్స్ తరగతికి స్వాగతం. ఈ రోజు మనం సర్ ఐజాక్ న్యూటన్ యొక్క మూడు ప్రాథమిక చలన నియమాలను (Laws of Motion) అన్వేషిస్తున్నాము.",
            "locked_terms": ["Classical Mechanics", "Laws of Motion", "Sir Isaac Newton"]
        },
        {
            "segment_index": 2,
            "text": "న్యూటన్ మొదటి నియమం (Law of Inertia - జడత్వ నియమం) ప్రకారం, బాహ్య నికర బలం (external net force) పనిచేయనంత వరకు వస్తువు విశ్రాంతి స్థితిలో లేదా స్థిర వేగంతో సరళ రేఖలో కొనసాగుతుంది.",
            "locked_terms": ["Law of Inertia", "net force", "uniform motion"]
        },
        {
            "segment_index": 3,
            "text": "న్యూటన్ రెండవ నియమం బలం (Force), ద్రవ్యరాశి (Mass) మరియు త్వరణం (Acceleration) మధ్య గణిత సంబంధాన్ని ఏర్పరుస్తుంది. ప్రత్యేకంగా, నికర బలం = ద్రవ్యరాశి × త్వరణం, లేదా F = m * a.",
            "locked_terms": ["Force", "Mass", "Acceleration", "F = m * a"]
        },
        {
            "segment_index": 4,
            "text": "ఇప్పుడు న్యూటన్ మూడవ నియమాన్ని పరిశీలించండి: ప్రతి చర్యకు సమానమైన మరియు వ్యతిరేకమైన ప్రతిచర్య ఉంటుంది (Action-Reaction). ముఖ్యంగా, ఈ జంట బలాలు రెండు వేర్వేరు వస్తువులపై పనిచేస్తాయి, ఒకే వస్తువుపై ఒకదానికొకటి రద్దు కావు.",
            "locked_terms": ["Newton's Third Law", "Action-Reaction", "interacting bodies"]
        },
        {
            "segment_index": 5,
            "text": "రాకెట్ ఎగ్జాస్ట్ వాయువులను F బలంతో క్రిందికి నెట్టినప్పుడు, ఆ తప్పించుకునే వాయువులు రాకెట్ శరీరంపై సమానమైన పైకి థ్రస్ట్ బలం -F ను ప్రయోగిస్తాయి, ఇది దానిని అంతరిక్షం వైపు త్వరణం చేస్తుంది.",
            "locked_terms": ["thrust force", "F", "-F", "rocket"]
        }
    ],
    "hi": [
        {
            "segment_index": 1,
            "text": "शास्त्रीय यांत्रिकी (Classical Mechanics) पर हमारी भौतिक विज्ञान कक्षा में आपका स्वागत है। आज हम सर आइजैक न्यूटन के तीन मूलभूत गति के नियमों (Laws of Motion) को समझेंगे।",
            "locked_terms": ["Classical Mechanics", "Laws of Motion", "Sir Isaac Newton"]
        },
        {
            "segment_index": 2,
            "text": "न्यूटन का पहला नियम, जिसे जड़त्व का नियम (Law of Inertia) भी कहा जाता है, बताता है कि कोई वस्तु तब तक विरामावस्था या एकसमान गति में रहती है जब तक कि उस पर कोई बाहरी बल (net force) न लगाया जाए।",
            "locked_terms": ["Law of Inertia", "net force", "uniform motion"]
        },
        {
            "segment_index": 3,
            "text": "न्यूटन का दूसरा नियम बल (Force), द्रव्यमान (Mass) और त्वरण (Acceleration) के बीच गणितीय संबंध स्थापित करता है। विशेष रूप से, कुल बल = द्रव्यमान × त्वरण, अर्थात F = m * a.",
            "locked_terms": ["Force", "Mass", "Acceleration", "F = m * a"]
        },
        {
            "segment_index": 4,
            "text": "अब न्यूटन के तीसरे नियम पर विचार करें: प्रत्येक क्रिया के बराबर और विपरीत प्रतिक्रिया होती है (Action-Reaction)। महत्वपूर्ण रूप से, ये युग्मित बल दो अलग-अलग परस्पर क्रिया करने वाले निकायों पर कार्य करते हैं।",
            "locked_terms": ["Newton's Third Law", "Action-Reaction", "interacting bodies"]
        },
        {
            "segment_index": 5,
            "text": "जब एक रॉकेट F बल के साथ नीचे की ओर गैसें निष्कासित करता है, तो वे गैसें रॉकेट पर समान ऊपर की ओर प्रणोद बल -F लगाती हैं, जिससे वह अंतरिक्ष की ओर त्वरित होता है।",
            "locked_terms": ["thrust force", "F", "-F", "rocket"]
        }
    ]
}

def format_timestamp_vtt(seconds: float) -> str:
    hrs = int(seconds // 3600)
    mins = int((seconds % 3600) // 60)
    secs = int(seconds % 60)
    millis = int((seconds - int(seconds)) * 1000)
    return f"{hrs:02d}:{mins:02d}:{secs:02d}.{millis:03d}"

def format_timestamp_srt(seconds: float) -> str:
    hrs = int(seconds // 3600)
    mins = int((seconds % 3600) // 60)
    secs = int(seconds % 60)
    millis = int((seconds - int(seconds)) * 1000)
    return f"{hrs:02d}:{mins:02d}:{secs:02d},{millis:03d}"

def generate_webvtt(segments: List[Dict[str, Any]]) -> str:
    lines = ["WEBVTT", ""]
    for seg in segments:
        start = format_timestamp_vtt(seg["start_time"])
        end = format_timestamp_vtt(seg["end_time"])
        lines.append(f"{seg['segment_index']}")
        lines.append(f"{start} --> {end}")
        lines.append(seg["text"])
        lines.append("")
    return "\n".join(lines)

def generate_srt(segments: List[Dict[str, Any]]) -> str:
    lines = []
    for seg in segments:
        start = format_timestamp_srt(seg["start_time"])
        end = format_timestamp_srt(seg["end_time"])
        lines.append(f"{seg['segment_index']}")
        lines.append(f"{start} --> {end}")
        lines.append(seg["text"])
        lines.append("")
    return "\n".join(lines)

class IndicTransMockProvider(BaseTranslationProvider):
    async def translate_text(
        self,
        text: str,
        source_lang: str,
        target_lang: str,
        locked_terms: Optional[List[str]] = None
    ) -> Dict[str, Any]:
        await asyncio.sleep(0.1)
        translated = text
        if target_lang == "te":
            translated = f"[తెలుగు అనువాదం]: {text}"
        elif target_lang == "hi":
            translated = f"[हिंदी अनुवाद]: {text}"
        return {
            "translated_text": translated,
            "source_language": source_lang,
            "target_language": target_lang,
            "locked_terms": locked_terms or [],
            "confidence": 0.94
        }

    async def translate_segments(
        self,
        segments: List[Dict[str, Any]],
        source_lang: str,
        target_lang: str
    ) -> List[Dict[str, Any]]:
        await asyncio.sleep(0.3)
        mock_list = MOCK_TRANSLATIONS.get(target_lang, [])
        result = []
        for i, seg in enumerate(segments):
            if i < len(mock_list):
                result.append({
                    "segment_index": seg["segment_index"],
                    "start_time": seg["start_time"],
                    "end_time": seg["end_time"],
                    "text": mock_list[i]["text"],
                    "speaker": seg.get("speaker", "Teacher"),
                    "confidence": 0.95,
                    "locked_terms": mock_list[i]["locked_terms"]
                })
            else:
                result.append({
                    "segment_index": seg["segment_index"],
                    "start_time": seg["start_time"],
                    "end_time": seg["end_time"],
                    "text": f"[{target_lang}] {seg['text']}",
                    "speaker": seg.get("speaker", "Teacher"),
                    "confidence": 0.88,
                    "locked_terms": []
                })
        return result

class BhashiniTranslationProvider(BaseTranslationProvider):
    async def translate_text(self, text: str, source_lang: str, target_lang: str, locked_terms: Optional[List[str]] = None) -> Dict[str, Any]:
        mock = IndicTransMockProvider()
        return await mock.translate_text(text, source_lang, target_lang, locked_terms)

    async def translate_segments(self, segments: List[Dict[str, Any]], source_lang: str, target_lang: str) -> List[Dict[str, Any]]:
        mock = IndicTransMockProvider()
        return await mock.translate_segments(segments, source_lang, target_lang)

def get_translation_provider() -> BaseTranslationProvider:
    if settings.MOCK_PROVIDERS:
        return IndicTransMockProvider()
    return BhashiniTranslationProvider()
