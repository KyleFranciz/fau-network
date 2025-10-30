import { useNavigate } from 'react-router';

export default function CTABanner() {
  const navigate = useNavigate();

  const handleJoinClick = () => {
    navigate('/signup');
  };

  return (
    <section className="-mb-16 z-20">
      <div className="container mx-auto border-2 border-black rounded-2xl">
        <div className="relative rounded-2xl bg-white p-12 md:p-16 overflow-hidden">
          {/* Grid pattern background */}
          <div 
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `
                linear-gradient(to right, currentColor 1px, transparent 1px),
                linear-gradient(to bottom, currentColor 1px, transparent 1px)
              `,
              backgroundSize: '40px 40px'
            }}
          />
          
          <div className="relative z-10 text-center">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-8 text-foreground leading-tight">
              JOIN EVENTS AND MEET SOME NEW PEOPLE<br />
              CONNECT WITH OTHER STUDENTS ON CAMPUS
            </h2>
            
            <button
              onClick={handleJoinClick}
              className="bg-foreground hover:bg-foreground/90 text-background px-8 py-3 rounded-lg font-semibold text-lg transition-colors duration-200"
            >
              JOIN NOW
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
