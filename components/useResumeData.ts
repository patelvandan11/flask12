'use client';

import { useState, useEffect, useCallback } from 'react';
import { ResumeData, WorkExperience, StackSection, TechnicalSkills } from '@/types/portfolio';
import defaultResumeData from '@/data/resume.json';

export function useResumeData(initialData?: ResumeData) {
  const [resume, setResume] = useState<ResumeData>(initialData || (defaultResumeData as unknown as ResumeData));
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const fetchResume = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/resume');
      if (res.ok) {
        const data = await res.json();
        if (data && typeof data === 'object' && data.name) {
          setResume(data);
        }
      }
    } catch (err) {
      console.warn('Failed to fetch resume live from MongoDB:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchResume();
  }, [fetchResume]);

  const saveResume = async (updatedData: ResumeData): Promise<boolean> => {
    setIsSaving(true);
    setResume(updatedData);

    try {
      const res = await fetch('/api/resume/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: updatedData }),
      });
      const resData = await res.json();
      if (res.ok && resData.success) {
        return true;
      } else {
        alert(resData.error || 'Failed to save resume data to MongoDB.');
        return false;
      }
    } catch (err) {
      alert('Network error while saving resume to MongoDB.');
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const addTechStackItem = async (category: keyof StackSection, item: string): Promise<boolean> => {
    const trimmed = item.trim();
    if (!trimmed) return false;
    const currentStack: StackSection = resume.stack_section || {
      ai_ml: [],
      data: [],
      backend: [],
      infra: [],
    };
    const currentList = currentStack[category] || [];
    if (currentList.includes(trimmed)) {
      alert(`"${trimmed}" is already in the ${category.toUpperCase()} stack.`);
      return false;
    }
    const updatedStack: StackSection = {
      ...currentStack,
      [category]: [...currentList, trimmed],
    };
    const updated: ResumeData = {
      ...resume,
      stack_section: updatedStack,
    };
    return saveResume(updated);
  };

  const removeTechStackItem = async (category: keyof StackSection, index: number): Promise<boolean> => {
    const currentStack = resume.stack_section || { ai_ml: [], data: [], backend: [], infra: [] };
    const currentList = [...(currentStack[category] || [])];
    currentList.splice(index, 1);
    const updatedStack: StackSection = {
      ...currentStack,
      [category]: currentList,
    };
    const updated: ResumeData = {
      ...resume,
      stack_section: updatedStack,
    };
    return saveResume(updated);
  };

  const addWorkExperience = async (exp: WorkExperience): Promise<boolean> => {
    const currentExp = resume.work_experience || [];
    const updated: ResumeData = {
      ...resume,
      work_experience: [exp, ...currentExp],
    };
    return saveResume(updated);
  };

  const updateWorkExperience = async (index: number, exp: WorkExperience): Promise<boolean> => {
    const currentExp = [...(resume.work_experience || [])];
    currentExp[index] = exp;
    const updated: ResumeData = {
      ...resume,
      work_experience: currentExp,
    };
    return saveResume(updated);
  };

  const deleteWorkExperience = async (index: number): Promise<boolean> => {
    const currentExp = [...(resume.work_experience || [])];
    currentExp.splice(index, 1);
    const updated: ResumeData = {
      ...resume,
      work_experience: currentExp,
    };
    return saveResume(updated);
  };

  const addTechnicalSkill = async (category: keyof TechnicalSkills, skill: string): Promise<boolean> => {
    const trimmed = skill.trim();
    if (!trimmed) return false;
    const currentSkills = resume.technical_skills || {
      programming_languages: [],
      frameworks: [],
      ai_ml_libraries: [],
    };
    const currentList = currentSkills[category] || [];
    if (currentList.includes(trimmed)) {
      alert(`"${trimmed}" is already in ${category}.`);
      return false;
    }
    const updatedSkills: TechnicalSkills = {
      ...currentSkills,
      [category]: [...currentList, trimmed],
    };
    const updated: ResumeData = {
      ...resume,
      technical_skills: updatedSkills,
    };
    return saveResume(updated);
  };

  const removeTechnicalSkill = async (category: keyof TechnicalSkills, index: number): Promise<boolean> => {
    const currentSkills = resume.technical_skills || {
      programming_languages: [],
      frameworks: [],
      ai_ml_libraries: [],
    };
    const currentList = [...(currentSkills[category] || [])];
    currentList.splice(index, 1);
    const updatedSkills: TechnicalSkills = {
      ...currentSkills,
      [category]: currentList,
    };
    const updated: ResumeData = {
      ...resume,
      technical_skills: updatedSkills,
    };
    return saveResume(updated);
  };

  const addHeroBadge = async (badge: string): Promise<boolean> => {
    const trimmed = badge.trim();
    if (!trimmed) return false;
    const currentBadges = resume.hero_badges || [];
    if (currentBadges.includes(trimmed)) return false;
    const updated: ResumeData = {
      ...resume,
      hero_badges: [...currentBadges, trimmed],
    };
    return saveResume(updated);
  };

  const removeHeroBadge = async (index: number): Promise<boolean> => {
    const currentBadges = [...(resume.hero_badges || [])];
    currentBadges.splice(index, 1);
    const updated: ResumeData = {
      ...resume,
      hero_badges: currentBadges,
    };
    return saveResume(updated);
  };

  const addSoftSkill = async (skill: string): Promise<boolean> => {
    const trimmed = skill.trim();
    if (!trimmed) return false;
    const currentList = resume.soft_skills || [];
    if (currentList.includes(trimmed)) return false;
    const updated: ResumeData = {
      ...resume,
      soft_skills: [...currentList, trimmed],
    };
    return saveResume(updated);
  };

  const removeSoftSkill = async (index: number): Promise<boolean> => {
    const currentList = [...(resume.soft_skills || [])];
    currentList.splice(index, 1);
    const updated: ResumeData = {
      ...resume,
      soft_skills: currentList,
    };
    return saveResume(updated);
  };

  const addHobby = async (hobby: string): Promise<boolean> => {
    const trimmed = hobby.trim();
    if (!trimmed) return false;
    const currentList = resume.hobbies || [];
    if (currentList.includes(trimmed)) return false;
    const updated: ResumeData = {
      ...resume,
      hobbies: [...currentList, trimmed],
    };
    return saveResume(updated);
  };

  const removeHobby = async (index: number): Promise<boolean> => {
    const currentList = [...(resume.hobbies || [])];
    currentList.splice(index, 1);
    const updated: ResumeData = {
      ...resume,
      hobbies: currentList,
    };
    return saveResume(updated);
  };

  const updateProfile = async (fields: Partial<ResumeData>): Promise<boolean> => {
    const updated: ResumeData = {
      ...resume,
      ...fields,
    };
    return saveResume(updated);
  };

  return {
    resume,
    setResume,
    isLoading,
    isSaving,
    saveResume,
    fetchResume,
    addTechStackItem,
    removeTechStackItem,
    addWorkExperience,
    updateWorkExperience,
    deleteWorkExperience,
    addTechnicalSkill,
    removeTechnicalSkill,
    addHeroBadge,
    removeHeroBadge,
    addSoftSkill,
    removeSoftSkill,
    addHobby,
    removeHobby,
    updateProfile,
  };
}
