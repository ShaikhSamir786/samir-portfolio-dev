"use client";

import { useEffect, useState } from "react";
import TipTapEditor from "@/components/admin/TipTapEditor";
import DatePicker from "@/components/admin/DatePicker";
import MediaLibraryModal from "@/components/admin/MediaLibraryModal";

interface Experience {
  id?: string;
  company_name: string;
  logo_url: string;
  position: string;
  description: string;
  start_date: string;
  end_date: string;
  pay: string;
  is_current: boolean;
  display_order?: number;
}

export default function ExperienceAdminPage() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [mediaModalState, setMediaModalState] = useState<{ isOpen: boolean; index: number | null }>({ isOpen: false, index: null });

  useEffect(() => {
    fetchExperiences();
  }, []);

  async function fetchExperiences() {
    try {
      const res = await fetch("/api/experience");
      if (res.ok) {
        const data = await res.json();
        // Convert date strings to YYYY-MM-DD for inputs
        const formattedData = data.map((exp: any) => ({
          ...exp,
          start_date: exp.start_date ? new Date(exp.start_date).toISOString().split("T")[0] : "",
          end_date: exp.end_date ? new Date(exp.end_date).toISOString().split("T")[0] : "",
        }));
        setExperiences(formattedData);
        if (formattedData.length > 0) setExpandedIndex(0);
      }
    } catch (err) {
      console.error("Failed to fetch experiences:", err);
    } finally {
      setLoading(false);
    }
  }

  const handleSave = async () => {
    // Validate
    for (let i = 0; i < experiences.length; i++) {
      const exp = experiences[i];
      if (!exp.company_name || !exp.position || !exp.start_date) {
        alert(`Please fill required fields (Company, Position, Start Date) for experience #${i + 1}`);
        setExpandedIndex(i);
        return;
      }
    }

    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch("/api/experience", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(experiences),
      });
      if (!res.ok) throw new Error("Failed to save");
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      
      // Re-fetch to get new IDs
      await fetchExperiences();
    } catch (err) {
      console.error(err);
      alert("Error saving experiences");
    } finally {
      setSaving(false);
    }
  };

  const addExperience = () => {
    const newExp: Experience = {
      company_name: "",
      logo_url: "",
      position: "",
      description: "",
      start_date: "",
      end_date: "",
      pay: "",
      is_current: false,
    };
    setExperiences([newExp, ...experiences]);
    setExpandedIndex(0);
    setSaved(false);
  };

  const removeExperience = (index: number) => {
    if (!confirm("Are you sure you want to remove this experience?")) return;
    setExperiences(experiences.filter((_, i) => i !== index));
    if (expandedIndex === index) setExpandedIndex(null);
    setSaved(false);
  };

  const updateExperience = (index: number, field: keyof Experience, value: any) => {
    const updated = [...experiences];
    updated[index] = { ...updated[index], [field]: value };
    
    // If is_current is true, clear end_date
    if (field === "is_current" && value === true) {
      updated[index].end_date = "";
    }
    
    setExperiences(updated);
    setSaved(false);
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    const updated = [...experiences];
    [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
    setExperiences(updated);
    if (expandedIndex === index) setExpandedIndex(index - 1);
    else if (expandedIndex === index - 1) setExpandedIndex(index);
    setSaved(false);
  };

  const moveDown = (index: number) => {
    if (index === experiences.length - 1) return;
    const updated = [...experiences];
    [updated[index], updated[index + 1]] = [updated[index + 1], updated[index]];
    setExperiences(updated);
    if (expandedIndex === index) setExpandedIndex(index + 1);
    else if (expandedIndex === index + 1) setExpandedIndex(index);
    setSaved(false);
  };

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };



  return (
    <main className="flex flex-1">
      <div className="flex-1 p-6 md:p-10 overflow-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-semibold tracking-tight">Work Experience</h1>
          <div className="flex items-center gap-3">
            <button
              onClick={addExperience}
              title="Add Experience"
              className="rounded-lg bg-background border border-border-primary p-2.5 text-foreground shadow-sm hover:bg-footer-bg transition-colors flex items-center justify-center"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            </button>
            <button
              onClick={handleSave}
              title="Save All"
              disabled={saving || loading}
              className="rounded-lg bg-background border border-border-primary p-2.5 text-foreground shadow-sm hover:bg-footer-bg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {saving ? (
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              ) : saved ? (
                <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>
              )}
            </button>
          </div>
        </div>
        
        {loading ? (
          <div className="space-y-4 w-full">
            {[1, 2].map((i) => (
              <div key={i} className="h-20 bg-footer-bg border border-border-primary rounded-xl animate-pulse" />
            ))}
          </div>
        ) : experiences.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed border-border-primary rounded-2xl">
            <h3 className="text-lg font-medium text-foreground mb-2">No experiences yet</h3>
            <p className="text-sm text-text-muted mb-6">Add your work history to show on your profile.</p>
            <button
              onClick={addExperience}
              className="inline-flex items-center gap-2 rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
              Add Your First Role
            </button>
          </div>
        ) : (
          <div className="w-full space-y-4 pb-32">
            {experiences.map((exp, index) => {
              const isExpanded = expandedIndex === index;
              return (
                <div key={index} className={`bg-background border transition-all shadow-sm rounded-xl ${isExpanded ? "border-border-primary" : "border-border-primary hover:border-border-primary"}`}>
                  {/* Header Row */}
                  <div className="flex items-center p-4 gap-4">
                    {/* Controls */}
                    <div className="flex flex-col gap-1">
                      <button 
                        onClick={() => moveUp(index)}
                        disabled={index === 0}
                        className="p-1 text-text-muted hover:text-foreground disabled:opacity-30 disabled:hover:text-text-muted rounded transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
                      </button>
                      <button 
                        onClick={() => moveDown(index)}
                        disabled={index === experiences.length - 1}
                        className="p-1 text-text-muted hover:text-foreground disabled:opacity-30 disabled:hover:text-text-muted rounded transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                      </button>
                    </div>

                    {/* Summary Info (clickable to expand) */}
                    <div className="flex-1 flex items-center gap-4 cursor-pointer" onClick={() => toggleExpand(index)}>
                      {exp.logo_url ? (
                        <img src={exp.logo_url} alt="Logo" className="w-10 h-10 rounded object-cover border border-border-primary bg-footer-bg" />
                      ) : (
                        <div className="w-10 h-10 rounded border border-border-primary bg-footer-bg flex items-center justify-center text-text-muted">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                        </div>
                      )}
                      <div>
                        <h3 className="font-medium text-foreground">{exp.position || "New Role"}</h3>
                        <p className="text-sm text-text-muted">{exp.company_name || "Company"} • {exp.start_date ? new Date(exp.start_date).getFullYear() : "YYYY"} - {exp.is_current ? "Present" : exp.end_date ? new Date(exp.end_date).getFullYear() : "YYYY"}</p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleExpand(index)}
                        className="p-2 text-text-muted hover:text-foreground rounded-lg transition-colors"
                      >
                        <svg className={`w-5 h-5 transition-transform ${isExpanded ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                      </button>
                      <button
                        onClick={() => removeExperience(index)}
                        className="p-2 text-text-muted hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  </div>

                  {/* Expanded Content */}
                  {isExpanded && (
                    <div className="p-4 border-t border-border-primary bg-footer-bg space-y-5">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-1.5">
                          <label className="block text-xs font-medium text-text-secondary">Company Name *</label>
                          <input
                            type="text"
                            value={exp.company_name}
                            onChange={(e) => updateExperience(index, "company_name", e.target.value)}
                            className="w-full px-3 py-2 text-sm border border-border-primary rounded-lg focus:ring-2 focus:ring-border-primary outline-none bg-background"
                            placeholder="e.g. Google"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="block text-xs font-medium text-text-secondary">Position *</label>
                          <input
                            type="text"
                            value={exp.position}
                            onChange={(e) => updateExperience(index, "position", e.target.value)}
                            className="w-full px-3 py-2 text-sm border border-border-primary rounded-lg focus:ring-2 focus:ring-border-primary outline-none bg-background"
                            placeholder="e.g. Senior Software Engineer"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-1.5">
                          <label className="block text-xs font-medium text-text-secondary">Company Logo</label>
                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              onClick={() => setMediaModalState({ isOpen: true, index })}
                              className="inline-flex items-center justify-center px-4 py-2 border border-border-primary rounded-lg text-sm font-medium text-text-secondary bg-background hover:bg-footer-bg cursor-pointer transition-colors shadow-sm"
                            >
                              Choose from Library
                            </button>
                            {exp.logo_url && (
                              <button
                                onClick={() => updateExperience(index, "logo_url", "")}
                                className="text-xs text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-400 font-medium"
                              >
                                Remove
                              </button>
                            )}
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <label className="block text-xs font-medium text-text-secondary">Pay / Salary</label>
                          <input
                            type="text"
                            value={exp.pay}
                            onChange={(e) => updateExperience(index, "pay", e.target.value)}
                            className="w-full px-3 py-2 text-sm border border-border-primary rounded-lg focus:ring-2 focus:ring-border-primary outline-none bg-background"
                            placeholder="e.g. $150k/yr (Optional)"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-1.5">
                          <label className="block text-xs font-medium text-text-secondary">Start Date *</label>
                          <DatePicker
                            value={exp.start_date}
                            onChange={(val) => updateExperience(index, "start_date", val)}
                            placeholder="Select start date"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between mb-1">
                            <label className="block text-xs font-medium text-text-secondary">End Date</label>
                            <label className="flex items-center gap-1.5 text-xs text-text-muted cursor-pointer">
                              <input
                                type="checkbox"
                                checked={exp.is_current}
                                onChange={(e) => updateExperience(index, "is_current", e.target.checked)}
                                className="rounded border-border-primary text-foreground focus:ring-border-primary"
                              />
                              Current Role
                            </label>
                          </div>
                          <DatePicker
                            value={exp.end_date}
                            onChange={(val) => updateExperience(index, "end_date", val)}
                            disabled={exp.is_current}
                            placeholder="Select end date"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-xs font-medium text-text-secondary">Experience Description</label>
                        <TipTapEditor
                          content={exp.description}
                          onChange={(html) => updateExperience(index, "description", html)}
                          stickyToolbar={true}
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <MediaLibraryModal
        isOpen={mediaModalState.isOpen}
        onClose={() => setMediaModalState({ isOpen: false, index: null })}
        onSelect={(url) => {
          if (mediaModalState.index !== null) {
            updateExperience(mediaModalState.index, "logo_url", url);
          }
        }}
      />
    </main>
  );
}
