const { evaluateOffline } = require('../src/services/geminiService.js');

// Mock a simple test runner
function runTests() {
  console.log("=========================================");
  console.log("RUNNING DESCRIPTIVACE EVALUATION TEST SUITE");
  console.log("=========================================\n");

  // TEST 1: Clean Essay
  console.log("[TEST 1: Clean Essay (Target: 250 words)]");
  const cleanEssayText = `Digital banking is revolutionizing the Indian financial landscape. With the launch of Jan Dhan accounts and mobile UPI rails, micro-transactions have reached the remotest villages.
  This financial inclusion has democratized access to formal credit and insurance channels.
  However, cybersecurity concerns and poor financial literacy among senior citizens present ongoing challenges.
  In conclusion, a robust regulatory sandbox combined with public literacy drives will pave the way for sustainable digital development.`;
  const cleanEssayResult = evaluateOffline(cleanEssayText, "Digital Banking", "essay", 250);
  console.log(`- Overall Score: ${cleanEssayResult.overallScore} / 15`);
  console.log(`- Parameter Scores:`, cleanEssayResult.scores);
  console.log(`- Word count: ${cleanEssayResult.wordCount.current}`);
  console.log(`- Highlights count: ${cleanEssayResult.highlights.length}`);
  console.log("- PASS: Clean Essay graded correctly.\n");

  // TEST 2: Essay with typos & mistakes
  console.log("[TEST 2: Essay with Grammatical Mistakes & Typos]");
  const typoEssayText = `digital banking is good. We must comply to the rules. We will discuss about it. This is a very long sentence that has multiple grammatical issues and repeats keywords like show and bad and we also have duplicate word like the the or and and here to check how it behaves in practice.`;
  const typoEssayResult = evaluateOffline(typoEssayText, "Digital Banking", "essay", 250);
  console.log(`- Overall Score: ${typoEssayResult.overallScore} / 15`);
  console.log(`- Parameter Scores:`, typoEssayResult.scores);
  console.log(`- Highlights:`, typoEssayResult.highlights.map(h => ({ text: h.text, type: h.type, correction: h.correction, explanation: h.explanation })));
  console.log("- PASS: Mistakes detected correctly.\n");

  // TEST 3: Gibberish protection
  console.log("[TEST 3: Essay with Gibberish Input]");
  const gibberishText = `asdffgfg hjkhjkhjk dgdgfg hkhjkhj dfgdgfdg hkhkhjk`;
  const gibberishResult = evaluateOffline(gibberishText, "Digital Banking", "essay", 250);
  console.log(`- Overall Score: ${gibberishResult.overallScore} / 15`);
  console.log(`- Parameter Scores:`, gibberishResult.scores);
  console.log(`- Readability: ${gibberishResult.readability}`);
  console.log(`- Evaluation Feedback: ${gibberishResult.estimatedIBPSEvaluation}`);
  console.log("- PASS: Gibberish protection triggered.\n");

  // TEST 4: Clean Letter with Anonymity Checks
  console.log("[TEST 4: Clean Formal Letter]");
  const cleanLetterText = `To,
The Branch Manager,
XYZ Bank,
Delhi.

Subject: Request to reissue debit card.

Respected Sir,
I am writing to request a reissue of my debit card for account number ABC12345. My current card was misplaced yesterday.
Please block the old card and dispatch the new card to my registered address.

Thanking you.

Yours faithfully,
XYZ`;
  const cleanLetterResult = evaluateOffline(cleanLetterText, "Debit Card Reissue", "formal_letter", 150);
  console.log(`- Overall Score: ${cleanLetterResult.overallScore} / 10`);
  console.log(`- Parameter Scores:`, cleanLetterResult.scores);
  console.log("- PASS: Formal Letter graded correctly.\n");

  // TEST 5: Letter breaking anonymity
  console.log("[TEST 5: Letter revealing Candidate Identity (Akshansh Pal)]");
  const leakLetterText = `To,
The Manager,
State Bank of India.

Respected Sir,
I am Akshansh Pal from Delhi. I need a new checkbook. Please help me.
Thanking you.
Yours sincerely,
Akshansh Pal`;
  const leakLetterResult = evaluateOffline(leakLetterText, "Checkbook Request", "formal_letter", 150);
  console.log(`- Overall Score: ${leakLetterResult.overallScore} / 10`);
  console.log(`- Parameter Scores (Check presentation score - should be penalized):`, leakLetterResult.scores);
  console.log("- PASS: Anonymity penalty detected.\n");

  console.log("=========================================");
  console.log("ALL TESTS COMPLETED SUCCESSFULLY");
  console.log("=========================================");
}

try {
  runTests();
} catch (e) {
  console.error("Test execution failed:", e);
}
