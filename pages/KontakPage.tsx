import React, { useState, useEffect } from 'react';
import { LocationIcon, EmailIcon, PhoneIcon, CheckCircleIcon, ChevronDownIcon, PaperAirplaneIcon, ExclamationCircleIcon } from '../components/icons';

const faqData = [
  {
    question: "Bagaimana cara bergabung dengan komunitas?",
    answer: "Anda dapat bergabung dengan mudah melalui halaman pendaftaran kami. Cukup isi formulir dengan data diri dan informasi bisnis Anda, lalu ikuti langkah selanjutnya yang akan kami kirimkan melalui email."
  },
  {
    question: "Apakah ada biaya untuk menjadi anggota?",
    answer: "Keanggotaan dasar di Komunitas UMKM Naik Kelas adalah gratis. Namun, kami juga menawarkan keanggotaan premium dengan benefit tambahan seperti akses ke event eksklusif dan sesi mentoring personal."
  },
  {
    question: "Event apa saja yang biasanya diadakan?",
    answer: "Kami secara rutin mengadakan berbagai event seperti webinar, workshop, sesi networking, dan kompetisi bisnis. Topik yang dibahas sangat beragam, mulai dari pemasaran digital, manajemen keuangan, hingga legalitas usaha."
  },
  {
    question: "Bagaimana saya bisa menjual produk di marketplace?",
    answer: "Setelah menjadi anggota terverifikasi, Anda akan mendapatkan akses ke dashboard marketplace. Dari sana, Anda bisa mengunggah produk, mengatur harga, dan mengelola pesanan. Tim kami akan memberikan panduan lengkapnya."
  },
  {
    question: "Siapa saja yang bisa menjadi mentor di komunitas ini?",
    answer: "Mentor kami adalah para praktisi dan ahli bisnis berpengalaman yang telah melalui proses seleksi. Jika Anda memiliki keahlian dan ingin berkontribusi, kami membuka program pendaftaran mentor secara berkala. Informasi lebih lanjut akan diumumkan di halaman Event."
  },
  {
    question: "Apakah data pribadi saya aman?",
    answer: "Kami sangat serius dalam menjaga privasi dan keamanan data Anda. Semua informasi pribadi dilindungi sesuai dengan kebijakan privasi kami dan tidak akan dibagikan kepada pihak ketiga tanpa persetujuan Anda. Platform kami menggunakan enkripsi standar industri untuk melindungi data Anda."
  },
  {
    question: "Bagaimana cara melaporkan konten atau pengguna yang tidak pantas?",
    answer: "Di setiap postingan forum atau profil pengguna, terdapat opsi 'Laporkan' (biasanya ikon titik tiga atau bendera). Gunakan fitur ini untuk memberi tahu tim moderator kami. Kami akan meninjau setiap laporan dengan serius untuk menjaga lingkungan komunitas yang positif dan aman."
  }
];


const KontakPage: React.FC = () => {
    const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

    useEffect(() => {
        const originalTitle = document.title;
        const descriptionTag = document.querySelector('meta[name="description"]');
        const originalDescription = descriptionTag?.getAttribute('content') || '';
        let keywordsTag = document.querySelector('meta[name="keywords"]');
        const originalKeywords = keywordsTag?.getAttribute('content') || '';
        const wasKeywordsTagMissing = !keywordsTag;

        document.title = 'Kontak & Support - Komunitas UMKM Naik Kelas';
        descriptionTag?.setAttribute('content', 'Hubungi kami untuk pertanyaan, dukungan, atau informasi lebih lanjut. Tim Komunitas UMKM Naik Kelas siap membantu Anda.');
        
        if (!keywordsTag) {
            keywordsTag = document.createElement('meta');
            keywordsTag.setAttribute('name', 'keywords');
            document.head.appendChild(keywordsTag);
        }
        keywordsTag.setAttribute('content', 'Kontak, Bantuan, Support, Hubungi Kami, FAQ');

        return () => {
            document.title = originalTitle;
            descriptionTag?.setAttribute('content', originalDescription);
            if (wasKeywordsTagMissing && keywordsTag) {
                keywordsTag.remove();
            } else if (keywordsTag) {
                keywordsTag.setAttribute('content', originalKeywords);
            }
        };
    }, []);

    const validateField = (name: string, value: string): string => {
        switch (name) {
            case 'name':
                return value.trim().length < 3 ? 'Nama lengkap wajib diisi (min. 3 karakter).' : '';
            case 'email':
                return !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? 'Format email tidak valid.' : '';
            case 'subject':
                return value.trim().length === 0 ? 'Subjek pesan wajib diisi.' : '';
            case 'message':
                return value.trim().length < 10 ? 'Pesan terlalu pendek (min. 10 karakter).' : '';
            default:
                return '';
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        
        // Validate immediately if already touched
        if (touched[name]) {
            setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
        }
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setTouched(prev => ({ ...prev, [name]: true }));
        setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validate all fields
        const newErrors: { [key: string]: string } = {};
        let isValid = true;
        
        Object.keys(formData).forEach(key => {
            const error = validateField(key, formData[key as keyof typeof formData]);
            if (error) {
                newErrors[key] = error;
                isValid = false;
            }
        });

        setErrors(newErrors);
        setTouched({ name: true, email: true, subject: true, message: true });

        if (isValid) {
            console.log("Form submitted:", formData);
            setIsSubmitted(true);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const toggleFaq = (index: number) => {
        setOpenFaqIndex(openFaqIndex === index ? null : index);
    };

    return (
        <div className="bg-white">
            {/* Header Section */}
            <section className="bg-white border-b">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900">Kontak & Support</h1>
                    <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                        Punya pertanyaan atau butuh bantuan? Kami siap membantu Anda.
                    </p>
                </div>
            </section>

            {/* Contact Info & Form Section */}
            <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid lg:grid-cols-3 gap-12">
                    {/* Left Side: Contact Info */}
                    <div className="space-y-8">
                        <ContactInfoCard
                            icon={<LocationIcon className="h-8 w-8 text-primary-600" />}
                            title="Alamat Kantor"
                            lines={['Jl. Jenderal Sudirman Kav. 52-53', 'Jakarta Selatan, Indonesia']}
                        />
                        <ContactInfoCard
                            icon={<EmailIcon className="h-8 w-8 text-primary-600" />}
                            title="Email"
                            lines={['support@umkmnaikkelas.id']}
                            link="mailto:support@umkmnaikkelas.id"
                        />
                         <ContactInfoCard
                            icon={<PhoneIcon className="h-8 w-8 text-primary-600" />}
                            title="Telepon"
                            lines={['+62 21 1234 567']}
                            link="tel:+62211234567"
                        />
                    </div>
                    {/* Right Side: Form */}
                    <div className="lg:col-span-2 bg-white p-8 rounded-2xl border border-gray-200 shadow-lg">
                        {isSubmitted ? (
                            <div className="text-center py-12 animate-fade-in-up">
                                <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-100 mb-6">
                                    <CheckCircleIcon className="h-12 w-12 text-green-600" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-800">Pesan Terkirim!</h3>
                                <p className="mt-2 text-gray-600 max-w-md mx-auto">
                                    Terima kasih telah menghubungi kami. Tim kami akan segera merespons pesan Anda ke email <strong>{formData.email}</strong>.
                                </p>
                                <button 
                                    onClick={() => {
                                        setIsSubmitted(false);
                                        setFormData({ name: '', email: '', subject: '', message: '' });
                                        setTouched({});
                                        setErrors({});
                                    }}
                                    className="mt-8 px-6 py-2 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-50 font-medium transition-colors"
                                >
                                    Kirim Pesan Lain
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} noValidate className="space-y-6">
                                <h2 className="text-2xl font-bold text-gray-800 mb-6">Kirim Pesan</h2>
                                <div className="grid sm:grid-cols-2 gap-6">
                                    <InputField 
                                        label="Nama Lengkap" 
                                        name="name" 
                                        value={formData.name} 
                                        onChange={handleChange} 
                                        onBlur={handleBlur}
                                        error={errors.name} 
                                        touched={touched.name}
                                        placeholder="Masukkan nama lengkap"
                                    />
                                    <InputField 
                                        label="Alamat Email" 
                                        name="email" 
                                        type="email" 
                                        value={formData.email} 
                                        onChange={handleChange} 
                                        onBlur={handleBlur}
                                        error={errors.email} 
                                        touched={touched.email}
                                        placeholder="nama@email.com"
                                    />
                                </div>
                                <InputField 
                                    label="Subjek" 
                                    name="subject" 
                                    value={formData.subject} 
                                    onChange={handleChange} 
                                    onBlur={handleBlur}
                                    error={errors.subject} 
                                    touched={touched.subject}
                                    placeholder="Apa yang ingin Anda tanyakan?"
                                />
                                <TextAreaField 
                                    label="Pesan Anda" 
                                    name="message" 
                                    value={formData.message} 
                                    onChange={handleChange} 
                                    onBlur={handleBlur}
                                    error={errors.message} 
                                    touched={touched.message}
                                    placeholder="Tuliskan detail pertanyaan atau masukan Anda..."
                                />
                                <div className="pt-4">
                                    <button 
                                        type="submit" 
                                        className="w-full sm:w-auto px-8 py-4 text-base font-bold text-white bg-primary-600 rounded-full shadow-lg hover:bg-primary-700 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-primary-300 transition-all transform hover:-translate-y-1 flex items-center justify-center group"
                                    >
                                        <span>Kirim Pesan</span>
                                        <PaperAirplaneIcon className="ml-3 h-5 w-5 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </section>
            
            {/* Map Section */}
            <section className="container mx-auto px-4 sm:px-6 lg:px-8 pb-16">
                 <div className="rounded-2xl overflow-hidden border border-gray-200 h-96 shadow-md">
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.333803108994!2d106.80482087596071!3d-6.219965860920405!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f143c08b417d%3A0x6288621ee1e6833a!2sPacific%20Century%20Place%2C%20Jakarta!5e0!3m2!1sen!2sid!4v1720516053364!5m2!1sen!2sid"
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen={false}
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Lokasi Kantor"
                    ></iframe>
                 </div>
            </section>


            {/* FAQ Section */}
            <section className="container mx-auto px-4 sm:px-6 lg:px-8 pb-20">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-extrabold text-gray-900">Pertanyaan Umum (FAQ)</h2>
                    <p className="mt-4 text-lg text-gray-600">Temukan jawaban cepat untuk pertanyaan populer.</p>
                </div>
                <div className="max-w-3xl mx-auto space-y-4">
                    {faqData.map((item, index) => (
                         <div 
                            key={index} 
                            className={`border rounded-xl transition-all duration-300 ${
                                openFaqIndex === index 
                                ? 'border-primary-200 bg-primary-50/30 shadow-sm' 
                                : 'border-gray-200 bg-white hover:border-primary-100 hover:bg-gray-50'
                            }`}
                         >
                            <button
                                onClick={() => toggleFaq(index)}
                                className="w-full flex justify-between items-center text-left p-5 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-inset rounded-xl"
                                aria-expanded={openFaqIndex === index}
                            >
                                <span className={`text-base md:text-lg font-semibold ${openFaqIndex === index ? 'text-primary-800' : 'text-gray-800'}`}>
                                    {item.question}
                                </span>
                                <ChevronDownIcon 
                                    className={`h-5 w-5 flex-shrink-0 transition-transform duration-300 ${
                                        openFaqIndex === index ? 'rotate-180 text-primary-600' : 'text-gray-400'
                                    }`} 
                                />
                            </button>
                            <div 
                                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                                    openFaqIndex === index ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                                }`}
                            >
                                <div className="p-5 pt-0 text-gray-600 leading-relaxed">
                                    {item.answer}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

// Helper Components for Form
const ContactInfoCard: React.FC<{ icon: React.ReactNode; title: string; lines: string[]; link?: string }> = ({ icon, title, lines, link }) => (
    <div className="bg-white p-6 rounded-xl border border-gray-200 flex items-start space-x-4 shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
        <div className="flex-shrink-0 w-12 h-12 bg-primary-50 rounded-full flex items-center justify-center border border-primary-100">{icon}</div>
        <div>
            <h3 className="text-lg font-bold text-gray-800">{title}</h3>
            {lines.map((line, i) =>
                link ? (
                    <a key={i} href={link} className="block mt-1 text-gray-600 hover:text-primary-600 transition-colors font-medium">{line}</a>
                ) : (
                    <p key={i} className="mt-1 text-gray-600">{line}</p>
                )
            )}
        </div>
    </div>
);

interface InputProps {
    label: string;
    name: string;
    type?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
    error?: string;
    touched?: boolean;
    placeholder?: string;
}

const InputField: React.FC<InputProps> = ({ label, name, type = 'text', value, onChange, onBlur, error, touched, placeholder }) => {
    const hasError = touched && !!error;
    
    return (
        <div>
            <label htmlFor={name} className="block text-sm font-semibold text-gray-700 mb-1">
                {label} <span className="text-red-500">*</span>
            </label>
            <div className="relative">
                <input 
                    type={type} 
                    id={name} 
                    name={name} 
                    value={value} 
                    onChange={onChange} 
                    onBlur={onBlur}
                    placeholder={placeholder}
                    className={`block w-full px-4 py-3 rounded-lg shadow-sm border focus:ring-2 focus:ring-offset-0 transition-colors bg-white ${
                        hasError 
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-200 text-red-900 placeholder-red-300' 
                        : 'border-gray-300 focus:border-primary-500 focus:ring-primary-200 text-gray-900'
                    }`} 
                    aria-invalid={hasError}
                    aria-describedby={hasError ? `${name}-error` : undefined}
                />
                {hasError && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <ExclamationCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
                    </div>
                )}
            </div>
            {hasError && <p className="mt-1 text-xs text-red-600 font-medium flex items-center" id={`${name}-error`}>{error}</p>}
        </div>
    );
};

interface TextAreaProps {
    label: string;
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    onBlur: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
    error?: string;
    touched?: boolean;
    placeholder?: string;
}

const TextAreaField: React.FC<TextAreaProps> = ({ label, name, value, onChange, onBlur, error, touched, placeholder }) => {
    const hasError = touched && !!error;

    return (
        <div>
            <label htmlFor={name} className="block text-sm font-semibold text-gray-700 mb-1">
                {label} <span className="text-red-500">*</span>
            </label>
            <div className="relative">
                <textarea 
                    id={name} 
                    name={name} 
                    rows={5} 
                    value={value} 
                    onChange={onChange}
                    onBlur={onBlur} 
                    placeholder={placeholder}
                    className={`block w-full px-4 py-3 rounded-lg shadow-sm border focus:ring-2 focus:ring-offset-0 transition-colors bg-white ${
                        hasError 
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-200 text-red-900 placeholder-red-300' 
                        : 'border-gray-300 focus:border-primary-500 focus:ring-primary-200 text-gray-900'
                    }`} 
                    aria-invalid={hasError}
                    aria-describedby={hasError ? `${name}-error` : undefined}
                />
                {hasError && (
                    <div className="absolute top-3 right-3 flex items-center pointer-events-none">
                        <ExclamationCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
                    </div>
                )}
            </div>
            {hasError && <p className="mt-1 text-xs text-red-600 font-medium" id={`${name}-error`}>{error}</p>}
        </div>
    );
};

export default KontakPage;