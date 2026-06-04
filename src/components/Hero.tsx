interface HeroProps {
  image: string;
  tag: string;
  title: string;
  subtitle: string;
  dagBereik: string;
  unsplashQuery?: string;
}

export default function Hero({ image, tag, title, subtitle, dagBereik, unsplashQuery }: HeroProps) {
  const displayImage = image;

  return (
    <div className="relative w-full h-[520px] overflow-hidden bg-gray-200">
      {displayImage ? (
        <img
          src={displayImage}
          alt={title}
          className="w-full h-full object-cover"
          style={{ objectPosition: 'center 40%' }}
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-200" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent" />
      <div className="absolute inset-0 flex flex-col justify-end px-6 pb-12 max-w-5xl mx-auto w-full left-0 right-0">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-xs font-medium text-white/80 bg-white/15 backdrop-blur-sm border border-white/25 rounded-full px-4 py-1.5 uppercase tracking-widest">
            {tag}
          </span>
          <span className="text-xs font-medium text-white/70 bg-groen/60 backdrop-blur-sm border border-groen/40 rounded-full px-4 py-1.5">
            {dagBereik}
          </span>
        </div>
        <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight mb-3">
          {title}
        </h1>
        <p className="text-lg text-white/80 font-light max-w-xl leading-relaxed">
          {subtitle}
        </p>
      </div>
    </div>
  );
}
