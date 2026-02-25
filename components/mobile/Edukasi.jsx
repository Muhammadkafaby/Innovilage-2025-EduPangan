'use client';

import React, { useState } from 'react';
import Icon from '../shared/Icon';
import Badge from '../shared/Badge';
import { educationArticles, videoTutorials } from '../../data/staticData';

const Edukasi = ({ onNavigateBack }) => {
  const [activeTab, setActiveTab] = useState('artikel');
  const [selectedArticle, setSelectedArticle] = useState(null);

  if (selectedArticle) {
    return (
      <div className="min-h-screen bg-[#E0E5EC] pb-8">
        <div className="px-6 pt-8 pb-4">
          <button
            onClick={() => setSelectedArticle(null)}
            className="neo-button w-10 h-10 flex items-center justify-center mb-4"
          >
            <Icon name="arrowLeft" size={20} color="#6B7280" />
          </button>
          <h1 className="text-xl font-bold text-gray-800">{selectedArticle.title}</h1>
        </div>

        <div className="px-6">
          <div className="neo-card p-6">
            <div className="flex items-center gap-4 text-sm text-gray-500 mb-4 flex-wrap">
              <span className="flex items-center gap-1">
                <Icon name="calendar" size={14} />
                {new Date(selectedArticle.publishDate).toLocaleDateString('id-ID')}
              </span>
              <span className="flex items-center gap-1">
                <Icon name="user" size={14} />
                {selectedArticle.author}
              </span>
              <span className="flex items-center gap-1">
                <Icon name="clock" size={14} />
                {selectedArticle.readTime}
              </span>
            </div>

            <div className="prose prose-sm max-w-none">
              <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                {selectedArticle.content}
              </p>
            </div>

            <div className="flex flex-wrap gap-2 mt-6 pt-4 border-t border-gray-200">
              {selectedArticle.tags?.map((tag, idx) => (
                <Badge key={idx} variant="info">#{tag}</Badge>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'artikel', label: 'Artikel', icon: 'document' },
    { id: 'video', label: 'Video', icon: 'play' },
    { id: 'kuis', label: 'Kuis', icon: 'education' },
  ];

  return (
    <div className="min-h-screen bg-[#E0E5EC] pb-8">
      <div className="px-6 pt-8 pb-4">
        <button
          onClick={onNavigateBack}
          className="neo-button w-10 h-10 flex items-center justify-center mb-4"
        >
          <Icon name="arrowLeft" size={20} color="#6B7280" />
        </button>
        <h1 className="text-2xl font-bold text-gray-800 mb-1">Edukasi</h1>
        <p className="text-sm text-gray-500">Pelajari cara berkebun yang lebih baik</p>
      </div>

      <div className="px-6 py-4">
        <div className="neo-inset p-1 flex gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex-1 flex items-center justify-center gap-2 py-3 rounded-xl
                font-semibold text-sm transition-all
                ${activeTab === tab.id
                  ? 'neo-button text-green-500'
                  : 'text-gray-500'
                }
              `}
            >
              <Icon
                name={tab.icon}
                size={18}
                color={activeTab === tab.id ? '#4CAF50' : '#9CA3AF'}
              />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-6">
        {activeTab === 'artikel' && (
          <div className="space-y-4">
            {educationArticles.map((article) => (
              <button
                key={article.id}
                onClick={() => setSelectedArticle(article)}
                className="w-full neo-card p-4 text-left active:neo-button-active transition-all"
              >
                <div className="flex gap-4">
                  <div className="w-20 h-20 neo-inset rounded-xl flex items-center justify-center flex-shrink-0">
                    <Icon name="book" size={32} color="#3B82F6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-800 mb-1 truncate">{article.title}</h3>
                    <p className="text-xs text-gray-500 mb-2 line-clamp-2">{article.excerpt}</p>
                    <div className="flex items-center gap-3 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <Icon name="clock" size={12} /> {article.readTime}
                      </span>
                      <span className="flex items-center gap-1">
                        <Icon name="eye" size={12} /> {article.views}
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        {activeTab === 'video' && (
          <div className="space-y-4">
            {videoTutorials.map((video) => (
              <div key={video.id} className="neo-card overflow-hidden">
                <div className="w-full h-48 neo-inset flex items-center justify-center">
                  <div className="w-16 h-16 neo-button rounded-full flex items-center justify-center">
                    <Icon name="play" size={28} color="#EF4444" />
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-gray-800 mb-2">{video.title}</h3>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Icon name="clock" size={12} /> {video.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <Icon name="eye" size={12} /> {video.views} views
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'kuis' && (
          <div className="neo-card p-8 text-center">
            <div className="w-24 h-24 neo-inset rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Icon name="education" size={48} color="#8B5CF6" />
            </div>
            <h3 className="font-bold text-xl text-gray-800 mb-2">Kuis Interaktif</h3>
            <p className="text-sm text-gray-500 mb-6">
              Uji pengetahuan Anda tentang berkebun!
            </p>
            <button
              onClick={() => alert('Fitur kuis akan segera hadir!')}
              className="neo-button px-8 py-4 font-semibold text-purple-500 inline-flex items-center gap-2"
            >
              <Icon name="sparkles" size={20} color="#8B5CF6" />
              Mulai Kuis
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Edukasi;
