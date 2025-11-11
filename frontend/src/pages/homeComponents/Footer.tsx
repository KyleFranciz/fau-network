import { useNavigate } from 'react-router';

export default function Footer() {
  const navigate = useNavigate();

  return (
    <footer className="bg-foreground text-background">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 mt-10 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {/* Logo and Mission */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-2xl font-bold">NETWORK</h3>
            <p className="text-background/90 max-w-md">
              Our Mission is to help students around campus connect with likeminded individuals. 
              Got a hobby or passion that you would like to join in? Network aims to help you find 
              others you can connect with.
            </p>
          </div>
          
          {/* Navigation */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Navigation</h4>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => navigate('/')}
                  className="text-background/80 hover:text-background transition-colors"
                >
                  Home
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigate('/events')}
                  className="text-background/80 hover:text-background transition-colors"
                >
                  Event
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigate('/')}
                  className="text-background/80 hover:text-background transition-colors"
                >
                  About
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigate('/')}
                  className="text-background/80 hover:text-background transition-colors"
                >
                  Study
                </button>
              </li>
            </ul>
          </div>
          
          {/* Location/Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Location</h4>
            <ul className="space-y-2 text-background/80">
              <li>777 Glades Rd.<br />Boca Raton, FL 33431</li>
              <li>555 - 482 - 0824</li>
              <li>Network@thebomb.com</li>
            </ul>
            
            <div className="mt-6">
              <h4 className="text-lg font-semibold mb-4">Connect</h4>
              <ul className="space-y-2">
                <li>
                  <button className="text-background/80 hover:text-background transition-colors">
                    Contact
                  </button>
                </li>
                <li>
                  <button className="text-background/80 hover:text-background transition-colors">
                    Docs
                  </button>
                </li>
                <li>
                  <button className="text-background/80 hover:text-background transition-colors">
                    Github
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
