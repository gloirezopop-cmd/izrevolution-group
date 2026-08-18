import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User } from 'lucide-react';

const contacts = [
  { name: 'Support Technique', number: '237670865004', role: 'Ingénieur & Fondateur' },
  { name: 'Support Technique', number: '237658444377', role: 'Ingénieur & Fondateur' },
  { name: 'Support Technique', number: '237674207515', role: 'Ingénieur & Fondateur' },
];

export const WhatsAppFloat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const message = "Bonjour, je vous contacte depuis votre site web. J'aimerais avoir plus d'informations sur vos services.";

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="mb-4 bg-card rounded-2xl shadow-2xl border border-border overflow-hidden w-72"
          >
            <div className="bg-[#25D366] p-4 text-white">
              <h3 className="font-bold text-lg">Contactez-nous</h3>
              <p className="text-sm opacity-90">Choisissez un membre de l'équipe</p>
            </div>
            <div className="p-2 space-y-1 bg-background">
              {contacts.map((contact, idx) => (
                <a
                  key={idx}
                  href={`https://wa.me/${contact.number}?text=${encodeURIComponent(message)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-card hover:shadow-sm transition-all group border border-transparent hover:border-border"
                  onClick={() => setIsOpen(false)}
                >
                  <div className="w-10 h-10 bg-[#25D366]/10 rounded-full flex items-center justify-center text-[#25D366] group-hover:bg-[#25D366] group-hover:text-white transition-colors">
                    <User size={20} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-primary-text text-sm">{contact.name}</h4>
                    <p className="text-xs text-text-muted">{contact.role}</p>
                  </div>
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-5 py-3 bg-[#25D366] text-white rounded-full shadow-lg hover:bg-[#1ebd5a] hover:scale-105 hover:shadow-xl transition-all duration-300 group"
        aria-label="Écrivez-nous sur WhatsApp"
      >
        {isOpen ? (
          <X size={24} />
        ) : (
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="currentColor" 
            stroke="none"
          >
            <path d="M12.01 2.002c-5.522 0-9.998 4.477-9.998 10 0 1.99.585 3.844 1.577 5.405L2 22l4.733-1.554c1.512.894 3.284 1.405 5.277 1.405 5.523 0 10-4.477 10-10s-4.477-10-10-10zm0 18.232c-1.68 0-3.262-.432-4.636-1.196l-.33-.18-3.036 1.01 1.026-3.003-.207-.34C4.162 15.076 3.636 13.58 3.636 12c0-4.61 3.75-8.36 8.374-8.36 4.623 0 8.373 3.75 8.373 8.36s-3.75 8.36-8.373 8.36zm4.593-6.264c-.252-.127-1.493-.738-1.725-.823-.23-.084-.4-.127-.568.127-.168.254-.65 1.036-.78 1.25-.13.21-.264.24-.515.114-.252-.128-1.066-.394-2.03-1.257-.75-.67-1.258-1.497-1.406-1.75-.15-.254-.016-.39.11-.518.114-.114.25-.29.377-.436.126-.145.168-.25.253-.418.083-.168.042-.317-.02-.444-.065-.127-.568-1.373-.78-1.88-.204-.492-.41-.424-.567-.432-.144-.008-.31-.01-.476-.01-.168 0-.442.064-.674.318-.23.254-.882.863-.882 2.1 0 1.238.903 2.436 1.03 2.604.126.17 1.775 2.71 4.3 3.8.6.26 1.07.41 1.436.527.604.192 1.155.165 1.587.1.482-.073 1.493-.61 1.704-1.202.21-.59.21-1.097.147-1.203-.064-.105-.23-.17-.482-.295z"/>
          </svg>
        )}
        <span className="font-semibold text-sm">
          {isOpen ? 'Fermer le menu' : 'Écrivez-nous sur WhatsApp'}
        </span>
      </button>
    </div>
  );
};
