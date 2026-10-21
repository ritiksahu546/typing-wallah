import React from 'react';
import { ActivePage, BlogPost } from '../types';
import { ArrowLeft, Clock, Calendar, User, Tag, Share2, CheckCircle2 } from 'lucide-react';

interface BlogPostPageProps {
  post: BlogPost;
  onBack: () => void;
  onNavigate: (page: ActivePage) => void;
}

export const BlogPostPage: React.FC<BlogPostPageProps> = ({
  post,
  onBack,
  onNavigate
}) => {
  return (
    <div id="blog-post-root" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Back button */}
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-500 hover:text-blue-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to All Articles</span>
      </button>

      {/* Article Header */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="px-3 py-1 rounded-full font-bold bg-blue-50 text-blue-700">
            {post.category}
          </span>
          <span className="text-slate-400">•</span>
          <span className="text-slate-500 flex items-center space-x-1">
            <Clock className="w-3.5 h-3.5" />
            <span>{post.readTime}</span>
          </span>
          <span className="text-slate-400">•</span>
          <span className="text-slate-500">{post.date}</span>
        </div>

        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 leading-tight">
          {post.title}
        </h1>

        <div className="flex items-center space-x-3 pt-2 text-xs text-slate-500 border-t border-slate-100">
          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-700">
            TW
          </div>
          <div>
            <div className="font-semibold text-slate-800">{post.author}</div>
            <div className="text-[11px] text-slate-400">Independent Typing Research</div>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs prose prose-slate max-w-none leading-relaxed text-sm sm:text-base text-slate-700 space-y-4">
        {post.content.split('\n\n').map((paragraph, idx) => {
          if (paragraph.startsWith('###')) {
            return (
              <h3 key={idx} className="text-xl font-bold text-slate-900 pt-4 pb-1">
                {paragraph.replace('###', '').trim()}
              </h3>
            );
          }
          if (paragraph.startsWith('-')) {
            return (
              <ul key={idx} className="list-disc pl-5 space-y-1">
                {paragraph.split('\n').map((li, lIdx) => (
                  <li key={lIdx}>{li.replace('-', '').trim()}</li>
                ))}
              </ul>
            );
          }
          return <p key={idx}>{paragraph}</p>;
        })}

        {/* Tags */}
        <div className="pt-6 border-t border-slate-100 flex flex-wrap items-center gap-2">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 text-xs font-semibold flex items-center space-x-1"
            >
              <Tag className="w-3 h-3 text-slate-400" />
              <span>{tag}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Practice CTA */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="font-bold text-slate-900 text-base">Ready to test what you learned?</h4>
          <p className="text-xs text-slate-600">Practice with realistic government exam timing and mistake formulas.</p>
        </div>
        <button
          type="button"
          onClick={() => onNavigate('typing-test')}
          className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 whitespace-nowrap"
        >
          Start Typing Test Now
        </button>
      </div>
    </div>
  );
};
