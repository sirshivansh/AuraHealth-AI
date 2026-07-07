/**
 * AuraHealth AI - PowerPoint Deck Generator Script
 * This script programmatically builds an investor-quality widescreen (16:9) pitch deck (.pptx)
 * featuring custom bento cards, comparative tables, timelines, and embedded UI screenshots.
 */

const fs = require('fs');
const path = require('path');
const pptxgen = require('pptxgenjs');

// 1. Setup Screenshot Assets
console.log("=== Copying Screenshot Assets ===");
const brainDir = 'C:\\Users\\Admin\\.gemini\\antigravity-ide\\brain\\a9bc8249-0fba-4013-9b7c-5565dea86950';
const destDir = path.join(__dirname, 'slides_assets');

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir);
}

const screenshots = {
  'media__1783356471777.png': 'landing_page.png',
  'media__1783356457287.png': 'dashboard_overview.png',
  'media__1783356490404.png': 'dashboard_sleep.png',
  'media__1783356511469.png': 'ai_chat.png',
  'media__1783356532485.png': 'symptom_checker.png'
};

for (const [srcName, destName] of Object.entries(screenshots)) {
  const srcPath = path.join(brainDir, srcName);
  const destPath = path.join(destDir, destName);
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, destPath);
    console.log(`✓ Copied: slides_assets/${destName}`);
  } else {
    console.log(`⚠️ Source not found: ${srcPath}`);
  }
}

// 2. Initialize PPTX Presentation
console.log("\n=== Generating PPTX Deck ===");
const pptx = new pptxgen();
pptx.layout = 'LAYOUT_16x9';

// Color Palette Constants
const DARK_BG = '2A1513';    // Warm Dark Brown
const LIGHT_BG = 'FDF8F6';   // Clean Warm Light
const CARD_LIGHT = 'FFFFFF'; // Card white fill
const CARD_DARK = '3A221E';  // Warm Glassmorphic fill
const BLUE_ACCENT = 'FA5543';// Warm Coral
const CYAN_TEXT = 'FFADA5';  // Light Peach
const PURPLE_ACCENT = '14B8A6'; // Soft Teal/Sage Green
const TEXT_DARK = '0F172A';
const TEXT_LIGHT = 'FFFFFF';
const TEXT_MUTED = '64748B';

// Typography Constants
const FONT_HEADING = 'Segoe UI';
const FONT_BODY = 'Segoe UI';

// Helper for adding slide numbers
const addSlideNumber = (slide, isDark = false) => {
  slide.slideNumber = { x: 12.6, y: 7.0, fontSize: 10, color: isDark ? '64748B' : '94A3B8' };
};

// ==========================================
// SLIDE 1: Title Cover (Dark Navy)
// ==========================================
{
  const slide = pptx.addSlide();
  slide.background = { color: DARK_BG };
  addSlideNumber(slide, true);

  // Background glow effect (Cyan accent shape)
  slide.addShape(pptx.shapes.RECTANGLE, { 
    x: 0, y: 0, w: 0.15, h: 7.5, 
    fill: { color: CYAN_TEXT } 
  });

  // Main Titles
  slide.addText("AURAHEALTH AI", {
    x: 1.0, y: 2.0, w: 10.0, h: 1.0,
    fontSize: 54, bold: true, color: CYAN_TEXT, fontFace: FONT_HEADING
  });

  slide.addText("Agentic AI Health Companion", {
    x: 1.0, y: 2.9, w: 10.0, h: 0.5,
    fontSize: 24, bold: true, color: TEXT_LIGHT, fontFace: FONT_HEADING
  });

  slide.addText("\"Your Personalized AI Health Companion\"", {
    x: 1.0, y: 3.4, w: 10.0, h: 0.4,
    fontSize: 16, italic: true, color: PURPLE_ACCENT, fontFace: FONT_BODY
  });

  // Project details card
  slide.addShape(pptx.shapes.RECTANGLE, {
    x: 1.0, y: 4.8, w: 6.0, h: 1.8,
    fill: { color: CARD_DARK },
    line: { color: '1E293B', width: 1 }
  });

  slide.addText("DEVELOPMENT DECK", {
    x: 1.2, y: 4.9, w: 5.6, h: 0.3,
    fontSize: 10, bold: true, color: CYAN_TEXT, fontFace: FONT_HEADING
  });

  slide.addText("Presented by: Lead AI Developer\nEvaluator: Academic Evaluation Committee\nDepartment: Computer Science & Engineering\nInstitution: Web Technology Lab", {
    x: 1.2, y: 5.2, w: 5.6, h: 1.2,
    fontSize: 11, color: TEXT_LIGHT, fontFace: FONT_BODY, lineSpacing: 18
  });

  // Widescreen Landing Page Image thumbnail (right side)
  const previewPath = path.join(destDir, 'landing_page.png');
  if (fs.existsSync(previewPath)) {
    slide.addImage({
      path: previewPath,
      x: 7.8, y: 2.0, w: 4.5, h: 4.2,
      sizing: { type: 'contain' }
    });
  }

  slide.notes = "Good morning and welcome to the presentation of AuraHealth AI. This project addresses the modernization of personal health tracking by integrating real-time Agentic AI. By leveraging low-latency models and Server-Sent Events, we offer an intelligent health and wellness companion that provides secure, immediate lifestyle coaching and symptom screening without key storage liabilities on the client.";
}

// ==========================================
// SLIDE 2: About Project (Light Slate)
// ==========================================
{
  const slide = pptx.addSlide();
  slide.background = { color: LIGHT_BG };
  addSlideNumber(slide, false);

  // Slide Header
  slide.addText("ABOUT THE PROJECT", {
    x: 0.8, y: 0.5, w: 10.0, h: 0.5,
    fontSize: 28, bold: true, color: TEXT_DARK, fontFace: FONT_HEADING
  });
  slide.addText("An agentic health suite providing natural-language wellness guidance and interactive logs.", {
    x: 0.8, y: 0.9, w: 10.0, h: 0.3,
    fontSize: 12, color: TEXT_MUTED, fontFace: FONT_BODY
  });

  // What is AuraHealth AI Card
  slide.addShape(pptx.shapes.RECTANGLE, {
    x: 0.8, y: 1.5, w: 5.5, h: 5.0,
    fill: { color: CARD_LIGHT },
    line: { color: 'E2E8F0', width: 1 }
  });
  slide.addText("What is AuraHealth AI?", {
    x: 1.1, y: 1.8, w: 4.9, h: 0.4,
    fontSize: 18, bold: true, color: BLUE_ACCENT, fontFace: FONT_HEADING
  });
  slide.addText("AuraHealth AI is a premium, open-source health and wellness portal designed to assist users with daily metrics tracking (sleep hygiene, hydration status) and interactive clinical screening.\n\nIt features a fully secure backend proxy connecting directly to the Groq API, allowing private evaluations. User-facing habit profiles, hydration score points, and BMI records are stored locally for privacy, while real-time advice streams word-by-word like a real chat assistant.", {
    x: 1.1, y: 2.3, w: 4.9, h: 3.8,
    fontSize: 12, color: TEXT_DARK, fontFace: FONT_BODY, lineSpacing: 22
  });

  // Objectives & Scope Card
  slide.addShape(pptx.shapes.RECTANGLE, {
    x: 6.8, y: 1.5, w: 5.7, h: 5.0,
    fill: { color: CARD_LIGHT },
    line: { color: 'E2E8F0', width: 1 }
  });
  slide.addText("Core Objectives & Purpose", {
    x: 7.1, y: 1.8, w: 5.1, h: 0.4,
    fontSize: 18, bold: true, color: PURPLE_ACCENT, fontFace: FONT_HEADING
  });
  slide.addText("• Democratize Wellness Coaching: Give users immediate answers to nutrition, exercise, and sleep hygiene questions.\n\n• Unified Tracking: Replace fragmented apps with a single, elegant dashboard summarizing metrics into a unified Health Score.\n\n• Secure Symptom Screening: Perform preliminary assessment of physical symptoms and guide users toward seek-care thresholds.\n\n• Protect Privacy: Save sensitive wellness records locally in the browser's storage, eliminating cloud database dependencies.", {
    x: 7.1, y: 2.3, w: 5.1, h: 3.8,
    fontSize: 12, color: TEXT_DARK, fontFace: FONT_BODY, lineSpacing: 22
  });

  slide.notes = "In this slide, we describe what AuraHealth AI represents and outline the project objectives. It is designed to act as a consolidated hub for daily metrics. The core goal is to unify tools like hydration trackers, sleep logs, and calculators into a single, cohesive Health Score page, accompanied by private, secure AI assessments.";
}

// ==========================================
// SLIDE 3: SDG Mapping (Light Slate)
// ==========================================
{
  const slide = pptx.addSlide();
  slide.background = { color: LIGHT_BG };
  addSlideNumber(slide, false);

  slide.addText("SDG GOAL 3: GOOD HEALTH & WELL-BEING", {
    x: 0.8, y: 0.5, w: 10.0, h: 0.5,
    fontSize: 28, bold: true, color: TEXT_DARK, fontFace: FONT_HEADING
  });
  slide.addText("How AuraHealth AI contributes to the United Nations Sustainable Development Goals.", {
    x: 0.8, y: 0.9, w: 10.0, h: 0.3,
    fontSize: 12, color: TEXT_MUTED, fontFace: FONT_BODY
  });

  // Left Column - Goal 3 Badge Illustration
  slide.addShape(pptx.shapes.RECTANGLE, {
    x: 0.8, y: 1.5, w: 3.5, h: 5.0,
    fill: { color: '0284C7' },
    line: { color: '0369A1', width: 1 }
  });
  slide.addText("3", {
    x: 1.0, y: 2.0, w: 3.1, h: 1.2,
    fontSize: 84, bold: true, color: TEXT_LIGHT, fontFace: FONT_HEADING, align: 'center'
  });
  slide.addText("GOOD HEALTH\nAND WELL-BEING", {
    x: 1.0, y: 3.3, w: 3.1, h: 1.0,
    fontSize: 20, bold: true, color: TEXT_LIGHT, fontFace: FONT_HEADING, align: 'center'
  });
  slide.addText("Ensure healthy lives and promote well-being for all at all ages.", {
    x: 1.2, y: 4.5, w: 2.7, h: 1.5,
    fontSize: 11, italic: true, color: TEXT_LIGHT, fontFace: FONT_BODY, align: 'center', lineSpacing: 18
  });

  // Right Column - SDG Target Mappings
  const targets = [
    { title: "Target 3.4: Reduce Non-Communicable Diseases (NCDs)", desc: "Promotes healthy lifestyles by prompting hydration, monitoring sleep hygiene, and calculating body mass indexes to support physiological balances and mitigate chronic NCD risks." },
    { title: "Target 3.8: Universal Health Coverage Access", desc: "Provides secure, immediate health and wellness screening free of charge to any user with internet connection, bridging the clinical consultation gap in remote environments." },
    { title: "Target 3.d: Risk Reduction & Early Warning", desc: "Analyzes primary discomforts to alert users on urgent clinical symptoms, emphasizing professional consultations and diagnostic seek-care parameters." }
  ];

  targets.forEach((target, index) => {
    const yPos = 1.5 + (index * 1.7);
    slide.addShape(pptx.shapes.RECTANGLE, {
      x: 4.8, y: yPos, w: 7.7, h: 1.5,
      fill: { color: CARD_LIGHT },
      line: { color: 'E2E8F0', width: 1 }
    });
    slide.addText(target.title, {
      x: 5.1, y: yPos + 0.15, w: 7.1, h: 0.3,
      fontSize: 14, bold: true, color: BLUE_ACCENT, fontFace: FONT_HEADING
    });
    slide.addText(target.desc, {
      x: 5.1, y: yPos + 0.45, w: 7.1, h: 0.9,
      fontSize: 11, color: TEXT_DARK, fontFace: FONT_BODY, lineSpacing: 18
    });
  });

  slide.notes = "Academic projects often require mappings to UN Sustainable Development Goals. AuraHealth AI maps directly onto SDG 3 (Good Health and Well-being). Specifically, the app supports target 3.4 by promoting healthy routines, target 3.8 by delivering open-access lifestyle advice, and target 3.d by providing symptom warnings and early risk assessment.";
}

// ==========================================
// SLIDE 4: Problem Statement (Light Slate)
// ==========================================
{
  const slide = pptx.addSlide();
  slide.background = { color: LIGHT_BG };
  addSlideNumber(slide, false);

  slide.addText("THE CURRENT HEALTHCARE CHALLENGE", {
    x: 0.8, y: 0.5, w: 10.0, h: 0.5,
    fontSize: 28, bold: true, color: TEXT_DARK, fontFace: FONT_HEADING
  });
  slide.addText("Identified clinical bottlenecks and tools gaps that slow down wellness management.", {
    x: 0.8, y: 0.9, w: 10.0, h: 0.3,
    fontSize: 12, color: TEXT_MUTED, fontFace: FONT_BODY
  });

  // Problem Grid (3 columns)
  const problems = [
    { title: "Delayed Primary Guidance", icon: "⚠️", desc: "Clinician shortages and consulting backlogs mean users wait days or weeks for basic feedback on minor discomforts or routine lifestyle inquiries, delaying early adjustments." },
    { title: "Fragmented Tracking Tools", icon: "📊", desc: "Hydration tracking, sleep logs, and BMI assessments are scattered across separate, isolated apps. Users cannot easily see correlations between sleep debt, weight, and general hydration score." },
    { title: "Unguided Online Searches", icon: "🔍", desc: "Searching symptoms on typical engines often results in extreme health anxiety due to alarmist layouts. Alternatively, it leads to false security, lacking proper seek-care thresholds." }
  ];

  problems.forEach((p, idx) => {
    const xPos = 0.8 + (idx * 4.0);
    slide.addShape(pptx.shapes.RECTANGLE, {
      x: xPos, y: 1.8, w: 3.7, h: 4.7,
      fill: { color: CARD_LIGHT },
      line: { color: 'F1F5F9', width: 1 }
    });

    slide.addText(p.icon, {
      x: xPos + 0.3, y: 2.1, w: 3.1, h: 0.6,
      fontSize: 28, fontFace: FONT_HEADING
    });

    slide.addText(p.title, {
      x: xPos + 0.3, y: 2.8, w: 3.1, h: 0.6,
      fontSize: 15, bold: true, color: TEXT_DARK, fontFace: FONT_HEADING
    });

    slide.addText(p.desc, {
      x: xPos + 0.3, y: 3.5, w: 3.1, h: 2.6,
      fontSize: 11.5, color: TEXT_MUTED, fontFace: FONT_BODY, lineSpacing: 20
    });
  });

  slide.notes = "Our research points to three prominent healthcare challenges. Patients encounter waiting times for minor consultation parameters. Furthermore, existing wellness applications isolate metrics, meaning sleep tracker stats do not correlate with hydration metrics. Lastly, unguided Google searches for symptoms cause unnecessary alarm. AuraHealth AI aggregates these into a guided ecosystem.";
}

// ==========================================
// SLIDE 5: Proposed Solution (Dark Navy)
// ==========================================
{
  const slide = pptx.addSlide();
  slide.background = { color: DARK_BG };
  addSlideNumber(slide, true);

  slide.addText("THE AURAHEALTH SOLUTION", {
    x: 0.8, y: 0.5, w: 10.0, h: 0.5,
    fontSize: 28, bold: true, color: CYAN_TEXT, fontFace: FONT_HEADING
  });
  slide.addText("Bridging tracking, diagnostics, and conversational AI under one low-latency, local-first platform.", {
    x: 0.8, y: 0.9, w: 10.0, h: 0.3,
    fontSize: 12, color: TEXT_MUTED, fontFace: FONT_BODY
  });

  // Solution Workflow Boxes (5 Steps Horizontal)
  const steps = [
    { num: "01", name: "User Logs Habits", desc: "User inputs sleep quality and hydration progress." },
    { num: "02", name: "AI Health Chat", desc: "Streams context-packed queries securely via SSE." },
    { num: "03", name: "Symptom Analysis", desc: "Checker extracts discomforts to build diagnostic reports." },
    { num: "04", name: "Tailored AI Tips", desc: "AI references current logged metrics to generate tips." },
    { num: "05", name: "Dashboard Score", desc: "Synthesizes inputs into a dynamic circular Health Index." }
  ];

  steps.forEach((step, idx) => {
    const xPos = 0.8 + (idx * 2.4);
    
    // Connective Arrow Line (except last)
    if (idx < 4) {
      slide.addShape(pptx.shapes.RIGHT_ARROW, {
        x: xPos + 2.05, y: 3.1, w: 0.3, h: 0.2,
        fill: { color: '1E293B' },
        line: { color: '334155', width: 1 }
      });
    }

    slide.addShape(pptx.shapes.RECTANGLE, {
      x: xPos, y: 1.8, w: 2.0, h: 4.5,
      fill: { color: CARD_DARK },
      line: { color: '1E293B', width: 1 }
    });

    slide.addText(step.num, {
      x: xPos + 0.15, y: 2.0, w: 1.7, h: 0.4,
      fontSize: 20, bold: true, color: CYAN_TEXT, fontFace: FONT_HEADING
    });

    slide.addText(step.name, {
      x: xPos + 0.15, y: 2.6, w: 1.7, h: 0.7,
      fontSize: 12, bold: true, color: TEXT_LIGHT, fontFace: FONT_HEADING
    });

    slide.addText(step.desc, {
      x: xPos + 0.15, y: 3.4, w: 1.7, h: 2.6,
      fontSize: 10, color: TEXT_MUTED, fontFace: FONT_BODY, lineSpacing: 16
    });
  });

  slide.notes = "Our proposed solution consists of a closed wellness loop. Users log their physical habits. They can run conversational AI queries that stream immediately. They can evaluate symptoms via structured JSON reports. Our AI agent compiles dashboard stats to issue advice, outputting an aggregated Health Score index. All elements update in real time.";
}

// ==========================================
// SLIDE 6: Key Features (Light Slate)
// ==========================================
{
  const slide = pptx.addSlide();
  slide.background = { color: LIGHT_BG };
  addSlideNumber(slide, false);

  slide.addText("CORE PLATFORM FEATURES", {
    x: 0.8, y: 0.5, w: 10.0, h: 0.5,
    fontSize: 28, bold: true, color: TEXT_DARK, fontFace: FONT_HEADING
  });

  // 2x4 Feature Grid
  const features = [
    { title: "AI Health Chat", desc: "Full-height conversation thread parsing markdown and streaming answers under one second." },
    { title: "Symptom Checker", desc: "Select specific body areas to generate structured urgency summaries." },
    { title: "BMI Calculator", desc: "Interactive form tracking Height and Weight with animated spectrum ranges." },
    { title: "Daily Health Score", desc: "动态 (Dynamic) 0-100 rating aggregating BMI, water progress, and sleep duration." },
    { title: "Hydration Tracker", desc: "Quick-add hydration cups with confetti milestones when targets are met." },
    { title: "Sleep Logger", desc: "Log duration and rate quality (Restless, Average, Deep) using custom range controls." },
    { title: "Daily AI Tips", desc: "Fetches personalized lifestyle tips referencing active profile metrics." },
    { title: "Modern Design Theme", desc: "Clean dark Slate accents, glassmorphism, responsive templates, and light/dark modes." }
  ];

  features.forEach((feat, idx) => {
    const col = idx % 4;
    const row = Math.floor(idx / 4);
    const xPos = 0.8 + (col * 3.0);
    const yPos = 1.5 + (row * 2.6);

    slide.addShape(pptx.shapes.RECTANGLE, {
      x: xPos, y: yPos, w: 2.7, h: 2.3,
      fill: { color: CARD_LIGHT },
      line: { color: 'E2E8F0', width: 1 }
    });

    slide.addText(feat.title, {
      x: xPos + 0.15, y: yPos + 0.15, w: 2.4, h: 0.4,
      fontSize: 13, bold: true, color: BLUE_ACCENT, fontFace: FONT_HEADING
    });

    slide.addText(feat.desc, {
      x: xPos + 0.15, y: yPos + 0.6, w: 2.4, h: 1.5,
      fontSize: 10.5, color: TEXT_MUTED, fontFace: FONT_BODY, lineSpacing: 18
    });
  });

  slide.notes = "We map out the eight main capabilities of the system. In the chat tab, we parse markdown and stream replies. The symptom checker issues structured urgency levels. Hydration logs have quick additions and confetti targets, and the BMI calculator utilizes metrics form components. Each is styled with glassmorphism.";
}

// ==========================================
// SLIDE 7: System Architecture (Light Slate)
// ==========================================
{
  const slide = pptx.addSlide();
  slide.background = { color: LIGHT_BG };
  addSlideNumber(slide, false);

  slide.addText("SYSTEM ARCHITECTURE", {
    x: 0.8, y: 0.5, w: 10.0, h: 0.5,
    fontSize: 28, bold: true, color: TEXT_DARK, fontFace: FONT_HEADING
  });
  slide.addText("Secure client-proxy architecture with Server-Sent Events (SSE) data pipeline.", {
    x: 0.8, y: 0.9, w: 10.0, h: 0.3,
    fontSize: 12, color: TEXT_MUTED, fontFace: FONT_BODY
  });

  // Left Column - Architecture Flow Diagram
  slide.addShape(pptx.shapes.RECTANGLE, {
    x: 0.8, y: 1.6, w: 5.5, h: 4.8,
    fill: { color: CARD_LIGHT },
    line: { color: 'E2E8F0', width: 1 }
  });
  slide.addText("Data Pipeline Diagram", {
    x: 1.1, y: 1.8, w: 4.9, h: 0.4,
    fontSize: 15, bold: true, color: TEXT_DARK, fontFace: FONT_HEADING
  });

  const flows = [
    { title: "React SPA Client (Browser)", sub: "User submits message or symptom list" },
    { title: "Express Proxy Backend (Port 5000)", sub: "Cleans payloads, restricts context to last 5 logs, protects API key" },
    { title: "Groq AI completions endpoint", sub: "Streams tokens asynchronously via llama-3.1-8b-instant" },
    { title: "SSE Stream Parser client", sub: "Decodes binary chunks into UI state and scrolls instantly" }
  ];

  flows.forEach((flow, idx) => {
    const yPos = 2.4 + (idx * 0.9);
    slide.addShape(pptx.shapes.RECTANGLE, {
      x: 1.1, y: yPos, w: 4.9, h: 0.7,
      fill: { color: 'F1F5F9' },
      line: { color: 'CBD5E1', width: 1 }
    });
    slide.addText(flow.title, {
      x: 1.25, y: yPos + 0.08, w: 4.6, h: 0.25,
      fontSize: 11, bold: true, color: BLUE_ACCENT, fontFace: FONT_HEADING
    });
    slide.addText(flow.sub, {
      x: 1.25, y: yPos + 0.33, w: 4.6, h: 0.3,
      fontSize: 9.5, color: TEXT_MUTED, fontFace: FONT_BODY
    });
  });

  // Right Column - Architectural Highlights
  slide.addShape(pptx.shapes.RECTANGLE, {
    x: 6.8, y: 1.6, w: 5.7, h: 4.8,
    fill: { color: CARD_LIGHT },
    line: { color: 'E2E8F0', width: 1 }
  });
  slide.addText("Architectural Advantages", {
    x: 7.1, y: 1.8, w: 5.1, h: 0.4,
    fontSize: 15, bold: true, color: TEXT_DARK, fontFace: FONT_HEADING
  });

  const details = [
    { name: "Zero Client Key Leak Risk", desc: "No API keys are stored in the client-side JavaScript or localStorage, avoiding security and billing vulnerabilities." },
    { name: "Server-Sent Events (SSE)", desc: "We utilize HTTP streaming (SSE) to send token characters from the server as they arrive, avoiding standard body buffering delays." },
    { name: "Context Slicing Optimizer", desc: "The Express API slices discussion transcripts, forwarding only the last 5 messages, ensuring tiny prompt sizes and sub-second token startup." }
  ];

  details.forEach((d, idx) => {
    const yPos = 2.4 + (idx * 1.3);
    slide.addText(d.name, {
      x: 7.1, y: yPos, w: 5.1, h: 0.25,
      fontSize: 13, bold: true, color: PURPLE_ACCENT, fontFace: FONT_HEADING
    });
    slide.addText(d.desc, {
      x: 7.1, y: yPos + 0.25, w: 5.1, h: 0.8,
      fontSize: 11, color: TEXT_MUTED, fontFace: FONT_BODY, lineSpacing: 18
    });
  });

  slide.notes = "In system design, keeping keys safe is vital. AuraHealth AI uses a secure client-proxy pipeline. Instead of exposing keys to the browser, Vite client calls our Node.js Express server. This server formats the system prompt instructions, packages the last 5 logs from history, communicates with Groq API, and returns an HTTP Server-Sent Events stream for instant parsing.";
}

// ==========================================
// SLIDE 8: Technology Stack (Light Slate)
// ==========================================
{
  const slide = pptx.addSlide();
  slide.background = { color: LIGHT_BG };
  addSlideNumber(slide, false);

  slide.addText("THE TECHNOLOGY STACK", {
    x: 0.8, y: 0.5, w: 10.0, h: 0.5,
    fontSize: 28, bold: true, color: TEXT_DARK, fontFace: FONT_HEADING
  });
  slide.addText("Modern, high-performance web frameworks and AI pipelines.", {
    x: 0.8, y: 0.9, w: 10.0, h: 0.3,
    fontSize: 12, color: TEXT_MUTED, fontFace: FONT_BODY
  });

  // Tech items (6 Grid cards)
  const techs = [
    { category: "FRONTEND FRAMEWORK", name: "React (v18) & Vite", desc: "Provides SPA rendering, fast component modularity, and lightning-fast Hot Module Replacement (HMR) development compiles." },
    { category: "STYLING SYSTEM", name: "Tailwind CSS", desc: "Ensures utility-first styling with responsive, curated glassmorphic tokens, consistent dark/light grids, and fluid mobile sizing." },
    { category: "BACKEND SERVER", name: "Node.js & Express", desc: "Handles server operations asynchronously. Provides custom route endpoints for SSE streaming chat and symptom analysis." },
    { category: "AI ENGINE & SDK", name: "Groq SDK & API", desc: "Connects to Groq Llama models. Delivers fast response inference using custom hardware accelerators." },
    { category: "COMPLETION MODEL", name: "Llama 3.1 8B Instant", desc: "Fast production model with 8-billion parameter weights. Configured with temperature 0.3 and 250 max tokens." },
    { category: "ANIMATION ENGINE", name: "Framer Motion", desc: "Controls micro-interactions, responsive panel slide transitions, fade-in card delays, and typing state indicators." }
  ];

  techs.forEach((tech, idx) => {
    const col = idx % 3;
    const row = Math.floor(idx / 3);
    const xPos = 0.8 + (col * 4.0);
    const yPos = 1.6 + (row * 2.6);

    slide.addShape(pptx.shapes.RECTANGLE, {
      x: xPos, y: yPos, w: 3.7, h: 2.3,
      fill: { color: CARD_LIGHT },
      line: { color: 'E2E8F0', width: 1 }
    });

    slide.addText(tech.category, {
      x: xPos + 0.15, y: yPos + 0.15, w: 3.4, h: 0.25,
      fontSize: 9, bold: true, color: PURPLE_ACCENT, fontFace: FONT_HEADING
    });

    slide.addText(tech.name, {
      x: xPos + 0.15, y: yPos + 0.45, w: 3.4, h: 0.35,
      fontSize: 14, bold: true, color: BLUE_ACCENT, fontFace: FONT_HEADING
    });

    slide.addText(tech.desc, {
      x: xPos + 0.15, y: yPos + 0.85, w: 3.4, h: 1.3,
      fontSize: 10.5, color: TEXT_MUTED, fontFace: FONT_BODY, lineSpacing: 18
    });
  });

  slide.notes = "We list the exact versions and tools in our stack. Vite provides rapid client compiles. Tailwind styles components with glassmorphic variables. Node and Express manage SSE requests on the server, while Groq API streams tokens using llama-3.1-8b-instant. Framer Motion manages typing indicators and cards fade-in.";
}

// ==========================================
// SLIDE 9: Website Demonstration (Dark Navy)
// ==========================================
{
  const slide = pptx.addSlide();
  slide.background = { color: DARK_BG };
  addSlideNumber(slide, true);

  slide.addText("WEBSITE DEMONSTRATION", {
    x: 0.8, y: 0.5, w: 10.0, h: 0.5,
    fontSize: 28, bold: true, color: CYAN_TEXT, fontFace: FONT_HEADING
  });
  slide.addText("Live screenshots showcasing modern glassmorphic theme, chat streaming, checker cards, and dashboard scores.", {
    x: 0.8, y: 0.9, w: 10.0, h: 0.3,
    fontSize: 12, color: TEXT_MUTED, fontFace: FONT_BODY
  });

  // Place screenshots with labels (4 panels grid)
  const demos = [
    { title: "Premium Landing Page Hero", file: 'landing_page.png', x: 0.8, y: 1.5, w: 5.6, h: 2.2 },
    { title: "Dynamic Habits Tracker & Score", file: 'dashboard_overview.png', x: 6.8, y: 1.5, w: 5.7, h: 2.2 },
    { title: "Interactive AI Chat Stream Page", file: 'ai_chat.png', x: 0.8, y: 4.1, w: 5.6, h: 2.2 },
    { title: "Structured Symptom Checker Panel", file: 'symptom_checker.png', x: 6.8, y: 4.1, w: 5.7, h: 2.2 }
  ];

  demos.forEach(demo => {
    slide.addShape(pptx.shapes.RECTANGLE, {
      x: demo.x, y: demo.y, w: demo.w, h: demo.h + 0.4,
      fill: { color: CARD_DARK },
      line: { color: '1E293B', width: 1 }
    });

    slide.addText(demo.title, {
      x: demo.x + 0.15, y: demo.y + 0.1, w: demo.w - 0.3, h: 0.25,
      fontSize: 11, bold: true, color: CYAN_TEXT, fontFace: FONT_HEADING
    });

    const imgPath = path.join(destDir, demo.file);
    if (fs.existsSync(imgPath)) {
      slide.addImage({
        path: imgPath,
        x: demo.x + 0.1, y: demo.y + 0.35, w: demo.w - 0.2, h: demo.h - 0.4,
        sizing: { type: 'cover' }
      });
    }
  });

  slide.notes = "In this slide, we present active screens from the running platform. At the top left, we have our dark landing page. At the top right, we show the Wellness Dashboard cards and Health Score points. The bottom-left details the conversation panel with suggested chips. The bottom-right showcases the interactive symptom selector panels. The layouts match responsive screens.";
}

// ==========================================
// SLIDE 10: AI Working Flow (Light Slate)
// ==========================================
{
  const slide = pptx.addSlide();
  slide.background = { color: LIGHT_BG };
  addSlideNumber(slide, false);

  slide.addText("CONVERSATIONAL AGENT FLOW", {
    x: 0.8, y: 0.5, w: 10.0, h: 0.5,
    fontSize: 28, bold: true, color: TEXT_DARK, fontFace: FONT_HEADING
  });
  slide.addText("Step-by-step processing of a user health inquiry with sub-second streaming feedback.", {
    x: 0.8, y: 0.9, w: 10.0, h: 0.3,
    fontSize: 12, color: TEXT_MUTED, fontFace: FONT_BODY
  });

  // Vertical timeline process layout
  const flows = [
    { step: "1. Message Submission", desc: "User inputs text and submits form. Client locks the submission using a synchronous `isLoadingRef`, clears the textbox, immediately appends user message to state, and mounts a blank AI message." },
    { step: "2. Backend Packaging", desc: "Node backend intercepts the query. It slices the history list to the last 5 messages, appends the compressed safety system prompt, and calls the Groq completions endpoint." },
    { step: "3. Server-Sent Events stream", desc: "Express opens an HTTP Server-Sent Events (SSE) stream. It asks the Groq SDK client for a `llama-3.1-8b-instant` model with temperature 0.3 and streams choice delta contents." },
    { step: "4. Client-Side Chunk Decoding", desc: "React's client utilizes a `ReadableStreamReader` to decode binary stream pieces immediately. If a rate limit or API key error object is parsed, it throws an exception immediately." },
    { step: "5. Real-Time UI Renders", desc: "The frontend updates the placeholder message state text on the fly, rendering letters as they emerge. Auto-scrolling runs instantly on chunks, returning input focus to the cursor." }
  ];

  flows.forEach((flow, idx) => {
    const yPos = 1.6 + (idx * 1.05);

    // Number Badge
    slide.addShape(pptx.shapes.OVAL, {
      x: 0.8, y: yPos + 0.1, w: 0.6, h: 0.6,
      fill: { color: BLUE_ACCENT },
      line: { color: '0284C7', width: 1 }
    });
    slide.addText((idx + 1).toString(), {
      x: 0.8, y: yPos + 0.1, w: 0.6, h: 0.6,
      fontSize: 14, bold: true, color: TEXT_LIGHT, fontFace: FONT_HEADING, align: 'center', valign: 'middle'
    });

    // Content card
    slide.addShape(pptx.shapes.RECTANGLE, {
      x: 1.6, y: yPos, w: 10.9, h: 0.85,
      fill: { color: CARD_LIGHT },
      line: { color: 'E2E8F0', width: 1 }
    });

    slide.addText(flow.step, {
      x: 1.8, y: yPos + 0.08, w: 10.5, h: 0.25,
      fontSize: 12, bold: true, color: TEXT_DARK, fontFace: FONT_HEADING
    });

    slide.addText(flow.desc, {
      x: 1.8, y: yPos + 0.33, w: 10.5, h: 0.45,
      fontSize: 10, color: TEXT_MUTED, fontFace: FONT_BODY, lineSpacing: 16
    });
  });

  slide.notes = "Here we map the timeline flow of a user message. When the user sends a query, we lock input with a ref to avoid double submits. The backend constructs the message prompt using sliced history. Groq streams characters via Server-Sent Events, and the client reader parses them instantly, updating state and maintaining scroll position.";
}

// ==========================================
// SLIDE 11: Lean Canvas (Light Slate)
// ==========================================
{
  const slide = pptx.addSlide();
  slide.background = { color: LIGHT_BG };
  addSlideNumber(slide, false);

  slide.addText("STARTUP LEAN CANVAS", {
    x: 0.8, y: 0.4, w: 10.0, h: 0.4,
    fontSize: 28, bold: true, color: TEXT_DARK, fontFace: FONT_HEADING
  });

  // Canvas Layout (Grid coordinates)
  // [Problem] [Solution] [Key Metrics] [UVP] [Unfair Advantage] [Channels] [Segments]
  // [Cost Structure] [Revenue Streams]
  
  const canvas = [
    { title: "PROBLEM", x: 0.8, y: 1.0, w: 2.3, h: 4.2, items: "• Delayed basic health info access\n• Fragmented health calculators & trackers\n• Alarmist self-diagnosis search results" },
    { title: "SOLUTION", x: 3.2, y: 1.0, w: 2.3, h: 2.0, items: "• Unified glassmorphic dashboard\n• Secure agentic chatbot\n• Rapid symptom check reports" },
    { title: "KEY METRICS", x: 3.2, y: 3.2, w: 2.3, h: 2.0, items: "• Active habit log frequency\n• Chat response latency (<1s)\n• Symptom analysis completions" },
    { title: "UNIQUE VALUE PROP", x: 5.6, y: 1.0, w: 2.3, h: 4.2, items: "• Secure proxy health chat\n• Dynamic habits scoring\n• Fast Groq SSE stream\n• 100% Client-side local data storage privacy" },
    { title: "UNFAIR ADVANTAGE", x: 8.0, y: 1.0, w: 2.3, h: 2.0, items: "• Proprietary local-first logic\n• Zero cloud database cost\n• Multi-symptom JSON scheme mapping" },
    { title: "CHANNELS", x: 8.0, y: 3.2, w: 2.3, h: 2.0, items: "• Corporate wellness programs\n• College wellness centers\n• Open-source community" },
    { title: "CUSTOMER SEGMENTS", x: 10.4, y: 1.0, w: 2.1, h: 4.2, items: "• Busy professionals tracking habits\n• Rural patients seeking basic screening\n• Health-conscious tracking enthusiasts" },
    
    // Bottom row
    { title: "COST STRUCTURE", x: 0.8, y: 5.3, w: 5.8, h: 1.3, items: "• Server API computing fees (Groq/Express)\n• Domain keeping & SSL security\n• Open-source codebase enhancements & maintenance" },
    { title: "REVENUE STREAMS", x: 6.8, y: 5.3, w: 5.7, h: 1.3, items: "• Premium custom wellness logs (B2C)\n• Anonymous, structured symptom analytics (B2B)\n• Corporate employee health dashboard licenses" }
  ];

  canvas.forEach(box => {
    slide.addShape(pptx.shapes.RECTANGLE, {
      x: box.x, y: box.y, w: box.w, h: box.h,
      fill: { color: CARD_LIGHT },
      line: { color: 'CBD5E1', width: 1 }
    });

    slide.addText(box.title, {
      x: box.x + 0.1, y: box.y + 0.1, w: box.w - 0.2, h: 0.3,
      fontSize: 10, bold: true, color: BLUE_ACCENT, fontFace: FONT_HEADING
    });

    slide.addText(box.items, {
      x: box.x + 0.1, y: box.y + 0.35, w: box.w - 0.2, h: box.h - 0.4,
      fontSize: 8.5, color: TEXT_DARK, fontFace: FONT_BODY, lineSpacing: 14
    });
  });

  slide.notes = "For startup pitching, we map the product Business Canvas. Our unique value proposition highlights local-first data storage privacy combined with secure proxy API streams. Customers include health tracking enthusiasts and professionals. Cost structures remain light since we bypass cloud databases, and revenue models scale through corporate licenses.";
}

// ==========================================
// SLIDE 12: Competitor Analysis (Light Slate)
// ==========================================
{
  const slide = pptx.addSlide();
  slide.background = { color: LIGHT_BG };
  addSlideNumber(slide, false);

  slide.addText("COMPETITIVE ADVANTAGE MATRIX", {
    x: 0.8, y: 0.5, w: 10.0, h: 0.5,
    fontSize: 28, bold: true, color: TEXT_DARK, fontFace: FONT_HEADING
  });
  slide.addText("Comparing AuraHealth AI with major industry health and diagnostic applications.", {
    x: 0.8, y: 0.9, w: 10.0, h: 0.3,
    fontSize: 12, color: TEXT_MUTED, fontFace: FONT_BODY
  });

  // Add Table
  const tableRows = [
    [
      { text: "Core Feature", options: { bold: true, fill: { color: 'F1F5F9' } } },
      { text: "Google Fit", options: { bold: true, fill: { color: 'F1F5F9' } } },
      { text: "Ada Health", options: { bold: true, fill: { color: 'F1F5F9' } } },
      { text: "AuraHealth AI", options: { bold: true, fill: { color: 'FFADA5' } } }
    ],
    [
      { text: "Daily Habits Log", options: { bold: true } },
      { text: "Yes (Fitness/Steps)" },
      { text: "No (Symptoms focus)" },
      { text: "Yes (Sleep, Water, BMI, Breathe)", options: { bold: true, color: 'FA5543' } }
    ],
    [
      { text: "Interactive Chatbot", options: { bold: true } },
      { text: "No" },
      { text: "No (Linear questionnaire)" },
      { text: "Yes (Conversational Agent)", options: { bold: true, color: '0284C7' } }
    ],
    [
      { text: "Sub-Second Streaming", options: { bold: true } },
      { text: "N/A" },
      { text: "No (Full-page loads)" },
      { text: "Yes (SSE Stream Output)", options: { bold: true, color: '0284C7' } }
    ],
    [
      { text: "Data Privacy Model", options: { bold: true } },
      { text: "Cloud sync (Google DB)" },
      { text: "Cloud sync (Ada DB)" },
      { text: "Local-first (localStorage)", options: { bold: true, color: '0284C7' } }
    ],
    [
      { text: "Unified Health Index", options: { bold: true } },
      { text: "No (Raw statistics)" },
      { text: "No" },
      { text: "Yes (Aggregated Score)", options: { bold: true, color: '0284C7' } }
    ]
  ];

  slide.addTable(tableRows, {
    x: 0.8, y: 1.6, w: 11.7, h: 4.8,
    border: { type: 'solid', color: 'CBD5E1', pt: 1 },
    fontSize: 12,
    fontFace: FONT_BODY,
    align: 'center',
    valign: 'middle'
  });

  slide.notes = "In competitor screening, Google Fit focuses on steps, and Ada Health focuses on linear questionnaires. Neither combines a conversational chat assistant with dynamic habit tracking. AuraHealth AI stands out as a consolidated suite that keeps data local, aggregates metrics into a Health Score, and streams results instantly.";
}

// ==========================================
// SLIDE 13: Platform Advantages (Light Slate)
// ==========================================
{
  const slide = pptx.addSlide();
  slide.background = { color: LIGHT_BG };
  addSlideNumber(slide, false);

  slide.addText("KEY BUSINESS ADVANTAGES", {
    x: 0.8, y: 0.5, w: 10.0, h: 0.5,
    fontSize: 28, bold: true, color: TEXT_DARK, fontFace: FONT_HEADING
  });
  slide.addText("Highlighting why our architecture provides a better developer and user experience.", {
    x: 0.8, y: 0.9, w: 10.0, h: 0.3,
    fontSize: 12, color: TEXT_MUTED, fontFace: FONT_BODY
  });

  const advantages = [
    { title: "24/7 Virtual Care Support", desc: "Delivers wellness advice instantly at any time of day, completely bypassing clinical wait times or consult reservation bookings for routine lifestyle inquiries." },
    { title: "Ultra-Low API Latency", desc: "By optimizing models to llama-3.1-8b-instant, temperature to 0.3, and max tokens to 250, we establish connections and begin stream renders in under a second." },
    { title: "Strict Local-First Privacy", desc: "Locks user records (sleep, BMI progress, water targets) inside the browser's localStorage. Zero compliance liabilities with GDPR or HIPAA cloud databases." },
    { title: "Zero Client Key Vulnerabilities", desc: "All connection keys are locked inside the backend environment variables, restricting exposure to browser code or client-side storage inspectors." },
    { title: "Cohesive Wellness Indexing", desc: "Fuses isolated metrics into a single dynamic Health Score. This visual index encourages users to improve sleep and water levels to see scores climb." }
  ];

  advantages.forEach((adv, idx) => {
    const xPos = 0.8 + (idx * 2.4);
    slide.addShape(pptx.shapes.RECTANGLE, {
      x: xPos, y: 1.8, w: 2.1, h: 4.5,
      fill: { color: CARD_LIGHT },
      line: { color: 'E2E8F0', width: 1 }
    });

    slide.addText(adv.title, {
      x: xPos + 0.15, y: 2.0, w: 1.8, h: 0.9,
      fontSize: 13, bold: true, color: BLUE_ACCENT, fontFace: FONT_HEADING
    });

    slide.addText(adv.desc, {
      x: xPos + 0.15, y: 3.0, w: 1.8, h: 3.1,
      fontSize: 10.5, color: TEXT_MUTED, fontFace: FONT_BODY, lineSpacing: 18
    });
  });

  slide.notes = "Our platforms advantages focus on direct availability, latency control, local data privacy, secure API keys, and cohesive index mapping. By building local storage files, we bypass GDPR and database leaks. By adjusting Groq settings, we ensure sub-second first token replies, and the health score keeps users motivated.";
}

// ==========================================
// SLIDE 14: Future Scope (Light Slate)
// ==========================================
{
  const slide = pptx.addSlide();
  slide.background = { color: LIGHT_BG };
  addSlideNumber(slide, false);

  slide.addText("ROADMAP & FUTURE SCOPE", {
    x: 0.8, y: 0.5, w: 10.0, h: 0.5,
    fontSize: 28, bold: true, color: TEXT_DARK, fontFace: FONT_HEADING
  });
  slide.addText("Expanding the platform into wearable integrations, mobile formats, and clinical scheduling.", {
    x: 0.8, y: 0.9, w: 10.0, h: 0.3,
    fontSize: 12, color: TEXT_MUTED, fontFace: FONT_BODY
  });

  // Future scopes (2x3 grid)
  const scopes = [
    { title: "Voice Agent Integration", desc: "Integrate Web Speech API for hands-free health logs and voice-synthesized wellness coaching." },
    { title: "Smartwatch Wearable Sync", desc: "Import sleep duration, step counts, and active calories from Apple Watch and Android Fit telemetry APIs." },
    { title: "Direct Clinician Booking", desc: "Provide scheduling connections with certified doctors when symptoms exceed medium urgency thresholds." },
    { title: "Secure EHR Prescriptions", desc: "Create secure PDF parsing tools to decode clinical prescription records locally." },
    { title: "Native Mobile Platform", desc: "Package pages into a native Android/iOS wrapper using React Native for mobile push reminders." },
    { title: "AI Predictive Analytics", desc: "Examine habits histories to forecast potential wellness drops and prompt proactive rest periods." }
  ];

  scopes.forEach((scope, idx) => {
    const col = idx % 3;
    const row = Math.floor(idx / 3);
    const xPos = 0.8 + (col * 4.0);
    const yPos = 1.6 + (row * 2.6);

    slide.addShape(pptx.shapes.RECTANGLE, {
      x: xPos, y: yPos, w: 3.7, h: 2.3,
      fill: { color: CARD_LIGHT },
      line: { color: 'E2E8F0', width: 1 }
    });

    slide.addText(scope.title, {
      x: xPos + 0.15, y: yPos + 0.15, w: 3.4, h: 0.3,
      fontSize: 14, bold: true, color: PURPLE_ACCENT, fontFace: FONT_HEADING
    });

    slide.addText(scope.desc, {
      x: xPos + 0.15, y: yPos + 0.55, w: 3.4, h: 1.6,
      fontSize: 11, color: TEXT_MUTED, fontFace: FONT_BODY, lineSpacing: 18
    });
  });

  slide.notes = "Looking forward, the roadmap is clear. We plan to add speech synthesis for voice inputs, smartwatch synchronization for step and heart statistics, doctor consultations for high-urgency checks, and predictive AI analytics to anticipate wellness drops before severe symptoms develop.";
}

// ==========================================
// SLIDE 15: Conclusion (Dark Navy)
// ==========================================
{
  const slide = pptx.addSlide();
  slide.background = { color: DARK_BG };
  addSlideNumber(slide, true);

  slide.addText("PROJECT CONCLUSION", {
    x: 0.8, y: 0.5, w: 10.0, h: 0.5,
    fontSize: 28, bold: true, color: CYAN_TEXT, fontFace: FONT_HEADING
  });
  slide.addText("Empowering early personal wellness tracking through Agentic AI interfaces.", {
    x: 0.8, y: 0.9, w: 10.0, h: 0.3,
    fontSize: 12, color: TEXT_MUTED, fontFace: FONT_BODY
  });

  // Left Column - Summary Text
  slide.addShape(pptx.shapes.RECTANGLE, {
    x: 0.8, y: 1.6, w: 5.5, h: 4.8,
    fill: { color: CARD_DARK },
    line: { color: '1E293B', width: 1 }
  });
  slide.addText("Project Summary", {
    x: 1.1, y: 1.8, w: 4.9, h: 0.4,
    fontSize: 18, bold: true, color: CYAN_TEXT, fontFace: FONT_HEADING
  });
  slide.addText("AuraHealth AI successfully demonstrates that daily health logs can be aggregated, analyzed, and reinforced by conversational AI without compromising user privacy or speed.\n\nBy leveraging low-latency models and HTTP streaming pipelines, the platform bypasses the wait times of traditional websites, giving users sub-second answers to wellness questions, while the structured symptom reporter highlights warning flags for serious complaints.", {
    x: 1.1, y: 2.4, w: 4.9, h: 3.7,
    fontSize: 12, color: TEXT_LIGHT, fontFace: FONT_BODY, lineSpacing: 22
  });

  // Right Column - Core Metrics & Impact
  slide.addShape(pptx.shapes.RECTANGLE, {
    x: 6.8, y: 1.6, w: 5.7, h: 4.8,
    fill: { color: CARD_DARK },
    line: { color: '1E293B', width: 1 }
  });
  slide.addText("Platform Impact Metrics", {
    x: 7.1, y: 1.8, w: 5.1, h: 0.4,
    fontSize: 18, bold: true, color: PURPLE_ACCENT, fontFace: FONT_HEADING
  });

  const impacts = [
    { title: "Sub-Second Latency (<1s)", desc: "First tokens render immediately, keeping the interface snappy and preventing loading freezes." },
    { title: "100% Local Compliance", desc: "Data remains on the client device, resolving database liabilities and compliance costs." },
    { title: "Active SDG 3 Contribution", desc: "Provides early health warnings and free guidance to remote users." }
  ];

  impacts.forEach((imp, idx) => {
    const yPos = 2.4 + (idx * 1.3);
    slide.addText(imp.title, {
      x: 7.1, y: yPos, w: 5.1, h: 0.25,
      fontSize: 13, bold: true, color: TEXT_LIGHT, fontFace: FONT_HEADING
    });
    slide.addText(imp.desc, {
      x: 7.1, y: yPos + 0.25, w: 5.1, h: 0.8,
      fontSize: 11, color: TEXT_MUTED, fontFace: FONT_BODY, lineSpacing: 18
    });
  });

  slide.notes = "In conclusion, AuraHealth AI shows the power of local-first development. We have created a secure chat engine that starts in less than a second. It aggregates daily habits, maps discomforts, and keeps records private. This provides an effective evaluation demo suitable for college presentation committees and investors alike.";
}

// ==========================================
// SLIDE 16: Thank You & Contact (Dark Navy)
// ==========================================
{
  const slide = pptx.addSlide();
  slide.background = { color: DARK_BG };
  addSlideNumber(slide, true);

  slide.addText("THANK YOU", {
    x: 1.0, y: 2.0, w: 11.3, h: 1.0,
    fontSize: 64, bold: true, color: CYAN_TEXT, fontFace: FONT_HEADING, align: 'center'
  });

  slide.addText("Empowering Wellness through Intelligent Agentic Guidance", {
    x: 1.0, y: 3.1, w: 11.3, h: 0.5,
    fontSize: 20, bold: true, color: TEXT_LIGHT, fontFace: FONT_HEADING, align: 'center'
  });

  slide.addText("Questions & Answers Section", {
    x: 1.0, y: 3.7, w: 11.3, h: 0.4,
    fontSize: 15, italic: true, color: PURPLE_ACCENT, fontFace: FONT_BODY, align: 'center'
  });

  // Contact parameters card
  slide.addShape(pptx.shapes.RECTANGLE, {
    x: 3.66, y: 4.8, w: 6.0, h: 1.5,
    fill: { color: CARD_DARK },
    line: { color: '1E293B', width: 1 }
  });

  slide.addText("Developer Contact Info:\nEmail: contact@AuraHealth.ai | Website: www.AuraHealth.ai\nGitHub: github.com/username/AuraHealth-ai", {
    x: 3.86, y: 5.0, w: 5.6, h: 1.1,
    fontSize: 12, color: TEXT_LIGHT, fontFace: FONT_BODY, align: 'center', lineSpacing: 22
  });

  slide.notes = "I would like to thank the evaluation committee, our academic guide, and the department members for their constant supervision and support. I am now open to taking any questions on the frontend components, Express backend structures, Groq streaming configurations, or UX layouts. Thank you.";
}

// 3. Save PPTX File
pptx.writeFile({ fileName: 'AuraHealth_AI_Pitch_Deck.pptx' })
  .then(fileName => {
    console.log(`\n🎉 Success! PowerPoint presentation generated: ${fileName}`);
  })
  .catch(err => {
    console.error("❌ Error generating PowerPoint:", err);
  });
