import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, FileText, Heart, Plus } from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();

  const quickActions = [
    {
      title: 'Add Medical Record',
      icon: <Plus className="w-6 h-6" />,
      description: 'Upload a new medical record or document',
      link: '/add-record',
      color: 'bg-blue-500'
    },
    {
      title: 'View Records',
      icon: <FileText className="w-6 h-6" />,
      description: 'Access your medical history and documents',
      link: '/records',
      color: 'bg-green-500'
    },
    {
      title: 'Emergency Info',
      icon: <Heart className="w-6 h-6" />,
      description: 'View and update emergency information',
      link: '/profile',
      color: 'bg-red-500'
    },
    {
      title: 'Health Stats',
      icon: <Activity className="w-6 h-6" />,
      description: 'Track your health metrics and progress',
      link: '/stats',
      color: 'bg-purple-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={() => navigate(action.link)}
              className="p-6 rounded-lg bg-white shadow-md hover:shadow-lg transition-shadow duration-200 flex flex-col items-center text-center"
            >
              <div className={`${action.color} p-3 rounded-full text-white mb-4`}>
                {action.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{action.title}</h3>
              <p className="text-sm text-gray-600">{action.description}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}