const LiveTicker = () => {
  const items = [
    { label: "LIVE:", value: "127 MRI Systems Available Now", highlight: true },
    { label: "Newest:", value: "Siemens Skyra 3T", extra: "(Added 2 hrs ago)" },
    { label: "Lowest Price:", value: "$125K", extra: "(GE Signa 1.5T)", isPrice: true },
    { label: "Most Popular:", value: "Philips Ingenia", extra: "(12 views today)" },
  ];

  return (
    <div className="bg-primary/5 border-y border-border py-3 overflow-hidden">
      <div className="container mx-auto">
        <div className="flex items-center justify-center gap-8 flex-wrap">
          {items.map((item, index) => (
            <div key={index} className="flex items-center gap-2 text-sm">
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
              {index < items.length - 1 && (
                <span className="text-border ml-6">|</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LiveTicker;
