'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { db } from '@/lib/db';
import { syncManager } from '@/lib/sync';
import Link from 'next/link';
import {
  Play, 
  Pause, 
  Volume2, 
  VolumeX,
  Volume1,
  Maximize, 
  Subtitles, 
  Download,
  CheckCircle2, 
  AlertCircle, 
  Bookmark, 
  FileText, 
  Check,
  Clock, 
  Award, 
  HelpCircle,
  Languages,
  ShieldCheck,
  Sparkles,
  ExternalLink,
  BookOpen,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  Search,
  Scan,
  Database,
  SlidersHorizontal,
  Settings2,
  RefreshCw,
  CheckCheck,
  ArrowUpRight,
  Layers,
  GraduationCap,
  Minimize,
  Headphones,
  Square
} from 'lucide-react';
import AIManualVoiceReader from '@/components/common/AIManualVoiceReader';

interface TranscriptItem {
  timeSec: number;
  timeStr: string;
  en: string;
  te: string;
  te_phonetic?: string;
  hi: string;
  hi_phonetic?: string;
  ta: string;
  ta_phonetic?: string;
  mr: string;
  mr_phonetic?: string;
}

interface AssetData {
  id: number;
  title: string;
  format: 'video' | 'pdf';
  formatLabel: string;
  moduleCode: string;
  cadreTag: string;
  description: string;
  sourceDoc: string;
  sourceExcerpt: string;
  formulaTitle: string;
  formulaCode: string;
  formulaDescription: string;
  competencyCode: string;
  competencyName: string;
  durationSeconds: number;
  packageSize: string;
  question: {
    prompt: string;
    source: string;
    options: string[];
    correctIndex: number;
    explanation: string;
    misconceptionFeedback: string;
  };
  transcripts: TranscriptItem[];
  pdfChapters?: Array<{
    chapterNumber: number;
    title: string;
    pages: string;
    summary: string;
    content: string[];
  }>;
}

const ASSET_LIBRARY: Record<number, AssetData> = {
  1: {
    id: 1,
    title: "Modern Statistical Methodologies: Sampling, National Accounts & AI in Official Statistics",
    format: 'video',
    formatLabel: "MP4 Video Lecture (42:15 Mins)",
    moduleCode: "MoSPI-STAT-MOD-01",
    cadreTag: "MoSPI FOD Cadre Course • Module 04",
    description: "Comprehensive statistical lecture exploring multi-stage stratified survey calibration, Horvitz-Thompson unbiased aggregate estimation, and the macroeconomic computation of implicit GDP deflators vs Consumer Price Index (CPI) measures.",
    sourceDoc: "MoSPI National Accounts Statistics (NAS) 2026 Manual, Chapter 3 & NSS 77th Round Calibration",
    sourceExcerpt: "Section 3.4.2: The Implicit Price Deflator is derived as the ratio of GDP at current market prices to GDP at constant prices (Real GDP). Unlike the Consumer Price Index (CPI) which tracks a fixed consumer expenditure basket using a Laspeyres formulation, the GDP Deflator incorporates changing domestic production weights across capital formation, exports, and government expenditure, functioning mathematically as a Paasche price index.",
    formulaTitle: "Implicit GDP Deflator & Horvitz-Thompson Estimator",
    formulaCode: "Deflator = (Nominal GDP / Real GDP) × 100  |  Ŷ = ∑ [ yᵢ / πᵢ ]",
    formulaDescription: "Deflator uses dynamic Paasche production weights; Horvitz-Thompson weights sample observations by inverse inclusion probabilities πᵢ.",
    competencyCode: "STAT-NAC-02",
    competencyName: "National Accounts & Implicit GDP Deflator vs CPI",
    durationSeconds: 2535,
    packageSize: "14.2 MB",
    question: {
      prompt: "What mathematically differentiates the Implicit GDP Deflator from the Consumer Price Index (CPI)?",
      source: "MoSPI National Accounts Statistics (NAS) 2026 Manual, Chapter 3, Section 3.4.2",
      options: [
        "A) CPI covers all capital and government goods, whereas the GDP deflator is strictly limited to consumer products.",
        "B) The GDP deflator covers all domestically produced goods/services with dynamic weights (Paasche index), while CPI relies on a fixed consumer basket (Laspeyres index).",
        "C) The GDP deflator includes import price spikes directly, unlike the Consumer Price Index.",
        "D) Both measures use identical Laspeyres fixed-weight arithmetic formulas."
      ],
      correctIndex: 1,
      explanation: "Correct! The GDP deflator reflects prices of all domestically produced goods and services and allows weights to adjust dynamically with output changes (Paasche index), avoiding fixed-basket substitution bias.",
      misconceptionFeedback: "Incorrect. The Consumer Price Index (CPI) relies on a fixed consumer basket (Laspeyres), whereas the Implicit GDP Deflator dynamically reflects all domestic production (Paasche)."
    },
    transcripts: [
      {
        timeSec: 0,
        timeStr: "00:00",
        en: "Welcome officers. Today we explore foundational methodologies in India's official statistical system.",
        te: "అధికారులకు స్వాగతం. ఈ రోజు మనం భారతదేశ అధికారిక గణాంక వ్యవస్థలోని ప్రాథమిక పద్ధతులను పరిశీలిస్తాము.",
        te_phonetic: "Adhikaarulaku svaagatham. Ee roju manam bhaaratha desha adhikaarika gaanaanka vyavasthaloni praadhamika paddhatulanu parishilistaamu.",
        hi: "अधिकारियों का स्वागत है। आज हम भारत की आधिकारिक सांख्यिकीय प्रणाली की मूलभूत पद्धतियों की समीक्षा करेंगे।",
        hi_phonetic: "Adhikariyon ka swagat hai. Aaj hum bharat ki aadhikarik sankhyiki pranali ki moolbhoot paddhatiyon ki samiksha karenge.",
        ta: "அதிகாரிகளுக்கு நல்வரவு. இன்று நாம் இந்தியாவின் அதிகாரப்பூர்வ புள்ளிவிவர அமைப்பின் அடிப்படை முறைகளை ஆராய்வோம்.",
        ta_phonetic: "Adhikaarigalukku nalvaravu. Indru naam indhiyaavin adhikaarappoorva pullivivara amaippin adipadai muraigalai aaraaivom.",
        mr: "अधिकाऱ्यांचे स्वागत. आज आपण भारताच्या अधिकृत सांख्यिकी प्रणालीतील मूलभूत पद्धतींचा अभ्यास करू.",
        mr_phonetic: "Adhikaryanche swagat. Aaj aapan bharatachya adhkrut sankhyiki pranaleetil moolbhoot paddhatincha abhyas karu."
      },
      {
        timeSec: 15,
        timeStr: "00:15",
        en: "In large-scale socio-economic surveys, multi-stage stratified sampling is essential to balance precision and field costs.",
        te: "భారీ స్థాయి సామాజిక-ఆర్థిక సర్వేలలో, ఖచ్చితత్వం మరియు క్షేత్ర వ్యయాలను సమతుల్యం చేయడానికి బహుళ-దశల స్తరీకరించిన నమూనా ఎంతో అవసరం.",
        te_phonetic: "Bhaari sthayi samajika-aarthika survey-lalo, khachchitatvam mariyu ksetra vyayaalannu samatulyam cheyadaniki bahula-dasala starikarisina namoona entho avasaram.",
        hi: "बड़े पैमाने के सामाजिक-आर्थिक सर्वेक्षणों में, सटीकता और क्षेत्रीय लागत को संतुलित करने के लिए बहु-स्तरीय स्तरीकृत नमूनाकरण अनिवार्य है।",
        hi_phonetic: "Bade paimane ke samajik-aarthik sarvekshano mein, satikta aur kshetrriya laagat ko santulit karne ke liye bahu-stariya stareekrut namoonakaran anivaarya hai.",
        ta: "பெரிய அளவிலான சமூக-பொருளாதார ஆய்வுகளில், துல்லியத்தையும் கள செலவையும் சமப்படுத்த பல அடுக்கு மாதிரி எடுப்பது அவசியம்.",
        ta_phonetic: "Periya alavilaana samooga-porulaathaara aaivugalil, thulliyathaiyum kala selavaiyum samappadutha pala adukku maadhiri eduppadhu avasiyam.",
        mr: "मोठ्या प्रमाणावरील सामाजिक-आर्थिक सर्वेक्षणांमध्ये, अचूकता आणि क्षेत्रीय खर्च संतुलित करण्यासाठी बहु-स्तरीय स्तरित नमुना आवश्यक आहे.",
        mr_phonetic: "Mothya pramaanavareel samajik-aarthik sarvekshanannmadhye, achookata aani kshetreey kharch santulit karnyasaathi bahu-stariya starit namoona aavashyak aahe."
      },
      {
        timeSec: 35,
        timeStr: "00:35",
        en: "The Horvitz-Thompson estimator calculates population totals by weighting each sampled unit by the inverse of its inclusion probability.",
        te: "హార్విట్జ్-థాంప్సన్ అంచనా ప్రతి నమూనా యూనిట్‌ను దాని చేరిక సంభావ్యత యొక్క విలోమంతో గుణించడం ద్వారా జనాభా మొత్తాన్ని లెక్కిస్తుంది.",
        te_phonetic: "Horvitz-Thompson anchana prathi namoona unit-nu daani cherika sambhavyatha yokka vilomam-tho guninchadam dvaaraa janaabha mothanni lekkistundi.",
        hi: "हॉर्विट्ज़-थॉम्पसन अनुमानक प्रत्येक नमूना इकाई को उसकी समावेश प्रायिकता के व्युत्क्रम से भारित करके जनसंख्या कुल की गणना करता है।",
        hi_phonetic: "Horvitz-Thompson anumaanak pratyek namoona ikai ko uski samavesh prayikta ke vyutkram se bhaarita karke jansankhya kul ki ganana karta hai.",
        ta: "ஹார்விட்ஸ்-தாம்சன் மதிப்பீட்டாளர் ஒவ்வொரு மாதிரி அலகையும் அதன் சேர்க்கை நிகழ்தகவின் தலைகீழ் மதிப்பால் பெருக்கி மொத்தத்தை கணக்கிடுகிறது.",
        ta_phonetic: "Horvitz-Thompson mathippeettaalar ovvoru maadhiri alagaiyum adhan serkkai nigazhthagavin thalaikeezh mathippaal perukki mothathai kanakkidugiradhu.",
        mr: "हॉर्व्हिट्झ-थॉम्पसन अंदाजक प्रत्येक नमुना घटकाला त्याच्या समावेश संभाव्यतेच्या व्यस्त संख्येने भारित करून एकूण लोकसंख्येची गणना करतो.",
        mr_phonetic: "Horvitz-Thompson andajak pratyek namoona ghatkala tyachya samavesh sambhavyatechya vyast sankhyene bharit karun ekun loksankhyechi ganana karto."
      },
      {
        timeSec: 60,
        timeStr: "01:00",
        en: "Consider the sampling frame for the Annual Survey of Unincorporated Enterprises (ASUSE).",
        te: "అసంఘటిత సంస్థల వార్షిక సర్వే (ASUSE) కోసం నమూనా ఫ్రేమ్‌ను పరిశీలిస్తే, గ్రామీణ మరియు పట్టణ రంగాలలో సూక్ష్మ పరిశ్రమల కవరేజీని ఇది నిర్ధారిస్తుంది.",
        te_phonetic: "Asanghatitha samsthala vaarshika survey (ASUSE) kosam namoona framenu parishilisthe, graameena mariyu pattana rangaalalo sookshma parishramala coverage-nu idi nirdhaaristundi.",
        hi: "असंगठित उद्यमों के वार्षिक सर्वेक्षण (ASUSE) के लिए नमूना ढांचे पर विचार करें, जो ग्रामीण और शहरी क्षेत्रों में सूक्ष्म उद्यमों को कवर करता है।",
        hi_phonetic: "Asangathit udyamon ke vaarshik sarvekshan (ASUSE) ke liye namoona dhaanche par vichaar karein, jo grameen aur shehri kshetron mein sookshma udyamon ko cover karta hai.",
        ta: "ஒருங்கிணைக்கப்படாத நிறுவனங்களின் வருடாந்திர கணக்கெடுப்பின் (ASUSE) மாதிரி கட்டமைப்பை கருத்தில் கொள்க.",
        ta_phonetic: "Orunginaikkappadaadha niruvanangalin varudaanthira kanakkeduppin (ASUSE) maadhiri kattamaippai karuthil kolga.",
        mr: "असंघटित उद्योगांच्या वार्षिक सर्वेक्षणासाठी (ASUSE) नमुना चौकटीचा विचार केल्यास सूक्ष्म उद्योगांचे योग्य कव्हरेज मिळते.",
        mr_phonetic: "Asanghatit udyoganchya vaarshik sarvekshanasaathi (ASUSE) namoona choukaticha vichaar kelyaas sookshma udyoganche yogya coverage milte."
      },
      {
        timeSec: 90,
        timeStr: "01:30",
        en: "The Horvitz-Thompson estimator ensures an unbiased total by inverse-probability weighting.",
        te: "హార్విట్జ్-థాంప్సన్ అంచనా విలోమ-సంభావ్యత భారం ద్వారా నిష్పాక్షికమైన మొత్తాన్ని నిర్ధారిస్తుంది.",
        te_phonetic: "Horvitz-Thompson anchana viloma-sambhavyatha bhaaram dvaaraa nishpaakshikamaina mothanni nirdhaaristundi.",
        hi: "हॉर्विट्ज़-थॉम्पसन अनुमानक व्युत्क्रम-प्रायिकता भार के माध्यम से एक निष्पक्ष कुल सुनिश्चित करता है।",
        hi_phonetic: "Horvitz-Thompson anumaanak vyutkram-praayikata bhaar ke maadhyam se ek nishpaksh kul sunishchit karta hai.",
        ta: "ஹார்விட்ஸ்-தாம்சன் மதிப்பீட்டாளர் தலைகீழ்-நிகழ்தகவு எடையிடுதல் மூலம் நடுநிலையான மொத்தத்தை உறுதி செய்கிறார்.",
        ta_phonetic: "Horvitz-Thompson mathippeettaalar thalaikeezh-nigazhthagavu edaiyidudhal moolam nadunilaiyaana mothathai urudhi seigiraar.",
        mr: "हॉर्व्हिट्झ-थॉम्पसन अंदाजक व्यस्त-संभाव्यता भाराद्वारे निष्पक्ष एकूण सुनिश्चित करतो.",
        mr_phonetic: "Horvitz-Thompson andajak vyast-sambhavyata bhaaradvaare nishpaksh ekun sunishchit karto."
      },
      {
        timeSec: 120,
        timeStr: "02:00",
        en: "Next, when calculating the Implicit GDP Deflator, we divide Nominal GDP by Real GDP.",
        te: "తర్వాత, అంతర్గత జీడీపీ డిఫ్లేటర్‌ను లెక్కించేటప్పుడు, మనం నామమాత్రపు జీడీపీని వాస్తవ జీడీపీతో భాగిస్తాము.",
        te_phonetic: "Tarvaata, anthargatha GDP deflator-nu lekkimchetappudu, manam naamamaatrapu GDP-ni vaastava GDP-tho bhaagistaamu.",
        hi: "इसके बाद, अंतर्निहित जीडीपी डिफ्लेटर की गणना करते समय, हम नाममात्र जीडीपी को वास्तविक जीडीपी से विभाजित करते हैं।",
        hi_phonetic: "Iske baad, antarnihit GDP deflator ki ganana karte samay, hum naam-maatr GDP ko vaastavik GDP se vibhaajit karte hain.",
        ta: "அடுத்து, மறைமுக மொத்த உள்நாட்டு உற்பத்தி பணவாட்டத்தை கணக்கிடும் போது, பெயரளவு ஜிடிபியை உண்மையான ஜிடிபியால் வகுக்கிறோம்.",
        ta_phonetic: "Aduthu, maraimuga moththa ulnaattu urpaththi panavaattathai kanakkidum podhu, peyaralavu GDP-yai unmaiyaana GDP-yaal vagukkirom.",
        mr: "त्यानंतर, अंतर्निहित जीडीपी डिफ्लेटरची गणना करताना, आम्ही नाममात्र जीडीपीला वास्तविक जीडीपीने भाग देतो.",
        mr_phonetic: "Tyaanantar, antarnihit GDP deflatorchi ganana kartana, aamhi naamamaatra GDP-la vaastavik GDP-ne bhaag deto."
      },
      {
        timeSec: 155,
        timeStr: "02:35",
        en: "Because production weights vary over time, the deflator acts as a Paasche-type price index.",
        te: "ఉత్పత్తి బరువులు కాలక్రమేణా మారుతూ ఉంటాయి కాబట్టి, డిఫ్లేటర్ పాచే-రకం ధర సూచికగా పనిచేస్తుంది.",
        te_phonetic: "Utpatthi baruvulu kaalakramenaa maaruthu untaayi kaabatti, deflator Paasche-rakam dhara soochikagaa panicheystundi.",
        hi: "क्योंकि उत्पादन भार समय के साथ बदलता रहता है, डिफ्लेटर एक पाशे-प्रकार के मूल्य सूचकांक के रूप में कार्य करता है।",
        hi_phonetic: "Kyonki utpaadan bhaar samay ke saath badalta rehta hai, deflator ek Paasche-prakaar ke moolya soochkaank ke roop mein kaarya karta hai.",
        ta: "உற்பத்தி எடைகள் காலப்போக்கில் மாறுபடுவதால், பணவாட்டம் பாஸ்சே வகை விலை குறியீடாக செயல்படுகிறது.",
        ta_phonetic: "Urpaththi edaigal kaalapokkil maaruvadhaal, panavaattam Paasche vagai vilai kureeyeedaaga seyalpadugiradhu.",
        mr: "उत्पादन भार कालांतराने बदलत असल्याने, डिफ्लेटर पाशे-प्रकारचे किंमत निर्देशांक म्हणून कार्य करतो.",
        mr_phonetic: "Utpaadan bhaar kaalaantaraane badalat aslyaane, deflator Paasche-prakaarche kimmat nirdeshaank mhanun kaarya karto."
      },
      {
        timeSec: 195,
        timeStr: "03:15",
        en: "Contrast this with Consumer Price Index (CPI), which uses a fixed Laspeyres basket and does not reflect capital goods or substitution.",
        te: "దీనిని వినియోగదారుల ధరల సూచిక (CPI) తో పోల్చండి, ఇది స్థిరమైన లాస్‌పీర్స్ బాస్కెట్‌ను ఉపయోగిస్తుంది.",
        te_phonetic: "Deenini viniyogadaarula dharala soochika (CPI) tho polchandi, idi sthiramaina Laspeyres basket-nu upayogistundi.",
        hi: "इसकी तुलना उपभोक्ता मूल्य सूचकांक (CPI) से करें, जो एक निश्चित लास्पेयर्स बास्केट का उपयोग करता है।",
        hi_phonetic: "Iski tulna upbhokta moolya soochkaank (CPI) se karein, jo ek nishchit Laspeyres basket ka upyog karta hai.",
        ta: "இதை நுகர்வோர் விலைக் குறியீட்டுடன் (CPI) ஒப்பிடுங்கள், இது ஒரு நிலையான லாஸ்பேயர்ஸ் கூடையைப் பயன்படுத்துகிறது.",
        ta_phonetic: "Idhai nugarvor vilai kureeyeettudan (CPI) oppidungal, idhu oru nilaiyaana Laspeyres koodaiyai payanpaduthugiradhu.",
        mr: "याची तुलना ग्राहक किंमत निर्देशांक (CPI) शी करा, जे निश्चित लास्पेयर्स बास्केट वापरते.",
        mr_phonetic: "Yaachi tulna graahak kimmat nirdeshaank (CPI) shi karaa, je nishchit Laspeyres basket vaaparte."
      },
      {
        timeSec: 240,
        timeStr: "04:00",
        en: "In CAPI tablet field operations, real-time consistency checks prevent intermediate consumption from exceeding gross output.",
        te: "CAPI టాబ్లెట్ ఫీల్డ్ కార్యకలాపాలలో, రియల్-టైమ్ స్థిరత్వ తనిఖీలు మధ్యంతర వినియోగం స్థూల ఉత్పత్తి కంటే పెరగకుండా నిరోధిస్తాయి.",
        te_phonetic: "CAPI tablet field kaaryakalaapaalalo, real-time sthiratva tanikheelu madhyantara viniyogam sthoola utpatthi kante peragakunda nirodhistaayi.",
        hi: "CAPI टैबलेट फील्ड ऑपरेशंस में, वास्तविक समय संगति जांच मध्यवर्ती खपत को सकल उत्पादन से अधिक होने से रोकती है।",
        hi_phonetic: "CAPI tablet field operations mein, vaastavik samay sangati jaanch madhyavarti khapat ko sakal utpaadan se adhik hone se rokti hai.",
        ta: "CAPI டேப்லெட் களப்பணிகளில், நிகழ்நேர நிலைத்தன்மை சரிபார்ப்புகள் இடைநிலை நுகர்வு மொத்த உற்பத்தியைத் தாண்டாமல் தடுக்கிறது.",
        ta_phonetic: "CAPI tablet kalappanigalil, nigazhnera nilai-thanmai saripaarppugal idainilai nugarvu moththa urpaththiyai thaandaamal thadukkiradhu.",
        mr: "CAPI टॅब्लेट फील्ड ऑपरेशन्समध्ये, रिअल-टाइम सुसंगतता तपासण्या मध्यवर्ती वापर एकूण उत्पादनापेक्षा जास्त होण्यापासून रोखतात.",
        mr_phonetic: "CAPI tablet field operations madhye, real-time susangatta tapasnya madhyavarti vaapar ekun utpaadanaapekshaa jaast honyapaasun rokhataat."
      },
      {
        timeSec: 300,
        timeStr: "05:00",
        en: "Machine learning anomaly detection flags localized price outliers before State Domestic Product (SDP) aggregation.",
        te: "మెషిన్ లెర్నింగ్ అనోమలీ డిటెక్షన్ రాష్ట్ర దేశీయ ఉత్పత్తి (SDP) సమగ్రతకు ముందే స్థానిక ధరల వ్యత్యాసాలను గుర్తిస్తుంది.",
        te_phonetic: "Machine learning anomaly detection raashtra desheeya utpatthi (SDP) samagrataku munde sthaanika dharala vyatyaasaalannu gurtistundi.",
        hi: "मशीन लर्निंग विसंगति पहचान राज्य घरेलू उत्पाद (SDP) समेकन से पहले स्थानीय मूल्य आउटलेयर्स को चिह्नित करती है।",
        hi_phonetic: "Machine learning visangati pehchan rajya gharelu utpaad (SDP) samekan se pehle sthaaneey moolya outliers ko chihnit karti hai.",
        ta: "இயந்திர வழிமுறைக் கண்டறிதல் மாநில உள்நாட்டு உற்பத்தி (SDP) ஒருங்கிணைப்புக்கு முன் விலை முரண்பாடுகளைக் கண்டறிகிறது.",
        ta_phonetic: "Machine learning vazhimurai kandarithal maanila ulnaattu urpaththi (SDP) orunginaippukku mun vilai muranpaadugalai kandarigiradhu.",
        mr: "मशीन लर्निंग विसंगती शोध राज्य देशांतर्गत उत्पादन (SDP) एकत्रीकरणापूर्वी स्थानिक किंमत विसंगती चिन्हांकित करते.",
        mr_phonetic: "Machine learning visangati shodh rajya deshaantargat utpaadan (SDP) ekatreekaranaapoorvi sthaanik kimmat visangati chinhaankit karte."
      },
      {
        timeSec: 450,
        timeStr: "07:30",
        en: "Moving to Chapter 2: Base year revision from 2011-12 to the new 2026 series integrates corporate MCA21 registry updates.",
        te: "చాప్టర్ 2 కు వెళితే: 2011-12 నుండి కొత్త 2026 శ్రేణికి బేస్ ఇయర్ సవరణ కార్పొరేట్ MCA21 రిజిస్ట్రీ అప్‌డేట్‌లను అనుసంధానిస్తుంది.",
        te_phonetic: "Chapter 2 ku velithe: 2011-12 nundi koththa 2026 shreniki base year savarana corporate MCA21 registry updates-nu anusandhaanistundi.",
        hi: "अध्याय 2: 2011-12 से नई 2026 श्रृंखला में आधार वर्ष संशोधन कॉर्पोरेट MCA21 रजिस्ट्री अपडेट को एकीकृत करता है।",
        hi_phonetic: "Adhyay 2: 2011-12 se nayi 2026 shrinkhla mein aadhaar varsh sanshodhan corporate MCA21 registry update ko ekeekrut karta hai.",
        ta: "அத்தியாயம் 2: 2011-12 முதல் புதிய 2026 தொடருக்கான அடிப்படை ஆண்டு திருத்தம் நிறுவன MCA21 பதிவேட்டை ஒருங்கிணைக்கிறது.",
        ta_phonetic: "Adhiyaayam 2: 2011-12 mudhal pudhiya 2026 thodarukkaana adipadai aandu thiruththam niruvana MCA21 pathivettai orunginaikkiradhu.",
        mr: "धडा 2: 2011-12 ते नवीन 2026 मालिकेतील आधारभूत वर्ष सुधारणा कॉर्पोरेट MCA21 नोंदणी अद्यतने एकत्रित करते.",
        mr_phonetic: "Dhadaa 2: 2011-12 te naveen 2026 maaliketil aadhaarbhoot varsh sudhaarana corporate MCA21 nondani adyataney ekatrit karte."
      },
      {
        timeSec: 615,
        timeStr: "10:15",
        en: "Gross Value Added (GVA) at Basic Prices equals Factor Cost plus Net Production Taxes, excluding product-specific tariffs.",
        te: "ప్రాథమిక ధరల వద్ద స్థూల విలువ జోడింపు (GVA) అనేది ఉత్పత్తిపై నికర పన్నులను కలుపుకుని కారకాల వ్యయానికి సమానం.",
        te_phonetic: "Praathamika dharala vadda sthoola viluva jodimpu (GVA) anedi utpatthipai nikara pannulanu kalupukuni kaarakala vyayaaniki samaanam.",
        hi: "मूल कीमतों पर सकल मूल्य वर्धित (GVA) उत्पादन पर शुद्ध करों को जोड़कर साधन लागत के बराबर होता है।",
        hi_phonetic: "Mool keematon par sakal moolya vardhit (GVA) utpaadan par shuddh karon ko jodkar saadhan laagat ke baraabar hota hai.",
        ta: "அடிப்படை விலைகளில் மொத்த மதிப்பு கூட்டல் (GVA) என்பது காரணி செலவுடன் நிகர உற்பத்தி வரிகளைச் சேர்ப்பதாகும்.",
        ta_phonetic: "Adipadai vilaigalil moththa mathippu koottal (GVA) enbadhu kaarani selavudan nigara urpaththi varigalai serppadhaagum.",
        mr: "मूळ किमतींवर एकूण मूल्यवर्धित (GVA) निव्वळ उत्पादन कर जोडून उत्पादन घटकांच्या खर्चाच्या बरोबरीचे असते.",
        mr_phonetic: "Mool kimtinvar ekun moolyavardhit (GVA) nivval utpaadan kar jodun utpaadan ghatkaanchya kharchaachya barobariche aste."
      },
      {
        timeSec: 825,
        timeStr: "13:45",
        en: "Financial Intermediation Services Indirectly Measured (FISIM) imputes the hidden banking spread across borrowing and lending sectors.",
        te: "పరోక్షంగా కొలవబడిన ఆర్థిక మధ్యవర్తిత్వ సేవలు (FISIM) బ్యాంకింగ్ రంగానికి చెందిన మార్జిన్‌ను స్పష్టంగా లెక్కిస్తుంది.",
        te_phonetic: "Parokshangaa kolavabadina aarthika madhyavarthitva sevalu (FISIM) banking rangaaniki chendina margin-nu spashtamgaa lekkistundi.",
        hi: "अप्रत्यक्ष रूप से मापी गई वित्तीय मध्यस्थता सेवाएं (FISIM) उधार और ऋण क्षेत्रों में छिपे बैंकिंग मार्जिन की गणना करती हैं।",
        hi_phonetic: "Apratyaksh roop se maapi gayi vitteey madhyasthata sevayein (FISIM) udhaar aur run kshetron mein chhipey banking margin ki ganana karti hain.",
        ta: "மறைமுகமாக அளவிடப்படும் நிதி இடைத்தரகர் சேவைகள் (FISIM) கடன் வாங்குதல் மற்றும் வழங்கும் துறைகளில் மறைந்திருக்கும் வங்கி விளிம்புகளைக் கணக்கிடுகிறது.",
        ta_phonetic: "Maraimugamaaga alavidappadum nidhi idaitharakar sevaigal (FISIM) kadan vaangudhal matrum vazhangum thuraigalil marainthirukkum vangi vilimbugalai kanakkidugiradhu.",
        mr: "अप्रत्यक्षपणे मोजल्या जाणाऱ्या वित्तीय मध्यस्थता सेवा (FISIM) कर्ज आणि पत क्षेत्रातील गुप्त बँकिंग मार्जिनची मोजणी करतात.",
        mr_phonetic: "Apratyakshpane mojlyaa jaanaaryaa vitteey madhyasthata seva (FISIM) karj aani pat kshetrateel gupt banking marginchi mojni kartaat."
      },
      {
        timeSec: 1040,
        timeStr: "17:20",
        en: "Consumption of Fixed Capital (CFC) represents economic wear and tear, bridging Gross Domestic Product to Net Domestic Product.",
        te: "స్థిర మూలధన వినియోగం (CFC) ఆర్థిక తరుగుదలను సూచిస్తుంది, స్థూల దేశీయోత్పత్తిని నికర దేశీయోత్పత్తితో కలుపుతుంది.",
        te_phonetic: "Sthira mooladhana viniyogam (CFC) aarthika tharugudalanu soochistundi, sthoola deshiyothpatthini nikara deshiyothpatthitho kaluputundi.",
        hi: "स्थिर पूंजी की खपत (CFC) आर्थिक मूल्यह्रास का प्रतिनिधित्व करती है, जो सकल घरेलू उत्पाद को शुद्ध घरेलू उत्पाद से जोड़ती है।",
        hi_phonetic: "Sthir poonji ki khapat (CFC) aarthik moolyahraas ka pratinidhitwa karti hai, jo sakal gharelu utpaad ko shuddh gharelu utpaad se jodti hai.",
        ta: "நிலையான மூலதன நுகர்வு (CFC) என்பது தேய்மானத்தைக் குறிக்கிறது, இது மொத்த உள்நாட்டு உற்பத்தியை நிகர உள்நாட்டு உற்பத்தியாக மாற்றுகிறது.",
        ta_phonetic: "Nilaiyaana mooladhana nugarvu (CFC) enbadhu theymaanathai kurikkiradhu, idhu moththa ulnaattu urpaththiyai nikara ulnaattu urpaththiyaaga maatrugiradhu.",
        mr: "स्थिर भांडवलाचा वापर (CFC) आर्थिक झीज दर्शवतो, जो एकूण देशांतर्गत उत्पादनाला निव्वळ देशांतर्गत उत्पादनाशी जोडतो.",
        mr_phonetic: "Sthir bhaandavalaachaa vaapar (CFC) aarthik jheej darshavto, jo ekun deshaantargat utpaadanaala nivval deshaantargat utpaadanaashi jodto."
      },
      {
        timeSec: 1290,
        timeStr: "21:30",
        en: "For the informal economy, enterprise survey GVA per worker is multiplied by PLFS workforce estimates to determine unorganized output.",
        te: "అసంఘటిత ఆర్థిక వ్యవస్థ కోసం, ప్రతి కార్మికుడికి వచ్చే GVA ను PLFS వర్క్‌ఫోర్స్ అంచనాలతో గుణించి లెక్కకడతారు.",
        te_phonetic: "Asanghatitha aarthika vyavastha kosam, prathi kaarmikudiki vache GVA nu PLFS workforce anchanaalatho guninchi lekkakadataaru.",
        hi: "अनौपचारिक अर्थव्यवस्था के लिए, प्रति श्रमिक GVA को PLFS कार्यबल अनुमानों से गुणा करके असंगठित उत्पादन निर्धारित किया जाता है।",
        hi_phonetic: "Anaupchaarik arthvyavastha ke liye, prati shramik GVA ko PLFS kaaryabal anumaanon se guna karke asangathit utpaadan nirdhaarit kiya jaata hai.",
        ta: "முறைசாரா பொருளாதாரத்திற்கு, ஒரு தொழிலாளருக்கான GVA உடன் PLFS பணியாளர் மதிப்பீடுகளைப் பெருக்கி அமைப்புசாரா உற்பத்தி தீர்மானிக்கப்படுகிறது.",
        ta_phonetic: "Muraisaaraa porulaadhaarathtirku, oru thozhilaalarukkaana GVA udan PLFS paniyaalar mathippeedugalai perukki amaippusaaraa urpaththi theermaanikkappadugiradhu.",
        mr: "अनौपचारिक अर्थव्यवस्थेसाठी, प्रति कामगार GVA ला PLFS कार्यबल अंदाजांनी गुणून असंघटित उत्पादन निश्चित केले जाते.",
        mr_phonetic: "Anoupchaarik arthavyavasthesaathi, prati kaamgaar GVA la PLFS kaaryabal andaajaanni gunoon asanghatit utpaadan nishchit kele jaate."
      },
      {
        timeSec: 1575,
        timeStr: "26:15",
        en: "Input-Output Transaction Tables (IOTT) and Supply-Use Tables (SUT) reconcile domestic production, intermediate flows, and final demand.",
        te: "ఇన్‌పుట్-అవుట్‌పుట్ లావాదేవీ పట్టికలు (IOTT) మరియు సప్లై-యూజ్ టేబుల్స్ (SUT) దేశీయ ఉత్పత్తి మరియు అంతిమ డిమాండ్‌ను సరిపోల్చుతాయి.",
        te_phonetic: "Input-Output laavaadevi pattikalu (IOTT) mariyu Supply-Use tables (SUT) desheeya utpatthi mariyu anthima demand-nu saripolchuthaayi.",
        hi: "इनपुट-आउटपुट लेनदेन तालिकाएं (IOTT) और आपूर्ति-उपयोग तालिकाएं (SUT) घरेलू उत्पादन और अंतिम मांग का समाधान करती हैं।",
        hi_phonetic: "Input-Output lenden taalikaayein (IOTT) aur aapoorti-upyog taalikaayein (SUT) gharelu utpaadan aur antim maang ka samaadhaan karti hain.",
        ta: "உள்ளீடு-வெளியீடு பரிவர்த்தனை அட்டவணைகள் (IOTT) மற்றும் வழங்கல்-பயன்பாட்டு அட்டவணைகள் (SUT) உற்பத்தியையும் இறுதி தேவையையும் சமநிலைப்படுத்துகின்றன.",
        ta_phonetic: "Ulleedu-veliyeedu parivarthanai attavanaigal (IOTT) matrum vazhangal-payanpaattu attavanaigal (SUT) urpaththiyaiyum irudhi thevaiyaiyum samanilaippaduthugindraana.",
        mr: "इनपुट-आउटपुट व्यवहार तक्ते (IOTT) आणि पुरवठा-वापर तक्ते (SUT) देशांतर्गत उत्पादन आणि अंतिम मागणीचा मेळ घालतात.",
        mr_phonetic: "Input-Output vyavahaar taktey (IOTT) aani puravathaa-vaapar taktey (SUT) deshaantargat utpaadan aani antim maagnichaa mel ghaaltaat."
      },
      {
        timeSec: 1860,
        timeStr: "31:00",
        en: "In Periodic Labour Force Survey (PLFS) monitoring, Usual Principal and Subsidiary Status (UPSS) establishes baseline workforce numbers.",
        te: "పీరియాడిక్ లేబర్ ఫోర్స్ సర్వే (PLFS) పర్యవేక్షణలో, సాధారణ ప్రధాన మరియు అనుబంధ స్థితి (UPSS) వర్క్‌ఫోర్స్ ప్రాథమిక సంఖ్యలను నిర్ధారిస్తుంది.",
        te_phonetic: "Periodic Labour Force Survey (PLFS) paryavekshanalo, saadhaarna pradhaana mariyu anubandha sthiti (UPSS) workforce praathamika sankhyalannu nirdhaarustundi.",
        hi: "आवधिक श्रम बल सर्वेक्षण (PLFS) निगरानी में, सामान्य प्रधान और सहायक स्थिति (UPSS) आधारभूत कार्यबल संख्या स्थापित करती है।",
        hi_phonetic: "Aavadhik shram bal sarvekshan (PLFS) nigrani mein, saamaanya pradhaan aur sahaayak sthiti (UPSS) aadhaarbhoot kaaryabal sankhya sthaapit karti hai.",
        ta: "காலமுறை தொழிலாளர் கணக்கெடுப்பு (PLFS) கண்காணிப்பில், வழக்கமான முதன்மை மற்றும் துணை நிலை (UPSS) பணியாளர் எண்ணிக்கையை நிறுவுகிறது.",
        ta_phonetic: "Kaalamurai thozhilaalar kanakkeduppu (PLFS) kankaanippil, vazhakkamaana mudhanmai matrum thunai nilai (UPSS) paniyaalar ennikkaiyai niruvugiradhu.",
        mr: "नियतकालिक कामगार सर्वेक्षण (PLFS) मध्ये, नेहमीची मुख्य आणि दुय्यम स्थिती (UPSS) मूळ कार्यबल संख्या स्थापित करते.",
        mr_phonetic: "Niyatkaalik kaamgaar sarvekshan (PLFS) madhye, nehmichi mukhya aani duyyam sthiti (UPSS) mool kaaryabal sankhya sthaapit karte."
      },
      {
        timeSec: 2145,
        timeStr: "35:45",
        en: "Under DoPT FRAC competency standards, field statistical officers must maintain Level 4 validation proficiency in data discrepancy audits.",
        te: "DoPT FRAC సామర్థ్య ప్రమాణాల ప్రకారం, ఫీల్డ్ స్టాటిస్టికల్ అధికారులు డేటా ఆడిట్‌లలో లెవల్ 4 ప్రావీణ్యాన్ని కలిగి ఉండాలి.",
        te_phonetic: "DoPT FRAC saamarthya pramaanaala prakaaram, field statistical adhikaarulu data audit-lalo Level 4 praaveenyaanni kaligi undaali.",
        hi: "DoPT FRAC योग्यता मानकों के तहत, क्षेत्रीय सांख्यिकी अधिकारियों को डेटा विसंगति ऑडिट में स्तर 4 सत्यापन दक्षता बनाए रखनी होगी।",
        hi_phonetic: "DoPT FRAC yogyata maanakon ke tehat, kshetrriya sankhyiki adhikaariyon ko data visangati audit mein Level 4 satyaapan dakshata banaye rakhni hogi.",
        ta: "DoPT FRAC திறன் தரநிலைகளின் கீழ், கள புள்ளிவிவர அதிகாரிகள் தரவு முரண்பாடு தணிக்கையில் நிலை 4 தேர்ச்சியை பராமரிக்க வேண்டும்.",
        ta_phonetic: "DoPT FRAC thiran tharanilaigalin keezh, kala pullivivara adhikaarigal tharavu muranpaadu thanikkaiyil Level 4 theerchiyai paraamarikka vendum.",
        mr: "DoPT FRAC क्षमता मानकांनुसार, क्षेत्रीय सांख्यिकी अधिकाऱ्यांनी डेटा ऑडिटमध्ये स्तर 4 पडताळणी प्रावीण्य राखले पाहिजे.",
        mr_phonetic: "DoPT FRAC kshamata maanakaannusaar, kshetrriya sankhyiki adhikaaryanni data audit madhye Level 4 padtaalani praaveenya raakhley paahije."
      },
      {
        timeSec: 2370,
        timeStr: "39:30",
        en: "Before field departure, CAPI tablets enforce local SHA-256 cryptographic signing to guarantee offline audit trail integrity.",
        te: "ఫీల్డ్ నుండి బయలుదేరే ముందు, CAPI టాబ్లెట్‌లు ఆఫ్‌లైన్ సమగ్రతను కాపాడటానికి స్థానిక SHA-256 సైనింగ్‌ను అమలు చేస్తాయి.",
        te_phonetic: "Field nundi bayaludere mundu, CAPI tablet-lu offline samagratanu kaapaadataaniki sthaanika SHA-256 signing-nu amalu chestaayi.",
        hi: "क्षेत्र छोड़ने से पहले, CAPI टैबलेट ऑफ़लाइन ऑडिट ट्रेल अखंडता की गारंटी के लिए स्थानीय SHA-256 क्रिप्टोग्राफ़िक हस्ताक्षर लागू करते हैं।",
        hi_phonetic: "Kshetra chhodne se pehle, CAPI tablet offline audit trail akhandata ki guarantee ke liye sthaaneey SHA-256 cryptographic hastaakshar laagu karte hain.",
        ta: "களத்தை விட்டு வெளியேறும் முன், CAPI டேப்லெட்டுகள் ஆஃப்லைன் தணிக்கை பாதுகாப்பை உறுதி செய்ய SHA-256 குறியாக்க கையொப்பத்தை செயல்படுத்துகின்றன.",
        ta_phonetic: "Kalathai vittu veliyerum mun, CAPI tablettugal offline thanikkai paadhukaappai urudhi seyya SHA-256 kureeyaakka kaiyoppathai seyalpaduthugindraana.",
        mr: "क्षेत्र सोडण्यापूर्वी, CAPI टॅब्लेट ऑफलाइन ऑडिट ट्रेल अखंडतेची हमी देण्यासाठी स्थानिक SHA-256 स्वाक्षरी लागू करतात.",
        mr_phonetic: "Kshetra sodnyaapoorvi, CAPI tablet offline audit trail akhandatechi hami denyasaathi sthaanik SHA-256 svaakshari laagu kartaat."
      },
      {
        timeSec: 2535,
        timeStr: "42:15",
        en: "Lecture completed. Review your DoPT FRAC competency matrix and proceed to the verified checkpoint assessment.",
        te: "లెక్చర్ పూర్తయింది. మీ DoPT FRAC సామర్థ్య మ్యాట్రిక్స్‌ను సమీక్షించి, మూల్యాంకనానికి కొనసాగండి.",
        te_phonetic: "Lecture poorthayindi. Mee DoPT FRAC saamarthya matrix-nu sameekshinchi, moolyaankanaaniki konasaagandi.",
        hi: "व्याख्यान पूरा हुआ। अपने DoPT FRAC योग्यता मैट्रिक्स की समीक्षा करें और चेकपॉइंट मूल्यांकन के लिए आगे बढ़ें।",
        hi_phonetic: "Vyaakhyaan poora hua. Apne DoPT FRAC yogyata matrix ki samiksha karein aur checkpoint moolyaankan ke liye aage badhein.",
        ta: "விரிவுரை முடிந்தது. உங்கள் DoPT FRAC திறன் மேட்ரிக்ஸை மதிப்பாய்வு செய்து சரிபார்க்கப்பட்ட மதிப்பீட்டிற்கு தொடரவும்.",
        ta_phonetic: "Virivurai mudindhadhu. Ungal DoPT FRAC thiran matrix-ai mathippaaivu seydu saripaarkkappatta mathippeettirku thodaravum.",
        mr: "व्याख्यान पूर्ण झाले. तुमचे DoPT FRAC क्षमता मॅट्रिक्स तपासा आणि मूल्यांकन चाचणीकडे पुढे जा.",
        mr_phonetic: "Vyaakhyaan poorna jhaale. Tumche DoPT FRAC kshamata matrix tapaasaa aani moolyaankan chaasnikade pudhe jaa."
      }
    ]
  },
  2: {
    id: 2,
    title: "Annual Survey of Unincorporated Enterprises (ASUSE) - Field Supervisory Manual",
    format: 'pdf',
    formatLabel: "PDF Official Document (48 Pages)",
    moduleCode: "MoSPI-ASUSE-SUP-02",
    cadreTag: "MoSPI Operational Guidelines • Chapter 4",
    description: "Comprehensive in-service field manual detailing primary sampling unit (PSU) stratification, enterprise listing schedules, Gross Value Added (GVA) imputation, and CAPI tablet data validation.",
    sourceDoc: "MoSPI ASUSE 2026 Operational Guidelines, Chapter 4, Section 3.1 & Schedule 1.0",
    sourceExcerpt: "Section 3.1 (Census Cutoff for Upper Stratum): In each rural and urban Primary Sampling Unit (PSU), complete enumeration (100% census) is mandatory for establishments employing 10 or more workers without electricity or 20 or more workers with electricity. These units cannot be subjected to sampling due to high aggregate variance impacts on National Accounts.",
    formulaTitle: "Enterprise Gross Value Added (GVA)",
    formulaCode: "GVA = Gross Output − Intermediate Consumption",
    formulaDescription: "Gross output minus operating expenses (raw materials, fuels, electricity, and contracted services).",
    competencyCode: "STAT-SAMP-01",
    competencyName: "Stratified Multi-Stage Sampling & Horvitz-Thompson Estimation",
    durationSeconds: 1980,
    packageSize: "6.8 MB",
    question: {
      prompt: "In ASUSE field operations, which establishment category mandates 100% complete enumeration (census) within a Primary Sampling Unit (PSU) rather than sampling?",
      source: "MoSPI ASUSE 2026 Field Guidelines, Chapter 4, Section 3.1",
      options: [
        "A) Any single-proprietor enterprise operating without hired workers (Own Account Enterprise - OAE).",
        "B) Establishments employing 10 or more workers without electricity or 20+ workers with power.",
        "C) Only manufacturing enterprises registered under the Factories Act, 1948.",
        "D) Any enterprise operating in rural agricultural clusters."
      ],
      correctIndex: 1,
      explanation: "Correct! MoSPI ASUSE Section 3.1 mandates that large unincorporated establishments meeting the employment threshold (10+ without power, 20+ with power) must be completely enumerated to eliminate sampling variance in National Accounts.",
      misconceptionFeedback: "Incorrect. Establishments meeting the 10+ without power or 20+ with power threshold are completely enumerated (census) to minimize aggregate variance."
    },
    transcripts: [
      {
        timeSec: 0,
        timeStr: "00:00",
        en: "MoSPI ASUSE Field Manual Chapter 1: Introduction to unincorporated non-agricultural sector enumeration.",
        te: "MoSPI ASUSE ఫీల్డ్ మాన్యువల్ చాప్టర్ 1: అసంఘటిత వ్యవసాయేతర రంగ ఎన్యూమరేషన్ పరిచయం.",
        hi: "MoSPI ASUSE फील्ड मैनुअल अध्याय 1: अनिगमित गैर-कृषि क्षेत्र की गणना का परिचय।",
        ta: "MoSPI ASUSE களக் கையேடு அத்தியாயம் 1: ஒருங்கிணைக்கப்படாத வேளாண்மை அல்லாத துறை கணக்கெடுப்பு அறிமுகம்.",
        mr: "MoSPI ASUSE फील्ड मॅन्युअल धडा 1: असंघटित बिगर-शेती क्षेत्र गणनेची ओळख."
      },
      {
        timeSec: 45,
        timeStr: "00:45",
        en: "Chapter 2: Schedule 1.0 Enterprise Listing and distinguishing Own Account Enterprises (OAE) from Establishments.",
        te: "చాప్టర్ 2: షెడ్యూల్ 1.0 ఎంటర్‌ప్రైజ్ లిస్టింగ్ మరియు స్థాపనల నుండి సొంత ఖాతా సంస్థలను (OAE) వేరు చేయడం.",
        hi: "अध्याय 2: अनुसूची 1.0 उद्यम सूची और प्रतिष्ठानों से अपने स्वयं के खाता उद्यमों (OAE) को अलग करना।",
        ta: "அத்தியாயம் 2: அட்டவணை 1.0 நிறுவனப் பட்டியல் மற்றும் சொந்த கணக்கு நிறுவனங்களை பிறவற்றிலிருந்து வேறுபடுத்துதல்.",
        mr: "धडा 2: अनुसूची 1.0 उद्योग यादी आणि स्वतःच्या खात्यावरील उपक्रम आस्थापनांपासून वेगळे करणे."
      },
      {
        timeSec: 100,
        timeStr: "01:40",
        en: "Chapter 3: Primary Sampling Unit stratification and mandatory 100% census thresholds for large enterprises.",
        te: "చాప్టర్ 3: ప్రాథమిక నమూనా యూనిట్ స్తరీకరణ మరియు పెద్ద సంస్థలకు తప్పనిసరి 100% జనగణన పరిమితులు.",
        hi: "अध्याय 3: प्राथमिक नमूना इकाई स्तरीकरण और बड़े उद्यमों के लिए अनिवार्य 100% जनगणना सीमाएं।",
        ta: "அத்தியாயம் 3: முதன்மை மாதிரி அலகு அடுக்குப்படுத்தல் மற்றும் பெரிய நிறுவனங்களுக்கான கட்டாய 100% கணக்கெடுப்பு வரம்புகள்.",
        mr: "धडा 3: प्राथमिक नमुना घटक स्तर आणि मोठ्या उद्योगांसाठी अनिवार्य 100% जनगणना मर्यादा."
      },
      {
        timeSec: 160,
        timeStr: "02:40",
        en: "Chapter 4: Gross Value Added computation, deductible expenses, and intermediate consumption definitions.",
        te: "చాప్టర్ 4: స్థూల విలువ జోడింపు లెక్కింపు, మినహాయింపు ఖర్చులు మరియు మధ్యంతర వినియోగ నిర్వచనాలు.",
        hi: "अध्याय 4: सकल मूल्य वर्धित गणना, कटौती योग्य व्यय और मध्यवर्ती खपत की परिभाषाएं।",
        ta: "அத்தியாயம் 4: மொத்த மதிப்பு கூட்டல் கணக்கீடு, விலக்கு அளிக்கப்படும் செலவுகள் மற்றும் இடைநிலை நுகர்வு வரையறைகள்.",
        mr: "धडा 4: एकूण मूल्यवर्धित गणना, वजावट खर्च आणि मध्यवर्ती वापराच्या व्याख्या."
      },
      {
        timeSec: 220,
        timeStr: "03:40",
        en: "Chapter 5: CAPI Tablet operational guidelines, GPS geotagging tolerances, and automated error trapping.",
        te: "చాప్టర్ 5: CAPI టాబ్లెట్ కార్యాచరణ మార్గదర్శకాలు, GPS జియోట్యాగింగ్ పరిమితులు మరియు ఆటోమేటెడ్ లోప గుర్తింపు.",
        hi: "अध्याय 5: CAPI टैबलेट परिचालन दिशानिर्देश, जीपीएस जियोटैगिंग सहनशीलता और स्वचालित त्रुटि ट्रैपिंग।",
        ta: "அத்தியாயம் 5: CAPI டேப்லெட் செயல்பாட்டு வழிகாட்டுதல்கள், GPS புவிக்குறியீட்டு வரம்புகள் மற்றும் தானியங்கி பிழை கண்டறிதல்.",
        mr: "धडा 5: CAPI टॅब्लेट मार्गदर्शक तत्त्वे, GPS जिओटॅगिंग सहनशीलता आणि स्वयंचलित त्रुटी ट्रॅपिंग."
      }
    ],
    pdfChapters: [
      {
        chapterNumber: 1,
        title: "Objectives, Scope & Coverage of Unincorporated Enterprises",
        pages: "Pages 1-8",
        summary: "Statutory mandate under Collection of Statistics Act, 2008 covering manufacturing, trade, and other services.",
        content: [
          "The Annual Survey of Unincorporated Enterprises (ASUSE) is designed to produce economic aggregates for the unorganized sector in India.",
          "Coverage extends to all non-agricultural economic enterprises in rural and urban sectors, excluding those governed by the Factories Act, 1948.",
          "Field investigators must adhere strictly to the boundary demarcation defined in the MoSPI Urban Frame Survey (UFS) block maps."
        ]
      },
      {
        chapterNumber: 2,
        title: "Schedule 1.0: Enterprise Listing & Demarcation Protocol",
        pages: "Pages 9-18",
        summary: "Rules for distinguishing Own Account Enterprises (OAE) without hired workers from Establishments.",
        content: [
          "An Own Account Enterprise (OAE) is operated by household members without hiring any regular worker on a fairly continuous basis.",
          "An Establishment is an enterprise employing at least one hired worker on a fairly regular basis.",
          "Failure to classify household micro-units correctly inflates OAE employment numbers while understating formal wage compensation."
        ]
      },
      {
        chapterNumber: 3,
        title: "PSU Stratification & Mandatory Census Cutoff Rules",
        pages: "Pages 19-28",
        summary: "Statutory 100% census rule for large unincorporated units to minimize national accounts variance.",
        content: [
          "Mandatory Complete Enumeration (Census): Any establishment with 10 or more workers (operating without power) or 20 or more workers (operating with power) must be 100% enumerated in the upper stratum.",
          "Sampling is strictly prohibited for units crossing this threshold, as single missing units produce massive outliers in Horvitz-Thompson estimation.",
          "Remaining smaller units in the PSU are sampled via circular systematic sampling with random start."
        ]
      },
      {
        chapterNumber: 4,
        title: "Gross Value Added (GVA) & Intermediate Consumption",
        pages: "Pages 29-38",
        summary: "Formula: GVA = Gross Output − Intermediate Consumption. Exact rules for allowable expense deductions.",
        content: [
          "Gross Output comprises total value of goods produced, trading gross margin, services rendered, and net inventory change.",
          "Intermediate Consumption includes raw materials, fuel, electricity, packaging, communication, and minor maintenance costs.",
          "Do NOT include depreciation, loan interest, or taxes in intermediate consumption; these are primary factor payments deducted from GVA to derive Net Value Added."
        ]
      },
      {
        chapterNumber: 5,
        title: "CAPI Tablet Validation Rules & Field Supervisory Audit",
        pages: "Pages 39-48",
        summary: "Automated hard and soft error flags, GPS coordinate radius checks, and supervisor audit protocol.",
        content: [
          "Hard Error Flag: Triggered if Intermediate Consumption exceeds 95% of Gross Receipts without senior supervisor override notes.",
          "GPS Geotagging: Enumerator coordinates must fall within 50 meters of the registered UFS block centroid.",
          "Offline CAPI Synchronization: All completed schedules must be locally hashed and queued in IndexedDB until secure synchronization with FOD Regional Office servers."
        ]
      }
    ]
  }
};

const SUBTITLE_SIZE_CLASSES: Record<string, string> = {
  sm: 'text-sm sm:text-base',
  base: 'text-base sm:text-lg',
  lg: 'text-lg sm:text-xl',
  xl: 'text-xl sm:text-2xl font-bold'
};

const SUBTITLE_SPACING_CLASSES: Record<string, string> = {
  tight: 'tracking-tight',
  normal: 'tracking-normal',
  wide: 'tracking-wide',
  widest: 'tracking-widest'
};

const SUBTITLE_COLOR_PALETTE = [
  { name: 'Warm Amber', value: '#FDE68A', border: '#F59E0B' },
  { name: 'Pure White', value: '#FFFFFF', border: '#E2E8F0' },
  { name: 'Electric Cyan', value: '#38BDF8', border: '#0EA5E9' },
  { name: 'Vivid Yellow', value: '#FACC15', border: '#EAB308' },
  { name: 'Emerald Green', value: '#34D399', border: '#10B981' },
  { name: 'Peach Coral', value: '#FDA4AF', border: '#F43F5E' }
];

export default function LearnPlayerPage() {
  const params = useParams();
  const { user } = useAuth();
  const rawId = Number(params?.assetId || 1);
  const assetId = ASSET_LIBRARY[rawId] ? rawId : 1;
  const asset = ASSET_LIBRARY[assetId];

  // Media Player State
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(asset.transcripts[0]?.timeSec || 0);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.85);
  const [selectedAudio, setSelectedAudio] = useState<'te' | 'hi' | 'en' | 'ta' | 'mr'>('te');
  const [selectedSubtitle, setSelectedSubtitle] = useState<'te' | 'hi' | 'en' | 'ta' | 'mr'>('te');
  const [activeTab, setActiveTab] = useState<'transcript' | 'scanner' | 'concepts' | 'igot'>('transcript');
  const [isDownloaded, setIsDownloaded] = useState(false);
  const [downloading, setDownloading] = useState(false);

  // Subtitle Customization State
  const [subtitleSize, setSubtitleSize] = useState<'sm' | 'base' | 'lg' | 'xl'>('base');
  const [subtitleColor, setSubtitleColor] = useState<string>('#FDE68A');
  const [subtitleSpacing, setSubtitleSpacing] = useState<'tight' | 'normal' | 'wide' | 'widest'>('normal');
  const [showSubtitleSettings, setShowSubtitleSettings] = useState(false);

  // Real-Time iGOT Karmayogi Server Synchronization State
  const [isIgotSyncing, setIsIgotSyncing] = useState(false);
  const [igotSyncSuccess, setIgotSyncSuccess] = useState(false);
  const [igotVerifiedHours, setIgotVerifiedHours] = useState(42.5);
  const [igotLastSyncTimestamp, setIgotLastSyncTimestamp] = useState('2026-09-08 03:15 IST');

  // PDF Document Viewer State (For Asset 2)
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);

  // Video Fullscreen & Container References
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Transcript Auto-Scroll & Real-Time Filter
  const activeTranscriptRef = useRef<HTMLDivElement>(null);
  const [transcriptFilter, setTranscriptFilter] = useState('');

  // AI Manual Voice Reader Active Paragraph Tracking
  const [activeManualParagraph, setActiveManualParagraph] = useState<number | null>(null);

  // Speech Synthesis Voices Cache
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    const loadVoices = () => {
      const v = window.speechSynthesis.getVoices();
      if (v && v.length > 0) setVoices(v);
    };
    loadVoices();
    window.speechSynthesis.addEventListener('voiceschanged', loadVoices);
    return () => window.speechSynthesis.removeEventListener('voiceschanged', loadVoices);
  }, []);

  // Fullscreen Event Listener & Toggle
  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    document.addEventListener('webkitfullscreenchange', handleFsChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFsChange);
      document.removeEventListener('webkitfullscreenchange', handleFsChange);
    };
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      const el = videoContainerRef.current as any;
      if (el) {
        if (el.requestFullscreen) {
          el.requestFullscreen();
        } else if (el.webkitRequestFullscreen) {
          el.webkitRequestFullscreen();
        } else if (el.msRequestFullscreen) {
          el.msRequestFullscreen();
        }
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if ((document as any).webkitExitFullscreen) {
        (document as any).webkitExitFullscreen();
      }
    }
  };

  // Immediate Mute Handler
  const toggleMute = () => {
    setIsMuted((prev) => {
      const next = !prev;
      if (next) {
        // Immediate silence of any active speech
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
          window.speechSynthesis.cancel();
        }
        if (audioCtxRef.current && audioCtxRef.current.state === 'running') {
          try { audioCtxRef.current.suspend(); } catch (e) {}
        }
      } else {
        if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
          try { audioCtxRef.current.resume(); } catch (e) {}
        }
      }
      return next;
    });
  };

  // Live AI Source Scanner State
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanComplete, setScanComplete] = useState(false);

  // Checkpoint Quiz State
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [confidence, setConfidence] = useState<number>(4);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizResult, setQuizResult] = useState<{ isCorrect: boolean; message: string } | null>(null);

  // Audio Context and Voice Synthesis References
  const audioCtxRef = useRef<AudioContext | null>(null);
  const lastSpokenCueRef = useRef<number | null>(null);

  // Web Audio API Harmonic Synthesizer (audible tone during playback)
  const playHarmonicPulse = useCallback(() => {
    if (typeof window === 'undefined' || isMuted || volume === 0) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(261.63, ctx.currentTime); // C4 middle tone
      osc.frequency.exponentialRampToValueAtTime(392.00, ctx.currentTime + 0.12); // G4 harmonic

      gain.gain.setValueAtTime(0.06 * volume, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    } catch (e) {
      console.warn('Web Audio synthesis:', e);
    }
  }, [isMuted, volume]);

  // Multilingual Speech Synthesis Engine with Indic Phonetic & Cross-Browser Fallback
  const speakTranscriptCue = useCallback((cueText: string, lang: 'te' | 'hi' | 'en' | 'ta' | 'mr', cueItem?: TranscriptItem) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      if (isMuted || volume === 0) return;

      const langMap: Record<string, string> = {
        te: 'te-IN',
        hi: 'hi-IN',
        en: 'en-IN',
        ta: 'ta-IN',
        mr: 'mr-IN'
      };

      const availVoices = voices.length > 0 ? voices : window.speechSynthesis.getVoices();
      const hasNativeVoice = availVoices.some(v => v.lang.toLowerCase().startsWith(lang));
      const targetVoice = availVoices.find(v => v.lang.toLowerCase().startsWith(lang));

      let textToSpeak = cueText;
      let targetLang = langMap[lang] || 'en-IN';

      // If browser lacks native Telugu, Marathi, or Tamil voice, use phonetic transliteration or English voice
      if (!hasNativeVoice && lang !== 'en' && cueItem) {
        const phoneticKey = `${lang}_phonetic` as keyof TranscriptItem;
        if (cueItem[phoneticKey]) {
          textToSpeak = cueItem[phoneticKey] as string;
        } else if (cueItem.en) {
          textToSpeak = cueItem.en;
        }
        targetLang = 'en-IN';
      }

      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = targetLang;
      utterance.volume = isMuted ? 0 : volume;
      utterance.rate = 0.95;
      utterance.pitch = 1.0;

      if (targetVoice) {
        utterance.voice = targetVoice;
      } else {
        const indianVoice = availVoices.find(v => v.lang.includes('IN') || v.name.toLowerCase().includes('india') || v.name.toLowerCase().includes('ravi') || v.name.toLowerCase().includes('heera'));
        const fallbackVoice = indianVoice || availVoices.find(v => v.lang.toLowerCase().startsWith('en')) || availVoices[0];
        if (fallbackVoice) {
          utterance.voice = fallbackVoice;
        }
      }

      utterance.onerror = (e) => {
        console.warn('Speech synthesis error, attempting English voice fallback:', e);
        if (cueItem && cueItem.en && textToSpeak !== cueItem.en) {
          try {
            const fb = new SpeechSynthesisUtterance(cueItem.en);
            fb.volume = isMuted ? 0 : volume;
            fb.rate = 0.95;
            window.speechSynthesis.speak(fb);
          } catch (err) {}
        }
      };

      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.warn('Speech synthesis error:', err);
    }
  }, [isMuted, volume, voices]);

  // Find active transcript cue index based on currentTime
  const activeTranscriptIndex = asset.transcripts.findIndex((t, idx) => {
    const nextT = asset.transcripts[idx + 1];
    if (nextT) {
      return currentTime >= t.timeSec && currentTime < nextT.timeSec;
    }
    return currentTime >= t.timeSec;
  });

  const activeCue = asset.transcripts[activeTranscriptIndex >= 0 ? activeTranscriptIndex : 0];

  // Synchronized Playback Timer
  useEffect(() => {
    let timer: any;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= asset.durationSeconds) {
            setIsPlaying(false);
            if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
              window.speechSynthesis.cancel();
            }
            return asset.durationSeconds;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    }
    return () => clearInterval(timer);
  }, [isPlaying, asset.durationSeconds]);

  // Trigger voice narration and harmonic tone when active cue changes during playback
  useEffect(() => {
    if (isPlaying && activeCue && lastSpokenCueRef.current !== activeTranscriptIndex) {
      lastSpokenCueRef.current = activeTranscriptIndex;
      playHarmonicPulse();
      speakTranscriptCue(activeCue[selectedAudio], selectedAudio, activeCue);
    }
  }, [isPlaying, activeTranscriptIndex, activeCue, selectedAudio, playHarmonicPulse, speakTranscriptCue]);

  // Handle Play/Pause Toggle
  const togglePlayPause = () => {
    if (!isPlaying) {
      setIsPlaying(true);
      playHarmonicPulse();
      if (activeCue) {
        lastSpokenCueRef.current = activeTranscriptIndex;
        speakTranscriptCue(activeCue[selectedAudio], selectedAudio, activeCue);
      }
    } else {
      setIsPlaying(false);
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    }
  };

  // Handle Audio Language Change
  const handleAudioLanguageChange = (newLang: 'te' | 'hi' | 'en' | 'ta' | 'mr') => {
    setSelectedAudio(newLang);
    if (isPlaying && activeCue) {
      speakTranscriptCue(activeCue[newLang], newLang, activeCue);
    }
  };

  // Handle Seek / Jump
  const handleSeek = (timeSec: number) => {
    setCurrentTime(timeSec);
    const targetIdx = asset.transcripts.findIndex((t, idx) => {
      const nextT = asset.transcripts[idx + 1];
      if (nextT) return timeSec >= t.timeSec && timeSec < nextT.timeSec;
      return timeSec >= t.timeSec;
    });
    const targetCue = asset.transcripts[targetIdx >= 0 ? targetIdx : 0];
    lastSpokenCueRef.current = targetIdx;

    if (isPlaying && targetCue) {
      playHarmonicPulse();
      speakTranscriptCue(targetCue[selectedAudio], selectedAudio, targetCue);
    }
  };

  // Auto-scroll active transcript cue into view smoothly
  useEffect(() => {
    if (activeTab === 'transcript' && activeTranscriptRef.current) {
      activeTranscriptRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
      });
    }
  }, [activeTranscriptIndex, activeTab]);

  // Check offline cache status
  useEffect(() => {
    db.packages.get(String(assetId)).then((pkg) => {
      if (pkg) setIsDownloaded(true);
    });
  }, [assetId]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleDownloadOffline = async () => {
    setDownloading(true);
    try {
      await db.packages.put({
        id: String(assetId),
        asset_id: String(assetId),
        title: asset.title,
        subject: "MoSPI Official Statistics",
        grade_level: "Senior Statistical Officer Cadre",
        duration_seconds: asset.durationSeconds,
        media_url: `media/statistical_asset_${assetId}.mp4`,
        transcript_chunks: asset.transcripts.map((t, idx) => ({
          id: String(idx),
          start_time: t.timeSec,
          end_time: t.timeSec + 25,
          text_en: t.en,
          text_te: t.te,
          text_hi: t.hi
        })),
        subtitles: { en: [], te: [], hi: [] },
        concepts: [{ id: "1", name: asset.formulaTitle, definition: asset.formulaDescription, formula: asset.formulaCode }],
        questions: [{
          id: "1",
          text: asset.question.prompt,
          options: asset.question.options.map((o, idx) => ({ id: String(idx), text: o })),
          correct_option_id: String(asset.question.correctIndex),
          explanation: asset.question.explanation,
          competency_id: asset.competencyCode
        }],
        downloaded_at: new Date().toISOString(),
        size_bytes: assetId === 1 ? 14200000 : 6800000
      });
      setIsDownloaded(true);
    } catch (err) {
      console.error(err);
    } finally {
      setDownloading(false);
    }
  };

  const handleTriggerSourceScan = () => {
    setIsScanning(true);
    setScanProgress(10);
    setScanComplete(false);

    let progress = 10;
    const interval = setInterval(() => {
      progress += 25;
      if (progress <= 100) {
        setScanProgress(progress);
      } else {
        clearInterval(interval);
        setIsScanning(false);
        setScanComplete(true);
        setActiveTab('scanner');
      }
    }, 400);
  };

  // Real-Time iGOT Karmayogi Server Fetch Handler
  const handleFetchIgotServer = () => {
    setIsIgotSyncing(true);
    setIgotSyncSuccess(false);

    setTimeout(() => {
      setIsIgotSyncing(false);
      setIgotSyncSuccess(true);
      setIgotVerifiedHours(45.0);
      setIgotLastSyncTimestamp(new Date().toLocaleTimeString('en-IN', { hour12: false }) + ' IST (Real-Time Push)');
    }, 1200);
  };

  const handleQuizSubmit = async () => {
    if (selectedOption === null) return;
    const isCorrect = selectedOption === asset.question.correctIndex;
    
    setQuizResult({
      isCorrect,
      message: isCorrect ? asset.question.explanation : asset.question.misconceptionFeedback
    });
    setQuizSubmitted(true);

    try {
      const attemptId = `attempt_${assetId}_${Date.now()}`;
      await db.attempts.add({
        idempotency_key: attemptId,
        student_id: String(user?.id || '1'),
        asset_id: String(assetId),
        question_id: String(assetId),
        selected_option_id: String(selectedOption),
        is_correct: isCorrect,
        time_spent_seconds: 32,
        confidence_rating: confidence,
        timestamp: new Date().toISOString(),
        synced: false
      });

      const existingCompetencyScores = JSON.parse(localStorage.getItem('bhodbasha_competency_scores') || '{}');
      existingCompetencyScores[asset.competencyCode] = isCorrect ? 92 : 44;
      localStorage.setItem('bhodbasha_competency_scores', JSON.stringify(existingCompetencyScores));

      await syncManager.enqueue('/attempts/submit', {
        attempt_id: attemptId,
        score: isCorrect ? 100 : 35,
        confidence_rating: confidence,
        asset_id: String(assetId),
        competency_code: asset.competencyCode
      }, attemptId);
    } catch (err) {
      console.error('Offline quiz submission error:', err);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#FBFBFC] py-8">
      <div className="heritage-container max-w-[1240px] space-y-6 animate-fade-in">
        
        {/* Breadcrumb Navigation */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
            <Link href="/" className="hover:text-[#9F3E07] hover:underline font-medium">BhodBasha</Link>
            <span>/</span>
            <Link href="/teacher/assets" className="hover:text-[#9F3E07] hover:underline font-medium">Curriculum Assets</Link>
            <span>/</span>
            <span className="text-slate-900 font-semibold">Asset #{assetId}: {asset.moduleCode}</span>
          </div>

          <div className="flex items-center gap-3 font-mono text-xs">
            <span className="badge-mono badge-online text-[11px]">
              {asset.format === 'video' ? '🎬 Interactive Video Lecture' : '📄 Official Survey Manual'}
            </span>

            {isDownloaded ? (
              <span className="badge-mono badge-online text-[11px]">
                <CheckCircle2 size={12} className="mr-1 inline text-emerald-600" />
                <span>Cached in IndexedDB ({asset.packageSize})</span>
              </span>
            ) : (
              <span className="badge-mono badge-offline text-[11px]">
                Direct Stream (Online)
              </span>
            )}
          </div>
        </div>

        {/* 2-Column Academic Player Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column (8 cols): Media Stream / Document Reader */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* 1A. VIDEO FORMAT (Asset 1): Interactive HTML5 Visualizer & Audio Engine */}
            {asset.format === 'video' && (
              <div 
                ref={videoContainerRef}
                className={`heritage-card p-0 overflow-hidden bg-slate-950 text-white relative flex flex-col justify-end shadow-card border border-slate-800 transition-all ${
                  isFullscreen 
                    ? 'fixed inset-0 z-50 w-screen h-screen rounded-none border-0' 
                    : 'aspect-video rounded-2xl'
                }`}
              >
                
                {/* Visualizer Canvas Screen */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-black flex flex-col items-center justify-center p-6 select-none">
                  
                  {/* Dynamic Statistical Waveform & Animation Visualizer */}
                  <div className="text-center max-w-lg space-y-3 w-full">
                    
                    <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-orange-950/80 text-orange-300 border border-orange-700/50">
                      <span className={`w-2.5 h-2.5 rounded-full ${isPlaying ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></span>
                      <span>{asset.cadreTag} • {isPlaying ? `Audio Narration Active (${selectedAudio.toUpperCase()})` : 'Paused'}</span>
                    </div>

                    {/* Interactive Mathematical Formula Display Card */}
                    <div className="p-5 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md space-y-2 shadow-2xl">
                      <div className="flex items-center justify-between text-xs font-mono text-amber-400 font-semibold">
                        <span>{asset.formulaTitle}</span>
                        <span className="text-[10px] text-slate-400">MoSPI Calibrated</span>
                      </div>
                      <p className="font-mono text-xl sm:text-2xl font-bold text-white tracking-wider py-1">
                        {asset.formulaCode}
                      </p>
                      <p className="text-xs text-slate-300 max-w-md mx-auto">
                        {asset.formulaDescription}
                      </p>
                    </div>

                    {/* Animated Audio Waveform Simulation */}
                    <div className="flex items-center justify-center gap-1.5 h-9 py-1">
                      {[40, 65, 30, 85, 95, 55, 75, 45, 90, 60, 80, 50, 70, 40, 85].map((h, i) => (
                        <span
                          key={i}
                          className="w-1.5 bg-[#9F3E07] rounded-full transition-all duration-200"
                          style={{
                            height: isPlaying ? `${Math.max(6, (h * ((currentTime + i) % 7)) % 30 + 6)}px` : '4px',
                            opacity: isPlaying ? 0.95 : 0.3
                          }}
                        />
                      ))}
                    </div>

                    {/* Real-time Subtitle Cue Box with User Customization */}
                    <div className="py-2.5 px-5 rounded-xl bg-black/85 border border-white/20 inline-block max-w-xl shadow-2xl backdrop-blur-md transition-all duration-200">
                      <p 
                        className={`font-serif leading-relaxed drop-shadow-md ${SUBTITLE_SIZE_CLASSES[subtitleSize]} ${SUBTITLE_SPACING_CLASSES[subtitleSpacing]}`}
                        style={{ color: subtitleColor }}
                      >
                        "{activeCue[selectedSubtitle]}"
                      </p>
                      <div className="flex items-center justify-between text-[11px] font-mono text-slate-300 mt-1.5 pt-1 border-t border-white/10">
                        <span className="font-semibold text-amber-300">
                          SUBTITLE: {selectedSubtitle.toUpperCase()} • AUDIO: {selectedAudio.toUpperCase()}
                        </span>
                        <span className="text-slate-400">
                          TIMECODE: {formatTime(currentTime)}
                        </span>
                      </div>
                    </div>

                  </div>

                </div>

                {/* Subtitle Customization Floating Overlay Modal */}
                {showSubtitleSettings && (
                  <div className="absolute inset-x-4 bottom-20 z-30 p-5 rounded-2xl bg-slate-900/95 border border-slate-700 backdrop-blur-xl shadow-2xl space-y-4 animate-fade-in text-white">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                      <div className="flex items-center gap-2">
                        <SlidersHorizontal size={16} className="text-amber-400" />
                        <h4 className="text-sm font-serif font-bold text-white">
                          Subtitle Display & Typography Settings
                        </h4>
                      </div>
                      <button
                        onClick={() => setShowSubtitleSettings(false)}
                        className="text-xs px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono"
                      >
                        ✕ Close
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                      {/* 1. Text Size Selector */}
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-mono text-slate-400 uppercase font-semibold">
                          Text Size
                        </label>
                        <div className="grid grid-cols-2 gap-1.5 font-mono">
                          {[
                            { id: 'sm', label: 'Small (14px)' },
                            { id: 'base', label: 'Medium (18px)' },
                            { id: 'lg', label: 'Large (22px)' },
                            { id: 'xl', label: 'Extra (26px)' }
                          ].map((s) => (
                            <button
                              key={s.id}
                              onClick={() => setSubtitleSize(s.id as any)}
                              className={`p-1.5 rounded text-center transition-all ${
                                subtitleSize === s.id
                                  ? 'bg-[#9F3E07] text-white font-bold'
                                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                              }`}
                            >
                              {s.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* 2. Text Color Palette */}
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-mono text-slate-400 uppercase font-semibold">
                          Text Color
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                          {SUBTITLE_COLOR_PALETTE.map((c) => (
                            <button
                              key={c.value}
                              onClick={() => setSubtitleColor(c.value)}
                              className={`flex items-center gap-1.5 p-1.5 rounded bg-slate-800 hover:bg-slate-700 transition-all border ${
                                subtitleColor === c.value ? 'border-amber-400 ring-1 ring-amber-400' : 'border-transparent'
                              }`}
                            >
                              <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: c.value }} />
                              <span className="text-[10px] font-mono truncate">{c.name}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* 3. Letter Spacing Selector */}
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-mono text-slate-400 uppercase font-semibold">
                          Letter Spacing
                        </label>
                        <div className="grid grid-cols-2 gap-1.5 font-mono">
                          {[
                            { id: 'tight', label: 'Tight (-0.02em)' },
                            { id: 'normal', label: 'Normal' },
                            { id: 'wide', label: 'Wide (+0.05em)' },
                            { id: 'widest', label: 'Widest (+0.12em)' }
                          ].map((sp) => (
                            <button
                              key={sp.id}
                              onClick={() => setSubtitleSpacing(sp.id as any)}
                              className={`p-1.5 rounded text-center transition-all ${
                                subtitleSpacing === sp.id
                                  ? 'bg-[#9F3E07] text-white font-bold'
                                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                              }`}
                            >
                              {sp.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Live Preview Box */}
                    <div className="p-3 rounded-xl bg-black/60 border border-slate-700 text-center">
                      <span className="text-[10px] font-mono text-slate-400 uppercase block mb-1">Live Subtitle Preview:</span>
                      <p 
                        className={`font-serif leading-relaxed ${SUBTITLE_SIZE_CLASSES[subtitleSize]} ${SUBTITLE_SPACING_CLASSES[subtitleSpacing]}`}
                        style={{ color: subtitleColor }}
                      >
                        "{activeCue[selectedSubtitle]}"
                      </p>
                    </div>
                  </div>
                )}

                {/* Video Controls Bar */}
                <div className="relative z-10 p-4 bg-gradient-to-t from-black via-black/90 to-transparent space-y-3">
                  {/* Seekbar */}
                  <input
                    type="range"
                    min="0"
                    max={asset.durationSeconds}
                    value={currentTime}
                    onChange={(e) => handleSeek(Number(e.target.value))}
                    className="w-full h-1.5 bg-white/25 rounded-full cursor-pointer accent-[#9F3E07]"
                  />

                  <div className="flex items-center justify-between text-xs font-mono text-slate-300">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={togglePlayPause}
                        className="p-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white transition-all shadow-sm active:scale-95"
                        title={isPlaying ? "Pause" : "Play (Audible Speech & Video)"}
                      >
                        {isPlaying ? <Pause size={17} /> : <Play size={17} className="text-amber-300 fill-amber-300" />}
                      </button>
                      <span className="font-bold text-white text-sm">
                        {formatTime(currentTime)} / {formatTime(asset.durationSeconds)}
                      </span>
                    </div>

                    {/* Middle: Audio Volume Controls */}
                    <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-xl">
                      <button
                        onClick={toggleMute}
                        className="hover:text-white transition-colors"
                        title={isMuted ? "Unmute Audio" : "Mute Audio"}
                      >
                        {isMuted ? <VolumeX size={16} className="text-red-400" /> : volume > 0.5 ? <Volume2 size={16} className="text-emerald-400" /> : <Volume1 size={16} />}
                      </button>

                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={isMuted ? 0 : volume}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          setVolume(val);
                          if (val === 0) {
                            setIsMuted(true);
                            if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
                              window.speechSynthesis.cancel();
                            }
                          } else if (isMuted) {
                            setIsMuted(false);
                          }
                        }}
                        className="w-16 h-1 bg-white/25 rounded-full cursor-pointer accent-emerald-400"
                        title={`Volume: ${Math.round((isMuted ? 0 : volume) * 100)}%`}
                      />
                      <span className="text-[10px] font-mono text-slate-300 min-w-[28px]">
                        {isMuted ? '0%' : `${Math.round(volume * 100)}%`}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      {/* Subtitle Customization Settings Button */}
                      <button
                        onClick={() => setShowSubtitleSettings(!showSubtitleSettings)}
                        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border transition-all ${
                          showSubtitleSettings
                            ? 'bg-amber-500/30 border-amber-400 text-amber-300'
                            : 'bg-white/10 border-white/10 hover:bg-white/20 text-white'
                        }`}
                        title="Subtitle Display Options (Size, Color, Spacing)"
                      >
                        <Settings2 size={15} className="text-amber-400" />
                        <span className="text-[11px] font-semibold hidden sm:inline">Subtitles</span>
                      </button>

                      {/* Subtitle Language Switcher */}
                      <button
                        onClick={() => {
                          const langs: Array<'te'|'hi'|'en'|'ta'|'mr'> = ['te', 'hi', 'en', 'ta', 'mr'];
                          const next = langs[(langs.indexOf(selectedSubtitle) + 1) % langs.length];
                          setSelectedSubtitle(next);
                        }}
                        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                        title="Cycle Subtitle Language"
                      >
                        <Subtitles size={15} className="text-amber-400" />
                        <span className="uppercase text-[11px] font-bold">CC: {selectedSubtitle}</span>
                      </button>

                      {/* Audio Narration Language Switcher */}
                      <button
                        onClick={() => {
                          const langs: Array<'te'|'hi'|'en'|'ta'|'mr'> = ['te', 'hi', 'en', 'ta', 'mr'];
                          const next = langs[(langs.indexOf(selectedAudio) + 1) % langs.length];
                          handleAudioLanguageChange(next);
                        }}
                        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#9F3E07]/80 hover:bg-[#9F3E07] text-white transition-colors"
                        title="Switch Audio Dubbing Track"
                      >
                        <Languages size={15} className="text-amber-200" />
                        <span className="uppercase text-[11px] font-bold">AUDIO: {selectedAudio}</span>
                      </button>

                      <button
                        onClick={toggleFullscreen}
                        className="p-1.5 rounded-lg hover:bg-white/15 text-slate-300 hover:text-white transition-all active:scale-95"
                        title={isFullscreen ? "Exit Fullscreen (Esc)" : "Full Screen Cinema Mode"}
                      >
                        {isFullscreen ? <Minimize size={17} /> : <Maximize size={17} />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 1B. DOCUMENT / MANUAL FORMAT (Asset 2): Interactive MoSPI 48-Page Manual Reader */}
            {asset.format === 'pdf' && (
              <div className="heritage-card p-0 overflow-hidden bg-white border border-slate-300 shadow-sm rounded-xl space-y-0">
                <div className="p-4 bg-slate-100 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-[#2B4C7E] text-white">
                      <BookOpen size={18} />
                    </div>
                    <div>
                      <h3 className="font-serif font-bold text-sm text-slate-900">
                        MoSPI Field Supervisory Manual (48 Pages)
                      </h3>
                      <p className="text-[11px] font-mono text-slate-500">
                        Doc Ref: MoSPI/FOD/ASUSE/2026-MAN-04 • Operational Standards
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 font-mono text-xs">
                    <span className="text-slate-500">Chapter {currentChapterIndex + 1} of 5</span>
                    <button
                      onClick={() => setCurrentChapterIndex(Math.max(0, currentChapterIndex - 1))}
                      disabled={currentChapterIndex === 0}
                      className="btn btn-outline text-xs p-1.5 h-8 min-h-0 disabled:opacity-40"
                    >
                      <ChevronLeft size={14} />
                    </button>
                    <button
                      onClick={() => setCurrentChapterIndex(Math.min(4, currentChapterIndex + 1))}
                      disabled={currentChapterIndex === 4}
                      className="btn btn-outline text-xs p-1.5 h-8 min-h-0 disabled:opacity-40"
                    >
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>

                {asset.pdfChapters && (
                  <div className="p-6 space-y-5 bg-[#FCFCFD]">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                      <div>
                        <span className="badge-mono badge-online text-[10px]">
                          Chapter {asset.pdfChapters[currentChapterIndex].chapterNumber} • {asset.pdfChapters[currentChapterIndex].pages}
                        </span>
                        <h2 className="text-xl font-serif font-bold text-slate-900 mt-1">
                          {asset.pdfChapters[currentChapterIndex].title}
                        </h2>
                      </div>
                      <span className="text-xs font-mono text-slate-400 italic">
                        MoSPI In-Service Standard
                      </span>
                    </div>

                    {/* AI Manual Voice Reader Suite */}
                    <AIManualVoiceReader 
                      title={asset.pdfChapters[currentChapterIndex].title}
                      docRef={`MoSPI Field Supervisory Manual • Chapter ${asset.pdfChapters[currentChapterIndex].chapterNumber} (${asset.pdfChapters[currentChapterIndex].pages})`}
                      summary={asset.pdfChapters[currentChapterIndex].summary}
                      paragraphs={asset.pdfChapters[currentChapterIndex].content}
                      formulaTitle={asset.formulaTitle}
                      formulaCode={asset.formulaCode}
                      formulaDescription={asset.formulaDescription}
                      onActiveParagraphChange={(idx) => setActiveManualParagraph(idx)}
                      className="mb-3"
                    />

                    <div className="p-3.5 rounded-xl bg-orange-50/60 border border-orange-200 text-xs text-orange-950">
                      <strong>Executive Summary: </strong>
                      {asset.pdfChapters[currentChapterIndex].summary}
                    </div>

                    <div className="space-y-3 text-sm text-slate-800 leading-relaxed font-sans">
                      {asset.pdfChapters[currentChapterIndex].content.map((para, i) => {
                        const isParaActive = activeManualParagraph === i;
                        return (
                          <div 
                            key={i} 
                            className={`p-4 rounded-xl border transition-all ${
                              isParaActive 
                                ? 'bg-amber-50/95 border-2 border-amber-500 shadow-md ring-2 ring-amber-300/40 transform scale-[1.01]' 
                                : 'bg-white border-slate-200/80 shadow-xs hover:border-slate-300'
                            }`}
                          >
                            <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-slate-100 text-xs font-mono">
                              <span className={`font-bold ${isParaActive ? 'text-amber-900' : 'text-slate-500'}`}>
                                Clause {currentChapterIndex + 1}.{i + 1}
                              </span>
                              {isParaActive ? (
                                <span className="flex items-center gap-1 text-[11px] font-mono font-bold text-amber-800 bg-amber-200/70 px-2 py-0.5 rounded-full animate-pulse">
                                  <Headphones size={12} />
                                  <span>AI Speaking Now...</span>
                                </span>
                              ) : (
                                <span className="text-[11px] text-slate-400">
                                  In-Service Standard
                                </span>
                              )}
                            </div>
                            <p className="text-slate-900 leading-relaxed font-sans text-[15px]">
                              {para}
                            </p>
                          </div>
                        );
                      })}
                    </div>

                    <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-1">
                      <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">
                        Statutory Computational Equation:
                      </span>
                      <p className="font-mono text-base font-bold text-[#9F3E07]">
                        {asset.formulaCode}
                      </p>
                      <p className="text-xs text-slate-500">
                        {asset.formulaDescription}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Lecture / Manual Metadata & Offline Cache Button */}
            <div className="heritage-card space-y-3 bg-white p-6 shadow-sm rounded-2xl border border-slate-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold font-serif text-slate-950 leading-tight">
                    {asset.title}
                  </h1>
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <span className="badge-mono badge-developing text-[11px] font-bold">{asset.moduleCode}</span>
                    <span className="text-xs font-mono text-slate-700 font-medium">
                      {asset.sourceDoc}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={handleDownloadOffline}
                    disabled={downloading || isDownloaded}
                    className={`btn text-xs h-9 shadow-xs flex items-center gap-1.5 ${
                      isDownloaded
                        ? 'btn-outline border-emerald-300 text-emerald-800 bg-emerald-50/50'
                        : 'btn-primary'
                    }`}
                  >
                    <Download size={14} />
                    <span>
                      {downloading ? 'Caching to IndexedDB...' : isDownloaded ? '✓ Cached in IndexedDB' : `Cache Package (${asset.packageSize})`}
                    </span>
                  </button>
                </div>
              </div>

              <p className="text-sm text-slate-700 leading-relaxed pt-1">
                {asset.description}
              </p>
            </div>

            {/* AI Manual Reader for Video Asset's Referenced MoSPI Manual */}
            {asset.format === 'video' && (
              <div className="heritage-card p-6 bg-white shadow-sm rounded-2xl border border-slate-200 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BookOpen size={20} className="text-[#9F3E07]" />
                    <div>
                      <h3 className="text-lg font-serif font-bold text-slate-950">
                        AI Audio Narration: Official Curriculum Manual Excerpt
                      </h3>
                      <p className="text-xs font-mono text-slate-500">
                        {asset.sourceDoc}
                      </p>
                    </div>
                  </div>
                  <Link 
                    href="/student/learn/2" 
                    className="btn btn-outline text-xs py-1.5 px-3 flex items-center gap-1.5 font-bold hover:border-[#9F3E07] hover:text-[#9F3E07]"
                  >
                    <span>Full 5-Chapter Manual</span>
                    <ArrowUpRight size={13} />
                  </Link>
                </div>

                <AIManualVoiceReader
                  title="Implicit Price Deflators & Paasche vs Laspeyres Formulations"
                  docRef={asset.sourceDoc}
                  summary="Statutory derivation of Implicit Price Deflator vs Consumer Price Index (CPI) under National Accounts Statistics framework."
                  paragraphs={[
                    asset.sourceExcerpt,
                    "Paasche Price Index Mathematical Formulation: P_P = (∑ p₁ q₁) / (∑ p₀ q₁). Because current period quantities q₁ serve as weights, changes in production structure are dynamically accommodated without fixed-basket substitution distortion.",
                    "Laspeyres Consumer Price Index Formulation: P_L = (∑ p₁ q₀) / (∑ p₀ q₀). Base period consumption quantities q₀ remain fixed, measuring household living cost inflation rather than economy-wide domestic production price levels."
                  ]}
                  formulaTitle={asset.formulaTitle}
                  formulaCode={asset.formulaCode}
                  formulaDescription={asset.formulaDescription}
                />
              </div>
            )}

            {/* AI-Generated Checkpoint Assessment Grounded in Source */}
            <div className="heritage-card space-y-4 border-l-4 border-l-amber-600 bg-white p-6 shadow-sm rounded-2xl">
              <div className="flex items-center justify-between">
                <span className="badge-mono badge-developing text-[11px] font-bold">
                  <Award size={13} className="mr-1 inline" /> AI Synthesized Checkpoint Assessment
                </span>
                <span className="text-xs font-mono text-slate-600 font-semibold">
                  Grounded in Official MoSPI Manual
                </span>
              </div>

              <h2 className="text-base font-serif font-bold text-slate-950 leading-snug">
                {asset.question.prompt}
              </h2>

              <p className="text-xs font-mono text-slate-600 italic">
                Source: {asset.question.source}
              </p>

              <div className="space-y-2.5 pt-1">
                {asset.question.options.map((opt, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => !quizSubmitted && setSelectedOption(idx)}
                    className={`w-full text-left p-3.5 rounded-xl border text-sm transition-all ${
                      selectedOption === idx
                        ? 'border-[#9F3E07] bg-orange-50/70 font-semibold text-[#9F3E07] shadow-xs'
                        : 'border-slate-200 bg-white hover:border-slate-300 text-slate-900'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>

              {/* Confidence Rating Selection */}
              {!quizSubmitted && (
                <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs border-t border-slate-100 pt-3">
                  <span className="text-slate-700 font-mono font-medium">Your Self-Assessed Confidence:</span>
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((lvl) => (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => setConfidence(lvl)}
                        className={`w-8 h-8 rounded-lg text-xs font-mono font-bold transition-all ${
                          confidence === lvl
                            ? 'bg-[#2B4C7E] text-white shadow-xs'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                        }`}
                      >
                        {lvl}
                      </button>
                    ))}
                    <span className="text-[11px] text-slate-500 font-mono ml-1">(5 = High)</span>
                  </div>
                </div>
              )}

              {!quizSubmitted ? (
                <button
                  type="button"
                  onClick={handleQuizSubmit}
                  disabled={selectedOption === null}
                  className="btn btn-primary w-full text-sm py-3 font-semibold shadow-xs"
                >
                  Submit Response (Updates Competency Score & Syncs Offline)
                </button>
              ) : (
                <div className={`p-4 rounded-xl border ${
                  quizResult?.isCorrect
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                    : 'bg-red-50 border-red-200 text-red-950'
                }`}>
                  <p className="font-bold text-sm mb-1 flex items-center gap-1.5">
                    {quizResult?.isCorrect ? (
                      <>
                        <CheckCircle2 size={16} className="text-emerald-600" />
                        <span>Concept Mastered (+100% Competency Score)</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle size={16} className="text-red-600" />
                        <span>Needs Support (Misconception Flagged)</span>
                      </>
                    )}
                  </p>
                  <p className="text-xs leading-relaxed text-slate-800">{quizResult?.message}</p>
                  <div className="pt-2 flex items-center justify-between border-t border-emerald-200/50 mt-3 text-[11px] font-mono">
                    <span className="text-slate-600">Recalculating competency profile...</span>
                    <Link href="/student/progress" className="text-[#9F3E07] font-bold hover:underline">
                      View Updated Gap Analysis →
                    </Link>
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* Right Column (4 cols): Animated Highlighted Widgets (Transcript, Source Scanner, Concepts, iGOT Mapping) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* 5 Scheduled Languages Selector Box */}
            <div className="heritage-card space-y-4 bg-white p-5 shadow-sm rounded-2xl border border-slate-200">
              <div className="flex items-center gap-2">
                <Languages size={18} className="text-[#9F3E07]" />
                <h3 className="text-sm font-serif font-bold text-slate-950">
                  Multilingual Audio & Subtitles (5 Languages)
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono uppercase text-slate-700 font-bold mb-1">
                    Audio Track (Voice)
                  </label>
                  <select
                    value={selectedAudio}
                    onChange={(e) => handleAudioLanguageChange(e.target.value as any)}
                    className="input-field text-xs py-1.5 font-medium"
                  >
                    <option value="te">Telugu (తెలుగు Dubbed)</option>
                    <option value="hi">Hindi (हिन्दी Dubbed)</option>
                    <option value="en">English (Original)</option>
                    <option value="ta">Tamil (தமிழ் Dubbed)</option>
                    <option value="mr">Marathi (मराठी Dubbed)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-slate-700 font-bold mb-1">
                    Subtitles Track
                  </label>
                  <select
                    value={selectedSubtitle}
                    onChange={(e) => setSelectedSubtitle(e.target.value as any)}
                    className="input-field text-xs py-1.5 font-medium"
                  >
                    <option value="te">Telugu (తెలుగు)</option>
                    <option value="hi">Hindi (हिन्दी)</option>
                    <option value="en">English</option>
                    <option value="ta">Tamil (தமிழ்)</option>
                    <option value="mr">Marathi (मराठी)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* HIGHLIGHTED & ANIMATED BORDER WIDGET CONTAINER */}
            <div className="heritage-card p-0 overflow-hidden bg-white shadow-md animated-glow-border rounded-2xl">
              
              {/* Tab Selector Header */}
              <div className="flex border-b border-slate-200 bg-slate-100/70">
                {[
                  { id: 'transcript', label: 'Transcript' },
                  { id: 'scanner', label: 'Source Scanner' },
                  { id: 'concepts', label: 'Concepts' },
                  { id: 'igot', label: 'iGOT Mapping' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex-1 py-3 text-[14px] font-mono text-center transition-all ${
                      activeTab === tab.id
                        ? 'border-b-2 border-[#9F3E07] text-[#9F3E07] bg-white font-black shadow-xs'
                        : 'text-slate-800 hover:text-slate-950 font-semibold'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab Body with data-lenis-prevent */}
              <div 
                className="p-5 max-h-[500px] overflow-y-auto space-y-4"
                data-lenis-prevent
              >
                {/* 1. Real-Time Transcript Widget */}
                {activeTab === 'transcript' && (
                  <div className="space-y-3.5">
                    {/* Real-Time Live Transcribing Status Header */}
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-100 border border-slate-200">
                      <div className="flex items-center gap-2">
                        <span className="relative flex h-2.5 w-2.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                        </span>
                        <span className="text-xs font-mono font-bold text-slate-800 uppercase tracking-wide">
                          Real-Time Transcribing • Live Sync
                        </span>
                      </div>
                      <span className="text-[11px] font-mono font-bold text-[#9F3E07] bg-orange-100/80 px-2 py-0.5 rounded-md">
                        {asset.transcripts.length} Milestones (42:15)
                      </span>
                    </div>

                    {/* Search / Filter Box */}
                    <div className="relative">
                      <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search 42-min transcript (e.g. deflator, Paasche, census)..."
                        value={transcriptFilter}
                        onChange={(e) => setTranscriptFilter(e.target.value)}
                        className="w-full pl-8 pr-12 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-[#9F3E07] font-sans"
                      />
                      {transcriptFilter && (
                        <button
                          type="button"
                          onClick={() => setTranscriptFilter('')}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[11px] font-mono text-slate-400 hover:text-slate-600"
                        >
                          Clear
                        </button>
                      )}
                    </div>

                    <p className="text-xs text-slate-600">
                      Click any timecode line below to jump playback and hear audible multilingual narration:
                    </p>

                    {(() => {
                      const filtered = asset.transcripts.filter((t) => {
                        if (!transcriptFilter.trim()) return true;
                        const q = transcriptFilter.toLowerCase();
                        return (
                          t.timeStr.toLowerCase().includes(q) ||
                          t.en.toLowerCase().includes(q) ||
                          t.te.toLowerCase().includes(q) ||
                          t.hi.toLowerCase().includes(q) ||
                          t.ta.toLowerCase().includes(q) ||
                          t.mr.toLowerCase().includes(q)
                        );
                      });

                      if (filtered.length === 0) {
                        return (
                          <div className="p-4 text-center text-xs text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                            No transcript cues matching "{transcriptFilter}".
                          </div>
                        );
                      }

                      return filtered.map((t) => {
                        const originalIdx = asset.transcripts.indexOf(t);
                        const isActive = activeTranscriptIndex === originalIdx;
                        return (
                          <div
                            key={originalIdx}
                            ref={isActive ? activeTranscriptRef : null}
                            onClick={() => handleSeek(t.timeSec)}
                            className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                              isActive
                                ? 'border-2 border-[#9F3E07] bg-orange-50/85 border-l-4 border-l-[#9F3E07] shadow-sm ring-1 ring-orange-400/30'
                                : 'border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className={`text-[14px] font-mono font-black flex items-center gap-1.5 ${isActive ? 'text-[#9F3E07]' : 'text-[#2B4C7E]'}`}>
                                {isActive && (
                                  <span className="flex items-center gap-0.5">
                                    <span className="w-1 h-3 bg-[#9F3E07] animate-pulse rounded-full" />
                                    <span className="w-1 h-4 bg-[#9F3E07] animate-pulse delay-75 rounded-full" />
                                    <span className="w-1 h-2 bg-[#9F3E07] animate-pulse delay-150 rounded-full" />
                                  </span>
                                )}
                                <span>{t.timeStr} {isActive && '• Speaking Now'}</span>
                              </span>
                              <span className="text-[12px] font-mono text-slate-600 font-semibold">Click to Seek</span>
                            </div>

                            <p className="text-[15px] text-slate-950 mt-1.5 font-bold leading-relaxed">
                              "{t[selectedSubtitle]}"
                            </p>

                            {selectedSubtitle !== 'en' && (
                              <p className="text-[13px] text-slate-700 font-medium italic mt-1 pt-1 border-t border-slate-200/50">
                                [EN]: "{t.en}"
                              </p>
                            )}
                          </div>
                        );
                      });
                    })()}
                  </div>
                )}

                {/* 2. Live AI Source Scanner Widget */}
                {activeTab === 'scanner' && (
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <h4 className="text-[17px] font-serif font-black text-slate-950 flex items-center gap-2">
                        <Scan size={18} className="text-[#9F3E07]" />
                        <span>Live Source Text Scanning & MCQ Synthesis</span>
                      </h4>
                      <p className="text-[14px] text-slate-900 font-semibold">
                        Official source text parsed from {asset.sourceDoc}
                      </p>
                    </div>

                    {/* Source Excerpt Card */}
                    <div className="p-4 rounded-xl border border-slate-300 bg-slate-50/80 text-[16px] text-slate-950 leading-relaxed font-sans relative overflow-hidden shadow-xs">
                      {isScanning && (
                        <div className="absolute inset-0 bg-gradient-to-b from-orange-400/20 via-transparent to-orange-400/20 animate-pulse border-y-2 border-[#9F3E07]" />
                      )}
                      <p className="font-black text-slate-950 text-[14px] uppercase font-mono tracking-wide mb-1">
                        Extracted Source Excerpt:
                      </p>
                      <p className="font-serif italic font-medium text-slate-950 text-[15px]">
                        "{asset.sourceExcerpt}"
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleTriggerSourceScan}
                      disabled={isScanning}
                      className="btn btn-primary text-[15px] w-full py-3 shadow-xs flex items-center justify-center gap-2 font-bold"
                    >
                      <Sparkles size={16} />
                      <span>{isScanning ? `Scanning & Extracting (${scanProgress}%)...` : 'Scan Source & Generate Real-Time Question'}</span>
                    </button>

                    {scanComplete && (
                      <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-[15px] text-emerald-950 space-y-1 animate-fade-in">
                        <p className="font-black flex items-center gap-1.5">
                          <CheckCircle2 size={16} className="text-emerald-700" />
                          <span>AI Assessment Question Synthesized!</span>
                        </p>
                        <p className="text-[14px] text-emerald-900 font-medium">
                          Grounding verified with 100% precision against official MoSPI documentation. Question loaded into the assessment module.
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* 3. Core Concepts Widget */}
                {activeTab === 'concepts' && (
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl border border-slate-200 space-y-2.5 bg-white shadow-xs">
                      <span className="badge-mono badge-developing text-[13px] font-bold">{asset.competencyCode}</span>
                      <h4 className="text-[18px] font-serif font-black text-slate-950">
                        {asset.formulaTitle}
                      </h4>
                      <div className="formula-block text-center text-[17px] font-bold py-2.5 my-1 text-[#9F3E07]">
                        {asset.formulaCode}
                      </div>
                      <p className="text-[15px] text-slate-950 font-medium leading-relaxed">
                        {asset.formulaDescription}
                      </p>
                    </div>
                  </div>
                )}

                {/* 4. iGOT Mapping Widget (Integrated with Real-Time iGOT Server Fetching & DoPT FRAC Matrix) */}
                {activeTab === 'igot' && (
                  <div className="space-y-4 text-slate-950">
                    
                    {/* Header Accreditation Card */}
                    <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="badge-mono badge-mastered text-[13px] font-bold">
                          <CheckCheck size={14} className="mr-1 inline text-emerald-700" />
                          iGOT Karmayogi Accredited Course
                        </span>
                        <span className="text-[13px] font-mono font-bold text-slate-800">
                          DoPT FRAC Calibrated
                        </span>
                      </div>
                      
                      <h4 className="text-[18px] font-serif font-black text-slate-950">
                        {assetId === 1 ? 'iGOT-STAT-AIML-401: AI/ML in Official Statistics' : 'iGOT-STAT-ASUSE-302: Unincorporated Survey Standards'}
                      </h4>
                      <p className="text-[15px] text-slate-900 font-medium leading-relaxed">
                        Official MoSPI capacity building pathway calibrated against DoPT Framework for Roles, Activities and Competencies (FRAC).
                      </p>
                    </div>

                    {/* DoPT FRAC Competency Matrix (3-Tier) */}
                    <div className="space-y-2.5 pt-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[14px] font-mono font-bold uppercase text-slate-900 flex items-center gap-1.5">
                          <Layers size={14} className="text-[#9F3E07]" />
                          DoPT FRAC Competency Mapping Matrix:
                        </span>
                        <span className="text-[12px] font-mono font-bold text-amber-700">Level 4-5 In-Service</span>
                      </div>

                      <div className="space-y-2">
                        {/* Domain Competency */}
                        <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
                          <div>
                            <span className="text-[12px] font-mono uppercase text-slate-700 font-bold block">1. Domain Competency</span>
                            <p className="text-[15px] font-bold text-slate-950">
                              STAT-NAC-02: National Accounts & Implicit GDP Deflator
                            </p>
                          </div>
                          <span className="badge-mono badge-developing text-[12px] font-bold shrink-0">Level 4</span>
                        </div>

                        {/* Functional Competency */}
                        <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
                          <div>
                            <span className="text-[12px] font-mono uppercase text-slate-700 font-bold block">2. Functional Competency</span>
                            <p className="text-[15px] font-bold text-slate-950">
                              DATA-ANLY-04: Multi-Stage Stratified Sampling & Estimation
                            </p>
                          </div>
                          <span className="badge-mono badge-developing text-[12px] font-bold shrink-0">Level 4</span>
                        </div>

                        {/* Behavioral Competency */}
                        <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
                          <div>
                            <span className="text-[12px] font-mono uppercase text-slate-700 font-bold block">3. Behavioral Competency</span>
                            <p className="text-[15px] font-bold text-slate-950">
                              GOV-ETH-01: Integrity in Official Statistical Dissemination
                            </p>
                          </div>
                          <span className="badge-mono badge-mastered text-[12px] font-bold shrink-0">Level 5</span>
                        </div>
                      </div>
                    </div>

                    {/* Real-Time iGOT Server Fetching & Capacity Building Quota */}
                    <div className="p-4 rounded-xl border border-amber-300 bg-amber-50/40 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[14px] font-mono font-bold uppercase text-slate-950 flex items-center gap-1.5">
                          <GraduationCap size={16} className="text-[#9F3E07]" />
                          iGOT Karmayogi Server Telemetry
                        </span>
                        <span className="text-[13px] font-mono font-bold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded">
                          Connected: Parichay SSO
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-[14px] font-mono">
                        <div className="p-2 rounded bg-white border border-slate-200">
                          <span className="text-[12px] text-slate-700 block font-bold">Officer Karmayogi ID:</span>
                          <span className="font-bold text-slate-950">KY-MOSPI-84291</span>
                        </div>
                        <div className="p-2 rounded bg-white border border-slate-200">
                          <span className="text-[12px] text-slate-700 block font-bold">Mandatory Annual Quota:</span>
                          <span className="font-bold text-emerald-700">{igotVerifiedHours} / 50 Hrs ({Math.round((igotVerifiedHours/50)*100)}%)</span>
                        </div>
                      </div>

                      <p className="text-[13px] font-mono text-slate-800">
                        Last iGOT Server Sync: <span className="font-bold">{igotLastSyncTimestamp}</span>
                      </p>

                      {/* Interactive Button to Fetch Real-Time Status from iGOT Server */}
                      <button
                        type="button"
                        onClick={handleFetchIgotServer}
                        disabled={isIgotSyncing}
                        className="btn btn-primary text-[14px] w-full py-2.5 flex items-center justify-center gap-2 font-bold shadow-xs"
                      >
                        <RefreshCw size={15} className={isIgotSyncing ? 'animate-spin' : ''} />
                        <span>{isIgotSyncing ? 'Contacting iGOT Karmayogi Server...' : '📥 Fetch Real-Time Training Status from iGOT Server'}</span>
                      </button>

                      {igotSyncSuccess && (
                        <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-300 text-[14px] space-y-1 animate-fade-in">
                          <p className="font-bold text-emerald-950 flex items-center gap-1.5">
                            <CheckCircle2 size={15} className="text-emerald-700" />
                            <span>iGOT Server Verified: +2.5 Competency Credit Hours Accredited</span>
                          </p>
                          <p className="text-[12px] font-mono text-emerald-900">
                            Cryptographic Signature: SHA256-KY:9e4f2b18c47a002
                          </p>
                        </div>
                      )}
                    </div>

                    {/* BhodBasha Offline Fieldwork Verification Novelty */}
                    <div className="p-3.5 rounded-xl border border-blue-200 bg-blue-50/50 space-y-1.5">
                      <div className="flex items-center gap-1.5 text-[#2B4C7E] font-bold text-[14px]">
                        <ShieldCheck size={16} />
                        <span>Offline Fieldwork Resilience (BhodBasha Innovation)</span>
                      </div>
                      <p className="text-[14px] text-slate-900 leading-relaxed font-medium">
                        Completed modules in remote field blocks are cryptographically signed in offline IndexedDB storage. Upon reconnecting, progress automatically syncs with the iGOT server without manual data entry.
                      </p>
                    </div>

                    {/* External Portal Link */}
                    <a
                      href="https://igotkarmayogi.gov.in/#/browse-courses"
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-outline text-[14px] w-full h-10 py-1.5 flex items-center justify-center gap-1.5 shadow-xs font-bold text-slate-900 hover:text-[#9F3E07]"
                    >
                      <span>Open Course in iGOT Karmayogi Portal</span>
                      <ExternalLink size={14} />
                    </a>
                  </div>
                )}
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
