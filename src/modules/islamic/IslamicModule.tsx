import React, { useState } from 'react';
import { Routes, Route, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  Moon, 
  Book, 
  Scroll, 
  History, 
  Sparkles, 
  ArrowRight, 
  PlayCircle,
  Search,
  Target
} from 'lucide-react';
import { MORNING_AZKAR, EVENING_AZKAR, SLEEP_AZKAR, POST_PRAYER_AZKAR } from './data/azkar';
import { ARTICLES } from './data/articles';

// --- Mock Data ---
const SURAHS = [
  { id: 1, name: 'الفاتحة', verses: 7, type: 'مكية' },
  { id: 2, name: 'البقرة', verses: 286, type: 'مدنية' },
  { id: 3, name: 'آل عمران', verses: 200, type: 'مدنية' },
  { id: 18, name: 'الكهف', verses: 110, type: 'مكية' },
  { id: 36, name: 'يس', verses: 83, type: 'مكية' },
  { id: 55, name: 'الرحمن', verses: 78, type: 'مدنية' },
  { id: 67, name: 'الملك', verses: 30, type: 'مكية' },
];

const AZKAR_CATEGORIES = [
  { id: 'morning', title: 'أذكار الصباح', count: MORNING_AZKAR.length, data: MORNING_AZKAR },
  { id: 'evening', title: 'أذكار المساء', count: EVENING_AZKAR.length, data: EVENING_AZKAR },
  { id: 'sleep', title: 'أذكار النوم', count: SLEEP_AZKAR.length, data: SLEEP_AZKAR },
  { id: 'prayer', title: 'أذكار الصلاة', count: POST_PRAYER_AZKAR.length, data: POST_PRAYER_AZKAR },
];

const HADITHS = [
  {
    id: 1,
    hadith: "إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى، فَمَنْ كَانَتْ هِجْرَتُهُ إِلَى دُنْيَا يُصِيبُهَا، أَوْ إِلَى امْرَأَةٍ يَنْكِحُهَا، فَهِجْرَتُهُ إِلَى مَا هَاجَرَ إِلَيْهِ.",
    narrator: "عمر بن الخطاب رضي الله عنه",
    source: "صحيح البخاري (1) وصحيح مسلم (1907)",
    explanation: "يبين هذا الحديث العظيم أن أساس قبول الأعمال عند الله تعالى هو النية الخالصة. فالعمل الصالح لا يقبل إلا إذا كان خالصاً لوجه الله، والنية هي التي تميز بين العادة والعبادة. فمن قصد بعمله وجه الله نال الأجر، ومن قصد الدنيا أو الرياء حبط عمله ولم ينل سوى ما نواه.",
    benefits: [
      "أهمية الإخلاص في كل الأعمال والأقوال",
      "النية الصادقة تميز العبادات عن العادات اليومية",
      "مدار الثواب والعقاب عند الله يعتمد على نية القلب"
    ],
    category: "العبادة"
  },
  {
    id: 2,
    hadith: "إِنَّ الصِّدْقَ يَهْدِي إِلَى الْبِرِّ، وَإِنَّ الْبِرَّ يَهْدِي إِلَى الْجَنَّةِ، وَإِنَّ الرَّجُلَ لَيَصْدُقُ حَتَّى يُكْتَبَ عِنْدَ اللَّهِ صِدِّيقًا.",
    narrator: "عبد الله بن مسعود رضي الله عنه",
    source: "صحيح البخاري (6094) وصحيح مسلم (2607)",
    explanation: "يحثنا النبي صلى الله عليه وسلم على الالتزام بالصدق في الأقوال والأفعال، مبيناً أن الصدق طريق يوصل إلى كل عمل صالح (البر)، والبر طريق يوصل إلى الجنة. ويحذرنا من الكذب لأنه يقود إلى الفجور والهلاك، ومن اعتاد الصدق كُتب عند الله في أعلى مراتب الصالحين.",
    benefits: [
      "الصدق طريق النجاة وسبب رئيسي لدخول الجنة",
      "التحذير الشديد من الكذب وعواقبه الوخيمة في الدنيا والآخرة",
      "الأعمال الصالحة تقود إلى بعضها البعض وتزيد الإيمان"
    ],
    category: "الصدق"
  },
  {
    id: 3,
    hadith: "عَجَبًا لأَمْرِ الْمُؤْمِنِ، إِنَّ أَمْرَهُ كُلَّهُ خَيْرٌ، وَلَيْسَ ذَاكَ لأَحَدٍ إِلاَّ لِلْمُؤْمِنِ، إِنْ أَصَابَتْهُ سَرَّاءُ شَكَرَ فَكَانَ خَيْرًا لَهُ، وَإِنْ أَصَابَتْهُ ضَرَّاءُ صَبَرَ فَكَانَ خَيْرًا لَهُ.",
    narrator: "صهيب الرومي رضي الله عنه",
    source: "صحيح مسلم (2999)",
    explanation: "يصور الحديث حالة المؤمن الفريدة في تعامله مع أقدار الله. فالمؤمن في ربح دائم، إن أصابته نعمة شكر الله فكان خيراً له وزيد في أجره، وإن أصابته مصيبة صبر واحتسب الأجر فكان خيراً له. وهذا الرضا والتسليم لا يتوفر إلا لمن امتلأ قلبه بالإيمان الصادق.",
    benefits: [
      "وجوب الصبر عند البلاء والشكر عند الرخاء",
      "كل قضاء يقضيه الله للمؤمن هو خير له في النهاية",
      "فضل الإيمان في تحقيق السعادة النفسية والطمأنينة"
    ],
    category: "الصبر"
  },
  {
    id: 4,
    hadith: "مَنْ لا يَرْحَمُ لا يُرْحَمُ.",
    narrator: "أبو هريرة رضي الله عنه",
    source: "صحيح البخاري (5997) وصحيح مسلم (2318)",
    explanation: "قاعدة عظيمة في التعامل مع الخلق، فمن نزعت الرحمة من قلبه تجاه الناس والحيوانات والضعفاء، فإنه يُحرم من رحمة الله تعالى يوم القيامة. فالجزاء من جنس العمل، ورحمة الله قريبة من المحسنين الرحماء الذين يعطفون على غيرهم.",
    benefits: [
      "الحث على التراحم والتعاطف بين جميع الناس",
      "الجزاء من جنس العمل في الإسلام",
      "رحمة المخلوقين سبب لنيل رحمة الخالق سبحانه"
    ],
    category: "الأخلاق"
  },
  {
    id: 5,
    hadith: "لا يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ.",
    narrator: "أنس بن مالك رضي الله عنه",
    source: "صحيح البخاري (13) وصحيح مسلم (45)",
    explanation: "ينفي الحديث كمال الإيمان عن المسلم حتى يتمنى لإخوانه المسلمين من الخير والنجاح والتوفيق مثل ما يتمناه لنفسه تماماً. وهذا يقتضي سلامة الصدر من الحسد والحقد، والحرص على نفع الآخرين ومشاركتهم الفرحة والنجاح.",
    benefits: [
      "علامة كمال الإيمان هي حب الخير للآخرين",
      "تحريم الحسد والأنانية وتمني زوال النعمة عن الغير",
      "بناء مجتمع إسلامي متماسك ومتحاب يشد بعضه بعضاً"
    ],
    category: "الأخلاق"
  },
  {
    id: 6,
    hadith: "مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الآخِرِ فَلْيَقُلْ خَيْرًا أَوْ لِيَصْمُتْ، وَمَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الآخِرِ فَلْيُكْرِمْ جَارَهُ، وَمَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الآخِرِ فَلْيُكْرِمْ ضَيْفَهُ.",
    narrator: "أبو هريرة رضي الله عنه",
    source: "صحيح البخاري (6018) وصحيح مسلم (47)",
    explanation: "يربط النبي صلى الله عليه وسلم بين الإيمان بالله واليوم الآخر وبين حفظ اللسان وحسن الجوار وإكرام الضيف. فالمؤمن يزن كلماته قبل النطق بها، فإن كانت خيراً تكلم، وإن كانت شراً أو لغواً سكت، كما يكرم ضيفه ويحسن إلى جاره امتثالاً لأمر الله.",
    benefits: [
      "أهمية حفظ اللسان من الغيبة والنميمة وفاحش القول",
      "إكرام الضيف والإحسان للجار من علامات صدق الإيمان",
      "الربط الوثيق بين العقيدة (الإيمان) والسلوك (الأخلاق)"
    ],
    category: "المعاملات"
  },
  {
    id: 7,
    hadith: "لَيْسَ الشَّدِيدُ بِالصُّرَعَةِ، إِنَّمَا الشَّدِيدُ الَّذِي يَمْلِكُ نَفْسَهُ عِنْدَ الْغَضَبِ.",
    narrator: "أبو هريرة رضي الله عنه",
    source: "صحيح البخاري (6114) وصحيح مسلم (2609)",
    explanation: "يصحح النبي صلى الله عليه وسلم المفهوم الخاطئ للقوة، فالقوة الحقيقية ليست في التغلب على الآخرين في المصارعة والقتال البدني، بل القوة الحقيقية تكمن في جهاد النفس والسيطرة عليها عند الغضب، وكبح جماحها عن التهور والإيذاء.",
    benefits: [
      "الحث على الحلم وضبط النفس في المواقف الصعبة",
      "القوة الحقيقية هي قوة الإرادة والأخلاق وليست قوة العضلات",
      "التحذير من الغضب وعواقبه الوخيمة على الفرد والمجتمع"
    ],
    category: "الصبر"
  },
  {
    id: 8,
    hadith: "الطُّهُورُ شَطْرُ الإِيمَانِ، وَالْحَمْدُ لِلَّهِ تَمْلأُ الْمِيزَانَ، وَسُبْحَانَ اللَّهِ وَالْحَمْدُ لِلَّهِ تَمْلآنِ مَا بَيْنَ السَّمَاوَاتِ وَالأَرْضِ.",
    narrator: "أبو مالك الأشعري رضي الله عنه",
    source: "صحيح مسلم (223)",
    explanation: "يبين الحديث فضل الطهارة الحسية (الوضوء والنظافة) والمعنوية (طهارة القلب) وأنها نصف الإيمان. كما يوضح عظم أجر ذكر الله، فكلمة 'الحمد لله' تملأ ميزان العبد بالحسنات، وتسبيح الله وتحميده يملأ الكون بالأجر والبركة.",
    benefits: [
      "أهمية النظافة والطهارة ومكانتها العالية في الإسلام",
      "عظم ثواب الحمد والتسبيح والمداومة على ذكر الله",
      "الأعمال الصالحة لها وزن حقيقي في ميزان يوم القيامة"
    ],
    category: "العبادة"
  },
  {
    id: 9,
    hadith: "أَرَأَيْتُمْ لَوْ أَنَّ نَهْرًا بِبَابِ أَحَدِكُمْ يَغْتَسِلُ مِنْهُ كُلَّ يَوْمٍ خَمْسَ مَرَّاتٍ، هَلْ يَبْقَى مِنْ دَرَنِهِ شَيْءٌ؟ قَالُوا: لا يَبْقَى مِنْ دَرَنِهِ شَيْءٌ، قَالَ: فَذَلِكَ مَثَلُ الصَّلَوَاتِ الْخَمْسِ، يَمْحُو اللَّهُ بِهِنَّ الْخَطَايَا.",
    narrator: "أبو هريرة رضي الله عنه",
    source: "صحيح البخاري (528) وصحيح مسلم (667)",
    explanation: "يضرب النبي صلى الله عليه وسلم مثلاً رائعاً لتوضيح فضل الصلوات الخمس، فشبهها بنهر جارٍ أمام بيت المسلم يغتسل فيه خمس مرات يومياً فلا يبقى من وسخه شيء. كذلك الصلوات الخمس تمحو الذنوب والخطايا وتطهر الروح باستمرار.",
    benefits: [
      "فضل الصلوات الخمس في تكفير الذنوب الصغائر",
      "أهمية المحافظة على الصلاة في أوقاتها لتطهير النفس",
      "استخدام أسلوب ضرب الأمثال لتقريب المعاني وتوضيحها"
    ],
    category: "العبادة"
  },
  {
    id: 10,
    hadith: "مَنْ نَفَّسَ عَنْ مُؤْمِنٍ كُرْبَةً مِنْ كُرَبِ الدُّنْيَا نَفَّسَ اللَّهُ عَنْهُ كُرْبَةً مِنْ كُرَبِ يَوْمِ الْقِيَامَةِ... وَاللَّهُ فِي عَوْنِ الْعَبْدِ مَا كَانَ الْعَبْدُ فِي عَوْنِ أَخِيهِ.",
    narrator: "أبو هريرة رضي الله عنه",
    source: "صحيح مسلم (2699)",
    explanation: "حديث عظيم يحث على التعاون وقضاء حوائج الناس. فمن سعى في مساعدة أخيه المسلم وتفريج كربته، كافأه الله بأن يكون في عونه وييسر أموره ويفرج كرباته في أهوال يوم القيامة، فالجزاء دائماً يكون من جنس العمل.",
    benefits: [
      "الحث على مساعدة الآخرين وقضاء حوائجهم المادية والمعنوية",
      "من أعان الناس أعانه الله ويسر له أموره",
      "تعزيز روح التكافل والتضامن في المجتمع الإسلامي"
    ],
    category: "المعاملات"
  },
  {
    id: 11,
    hadith: "الْمُسْلِمُ مَنْ سَلِمَ الْمُسْلِمُونَ مِنْ لِسَانِهِ وَيَدِهِ، وَالْمُهَاجِرُ مَنْ هَجَرَ مَا نَهَى اللَّهُ عَنْهُ.",
    narrator: "عبد الله بن عمرو رضي الله عنهما",
    source: "صحيح البخاري (10) وصحيح مسلم (40)",
    explanation: "يعرف النبي صلى الله عليه وسلم المسلم الحق بأنه من يكف أذاه عن الناس، فلا يؤذيهم بلسانه كالشتم والغيبة والنميمة، ولا يؤذيهم بيده كالضرب والسرقة والاعتداء. والمهاجر الحقيقي هو من ترك الذنوب والمعاصي وابتعد عنها.",
    benefits: [
      "تحريم إيذاء المسلمين بالقول أو الفعل",
      "المسلم الحقيقي هو مصدر أمان وسلام لمجتمعه",
      "الهجرة الحقيقية المستمرة هي هجرة الذنوب والمعاصي"
    ],
    category: "الأخلاق"
  },
  {
    id: 12,
    hadith: "رَغِمَ أَنْفُ، ثُمَّ رَغِمَ أَنْفُ، ثُمَّ رَغِمَ أَنْفُ، قِيلَ: مَنْ يَا رَسُولَ اللَّهِ؟ قَالَ: مَنْ أَدْرَكَ أَبَوَيْهِ عِنْدَ الْكِبَرِ، أَحَدَهُمَا أَوْ كِلَيْهِمَا فَلَمْ يَدْخُلِ الْجَنَّةَ.",
    narrator: "أبو هريرة رضي الله عنه",
    source: "صحيح مسلم (2551)",
    explanation: "يدعو النبي صلى الله عليه وسلم بالخسارة والذل على من أدرك والديه في حالة الكبر والضعف، ولم يغتنم هذه الفرصة العظيمة لبرهما والإحسان إليهما ليكون ذلك سبباً في دخوله الجنة. فبر الوالدين من أعظم وأسهل أبواب الجنة.",
    benefits: [
      "عظم حق الوالدين خاصة في مرحلة الكبر والضعف",
      "بر الوالدين طريق مضمون ومختصر لدخول الجنة",
      "التحذير الشديد من عقوق الوالدين أو إهمالهما"
    ],
    category: "بر الوالدين"
  },
  {
    id: 13,
    hadith: "يُسْتَجَابُ لأَحَدِكُمْ مَا لَمْ يَعْجَلْ، يَقُولُ: دَعَوْتُ فَلَمْ يُسْتَجَبْ لِي.",
    narrator: "أبو هريرة رضي الله عنه",
    source: "صحيح البخاري (6340) وصحيح مسلم (2735)",
    explanation: "يعلمنا النبي صلى الله عليه وسلم أدباً من أهم آداب الدعاء، وهو الصبر واليقين بالإجابة. فالله يستجيب دعاء العبد ما لم يستعجل النتيجة وييأس ويترك الدعاء بحجة أنه لم يُستجب له، فالله حكيم يعلم الوقت المناسب للإجابة.",
    benefits: [
      "أهمية الصبر وعدم الاستعجال في انتظار إجابة الدعاء",
      "اليقين التام بأن الله يسمع الدعاء ويستجيب بما ينفع العبد",
      "الاستمرار في الدعاء وعدم اليأس أو القنوط من رحمة الله"
    ],
    category: "العبادة"
  },
  {
    id: 14,
    hadith: "يَسِّرُوا وَلا تُعَسِّرُوا، وَبَشِّرُوا وَلا تُنَفِّرُوا.",
    narrator: "أنس بن مالك رضي الله عنه",
    source: "صحيح البخاري (69) وصحيح مسلم (1734)",
    explanation: "قاعدة ذهبية في الدعوة والتعامل مع الناس، حيث يأمرنا النبي صلى الله عليه وسلم باختيار الأيسر والأسهل في أمور الدين والدنيا، وتبشير الناس بالخير والرحمة والمغفرة، بدلاً من تنفيرهم بالتشديد والترهيب المبالغ فيه.",
    benefits: [
      "سماحة الإسلام ويسره في التشريعات والتعاملات",
      "الحث على التبشير بالخير ونشر التفاؤل بين الناس",
      "الابتعاد عن التشدد والتنفير في النصح والدعوة"
    ],
    category: "المعاملات"
  },
  {
    id: 15,
    hadith: "لا تَحْقِرَنَّ مِنَ الْمَعْرُوفِ شَيْئًا، وَلَوْ أَنْ تَلْقَى أَخَاكَ بِوَجْهٍ طَلْقٍ.",
    narrator: "أبو ذر الغفاري رضي الله عنه",
    source: "صحيح مسلم (2626)",
    explanation: "يرشدنا الحديث إلى عدم الاستهانة بأي عمل صالح مهما كان صغيراً أو بسيطاً في أعيننا. فحتى الابتسامة في وجه أخيك المسلم ولقائه بوجه بشوش ومشرق تُعد من المعروف الذي تؤجر عليه، لأنها تدخل السرور والمحبة على قلبه.",
    benefits: [
      "عدم استصغار أي عمل صالح مهما بدا بسيطاً",
      "الابتسامة وبشاشة الوجه تعتبر صدقة وعملاً مأجوراً",
      "أهمية إدخال السرور على الآخرين ونشر الإيجابية"
    ],
    category: "الأخلاق"
  },
  {
    id: 16,
    hadith: "إِنَّ خِيَارَكُمْ أَحَاسِنُكُمْ أَخْلاقًا.",
    narrator: "عبد الله بن عمرو رضي الله عنهما",
    source: "صحيح البخاري (6035) وصحيح مسلم (2321)",
    explanation: "يبين النبي صلى الله عليه وسلم أن معيار الأفضلية والخيرية بين المسلمين ليس بكثرة المال أو الحسب أو النسب، بل بحسن الخلق وطيب التعامل مع الناس. فصاحب الخلق الحسن هو من خيار الأمة وأحبهم إلى الله ورسوله.",
    benefits: [
      "حسن الخلق هو المعيار الحقيقي للتفاضل بين الناس",
      "الدين ليس عبادات فقط بل هو معاملة وأخلاق كريمة",
      "الحث على تجميل الباطن والظاهر بمكارم الأخلاق"
    ],
    category: "الأخلاق"
  },
  {
    id: 17,
    hadith: "حَقُّ الْمُسْلِمِ عَلَى الْمُسْلِمِ خَمْسٌ: رَدُّ السَّلامِ، وَعِيَادَةُ الْمَرِيضِ، وَاتِّبَاعُ الْجَنَائِزِ، وَإِجَابَةُ الدَّعْوَةِ، وَتَشْمِيتُ الْعَاطِسِ.",
    narrator: "أبو هريرة رضي الله عنه",
    source: "صحيح البخاري (1240) وصحيح مسلم (2162)",
    explanation: "يحدد الحديث خمسة حقوق اجتماعية أساسية تجب للمسلم على أخيه المسلم، وهي حقوق تعزز الترابط والمحبة في المجتمع. وتشمل إلقاء ورد السلام، وزيارة المريض للتخفيف عنه، والمشاركة في الجنائز، وتلبية الدعوة، والدعاء للعاطس بالرحمة.",
    benefits: [
      "تعزيز الترابط الاجتماعي والمحبة بين أفراد المجتمع",
      "أهمية زيارة المريض ومواساة المحزون في مصابه",
      "إفشاء السلام ورد التحية من أهم أسباب نشر المودة"
    ],
    category: "المعاملات"
  },
  {
    id: 18,
    hadith: "كُلُّ سُلامَى مِنَ النَّاسِ عَلَيْهِ صَدَقَةٌ، كُلَّ يَوْمٍ تَطْلُعُ فِيهِ الشَّمْسُ: تَعْدِلُ بَيْنَ الاثْنَيْنِ صَدَقَةٌ، وَتُعِينُ الرَّجُلَ فِي دَابَّتِهِ فَتَحْمِلُهُ عَلَيْهَا أَوْ تَرْفَعُ لَهُ عَلَيْهَا مَتَاعَهُ صَدَقَةٌ، وَالْكَلِمَةُ الطَّيِّبَةُ صَدَقَةٌ...",
    narrator: "أبو هريرة رضي الله عنه",
    source: "صحيح البخاري (2989) وصحيح مسلم (1009)",
    explanation: "يذكرنا الحديث بوجوب شكر نعم الله على صحة المفاصل والأعضاء، وأن شكرها يكون بالصدقة اليومية. والصدقة هنا ليست مالية فقط، بل تشمل العدل بين المتخاصمين، ومساعدة الآخرين، والكلمة الطيبة، والمشي للصلاة، وإماطة الأذى عن الطريق.",
    benefits: [
      "وجوب شكر الله يومياً على نعمة الصحة والعافية",
      "تعدد أبواب الخير والصدقات في الإسلام لتشمل الأفعال والأقوال",
      "الكلمة الطيبة ومساعدة الناس من أعظم أنواع الصدقات"
    ],
    category: "العبادة"
  },
  {
    id: 19,
    hadith: "ثَلاثٌ مَنْ كُنَّ فِيهِ وَجَدَ حَلاوَةَ الإِيمَانِ: أَنْ يَكُونَ اللَّهُ وَرَسُولُهُ أَحَبَّ إِلَيْهِ مِمَّا سِوَاهُمَا، وَأَنْ يُحِبَّ الْمَرْءَ لا يُحِبُّهُ إِلاَّ لِلَّهِ، وَأَنْ يَكْرَهَ أَنْ يَعُودَ فِي الْكُفْرِ كَمَا يَكْرَهُ أَنْ يُقْذَفَ فِي النَّارِ.",
    narrator: "أنس بن مالك رضي الله عنه",
    source: "صحيح البخاري (16) وصحيح مسلم (43)",
    explanation: "للإيمان حلاوة ولذة يذوقها القلب، ولا تتحقق هذه اللذة إلا بثلاثة شروط: أن يكون حب الله ورسوله مقدماً على كل شيء في الحياة، وأن يحب المرء أخاه المسلم لله فقط وليس لمصلحة، وأن يكره العودة إلى الكفر والمعاصي كراهية شديدة.",
    benefits: [
      "تقديم محبة الله ورسوله وطاعتهما على كل محبة دنيوية",
      "الحب في الله من أوثق عرى الإيمان وأسباب السعادة",
      "الثبات على الدين وكراهية المعاصي والذنوب"
    ],
    category: "الإيمان"
  },
  {
    id: 20,
    hadith: "اسْتَوْصُوا بِالنِّسَاءِ خَيْرًا، فَإِنَّ الْمَرْأَةَ خُلِقَتْ مِنْ ضِلَعٍ، وَإِنَّ أَعْوَجَ شَيْءٍ فِي الضِّلَعِ أَعْلاهُ، فَإِنْ ذَهَبْتَ تُقِيمُهُ كَسَرْتَهُ، وَإِنْ تَرَكْتَهُ لَمْ يَزَلْ أَعْوَجَ، فَاسْتَوْصُوا بِالنِّسَاءِ خَيْرًا.",
    narrator: "أبو هريرة رضي الله عنه",
    source: "صحيح البخاري (3331) وصحيح مسلم (1468)",
    explanation: "وصية نبوية عظيمة تؤكد على وجوب الإحسان إلى النساء (الزوجة، الأم، الأخت، البنت) ومعاملتهن بالرفق واللين والصبر على طبائعهن العاطفية. فالإسلام كرم المرأة وحفظ حقوقها وأمر الرجال برعايتها وحسن عشرتها وتفهم طبيعتها.",
    benefits: [
      "وجوب الإحسان إلى النساء وحسن عشرتهن بالمعروف",
      "الصبر على طبائع البشر ومراعاة الفروق العاطفية والنفسية",
      "تكريم الإسلام للمرأة وحفظ مكانتها في الأسرة والمجتمع"
    ],
    category: "المعاملات"
  }
];

// --- Sub-screens ---

const QuranScreen = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  return (
    <div className="min-h-screen bg-[var(--background)] pb-24">
      <header className="sticky top-0 z-50 glass border-b border-[var(--border)] px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 rounded-xl bg-[var(--background)] hover:bg-[var(--border)]">
          <ArrowRight className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-black text-emerald-600">القرآن الكريم</h1>
      </header>

      <div className="p-5">
        <div className="relative mb-6">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--muted)]" />
          <input 
            type="text" 
            placeholder="ابحث عن سورة..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[var(--card)] border border-[var(--border)] rounded-2xl py-3 pr-12 pl-4 text-sm font-bold focus:outline-none focus:border-emerald-500 transition-all"
          />
        </div>

        <div className="space-y-3">
          {SURAHS.filter(s => s.name.includes(search)).map(surah => (
            <motion.div 
              key={surah.id}
              whileTap={{ scale: 0.98 }}
              className="bg-[var(--card)] p-4 rounded-2xl border border-[var(--border)] flex items-center justify-between soft-shadow cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-black text-sm">
                  {surah.id}
                </div>
                <div>
                  <h3 className="font-black text-lg">سورة {surah.name}</h3>
                  <p className="text-xs text-[var(--muted)] font-bold">{surah.type} • {surah.verses} آية</p>
                </div>
              </div>
              <PlayCircle className="w-6 h-6 text-emerald-500" />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

const HadithScreen = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const filteredHadiths = HADITHS.filter(h => 
    h.hadith.includes(search) || 
    h.category.includes(search) || 
    h.narrator.includes(search)
  );

  return (
    <div className="min-h-screen bg-[var(--background)] pb-24">
      <header className="sticky top-0 z-50 glass border-b border-[var(--border)] px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 rounded-xl bg-[var(--background)] hover:bg-[var(--border)]">
          <ArrowRight className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-black text-emerald-600">الأحاديث النبوية</h1>
      </header>

      <div className="p-5">
        <div className="relative mb-6">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--muted)]" />
          <input 
            type="text" 
            placeholder="ابحث في الأحاديث، الرواة، أو التصنيفات..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[var(--card)] border border-[var(--border)] rounded-2xl py-3 pr-12 pl-4 text-sm font-bold focus:outline-none focus:border-emerald-500 transition-all"
          />
        </div>

        <div className="space-y-6">
          {filteredHadiths.map(hadith => (
            <motion.div 
              key={hadith.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[var(--card)] p-6 rounded-3xl border border-[var(--border)] soft-shadow flex flex-col gap-4"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-black">
                  {hadith.category}
                </span>
                <span className="text-xs text-[var(--muted)] font-bold">
                  {hadith.source}
                </span>
              </div>
              
              <p className="text-lg font-bold leading-relaxed font-serif text-center text-[var(--foreground)]">
                "{hadith.hadith}"
              </p>
              
              <div className="text-left">
                <span className="text-sm font-bold text-[var(--muted)]">
                  الراوي: {hadith.narrator}
                </span>
              </div>

              <div className="mt-4 pt-4 border-t border-[var(--border)]">
                <h4 className="font-black text-emerald-600 mb-2">الشرح:</h4>
                <p className="text-sm leading-relaxed text-[var(--foreground)] opacity-90">
                  {hadith.explanation}
                </p>
              </div>

              <div className="mt-2">
                <h4 className="font-black text-emerald-600 mb-2">الفوائد المستنبطة:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-[var(--foreground)] opacity-90">
                  {hadith.benefits.map((benefit, index) => (
                    <li key={index}>{benefit}</li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
          
          {filteredHadiths.length === 0 && (
            <div className="text-center py-10 text-[var(--muted)]">
              <Scroll className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p className="font-bold">لم يتم العثور على أحاديث مطابقة للبحث</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const AzkarScreen = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[var(--background)] pb-24">
      <header className="sticky top-0 z-50 glass border-b border-[var(--border)] px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 rounded-xl bg-[var(--background)] hover:bg-[var(--border)]">
          <ArrowRight className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-black text-emerald-600">الأذكار</h1>
      </header>

      <div className="p-5 grid grid-cols-2 gap-4">
        {AZKAR_CATEGORIES.map(cat => (
          <motion.div 
            key={cat.id}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(`/islamic/azkar/${cat.id}`)}
            className="bg-[var(--card)] p-5 rounded-3xl border border-[var(--border)] flex flex-col items-center gap-3 soft-shadow cursor-pointer text-center"
          >
            <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <h3 className="font-black text-sm mb-1">{cat.title}</h3>
              <p className="text-xs text-[var(--muted)] font-bold">{cat.count} ذكر</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const ZikrDetailScreen = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const category = AZKAR_CATEGORIES.find(c => c.id === categoryId);
  
  const [counts, setCounts] = useState<Record<number, number>>({});

  if (!category) return null;

  const handleCount = (id: number, maxCount: number) => {
    setCounts(prev => {
      const current = prev[id] || 0;
      if (current < maxCount) {
        return { ...prev, [id]: current + 1 };
      }
      return prev;
    });
  };

  const resetCounts = () => {
    setCounts({});
  };

  return (
    <div className="min-h-screen bg-[var(--background)] pb-24">
      <header className="sticky top-0 z-50 glass border-b border-[var(--border)] px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 rounded-xl bg-[var(--background)] hover:bg-[var(--border)]">
            <ArrowRight className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-black text-emerald-600">{category.title}</h1>
        </div>
        <button onClick={resetCounts} className="text-xs font-bold text-[var(--muted)] hover:text-emerald-600 px-3 py-1 bg-[var(--card)] rounded-full border border-[var(--border)]">
          إعادة تعيين
        </button>
      </header>

      <div className="p-5 space-y-6">
        {category.data.map((zikr, index) => {
          const currentCount = counts[zikr.id] || 0;
          const isCompleted = currentCount >= zikr.count;
          
          return (
            <motion.div 
              key={zikr.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => handleCount(zikr.id, zikr.count)}
              className={`bg-[var(--card)] p-6 rounded-3xl border ${isCompleted ? 'border-emerald-500 bg-emerald-50/50' : 'border-[var(--border)]'} soft-shadow flex flex-col gap-4 cursor-pointer relative overflow-hidden transition-colors`}
            >
              {isCompleted && (
                <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500" />
              )}
              
              <p className="text-lg font-bold leading-relaxed font-serif text-center text-[var(--foreground)]">
                {zikr.text}
              </p>
              
              {zikr.reward && (
                <div className="text-center mt-2">
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-100 px-3 py-1 rounded-full">
                    فضلها: {zikr.reward}
                  </span>
                </div>
              )}

              <div className="mt-4 flex items-center justify-between border-t border-[var(--border)] pt-4">
                <div className="text-sm font-bold text-[var(--muted)]">
                  التكرار: {zikr.count}
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-sm font-black text-emerald-600">
                    {currentCount} / {zikr.count}
                  </div>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-black transition-colors ${isCompleted ? 'bg-emerald-500' : 'bg-emerald-600'}`}>
                    {isCompleted ? '✓' : '+1'}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

const ArticlesScreen = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[var(--background)] pb-24">
      <header className="sticky top-0 z-50 glass border-b border-[var(--border)] px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 rounded-xl bg-[var(--background)] hover:bg-[var(--border)]">
          <ArrowRight className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-black text-emerald-600">مقالات إسلامية</h1>
      </header>

      <div className="p-5 space-y-4">
        {ARTICLES.map(article => (
          <motion.div 
            key={article.id}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate(`/islamic/articles/${article.id}`)}
            className="bg-[var(--card)] rounded-3xl border border-[var(--border)] overflow-hidden soft-shadow cursor-pointer"
          >
            <img src={article.image} alt={article.title} className="w-full h-40 object-cover" />
            <div className="p-4">
              <h3 className="font-black text-lg mb-2">{article.title}</h3>
              <div className="flex justify-between items-center text-xs text-[var(--muted)] font-bold">
                <span>{article.author}</span>
                <span>{article.readTime} قراءة</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const ArticleDetailScreen = () => {
  const { articleId } = useParams();
  const navigate = useNavigate();
  const article = ARTICLES.find(a => a.id === Number(articleId));

  if (!article) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex flex-col items-center justify-center p-5">
        <Scroll className="w-16 h-16 text-[var(--muted)] mb-4 opacity-20" />
        <h2 className="text-xl font-black text-[var(--foreground)] mb-2">المقال غير موجود</h2>
        <button onClick={() => navigate(-1)} className="text-emerald-600 font-bold">العودة للسابق</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)] pb-24">
      <header className="sticky top-0 z-50 glass border-b border-[var(--border)] px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 rounded-xl bg-[var(--background)] hover:bg-[var(--border)]">
            <ArrowRight className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-black text-emerald-600 truncate max-w-[200px]">{article.title}</h1>
        </div>
      </header>

      <div className="w-full h-64 relative">
        <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
          <h2 className="text-2xl font-black mb-2 leading-tight">{article.title}</h2>
          <div className="flex items-center gap-4 text-sm font-bold opacity-90">
            <span className="flex items-center gap-1"><Book className="w-4 h-4"/> {article.author}</span>
            <span>•</span>
            <span className="flex items-center gap-1"><History className="w-4 h-4"/> {article.readTime}</span>
          </div>
        </div>
      </div>

      <div className="p-5 -mt-6 relative z-10">
        <div className="bg-[var(--card)] rounded-3xl p-6 border border-[var(--border)] soft-shadow">
          <div className="prose prose-emerald max-w-none dark:prose-invert font-serif leading-loose text-lg text-[var(--foreground)] whitespace-pre-wrap">
            {article.content}
          </div>
        </div>
      </div>
    </div>
  );
};

const SebhaScreen = () => {
  const navigate = useNavigate();
  const [count, setCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [currentZikr, setCurrentZikr] = useState('سُبْحَانَ اللَّهِ');

  const azkarList = [
    'سُبْحَانَ اللَّهِ',
    'الْحَمْدُ لِلَّهِ',
    'اللَّهُ أَكْبَرُ',
    'لا إِلَهَ إِلا اللَّهُ',
    'أَسْتَغْفِرُ اللَّهَ',
    'لا حَوْلَ وَلا قُوَّةَ إِلا بِاللَّهِ',
    'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ'
  ];

  const handlePress = () => {
    setCount(c => c + 1);
    setTotalCount(c => c + 1);
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
  };

  const handleReset = () => {
    setCount(0);
    if (navigator.vibrate) {
      navigator.vibrate([50, 50, 50]);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)] pb-24 flex flex-col">
      <header className="sticky top-0 z-50 glass border-b border-[var(--border)] px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 rounded-xl bg-[var(--background)] hover:bg-[var(--border)]">
            <ArrowRight className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-black text-emerald-600">المسبحة الإلكترونية</h1>
        </div>
        <button onClick={handleReset} className="text-xs font-bold text-[var(--muted)] hover:text-emerald-600 px-3 py-1 bg-[var(--card)] rounded-full border border-[var(--border)]">
          تصفير
        </button>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center p-5 gap-8">
        {/* Zikr Selector */}
        <div className="w-full max-w-sm overflow-x-auto pb-4 hide-scrollbar">
          <div className="flex gap-2">
            {azkarList.map(zikr => (
              <button
                key={zikr}
                onClick={() => { setCurrentZikr(zikr); setCount(0); }}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-bold transition-colors ${currentZikr === zikr ? 'bg-emerald-600 text-white' : 'bg-[var(--card)] text-[var(--muted)] border border-[var(--border)]'}`}
              >
                {zikr}
              </button>
            ))}
          </div>
        </div>

        {/* Current Zikr Display */}
        <div className="text-2xl font-black text-center text-[var(--foreground)] h-16 flex items-center justify-center">
          {currentZikr}
        </div>

        {/* Main Button */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={handlePress}
          className="w-64 h-64 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-2xl shadow-emerald-500/30 flex flex-col items-center justify-center text-white relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-black/10 opacity-0 hover:opacity-100 transition-opacity" />
          <span className="text-7xl font-black tracking-tighter">{count}</span>
          <span className="text-sm font-bold opacity-80 mt-2">اضغط للتسبيح</span>
        </motion.button>

        {/* Total Count */}
        <div className="text-sm font-bold text-[var(--muted)]">
          المجموع الكلي: {totalCount}
        </div>
      </div>
    </div>
  );
};

const IslamicDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[var(--background)] pb-24">
      <header className="sticky top-0 z-50 glass border-b border-[var(--border)] px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigate('/')} className="p-2 rounded-xl bg-[var(--background)] hover:bg-[var(--border)]">
          <ArrowRight className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-black text-emerald-600">إسلاميات</h1>
      </header>

      {/* Daily Inspiration */}
      <div className="p-5">
        <div className="bg-emerald-600 text-white rounded-[32px] p-6 relative overflow-hidden shadow-xl shadow-emerald-600/20">
          <Moon className="absolute -left-4 -top-4 w-32 h-32 text-white opacity-10" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4 opacity-90">
              <Book className="w-4 h-4" />
              <span className="text-xs font-black uppercase tracking-wider">آية اليوم</span>
            </div>
            <p className="text-xl font-bold leading-relaxed mb-4 font-serif text-center">
              "إِنَّ مَعَ الْعُسْرِ يُسْرًا"
            </p>
            <p className="text-sm opacity-80 text-center">سورة الشرح - الآية 6</p>
          </div>
        </div>
      </div>

      {/* Modules Grid */}
      <div className="px-5 grid grid-cols-2 gap-4">
        <motion.div 
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/islamic/quran')}
          className="bg-[var(--card)] p-5 rounded-[32px] border border-[var(--border)] flex flex-col items-center gap-3 soft-shadow cursor-pointer"
        >
          <div className="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600">
            <Book className="w-8 h-8" />
          </div>
          <span className="font-black">القرآن الكريم</span>
        </motion.div>

        <motion.div 
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/islamic/hadith')}
          className="bg-[var(--card)] p-5 rounded-[32px] border border-[var(--border)] flex flex-col items-center gap-3 soft-shadow cursor-pointer"
        >
          <div className="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600">
            <Scroll className="w-8 h-8" />
          </div>
          <span className="font-black">الأحاديث</span>
        </motion.div>

        <motion.div 
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/islamic/azkar')}
          className="bg-[var(--card)] p-5 rounded-[32px] border border-[var(--border)] flex flex-col items-center gap-3 soft-shadow cursor-pointer"
        >
          <div className="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600">
            <Sparkles className="w-8 h-8" />
          </div>
          <span className="font-black">الأذكار</span>
        </motion.div>

        <motion.div 
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/islamic/articles')}
          className="bg-[var(--card)] p-5 rounded-[32px] border border-[var(--border)] flex flex-col items-center gap-3 soft-shadow cursor-pointer"
        >
          <div className="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600">
            <History className="w-8 h-8" />
          </div>
          <span className="font-black">مقالات</span>
        </motion.div>

        <motion.div 
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/islamic/sebha')}
          className="bg-[var(--card)] p-5 rounded-[32px] border border-[var(--border)] flex flex-col items-center gap-3 soft-shadow cursor-pointer col-span-2"
        >
          <div className="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600">
            <Target className="w-8 h-8" />
          </div>
          <span className="font-black">المسبحة الإلكترونية</span>
        </motion.div>
      </div>
    </div>
  );
};

const IslamicModule = () => {
  return (
    <Routes>
      <Route path="/" element={<IslamicDashboard />} />
      <Route path="/quran" element={<QuranScreen />} />
      <Route path="/hadith" element={<HadithScreen />} />
      <Route path="/azkar" element={<AzkarScreen />} />
      <Route path="/azkar/:categoryId" element={<ZikrDetailScreen />} />
      <Route path="/sebha" element={<SebhaScreen />} />
      <Route path="/articles" element={<ArticlesScreen />} />
      <Route path="/articles/:articleId" element={<ArticleDetailScreen />} />
    </Routes>
  );
};

export default IslamicModule;
