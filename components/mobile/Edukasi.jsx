import React, { useState } from 'react';
import { educationArticles, videoTutorials } from '../../data/dummyData';

/**
 * Edukasi Component
 * Platform edukasi dengan artikel, video, dan kuis
 */
const Edukasi = ({ onNavigateBack }) => {
  const [activeTab, setActiveTab] = useState('artikel');
  const [selectedArticle, setSelectedArticle] = useState(null);

  // Article Detail View
  if (selectedArticle) {
    return (
      <div className="min-h-screen bg-gray-50 pb-8">
        <div className="bg-blue-500 pt-8 pb-6 px-6">
          <button
            onClick={() => setSelectedArticle(null)}
            className="text-white mb-4 flex items-center text-sm font-medium"
          >
            <span className="mr-2">←</span> Kembali
          </button>
          <h1 className="text-xl font-bold text-white">{selectedArticle.title}</h1>
        </div>

        <div className="px-6 -mt-2">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
              <span>📅 {new Date(selectedArticle.publishDate).toLocaleDateString('id-ID')}</span>
              <span>👤 {selectedArticle.author}</span>
              <span>⏱️ {selectedArticle.readTime}</span>
            </div>

            <div className="prose prose-sm max-w-none">
              <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                {selectedArticle.content}
              </p>
            </div>

            <div className="flex flex-wrap gap-2 mt-6">
              {selectedArticle.tags.map((tag) => (
                <span key={tag} className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-medium">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      <div className="bg-blue-500 pt-8 pb-6 px-6">
        <button onClick={onNavigateBack} className="text-white mb-4 flex items-center text-sm font-medium">
          <span className="mr-2">←</span> Kembali
        </button>
        <h1 className="text-2xl font-bold text-white mb-2">Edukasi</h1>
        <p className="text-blue-100 text-sm">Pelajari cara berkebun yang lebih baik</p>
      </div>

      {/* Tabs */}
      <div className="px-6 py-4">
        <div className="bg-white rounded-xl shadow-md p-1 grid grid-cols-3 gap-1">
          {['artikel', 'video', 'kuis'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-2.5 rounded-lg text-sm font-semibold transition-all ${
                activeTab === tab ? 'bg-blue-500 text-white' : 'text-gray-600'
              }`}
            >
              {tab === 'artikel' ? '📰 Artikel' : tab === 'video' ? '🎥 Video' : '🎯 Kuis'}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="px-6">
        {activeTab === 'artikel' && (
          <div className="space-y-4">
            {educationArticles.map((article) => (
              <button
                key={article.id}
                onClick={() => setSelectedArticle(article)}
                className="w-full bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition-shadow text-left"
              >
                <div className="flex items-start space-x-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-3xl">📚</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800 mb-1">{article.title}</h3>
                    <p className="text-xs text-gray-600 mb-2 line-clamp-2">{article.excerpt}</p>
                    <div className="flex items-center space-x-3 text-xs text-gray-500">
                      <span>⏱️ {article.readTime}</span>
                      <span>👁️ {article.views}</span>
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
              <div key={video.id} className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="w-full h-48 bg-gradient-to-br from-red-100 to-red-200 flex items-center justify-center">
                  <span className="text-6xl">▶️</span>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-gray-800 mb-2">{video.title}</h3>
                  <div className="flex items-center justify-between text-xs text-gray-600">
                    <span>⏱️ {video.duration}</span>
                    <span>👁️ {video.views} views</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'kuis' && (
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <span className="text-6xl mb-4 block">🎯</span>
            <h3 className="font-bold text-gray-800 mb-2">Kuis Interaktif</h3>
            <p className="text-sm text-gray-600 mb-4">Uji pengetahuan Anda tentang berkebun!</p>
            <button className="bg-blue-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-600">
              Mulai Kuis
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Edukasi;
