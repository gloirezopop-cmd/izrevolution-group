import React from 'react';

export const WhatsAppFloat = () => {
  const phoneNumber = "237670865004";
  const message = "Bonjour, je vous contacte depuis votre site web. J'aimerais avoir plus d'informations sur vos services.";
  
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 bg-[#25D366] text-white rounded-full shadow-lg hover:bg-[#1ebd5a] hover:scale-105 hover:shadow-xl transition-all duration-300 group"
      aria-label="Écrivez-nous sur WhatsApp"
    >
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
      <span className="font-semibold text-sm">Écrivez-nous sur WhatsApp</span>
    </a>
  );
};
