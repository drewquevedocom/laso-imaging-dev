import { Link } from 'react-router-dom';

const LiveTicker = () => {
  const items = [
    { label: "LIVE:", value: "127 Imaging Systems Available Now", highlight: true, href: "/products" },
    { label: "Newest:", value: "Siemens Skyra 3T", extra: "(Added 2 hrs ago)", href: "/products?search=siemens+skyra" },
    { label: "Lowest Price:", value: "$125K", extra: "(GE Signa 1.5T)", isPrice: true, href: "/products?search=ge+signa+1.5t" },
    { label: "Most Popular:", value: "Philips Ingenia", extra: "(12 views today)", href: "/products?search=philips+ingenia" },
  ];

  const TickerContent = () => (
    <div className="flex items-center gap-8 px-4">
      {items.map((item, index) => (
        <Link 
          key={index} 
          to={item.href}
          className="flex items-center gap-2 text-sm whitespace-nowrap hover:text-accent transition-colors"
        >
          {item.highlight && (
            <span className="w-2 h-2 bg-success rounded-full animate-pulse-dot" />
          )}
          <span className="text-muted-foreground">{item.label}</span>
          <span className={`font-semibold ${item.isPrice ? 'text-success' : 'text-foreground'}`}>
            {item.value}
          </span>
          {item.extra && (
            <span className="text-muted-foreground">{item.extra}</span>
          )}
          <span className="text-border ml-6">|</span>
        </Link>
      ))}
    </div>
  );

  return (
    <div className="bg-primary/5 border-y border-border py-3 overflow-hidden">
      <div 
        className="flex animate-ticker hover:[animation-play-state:paused]"
        style={{ width: 'max-content' }}
      >
        <TickerContent />
        <TickerContent />
      </div>
    </div>
  );
};

export default LiveTicker;
