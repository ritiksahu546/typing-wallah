import React, { useState } from 'react';
import { TouchTypingCourseLesson } from '../../types/touchTypingCourse';
import { LearningProgressService } from '../../services/learningProgressService';
import {
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  BookOpen,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface AdminLessonManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  lessons: TouchTypingCourseLesson[];
  onLessonsUpdated: (updatedLessons: TouchTypingCourseLesson[]) => void;
}

export const AdminLessonManagerModal: React.FC<AdminLessonManagerModalProps> = ({
  isOpen,
  onClose,
  lessons,
  onLessonsUpdated
}) => {
  const [editingLesson, setEditingLesson] = useState<TouchTypingCourseLesson | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleStartCreate = () => {
    const nextLessonNumber = lessons.length > 0 ? Math.max(...lessons.map((l) => l.lessonNumber)) + 1 : 1;
    const newLesson: TouchTypingCourseLesson = {
      id: `lesson_custom_${Date.now()}`,
      lessonNumber: nextLessonNumber,
      level: 1,
      name: `Custom Lesson ${nextLessonNumber}`,
      description: 'Admin created touch typing drill',
      focusKeys: ['f', 'j'],
      introductionText: 'f j f j',
      practiceText: 'ff jj ff jj fj jf',
      testText: 'fj jf ff jj fj jf ff jj',
      targetWpm: 25,
      minAccuracy: 90,
      mode: 'practice',
      tier: 'free',
      isCustom: true
    };
    setEditingLesson(newLesson);
    setIsCreating(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLesson) return;

    await LearningProgressService.saveAdminLesson(editingLesson);

    const updated = [...lessons];
    const existingIdx = updated.findIndex((l) => l.id === editingLesson.id);
    if (existingIdx >= 0) {
      updated[existingIdx] = editingLesson;
    } else {
      updated.push(editingLesson);
    }
    updated.sort((a, b) => a.lessonNumber - b.lessonNumber);

    onLessonsUpdated(updated);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      setEditingLesson(null);
      setIsCreating(false);
    }, 800);
  };

  const handleDelete = (lessonId: string) => {
    if (confirmDeleteId !== lessonId) {
      setConfirmDeleteId(lessonId);
      return;
    }
    const updated = lessons.filter((l) => l.id !== lessonId);
    onLessonsUpdated(updated);
    setConfirmDeleteId(null);
  };

  const filtered = searchQuery
    ? lessons.filter(
        (l) =>
          l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          l.lessonNumber.toString() === searchQuery.trim()
      )
    : lessons;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-600 text-white flex items-center justify-center shadow-md">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white">
                Touch Typing Lesson CMS (Admin)
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Create, Edit, Reorder, and Configure Benchmark Requirements
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action / Search Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search lessons by title or number..."
            className="px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:ring-2 focus:ring-purple-500 focus:outline-hidden w-64"
          />

          <button
            type="button"
            onClick={handleStartCreate}
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center space-x-1.5 shadow-md shadow-purple-600/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Lesson</span>
          </button>
        </div>

        {/* Edit / Create Form */}
        {editingLesson && (
          <form
            onSubmit={handleSave}
            className="p-5 rounded-2xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800/50 space-y-4 animate-in fade-in"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-black text-sm text-purple-900 dark:text-purple-300">
                {isCreating ? 'Create New Lesson' : `Edit Lesson #${editingLesson.lessonNumber}`}
              </h3>
              <button
                type="button"
                onClick={() => {
                  setEditingLesson(null);
                  setIsCreating(false);
                }}
                className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
              >
                Cancel
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                  Lesson #
                </label>
                <input
                  type="number"
                  value={editingLesson.lessonNumber}
                  onChange={(e) =>
                    setEditingLesson({ ...editingLesson, lessonNumber: parseInt(e.target.value) || 1 })
                  }
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-mono"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                  Level (1-11)
                </label>
                <input
                  type="number"
                  min="1"
                  max="11"
                  value={editingLesson.level}
                  onChange={(e) =>
                    setEditingLesson({ ...editingLesson, level: parseInt(e.target.value) || 1 })
                  }
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-mono"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                  Access Tier
                </label>
                <select
                  value={editingLesson.tier}
                  onChange={(e) =>
                    setEditingLesson({
                      ...editingLesson,
                      tier: e.target.value as 'free' | 'pro'
                    })
                  }
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
                >
                  <option value="free">Free Tier</option>
                  <option value="pro">PRO Tier</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                Lesson Name
              </label>
              <input
                type="text"
                value={editingLesson.name}
                onChange={(e) => setEditingLesson({ ...editingLesson, name: e.target.value })}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                  Target WPM (Passing Benchmark)
                </label>
                <input
                  type="number"
                  value={editingLesson.targetWpm}
                  onChange={(e) =>
                    setEditingLesson({ ...editingLesson, targetWpm: parseInt(e.target.value) || 20 })
                  }
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-mono"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                  Min Accuracy (%)
                </label>
                <input
                  type="number"
                  min="50"
                  max="100"
                  value={editingLesson.minAccuracy}
                  onChange={(e) =>
                    setEditingLesson({
                      ...editingLesson,
                      minAccuracy: parseInt(e.target.value) || 90
                    })
                  }
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-mono"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                Introduction Sequence (space-separated or string)
              </label>
              <input
                type="text"
                value={editingLesson.introductionText}
                onChange={(e) =>
                  setEditingLesson({ ...editingLesson, introductionText: e.target.value })
                }
                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-mono"
                required
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                Practice Text
              </label>
              <textarea
                value={editingLesson.practiceText}
                onChange={(e) =>
                  setEditingLesson({ ...editingLesson, practiceText: e.target.value })
                }
                rows={2}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-mono"
                required
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                Benchmark Test Text (To unlock next lesson)
              </label>
              <textarea
                value={editingLesson.testText}
                onChange={(e) =>
                  setEditingLesson({ ...editingLesson, testText: e.target.value })
                }
                rows={2}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-mono"
                required
              />
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2">
              {saveSuccess && (
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold flex items-center space-x-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Lesson Saved!</span>
                </span>
              )}

              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center space-x-1.5 shadow-md"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Lesson</span>
              </button>
            </div>
          </form>
        )}

        {/* Existing Lessons List Table */}
        <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 font-bold text-slate-600 dark:text-slate-300">
              <tr>
                <th className="p-3">#</th>
                <th className="p-3">Level</th>
                <th className="p-3">Lesson Name</th>
                <th className="p-3">Passing Target</th>
                <th className="p-3">Tier</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map((l) => (
                <tr key={l.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="p-3 font-mono font-bold text-slate-900 dark:text-white">
                    {l.lessonNumber}
                  </td>
                  <td className="p-3 font-semibold text-slate-500">
                    Lvl {l.level}
                  </td>
                  <td className="p-3 font-bold text-slate-800 dark:text-slate-200">
                    {l.name}
                  </td>
                  <td className="p-3 font-mono text-slate-600 dark:text-slate-400">
                    {l.targetWpm} WPM / {l.minAccuracy}% Acc
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                        l.tier === 'pro'
                          ? 'bg-amber-500/10 text-amber-500'
                          : 'bg-emerald-500/10 text-emerald-500'
                      }`}
                    >
                      {l.tier}
                    </span>
                  </td>
                  <td className="p-3 text-right space-x-1">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingLesson(l);
                        setIsCreating(false);
                      }}
                      className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/50"
                      title="Edit Lesson"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    {l.isCustom && (
                      <button
                        type="button"
                        onClick={() => handleDelete(l.id)}
                        className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50"
                        title="Delete Lesson"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
