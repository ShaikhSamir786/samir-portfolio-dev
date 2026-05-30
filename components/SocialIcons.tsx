import React from 'react';
import {
  FaGithub, FaGitlab, FaBitbucket, FaLinkedin, FaAngellist, FaCodepen, FaDribbble, FaBehance, FaFigma, FaMedium, FaNpm, FaDocker, FaKaggle, FaUnity, FaSteam, FaProductHunt, FaReddit, FaDiscord, FaYoutube, FaTwitch, FaPatreon, FaDev
} from 'react-icons/fa';
import { FaXTwitter } from "react-icons/fa6";
import {
  SiSourceforge, SiLaunchpad, SiPolywork, SiPeerlist, SiBento, SiLeetcode, SiHackerrank, SiCodeforces, SiCodechef, SiCodewars, SiTopcoder, SiHackerearth, SiCodesandbox, SiStackblitz, SiJsfiddle, SiReplit, SiHashnode, SiSubstack, SiPypi, SiRust, SiRubygems, SiPackagist, SiApachemaven, SiNuget, SiHuggingface, SiHackthebox, SiTryhackme, SiIndiehackers, SiCrunchbase, SiStackoverflow, SiCalendly, SiUpwork, SiFiverr, SiBuymeacoffee, SiKofi
} from 'react-icons/si';

export const SOCIAL_CATEGORIES = [
  {
    category: "Version Control & Repositories",
    platforms: ["GitHub", "GitLab", "Bitbucket", "SourceForge", "Launchpad"]
  },
  {
    category: "Professional Networks & Jobs",
    platforms: ["LinkedIn", "Wellfound", "Polywork", "Peerlist", "Bento.me"]
  },
  {
    category: "Algorithm & Coding Challenges",
    platforms: ["LeetCode", "HackerRank", "Codeforces", "CodeChef", "Codewars", "Topcoder", "HackerEarth"]
  },
  {
    category: "Code Sandboxes & UI/UX Design",
    platforms: ["CodePen", "CodeSandbox", "StackBlitz", "JSFiddle", "Replit", "Dribbble", "Behance", "Figma"]
  },
  {
    category: "Technical Writing & Blogging",
    platforms: ["DEV Community", "Hashnode", "Medium", "Substack", "Tealfeed"]
  },
  {
    category: "Package Registries & Open Source",
    platforms: ["npm", "PyPI", "Docker Hub", "Crates.io", "RubyGems", "Packagist", "Maven Central", "NuGet"]
  },
  {
    category: "Specializations",
    platforms: ["Kaggle", "Hugging Face", "Hack The Box", "TryHackMe", "itch.io", "Unity Connect", "Steam Creator Page"]
  },
  {
    category: "Product Launches & Entrepreneurship",
    platforms: ["Product Hunt", "Indie Hackers", "Crunchbase", "Peerlist Spotlight"]
  },
  {
    category: "Communities & Support",
    platforms: ["Stack Overflow", "Reddit", "X", "Discord", "YouTube", "Twitch"]
  },
  {
    category: "Scheduling, Freelance & Monetization",
    platforms: ["Calendly", "Upwork", "Fiverr", "GitHub Sponsors", "Patreon", "Buy Me a Coffee", "Ko-fi"]
  }
];

export const SOCIAL_PLATFORMS = SOCIAL_CATEGORIES.flatMap(c => c.platforms);

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  "GitHub": FaGithub,
  "GitLab": FaGitlab,
  "Bitbucket": FaBitbucket,
  "SourceForge": SiSourceforge,
  "Launchpad": SiLaunchpad,
  "LinkedIn": FaLinkedin,
  "Wellfound": FaAngellist,
  "Polywork": SiPolywork,
  "Peerlist": SiPeerlist,
  "Bento.me": SiBento,
  "LeetCode": SiLeetcode,
  "HackerRank": SiHackerrank,
  "Codeforces": SiCodeforces,
  "CodeChef": SiCodechef,
  "Codewars": SiCodewars,
  "Topcoder": SiTopcoder,
  "HackerEarth": SiHackerearth,
  "CodePen": FaCodepen,
  "CodeSandbox": SiCodesandbox,
  "StackBlitz": SiStackblitz,
  "JSFiddle": SiJsfiddle,
  "Replit": SiReplit,
  "Dribbble": FaDribbble,
  "Behance": FaBehance,
  "Figma": FaFigma,
  "DEV Community": FaDev,
  "Hashnode": SiHashnode,
  "Medium": FaMedium,
  "Substack": SiSubstack,
  "npm": FaNpm,
  "PyPI": SiPypi,
  "Docker Hub": FaDocker,
  "Crates.io": SiRust,
  "RubyGems": SiRubygems,
  "Packagist": SiPackagist,
  "Maven Central": SiApachemaven,
  "NuGet": SiNuget,
  "Kaggle": FaKaggle,
  "Hugging Face": SiHuggingface,
  "Hack The Box": SiHackthebox,
  "TryHackMe": SiTryhackme,
  "Unity Connect": FaUnity,
  "Steam Creator Page": FaSteam,
  "Product Hunt": FaProductHunt,
  "Indie Hackers": SiIndiehackers,
  "Crunchbase": SiCrunchbase,
  "Peerlist Spotlight": SiPeerlist,
  "Stack Overflow": SiStackoverflow,
  "Reddit": FaReddit,
  "X": FaXTwitter,
  "Discord": FaDiscord,
  "YouTube": FaYoutube,
  "Twitch": FaTwitch,
  "Calendly": SiCalendly,
  "Upwork": SiUpwork,
  "Fiverr": SiFiverr,
  "GitHub Sponsors": FaGithub,
  "Patreon": FaPatreon,
  "Buy Me a Coffee": SiBuymeacoffee,
  "Ko-fi": SiKofi
};

export const SocialIcon = ({ name, className = "w-6 h-6" }: { name: string, className?: string }) => {
  const IconComponent = iconMap[name];
  if (IconComponent) {
    return <IconComponent className={className} />;
  }

  // Fallback
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
    </svg>
  );
};
