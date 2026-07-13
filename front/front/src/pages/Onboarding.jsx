import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Onboarding() {
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserId = async () => {
      const token = localStorage.getItem('access_token');
      try {
        const res = await axios.get('http://localhost:8000/dashboard/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUserId(res.data.o_quvchi.id);
      } catch (error) {
        navigate('/login');
      }
    };
    fetchUserId();
  }, [navigate]);

  const handleSubmit = async () => {
    try {
      await axios.post('http://localhost:8000/onboarding/submit', {
        user_id: userId,
        test_type: 'aptitude',
        tanlangan_yonalish_id: 1, 
        natija_bali: 85.0
      });
      
      alert("Tabriklaymiz! Sizga Qobiliyat testiga asosan yo'nalish biriktirildi. 🎉");
      navigate('/dashboard'); 
    } catch (err) {
      alert("Xatolik yuz berdi!");
    }
  };

  if (!userId) return <div className="min-h-screen bg-[#F3F4F6] flex justify-center items-center font-bold text-[#A78BFA]">Yuklanmoqda...</div>;

  return (
    <div className="min-h-screen bg-[#F3F4F6] flex items-center justify-center p-4 font-sans text-[#374151]">
      <div className="bg-white p-10 rounded-3xl shadow-sm max-w-lg w-full text-center border-t-4 border-[#FDE047]">
        <div className="text-5xl mb-4">🎯</div>
        <h1 className="text-2xl font-bold mb-4">Qobiliyatni Aniqlash Testi</h1>
        <p className="text-gray-500 mb-8 leading-relaxed">
          Sizga qaysi kasb (Dasturlash, Dizayn, SMM) ko'proq mos kelishini aniqlashimiz uchun, iltimos natijani tekshirish tugmasini bosing.
          <br/><br/>
          <span className="text-xs text-gray-400">(Hozircha vizual test qismi qo'shilmagan, tugma avtomatik 85 ball bilan sizni "Dasturlash"ga o'tkazadi).</span>
        </p>
        <button 
          onClick={handleSubmit}
          className="w-full py-4 bg-[#FDE047] hover:bg-[#facc15] text-[#374151] font-bold rounded-xl transition-colors shadow-sm"
        >
          Testni yakunlash va Yo'nalish olish
        </button>
      </div>
    </div>
  );
}