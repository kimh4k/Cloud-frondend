import { useEffect } from 'react';
import { Check } from 'lucide-react';

interface NotificationProps {
  show: boolean;
  message: string;
}

const Notification = ({ show, message }: NotificationProps) => {
  if (!show) return null;
  
  return (
    <div className="fixed bottom-4 right-4 bg-primary text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div className="flex items-center space-x-3">
        <Check className="h-6 w-6 flex-shrink-0" />
        <p>{message}</p>
      </div>
    </div>
  );
};

export default Notification;
