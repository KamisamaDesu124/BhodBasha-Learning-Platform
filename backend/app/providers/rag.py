import asyncio
from typing import Dict, Any, List
from backend.app.providers.base import BaseRAGProvider

NEWTONS_LAWS_EXTRACTED_KNOWLEDGE = {
    "topics": [
        {
            "name": "Laws of Motion & Classical Mechanics",
            "description": "Foundational principles governing macroscopic motion, force interactions, and inertia formulated by Isaac Newton.",
            "order_index": 1,
            "confidence": 0.98
        }
    ],
    "concepts": [
        {
            "name": "Inertia and Newton's First Law",
            "summary_en": "An object remains at rest or moves at a constant velocity unless acted upon by a net external force.",
            "summary_te": "నికర బాహ్య బలం పనిచేయనంత వరకు వస్తువు నిశ్చల స్థితిలో లేదా స్థిర వేగంతో సరళ రేఖలో కొనసాగుతుంది (జడత్వ నియమం).",
            "summary_hi": "कोई वस्तु तब तक अपनी विरामावस्था या सरल रेखा में एकसमान गति की अवस्था में रहती है जब तक कि उस पर कोई बाहरी असंतुलित बल न लगे।",
            "key_formula": "ΣF = 0 => dv/dt = 0",
            "si_unit": "Inertia has no separate unit; proportional to mass (kg)",
            "source_chunk_ref": "Segment 2 [14.5s - 32.0s]",
            "confidence": 0.97,
            "competency_code": "PHY-NEWTON-01",
            "cards": [
                {
                    "title_en": "Concept: Inertia & Equilibrium",
                    "title_te": "భావన: జడత్వం మరియు సమతాస్థితి",
                    "title_hi": "अवधारणा: जड़त्व और संतुलन",
                    "content_en": "Mass is the qualitative measure of inertia. A heavier body resists change in velocity more than a lighter one.",
                    "content_te": "ద్రవ్యరాశి జడత్వానికి కొలమానం. బరువైన వస్తువు తేలికపాటి వస్తువు కంటే వేగ మార్పును ఎక్కువగా నిరోధిస్తుంది.",
                    "content_hi": "द्रव्यमान जड़त्व का गुणात्मक माप है। भारी वस्तु हल्की वस्तु की तुलना में वेग परिवर्तन का अधिक विरोध करती है।",
                    "formula": "F_net = 0",
                    "example": "A passenger jolts forward when a moving bus brakes suddenly.",
                    "misconception_warning": "Inertia is not a force; it is a property of matter."
                }
            ]
        },
        {
            "name": "Newton's Second Law & Momentum",
            "summary_en": "The rate of change of momentum of a body is directly proportional to the applied force: F = m * a.",
            "summary_te": "వస్తువు యొక్క ద్రవ్యవేగ మార్పు రేటు ప్రయోగించిన బలానికి ప్రత్యక్ష అనుపాతంలో ఉంటుంది: F = m * a.",
            "summary_hi": "किसी वस्तु के संवेग परिवर्तन की दर उस पर लगाए गए बल के समानुपाती होती है: F = m * a.",
            "key_formula": "F = m * a",
            "si_unit": "Newton (N) = kg·m/s²",
            "source_chunk_ref": "Segment 3 [32.0s - 54.0s]",
            "confidence": 0.99,
            "competency_code": "PHY-NEWTON-02",
            "cards": [
                {
                    "title_en": "Concept: Force, Mass & Acceleration",
                    "title_te": "భావన: బలం, ద్రవ్యరాశి మరియు త్వరణం",
                    "title_hi": "अवधारणा: बल, द्रव्यमान और त्वरण",
                    "content_en": "Acceleration is directly proportional to net force and inversely proportional to mass.",
                    "content_te": "త్వరణం నికర బలానికి అనులోమానుపాతంలో మరియు ద్రవ్యరాశికి విలోమానుపాతంలో ఉంటుంది.",
                    "content_hi": "त्वरण कुल बल के सीधे आनुपातिक और द्रव्यमान के व्युत्क्रमानुपाती होता है।",
                    "formula": "a = F_net / m",
                    "example": "Pushing an empty cart vs a cart filled with 50 kg of bricks.",
                    "misconception_warning": "Force causes acceleration, not constant velocity."
                }
            ]
        },
        {
            "name": "Newton's Third Law & Action-Reaction Pairs",
            "summary_en": "For every action force exerted on object B by object A, object B exerts an equal and opposite reaction force on object A.",
            "summary_te": "వస్తువు A వస్తువు B పై ప్రయోగించే ప్రతి చర్య బలానికి, వస్తువు B వస్తువు A పై సమానమైన మరియు వ్యతిరేక ప్రతిచర్య బలాన్ని ప్రయోగిస్తుంది.",
            "summary_hi": "प्रत्येक क्रिया के लिए सदैव बराबर तथा विपरीत दिशा में प्रतिक्रिया होती है।",
            "key_formula": "F_AB = -F_BA",
            "si_unit": "Newton (N)",
            "source_chunk_ref": "Segment 4 & 5 [54.0s - 105.0s]",
            "confidence": 0.96,
            "competency_code": "PHY-NEWTON-03",
            "cards": [
                {
                    "title_en": "Concept: Action-Reaction Force Pairs",
                    "title_te": "భావన: చర్య - ప్రతిచర్య బలాల జంట",
                    "title_hi": "अवधारणा: क्रिया-प्रतिक्रिया बल युग्म",
                    "content_en": "Action and Reaction forces ALWAYS act on different objects and therefore NEVER cancel each other out.",
                    "content_te": "చర్య మరియు ప్రతిచర్య బలాలు ఎల్లప్పుడూ వేర్వేరు వస్తువులపై పనిచేస్తాయి, అందువల్ల అవి ఎప్పటికీ ఒకదానికొకటి రద్దు కావు.",
                    "content_hi": "क्रिया और प्रतिक्रिया बल हमेशा अलग-अलग वस्तुओं पर कार्य करते हैं, इसलिए वे कभी एक-दूसरे को रद्द नहीं करते।",
                    "formula": "F_12 = -F_21",
                    "example": "Rocket propulsion: gas expelled downward, rocket pushed upward.",
                    "misconception_warning": "Action-reaction forces do NOT act on the same body."
                }
            ]
        }
    ],
    "competencies": [
        {
            "code": "PHY-NEWTON-01",
            "name": "Applying Newton's First Law and Inertia",
            "description": "Ability to identify equilibrium states, distinguish balanced vs unbalanced forces, and analyze inertial frames.",
            "benchmark_mastery": 80.0
        },
        {
            "code": "PHY-NEWTON-02",
            "name": "Solving Mechanics Problems with F = m*a",
            "description": "Ability to compute force, mass, and acceleration given kinetic scenarios and calculate net vectors.",
            "benchmark_mastery": 80.0
        },
        {
            "code": "PHY-NEWTON-03",
            "name": "Analyzing Action-Reaction Pairs and Interactions",
            "description": "Ability to construct free-body diagrams, identify dual interacting bodies, and resolve rocket thrust scenarios.",
            "benchmark_mastery": 80.0
        }
    ],
    "questions": [
        {
            "question_type": "concept_mcq",
            "difficulty": "medium",
            "competency_code": "PHY-NEWTON-03",
            "concept_name": "Newton's Third Law & Action-Reaction Pairs",
            "question_text_en": "According to Newton's Third Law, why do action and reaction forces not cancel each other out to produce zero acceleration?",
            "question_text_te": "న్యూటన్ మూడవ నియమం ప్రకారం, చర్య మరియు ప్రతిచర్య బలాలు శూన్య త్వరణాన్ని ఉత్పత్తి చేయడానికి ఒకదానికొకటి ఎందుకు రద్దు కావు?",
            "question_text_hi": "न्यूटन के तीसरे नियम के अनुसार, क्रिया और प्रतिक्रिया बल शून्य त्वरण उत्पन्न करने के लिए एक-दूसरे को रद्द क्यों नहीं करते?",
            "explanation_en": "Action and reaction forces act simultaneously on TWO DIFFERENT interacting bodies, so they cannot cancel each other out on any single body.",
            "explanation_te": "చర్య మరియు ప్రతిచర్య బలాలు ఏకకాలంలో రెండు వేర్వేరు వస్తువులపై పనిచేస్తాయి, కాబట్టి అవి ఒకే వస్తువుపై రద్దు కావు.",
            "explanation_hi": "क्रिया और प्रतिक्रिया बल एक साथ दो अलग-अलग परस्पर क्रिया करने वाले निकायों पर कार्य करते हैं, इसलिए वे किसी एक निकाय पर रद्द नहीं हो सकते।",
            "source_citation": "Lecture Segment 4 [54.0s - 78.0s]: 'these paired forces act on two different interacting bodies, never cancelling each other out on a single object.'",
            "options": [
                {
                    "option_label": "A",
                    "text_en": "Because they act on two different objects simultaneously",
                    "text_te": "ఎందుకంటే అవి ఒకేసారి రెండు వేర్వేరు వస్తువులపై పనిచేస్తాయి",
                    "text_hi": "क्योंकि वे एक साथ दो अलग-अलग वस्तुओं पर कार्य करते हैं",
                    "is_correct": True,
                    "misconception_tag": None
                },
                {
                    "option_label": "B",
                    "text_en": "Because the action force is always larger than the reaction force",
                    "text_te": "ఎందుకంటే చర్య బలం ఎల్లప్పుడూ ప్రతిచర్య బలం కంటే ఎక్కువగా ఉంటుంది",
                    "text_hi": "क्योंकि क्रिया बल हमेशा प्रतिक्रिया बल से बड़ा होता है",
                    "is_correct": False,
                    "misconception_tag": "action_force_greater_than_reaction"
                },
                {
                    "option_label": "C",
                    "text_en": "Because reaction force occurs after a slight time delay",
                    "text_te": "ఎందుకంటే ప్రతిచర్య బలం కొద్దిగా సమయం ఆలస్యం తర్వాత జరుగుతుంది",
                    "text_hi": "क्योंकि प्रतिक्रिया बल थोड़े समय के अंतराल के बाद होता है",
                    "is_correct": False,
                    "misconception_tag": "reaction_has_time_delay"
                },
                {
                    "option_label": "D",
                    "text_en": "Because friction prevents them from cancelling",
                    "text_te": "ఎందుకంటే ఘర్షణ వాటిని రద్దు చేయకుండా నిరోధిస్తుంది",
                    "text_hi": "क्योंकि घर्षण उन्हें रद्द होने से रोकता है",
                    "is_correct": False,
                    "misconception_tag": "friction_cancels_reaction"
                }
            ]
        },
        {
            "question_type": "numerical_mcq",
            "difficulty": "medium",
            "competency_code": "PHY-NEWTON-02",
            "concept_name": "Newton's Second Law & Momentum",
            "question_text_en": "A 5 kg STEM experiment cart accelerates at 4 m/s² on a frictionless track. What net force was applied?",
            "question_text_te": "ఘర్షణ లేని ట్రాక్ పై 5 kg ద్రవ్యరాశి గల ప్రయోగ కార్ట్ 4 m/s² త్వరణంతో కదులుతోంది. దానిపై ప్రయోగించిన నికర బలం ఎంత?",
            "question_text_hi": "घर्षण रहित ट्रैक पर 5 किग्रा का प्रयोग कार्ट 4 मी/से² के त्वरण से गति करता है। कुल कितना बल लगाया गया?",
            "explanation_en": "Using Newton's Second Law F = m * a: F = 5 kg * 4 m/s² = 20 N.",
            "explanation_te": "న్యూటన్ రెండవ నియమం F = m * a ప్రకారం: F = 5 kg * 4 m/s² = 20 N.",
            "explanation_hi": "न्यूटन के दूसरे नियम F = m * a का उपयोग करते हुए: F = 5 किग्रा * 4 मी/से² = 20 N.",
            "source_citation": "Lecture Segment 3 [32.0s - 54.0s]: 'net force equals mass multiplied by acceleration, or F = m * a.'",
            "options": [
                {
                    "option_label": "A",
                    "text_en": "20 N (Newtons)",
                    "text_te": "20 N (న్యూటన్లు)",
                    "text_hi": "20 N (न्यूटन)",
                    "is_correct": True,
                    "misconception_tag": None
                },
                {
                    "option_label": "B",
                    "text_en": "1.25 N",
                    "text_te": "1.25 N",
                    "text_hi": "1.25 N",
                    "is_correct": False,
                    "misconception_tag": "divided_mass_by_accel"
                },
                {
                    "option_label": "C",
                    "text_en": "9 N",
                    "text_te": "9 N",
                    "text_hi": "9 N",
                    "is_correct": False,
                    "misconception_tag": "added_mass_and_accel"
                },
                {
                    "option_label": "D",
                    "text_en": "80 N",
                    "text_te": "80 N",
                    "text_hi": "80 N",
                    "is_correct": False,
                    "misconception_tag": "multiplied_by_gravity"
                }
            ]
        },
        {
            "question_type": "scenario_mcq",
            "difficulty": "easy",
            "competency_code": "PHY-NEWTON-01",
            "concept_name": "Inertia and Newton's First Law",
            "question_text_en": "A spacecraft traveling in deep space turns off its thrusters. According to Newton's First Law, what happens to its motion?",
            "question_text_te": "అంతరిక్షంలో ప్రయాణిస్తున్న అంతరిక్ష నౌక తన ఇంజిన్‌లను ఆపివేస్తుంది. న్యూటన్ మొదటి నియమం ప్రకారం, దాని కదలిక ఏమవుతుంది?",
            "question_text_hi": "अंतरिक्ष में यात्रा कर रहा एक अंतरिक्ष यान अपने थ्रस्टर्स बंद कर देता है। न्यूटन के पहले नियम के अनुसार, उसकी गति का क्या होगा?",
            "explanation_en": "With zero external net force (no friction or gravity in deep space), the spacecraft maintains constant speed in a straight line indefinitely.",
            "explanation_te": "శూన్య బాహ్య నికర బలంతో, అంతరిక్ష నౌక సరళ రేఖలో స్థిర వేగంతో నిరంతరం ప్రయాణిస్తుంది.",
            "explanation_hi": "शून्य बाहरी कुल बल के साथ, अंतरिक्ष यान एक सीधी रेखा में स्थिर गति से निरंतर चलता रहेगा।",
            "source_citation": "Lecture Segment 2 [14.5s - 32.0s]: 'an object remains at rest or continues in uniform motion unless acted upon by an external net force.'",
            "options": [
                {
                    "option_label": "A",
                    "text_en": "It continues moving with constant velocity in a straight line",
                    "text_te": "ఇది సరళ రేఖలో స్థిర వేగంతో కదులుతూనే ఉంటుంది",
                    "text_hi": "यह एक सीधी रेखा में स्थिर वेग से गति करता रहेगा",
                    "is_correct": True,
                    "misconception_tag": None
                },
                {
                    "option_label": "B",
                    "text_en": "It immediately comes to a complete stop",
                    "text_te": "ఇది వెంటనే పూర్తిగా ఆగిపోతుంది",
                    "text_hi": "यह तुरंत पूरी तरह से रुक जाएगा",
                    "is_correct": False,
                    "misconception_tag": "motion_requires_continuous_force"
                },
                {
                    "option_label": "C",
                    "text_en": "It slowly decelerates over 10 seconds",
                    "text_te": "ఇది నెమ్మదిగా 10 సెకన్లలో వేగాన్ని తగ్గిస్తుంది",
                    "text_hi": "यह 10 सेकंड में धीरे-धीरे धीमा हो जाता है",
                    "is_correct": False,
                    "misconception_tag": "spontaneous_decay_of_velocity"
                },
                {
                    "option_label": "D",
                    "text_en": "It begins orbiting in a circle",
                    "text_te": "ఇది వృత్తాకారంలో తిరగడం ప్రారంభిస్తుంది",
                    "text_hi": "यह एक वृत्त में परिक्रमा करने लगता है",
                    "is_correct": False,
                    "misconception_tag": "circular_default_motion"
                }
            ]
        }
    ]
}

class STEMRAGMockProvider(BaseRAGProvider):
    async def extract_concepts_and_competencies(self, transcript_text: str) -> Dict[str, Any]:
        await asyncio.sleep(0.3)
        return {
            "topics": NEWTONS_LAWS_EXTRACTED_KNOWLEDGE["topics"],
            "concepts": NEWTONS_LAWS_EXTRACTED_KNOWLEDGE["concepts"],
            "competencies": NEWTONS_LAWS_EXTRACTED_KNOWLEDGE["competencies"]
        }

    async def generate_assessment_questions(
        self,
        concepts: List[Dict[str, Any]],
        source_segments: List[Dict[str, Any]]
    ) -> List[Dict[str, Any]]:
        await asyncio.sleep(0.3)
        return NEWTONS_LAWS_EXTRACTED_KNOWLEDGE["questions"]

def get_rag_provider() -> BaseRAGProvider:
    return STEMRAGMockProvider()
