import { useState, useEffect } from 'react';

export default function Banner() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      title: 'Kho sách hay tuyển chọn',
      subtitle: 'Mua sách, truyện hay online hàng ngàn cuốn, giảm giá tới 50%',
      image: 'https://via.placeholder.com/1200x400?text=Banner+1',
      bgColor: 'bg-gradient-to-r from-pink-500 to-rose-400',
    },
    {
      id: 2,
      title: 'Sách bestseller mới nhất',
      subtitle: 'Những cuốn sách được yêu thích nhất 2024',
      image: 'https://via.placeholder.com/1200x400?text=Banner+2',
      bgColor: 'bg-gradient-to-r from-blue-500 to-indigo-500',
    },
    {
      id: 3,
      title: 'Ưu đãi khuyến mãi hàng ngày',
      subtitle: 'Giảm giá sốc hàng ngày cho các sách lựa chọn',
      image: 'https://via.placeholder.com/1200x400?text=Banner+3',
      bgColor: 'bg-gradient-to-r from-orange-500 to-red-500',
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="relative w-full max-w-6xl mx-auto h-96 rounded-lg overflow-hidden shadow-lg">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute w-full h-full transition-opacity duration-500 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className={`w-full h-full ${slide.bgColor} flex items-center justify-center`}>
            <div className="text-center text-white px-8">
              <h2 className="text-5xl font-bold mb-4">{slide.title}</h2>
              <p className="text-xl mb-8">{slide.subtitle}</p>
              <button className="bg-white text-pink-600 font-bold py-3 px-8 rounded-lg hover:bg-gray-100 transition-colors">
                Khám phá ngay
              </button>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Buttons */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/50 hover:bg-white/80 text-gray-800 p-2 rounded-full transition-colors z-10 text-2xl font-bold"
      >
        ❮
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/50 hover:bg-white/80 text-gray-800 p-2 rounded-full transition-colors z-10 text-2xl font-bold"
      >
        ❯
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === currentSlide ? 'bg-white' : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
