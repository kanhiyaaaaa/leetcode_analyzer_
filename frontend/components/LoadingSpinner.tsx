// components/LoadingSpinner.tsx

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'blue' | 'green' | 'purple' | 'white';
  text?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  color = 'blue',
  text
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  const colorClasses = {
    blue: 'border-blue-600',
    green: 'border-green-600',
    purple: 'border-purple-600',
    white: 'border-white'
  };

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className={`animate-spin rounded-full ${sizeClasses[size]} border-b-2 ${colorClasses[color]}`}></div>
      {text && (
        <p className="mt-4 text-gray-600 text-center">{text}</p>
      )}
    </div>
  );
};

// components/AnalysisLoading.tsx
import React from 'react';
import { Code, Brain, Target, TrendingUp } from 'lucide-react';

export const AnalysisLoading: React.FC = () => {
  const steps = [
    { icon: Code, text: "Scraping LeetCode profile...", delay: 0 },
    { icon: Brain, text: "Analyzing problem-solving patterns...", delay: 1000 },
    { icon: Target, text: "Identifying strengths and weaknesses...", delay: 2000 },
    { icon: TrendingUp, text: "Generating personalized recommendations...", delay: 3000 }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <div className="text-center mb-8">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <h3 className="text-xl font-semibold text-gray-900">Analyzing Your Profile</h3>
        <p className="text-gray-600">This may take a few moments...</p>
      </div>

      <div className="space-y-4">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50">
            <step.icon className="h-5 w-5 text-blue-600" />
            <span className="text-gray-700">{step.text}</span>
            <div className="flex-1"></div>
            <div className="animate-pulse h-2 w-2 bg-blue-600 rounded-full"></div>
          </div>
        ))}
      </div>

      <div className="mt-6 text-center text-sm text-gray-500">
        💡 Tip: Make sure your LeetCode profile is public for best results
      </div>
    </div>
  );
};