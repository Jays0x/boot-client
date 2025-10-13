"use client";
import React, { useState, useEffect } from "react";

// Built-in templates
const builtinTemplates = {
  "next-app": {
    name: "Next.js App",
    command: (name: string) => `npx create-next-app@latest ${name} --typescript`,
    description: "Bootstrap a Next.js project with TypeScript",
  },
  "express-api": {
    name: "Express API",
    command: (name: string) => `npx express-generator ${name} --no-view`,
    description: "Bootstrap a simple Express API project",
  },
  "nest-app": {
    name: "NestJS App",
    command: (name: string) => `npm i -g @nestjs/cli && nest new ${name}`,
    description: "Bootstrap a new NestJS backend project",
  },
};

// Helper: generate random project name
const getRandomName = (prefix: string) => `${prefix}-${Math.floor(Math.random() * 1000)}`;

function Page() {
  const [displayedLines, setDisplayedLines] = useState<string[]>([]);
  const [currentChar, setCurrentChar] = useState(0);
  const [currentCommandIndex, setCurrentCommandIndex] = useState(0);
  const [demoCommands, setDemoCommands] = useState<any[]>([]);
  const [showComment, setShowComment] = useState(false);

  // Generate demo commands dynamically
  const generateDemoCommands = () => {
    return [
      ...Object.entries(builtinTemplates).map(([key, template]) => ({
        cmd: `boot create ${key} ${getRandomName(key)}`,
        comment: `# ${template.description}`,
      })),
      { cmd: 'boot save dev "npm run dev"', comment: "# Save your daily dev command" },
      { cmd: 'boot add-template my-repo "git clone https://github.com/user/my-template.git {{name}}"', comment: "# Auto Clone any repo" },
      { cmd: "boot run dev", comment: "# Run your saved development command" },
      { cmd: "boot sync", comment: "# Sync your saved syntax on other device" },
    ];
  };

  useEffect(() => {
    if (demoCommands.length === 0) {
      setDemoCommands(generateDemoCommands());
      return;
    }

    if (currentCommandIndex >= demoCommands.length) {
      // Loop: reset commands
      const timeout = setTimeout(() => {
        setCurrentCommandIndex(0);
        setCurrentChar(0);
        setDisplayedLines([]);
        setShowComment(false);
        setDemoCommands(generateDemoCommands());
      }, 2000);
      return () => clearTimeout(timeout);
    }

    const currentCommand = demoCommands[currentCommandIndex];
    const line = currentCommand.cmd;

    if (!showComment) {
      // Show comment first
      const timeout = setTimeout(() => {
        setDisplayedLines([currentCommand.comment]);
        setShowComment(true);
      }, 500); // small delay before comment appears
      return () => clearTimeout(timeout);
    } else if (currentChar < line.length) {
      // Type command character by character
      const timeout = setTimeout(() => {
        setDisplayedLines([currentCommand.comment, line.slice(0, currentChar + 1)]);
        setCurrentChar(currentChar + 1);
      }, 50);
      return () => clearTimeout(timeout);
    } else {
      // After typing command, pause, then clear for next command
      const timeout = setTimeout(() => {
        setCurrentCommandIndex(currentCommandIndex + 1);
        setCurrentChar(0);
        setDisplayedLines([]);
        setShowComment(false);
      }, 2000); // show command + comment for 1.5s
      return () => clearTimeout(timeout);
    }
  }, [currentChar, currentCommandIndex, demoCommands, showComment]);

  return (
    <div className="min-h-screen bg-[#0F0F0F] flex items-center justify-center px-4 font-sans">
      <div className="max-w-2xl text-center">
        <h1 className="md:text-5xl text-3xl font-bold mb-4 text-white font-sans">
          Boot — Your Developer Autopilot
        </h1>
        <p className="text-lg text-white/70 mb-8 font-sans">
          Save commands, bootstrap projects, and manage templates instantly. Stop typing repetitive commands and get back to coding faster.
        </p>

        <div className="bg-[#181818] rounded-xl shadow-2xl p-6 text-left font-mono text-white/80 border border-white/10 relative">
          <div className="flex space-x-2 mb-4">
            <span className="w-3 h-3 rounded-full bg-red-500 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-yellow-500 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-green-500 inline-block"></span>
          </div>

          {displayedLines.map((line, idx) => (
            <p
              key={idx}
              className={line.startsWith("#") ? "text-white/50 mt-1 ml-4 font-mono" : "font-mono"}
            >
              <strong>$ {''}</strong>
              {line}
              {/* Only show cursor on the last line that's being typed */}
              {idx === displayedLines.length - 1 && currentChar < (demoCommands[currentCommandIndex]?.cmd.length || 0) && (
                <span className="text-white animate-blink">█</span>
              )}
            </p>
          ))}
        </div>

    <div className="flex gap-3 items-center justify-center">
          <a
          href="https://www.npmjs.com/package/@boot-dev/boot"
          className="inline-block mt-8 px-8 py-3 bg-white text-[#0C0C0C] font-semibold rounded-lg transition font-sans"
        >
          Read docs
        </a>
            <a
          href="https://github.com/Jays0x/boot"
          className="inline-block mt-8 px-8 py-3 border border-white/10 bg-[#181818] text-[#fff] font-semibold rounded-lg transition font-sans"
        >
          Contribute
        </a>
    </div>
      </div>

      <style jsx>{`
        @keyframes blink {
          0%, 50%, 100% { opacity: 1; }
          25%, 75% { opacity: 0; }
        }
        .animate-blink {
          display: inline-block;
          animation: blink 1s step-start infinite;
        }
      `}</style>
    </div>
  );
}

export default Page;
