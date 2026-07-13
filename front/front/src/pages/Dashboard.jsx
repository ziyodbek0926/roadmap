import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Dashboard() {
  const [profile, setProfile] = useState(null);
  const [roadmap, setRoadmap] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('access_token');
      
      if (!token) {
        navigate('/login');
        return;
      }

      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      try {
        const profileRes = await axios.get('http://localhost:8000/dashboard/profile', config);
        setProfile(profileRes.data);

        const roadmapRes = await axios.get('http://localhost:8000/content/my-roadmap', config);
        setRoadmap(roadmapRes.data);
      } catch (error) {
        console.error("Xatolik yuz berdi!", error);
        
        if (error.response?.status === 401) {
          localStorage.removeItem('access_token');
          navigate('/login');
        } 
        else if (error.response?.status === 403) {
          setRoadmap([]);
        }
      } finally {
        setLoading(false);
      } 
    };

    fetchData();
  }, [navigate]);

  const markAsDone = async (lessonId) => {
    try {
      const token = localStorage.getItem('access_token');
      await axios.post(`http://localhost:8000/content/mark-done/${lessonId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Dars muvaffaqiyatli tugatildi!");
    } catch (err) {
      alert("Xatolik: Darsni belgilab bo'lmadi yoki allaqachon tugatilgan.");
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-[#F3F4F6] text-xl font-semibold text-[#A78BFA]">Yuklanmoqda...</div>;
  }

  return (
    <div className="min-h-screen bg-[#F3F4F6] py-10 px-4 font-sans text-[#374151]">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Yuqori qism: O'quvchi profili */}
        <div className="bg-white rounded-2xl shadow-sm p-6 flex items-center justify-between border-t-4 border-[#A78BFA]">
          <div>
            <h1 className="text-2xl font-bold mb-1">Salom, {profile?.o_quvchi.ism}! 👋</h1>
            <p className="text-gray-500 font-medium">Yo'nalish: <span className="text-[#A78BFA]">{profile?.biriktirilgan_yonalish}</span></p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-400 mb-1">O'zlashtirish (C)</div>
            <div className="text-3xl font-black text-[#6EE7B7]">
              {profile?.test_natijalari.length > 0 
                ? `${profile.test_natijalari[profile.test_natijalari.length - 1].c_koeffitsienti}%` 
                : '0%'}
            </div>
          </div>
        </div>

        {/* Asosiy qism: Roadmap (Yo'l xaritasi) */}
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <h2 className="text-xl font-bold mb-8 text-center">Sizning O'quv Yo'l Xaritangiz 🚀</h2>
          
          {roadmap.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-[#A78BFA] rounded-2xl bg-purple-50">
              <div className="text-4xl mb-4">🧭</div>
              <p className="mb-6 text-lg font-medium text-gray-600">Sizda hali yo'nalish yo'q. Qaysi kasb sizga mosligini aniqlaymizmi?</p>
              <button 
                onClick={() => navigate('/onboarding')}
                className="px-8 py-3 bg-[#A78BFA] hover:bg-[#8b5cf6] text-white font-bold rounded-xl shadow-md transition-all"
              >
                Onboarding testidan o'tish
              </button>
            </div>
          ) : (
            <div className="space-y-12">
              {roadmap.map((course) => (
                <div key={course.id}>
                  <h3 className="text-lg font-bold text-[#A78BFA] mb-6 bg-purple-50 p-3 rounded-lg inline-block">
                    {course.nom} ({course.daraja})
                  </h3>
                  
                  {/* Vertikal chiziq va Darslar */}
                  <div className="ml-4 md:ml-8 border-l-4 border-[#FDE047] space-y-8 relative">
                    {course.lessons.map((lesson, index) => (
                      <div key={lesson.id} className="relative pl-8 md:pl-12 group">
                        
                        {/* Dumaloq tugun (Node) */}
                        <div className="absolute -left-[14px] top-1 w-6 h-6 bg-white border-4 border-[#FDE047] rounded-full group-hover:scale-125 transition-transform duration-300 shadow-sm"></div>
                        
                        {/* Dars kartochkasi */}
                        <div className="bg-[#F3F4F6] p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                          <h4 className="font-bold text-lg mb-2">{index + 1}. {lesson.mavzu_nomi}</h4>
                          <div className="flex flex-wrap gap-3 mt-4">
                            {lesson.video_url && (
                              <a href={lesson.video_url} target="_blank" rel="noreferrer" className="text-sm px-4 py-2 bg-white rounded-lg font-medium text-gray-700 hover:text-[#A78BFA] shadow-sm">
                                🎬 Videoni ko'rish
                              </a>
                            )}
                            <button 
                              onClick={() => markAsDone(lesson.id)}
                              className="text-sm px-4 py-2 bg-[#6EE7B7] hover:bg-[#34d399] text-white rounded-lg font-medium shadow-sm transition-colors"
                            >
                              ✅ O'qib tugatdim
                            </button>
                          </div>
                        </div>

                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}