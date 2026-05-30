"use client";

import { useEffect, useState, useRef } from "react";
import { SOCIAL_CATEGORIES, SocialIcon } from "@/components/SocialIcons";

interface Social {
  name: string;
  url: string;
  display_order?: number;
}

export default function SocialsAdminPage() {
  const [socials, setSocials] = useState<Social[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/socials")
      .then((res) => res.json())
      .then((data) => {
        setSocials(data || []);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isDropdownOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    } else {
      setSearchQuery("");
    }
  }, [isDropdownOpen]);

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch("/api/socials", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(socials),
      });
      if (!res.ok) throw new Error("Failed to save");
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error(err);
      alert("Error saving socials");
    } finally {
      setSaving(false);
    }
  };

  const addSocial = (platformName: string) => {
    setSocials([...socials, { name: platformName, url: "" }]);
    setSaved(false);
    setIsDropdownOpen(false);
  };

  const removeSocial = (index: number) => {
    setSocials(socials.filter((_, i) => i !== index));
    setSaved(false);
  };

  const updateSocial = (index: number, value: string) => {
    const updated = [...socials];
    updated[index] = { ...updated[index], url: value };
    setSocials(updated);
    setSaved(false);
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    const updated = [...socials];
    [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
    setSocials(updated);
    setSaved(false);
  };

  const moveDown = (index: number) => {
    if (index === socials.length - 1) return;
    const updated = [...socials];
    [updated[index], updated[index + 1]] = [updated[index + 1], updated[index]];
    setSocials(updated);
    setSaved(false);
  };

  const usedPlatforms = socials.map(s => s.name);
  
  const filteredCategories = SOCIAL_CATEGORIES.map(c => ({
    ...c,
    platforms: c.platforms.filter(p => !usedPlatforms.includes(p) && p.toLowerCase().includes(searchQuery.toLowerCase()))
  })).filter(c => c.platforms.length > 0);

  const hasAvailable = SOCIAL_CATEGORIES.some(c => c.platforms.some(p => !usedPlatforms.includes(p)));

  return (
    <>
      {/* Top Bar */}
      <div className="flex items-center justify-between px-6 md:px-10 py-5 border-b border-gray-200">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Socials</h2>
          <p className="text-sm text-gray-500 mt-0.5">Manage your footer social links</p>
        </div>
        <button
          onClick={handleSave}
          title="Save"
          disabled={saving || loading}
          className="rounded-lg bg-white border border-gray-900 p-2.5 text-gray-900 shadow-sm hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {saving ? (
            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
          ) : saved ? (
            <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>
          )}
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 md:p-10 overflow-auto">
        {loading ? (
          <div className="space-y-4 w-full">
            {[1, 2].map((i) => (
              <div key={i} className="h-20 bg-gray-50 border border-gray-100 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="w-full space-y-4 pb-32">
            {socials.map((social, index) => (
              <div key={index} className="flex items-center gap-4 bg-white p-4 border border-gray-200 rounded-xl shadow-sm transition-all hover:border-gray-300">
                {/* Controls */}
                <div className="flex flex-col gap-1">
                  <button 
                    onClick={() => moveUp(index)}
                    disabled={index === 0}
                    className="p-1 text-gray-400 hover:text-gray-900 disabled:opacity-30 disabled:hover:text-gray-400 rounded transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
                  </button>
                  <button 
                    onClick={() => moveDown(index)}
                    disabled={index === socials.length - 1}
                    className="p-1 text-gray-400 hover:text-gray-900 disabled:opacity-30 disabled:hover:text-gray-400 rounded transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  </button>
                </div>
                
                {/* Icon & Label */}
                <div className="flex items-center gap-3 w-40 flex-shrink-0">
                  <div className="flex items-center justify-center w-10 h-10 bg-gray-50 rounded-lg border border-gray-100">
                    <SocialIcon name={social.name} className="w-5 h-5 text-gray-700" />
                  </div>
                  <span className="font-medium text-gray-700 text-sm truncate">{social.name}</span>
                </div>

                {/* Input */}
                <div className="flex-1">
                  <input
                    type="url"
                    placeholder="https://..."
                    value={social.url}
                    onChange={(e) => updateSocial(index, e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-sm focus:bg-white focus:ring-2 focus:ring-gray-900 focus:border-transparent placeholder:text-gray-400 transition-all"
                  />
                </div>

                {/* Delete */}
                <button
                  onClick={() => removeSocial(index)}
                  className="p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors ml-2 flex-shrink-0"
                  title="Delete"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              </div>
            ))}

            {hasAvailable && (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className={`w-full py-5 border-2 border-dashed rounded-xl transition-all font-medium flex items-center justify-center gap-2 group ${
                    isDropdownOpen 
                      ? "border-gray-400 bg-gray-50 text-gray-900" 
                      : "border-gray-200 text-gray-500 hover:text-gray-900 hover:border-gray-400 hover:bg-gray-50"
                  }`}
                >
                  <svg className={`w-5 h-5 transition-transform ${isDropdownOpen ? "rotate-45 text-gray-900" : "text-gray-400 group-hover:text-gray-900"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                  Add Social Link
                </button>

                {isDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-10 overflow-hidden flex flex-col max-h-[500px]">
                    <div className="p-3 border-b border-gray-100 bg-gray-50/50">
                      <div className="relative">
                        <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        <input
                          ref={searchInputRef}
                          type="text"
                          placeholder="Search platforms..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all bg-white"
                        />
                      </div>
                    </div>
                    
                    <div className="overflow-y-auto p-2">
                      {filteredCategories.length === 0 ? (
                        <div className="p-4 text-center text-sm text-gray-500">No platforms found.</div>
                      ) : (
                        filteredCategories.map((cat, i) => (
                          <div key={cat.category} className={i !== 0 ? "mt-4" : ""}>
                            <h3 className="px-3 mb-2 text-xs font-bold uppercase tracking-wider text-gray-400">
                              {cat.category}
                            </h3>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 px-1">
                              {cat.platforms.map((platform) => (
                                <button
                                  key={platform}
                                  onClick={() => addSocial(platform)}
                                  className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-gray-100 transition-colors border border-transparent hover:border-gray-200"
                                >
                                  <SocialIcon name={platform} className="w-6 h-6 text-gray-700" />
                                  <span className="text-xs font-medium text-gray-600 text-center">{platform}</span>
                                </button>
                              ))}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
