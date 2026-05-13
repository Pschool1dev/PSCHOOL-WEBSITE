import { useState } from 'react';
import { HiOutlineMail, HiOutlinePhone, HiOutlineLocationMarker } from 'react-icons/hi';

const ContactSection = () => {
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    telephone: '',
    sujet: '',
    message: ''
  });
  
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      console.log('Message envoyé:', formData);
      setSubmitted(true);
      setFormData({ nom: '', email: '', telephone: '', sujet: '', message: '' });
      setTimeout(() => setSubmitted(false), 5000);
    } catch (err) {
      setError('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-24 bg-white font-sans">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* En-tête de section */}
        <div className="mb-16">
          <div className="flex items-center gap-2 mb-4">
             <div className="w-10 h-[2px] bg-green-600"></div>
             <span className="text-green-600 font-black text-[10px] uppercase tracking-[0.3em]">Contactez-nous</span>
          </div>
          <h2 className="text-5xl font-black text-slate-700 leading-tight">
             Vouliez-vous nous parler d'un <span className=" text-green-700">Sujet ?</span>
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          
          {/* COLONNE GAUCHE : Formulaire */}
          <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-[0_30px_60px_rgba(0,0,0,0.03)]">
            {submitted && (
              <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-2xl text-sm font-bold border border-green-100 animate-bounce">
                 Message envoyé avec succès !
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-950 ml-2">Nom Complet</label>
                  <input
                    type="text"
                    name="nom"
                    required
                    value={formData.nom}
                    onChange={handleChange}
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:border-green-500 focus:bg-white transition-all text-sm font-medium"
                    placeholder="Votre nom et prenom"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-950 ml-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:border-green-500 focus:bg-white transition-all text-sm font-medium"
                    placeholder="Votre adresse mail"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-950 ml-2">Téléphone</label>
                <input
                  type="tel"
                  name="telephone"
                  required
                  value={formData.telephone}
                  onChange={handleChange}
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:border-green-500 focus:bg-white transition-all text-sm font-medium"
                  placeholder="Ex : +226 00 00 00 00"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-900 ml-2">Sujet</label>
                <input
                  type="text"
                  name="sujet"
                  required
                  value={formData.sujet}
                  onChange={handleChange}
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:border-green-500 focus:bg-white transition-all text-sm font-medium"
                  placeholder="Comment pouvons-nous vous aider ?"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-900 ml-2">Message</label>
                <textarea
                  name="message"
                  rows="4"
                  required
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:border-green-500 focus:bg-white transition-all text-sm font-medium resize-none"
                  placeholder="Décrivez votre besoin ici ..."
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-green-600 transition-all duration-300 shadow-xl shadow-slate-200 active:scale-95"
              >
                {loading ? 'Envoi...' : 'Envoyer le message'}
              </button>
            </form>
          </div>

          {/* COLONNE DROITE : Infos + Maps */}
          <div className="space-y-8">
            {/* Cards d'infos rapides */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                <HiOutlinePhone className="w-6 h-6 text-green-600 mb-3" />
                <p className="text-[10px] font-black uppercase text-slate-400 mb-1">Appelez-nous</p>
                <p className="text-sm font-black text-slate-900">+226 02 88 05 82 ou  </p>
                <p className="text-sm font-black text-slate-900"> +226 07 57 16 45 </p>
              </div>
              <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                <HiOutlineMail className="w-6 h-6 text-green-600 mb-3" />
                <p className="text-[10px] font-black uppercase text-slate-400 mb-1">Email</p>
                <p className="text-sm font-black text-slate-900">infos@pschool.pro</p>
              </div>
            </div>

            {/* Localisation & Maps */}
            <div className="bg-slate-900 rounded-[2.5rem] overflow-hidden p-2 shadow-2xl">
              <div className="p-6 flex items-start gap-4">
                <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center shrink-0">
                  <HiOutlineLocationMarker className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <p className="text-white font-black text-sm uppercase tracking-wider">secteur 53, Ouaga 2000,</p>
                  <p className="text-slate-400 text-xs mt-1">Boulevard Muammar Khadafi, Ouagadougou, Burkina Faso</p>
                </div>
              </div>
              
              {/* Iframe Google Maps avec style arrondi */}
              <div className="h-64 md:h-80 w-full rounded-[2rem] overflow-hidden">
                <iframe 
                  title="P.School Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3897.894746110535!2d-1.5022534251700728!3d12.322870787936061!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xe2ebd0c8acc045b%3A0x43f81f1a9af2130e!2sPROGRAMMING%20SCHOOL%20OUAGADOUGOU!5e0!3m2!1sfr!2sbf!4v1777542341593!5m2!1sfr!2sbf" 
                  className="w-full h-full grayscale-[0.2] contrast-[1.1]"
                  style={{ border: 0 }} 
                  allowFullScreen="" 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default ContactSection;