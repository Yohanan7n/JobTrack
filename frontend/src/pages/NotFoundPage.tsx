import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { Home } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center font-bold text-2xl mb-4 font-outfit">
        404
      </div>
      <h1 className="text-2xl font-bold text-slate-100 mb-2">Page Not Found</h1>
      <p className="text-sm text-slate-400 max-w-sm mb-6">
        The page you are looking for does not exist or has been relocated.
      </p>
      <Link to="/dashboard">
        <Button variant="primary" size="md" leftIcon={<Home className="w-4 h-4" />}>
          Back to Dashboard
        </Button>
      </Link>
    </div>
  );
};
