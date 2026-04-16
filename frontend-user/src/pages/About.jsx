export default function About() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Về STU Book</h1>

        {/* Hero Section */}
        <div className="bg-gradient-to-r from-pink-500 to-orange-400 rounded-lg p-12 text-white mb-12">
          <h2 className="text-3xl font-bold mb-4">Cửa hàng sách online hàng đầu Việt Nam</h2>
          <p className="text-xl">
            STU Book là điểm đến tin cậy cho mọi người yêu thích đọc sách
          </p>
        </div>

        {/* Mission Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-lg shadow-md p-8">
            <h3 className="text-2xl font-bold mb-4 text-pink-600">Sứ mệnh của chúng tôi</h3>
            <p className="text-gray-700 leading-relaxed">
              Mục tiêu của STU Book là cung cấp hàng ngàn cuốn sách từ các nhà xuất bản nổi tiếng,
              với giá cả hợp lý và dịch vụ giao hàng nhanh chóng. Chúng tôi muốn mọi người có cơ hội
              tiếp cận với tri thức thông qua việc đọc sách.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-8">
            <h3 className="text-2xl font-bold mb-4 text-pink-600">Tại sao chọn STU?</h3>
            <ul className="space-y-3">
              <li className="flex gap-3">
                <span className="text-2xl">📚</span>
                <span>Hàng ngàn cuốn sách được lựa chọn</span>
              </li>
              <li className="flex gap-3">
                <span className="text-2xl">💰</span>
                <span>Giá cả cạnh tranh, giảm giá thường xuyên</span>
              </li>
              <li className="flex gap-3">
                <span className="text-2xl">🚚</span>
                <span>Vận chuyển nhanh trên toàn quốc</span>
              </li>
              <li className="flex gap-3">
                <span className="text-2xl">✅</span>
                <span>Đảm bảo chất lượng 100%</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="text-4xl font-bold text-pink-600 mb-2">50K+</div>
            <p className="text-gray-700">Khách hàng hài lòng</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="text-4xl font-bold text-pink-600 mb-2">10K+</div>
            <p className="text-gray-700">Cuốn sách</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="text-4xl font-bold text-pink-600 mb-2">500+</div>
            <p className="text-gray-700">Nhà xuất bản</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="text-4xl font-bold text-pink-600 mb-2">100K+</div>
            <p className="text-gray-700">Đơn hàng</p>
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-8 text-center">Những giá trị cơ bản</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: 'Chất lượng',
                description: 'Chúng tôi chỉ cung cấp những cuốn sách chất lượng cao từ các nhà xuất bản uy tín.'
              },
              {
                title: 'Giá cả công bằng',
                description: 'Mang đến cho khách hàng những giá cả tốt nhất trên thị trường.'
              },
              {
                title: 'Dịch vụ tuyệt vời',
                description: 'Đội ngũ chăm sóc khách hàng luôn sẵn sàng hỗ trợ 24/7.'
              }
            ].map((value, idx) => (
              <div key={idx} className="bg-white rounded-lg shadow-md p-8 text-center">
                <div className="text-5xl mb-4">{idx === 0 ? '⭐' : idx === 1 ? '💵' : '🎯'}</div>
                <h3 className="text-xl font-bold mb-2">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
